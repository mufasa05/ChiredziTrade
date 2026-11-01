export type Language = 'en' | 'sn' | 'nd' | 'ts' | 'zh' | 'to';

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

  // Sidebar & Navigation Links
  navHome: string;
  navMarketplace: string;
  navBarterHub: string;
  navMyListings: string;
  navMessages: string;
  navWallet: string;
  navFavorites: string;
  navSettings: string;
  sovereignTradeNetwork: string;
  protectedEscrowSwaps: string;

  // Top Bar & Global Header
  allZimbabwe: string;
  activeMarket: string;
  guestTrader: string;
  tapToSignIn: string;
  searchGlobalPlaceholder: string;
  liveNotifications: string;
  noNotificationsYet: string;
  noNotificationsDesc: string;
  markAllRead: string;
  exploreMarketplace: string;
  servicesCatalog: string;

  // Hero Section ("Trade More. Get More.")
  heroTradeMore: string;
  heroGetMore: string;
  heroTagline: string;
  heroSearchPlaceholder: string;
  heroSearchBtn: string;
  buyAndSell: string;
  swapGoods: string;
  topUp: string;
  tradeServices: string;
  localTradeSlogan: string;
  brighterZimbabwe: string;
  joinCommunity: string;
  supportLocalBiz: string;
  buildStrongerZim: string;

  // Legacy Hero Keys for Compatibility
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

  // Category Pills
  catAgric: string;
  catElectronics: string;
  catFashion: string;
  catHome: string;
  catVehicles: string;
  catProperties: string;
  catServices: string;
  catEducation: string;
  catJobs: string;
  catMore: string;

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
  // 1. ENGLISH (EN)
  en: {
    brandSubtitle: 'Zimbabwe Barter, Goods & Artisan Trades Engine',
    marketplace: 'Zim Barter Market',
    smartBarterHub: 'Smart Barter Engine',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Post Listing',
    tryWhatsAppBot: 'WhatsApp Bot',
    liveMarket: 'Zimbabwe Live Market Feed',
    multiCurrencyHeader: 'Multi-Currency: USD | ZWG | ZAR | BARTER',

    navHome: 'Home',
    navMarketplace: 'Marketplace',
    navBarterHub: 'Barter Hub',
    navMyListings: 'My Listings',
    navMessages: 'Messages',
    navWallet: 'Wallet & Trades',
    navFavorites: 'Favourites',
    navSettings: 'Settings',
    sovereignTradeNetwork: 'Sovereign Trade Network',
    protectedEscrowSwaps: 'Protected Escrow & Swaps',

    allZimbabwe: 'All Zimbabwe',
    activeMarket: 'Active Market',
    guestTrader: 'Guest Trader',
    tapToSignIn: 'Tap to Sign In',
    searchGlobalPlaceholder: 'Search for goods, services, or people...',
    liveNotifications: 'Live Notifications',
    noNotificationsYet: 'No notifications yet',
    noNotificationsDesc: 'Activity on your postings and orders will appear here.',
    markAllRead: 'Mark all read',
    exploreMarketplace: 'Explore Marketplace',
    servicesCatalog: 'Service Providers Catalog',

    heroTradeMore: 'Trade More.',
    heroGetMore: 'Get More.',
    heroTagline: "Zimbabwe's trusted platform to buy, sell, swap and trade goods & services — with money or anything.",
    heroSearchPlaceholder: 'What are you looking for?',
    heroSearchBtn: 'Search',
    buyAndSell: 'Buy & Sell',
    swapGoods: 'Swap Goods',
    topUp: 'Top Up',
    tradeServices: 'Trade Services',
    localTradeSlogan: 'Local Trade • Stronger Communities',
    brighterZimbabwe: 'A Brighter Zimbabwe',
    joinCommunity: 'Join a growing community',
    supportLocalBiz: 'Support local businesses',
    buildStrongerZim: 'Build a stronger Zimbabwe',

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

    catAgric: 'Agriculture',
    catElectronics: 'Electronics',
    catFashion: 'Fashion & Apparel',
    catHome: 'Home & Living',
    catVehicles: 'Vehicles',
    catProperties: 'Properties',
    catServices: 'Services',
    catEducation: 'Education',
    catJobs: 'Jobs',
    catMore: 'More',

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

  // 2. SHONA (SN)
  sn: {
    brandSubtitle: 'Kutsinhana neKutenga neKutengesa muZimbabwe',
    marketplace: 'Musika weZim Barter',
    smartBarterHub: 'Nzvimbo yeKuchinjana (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Isa Chigadzirwa',
    tryWhatsAppBot: 'Bvunza WhatsApp Bot',
    liveMarket: 'Musika weZimbabwe Mupenyu',
    multiCurrencyHeader: 'Mari Inobvumidzwa: USD | ZWG | ZAR | Barter',

    navHome: 'Kumba',
    navMarketplace: 'Musika',
    navBarterHub: 'Kuchinjana (Barter)',
    navMyListings: 'Zvangu Zviripo',
    navMessages: 'Mameseji',
    navWallet: 'Homwe & Mabasa',
    navFavorites: 'Zvandada',
    navSettings: 'Zvirongwa',
    sovereignTradeNetwork: 'Musika weChiredzi neZimbabwe',
    protectedEscrowSwaps: 'Chengetedzo neKuchinjana Kwakachengeteka',

    allZimbabwe: 'Zimbabwe Yese',
    activeMarket: 'Musika Uri Kushanda',
    guestTrader: 'Muenzi Mutengi',
    tapToSignIn: 'Dzvanya Kuti Upinde',
    searchGlobalPlaceholder: 'Tsvaga zvinhu, mabasa emaoko, kana vanhu...',
    liveNotifications: 'Zviziviso Zviripo',
    noNotificationsYet: 'Hapana zviziviso parizvino',
    noNotificationsDesc: 'Zvese zvine chekuita nezvigadzirwa nemaodha ako zvichaonekwa pano.',
    markAllRead: 'Verenga zvese',
    exploreMarketplace: 'Ona Musika Wese',
    servicesCatalog: 'Katarogu yeMabasa eMaoko',

    heroTradeMore: 'Shandisa Zvakawanda.',
    heroGetMore: 'Wana Zvakawanda.',
    heroTagline: 'Musika weZimbabwe wakavimbika wekutenga, kutengesa nekuchinjana nhumbi nemabasa — nemari kana chero chaunacho.',
    heroSearchPlaceholder: 'Uri kutsvagei nhasi?',
    heroSearchBtn: 'Tsvaga',
    buyAndSell: 'Tenga & Tengesa',
    swapGoods: 'Chinjana Nhumbi',
    topUp: 'Wedzera Mari',
    tradeServices: 'Mabasa eMaoko',
    localTradeSlogan: 'Kutengesana Kwedu • Kubatana Kwevanhu',
    brighterZimbabwe: 'Zimbabwe Inopenya',
    joinCommunity: 'Batana nevamwe vatengi',
    supportLocalBiz: 'Batsira mabhizimusi edu emuno',
    buildStrongerZim: 'Vaka Zimbabwe yakasimba',

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

    catAgric: 'Zvekurima & Zvipfuyo',
    catElectronics: 'Zvemagetsi & Mafoni',
    catFashion: 'Mbatya & Zvitoro',
    catHome: 'Zvepamusha',
    catVehicles: 'Mota & Dhirivhari',
    catProperties: 'Dzimba & Minda',
    catServices: 'Mabasa eMaoko',
    catEducation: 'Zvedzidzo & Mabhuku',
    catJobs: 'Mabasa eMabasa',
    catMore: 'Zvimwe Zvose',

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

  // 3. NDEBELE (ND)
  nd: {
    brandSubtitle: 'Ukuntshintshisana leUkuthenga muZimbabwe',
    marketplace: 'Imakethe yeZim Barter',
    smartBarterHub: 'Inkabazwe Yentshintsho (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Faka Okuthengisayo',
    tryWhatsAppBot: 'Sebenzisa WhatsApp Bot',
    liveMarket: 'Imakethe yeZimbabwe',
    multiCurrencyHeader: 'Imali Ezamukelwayo: USD | ZWG | ZAR | Barter',

    navHome: 'Ekhaya',
    navMarketplace: 'Imakethe',
    navBarterHub: 'Intshintsho (Barter)',
    navMyListings: 'Impahla Zami',
    navMessages: 'Imilayezo',
    navWallet: 'Isikhwama leMisebenzi',
    navFavorites: 'Okuthandwayo',
    navSettings: 'Izilungiselelo',
    sovereignTradeNetwork: 'Imakethe Ethembekileyo yeZimbabwe',
    protectedEscrowSwaps: 'Ukuvikeleka Kwempahla leNtshintsho',

    allZimbabwe: 'Zimbabwe Yonke',
    activeMarket: 'Imakethe Esenzayo',
    guestTrader: 'Isihambi Somthengisi',
    tapToSignIn: 'Cofa Ukungena',
    searchGlobalPlaceholder: 'Cinga impahla, imisebenzi yezandla, loba abantu...',
    liveNotifications: 'Izaziso Ezikhona',
    noNotificationsYet: 'Azikho izaziso okwamanje',
    noNotificationsDesc: 'Konke okwenzakala empahleni yakho lakuma-oda kuzavela lapha.',
    markAllRead: 'Funda konke',
    exploreMarketplace: 'Buka Imakethe Yonke',
    servicesCatalog: 'Uhlu Lwabasebenzi',

    heroTradeMore: 'Thengisa Kakhulu.',
    heroGetMore: 'Thola Okunengi.',
    heroTagline: 'Imakethe yeZimbabwe ethembekileyo yokuthenga, ukuthengisa lokuntshintshisana impahla lezemisebenzi — ngemali loba ngaloba yini.',
    heroSearchPlaceholder: 'Udingani lamuhla?',
    heroSearchBtn: 'Cinga',
    buyAndSell: 'Thenga & Thengisa',
    swapGoods: 'Ntshintsha Impahla',
    topUp: 'Faka Imali',
    tradeServices: 'Imisebenzi Yezandla',
    localTradeSlogan: 'Ezendawo • Ukubambana Komphakathi',
    brighterZimbabwe: 'IZimbabwe Ekhanyayo',
    joinCommunity: 'Hlanganyela labathengisi',
    supportLocalBiz: 'Sekela amabhizinisi endawo',
    buildStrongerZim: 'Yakha iZimbabwe eqinileyo',

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

    catAgric: 'Ezolimo leZifuyo',
    catElectronics: 'Ezamagetsi lamaFoni',
    catFashion: 'Izembatho leZitolo',
    catHome: 'Ezomuzi',
    catVehicles: 'Izimota lezithuthi',
    catProperties: 'Izindlu leMihlaba',
    catServices: 'Imisebenzi Yezandla',
    catEducation: 'Imfundo lamabhuku',
    catJobs: 'Imisebenzi',
    catMore: 'Okunye Konke',

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

  // 4. XHANGANI / XITSONGA / SHANGAAN (TS) - Lowveld, Chiredzi & Masvingo
  ts: {
    brandSubtitle: 'ku Cinca ne ku Xavisa e Zimbabwe Hinkwayo',
    marketplace: 'Musika wa Zim Barter',
    smartBarterHub: 'Huvo ya ku Cincana (Barter)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Veka Chixaviso',
    tryWhatsAppBot: 'Tirhisa WhatsApp Bot',
    liveMarket: 'Musika wa Zimbabwe hi ku Direct',
    multiCurrencyHeader: 'Mali ya ku Amukeleka: USD | ZWG | ZAR | Barter',

    navHome: 'Kaya',
    navMarketplace: 'Makete',
    navBarterHub: 'Ku Cincana (Barter)',
    navMyListings: 'Switirhisiwa Swanga',
    navMessages: 'Marungula',
    navWallet: 'Nkwama & Mabindzu',
    navFavorites: 'Switsundzuxo',
    navSettings: 'Malulamiselo',
    sovereignTradeNetwork: 'Makete yo Tshembeka ya Lowveld & Zimbabwe',
    protectedEscrowSwaps: 'Kuhlayiseka ka Bindzu & ku Cincana',

    allZimbabwe: 'Zimbabwe Hinkwayo',
    activeMarket: 'Makete Leyi Tirhaka',
    guestTrader: 'Mupfhumba',
    tapToSignIn: 'Tlanya ku Nghena',
    searchGlobalPlaceholder: 'Lava tinhundlu, mitirho ya mavoko, kumbe vanhu...',
    liveNotifications: 'Switiviso Sweswi',
    noNotificationsYet: 'A ku na switiviso swa ha ri sweswi',
    noNotificationsDesc: 'Swilo hinkwaswo swa swixavisiwa na ti-oda swi ta vonakala laha.',
    markAllRead: 'Hlayela hinkwaswo',
    exploreMarketplace: 'Vona Makete Hinkwayo',
    servicesCatalog: 'Khataloko ya Vutirheli',

    heroTradeMore: 'Bindzula Swinene.',
    heroGetMore: 'Kuma Swinene.',
    heroTagline: "Makete yo tshembeka ya Zimbabwe yo xava, xavisa na ku cincana tinhundlu na vutirheli — hi mali kumbe xin'wana.",
    heroSearchPlaceholder: 'U lava yini namuntlha?',
    heroSearchBtn: 'Lava',
    buyAndSell: 'Xava & Xavisa',
    swapGoods: 'Cincana Tinhundlu',
    topUp: 'Engetela Mali',
    tradeServices: 'Vutirheli',
    localTradeSlogan: 'Mabindzu ya Kwala • Ku Kula ka Vaaki',
    brighterZimbabwe: 'Zimbabwe yo Vangama',
    joinCommunity: 'Hlanganani na vaxavisi vanwana',
    supportLocalBiz: 'Seketerani mabindzu ya kwala kaye',
    buildStrongerZim: 'Akani Zimbabwe yo tiya',

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

    catAgric: 'Vurimi & Tihomu',
    catElectronics: 'Gezi & Tifoni',
    catFashion: 'Swiambalo',
    catHome: 'Swamuti',
    catVehicles: 'Mimovha & Tilori',
    catProperties: 'Yindlu & Misava',
    catServices: 'Vutirheli',
    catEducation: 'Dyondzo & Tibuku',
    catJobs: 'Mintirho',
    catMore: "Swin'wana",

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

  // 5. MANDARIN CHINESE (ZH) - 针对津巴布韦华人商业社群
  zh: {
    brandSubtitle: '津巴布韦多货币物物置换与商品贸易服务引擎',
    marketplace: 'ZimBarter 贸易集市',
    smartBarterHub: '智能物物置换引擎',
    whatsAppEngine: 'WhatsApp 智能互联',
    postListing: '发布供求信息',
    tryWhatsAppBot: '体验 WhatsApp 机器人',
    liveMarket: '津巴布韦全境实时市场',
    multiCurrencyHeader: '结算币种: USD美元 | ZWG新元 | ZAR兰特 | 物物置换',

    navHome: '首页',
    navMarketplace: '交易市场',
    navBarterHub: '物物置换中心',
    navMyListings: '我的发布与库存',
    navMessages: '商贸私信',
    navWallet: '资金钱包与账目',
    navFavorites: '收藏与关注',
    navSettings: '账户与KYC设置',
    sovereignTradeNetwork: '津巴布韦认证主权商业网络',
    protectedEscrowSwaps: '第三方资金托管与置换保障',

    allZimbabwe: '全津巴布韦',
    activeMarket: '活跃市场',
    guestTrader: '访客交易者',
    tapToSignIn: '点击登录账号',
    searchGlobalPlaceholder: '搜索商品、机械、工匠或商户...',
    liveNotifications: '最新商机通知',
    noNotificationsYet: '暂无新通知',
    noNotificationsDesc: '您的商品订单、询盘与置换提议将实时显示在此处。',
    markAllRead: '全部标记为已读',
    exploreMarketplace: '浏览全境商品集市',
    servicesCatalog: '认证工匠与承包商目录',

    heroTradeMore: '扩大交易。',
    heroGetMore: '获取更多。',
    heroTagline: '津巴布韦值得信赖的多货币与物物置换交易平台——支持现金或任意物资置换农产品、矿山机械与本地服务。',
    heroSearchPlaceholder: '您在寻找什么物资或工匠服务？',
    heroSearchBtn: '搜索商机',
    buyAndSell: '现金买卖',
    swapGoods: '物资置换',
    topUp: '现金差价补足',
    tradeServices: '工匠承包',
    localTradeSlogan: '本地商业贸易 • 繁荣社区经济',
    brighterZimbabwe: '共建繁荣津巴布韦',
    joinCommunity: '加入互助商人网络',
    supportLocalBiz: '支持本地工商业发展',
    buildStrongerZim: '促进经济活力与商品流通',

    heroTitle1: '在津巴布韦全境置换交易农牧产品、矿业设备与工程服务于 ',
    heroTitleHighlight: '津巴布韦',
    heroSubtitle: '直连哈拉雷、布拉瓦约、穆塔雷、马斯温戈、奇雷济及全境农场、工矿企业、商铺与专业技工。',
    searchPlaceholder: "输入关键字 (如: 'Brahman优质肉牛', '布拉瓦约电焊工', '太阳能光伏套件')...",
    searchBtn: '搜索',
    quickFind: '热门搜索:',
    directWhatsApp: '直接 WhatsApp 洽谈',
    smartBarter: '智能物品置换',
    multiCurrency: '美元 / 新元 / 兰特',
    verifiedArtisans: '官方认证商户',

    catAgric: '农牧林业',
    catElectronics: '电子数码',
    catFashion: '服装箱包',
    catHome: '家居建材',
    catVehicles: '车辆机械与运输',
    catProperties: '房产与农业用地',
    catServices: '专业工匠服务',
    catEducation: '图书教育',
    catJobs: '工程招聘',
    catMore: '更多全部分类',

    allSectors: '所有行业门类',
    livestockAgric: '牲畜肉牛与农副产品',
    groceryWholesale: '批发食品与日杂',
    clothingTextiles: '服装纺织与裁缝',
    buildingConstruction: '建筑工程与五金五交',
    industrialTrades: '机械加工与电气焊接',
    haulageTransport: '卡车物流与皮卡货运',
    generalServices: '综合零售与商户',
    woodworkBuilding: '木材加工与木工',
    solarHardware: '太阳能光伏与发电机',

    allLocations: '所有城市与省份',
    allCurrencies: '全部结算币种',
    barterAccepted: '支持物物置换',
    caneHarvestReady: '现货/即期交付',
    clearFilters: '重置筛选条件',
    showingListings: '正在显示',
    activeTradeOffers: '个津巴布韦活跃交易商机',

    buyNowCash: '现金直接采购 (USD/ZWG)',
    contactSeller: '联络货主商户',
    proposeBarter: '发起物品互换提议',
    barterOnly: '仅限物资置换',
    barterTerms: '货主置换要求: ',
    viewDetail: '查看商品详情',

    buyModalTitle: '现金订购 (USD / ZWG / ZAR)',
    buyModalSubtitle: '向卖家当面验货交付与结算',
    purchaseMethod: '交易结算方式',
    cashOnDelivery: '货到当面验货结算',
    pickupLocation: '指定交货提货网点',
    buyerName: '采购方姓名 / 企业名称',
    buyerPhone: 'WhatsApp 联络电话',
    paymentCurrency: '结算支付货币',
    submitCashOrder: '确认提交采购订单',
    orderSubmitted: '采购订单提交成功！',
    openWhatsAppBuy: '打开预填 WhatsApp 快速洽谈',

    barterModalTitle: '提交物资对等置换方案',
    whatYouOffer: '您愿意提供置换的物资或技能服务？',
    offerDetails: '物资详细说明 (数量、成色规格、置换条件)',
    submitBarterOffer: '正式递交置换要约',

    offeringDetails: '供应商品详情',
    listedPriceTerms: '标价 / 交易条款:',
    sellerProfile: '商户认证档案',
    completedTrades: '累计履约单数',
    rating: '信誉评分',
  },

  // 6. CHITONGA (TO) - Zambezi Valley, Binga, Kariba, Victoria Falls
  to: {
    brandSubtitle: 'Kucinjana a Kusambala zintu mu Zimbabwe',
    marketplace: 'Musika wa Zim Barter',
    smartBarterHub: 'Cilawo ca Kucinjana (Barter Hub)',
    whatsAppEngine: 'WhatsApp Bot Hub',
    postListing: 'Bika Cintu Cako',
    tryWhatsAppBot: 'Sebenzesya WhatsApp Bot',
    liveMarket: 'Musika Mupati wa Zimbabwe',
    multiCurrencyHeader: 'Mali Izwididwe: USD | ZWG | ZAR | Barter',

    navHome: 'Kumunzi',
    navMarketplace: 'Musika',
    navBarterHub: 'Kucinjana (Barter)',
    navMyListings: 'Zintu Zangu',
    navMessages: 'Mulumbe',
    navWallet: 'Cikwama ca Malelo',
    navFavorites: 'Ziyandikonda',
    navSettings: 'Kusala',
    sovereignTradeNetwork: 'Musika Musyomeki wa Zimbabwe',
    protectedEscrowSwaps: 'Lukwabilo lwa Zintu a Kucinjana',

    allZimbabwe: 'Zimbabwe Yoonse',
    activeMarket: 'Musika Ubeleka',
    guestTrader: 'Mweendinyina',
    tapToSignIn: 'Dida Kuti Unjile',
    searchGlobalPlaceholder: 'Yanda zintu, milimo, na bantu...',
    liveNotifications: 'Zyakumvwa Zyacino',
    noNotificationsYet: 'Taakwe zyakumvwa zyalino',
    noNotificationsDesc: 'Zintu zyako zyoonse ziyooboneka aano.',
    markAllRead: 'Bala zyoonse',
    exploreMarketplace: 'Langa Musika Yoonse',
    servicesCatalog: 'Babelesi ba Milimo',

    heroTradeMore: 'Sambala Manji.',
    heroGetMore: 'Jana Zinjinji.',
    heroTagline: 'Musika musyomeki wa Zimbabwe wakusambala, kuula a kucinjana zintu amilimo — a mali na acili coonse.',
    heroSearchPlaceholder: 'Ino uyanda nzi sunu?',
    heroSearchBtn: 'Yanda',
    buyAndSell: 'Ula & Sambala',
    swapGoods: 'Cinjana Zintu',
    topUp: 'Yungizya Mali',
    tradeServices: 'Milimo ya Maanza',
    localTradeSlogan: 'Kusambala Kwesu • Kuyumya Bana-Afrika',
    brighterZimbabwe: 'Zimbabwe Yabulemu',
    joinCommunity: 'Sungana abasambazi bamwi',
    supportLocalBiz: 'Gwasyilizya mabbizinesi aamunzi',
    buildStrongerZim: 'Yaka Zimbabwe iiyumu',

    heroTitle1: 'Sambala Banyama, Zyalilwa, Zisani a Milimo mu ',
    heroTitleHighlight: 'Zimbabwe',
    heroSubtitle: 'Musika ubaswaanganya balimi, bavubi, basami a babelesi ku-WhatsApp muHarare, Bulawayo, Chiredzi aZimbabwe yoonse.',
    searchPlaceholder: "Yanda (mucikozyanyo: 'Iŋombe', 'Babelesi', 'Solar kit')...",
    searchBtn: 'Yanda',
    quickFind: 'Ziyandisya:',
    directWhatsApp: 'WhatsApp Luundusi',
    smartBarter: 'Kucinjana Zintu',
    multiCurrency: 'USD / ZWG / Rhandi',
    verifiedArtisans: 'Babelesi Basyomeka',

    catAgric: 'Bulimi & Banyama',
    catElectronics: 'Magesi & Mafoni',
    catFashion: 'Zisani & Mabbudiki',
    catHome: 'Zyamuŋanda',
    catVehicles: 'Mootokala & Mabbaki',
    catProperties: 'Maanda & Nyika',
    catServices: 'Milimo ya Maanza',
    catEducation: 'Lwiiyo & Mabbuku',
    catJobs: 'Milimo',
    catMore: 'Zimwi Zyoonse',

    allSectors: 'Mbali Zyoonse',
    livestockAgric: 'Banyama a Zilimo',
    groceryWholesale: 'Zyakulya a Magulosali',
    clothingTextiles: 'Zisani a Basumi',
    buildingConstruction: 'Kuyaka a Simenti',
    industrialTrades: 'Welding a Milimo mipati',
    haulageTransport: 'Maloli a Mitolo',
    generalServices: 'Zintu Zyoonse',
    woodworkBuilding: 'Basena a Kuyaka',
    solarHardware: 'Solar a Zibelesyo',

    allLocations: 'Mataundi Oonse',
    allCurrencies: 'Mali Yoonse',
    barterAccepted: 'Kucinjana Kulazumizigwa',
    caneHarvestReady: 'Cilibambilidwe',
    clearFilters: 'Zwisya Zisalidwe',
    showingListings: 'Zilatondezegwa',
    activeTradeOffers: 'zintu zisambalwa muZimbabwe',

    buyNowCash: 'Ula a Mali (USD/ZWG)',
    contactSeller: 'Buzya Musambazi',
    proposeBarter: 'Cinjana',
    barterOnly: 'KUCINJANA LUKUKE',
    barterTerms: 'Milawo yakucinjana: ',
    viewDetail: 'Langa Zyoonse',

    buyModalTitle: 'Ula a Mali (USD / ZWG Cash)',
    buyModalSubtitle: 'Ula luundusi kuli musambazi',
    purchaseMethod: 'Nzila yakuula',
    cashOnDelivery: 'Bbadela amumano',
    pickupLocation: 'Busena bwakuulila',
    buyerName: 'Izina lyako lyoonse',
    buyerPhone: 'Nombolo ya WhatsApp',
    paymentCurrency: 'Mali yobbadela',
    submitCashOrder: 'Tumya Muzeezo',
    orderSubmitted: 'Oda Yatumwa!',
    openWhatsAppBuy: 'Jula WhatsApp ku Ula',

    barterModalTitle: 'Amba Zyakucinjana',
    whatYouOffer: 'Ino ujisi nzi cakucinjanya?',
    offerDetails: 'Mulumbe wazintu zyako',
    submitBarterOffer: 'Tumya Muzeezo Wakucinjana',

    offeringDetails: 'Mulumbe wa Cintu',
    listedPriceTerms: 'Muulo / Milawo:',
    sellerProfile: 'Bukkale bwa Musambazi',
    completedTrades: 'Zyamana',
    rating: 'Cikozyanyo',
  },
};
