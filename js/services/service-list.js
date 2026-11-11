/**
 * DINESH ONLINE SOLUTION - SERVICE CATALOG DATABASE & MANAGER
 * Complete directory of digital services, pricing & documentation checklists
 */

const DEFAULT_SERVICES = [
  // PAN Services
  {
    id: "pan-new",
    name: "New PAN Card Application",
    category: "PAN Services",
    icon: "credit-card",
    description: "Assistance with new PAN card application (Form 49A) for Indian citizens.",
    serviceFee: 150,
    govtFee: 107,
    totalPrice: 257,
    requiredDocs: ["Aadhaar Card", "Passport Size Photograph", "Signature"],
    popular: true
  },
  {
    id: "pan-correction",
    name: "PAN Card Correction / Update",
    category: "PAN Services",
    icon: "file-edit",
    description: "Correction of name, date of birth, father's name or address on existing PAN card.",
    serviceFee: 200,
    govtFee: 107,
    totalPrice: 307,
    requiredDocs: ["Existing PAN Copy", "Aadhaar Card", "Proof of Correction", "Passport Photo"],
    popular: true
  },
  {
    id: "pan-reprint",
    name: "PAN Card Reprint / Duplicate",
    category: "PAN Services",
    icon: "copy",
    description: "Re-issue a lost, damaged, or mutilated physical PAN card.",
    serviceFee: 100,
    govtFee: 50,
    totalPrice: 150,
    requiredDocs: ["PAN Number", "Aadhaar Card"],
    popular: false
  },
  {
    id: "pan-status",
    name: "PAN Status Assistance",
    category: "PAN Services",
    icon: "search",
    description: "Instant tracking of pending PAN application using acknowledgement number.",
    serviceFee: 30,
    govtFee: 0,
    totalPrice: 30,
    requiredDocs: ["15-digit Acknowledgement Number"],
    popular: false
  },

  // Aadhaar Assistance
  {
    id: "aadhaar-update",
    name: "Aadhaar Update Guidance",
    category: "Aadhaar Assistance",
    icon: "user-check",
    description: "Documentation guidance and form preparation for demographic Aadhaar updates.",
    serviceFee: 50,
    govtFee: 50,
    totalPrice: 100,
    requiredDocs: ["Aadhaar Number", "Supporting Identity/Address Proof"],
    popular: true
  },
  {
    id: "aadhaar-download",
    name: "Aadhaar Download Assistance",
    category: "Aadhaar Assistance",
    icon: "download",
    description: "Assistance with e-Aadhaar verification and secure PDF printout with mask option.",
    serviceFee: 30,
    govtFee: 0,
    totalPrice: 30,
    requiredDocs: ["Aadhaar Number", "Registered Mobile for OTP"],
    popular: true
  },
  {
    id: "aadhaar-pvc",
    name: "Aadhaar PVC Order Assistance",
    category: "Aadhaar Assistance",
    icon: "shield-check",
    description: "Order durable, pocket-sized official UIDAI PVC card delivered to doorstep.",
    serviceFee: 100,
    govtFee: 50,
    totalPrice: 150,
    requiredDocs: ["Aadhaar Number", "Mobile OTP"],
    popular: true
  },
  {
    id: "aadhaar-appointment",
    name: "Aadhaar Appointment Assistance",
    category: "Aadhaar Assistance",
    icon: "calendar",
    description: "Book priority slots at nearest UIDAI Aadhaar Seva Kendra.",
    serviceFee: 50,
    govtFee: 0,
    totalPrice: 50,
    requiredDocs: ["Aadhaar Number", "Preferred Date & Time"],
    popular: false
  },

  // Recharge & Bill Payments
  {
    id: "bill-electricity",
    name: "Electricity Bill Payment",
    category: "Recharge & Bill Payments",
    icon: "zap",
    description: "Instant bill settlement for UPPCL and all major state electricity boards.",
    serviceFee: 20,
    govtFee: 0,
    totalPrice: 20,
    requiredDocs: ["Consumer Number / Account ID", "Bill Copy (Optional)"],
    popular: true
  },
  {
    id: "recharge-mobile",
    name: "Mobile & DTH Recharge",
    category: "Recharge & Bill Payments",
    icon: "smartphone",
    description: "Prepaid and postpaid recharge for Jio, Airtel, Vi, BSNL, Tata Play, etc.",
    serviceFee: 10,
    govtFee: 0,
    totalPrice: 10,
    requiredDocs: ["Mobile / Subscriber Number", "Selected Plan"],
    popular: true
  },
  {
    id: "bill-water",
    name: "Water Bill Payment",
    category: "Recharge & Bill Payments",
    icon: "droplet",
    description: "Municipal water board bill clearance and verification receipts.",
    serviceFee: 25,
    govtFee: 0,
    totalPrice: 25,
    requiredDocs: ["Consumer / K-Number"],
    popular: false
  },
  {
    id: "bill-gas",
    name: "Piped Gas Bill Payment",
    category: "Recharge & Bill Payments",
    icon: "flame",
    description: "Piped natural gas (PNG) bill payments for IGL, Torrent, Adani, etc.",
    serviceFee: 25,
    govtFee: 0,
    totalPrice: 25,
    requiredDocs: ["Customer Relationship Number"],
    popular: false
  },
  {
    id: "lpg-cylinder",
    name: "LPG Cylinder Booking Assistance",
    category: "Recharge & Bill Payments",
    icon: "package",
    description: "Instant refilling booking for Indane, Bharat Gas and HP Gas.",
    serviceFee: 30,
    govtFee: 0,
    totalPrice: 30,
    requiredDocs: ["Consumer ID or Registered Phone"],
    popular: false
  },

  // Online Form Filling
  {
    id: "form-govt-job",
    name: "Government Job Application",
    category: "Online Form Filling",
    icon: "briefcase",
    description: "Form submission for UPSC, SSC, UPSSSC, Railway, Police, Teaching & Defence.",
    serviceFee: 100,
    govtFee: 0,
    totalPrice: 100,
    requiredDocs: ["Educational Certificates", "Photo & Signature", "Category/Caste Certificate"],
    popular: true
  },
  {
    id: "form-college",
    name: "College & University Admission",
    category: "Online Form Filling",
    icon: "graduation-cap",
    description: "University portals, counselling registration and seat allotment forms.",
    serviceFee: 100,
    govtFee: 0,
    totalPrice: 100,
    requiredDocs: ["Marksheets", "Transfer Certificate", "ID Proof", "Photo"],
    popular: false
  },
  {
    id: "form-scholarship",
    name: "Scholarship Application",
    category: "Online Form Filling",
    icon: "award",
    description: "UP Post-Matric, Pre-Matric and National Scholarship Portal (NSP) filing.",
    serviceFee: 100,
    govtFee: 0,
    totalPrice: 100,
    requiredDocs: ["Income Certificate", "Caste Certificate", "Fee Receipt", "Bank Passbook"],
    popular: true
  },
  {
    id: "form-exam",
    name: "Competitive Examination Form",
    category: "Online Form Filling",
    icon: "file-check",
    description: "Registration for NEET, JEE, CUET, CTET, UPTET, NDA and CDS.",
    serviceFee: 150,
    govtFee: 0,
    totalPrice: 150,
    requiredDocs: ["Photo (correct dimensions)", "Signature", "Marksheet"],
    popular: true
  },

  // Certificate Assistance
  {
    id: "cert-income",
    name: "Income Certificate (आय प्रमाण पत्र)",
    category: "Certificate Assistance",
    icon: "file-text",
    description: "E-District UP verified income certificate filing and follow-up.",
    serviceFee: 100,
    govtFee: 20,
    totalPrice: 120,
    requiredDocs: ["Aadhaar Card", "Ration Card or Parivar Register", "Self Declaration", "Photo"],
    popular: true
  },
  {
    id: "cert-caste",
    name: "Caste Certificate (जाति प्रमाण पत्र)",
    category: "Certificate Assistance",
    icon: "award",
    description: "OBC, SC, ST and EWS caste certificate application on eDistrict portal.",
    serviceFee: 100,
    govtFee: 20,
    totalPrice: 120,
    requiredDocs: ["Aadhaar Card", "Father's Caste Proof", "Photo", "Self Declaration"],
    popular: true
  },
  {
    id: "cert-residence",
    name: "Residential Certificate (निवास प्रमाण पत्र)",
    category: "Certificate Assistance",
    icon: "home",
    description: "Official Domicile / Niwas Praman Patra submission & verification.",
    serviceFee: 100,
    govtFee: 20,
    totalPrice: 120,
    requiredDocs: ["Aadhaar Card", "Electricity Bill / House Tax", "Photo"],
    popular: true
  },
  {
    id: "cert-birth",
    name: "Birth Certificate Assistance",
    category: "Certificate Assistance",
    icon: "baby",
    description: "CRS portal registration assistance for new and delayed birth certificates.",
    serviceFee: 100,
    govtFee: 20,
    totalPrice: 120,
    requiredDocs: ["Hospital Discharge Slip", "Parents' Aadhaar Cards"],
    popular: false
  },

  // Government Schemes
  {
    id: "scheme-pension",
    name: "Pension Scheme Assistance",
    category: "Government Schemes",
    icon: "users",
    description: "Old Age (वृद्धावस्था), Widow (विधवा) and Disability (दिव्यांग) pension forms.",
    serviceFee: 100,
    govtFee: 0,
    totalPrice: 100,
    requiredDocs: ["Aadhaar Card", "Bank Passbook", "Income Certificate", "Age Proof"],
    popular: true
  },
  {
    id: "scheme-kisan",
    name: "PM-Kisan Samman Nidhi Assistance",
    category: "Government Schemes",
    icon: "sprout",
    description: "New farmer registration, eKYC completion, and land seeding corrections.",
    serviceFee: 80,
    govtFee: 0,
    totalPrice: 80,
    requiredDocs: ["Khatauni (Land Record)", "Aadhaar Card", "Bank Passbook"],
    popular: true
  },

  // Printing, Scanning & PDF
  {
    id: "print-pdf",
    name: "Printing, Scanning & PDF Services",
    category: "Printing, Scanning & PDF",
    icon: "printer",
    description: "High-res B&W and colour prints, PDF merge, compression and photo resizing.",
    serviceFee: 20,
    govtFee: 0,
    totalPrice: 20,
    requiredDocs: ["Document File / Image"],
    popular: false
  },

  // Online Applications & Downloads
  {
    id: "app-admit-card",
    name: "Admit Card & Result Download",
    category: "Online Applications",
    icon: "download-cloud",
    description: "Instant admit card printout, answer key checking, and result scorecards.",
    serviceFee: 30,
    govtFee: 0,
    totalPrice: 30,
    requiredDocs: ["Roll Number / Registration ID", "Date of Birth"],
    popular: false
  },

  // Other Services
  {
    id: "service-resume",
    name: "Professional Resume / CV Creation",
    category: "Other Services",
    icon: "file-badge",
    description: "Modern, ATS-friendly curriculum vitae prepared by professional typists.",
    serviceFee: 100,
    govtFee: 0,
    totalPrice: 100,
    requiredDocs: ["Educational & Work Experience Details", "Photo"],
    popular: false
  }
];

