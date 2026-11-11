# DINESH ONLINE SOLUTION
### *Your True Digital Companion*

---

A complete, production-grade digital citizen service centre web platform built with modern **HTML5, CSS3, Vanilla JavaScript (ES6+)**, and powered by **Firebase** and **Razorpay**.

The platform enables citizens to access PAN card applications, Aadhaar assistance, utility bill payments (Electricity, Water, Gas, LPG), online exam and admission form filling, government schemes, verified e-District certificates, printing, scanning, and PDF document services.

---

## 1. PROJECT HIGHLIGHTS & ARCHITECTURE

- **Strict Vanilla Frontend**: Clean separation between semantic HTML, modular CSS stylesheets, and modular ES6+ JavaScript. No bulky frameworks (React, Next.js, Vue) required.
- **Dual Language Support (English & हिन्दी)**: Dynamic switching between English (`Inter` & `Manrope`) and Hindi (`Noto Sans Devanagari`) with persistent preferences.
- **Complete Customer Portal**: PIN-based authentication with temporary rate-limit lockouts, instant application booking, document vault, visual application progress timelines, and downloadable official tax receipts.
- **Dedicated Operator & Admin Console**: Super-administrator control centre with verified revenue vs. pass-through fee separation, customer moderation, real-time application status changer, dynamic pricing management, and CSV revenue report export.
- **Firebase Backend**:
  - Firebase Authentication (Phone OTP & Custom Auth Tokens)
  - Firebase Firestore (Role-based secure access for collections)
  - Firebase Cloud Storage (Private customer identity vaults restricted to 5MB PDF/JPG/PNG)
  - Firebase Cloud Functions (Server-side price validation, Razorpay order generation, HMAC-SHA256 signature verification, and bcrypt PIN hashing)
- **Zero-Failure Interactive Fallback**: Contains an automated local store engine with preloaded demonstration records. The application runs immediately in any browser and transitions seamlessly to live Firebase when credentials are provided in `js/config/firebase-config.js`.

---

## 2. PROJECT FOLDER STRUCTURE

