export type Language = 'en' | 'sn' | 'nd' | 'ts';

export interface Translations {
  // Navigation & Branding
  brandSubtitle: string;
  marketplace: string;
  smartBarterHub: string;
  whatsAppEngine: string;
  postListing: string;
  tryWhatsAppBot: string;
  liveMarket: string;
  multiCurrencyHeader: string;

  // Hero
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  searchPlaceholder: string;
  searchBtn: string;
  quickFind: string;
  directWhatsApp: string;
  smartBarter: string;
  multiCurrency: string;
  verifiedArtisans: string;

  // Inclusive Umbrella Sectors
  allSectors: string;
  livestockAgric: string;
  groceryWholesale: string;
  clothingTextiles: string;
  buildingConstruction: string;
  industrialTrades: string;
  haulageTransport: string;
  generalServices: string;
  woodworkBuilding: string;
  solarHardware: string;

  // Filters
  allLocations: string;
  allCurrencies: string;
  barterAccepted: string;
  caneHarvestReady: string;
  clearFilters: string;
  showingListings: string;
  activeTradeOffers: string;

  // Listing Actions
  buyNowCash: string;
  contactSeller: string;
  proposeBarter: string;
  barterOnly: string;
  barterTerms: string;
  viewDetail: string;

  // Cash Buy Modal
  buyModalTitle: string;
  buyModalSubtitle: string;
  purchaseMethod: string;
  cashOnDelivery: string;
  pickupLocation: string;
  buyerName: string;
  buyerPhone: string;
  paymentCurrency: string;
  submitCashOrder: string;
  orderSubmitted: string;
  openWhatsAppBuy: string;

  // Barter Proposal Modal
  barterModalTitle: string;
  whatYouOffer: string;
  offerDetails: string;
  submitBarterOffer: string;

  // Seller Details
  offeringDetails: string;
  listedPriceTerms: string;
  sellerProfile: string;
  completedTrades: string;
  rating: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandSubtitle: 'Goods, Livestock, Agro & Artisan Services',
    marketplace: 'Marketplace',
    smartBarterHub: 'Smart Barter Hub',
    whatsAppEngine: 'WhatsApp Engine',
    postListing: 'Post Listing',
    tryWhatsAppBot: 'WhatsApp Bot',
    liveMarket: 'Lowveld Live Market',
    multiCurrencyHeader: 'Multi-Currency: USD | ZAR | Barter',

    heroTitle1: 'Trade Livestock, Trades & Agro Services in ',
    heroTitleHighlight: 'Chiredzi',
    heroSubtitle: 'Direct WhatsApp marketplace connecting sugarcane outgrowers, cattle ranchers, light industrial artisans, and hauliers across the Lowveld.',
    searchPlaceholder: "Search (e.g. 'Brahman heifers', 'welder Tshovani', '30t haulage')...",
    searchBtn: 'Search',
    quickFind: 'Quick find:',
    directWhatsApp: 'Direct WhatsApp',
    smartBarter: 'Smart Barter',
    multiCurrency: 'Multi-Currency',
    verifiedArtisans: 'Verified Artisans',

    allSectors: 'All Sectors',
    livestockAgric: 'Livestock & Agric Produce',
    groceryWholesale: 'Groceries & Wholesale',
    clothingTextiles: 'Clothing, Boutiques & Tailors',
    buildingConstruction: 'Building, Construction & Hardware',
    industrialTrades: 'Industrial, Welding & Mechanics',
    haulageTransport: 'Haulage, Trucks & Bakkie Hire',
    generalServices: 'General Retail & Services',
    woodworkBuilding: 'Woodwork & Building',
    solarHardware: 'Solar & Hardware',

    allLocations: 'All Locations',
    allCurrencies: 'All Currencies',
    barterAccepted: 'Barter Accepted',
    caneHarvestReady: 'Cane Harvest Ready',
    clearFilters: 'Clear Filters',
    showingListings: 'Showing',
    activeTradeOffers: 'active trade offers across the Lowveld',

    buyNowCash: 'Buy (Cash USD/ZAR)',
    contactSeller: 'Contact Seller',
    proposeBarter: 'Swap Offer',
    barterOnly: 'BARTER ONLY',
    barterTerms: 'Barter Terms: ',
    viewDetail: 'View Detail',

