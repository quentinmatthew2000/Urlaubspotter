// ============================================================
//  KEUZEHULP — Accommodatie-database
//
//  Aparte data-laag onder keuzehulp.js. Bevat de volledige
//  catalogus die de aanbevelings-engine consumeert. Iedere
//  accommodatie heeft een semantisch rijk profiel zodat de
//  engine over thema's, audience en settings kan redeneren
//  i.p.v. literal tag matching.
//
//  IDs zijn gesynchroniseerd met site-data.js — Navigatie.html?
//  acc=<id> opent de bijbehorende detailpagina. Nieuwe records
//  (49+) zijn óók in site-data.js geregistreerd zodat deep-links
//  blijven werken.
//
//  Profielvelden:
//    type:                'hotel'|'camping'|'glamping'|'holiday-park'|'bungalow-park'|'villa'
//    tier:                'budget'|'comfort'|'luxe'
//    country:             keuzehulp/site slug; continent via CONTINENT_OF in keuzehulp.js
//    settings:            ligging-keys uit keuzehulp.html
//    accommodationTypes:  verblijfstype-keys uit keuzehulp.html
//    themes:              free-form reisthema's (overlap met TAG_INTENTS)
//    audience:            hard audience-flags { adultOnly, kidFriendly, petFriendly }
//    facilities:          faciliteiten-keys uit keuzehulp.html
//
//  Coverage-strategie:
//    • Iedere who-, what-, ligging- en faciliteit-key heeft minstens
//      3 accos die er sterk op matchen.
//    • Realistische overlaps i.p.v. lege wishlists — een acco mag
//      best 10+ thema's voeren mits ze geloofwaardig samengaan.
//    • Type-balans: ±35% camping/glamping, ±30% hotel, ±25% park/
//      bungalow, ±10% villa zodat verblijfstype-keuzes resultaat
//      blijven leveren ook bij smalle filters.
// ============================================================

