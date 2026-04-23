// site-data.js — gedeelde categorie- en accommodatie-data voor alle pagina's
// Houd in sync met navigatie.js labels.

const SITE_DATA = {
    labels: {
        who: {
            'families-babies': "Gezinnen met baby's",
            'families-kids': 'Gezinnen met kinderen',
            'families-teens': 'Gezinnen met tieners',
            'couples': 'Koppels',
            'friends': 'Vrienden',
            'seniors': 'Senioren',
            'pets': 'Met huisdieren',
            'solo': 'Alleen reizend'
        },
        what: {
            'camping': 'Kamperen',
            'hotel': 'Hotel',
            'holiday-park': 'Vakantiepark',
            'glamping': 'Glamping',
            'wellness': 'Wellness',
            'adventure-trip': 'Actief / Avontuur',
            'city-trip': 'Weekendje weg',
            'sun': 'Zonvakantie',
            'winter': 'Wintervakantie'
        },
        whereNL: {
            'drenthe': 'Drenthe',
            'gelderland': 'Gelderland',
            'limburg': 'Limburg',
            'zeeland': 'Zeeland',
            'noord-holland': 'Noord-Holland',
            'overijssel': 'Overijssel',
            'flevoland': 'Flevoland',
            'friesland': 'Friesland',
            'groningen': 'Groningen',
            'noord-brabant': 'Noord-Brabant',
            'zuid-holland': 'Zuid-Holland',
            'utrecht': 'Utrecht'
        },
        whereEU: {
            'belgie': 'België',
            'duitsland': 'Duitsland',
            'frankrijk': 'Frankrijk',
            'spanje': 'Spanje',
            'italie': 'Italië',
            'oostenrijk': 'Oostenrijk',
            'portugal': 'Portugal',
            'kroatie': 'Kroatië'
        },
        // Landen (hoog-niveau bestemmingen voor Niveau 3)
        countries: {
            'netherlands': 'Nederland',
            'belgie': 'België',
            'duitsland': 'Duitsland',
            'frankrijk': 'Frankrijk',
            'spanje': 'Spanje',
            'italie': 'Italië',
            'oostenrijk': 'Oostenrijk',
            'portugal': 'Portugal',
            'kroatie': 'Kroatië'
        },
        // Camping-subtypes (Niveau 3 verdieping bij what=camping)
        campingTypes: {
            'camping-glamping': 'Glamping',
            'camping-waterpark': 'Camping met waterpark',
            'camping-holidaypark': 'Camping op vakantiepark',
            'camping-nature': 'Natuurcamping',
            'camping-beach': 'Camping aan zee',
            'camping-adult': 'Adult-only camping',
            'camping-farm': 'Boerencamping',
            'camping-kids': 'Kindercamping'
        }
    },
    icons: {
        // WIE
        'families-babies': '👶', 'families-kids': '👧', 'families-teens': '🧑',
        'couples': '💑', 'friends': '👫', 'seniors': '👴',
        'pets': '🐕', 'solo': '🧑',
        // WAT
        'camping': '⛺', 'hotel': '🏨', 'holiday-park': '🎡', 'glamping': '✨',
        'wellness': '💆', 'adventure-trip': '🧗', 'city-trip': '🏙️',
        'sun': '☀️', 'winter': '⛷️',
        // WAAR NL
        'drenthe': '🌲', 'gelderland': '🏞️', 'limburg': '⛰️', 'zeeland': '🏖️',
        'noord-holland': '🚴', 'overijssel': '💧', 'flevoland': '🌾',
        'friesland': '🚣', 'groningen': '🌌', 'noord-brabant': '🎭',
        'zuid-holland': '🌷', 'utrecht': '🏰',
        // WAAR EU
        'belgie': '🍫', 'duitsland': '🍺', 'frankrijk': '🗼', 'spanje': '🥘',
        'italie': '🍝', 'oostenrijk': '🎿', 'portugal': '🏖️', 'kroatie': '⛵',
        // LANDEN
        'netherlands': '🇳🇱',
        // CAMPING TYPES
        'camping-glamping': '✨', 'camping-waterpark': '🏊', 'camping-holidaypark': '🎡',
        'camping-nature': '🌲', 'camping-beach': '🏖️', 'camping-adult': '🥂',
        'camping-farm': '🐄', 'camping-kids': '🎠'
    },
    // Gradiënten voor placeholder-afbeeldingen (per categorie-type een andere kleur)
    gradients: {
        who: 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
        what: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        where: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        combo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    // Uitgebreide accommodatielijst — sluit aan op tags in navigatie.js
    accommodations: [
        { id: 1, name: 'Sunny Beach Resort', location: 'Zeeland', price: 145, rating: 8.7, reviews: 412,
          who: ['families-kids','couples'], what: ['sun','hotel'], where: 'zeeland',
          tags: ['Aan zee','Comfort'], emoji: '🏖️' },
        { id: 2, name: 'Family Camping Paradise', location: 'Drenthe', price: 68, rating: 8.4, reviews: 287,
          who: ['families-kids','families-babies'], what: ['camping'], where: 'drenthe',
          tags: ['Camping','Kinderpret'], emoji: '⛺' },
        { id: 3, name: 'Alpine Mountain Lodge', location: 'Oostenrijk', price: 210, rating: 9.1, reviews: 198,
          who: ['couples','friends'], what: ['winter','adventure-trip'], where: 'oostenrijk',
          tags: ['Bergen','Luxe'], emoji: '⛰️' },
        { id: 4, name: 'Romantic Glamping Spot', location: 'Gelderland', price: 165, rating: 9.0, reviews: 142,
          who: ['couples'], what: ['glamping','wellness'], where: 'gelderland',
          tags: ['Glamping','Adult Only'], emoji: '✨' },
        { id: 5, name: 'Pet-Friendly Cottage', location: 'Noord-Holland', price: 98, rating: 8.6, reviews: 176,
          who: ['pets','couples','families-kids'], what: ['holiday-park'], where: 'noord-holland',
          tags: ['Diervriendelijk','Natuur'], emoji: '🏡' },
        { id: 6, name: 'Water Sports Haven', location: 'Friesland', price: 112, rating: 8.9, reviews: 231,
          who: ['friends','families-teens'], what: ['adventure-trip'], where: 'friesland',
          tags: ['Water','Sport'], emoji: '🏄' },
        { id: 7, name: 'City Break Parijs', location: 'Frankrijk', price: 185, rating: 8.8, reviews: 356,
          who: ['couples','solo','friends'], what: ['city-trip'], where: 'frankrijk',
          tags: ['Stad','Cultuur'], emoji: '🗼' },
        { id: 8, name: 'All-Inclusive Family Park', location: 'Noord-Brabant', price: 175, rating: 8.5, reviews: 489,
          who: ['families-kids','families-babies'], what: ['holiday-park'], where: 'noord-brabant',
          tags: ['All-in','Kinderpret'], emoji: '🎡' },
        { id: 9, name: 'Winter Ski Lodge', location: 'Oostenrijk', price: 245, rating: 9.2, reviews: 167,
          who: ['friends','couples'], what: ['winter','adventure-trip'], where: 'oostenrijk',
          tags: ['Wintersport','Bergen'], emoji: '⛷️' },
        { id: 10, name: 'Secluded Nature Retreat', location: 'Groningen', price: 125, rating: 8.7, reviews: 94,
          who: ['seniors','couples'], what: ['wellness'], where: 'groningen',
          tags: ['Natuur','Rust'], emoji: '🌲' },
        { id: 11, name: 'Costa Brava Beach Camping', location: 'Spanje', price: 82, rating: 8.3, reviews: 523,
          who: ['families-kids','families-teens'], what: ['camping','sun'], where: 'spanje',
          tags: ['Camping','Zee'], emoji: '🏕️' },
        { id: 12, name: 'Toscaanse Luxe Glamping', location: 'Italië', price: 220, rating: 9.3, reviews: 184,
          who: ['couples'], what: ['glamping','wellness'], where: 'italie',
          tags: ['Glamping','Luxe'], emoji: '🍷' },
        { id: 13, name: 'Ardennen Boutique Hotel', location: 'België', price: 135, rating: 8.6, reviews: 211,
          who: ['couples','seniors'], what: ['hotel','wellness'], where: 'belgie',
          tags: ['Boutique','Wellness'], emoji: '🏨' },
        { id: 14, name: 'Schwarzwald Chalet', location: 'Duitsland', price: 155, rating: 8.9, reviews: 267,
          who: ['families-teens','friends'], what: ['adventure-trip'], where: 'duitsland',
          tags: ['Bergen','Natuur'], emoji: '🌲' },
        { id: 15, name: 'Algarve Beachfront', location: 'Portugal', price: 168, rating: 9.0, reviews: 342,
          who: ['couples','families-teens'], what: ['sun','hotel'], where: 'portugal',
          tags: ['Zee','Zon'], emoji: '🌊' },
        { id: 16, name: 'Kroatische Kust-Villa', location: 'Kroatië', price: 195, rating: 9.1, reviews: 178,
          who: ['friends','couples'], what: ['sun'], where: 'kroatie',
          tags: ['Zee','Villa'], emoji: '⛵' },
        { id: 17, name: 'Veluwe Bungalow Park', location: 'Gelderland', price: 95, rating: 8.4, reviews: 298,
          who: ['families-kids','families-babies','pets'], what: ['holiday-park'], where: 'gelderland',
          tags: ['Bos','Bungalow'], emoji: '🌳' },
        { id: 18, name: 'Utrechtse Stadsapartement', location: 'Utrecht', price: 110, rating: 8.5, reviews: 189,
          who: ['couples','solo','friends'], what: ['city-trip'], where: 'utrecht',
          tags: ['Stad','Cultuur'], emoji: '🏰' }
    ],
    // Uitgelichte redactionele teksten per categorie
    editorial: {
        who: {
            'families-babies': 'Op vakantie met een baby vraagt om rust, veilige voorzieningen en een flexibel ritme. Denk aan babyfaciliteiten, ruime accommodaties en groene omgevingen zonder al te veel prikkels.',
            'families-kids': 'Vakantie met kinderen betekent entertainment, kinderpret en voldoende ruimte om zich uit te leven. Vakantieparken, campings en resorts met kidsclub scoren hier het hoogst.',
            'families-teens': 'Tieners willen actie: sport, avontuur en sociale sfeer. Locaties aan het water of in de bergen met uitdagende activiteiten staan hier centraal.',
            'couples': 'Romantiek, rust en kwaliteit. Van boutique hotels in de stad tot glamping in de natuur — accommodaties voor twee met oog voor detail.',
            'friends': 'Samen weg met vrienden vraagt om ruimte, een goede sfeer en activiteiten voor iedereen. Villa\'s, chalets en actieve bestemmingen staan hoog op het lijstje.',
            'seniors': 'Comfort, toegankelijkheid en rust. Bestemmingen met milde klimaten, cultuur binnen handbereik en accommodaties die op elk gemak zijn ingericht.',
            'pets': 'Jouw viervoeter gaat mee op reis. Huisdiervriendelijke accommodaties met uitlaatgebieden, hondenstrand in de buurt en ruime tuinen.',
            'solo': 'Alleen op reis is vrijheid. Hostels, boutique hotels en actieve groepsreizen waar je makkelijk anderen ontmoet.'
        },
        what: {
            'camping': 'Terug naar de basis: tent opzetten, kampvuurtje en de sterren boven je. Van eenvoudige natuurkampeerplaatsen tot luxe campings met zwembad.',
            'hotel': 'Het gemak van een hotelverblijf: ontbijt, schoonmaak, concierge. Van boutique-adressen tot internationale ketens.',
            'holiday-park': 'Alles onder één dak: zwembaden, restaurants, speelattributen. Ideaal voor gezinnen die minimaal willen regelen.',
            'glamping': 'Kamperen met de luxe van een hotel: echte bedden, eigen badkamer en vaak een bubbelbad op het terras.',
            'wellness': 'Ontsnappen aan de drukte. Sauna, massage, stilteweides — hier kom je helemaal tot rust.',
            'adventure-trip': 'Mountainbiken, klimmen, raften, trekken. Voor wie actie en natuur combineert.',
            'city-trip': 'Een weekend cultuur, eten en slenteren. Van musea tot verborgen café\'s.',
            'sun': 'Zon, zee en strand. Van Costa Brava tot Algarve — gegarandeerde warmte en blauw water.',
            'winter': 'Skiën, snowboarden of après-ski. Van Oostenrijk tot Zwitserland.'
        }
    }
};

// Hulpfuncties
const DATA = {
    who: () => Object.entries(SITE_DATA.labels.who),
    what: () => Object.entries(SITE_DATA.labels.what),
    whereAll: () => [...Object.entries(SITE_DATA.labels.whereNL), ...Object.entries(SITE_DATA.labels.whereEU)],
    whereNL: () => Object.entries(SITE_DATA.labels.whereNL),
    whereEU: () => Object.entries(SITE_DATA.labels.whereEU),
    countries: () => Object.entries(SITE_DATA.labels.countries),
    campingTypes: () => Object.entries(SITE_DATA.labels.campingTypes),
    label(dim, key) {
        if (dim === 'where') return SITE_DATA.labels.whereNL[key] || SITE_DATA.labels.whereEU[key] || key;
        return SITE_DATA.labels[dim]?.[key] || key;
    },
    icon(key) { return SITE_DATA.icons[key] || '📌'; },
    filter({ who, what, where } = {}) {
        return SITE_DATA.accommodations.filter(a => {
            if (who && !a.who.includes(who)) return false;
            if (what && !a.what.includes(what)) return false;
            if (where && a.where !== where) return false;
            return true;
        });
    },
    editorial(dim, key) { return SITE_DATA.editorial[dim]?.[key] || ''; }
};