    buyModalTitle: 'Buy with Cash (USD / ZAR)',
    buyModalSubtitle: 'Direct collection & payment from',
    purchaseMethod: 'Payment & Collection Method',
    cashOnDelivery: 'Cash on Handover / Collection in Chiredzi',
    pickupLocation: 'Preferred Collection Hub',
    buyerName: 'Your Full Name',
    buyerPhone: 'Your WhatsApp Phone Number',
    paymentCurrency: 'Payment Currency',
    submitCashOrder: 'Place Cash Purchase Order',
    orderSubmitted: 'Cash Order Created!',
    openWhatsAppBuy: 'Open Pre-filled WhatsApp Order',

    barterModalTitle: 'Propose Smart Barter Swap',
    whatYouOffer: 'What item / service are you offering in return?',
    offerDetails: 'Details of your offer (Quantity, Condition, Terms)',
    submitBarterOffer: 'Submit Barter Proposal',

    offeringDetails: 'Offering Details',
    listedPriceTerms: 'Listed Price / Terms:',
    sellerProfile: 'Seller Profile',
    completedTrades: 'Completed Trades',
    rating: 'Rating',
  },
  sn: {
    brandSubtitle: 'Zvipfuyo, Zvirimwa, Welder neMabasa eMaoko',
    marketplace: 'Musika weChiredzi',
    smartBarterHub: 'Nzvimbo yeKuchinjana (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Isa Chigadzirwa',
    tryWhatsAppBot: 'Bvunza WhatsApp Bot',
    liveMarket: 'Musika weLowveld Mupenyu',
    multiCurrencyHeader: 'Mari Inobvumidzwa: USD | ZAR | Barter',

    heroTitle1: 'Tengesa Zvipfuyo, Mbeu neMabasa eMaoko mu',
    heroTitleHighlight: 'Chiredzi',
    heroSubtitle: 'Musika unobatanidza varimi veshuwa, vapfuyi vezvipfuyo, vasoni vehembe, magirosari nema-welder paWhatsApp muChiredzi yese.',
    searchPlaceholder: "Tsvaga (se: 'Mombe dzemukaka', 'Welder yeTshovani', 'Vasoni vehembe', 'Simende')...",
    searchBtn: 'Tsvaga',
    quickFind: 'Zvakakurumbira:',
    directWhatsApp: 'WhatsApp Imwe neImwe',
    smartBarter: 'Kuchinjana Zvinhu',
    multiCurrency: 'USD neRandi (ZAR)',
    verifiedArtisans: 'Vashandi Vakavimbika',

    allSectors: 'Mabasa Ese',
    livestockAgric: 'Zvipfuyo neZvirimwa',
    groceryWholesale: 'Magirosari, Chikafu neTuckshops',
    clothingTextiles: 'Mbatya, Mabutiki neVasoni veHembe',
    buildingConstruction: 'Kuvaka, Simende neHardware',
    industrialTrades: 'Welding, Machina neInjiniyaringi',
    haulageTransport: 'Dhirivhari, Bakkie neMarhori',
    generalServices: 'Zvigadzirwa, Mafoni neMabasa',
    woodworkBuilding: 'Mapuranga neKuvaka',
    solarHardware: 'Solar neZvikamu',

    allLocations: 'Nzvimbo Dzese',
    allCurrencies: 'Mari Dzese',
    barterAccepted: 'Kuchinjana Kunoita',
    caneHarvestReady: 'Zvakagadzirira Nzimbe',
    clearFilters: 'Dzima Zvakasarudzwa',
    showingListings: 'Zviratidzwa',
    activeTradeOffers: 'zvinhu zviripo muChiredzi neLowveld',

    buyNowCash: 'Tenga neMari (USD/ZAR)',
    contactSeller: 'Bata Mutengesi',
    proposeBarter: 'Chinjana Zvinhu',
    barterOnly: 'KUCHINJANA CHETE',
    barterTerms: 'Zviga zvekuchinjana: ',
    viewDetail: 'Wona Zvakazara',

    buyModalTitle: 'Tenga neMari (USD / ZAR Cash)',
    buyModalSubtitle: 'Tenga zvakananga kubva kuna',
    purchaseMethod: 'Nzira yekutenga nekugamuchira',
    cashOnDelivery: 'Bhadhara Pamaoko uchiitora muChiredzi',
    pickupLocation: 'Nzvimbo yekutorera',
    buyerName: 'Zita rako rakazara',
    buyerPhone: 'Nhamba yako yeWhatsApp',
    paymentCurrency: 'Mari yaunobhadhara nayo',
    submitCashOrder: 'Tumira Oda yekutenga',
    orderSubmitted: 'Oda Yatumirwa!',
    openWhatsAppBuy: 'Vura WhatsApp Uchimutengera',

    barterModalTitle: 'Kumbira Kuchinjana Zvinhu',
    whatYouOffer: 'Chii chaunacho chekuchinjanisa nacho?',
    offerDetails: 'Zvakazara nezvechinhu chako',
    submitBarterOffer: 'Tumira Chikumbiro Chekuchinjana',

    offeringDetails: 'Zvechigadzirwa',
    listedPriceTerms: 'Mutengo / Zviga:',
    sellerProfile: 'ZvaMutengesi',
    completedTrades: 'Zvakachinjwa',
    rating: 'Chiitiko',
  },
  nd: {
    brandSubtitle: 'Inkomo, Zvezulimo, Umsebenzi Wezandla Logatsha',
    marketplace: 'Imakethe yeChiredzi',
    smartBarterHub: 'Inkabazwe Yentshintsho (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Faka Okuthengisayo',
    tryWhatsAppBot: 'Sebenzisa WhatsApp Bot',
    liveMarket: 'Imakethe yeLowveld',
    multiCurrencyHeader: 'Imali Ezamukelwayo: USD | ZAR | Barter',

    heroTitle1: 'Thengisa Inkomo, Imizamo meZenzo Zezandla e',
    heroTitleHighlight: 'Chiredzi',
    heroSubtitle: 'Imakethe exhumanisa balimi, babuyisi benkomo, abathengisi lokugqoka labatshayeli bamaloli ku-WhatsApp eChiredzi lonke.',
    searchPlaceholder: "Cinga (isbonelo: 'Inkomo zokusenga', 'Welder eTshovani', 'Izembatho')...",
    searchBtn: 'Cinga',
    quickFind: 'Okudingwa kakhulu:',
    directWhatsApp: 'WhatsApp Ngqo',
    smartBarter: 'Ukuntshintshisana',
    multiCurrency: 'USD leRandi (ZAR)',
    verifiedArtisans: 'Abasebenzi Abasekelweyo',

    allSectors: 'Ingxenye Zonke',
    livestockAgric: 'Inkomo leZilimelo',
    groceryWholesale: 'Ukudla leMpuphu',
    clothingTextiles: 'Izembatho labathungi',
    buildingConstruction: 'Ukwakha leZinsimbi',
    industrialTrades: 'Izimboni leZinsimbi',
    haulageTransport: 'Izithuthi leZimoto',
    generalServices: 'Izinsiza Zonke',
    woodworkBuilding: 'Izihlahla leZindlu',
    solarHardware: 'Solar leZingxenye',

    allLocations: 'Indawo Zonke',
    allCurrencies: 'Imali Zonke',
    barterAccepted: 'Ukuntshintshana Kuyavunywa',
    caneHarvestReady: 'Kukulungele Itshukela',
    clearFilters: 'Sula Konke',
    showingListings: 'Kutshengiswa',
    activeTradeOffers: 'izinto ezithengiswayo eLowveld',

    buyNowCash: 'Thenga ngemali (USD/ZAR)',
    contactSeller: 'Xhumana Muthengisi',
    proposeBarter: 'Ntshintshisa',
    barterOnly: 'UKUNTSHINTSHISA KWEDWA',
    barterTerms: 'Izimfuno zokuntshintsha: ',
    viewDetail: 'Bona Konke',

    buyModalTitle: 'Thenga ngemali (USD / ZAR Cash)',
    buyModalSubtitle: 'Thenga ngqo kuye',
    purchaseMethod: 'Indlela yokuthenga lokuyithatha',
    cashOnDelivery: 'Bhadala ngezandla xa uyithatha eChiredzi',
    pickupLocation: 'Indawo yokuyithatha',
    buyerName: 'Ibizo lakho elipheleleyo',
    buyerPhone: 'Inombolo yakho ye-WhatsApp',
    paymentCurrency: 'Imali obhadala ngayo',
    submitCashOrder: 'Faka Isicelo Sokuthenga',
    orderSubmitted: 'Isicelo Singenile!',
    openWhatsAppBuy: 'Vula i-WhatsApp Ukuthenga',

    barterModalTitle: 'Cela Ukuntshintshisa',
    whatYouOffer: 'Ulesitsho sini sobantshintshisa ngaso?',
    offerDetails: 'Ingxenye ngomnikelo wakho',
    submitBarterOffer: 'Thumela Isicelo',

    offeringDetails: 'Ingxenye Yento',
    listedPriceTerms: 'Intengo / Imfuno:',
    sellerProfile: 'Ingxenye yoMthengisi',
    completedTrades: 'Okupheleleyo',
    rating: 'Umuthi',
  },
  ts: {
    brandSubtitle: 'Mahlolwa, Zvimilwa, Vatsveri neMitirho ya Mavoko',
    marketplace: 'Musika wa Chiredzi (Xhangane)',
    smartBarterHub: 'Ndhawu ya ku Cinca (Barter Hub)',
    whatsAppEngine: 'WhatsApp Bot Engine',
    postListing: 'Veka Chixaviso',
    tryWhatsAppBot: 'Tirhisa WhatsApp Bot',
    liveMarket: 'Musika wa Lowveld hi ku Direct',
    multiCurrencyHeader: 'Mali ya ku Amukeleka: USD | ZAR | Barter',

    heroTitle1: 'Xavisa Mahlolwa, Zvimilwa neMitirho ya Mavoko e',
    heroTitleHighlight: 'Chiredzi',
    heroSubtitle: 'Musika lowu hlanganisaka valimi va nchova, vafuwi va tihomu, vasoni va swiambalo ne vatsveri hi WhatsApp eChiredzi hinkwayo.',
    searchPlaceholder: "Lava (xikombiso: 'Tihomu ta nchova', 'Swiambalo', 'Welder ya Tshovani')...",
    searchBtn: 'Lava',
    quickFind: 'Swa xihatla:',
    directWhatsApp: 'WhatsApp hi ku Direct',
    smartBarter: 'Cinca Swilo (Barter)',
    multiCurrency: 'USD ne Rhandi (ZAR)',
    verifiedArtisans: 'Vatsveri va ku Tshembeka',

    allSectors: 'Migingiriko Hinkwayo',
    livestockAgric: 'Tihomu ne Burimi',
    groceryWholesale: 'Swakudya ne Tigrosari',
    clothingTextiles: 'Swiambalo ne Vurhungi',
    buildingConstruction: 'Ku Aka ne Hardware',
    industrialTrades: 'Welding ne Titirho',
    haulageTransport: 'Tilori ne Zvitutsi',
    generalServices: 'Swilo Hinkwaswo',
    woodworkBuilding: 'Pulanga ne ku Aka',
    solarHardware: 'Solar ne Swiphemu',

    allLocations: 'Tindhawu Hinkwato',
    allCurrencies: 'Mali Hinkwayo',
    barterAccepted: 'ku Cinca ka Amukeleka',
    caneHarvestReady: 'Swa Nchova swi Lulamerile',
    clearFilters: 'Sula Hinkwaswo',
    showingListings: 'Ku Hlawuriwile',
    activeTradeOffers: 'swilo swo xavisa eLowveld',

    buyNowCash: 'Xava hi Mali (USD/ZAR)',
    contactSeller: 'Vulavula ne Muxavisi',
    proposeBarter: 'Cinca Xilo (Barter)',
    barterOnly: 'KU CINCA NTSENA',
    barterTerms: 'Swilaveko swo cinca: ',
    viewDetail: 'Vona Swiphemu Hinkwaswo',

    buyModalTitle: 'Xava hi Mali (USD / ZAR Cash)',
    buyModalSubtitle: 'Xava hi ku direct eka',
    purchaseMethod: 'Ndlela yo xava ne ku amukela',
    cashOnDelivery: 'Hakela hi mavoko loko u amukela eChiredzi',
    pickupLocation: 'Ndhawu yo amukela',
    buyerName: 'Vito ra wena hinkwaro',
    buyerPhone: 'Nomboro ya wena ya WhatsApp',
    paymentCurrency: 'Mali yo hakela hi yona',
    submitCashOrder: 'Rhumela oda yo xava',
    orderSubmitted: 'Oda yi Rhumeriwile!',
    openWhatsAppBuy: 'Pfula WhatsApp ku Xava',

    barterModalTitle: 'Kombela ku Cinca Xilo',
    whatYouOffer: 'U na yini xo cincisa hi xona?',
    offerDetails: 'Vuxokoxoko bya nyiko ya wena',
    submitBarterOffer: 'Rhumela ku Cinca',

    offeringDetails: 'Vuxokoxoko bya Chixaviso',
    listedPriceTerms: 'Ntsengo / Swilaveko:',
    sellerProfile: 'Profayili ya Muxavisi',
    completedTrades: 'Swo Cincisiwa',
    rating: 'Xiyimo',
  },
};