class ServiceCatalogManager {
  constructor() {
    this.services = [];
  }

  async loadServices() {
    // If live Firestore
    if (window.DOS_CONFIG && window.DOS_CONFIG.isLive) {
      try {
        const db = window.DOS_CONFIG.getDb();
        const snapshot = await db.collection('services').get();
        if (!snapshot.empty) {
          this.services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          return this.services;
        }
      } catch (e) {
        console.warn('Could not load services from Firestore, falling back to defaults:', e);
      }
    }

    // Check demoStore in localStorage
    const saved = DOSUtils.demoStore.get('services', null);
    if (saved && saved.length > 0) {
      this.services = saved;
    } else {
      this.services = [...DEFAULT_SERVICES];
      DOSUtils.demoStore.set('services', this.services);
    }
    return this.services;
  }

  getAll() {
    return this.services.length ? this.services : DEFAULT_SERVICES;
  }

  getById(id) {
    const list = this.getAll();
    return list.find(s => s.id === id);
  }

  getCategories() {
    const list = this.getAll();
    const categories = new Set(list.map(s => s.category));
    return ['All Services', ...Array.from(categories)];
  }

  getByCategory(category) {
    const list = this.getAll();
    if (!category || category === 'All Services') return list;
    return list.filter(s => s.category === category);
  }

  getPopular() {
    const list = this.getAll();
    return list.filter(s => s.popular);
  }

  search(query, category = 'All Services') {
    let list = this.getAll();
    if (category && category !== 'All Services') {
      list = list.filter(s => s.category === category);
    }
    if (!query) return list;

    const q = query.toLowerCase().trim();
    return list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }
}

window.DOSServices = new ServiceCatalogManager();

