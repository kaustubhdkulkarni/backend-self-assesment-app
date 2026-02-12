const roles = {
  superAdmin: "super_admin",
  admin: "admin",
  backofficeUser: "backoffice_user",
  systemUser: "system_user",
  user: "user",
};

const subRoles = {
  businessInvestor: "business_investor",
  regularInvestor: "regular_investor",
  sophisticatedInvestor: "sophisticated_investor",
};

const kycType = {
  manual: "manual",
  automatic: "automatic",
};

const roleAccess = {
  user: "userAccess",
  backofficeUser: "backofficeUserAccess",
  admin: "adminAccess",
  superAdmin: "superAdminAccess",
};

const source = {
  migrated: "migrated",
  web: "web",
  byAdmin: "byAdmin",
};

const roleRights = new Map();
roleRights.set(roles.superAdmin, [
  roleAccess.user,
  roleAccess?.backofficeUser,
  roleAccess.admin,
  roleAccess?.superAdmin,
]);
roleRights.set(roles.admin, [
  roleAccess.user,
  roleAccess?.backofficeUser,
  roleAccess.admin,
]);
roleRights.set(roles.backofficeUser, [
  roleAccess.user,
  roleAccess.backofficeUser,
]);
roleRights.set(roles.user, [roleAccess.user]);

const gccCountryPhoneCodes = [
  "965", // Kuwait
  "966", // Saudi Arabia
  "968", // Oman
  "971", // United Arab Emirates
  "973", // Bahrain
  "974", // Qatar
];
const otpOnMobileSendCountryCodes  = [
  "965", // Kuwait
  "966", // Saudi Arabia
  "968", // Oman
 // "971", // United Arab Emirates
  "973", // Bahrain
  "974", // Qatar
];



let nullValues = [null, "", "NULL", "null", "N/A", "String", "string"];

const gccCountries = [
  { name: "Bahrain", code: "BH", iso3: "BHR" },
  { name: "Kuwait", code: "KW", iso3: "KWT" },
  { name: "Oman", code: "OM", iso3: "OMN" },
  { name: "Qatar", code: "QA", iso3: "QAT" },
  { name: "Saudi Arabia", code: "SA", iso3: "SAU" },
  { name: "United Arab Emirates", code: "AE", iso3: "ARE" },
];
const contentType = {
  applicationJSON: "application/json", // JSON data
  multipartForm: "multipart/form-data", // File uploads and forms with files
  formUrlencoded: "application/x-www-form-urlencoded", // Form data encoded as key-value pairs
  textPlain: "text/plain", // Plain text data
  textHtml: "text/html", // HTML data
  textCsv: "text/csv", // CSV data
  applicationXml: "application/xml", // XML data
  textXml: "text/xml", // XML data (text format)
  applicationOctetStream: "application/octet-stream", // Binary data
  applicationPdf: "application/pdf", // PDF files
  applicationZip: "application/zip", // ZIP files
};

const otpType = {
  phoneVerify: "phone_verify",
  emailVerify: "email_verify",
  forgotPassword: "forgot_password",
  transactionVerification: "transaction_verification",
  investmentVerification: "investment_verification",
  investmentEmailVerify: "investment_email_verify",
  investmentPhoneVerify: "investment_phone_verify",
  investmentContactVerify: "investment_contact_verify",
  signInvestmentContract: "sign_investment_contract",
};

const accountType = {
  investor: "investor",
  fundraiser: "fundraiser",
};

const gender = {
  male: "Male",
  female: "Female",
  other: "Other",
};

const kycDocStatus = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