```
DINESH-ONLINE-SOLUTION/
│
├── index.html                    # Public homepage with hero, popular services & contact
├── 404.html                      # Branded error page
├── firebase.json                 # Firebase Hosting, Firestore, Storage & Functions config
├── firestore.rules               # Role-based Firestore security rules
├── storage.rules                 # File upload & document privacy security rules
├── firestore.indexes.json        # Database indexing specifications
├── README.md                     # Comprehensive documentation & deployment guide
│
├── pages/
│   ├── services.html             # Full service catalogue with search & category filters
│   ├── about.html                # About the organisation & regulatory notices
│   ├── contact.html              # Support queries, direct contact details, FAQ & policies
│   ├── login.html                # Customer mobile & 4-digit PIN login
│   ├── register.html             # Customer signup with PIN creation & validation
│   ├── forgot-pin.html           # SMS OTP verification & PIN reset workflow
│   ├── customer-dashboard.html   # Main citizen panel with statistics & recent orders
│   ├── my-applications.html      # Application lifecycle tracking & timeline modals
│   ├── payment-history.html      # Transaction ledger & printable tax receipts
│   ├── profile.html              # Customer profile management, PIN change & document vault
│   ├── admin-login.html          # Protected operator & administrator login
│   ├── admin-dashboard.html      # Operational control centre & visual analytics
│   ├── admin-customers.html      # Citizen search, history inspector & account toggle
│   ├── admin-services.html       # Dynamic pricing, facilitation vs government fee editor
│   ├── admin-applications.html   # Application scrutiny desk, status changer & remarks
│   ├── admin-payments.html       # Audited financial ledger & CSV export
│   ├── admin-support.html        # Citizen support query management
│   └── admin-settings.html       # Business hours, helpline & homepage announcement editor
│
├── assets/
│   ├── images/
│   │   ├── logo.svg              # Official vector brand logo
│   │   ├── hero-image.svg        # Clean digital portal illustration
│   │   └── about-image.svg       # Centre credentials & statistics graphic
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── global.css                # Global CSS reset, CSS custom properties & design tokens
│   ├── typography.css            # Responsive font system (clamp), Inter & Manrope stacks
│   ├── components.css            # Buttons, cards, modals, toast alerts, timelined steppers
│   ├── navbar.css                # Sticky navigation, language switcher & mobile drawer
│   ├── footer.css                # Statutory disclaimer, quick links & WhatsApp float
│   ├── homepage.css              # Hero section, feature grids & service showcase styles
│   ├── services.css              # Search bars, category pills & booking upload dropzones
│   ├── authentication.css        # Focused authentication cards & PIN box styling
│   ├── customer-dashboard.css    # Sidebar dashboard layouts & statistics cards
│   ├── admin-dashboard.css       # Dark-mode inspired operator console & bar charts
│   ├── responsive.css            # Mobile-first breakpoints (1024px, 768px, 480px)
│   └── animations.css            # Smooth micro-interactions & skeleton loading shimmers
│
├── js/
│   ├── config/
│   │   └── firebase-config.js    # Firebase SDK credentials & live status detection
│   │
│   ├── core/
│   │   ├── app.js                # Global header logic, language toggles & icon init
│   │   ├── auth-guard.js         # Customer session route protector
│   │   ├── admin-guard.js        # Administrator privilege route protector
│   │   ├── notifications.js      # Toast notifications & confirmation dialogs
│   │   ├── utilities.js          # Currency formatting (INR), date formatting & ID generators
│   │   └── validation.js         # Indian mobile, PIN, PAN, Aadhaar & file size checks
│   │
│   ├── auth/
│   │   ├── register.js           # Citizen signup validation & credential hashing
│   │   ├── login.js              # Rate-limited PIN verification & lockout countdown
│   │   ├── pin-management.js     # OTP reset flow & profile PIN change
│   │   └── session.js            # Secure token handling & lockout persistence
│   │
│   ├── customer/
│   │   ├── dashboard.js          # Customer KPI metric counters & recent table render
│   │   ├── booking.js            # Application modal, document upload & Razorpay initiation
│   │   ├── applications.js       # Searchable applications list & progress timelines
│   │   ├── document-upload.js    # Private document vault management
│   │   ├── payment-history.js    # Customer payment ledger
│   │   └── profile.js            # Personal profile editing & PIN updates
│   │
│   ├── admin/
│   │   ├── dashboard.js          # Revenue split counters & operational statistics
│   │   ├── customers.js          # Customer management & suspension toggle
│   │   ├── services.js           # Dynamic service catalogue & price editor
│   │   ├── applications.js       # Application status updater & operator remarks
│   │   ├── payments.js           # Audited financial ledger & CSV report generator
│   │   ├── support.js            # Support ticket desk
│   │   └── settings.js           # Business contact details & portal announcements
│   │
│   ├── services/
│   │   ├── service-list.js       # Complete 40+ service catalogue dataset
│   │   ├── service-details.js    # Service details modal & transparent fee breakdown
│   │   └── service-search.js     # Real-time search & category pill filtering
│   │
│   ├── payments/
│   │   ├── razorpay.js           # Razorpay Checkout & client verification simulator
│   │   └── receipts.js           # Printable official tax e-receipt generator
│   │
│   └── i18n/
│       └── translations.js       # Complete English & Hindi (हिन्दी) dictionary
│
└── functions/
    ├── index.js                  # Cloud Functions: Razorpay orders, HMAC-SHA256 signature verification & PIN bcrypt
    └── package.json              # Node.js backend dependencies
```

---

## 3. COLOR PALETTE & DESIGN SYSTEM

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Primary Navy** | `#123B72` | Main brand headings, sidebar headers, dark badges |
| **Royal Blue** | `#2563EB` | Primary action buttons, active tabs, interactive links |
| **Accent Orange** | `#F59E0B` | Taglines, highlight badges, priority notifications |
| **Background Main** | `#F5F7FB` | Main website background for crisp readability |
| **Card Background** | `#FFFFFF` | Surface containers with subtle elevation |
| **Main Text** | `#172033` | High-contrast body typography |
| **Secondary Text**| `#64748B` | Subtle descriptions, timestamps, metadata |
| **Success Green** | `#16A34A` | Verified statuses, payment success, completed steps |
| **Error Red** | `#DC2626` | Validation errors, rejected applications, lockouts |

