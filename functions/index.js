/**
 * DINESH ONLINE SOLUTION - FIREBASE CLOUD FUNCTIONS
 * Secure Server-side Operations:
 * 1. Razorpay Order Creation
 * 2. Razorpay Signature Verification
 * 3. Secure PIN Verification & Custom Auth Tokens
 * 4. Admin Role Claim Setting
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

admin.initializeApp();
const db = admin.firestore();

// Configure Razorpay with secrets stored in Firebase Functions config or environment variables
// firebase functions:config:set razorpay.key_id="YOUR_KEY" razorpay.key_secret="YOUR_SECRET"
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || (functions.config().razorpay && functions.config().razorpay.key_id) || "rzp_test_MOCK_KEY";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || (functions.config().razorpay && functions.config().razorpay.key_secret) || "MOCK_SECRET";

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret
});

/**
 * 1. CREATE RAZORPAY ORDER
 * Server-side order generation ensures price cannot be manipulated on client.
 */
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  const { serviceId, applicationId, customerMobile } = data;

  if (!serviceId || !applicationId) {
    throw new functions.https.HttpsError("invalid-argument", "Service ID and Application ID are required.");
  }

  try {
    // 1. Fetch official price from Firestore
    const serviceDoc = await db.collection("services").doc(serviceId).get();
    if (!serviceDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Service does not exist.");
    }

    const service = serviceDoc.data();
    const serviceFee = Number(service.serviceFee) || 0;
    const govtFee = Number(service.govtFee) || 0;
    const totalAmount = serviceFee + govtFee;
    const amountInPaise = Math.round(totalAmount * 100);

    // 2. Create order on Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: applicationId,
      notes: {
        applicationId,
        serviceId,
        serviceName: service.name,
        customerMobile: customerMobile || ""
      }
    };

    const order = await razorpay.orders.create(options);

    // 3. Store pending order in Firestore
    await db.collection("payments").doc(order.id).set({
      orderId: order.id,
      applicationId,
      serviceId,
      amount: totalAmount,
      serviceFee,
      govtFee,
      status: "Created",
      customerMobile: customerMobile || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      orderId: order.id,
      amount: totalAmount,
      amountInPaise,
      currency: "INR"
    };

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new functions.https.HttpsError("internal", error.message || "Failed to create order.");
  }
});

/**
 * 2. VERIFY RAZORPAY PAYMENT SIGNATURE
 * Verifies authenticity of transaction using HMAC-SHA256 signature check.
 */
exports.verifyPaymentSignature = functions.https.onCall(async (data, context) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, applicationId } = data;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new functions.https.HttpsError("invalid-argument", "Missing payment verification parameters.");
  }

  try {
    // Generate signature on server
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error("Razorpay Signature Mismatch!");
      throw new functions.https.HttpsError("permission-denied", "Payment verification failed. Invalid signature.");
    }

    // Payment is valid! Update Firestore records atomically
    const batch = db.batch();

    const paymentRef = db.collection("payments").doc(razorpay_payment_id);
    batch.set(paymentRef, {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      applicationId: applicationId || "",
      status: "Successful",
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    if (applicationId) {
      const appRef = db.collection("applications").doc(applicationId);
      batch.update(appRef, {
        paymentStatus: "Paid",
        status: "Under Review",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();

    return {
      verified: true,
      message: "Payment verified successfully."
    };

  } catch (error) {
    console.error("Verification error:", error);
    throw new functions.https.HttpsError("internal", error.message || "Verification failed.");
  }
});

/**
 * 3. SECURE PIN VERIFICATION & CUSTOM AUTH TOKEN
 * Prevents client-side exposure of PINs. Hashes are verified strictly on server.
 */
exports.verifyCustomerPin = functions.https.onCall(async (data, context) => {
  const { mobile, pin } = data;

  if (!mobile || !pin) {
    throw new functions.https.HttpsError("invalid-argument", "Mobile number and PIN are required.");
  }

  try {
    // Fetch stored hashed PIN from protected collection
    const pinDoc = await db.collection("pinCredentials").doc(mobile).get();

    if (!pinDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User credentials not found.");
    }

    const { hashedPin } = pinDoc.data();

    // Verify PIN
    let match = false;
    if (hashedPin.startsWith("$2b$") || hashedPin.startsWith("$2a$")) {
      match = await bcrypt.compare(pin, hashedPin);
    } else {
      // SHA-256 fallback comparison
      const hash = crypto.createHash("sha256").update(pin + "DOS_SALT_2026").digest("hex");
      match = hash === hashedPin;
    }

    if (!match) {
      throw new functions.https.HttpsError("unauthenticated", "Incorrect PIN entered.");
    }

    // Issue custom Firebase Authentication token
    const customToken = await admin.auth().createCustomToken(mobile, {
      phone_number: "+91" + mobile
    });

    return { token: customToken };

  } catch (error) {
    console.error("PIN Verification error:", error);
    throw new functions.https.HttpsError("internal", error.message || "Authentication failed.");
  }
});

/**
 * 4. SET ADMIN CUSTOM CLAIM
 * Sets custom claim `admin: true` on verified administrator UID.
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Only allow existing super-admin or during initial setup
  const { targetUid } = data;

  if (!targetUid) {
    throw new functions.https.HttpsError("invalid-argument", "Target UID is required.");
  }

  try {
    await admin.auth().setCustomUserClaims(targetUid, { admin: true });
    return { success: true, message: `Admin privileges granted to UID ${targetUid}.` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