const campaignStatus = {
  DRAFT: "DRAFT",
  WAITING_FOR_REGISTRATION_FEE: "PENDING PAYMENT",
  // ACTIVE: "ACTIVE",
  // CANCELLATION_REQUEST: "CANCELLATION REQUEST",
  // CANCELED: "CANCELED",
  // BUSINESS_VERIFICATION: "BUSINESS VERIFICATION",
  // CAMPAIGN_VERIFICATION: "CAMPAIGN VERIFICATION",
  // CAMPAIGN_COLLATERAL_REVIEW: "CAMPAIGN COLLATERAL REVIEW",
  // WAITING_FOR_DATA: "WAITING FOR DATA",
  // DECLINED: "DECLINED",
  // ABANDONED: "ABANDONED",
  // APPROVED: "APPROVED",
  // SIGNING_CAMPAIGN_AGREEMENT: "SIGNING CAMPAIGN AGREEMENT",
  // FUNDRAISING_RESERVE: "FUNDRAISING RESERVE",
  FUNDRAISING_LIVE: "LIVE",
  // CAMPAIGN_RECONCILIATION: "CAMPAIGN RECONCILIATION",
  // CAMPAIGN_FAIL: "CAMPAIGN FAIL",
  TEMPORARILY_SUSPENDED: "TEMPORARILY SUSPENDED",
  UNSUCCESSFUL: "UNSUCCESSFUL",
  SUCCESSFUL: "SUCCESSFUL",
  // SPV_SET_UP: "SPV SET UP",
  READY_FOR_DISBURSEMENT: "READY FOR DISBURSEMENT",
  DISBURSEMENT_IN_PROGRESS: "DISBURSEMENT IN PROGRESS",
  DISBURSEMENT_ERROR: "DISBURSEMENT ERROR",
  DISBURSEMENT_SUCCESS: "DISBURSEMENT SUCCESS",
};
// const investmentStatus = {
//   CANCELED: "CANCELED",
//   PENDING: "PENDING",
//   COMPLETED: "COMPLETED",
//   SIGN_CONTRACT: "SIGN_CONTRACT",
// };

const investmentStatus = {
  CANCELED: "CANCELED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  PENDING_REPAYMENT: "PENDING_REPAYMENT",
  LOAN_DEPLOYED_DEBT: "LOAN_DEPLOYED_DEBT",
  REPAYMENT_COMPLETED: "REPAYMENT_COMPLETED",
  SIGN_CONTRACT: "SIGN_CONTRACT",
};

const residenceTypeOptions = {
  NATIONAL_ID: "NATIONAL_ID",
  RESIDENT_ID: "RESIDENT_ID",
  PASSPORT: "PASSPORT",
};

const omanBanks = {
  BANK_DHOFAR_SAOG: "Bank Dhofar SAOG",
  BANK_MUSCAT_SAOG: "Bank Muscat SAOG",
  NATIONAL_BANK_OF_OMAN_SAOG: "National Bank of Oman SAOG",
  OMAN_ARAB_BANK_SAOG: "Oman Arab Bank SAOG",
  SOHAR_INTERNATIONAL: "Sohar International",
  AHLI_BANK_SAOG: "Ahli Bank SAOG",
  OMAN_HOUSING_BANK_SAOC: "Oman Housing Bank SAOC",
  DEVELOPMENT_BANK_SAOC: "Development Bank SAOC",
  BANK_NIZWA: "Bank Nizwa",
  AL_IZZ_ISLAMIC_BANK_SAOC: "Al Izz Islamic Bank (S.A.O.C)",
  BANK_MELLI_IRAN: "Bank Melli Iran",
  BANK_OF_BARODA: "Bank of Baroda",
  BANK_SADERAT_IRAN: "Bank Saderat Iran",
  STANDARD_CHARTERED_BANK: "Standard Chartered Bank",
  STATE_BANK_OF_INDIA: "State Bank of India",
  BANK_OF_BEIRUT: "Bank of Beirut",
  FIRST_ABU_DHABI_BANK: "First Abu Dhabi Bank",
  QATAR_NATIONAL_BANK: "Qatar National Bank",
};

const omanBanksSwiftCode = {
  Bank_Dhofar_SAOG: "BMUS OM RX",
  Bank_Muscat_SAOG: "BMUS OM RX",
  National_Bank_of_Oman_SAOG: "NBOM OM RX",
  Oman_Arab_Bank_SAOG: "OMAB OM RU",
  Sohar_International: "BSHROMRUXXX",
  Ahli_Bank_SAOG: "AUBOOMRUXXX",
  Oman_Housing_Bank_SAOC: "OHSAOMRU",
  Development_Bank_SAOC: "Not Provided",
  Bank_Nizwa: "BNZWOMRUXXX",
  Al_Izz_Islamic_Bank: "IZZBOMRUXXX",
  Bank_Melli_Iran: "MELI OMR XXX",
  Bank_of_Baroda: "BARB OMMX",
  Bank_Saderat_Iran: "BSIR OMR",
  Standard_Chartered_Bank: "SCBLAEAD XXX",
  State_Bank_of_India: "SBIN OMRX",
  Bank_of_Beirut: "BABEOMRX",
  First_Abu_Dhabi_Bank: "NBADOMRX",
  Qatar_National_Bank: "QNBAOMRXXXX",
};

