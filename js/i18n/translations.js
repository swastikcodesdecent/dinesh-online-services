/**
 * DINESH ONLINE SOLUTION - INTERNATIONALIZATION (i18n)
 * Full English & Hindi (हिन्दी) support
 */

const translations = {
  en: {
    // Brand
    brand_name: "Dinesh Online Solution",
    brand_tagline: "Your True Digital Companion",

    // Navigation
    nav_home: "Home",
    nav_services: "Services",
    nav_about: "About Us",
    nav_contact: "Contact",
    nav_login: "Login",
    nav_register: "Register",
    nav_dashboard: "Dashboard",
    nav_admin: "Admin",
    nav_logout: "Logout",

    // Hero
    hero_badge: "Trusted CSC & Digital Facilitation Centre",
    hero_title_part1: "Your Trusted",
    hero_title_highlight: "Digital Service Partner",
    hero_description: "Access essential digital services, online applications, bill payments and documentation assistance conveniently from one place.",
    btn_explore_services: "Explore Services",
    btn_get_started: "Get Started",
    hero_stat_citizens: "10,000+",
    hero_stat_citizens_label: "Citizens Served",
    hero_stat_success: "99.8%",
    hero_stat_success_label: "Success Rate",
    hero_stat_services: "40+",
    hero_stat_services_label: "Essential Services",

    // Popular Services Section
    section_popular_title: "Popular Digital Services",
    section_popular_sub: "Quick, transparent and certified digital assistance for all daily requirements.",
    btn_view_details: "View Details",
    btn_apply_now: "Apply Now",
    price_starts_from: "Service Charge",

    // Why Choose Us
    section_why_title: "Why Choose Dinesh Online Solution?",
    section_why_sub: "Experience prompt service, zero hidden fees, and end-to-end guidance.",
    why_1_title: "Easy Online Access",
    why_1_desc: "Apply for all documentation and payments online without standing in long queues.",
    why_2_title: "Transparent Pricing",
    why_2_desc: "Zero hidden charges. Clear distinction between official government fees and facilitation charges.",
    why_3_title: "Secure Payments",
    why_3_desc: "Industry-standard encrypted transactions via Razorpay with instant verifiable receipts.",
    why_4_title: "Professional Assistance",
    why_4_desc: "Experienced operators cross-check every single application to prevent clerical rejections.",
    why_5_title: "Application Tracking",
    why_5_desc: "Real-time SMS and online tracking from document verification to government approval.",
    why_6_title: "Dedicated Support",
    why_6_desc: "Direct WhatsApp and helpline phone support whenever you need clarifications.",

    // How It Works
    section_how_title: "How It Works",
    section_how_sub: "Get your digital tasks completed in 5 simple, guided steps.",
    step_1_title: "Create Account",
    step_1_desc: "Sign up in 30 seconds using your 10-digit mobile number and 4-digit PIN.",
    step_2_title: "Choose Service",
    step_2_desc: "Select PAN, Aadhaar, Bill Payments, Government Schemes or Certificates.",
    step_3_title: "Upload Documents",
    step_3_desc: "Safely attach your required photos and identification documents.",
    step_4_title: "Make Payment",
    step_4_desc: "Pay service fees securely through UPI, Debit Card, Credit Card or Netbanking.",
    step_5_title: "Track Application",
    step_5_desc: "Receive real-time progress updates and download verified certificates directly.",

    // About Us
    about_title: "About Dinesh Online Solution",
    about_p1: "Dinesh Online Solution is your trusted neighbourhood and online digital service centre. We bridge the technology gap by delivering swift, transparent, and accurate citizen services across Uttar Pradesh and throughout India.",
    about_p2: "Whether you need a new PAN card, Aadhaar updates, urgent exam form submission, or bill payments, we guarantee personal attention, error-free documentation, and prompt execution.",
    about_feat_1: "Verified Digital Seva Centre Operator",
    about_feat_2: "Strict Document Privacy and Encrypted Storage",
    about_feat_3: "Fast-Track Processing & Instant Acknowledgment",

    // Contact
    contact_title: "Get In Touch",
    contact_sub: "Have questions about an application or need special assistance? Contact us today.",
    contact_phone_label: "Call Us",
    contact_whatsapp_label: "WhatsApp Chat",
    contact_email_label: "Email Support",
    contact_address_label: "Visit Our Centre",
    contact_hours_label: "Working Hours",
    form_your_name: "Full Name",
    form_your_phone: "Mobile Number",
    form_your_message: "Your Query / Message",
    btn_send_message: "Send Message",

    // Dashboard
    dash_welcome: "Welcome back",
    dash_customer_id: "Customer ID",
    dash_total_services: "Total Services",
    dash_pending_apps: "Pending Applications",
    dash_completed_apps: "Completed Applications",
    dash_total_payments: "Total Payments",
    dash_recent_apps: "Recent Applications",
    dash_view_all: "View All",
    dash_no_apps: "No applications found yet. Browse our services to get started!",

    // Status
    status_payment_pending: "Payment Pending",
    status_payment_successful: "Payment Successful",
    status_request_received: "Request Received",
    status_under_review: "Under Review",
    status_documents_required: "Documents Required",
    status_processing: "Processing",
    status_completed: "Completed",
    status_rejected: "Rejected",
    status_cancelled: "Cancelled",

    // Common
    loading: "Loading...",
    save: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    download_receipt: "Download Receipt",
    upload_files: "Upload Documents",
    disclaimer_gov: "Disclaimer: Dinesh Online Solution is an independent digital facilitation and documentation assistance centre. We are not a government agency. Government fees (if any) are collected strictly as official pass-through fees without markups."
  },

  hi: {
    // Brand
    brand_name: "दिनेश ऑनलाइन सॉल्यूशन",
    brand_tagline: "आपका सच्चा डिजिटल साथी",

    // Navigation
    nav_home: "मुख्य पृष्ठ",
    nav_services: "सेवाएं",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क करें",
    nav_login: "लॉग इन",
    nav_register: "पंजीकरण",
    nav_dashboard: "डैशबोर्ड",
    nav_admin: "एडमिन",
    nav_logout: "लॉगआउट",

    // Hero
    hero_badge: "विश्वसनीय डिजिटल सेवा एवं जन सुविधा केंद्र",
    hero_title_part1: "आपका सच्चा एवं विश्वसनीय",
    hero_title_highlight: "डिजिटल सेवा साथी",
    hero_description: "पैन कार्ड, आधार सहायता, बिजली-पानी बिल भुगतान, ऑनलाइन फॉर्म और सरकारी योजनाओं की सुविधा एक ही स्थान पर सरलता से प्राप्त करें।",
    btn_explore_services: "सेवाएं देखें",
    btn_get_started: "शुरुआत करें",
    hero_stat_citizens: "10,000+",
    hero_stat_citizens_label: "संतुष्ट नागरिक",
    hero_stat_success: "99.8%",
    hero_stat_success_label: "सफल समाधान",
    hero_stat_services: "40+",
    hero_stat_services_label: "डिजिटल सेवाएं",

    // Popular Services Section
    section_popular_title: "लोकप्रिय डिजिटल सेवाएं",
    section_popular_sub: "आपकी सभी दैनिक आवश्यकताओं के लिए त्वरित, पारदर्शी और प्रमाणित डिजिटल सहायता।",
    btn_view_details: "विवरण देखें",
    btn_apply_now: "आवेदन करें",
    price_starts_from: "सेवा शुल्क",

    // Why Choose Us
    section_why_title: "दिनेश ऑनलाइन सॉल्यूशन क्यों चुनें?",
    section_why_sub: "त्वरित कार्य, बिना किसी छिपे शुल्क के स्पष्ट और सुरक्षित डिजिटल सेवाएं।",
    why_1_title: "सरल ऑनलाइन पहुंच",
    why_1_desc: "लंबी कतारों में खड़े हुए बिना घर बैठे सभी प्रमाण पत्र और बिलों का भुगतान करें।",
    why_2_title: "पारदर्शी शुल्क",
    why_2_desc: "कोई छिपा हुआ शुल्क नहीं। सरकारी फीस और सेवा शुल्क की पूरी स्पष्टता।",
    why_3_title: "सुरक्षित भुगतान",
    why_3_desc: "Razorpay द्वारा सुरक्षित और एन्क्रिप्टेड भुगतान प्रणाली एवं तुरंत रसीद।",
    why_4_title: "अनुभवी सहायता",
    why_4_desc: "त्रुटि-रहित फॉर्म भरने के लिए अनुभवी ऑपरेटरों द्वारा हर दस्तावेज़ की जांच।",
    why_5_title: "आवेदन ट्रैकिंग",
    why_5_desc: "दस्तावेज़ सत्यापन से लेकर प्रमाणपत्र बनने तक रियल-टाइम स्टेटस ट्रैकिंग।",
    why_6_title: "समर्पित ग्राहक सेवा",
    why_6_desc: "किसी भी प्रश्न या सहायता के लिए सीधा व्हाट्सएप और फोन हेल्पलाइन सपोर्ट।",

    // How It Works
    section_how_title: "यह कैसे काम करता है?",
    section_how_sub: "केवल 5 आसान चरणों में अपना डिजिटल कार्य पूरा करें।",
    step_1_title: "खाता बनाएं",
    step_1_desc: "अपने 10 अंकों के मोबाइल नंबर और 4 अंकों के पिन से 30 सेकंड में जुड़ें।",
    step_2_title: "सेवा चुनें",
    step_2_desc: "पैन, आधार, बिल भुगतान, सरकारी योजना या प्रमाण पत्र का चयन करें।",
    step_3_title: "दस्तावेज़ अपलोड करें",
    step_3_desc: "आवश्यक पहचान पत्र और फोटो सुरक्षित रूप से अपलोड करें।",
    step_4_title: "भुगतान करें",
    step_4_desc: "UPI, डेबिट कार्ड या नेटबैंकिंग से सुरक्षित सेवा शुल्क अदा करें।",
    step_5_title: "प्रगति ट्रैक करें",
    step_5_desc: "अपने आवेदन की स्थिति देखें और तैयार प्रमाण पत्र सीधे डाउनलोड करें।",

    // About Us
    about_title: "दिनेश ऑनलाइन सॉल्यूशन के बारे में",
    about_p1: "दिनेश ऑनलाइन सॉल्यूशन आपका विश्वसनीय डिजिटल सुविधा केंद्र है। हम आम नागरिकों को पारदर्शी, त्रुटिहीन और त्वरित ऑनलाइन सेवाएं उपलब्ध कराकर डिजिटल भारत को सशक्त बनाते हैं।",
    about_p2: "नया पैन कार्ड हो, आधार में संशोधन, परीक्षा फॉर्म या बिजली बिल, हम प्रत्येक आवेदन पर व्यक्तिगत ध्यान देकर समय पर कार्य पूरा करते हैं।",
    about_feat_1: "प्रमाणित डिजिटल सेवा केंद्र संचालक",
    about_feat_2: "दस्तावेज़ों की पूर्ण गोपनीयता और सुरक्षित स्टोरेज",
    about_feat_3: "फास्ट-ट्रैक प्रोसेसिंग और तुरंत पावती रसीद",

    // Contact
    contact_title: "हमसे संपर्क करें",
    contact_sub: "किसी भी आवेदन या सहायता के लिए आज ही हमसे संपर्क करें।",
    contact_phone_label: "फोन करें",
    contact_whatsapp_label: "व्हाट्सएप चैट",
    contact_email_label: "ईमेल सहायता",
    contact_address_label: "केंद्र पर आएं",
    contact_hours_label: "कार्य समय",
    form_your_name: "पूरा नाम",
    form_your_phone: "मोबाइल नंबर",
    form_your_message: "आपका संदेश / प्रश्न",
    btn_send_message: "संदेश भेजें",

    // Dashboard
    dash_welcome: "नमस्ते",
    dash_customer_id: "ग्राहक आईडी",
    dash_total_services: "कुल सेवाएं",
    dash_pending_apps: "लंबित आवेदन",
    dash_completed_apps: "पूर्ण आवेदन",
    dash_total_payments: "कुल भुगतान",
    dash_recent_apps: "हाल के आवेदन",
    dash_view_all: "सभी देखें",
    dash_no_apps: "अभी तक कोई आवेदन नहीं मिला। सेवाएं देखकर शुरुआत करें!",

    // Status
    status_payment_pending: "भुगतान लंबित",
    status_payment_successful: "भुगतान सफल",
    status_request_received: "अनुरोध प्राप्त हुआ",
    status_under_review: "समीक्षाधीन",
    status_documents_required: "दस्तावेज़ आवश्यक",
    status_processing: "प्रगति पर",
    status_completed: "पूर्ण हुआ",
    status_rejected: "अस्वीकृत",
    status_cancelled: "रद्द किया गया",

    // Common
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    download_receipt: "रसीद डाउनलोड करें",
    upload_files: "दस्तावेज़ अपलोड करें",
    disclaimer_gov: "अस्वीकरण: दिनेश ऑनलाइन सॉल्यूशन एक स्वतंत्र नागरिक सुविधा एवं सहायता केंद्र है। हम कोई सरकारी एजेंसी नहीं हैं। सरकारी शुल्क बिना किसी अतिरिक्त शुल्क के सीधे सरकारी नियमों के अनुसार लिया जाता है।"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('dos_lang') || 'en';
  }

  init() {
    this.applyLanguage(this.currentLang);
  }

  getLanguage() {
    return this.currentLang;
  }

  setLanguage(lang) {
    if (lang !== 'en' && lang !== 'hi') lang = 'en';
    this.currentLang = lang;
    localStorage.setItem('dos_lang', lang);
    this.applyLanguage(lang);
    window.dispatchEvent(new CustomEvent('dos-language-changed', { detail: { lang } }));
  }

  toggleLanguage() {
    const nextLang = this.currentLang === 'en' ? 'hi' : 'en';
    this.setLanguage(nextLang);
    return nextLang;
  }

  t(key, fallback = '') {
    const langDict = translations[this.currentLang] || translations.en;
    return langDict[key] || translations.en[key] || fallback || key;
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    if (lang === 'hi') {
      document.body.classList.add('lang-hi');
    } else {
      document.body.classList.remove('lang-hi');
    }

    // Auto-translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[lang] && translations[lang][key]) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update language button text if present
    document.querySelectorAll('.lang-switcher-text').forEach(el => {
      el.textContent = lang === 'en' ? 'हिन्दी' : 'English';
    });
  }
}

window.i18n = new I18nManager();