window.KEUZEHULP_ACCOMMODATIONS = [
    // -------- ID 1-12: legacy enriched (oude keuzehulp-set) --------
    {
        id: 1, title: "Sunny Beach Resort", location: "Zeeland, Nederland", emoji: "🏖️",
        tags: ["Aan zee", "Familie", "Comfort"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer', 'appartement'],
        themes: ['beach','sun','warm','family','kid-safe','entertainment','active','clean','social','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['binnenzwembad','aan-strand','sports-games','kids-fun','entertainment','glijbanen']
    },
    {
        id: 2, title: "Family Camping Paradise", location: "Drenthe, Nederland", emoji: "⛺",
        tags: ["Camping", "Familie", "Kinderpret"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['tent','caravan','mobile-home','safari-tent'],
        themes: ['family','outdoor','nature','budget-friendly','kids-fun','active','entertainment','kid-safe','baby-friendly','social'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['glijbanen','kids-fun','sports-games','outdoor','fietsroutes','entertainment','live-muziek']
    },
    {
        id: 3, title: "Alpine Mountain Lodge", location: "Tirol, Oostenrijk", emoji: "⛰️",
        tags: ["Bergen", "Luxe", "Avontuur"],
        type: 'hotel', tier: 'luxe', country: 'oostenrijk',
        settings: ['in-bergen','natuur'],
        accommodationTypes: ['chalet','hotel-kamer'],
        themes: ['mountain','alpine','cozy','luxury','adventure','sports','snow','ski','outdoor','active','wellness','winter','spa'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['binnenzwembad','sports-games','outdoor','fietsroutes','looproutes','relax','facility-luxe']
    },
    {
        id: 4, title: "Romantic Glamping Spot", location: "Veluwe, Gelderland", emoji: "✨",
        tags: ["Glamping", "Adult Only", "Wellness"],
        type: 'glamping', tier: 'luxe', country: 'netherlands',
        settings: ['natuur','afgelegen'],
        accommodationTypes: ['safari-tent','chalet'],
        themes: ['romantic','wellness','rust','boutique','nature','quiet','intimate','glamping','adult','spa','luxury','unique','remote'],
        audience: { adultOnly: true, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','looproutes','fietsroutes','open-bar']
    },
    {
        id: 5, title: "Pet-Friendly Cottage", location: "Kennemerland, Noord-Holland", emoji: "🏡",
        tags: ["Diervriendelijk", "Natuur", "Bungalow"],
        type: 'bungalow-park', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['bungalow'],
        themes: ['nature','pet-friendly','space','family','quiet','rust','green','kid-safe','accessible'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['pet-friendly','fietsroutes','looproutes','outdoor']
    },
    {
        id: 6, title: "Water Sports Haven", location: "IJsselmeer, Friesland", emoji: "🏄",
        tags: ["Aan een meer", "Watersport", "Avontuur"],
        type: 'holiday-park', tier: 'comfort', country: 'netherlands',
        settings: ['aan-meer','natuur'],
        accommodationTypes: ['bungalow','chalet','mobile-home'],
        themes: ['lake','water','active','sports','adventure','outdoor','family','teen-friendly','social','group'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['sports-games','outdoor','fietsroutes','kids-fun','aan-strand']
    },
    {
        id: 7, title: "Boetiekhotel Parijs", location: "Parijs, Frankrijk", emoji: "🗼",
        tags: ["Stad", "Cultuur", "Boutique"],
        type: 'hotel', tier: 'comfort', country: 'frankrijk',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','romantic','adult','flexible','safe-solo','intimate'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','relax','open-bar']
    },
    {
        id: 8, title: "All-Inclusive Family Park", location: "Efteling-regio, Noord-Brabant", emoji: "🎡",
        tags: ["Vakantiepark", "All-In", "Familie"],
        type: 'holiday-park', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['bungalow','chalet'],
        themes: ['family','kids-fun','entertainment','all-in-one','all-inclusive','active','kid-safe','social','rainy-day-proof','baby-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['binnenzwembad','glijbanen','kids-fun','all-inclusive','sports-games','entertainment']
    },
    {
        id: 9, title: "Winter Ski Lodge", location: "Salzburg, Oostenrijk", emoji: "⛷️",
        tags: ["Wintersport", "Chalet", "Bergen"],
        type: 'hotel', tier: 'comfort', country: 'oostenrijk',
        settings: ['in-bergen'],
        accommodationTypes: ['chalet','hotel-kamer','appartement'],
        themes: ['snow','ski','mountain','cozy','active','sports','adventure','outdoor','winter','social','group','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['sports-games','outdoor','live-muziek','entertainment','open-bar']
    },
    {
        id: 10, title: "Secluded Nature Retreat", location: "Westerwolde, Groningen", emoji: "🌲",
        tags: ["Afgelegen", "Natuur", "Rust"],
        type: 'bungalow-park', tier: 'comfort', country: 'netherlands',
        settings: ['afgelegen','natuur'],
        accommodationTypes: ['bungalow'],
        themes: ['remote','quiet','nature','rust','green','adult','wellness','pet-friendly','accessible','solo-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['relax','looproutes','fietsroutes','pet-friendly']
    },
    {
        id: 11, title: "Costa Brava Beach Camping", location: "Costa Brava, Spanje", emoji: "🏕️",
        tags: ["Camping", "Aan zee", "Familie"],
        type: 'camping', tier: 'budget', country: 'spanje',
        settings: ['aan-zee'],
        accommodationTypes: ['tent','caravan','mobile-home','safari-tent','bungalow'],
        themes: ['beach','sun','warm','summer','family','kids-fun','kid-safe','outdoor','active','social','entertainment','budget-friendly','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','glijbanen','kids-fun','sports-games','entertainment','live-muziek']
    },
    {
        id: 12, title: "Toscaanse Luxe Glamping", location: "Chianti, Italië", emoji: "🍷",
        tags: ["Glamping", "Luxe", "Wijngaarden"],
        type: 'glamping', tier: 'luxe', country: 'italie',
        settings: ['natuur','afgelegen'],
        accommodationTypes: ['safari-tent','villa'],
        themes: ['luxury','premium','boutique','wellness','spa','romantic','intimate','adult','rust','quiet','nature','warm','summer','cultural'],
        audience: { adultOnly: true, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','open-bar','bezienswaardigheden']
    },

    // -------- ID 13-18: enriched van site-data.js --------
    {
        id: 13, title: "Ardennen Boutique Hotel", location: "Ardennen, België", emoji: "🏨",
        tags: ["Boutique", "Wellness", "Natuur"],
        type: 'hotel', tier: 'comfort', country: 'belgie',
        settings: ['natuur'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['boutique','wellness','rust','quiet','spa','romantic','intimate','adult','nature','cozy','cultural'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','looproutes','fietsroutes']
    },
    {
        id: 14, title: "Schwarzwald Chalet", location: "Schwarzwald, Duitsland", emoji: "🌲",
        tags: ["Bergen", "Chalet", "Natuur"],
        type: 'holiday-park', tier: 'comfort', country: 'duitsland',
        settings: ['in-bergen','natuur'],
        accommodationTypes: ['chalet','bungalow'],
        themes: ['mountain','nature','cozy','active','adventure','outdoor','sports','teen-friendly','social','green','winter'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['outdoor','sports-games','fietsroutes','looproutes']
    },
    {
        id: 15, title: "Algarve Beachfront", location: "Algarve, Portugal", emoji: "🌊",
        tags: ["Aan zee", "Zonvakantie", "Comfort"],
        type: 'hotel', tier: 'comfort', country: 'portugal',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer','appartement'],
        themes: ['beach','sun','warm','summer','romantic','social','active','teen-friendly','family'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','binnenzwembad','relax','sports-games','open-bar']
    },
    {
        id: 16, title: "Kroatische Kust-Villa", location: "Dalmatië, Kroatië", emoji: "⛵",
        tags: ["Villa", "Aan zee", "Vrienden"],
        type: 'villa', tier: 'luxe', country: 'kroatie',
        settings: ['aan-zee'],
        accommodationTypes: ['villa'],
        themes: ['beach','sun','warm','summer','luxury','privacy','space','social','group','adult','romantic','active'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','facility-luxe','open-bar','relax']
    },
    {
        id: 17, title: "Veluwe Bungalow Park", location: "Hoge Veluwe, Gelderland", emoji: "🌳",
        tags: ["Bos", "Bungalow", "Familie"],
        type: 'bungalow-park', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['bungalow'],
        themes: ['family','nature','green','pet-friendly','kid-safe','quiet','space','active','outdoor','baby-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['kids-fun','outdoor','fietsroutes','looproutes','pet-friendly']
    },
    {
        id: 18, title: "Utrechtse Stadsapartement", location: "Utrecht, Nederland", emoji: "🏰",
        tags: ["Stad", "Cultuur", "Appartement"],
        type: 'hotel', tier: 'budget', country: 'netherlands',
        settings: ['centrum'],
        accommodationTypes: ['appartement'],
        themes: ['centrum','urban','cultural','short-break','flexible','safe-solo','self-catering','adult','social'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden']
    },

    // -------- ID 19-21: Limburg cluster --------
    {
        id: 19, title: "Limburgs Kasteelhotel", location: "Heuvelland, Limburg", emoji: "🏰",
        tags: ["Kasteel", "Wellness", "Luxe"],
        type: 'hotel', tier: 'luxe', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['luxury','boutique','wellness','spa','romantic','rust','cozy','cultural','adult','intimate','accessible'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','binnenzwembad','bezienswaardigheden','looproutes']
    },
    {
        id: 20, title: "Heuvelland Familie Camping", location: "Valkenburg, Limburg", emoji: "⛺",
        tags: ["Camping", "Natuur", "Familie"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['tent','caravan','mobile-home','safari-tent'],
        themes: ['family','nature','outdoor','kids-fun','kid-safe','baby-friendly','active','budget-friendly','pet-friendly','cultural'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['glijbanen','kids-fun','sports-games','fietsroutes','outdoor','bezienswaardigheden']
    },
    {
        id: 21, title: "Maastricht Stadshotel", location: "Maastricht, Limburg", emoji: "🏙️",
        tags: ["Stad", "Cultuur", "Weekend"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','flexible','safe-solo','romantic','adult','intimate'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','relax','open-bar']
    },

    // -------- ID 22-23: Overijssel --------
    {
        id: 22, title: "Twentse Natuurcamping", location: "Twente, Overijssel", emoji: "🌲",
        tags: ["Camping", "Natuur", "Familie"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['tent','caravan','mobile-home'],
        themes: ['family','nature','outdoor','green','pet-friendly','active','budget-friendly','quiet','teen-friendly','kid-safe'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['outdoor','fietsroutes','looproutes','kids-fun']
    },
    {
        id: 23, title: "Salland Wellness Resort", location: "Salland, Overijssel", emoji: "💆",
        tags: ["Wellness", "Rust", "Hotel"],
        type: 'hotel', tier: 'luxe', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['wellness','spa','rust','quiet','luxury','romantic','adult','intimate','accessible','nature'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','binnenzwembad','looproutes']
    },

    // -------- ID 24-25: Flevoland --------
    {
        id: 24, title: "Oostvaarders Eco-Glamping", location: "Oostvaardersplassen, Flevoland", emoji: "✨",
        tags: ["Glamping", "Eco", "Natuur"],
        type: 'glamping', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['safari-tent','chalet'],
        themes: ['nature','green','glamping','quiet','rust','social','adult','romantic','unique','outdoor'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['outdoor','looproutes','fietsroutes']
    },
    {
        id: 25, title: "Markermeer Watersport Resort", location: "Markermeer, Flevoland", emoji: "🌊",
        tags: ["Watersport", "Aan een meer", "Sport"],
        type: 'holiday-park', tier: 'comfort', country: 'netherlands',
        settings: ['aan-meer'],
        accommodationTypes: ['bungalow','mobile-home','chalet'],
        themes: ['lake','water','active','sports','adventure','outdoor','social','teen-friendly','group','family'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['sports-games','outdoor','aan-strand','kids-fun']
    },

    // -------- ID 26-28: Zuid-Holland --------
    {
        id: 26, title: "Kinderdijk Fiets-B&B", location: "Kinderdijk, Zuid-Holland", emoji: "🚴",
        tags: ["Fietsen", "Erfgoed", "B&B"],
        type: 'hotel', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['cultural','rust','green','active','adult','safe-solo','accessible','quiet','intimate'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['fietsroutes','looproutes','bezienswaardigheden']
    },
    {
        id: 27, title: "Scheveningen Beachhouse", location: "Scheveningen, Zuid-Holland", emoji: "🏖️",
        tags: ["Aan zee", "Familie", "Stad"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['aan-zee','centrum'],
        accommodationTypes: ['hotel-kamer','appartement'],
        themes: ['beach','family','kid-safe','social','active','urban','cultural','short-break','teen-friendly','entertainment'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','bezienswaardigheden','entertainment','kids-fun']
    },
    {
        id: 28, title: "Rotterdam Design Hotel", location: "Rotterdam, Zuid-Holland", emoji: "🏙️",
        tags: ["Stad", "Design", "Boutique"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','flexible','safe-solo','social','adult','nightlife'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','relax','open-bar','live-muziek']
    },

    // -------- ID 29-30: Zeeland extra --------
    {
        id: 29, title: "Zeeuwse Dijk Camping", location: "Walcheren, Zeeland", emoji: "⛺",
        tags: ["Camping", "Aan zee", "Familie"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['aan-zee'],
        accommodationTypes: ['tent','caravan','mobile-home'],
        themes: ['beach','family','outdoor','nature','kid-safe','pet-friendly','baby-friendly','budget-friendly','quiet'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['aan-strand','outdoor','fietsroutes','kids-fun']
    },
    {
        id: 30, title: "Veerse Meer Glamping", location: "Veerse Meer, Zeeland", emoji: "✨",
        tags: ["Glamping", "Aan een meer", "Wellness"],
        type: 'glamping', tier: 'luxe', country: 'netherlands',
        settings: ['aan-meer'],
        accommodationTypes: ['safari-tent','chalet'],
        themes: ['lake','glamping','wellness','rust','romantic','quiet','luxury','adult','social','water','intimate'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['relax','aan-strand','outdoor','facility-luxe']
    },

    // -------- ID 31-32: Drenthe extra --------
    {
        id: 31, title: "Drents Heide Chalet", location: "Hondsrug, Drenthe", emoji: "🌳",
        tags: ["Chalet", "Natuur", "Rust"],
        type: 'bungalow-park', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['chalet','bungalow'],
        themes: ['nature','rust','quiet','green','accessible','adult','romantic','wellness','cozy'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['relax','fietsroutes','looproutes','outdoor']
    },
    {
        id: 32, title: "Hondsrug Boerencamping", location: "Hondsrug, Drenthe", emoji: "🐄",
        tags: ["Boerderij", "Diervriendelijk", "Familie"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['tent','caravan'],
        themes: ['family','nature','outdoor','pet-friendly','kid-safe','baby-friendly','budget-friendly','unique','quiet','green'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['pet-friendly','kids-fun','outdoor','fietsroutes']
    },

    // -------- ID 33: Noord-Holland extra (eiland) --------
    {
        id: 33, title: "Texel Duinen Villa", location: "Texel, Noord-Holland", emoji: "🏖️",
        tags: ["Eiland", "Villa", "Aan zee"],
        type: 'villa', tier: 'luxe', country: 'netherlands',
        settings: ['aan-zee','natuur'],
        accommodationTypes: ['villa','bungalow'],
        themes: ['beach','nature','family','pet-friendly','space','privacy','luxury','kid-safe','active','quiet','green'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['aan-strand','outdoor','fietsroutes','looproutes','facility-luxe','pet-friendly']
    },

    // -------- ID 34: Friesland extra --------
    {
        id: 34, title: "Waddeneiland Beach Hotel", location: "Terschelling, Friesland", emoji: "🏖️",
        tags: ["Eiland", "Aan zee", "Rust"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['beach','rust','quiet','adult','romantic','accessible','cultural','intimate','wellness','nature'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['aan-strand','relax','looproutes','fietsroutes']
    },

    // -------- ID 35: Groningen extra --------
    {
        id: 35, title: "Wadvogels Natuurretraite", location: "Lauwersmeer, Groningen", emoji: "🌾",
        tags: ["Natuur", "Rust", "Solo-vriendelijk"],
        type: 'bungalow-park', tier: 'comfort', country: 'netherlands',
        settings: ['afgelegen','natuur'],
        accommodationTypes: ['bungalow'],
        themes: ['remote','quiet','nature','rust','green','solo-friendly','adult','wellness','accessible','safe-solo'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: true },
        facilities: ['looproutes','fietsroutes','relax','pet-friendly']
    },

    // -------- ID 36: Noord-Brabant extra --------
    {
        id: 36, title: "Efteling-gebied Familiehotel", location: "Kaatsheuvel, Noord-Brabant", emoji: "🎡",
        tags: ["Attracties", "Kinderpret", "Familie"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['family','kids-fun','entertainment','baby-friendly','kid-safe','active','social','rainy-day-proof','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['kids-fun','entertainment','binnenzwembad','sports-games']
    },

    // -------- ID 37: Utrecht extra --------
    {
        id: 37, title: "Heuvelrug Adventure Camping", location: "Utrechtse Heuvelrug, Utrecht", emoji: "⛺",
        tags: ["Camping", "Avontuur", "Vrienden"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['tent','caravan','mobile-home','safari-tent'],
        themes: ['outdoor','active','sports','adventure','teen-friendly','social','nature','group','budget-friendly','green'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['outdoor','sports-games','fietsroutes','looproutes']
    },

    // -------- ID 38: Gelderland winter --------
    {
        id: 38, title: "Veluwe Winter Lodge", location: "Veluwe, Gelderland", emoji: "❄️",
        tags: ["Winter", "Wellness", "Bos"],
        type: 'hotel', tier: 'comfort', country: 'netherlands',
        settings: ['natuur'],
        accommodationTypes: ['chalet','bungalow','hotel-kamer'],
        themes: ['cozy','winter','rust','wellness','quiet','romantic','adult','nature','intimate','spa'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['relax','binnenzwembad','looproutes','fietsroutes']
    },

    // -------- ID 39-40: België + Duitsland city --------
    {
        id: 39, title: "Antwerpen Boutique B&B", location: "Antwerpen, België", emoji: "🍫",
        tags: ["Stad", "Boutique", "Weekend"],
        type: 'hotel', tier: 'comfort', country: 'belgie',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','adult','intimate','romantic','flexible','safe-solo'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','open-bar']
    },
    {
        id: 40, title: "Berlijn Design Loft", location: "Berlijn, Duitsland", emoji: "🍺",
        tags: ["Stad", "Design", "Nachtleven"],
        type: 'hotel', tier: 'comfort', country: 'duitsland',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer','appartement'],
        themes: ['centrum','urban','cultural','short-break','boutique','social','nightlife','flexible','safe-solo','adult','group'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','open-bar','live-muziek','entertainment']
    },

    // -------- ID 41-43: FR/ES/IT regio --------
    {
        id: 41, title: "Provence Wellness Gîte", location: "Provence, Frankrijk", emoji: "🪻",
        tags: ["Wellness", "Rust", "Lavendel"],
        type: 'glamping', tier: 'luxe', country: 'frankrijk',
        settings: ['natuur'],
        accommodationTypes: ['villa','chalet'],
        themes: ['wellness','spa','rust','romantic','quiet','luxury','adult','intimate','warm','cultural','family','summer'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['relax','facility-luxe','looproutes','fietsroutes']
    },
    {
        id: 42, title: "Madrid Citytrip Hotel", location: "Madrid, Spanje", emoji: "🥘",
        tags: ["Stad", "Cultuur", "Weekend"],
        type: 'hotel', tier: 'comfort', country: 'spanje',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','social','nightlife','flexible','safe-solo','adult','group','warm'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','open-bar','live-muziek','entertainment']
    },
    {
        id: 43, title: "Amalfi Seaview Hotel", location: "Amalfikust, Italië", emoji: "🌊",
        tags: ["Aan zee", "Luxe", "Italië"],
        type: 'hotel', tier: 'luxe', country: 'italie',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['beach','sun','warm','summer','luxury','premium','romantic','adult','wellness','intimate','cultural','boutique'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['aan-strand','facility-luxe','relax','open-bar','bezienswaardigheden']
    },

    // -------- ID 44: Portugal surf --------
    {
        id: 44, title: "Porto Surf Hostel", location: "Porto, Portugal", emoji: "🏄",
        tags: ["Surf", "Vrienden", "Budget"],
        type: 'hotel', tier: 'budget', country: 'portugal',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer','appartement'],
        themes: ['beach','sun','warm','active','adventure','sports','social','group','budget-friendly','teen-friendly','safe-solo','flexible','nightlife'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','sports-games','outdoor','open-bar','live-muziek']
    },

    // -------- ID 45: Kroatië hiking --------
    {
        id: 45, title: "Plitvice Wandel Lodge", location: "Plitvice, Kroatië", emoji: "🥾",
        tags: ["Wandelen", "Natuur", "Avontuur"],
        type: 'hotel', tier: 'comfort', country: 'kroatie',
        settings: ['natuur','in-bergen'],
        accommodationTypes: ['hotel-kamer','chalet'],
        themes: ['nature','active','adventure','outdoor','quiet','romantic','adult','wellness','green','accessible','cultural','mountain'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['looproutes','fietsroutes','outdoor','relax','bezienswaardigheden']
    },

    // -------- ID 46: Oostenrijk familie winter --------
    {
        id: 46, title: "Tirol Familie Chalet", location: "Zillertal, Oostenrijk", emoji: "⛷️",
        tags: ["Wintersport", "Familie", "Chalet"],
        type: 'holiday-park', tier: 'comfort', country: 'oostenrijk',
        settings: ['in-bergen'],
        accommodationTypes: ['chalet','bungalow'],
        themes: ['mountain','winter','snow','ski','family','kid-safe','active','sports','cozy','pet-friendly','teen-friendly','baby-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['sports-games','outdoor','kids-fun','binnenzwembad','entertainment']
    },

    // -------- ID 47: Noord-Brabant kano --------
    {
        id: 47, title: "Biesbosch Kano Camping", location: "Biesbosch, Noord-Brabant", emoji: "🛶",
        tags: ["Watersport", "Aan een meer", "Natuur"],
        type: 'camping', tier: 'budget', country: 'netherlands',
        settings: ['aan-meer','natuur'],
        accommodationTypes: ['tent','caravan'],
        themes: ['water','lake','nature','active','adventure','outdoor','sports','social','group','pet-friendly','budget-friendly','safe-solo'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: true },
        facilities: ['outdoor','sports-games','fietsroutes','pet-friendly']
    },

    // -------- ID 48: Frankrijk luxe glamping --------
    {
        id: 48, title: "Zuid-Franse Glamping Deluxe", location: "Côte d'Azur, Frankrijk", emoji: "☀️",
        tags: ["Glamping", "Luxe", "Zonvakantie"],
        type: 'glamping', tier: 'luxe', country: 'frankrijk',
        settings: ['natuur'],
        accommodationTypes: ['safari-tent','villa'],
        themes: ['luxury','premium','boutique','wellness','spa','romantic','adult','intimate','quiet','nature','warm','summer','family','glamping'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['relax','facility-luxe','open-bar','aan-strand']
    },

    // ============================================================
    //  NIEUWE ACCOMMODATIES — ID 49-56
    //  Vullen de gaten in continent-dekking (Azië/Afrika/Amerika)
    //  + extra Adult-Only en All-Inclusive family-coverage.
    //  Ook geregistreerd in site-data.js zodat de detail-pagina
    //  blijft openen.
    // ============================================================
    {
        id: 49, title: "Bali Ubud Wellness Retreat", location: "Ubud, Bali", emoji: "🌴",
        tags: ["Wellness", "Yoga", "Luxe"],
        type: 'glamping', tier: 'luxe', country: 'indonesie',
        settings: ['natuur','afgelegen'],
        accommodationTypes: ['villa','safari-tent','chalet'],
        themes: ['wellness','spa','rust','romantic','quiet','luxury','adult','intimate','warm','cultural','remote','nature','yoga','unique'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['relax','facility-luxe','looproutes','bezienswaardigheden']
    },
    {
        id: 50, title: "Phuket Beach Resort", location: "Phuket, Thailand", emoji: "🐘",
        tags: ["Aan zee", "All-In", "Familie"],
        type: 'hotel', tier: 'comfort', country: 'thailand',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer','villa','appartement'],
        themes: ['beach','sun','warm','summer','family','kid-safe','entertainment','active','social','all-inclusive','cultural','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','binnenzwembad','glijbanen','all-inclusive','kids-fun','sports-games','entertainment','open-bar']
    },
    {
        id: 51, title: "Marrakech Boutique Riad", location: "Marrakech, Marokko", emoji: "🕌",
        tags: ["Cultuur", "Boutique", "Avontuur"],
        type: 'hotel', tier: 'luxe', country: 'marokko',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','romantic','adult','intimate','warm','unique','luxury','spa'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','relax','facility-luxe','open-bar']
    },
    {
        id: 52, title: "Tanzania Safari Lodge", location: "Serengeti, Tanzania", emoji: "🦒",
        tags: ["Safari", "Avontuur", "Luxe"],
        type: 'glamping', tier: 'luxe', country: 'tanzania',
        settings: ['afgelegen','natuur'],
        accommodationTypes: ['safari-tent','chalet'],
        themes: ['remote','quiet','nature','adventure','active','outdoor','unique','luxury','adult','romantic','warm','wildlife'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['outdoor','facility-luxe','bezienswaardigheden','open-bar']
    },
    {
        id: 53, title: "New York Boutique Hotel", location: "Manhattan, USA", emoji: "🗽",
        tags: ["Stad", "Weekend", "Boutique"],
        type: 'hotel', tier: 'luxe', country: 'usa',
        settings: ['centrum'],
        accommodationTypes: ['hotel-kamer'],
        themes: ['centrum','urban','cultural','short-break','boutique','social','nightlife','flexible','safe-solo','adult','group','luxury'],
        audience: { adultOnly: false, kidFriendly: false, petFriendly: false },
        facilities: ['bezienswaardigheden','open-bar','live-muziek','entertainment','relax']
    },
    {
        id: 54, title: "Costa Rica Eco Lodge", location: "Manuel Antonio, Costa Rica", emoji: "🦥",
        tags: ["Eco", "Avontuur", "Jungle"],
        type: 'glamping', tier: 'comfort', country: 'costa-rica',
        settings: ['natuur','afgelegen'],
        accommodationTypes: ['safari-tent','chalet','bungalow'],
        themes: ['nature','green','remote','adventure','active','outdoor','unique','warm','romantic','wildlife','social','teen-friendly'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['outdoor','looproutes','sports-games','relax']
    },
    {
        id: 55, title: "Ibiza Cliff Adult Resort", location: "Ibiza, Spanje", emoji: "🥂",
        tags: ["Adult Only", "Aan zee", "Luxe"],
        type: 'hotel', tier: 'luxe', country: 'spanje',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer','villa'],
        themes: ['beach','sun','warm','summer','adult','luxury','premium','romantic','nightlife','social','intimate','wellness','spa'],
        audience: { adultOnly: true, kidFriendly: false, petFriendly: false },
        facilities: ['aan-strand','facility-luxe','open-bar','live-muziek','relax','binnenzwembad']
    },
    {
        id: 56, title: "Andalusië All-Inclusive Resort", location: "Costa del Sol, Spanje", emoji: "🌅",
        tags: ["All-In", "Aan zee", "Familie"],
        type: 'hotel', tier: 'comfort', country: 'spanje',
        settings: ['aan-zee'],
        accommodationTypes: ['hotel-kamer','appartement'],
        themes: ['beach','sun','warm','summer','family','kid-safe','entertainment','active','social','all-inclusive','teen-friendly','rainy-day-proof'],
        audience: { adultOnly: false, kidFriendly: true, petFriendly: false },
        facilities: ['aan-strand','binnenzwembad','glijbanen','all-inclusive','kids-fun','sports-games','entertainment','open-bar','live-muziek']
    }
];