const countries = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AI: "Anguilla",
  AQ: "Antarctica",
  AG: "Antigua and Barbuda",
  AR: "Argentina",
  AM: "Armenia",
  AW: "Aruba",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas (the)",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BM: "Bermuda",
  BT: "Bhutan",
  BO: "Bolivia (Plurinational State of)",
  BQ: "Bonaire, Sint Eustatius and Saba",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BV: "Bouvet Island",
  BR: "Brazil",
  IO: "British Indian Ocean Territory (the)",
  BN: "Brunei Darussalam",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  CV: "Cabo Verde",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  KY: "Cayman Islands (the)",
  CF: "Central African Republic (the)",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CX: "Christmas Island",
  CC: "Cocos (Keeling) Islands (the)",
  CO: "Colombia",
  KM: "Comoros (the)",
  CD: "Congo (the Democratic Republic of the)",
  CG: "Congo (the)",
  CK: "Cook Islands (the)",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CW: "Curaçao",
  CY: "Cyprus",
  CZ: "Czechia",
  CI: "Côte d'Ivoire",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic (the)",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FK: "Falkland Islands (the) [Malvinas]",
  FO: "Faroe Islands (the)",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GF: "French Guiana",
  PF: "French Polynesia",
  TF: "French Southern Territories (the)",
  GA: "Gabon",
  GM: "Gambia (the)",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  GL: "Greenland",
  GD: "Grenada",
  GP: "Guadeloupe",
  GU: "Guam",
  GT: "Guatemala",
  GG: "Guernsey",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HM: "Heard Island and McDonald Islands",
  VA: "Holy See (the)",
  HN: "Honduras",
  HK: "Hong Kong",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran (Islamic Republic of)",
  IQ: "Iraq",
  IE: "Ireland",
  IM: "Isle of Man",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JE: "Jersey",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "Korea (the Democratic People's Republic of)",
  KR: "Korea (the Republic of)",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Lao People's Democratic Republic (the)",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MO: "Macao",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands (the)",
  MQ: "Martinique",
  MR: "Mauritania",
  MU: "Mauritius",
  YT: "Mayotte",
  MX: "Mexico",
  FM: "Micronesia (Federated States of)",
  MD: "Moldova (the Republic of)",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MS: "Montserrat",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands (the)",
  NC: "New Caledonia",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger (the)",
  NG: "Nigeria",
  NU: "Niue",
  NF: "Norfolk Island",
  MP: "Northern Mariana Islands (the)",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestine, State of",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines (the)",
  PN: "Pitcairn",
  PL: "Poland",
  PT: "Portugal",
  PR: "Puerto Rico",
  QA: "Qatar",
  MK: "Republic of North Macedonia",
  RO: "Romania",
  RU: "Russian Federation (the)",
  RW: "Rwanda",
  RE: "Réunion",
  BL: "Saint Barthélemy",
  SH: "Saint Helena, Ascension and Tristan da Cunha",
  KN: "Saint Kitts and Nevis",
  LC: "Saint Lucia",
  MF: "Saint Martin (French part)",
  PM: "Saint Pierre and Miquelon",
  VC: "Saint Vincent and the Grenadines",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SX: "Sint Maarten (Dutch part)",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  GS: "South Georgia and the South Sandwich Islands",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan (the)",
  SR: "Suriname",
  SJ: "Svalbard and Jan Mayen",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syrian Arab Republic",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania, United Republic of",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TK: "Tokelau",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TC: "Turks and Caicos Islands (the)",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates (the)",
  GB: "United Kingdom of Great Britain and Northern Ireland (the)",
  UM: "United States Minor Outlying Islands (the)",
  US: "United States of America (the)",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela (Bolivarian Republic of)",
  VN: "Vietnam",
  VG: "Virgin Islands (British)",
  VI: "Virgin Islands (U.S.)",
  WF: "Wallis and Futuna",
  EH: "Western Sahara",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe",
  AX: "Åland Islands",
};

const bankType = {
  OMAN_BANK: "OMAN BANK",
  INTERNATIONAL_BANK: "INTERNATIONAL BANK",
};

