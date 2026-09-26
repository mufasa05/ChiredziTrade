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
    brandSubtitle: 'Zimbabwe Barter, Goods & Artisan Trades Engine',
    marketplace: 'Zim Barter Market',
    smartBarterHub: 'Smart Barter Engine',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Post Listing',
    tryWhatsAppBot: 'WhatsApp Bot',
    liveMarket: 'Zimbabwe Live Market Feed',
    multiCurrencyHeader: 'Multi-Currency: USD | ZWG | ZAR | BARTER',

    heroTitle1: 'Trade Goods, Produce, Services & Swap Items Across ',
    heroTitleHighlight: 'Zimbabwe',
    heroSubtitle: 'Direct WhatsApp marketplace connecting farmers, ranchers, traders, artisans, and businesses across Harare, Bulawayo, Mutare, Masvingo, Chiredzi & nationwide.',
    searchPlaceholder: "Search (e.g. 'Brahman heifers Harare', 'Welder Bulawayo', 'Solar kit Mutare')...",
    searchBtn: 'Search',
    quickFind: 'Quick find:',
    directWhatsApp: 'Direct WhatsApp',
    smartBarter: 'Smart Barter',
    multiCurrency: 'USD / ZWG / ZAR',
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

    allLocations: 'All Cities & Towns',
    allCurrencies: 'All Currencies',
    barterAccepted: 'Barter Accepted',
    caneHarvestReady: 'Harvest Ready',
    clearFilters: 'Clear Filters',
    showingListings: 'Showing',
    activeTradeOffers: 'active trade offers across Zimbabwe',

    buyNowCash: 'Buy (Cash USD/ZWG)',
    contactSeller: 'Contact Seller',
    proposeBarter: 'Swap Offer',
    barterOnly: 'BARTER ONLY',
    barterTerms: 'Barter Terms: ',
    viewDetail: 'View Detail',

    buyModalTitle: 'Buy with Cash (USD / ZWG / ZAR)',
    buyModalSubtitle: 'Direct collection & payment from seller',
    purchaseMethod: 'Payment & Collection Method',
    cashOnDelivery: 'Cash on Handover / Collection',
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
    brandSubtitle: 'Kutsinhana neKutenga neKutengesa muZimbabwe',
    marketplace: 'Musika weZim Barter',
    smartBarterHub: 'Nzvimbo yeKuchinjana (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Isa Chigadzirwa',
    tryWhatsAppBot: 'Bvunza WhatsApp Bot',
    liveMarket: 'Musika weZimbabwe Mupenyu',
    multiCurrencyHeader: 'Mari Inobvumidzwa: USD | ZWG | ZAR | Barter',

    heroTitle1: 'Tengesa Zvipfuyo, Mbeu, Mbatya neMabasa eMaoko mu',
    heroTitleHighlight: 'Zimbabwe',
    heroSubtitle: 'Musika unobatanidza varimi, vapfuyi, vasoni, magirosari nema-welder paWhatsApp muHarare, Bulawayo, Mutare, Masvingo, Chiredzi neZimbabwe yese.',
    searchPlaceholder: "Tsvaga (se: 'Mombe dzemukaka Harare', 'Welder Bulawayo', 'Solar kit')...",
    searchBtn: 'Tsvaga',
    quickFind: 'Zvakakurumbira:',
    directWhatsApp: 'WhatsApp Imwe neImwe',
    smartBarter: 'Kuchinjana Zvinhu',
    multiCurrency: 'USD / ZWG / Randi',
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

    allLocations: 'Maguta Ese neMataundi',
    allCurrencies: 'Mari Dzese',
    barterAccepted: 'Kuchinjana Kunoita',
    caneHarvestReady: 'Zvakagadzirira',
    clearFilters: 'Dzima Zvakasarudzwa',
    showingListings: 'Zviratidzwa',
    activeTradeOffers: 'zvinhu zviripo muZimbabwe yese',

    buyNowCash: 'Tenga neMari (USD/ZWG)',
    contactSeller: 'Bata Mutengesi',
    proposeBarter: 'Chinjana Zvinhu',
    barterOnly: 'KUCHINJANA CHETE',
    barterTerms: 'Zviga zvekuchinjana: ',
    viewDetail: 'Wona Zvakazara',

    buyModalTitle: 'Tenga neMari (USD / ZWG Cash)',
    buyModalSubtitle: 'Tenga zvakananga kubva kuna mutengesi',
    purchaseMethod: 'Nzira yekutenga nekugamuchira',
    cashOnDelivery: 'Bhadhara Pamaoko uchiitora',
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
    brandSubtitle: 'Ukuntshintshisana leUkuthenga muZimbabwe',
    marketplace: 'Imakethe yeZim Barter',
    smartBarterHub: 'Inkabazwe Yentshintsho (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Faka Okuthengisayo',
    tryWhatsAppBot: 'Sebenzisa WhatsApp Bot',
    liveMarket: 'Imakethe yeZimbabwe',
    multiCurrencyHeader: 'Imali Ezamukelwayo: USD | ZWG | ZAR | Barter',

    heroTitle1: 'Thengisa Inkomo, Zvezulimo meZenzo Zezandla e',
    heroTitleHighlight: 'Zimbabwe',
    heroSubtitle: 'Imakethe exhumanisa balimi, babuyisi benkomo, abathengisi lokugqoka labatshayeli bamaloli ku-WhatsApp eHarare, Bulawayo, Mutare, Chiredzi leZimbabwe yonke.',
    searchPlaceholder: "Cinga (isbonelo: 'Inkomo zokusenga', 'Welder eBulawayo', 'Solar')...",
    searchBtn: 'Cinga',
    quickFind: 'Okudingwa kakhulu:',
    directWhatsApp: 'WhatsApp Ngqo',
    smartBarter: 'Ukuntshintshisana',
    multiCurrency: 'USD / ZWG / Randi',
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

    allLocations: 'Izindawo Zonke',
    allCurrencies: 'Imali Zonke',
    barterAccepted: 'Ukuntshintshana Kuyavunywa',
    caneHarvestReady: 'Kulungele',
    clearFilters: 'Sula Konke',
    showingListings: 'Kutshengiswa',
    activeTradeOffers: 'izinto ezithengiswayo eZimbabwe',

    buyNowCash: 'Thenga ngemali (USD/ZWG)',
    contactSeller: 'Xhumana Muthengisi',
    proposeBarter: 'Ntshintshisa',
    barterOnly: 'UKUNTSHINTSHISA KWEDWA',
    barterTerms: 'Izimfuno zokuntshintsha: ',
    viewDetail: 'Bona Konke',

    buyModalTitle: 'Thenga ngemali (USD / ZWG Cash)',
    buyModalSubtitle: 'Thenga ngqo kuye muthengisi',
    purchaseMethod: 'Indlela yokuthenga lokuyithatha',
    cashOnDelivery: 'Bhadala ngezandla xa uyithatha',
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
    brandSubtitle: 'ku Cinca ne ku Xavisa e Zimbabwe Hinkwayo',
    marketplace: 'Musika wa Zim Barter',
    smartBarterHub: 'Ndhawu ya ku Cinca (Barter Hub)',
    whatsAppEngine: 'WhatsApp Bot Engine',
    postListing: 'Veka Chixaviso',
    tryWhatsAppBot: 'Tirhisa WhatsApp Bot',
    liveMarket: 'Musika wa Zimbabwe hi ku Direct',
    multiCurrencyHeader: 'Mali ya ku Amukeleka: USD | ZWG | ZAR | Barter',

    heroTitle1: 'Xavisa Mahlolwa, Zvimilwa neMitirho ya Mavoko e',
    heroTitleHighlight: 'Zimbabwe',
    heroSubtitle: 'Musika lowu hlanganisaka valimi, vafuwi, vasoni va swiambalo ne vatsveri hi WhatsApp eHarare, Bulawayo, Mutare, Chiredzi eZimbabwe hinkwayo.',
    searchPlaceholder: "Lava (xikombiso: 'Tihomu ta nchova', 'Swiambalo', 'Solar kit')...",
    searchBtn: 'Lava',
    quickFind: 'Swa xihatla:',
    directWhatsApp: 'WhatsApp hi ku Direct',
    smartBarter: 'Cinca Swilo (Barter)',
    multiCurrency: 'USD / ZWG / Rhandi',
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

    allLocations: 'Mitsemo Hinkwayo',
    allCurrencies: 'Mali Hinkwayo',
    barterAccepted: 'ku Cinca ka Amukeleka',
    caneHarvestReady: 'Swa Lulamerile',
    clearFilters: 'Sula Hinkwaswo',
    showingListings: 'Ku Hlawuriwile',
    activeTradeOffers: 'swilo swo xavisa eZimbabwe',

    buyNowCash: 'Xava hi Mali (USD/ZWG)',
    contactSeller: 'Vulavula ne Muxavisi',
    proposeBarter: 'Cinca Xilo (Barter)',
    barterOnly: 'KU CINCA NTSENA',
    barterTerms: 'Swilaveko swo cinca: ',
    viewDetail: 'Vona Swiphemu Hinkwaswo',

    buyModalTitle: 'Xava hi Mali (USD / ZWG Cash)',
    buyModalSubtitle: 'Xava hi ku direct eka muxavisi',
    purchaseMethod: 'Ndlela yo xava ne ku amukela',
    cashOnDelivery: 'Hakela hi mavoko loko u amukela',
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