---

## 4. TYPOGRAPHY SYSTEM

Loaded via Google Fonts:
- **Primary Body Font**: `Inter` (Weights: 400, 500, 600, 700)
- **Secondary Heading Font**: `Manrope` (Weights: 600, 700, 800)
- **Hindi Typography Font**: `Noto Sans Devanagari` (Weights: 400, 500, 600, 700)

Using CSS responsive clamps:
- Hero Headings: `clamp(2.25rem, 4vw + 1rem, 3.5rem)` (44px–56px)
- Section Titles: `clamp(1.75rem, 2.5vw + 0.75rem, 2.25rem)` (28px–36px)
- Card Headings: `clamp(1.0625rem, 0.5vw + 0.95rem, 1.25rem)` (17px–20px)
- Body Text: `clamp(0.875rem, 0.25vw + 0.825rem, 1rem)` (14px–16px)

---

## 5. DEFAULT TEST CREDENTIALS & DEMO ACCESS

### Customer Login
- **Mobile**: `9876543210`
- **PIN**: `1234`
*(Or create any new account on `pages/register.html`)*

### Administrator Portal
- **URL**: `pages/admin-login.html`
- **Email**: `admin@dineshonline.in`
- **Password**: `Admin@2026`

---

## 6. PRODUCTION FIREBASE SETUP INSTRUCTIONS

### Step 1: Create Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `dinesh-online-solution`.
3. Enable **Authentication** -> Turn on **Phone** and **Email/Password**.
4. Enable **Cloud Firestore** in Production mode.
5. Enable **Cloud Storage** in Production mode.

### Step 2: Configure Web App Credentials
Open `js/config/firebase-config.js` and replace the placeholder keys with your Firebase Web configuration:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_FIREBASE_API_KEY",
  authDomain: "dinesh-online-solution.firebaseapp.com",
  projectId: "dinesh-online-solution",
  storageBucket: "dinesh-online-solution.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Deploy Security Rules & Cloud Functions
Install the Firebase CLI and deploy:
```bash
npm install -g firebase-tools
firebase login
firebase use dinesh-online-solution

# Deploy Firestore rules & storage rules
firebase deploy --only firestore:rules,storage

# Configure Razorpay secrets in Cloud Functions
firebase functions:config:set razorpay.key_id="rzp_live_YOUR_KEY" razorpay.key_secret="YOUR_SECRET"

# Deploy Cloud Functions & Hosting
cd functions && npm install && cd ..
firebase deploy
```

---

## 7. RAZORPAY PAYMENT GATEWAY INTEGRATION

1. Register on [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Generate API Keys in **Settings -> API Keys**.
3. Place your public Key ID in `js/config/firebase-config.js`:
   ```javascript
   razorpayKeyId: "rzp_live_xxxxxxxxxxxx"
   ```
4. Place your Key Secret in Firebase Functions environment configuration:
   ```bash
   firebase functions:config:set razorpay.key_id="rzp_live_xxxxxxxxxxxx" razorpay.key_secret="YOUR_SECRET"
   ```
5. All transactions are server-verified through Cloud Function `verifyPaymentSignature` using HMAC-SHA256 hash checks before changing application payment status to `Paid`.

---

## 8. STATUTORY & REGULATORY COMPLIANCE

Dinesh Online Solution strictly adheres to consumer protection and transparency norms:
- **Zero Hidden Costs**: Government statutory fees (e.g. ₹107 for PAN, ₹20 for eDistrict certificates) are displayed distinctly from operator facilitation fees.
- **Clear Disclaimers**: No false claims of direct government affiliation or authority. All materials explicitly declare independent facilitation centre status.
- **Official Receipts**: Instant tax / e-receipts are produced with timestamped transaction identifiers and application tracking codes.