const transactionType = {
  ADD_FUNDS: "ADD FUNDS",
  INVEST_FUNDS: "INVEST FUNDS",
  WITHDRAW_FUNDS: "WITHDRAW FUNDS",
  DISBURSE: "DISBURSE",
  REFUND: "REFUND",
  CAMPAIGN_REGISTRATION_FEE: "CAMPAIGN REGISTRATION FEE",
  REPAYMENT: "REPAYMENT",
  ADJUSTMENT_ADD: "ADJUSTMENT ADD",        // ← ADD THIS (for positive adjustments)
  ADJUSTMENT_SUBTRACT: "ADJUSTMENT SUBTRACT",  // ← ADD THIS (for negative adjustments)
  ADJUSTMENT: "ADJUSTMENT"  // ← ADD THIS (for negative adjustments)
};

const transactionStatus = {
  PENDING: "PENDING",
  SUCCESSFUL: "SUCCESSFUL",
  PARTIALLY_PAID: "PARTIALLY PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

const withdrawalStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};
const walletTopupRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REFUNDED: "REFUNDED",
};
const accreditationRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

const paymentStatus = {
  PENDING: "PENDING",
  SUCCESSFUL: "SUCCESSFUL",
  PARTIALLY_PAID: "PARTIALLY PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
};

const paymentMethod = {
  PAYMOB: "PAYMOB",
  MANUAL: "MANUAL",
};

const typeOfInterestRate = {
  flat: "flat",
  manual: "manual",
};

const allowedCurrencies = ["OMR", "AED", "QAR", "SAR", "BHD", "KWD", "USD"];
const currencies = {
  OMR: "OMR",
  AED: "AED",
  QAR: "QAR",
  SAR: "SAR",
  BHD: "BHD",
  KWD: "KWD",
  USD: "USD",
};

const campaignTypes = ["Equity", "Debt"];
const offeringTypes = ["Crowdfunding"];

const campaignTypesToUse = { Equity:"Equity" ,Debt: "Debt"};
const adminOfferingTypes = {
  DEBT: "Debt",
  PRIVATE_EQUITY: "Private Equity",
  REAL_ESTATE: "Real Estate",
  START_UP: "Start-Up",
  OTHER: "Other"
};

const notificationTypes = {
  CAMPAIGN_REGISTRATION_FEE: "CAMPAIGN REGISTRATION FEE",
  KYB_PENDING: "KYB PENDING",
  KYC_PENDING: "KYC PENDING",
  SUB_ROLE: "SUBROLE PENDING",
  CAMPAIGN_STATUS_UPDATE: "CAMPAIGN STATUS UPDATE",
  INVESTMENT_RECEIVED: "INVESTMENT RECEIVED",
  WITHDRAWAL_REQUEST_APPROVED: "WITHDRAWAL REQUEST APPROVED",
  WITHDRAWAL_REQUEST_REJECTED: "WITHDRAWAL REQUEST REJECTED",
  FROM_ADMIN: "FROM_ADMIN",
};



const companyTypes = [
  "Sole_trader",
  "Branch_of_foreign_company",
  "Saoc",
  "LLC",
  "Holding_company",
  "CPV",
  "General_partnership",
  "Limited_partnership",
  "Government_or_state",
  "Other",
];

const companySectors = [
  "Agriculture_Fishery",
  "Arts_Entertainment",
  "Construction_Infrastructure",
  "Goods_Retail",
  "Edtech_Education",
  "Energy",
  "Fashion_Design",
  "Fintech_Finance",
  "Foodtech_Food_Beverage",
  "Health_Wellness",
  "Healthcare",
  "IT",
  "Manufacturing",
  "Service",
  "Sport",
  "Transport",
  "Real_Estate",
  "Science_Research_Development",
  "Travel_Tourism",
  "Other",
];

module.exports = {
  roles,
  source,
  roleRights,
  roleAccess,
  contentType,
  otpType,
  accountType,
  gender,
  subRoles,
  campaignStatus,
  bankType,
  omanBanks,
  transactionType,
  transactionStatus,
  allowedCurrencies,
  currencies,
  notificationTypes,
  companyTypes,
  offeringTypes,
  countries,
  campaignTypes,
  companySectors,
  withdrawalStatus,
  accreditationRequestStatus,
  typeOfInterestRate,
  paymentMethod,
  paymentStatus,
  investmentStatus,
  kycType,
  kycDocStatus,
  gccCountryPhoneCodes,
  gccCountries,
  residenceTypeOptions,
  nullValues,
  walletTopupRequestStatus,
  otpOnMobileSendCountryCodes,
  campaignTypesToUse,
  adminOfferingTypes
};
