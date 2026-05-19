// ===========================================================
// URLAUBSPOTTER — Navigatiestructuur (Niveau 2 → 5)
// Volledig Nederlands; gesynchroniseerd met Homepagina.html
// Deep-link via URL: ?filter=who|what|where&value=<slug>
// ===========================================================

const app = {
    // ========== STATE ==========
    state: {
        currentPage: 'listing',
        pageHistory: [],
        activeFilters: {
            who: [], what: [], where: [],
            accommodation: [], location: [], budget: [], facilities: []
        },
        currentDetailId: null,
        priceView: 'night'
    },

    // ========== LABELS ==========
    // Sleutels matchen de data-value op de homepagina.
    // Weergegeven labels zijn in het Nederlands.
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
            'adventure': 'Actief / Avontuur',
            'city-trip': 'Weekendje weg',
            'sun': 'Zonvakantie',
            'winter': 'Wintervakantie'
        },
        where: {
            'netherlands': 'Nederland',
            'belgium': 'België',
            'germany': 'Duitsland',
            'france': 'Frankrijk',
            'spain': 'Spanje',
            'italy': 'Italië',
            'austria': 'Oostenrijk',
            'portugal': 'Portugal',
            'croatia': 'Kroatië',
            'switzerland': 'Zwitserland'
        },
        accommodation: {
            'bungalow': 'Bungalow',
            'hotel-room': 'Hotelkamer',
            'safari-tent': 'Safaritent',
            'chalet': 'Chalet',
            'apartment': 'Appartement',
            'villa': 'Villa'
        },
        location: {
            'sea': 'Aan zee',
            'lake': 'Aan een meer',
            'mountains': 'In de bergen',
            'nature': 'Nabij natuur/bos',
            'city': 'In de stad',
            'remote': 'Afgelegen'
        },
        budget: {
            'budget': 'Budget (€ – €€)',
            'comfort': 'Comfort (€€ – €€€)',
            'luxury': 'Luxe (€€€ – €€€€)',
            'last-minute': 'Last Minutes',
            'discount': 'Korting',
            'offers': 'Aanbiedingen',
            'packages': 'Pakketreizen'
        },
        facilities: {
            // Canonieke volle labels — gebruikt door zowel de USP-iconen
            // op de detail-page als de tag-chips op de listing-cards.
            // Geen afkortingen meer ('All-in', 'Adult', 'Relax) — die
            // voelden inconsistent t.o.v. de keuzehulp-taxonomie.
            'water': 'Wateractiviteiten',
            'kids-fun': 'Kinderpret',
            'all-inclusive': 'All-inclusive',
            'sports-games': 'Sport & Spel',
            'adventure': 'Avontuur',
            'relax': 'Ontspanning',
            'pet-friendly': 'Diervriendelijk',
            'adult-only': 'Adult Only',
            'luxe': 'Luxe',
            'nature': 'Natuur',
            'festive': 'Feestelijk'
        }
    },

    // ========== DATA ==========
    accommodations: [
        {
            id: 1,
            name: 'Camping Zonneschijn',
            location: 'Costa Brava, Spanje',
            whereKey: 'spain',
            whatKeys: ['camping'],
            whoKeys: ['families-kids', 'families-babies'],
            accommodationKeys: ['bungalow', 'safari-tent'],
            locationKeys: ['sea'],
            facilityKeys: ['water', 'kids-fun', 'sports-games', 'festive'],
            stars: 4,
            coords: { x: 70, y: 60 },
            idealFor: "Gezinnen met kinderen van 0–12 jaar, ook geschikt voor tieners.",
            situated: "Zonnig gelegen aan de Spaanse Middellandse Zeekust, op loopafstand van het strand.",
            editorial: "Camping Zonneschijn is een solide keuze voor gezinnen met jonge kinderen (0–10 jaar). Het aquapark en de kinderanimatie maken indruk, en de strandligging is een groot voordeel. De safaritenten zijn functioneel maar niet luxe—overweeg een comfort-upgrade voor een beter verblijf. Het animatieteam is enthousiast en creatief. Let op: in schoolvakanties is het park snel vol.",
            ratingFrame: { ligging: 9.2, schoon: 8.8, personeel: 9.0, voorzieningen: 8.5, 'prijs/kwaliteit': 8.2, eten: 7.8 },
            climate: [
                { month: 'Mei', temp: 22, rain: 6, sun: 8 },
                { month: 'Juni', temp: 26, rain: 4, sun: 10 },
                { month: 'Juli', temp: 29, rain: 2, sun: 11 },
                { month: 'Aug', temp: 28, rain: 3, sun: 10 },
                { month: 'Sept', temp: 25, rain: 5, sun: 8 }
            ],
            editorialStories: [
                {
                    rating: 7.5,
                    title: '"De welness was geweldig"',
                    author: 'Quentin',
                    role: 'Redactielid',
                    with: 'Met zijn vrouw',
                    when: 'Zomervakantie 2023',
                    excerpt: 'Ik en mijn vriendin waren op zoek naar een boutique hotel met wellness om even lekker tot rust te komen. Uiteindelijk zijn we uitgekomen op…',
                    replies: 1
                },
                {
                    rating: 7.2,
                    title: '"Ons kindje heeft een super tijd gehad!"',
                    author: 'Mardy',
                    role: 'Redactielid',
                    with: 'Met een baby en een peuter',
                    when: 'Meivakantie 2023',
                    excerpt: 'Wij waren in afgelopen meivakantie een bezoek gaan brengen aan landal. Ons kindje heeft erg kunnen genieten van de kidsclub terwijl papa en mama lekker…',
                    replies: 1
                }
            ],
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop'
            ],
            price: 85, rating: 8.5, reviews: 324,
            description: 'Bruisende familiecamping met waterpark en animatie aan de Spaanse kust.',
            longDescription: 'Camping Zonneschijn is dé topbestemming voor gezinnen die plezier en ontspanning zoeken. Een uitgebreid aquapark, professionele kinderanimatie en directe toegang tot het strand.',
            rooms: ['Strandbungalow', 'Safaritent', 'Familiechalet'],
            faq: [
                { q: 'Is er gratis WiFi?', a: 'Ja, snelle WiFi is gratis op het hele terrein.' },
                { q: 'Wat zijn de inchecktijden?', a: 'Inchecken vanaf 15:00, uitchecken vóór 11:00.' },
                { q: 'Is ontbijt inbegrepen?', a: 'Ontbijt is apart te boeken of bij het all-in pakket inbegrepen.' }
            ],
            hotspots: [
                { name: 'Strand Lloret de Mar', distance: '200m' },
                { name: 'Historisch Tossa de Mar', distance: '15 km' },
                { name: 'Wijnstreek Penedès', distance: '45 km' }
            ],
            providers: [
                { name: 'TUI', price: 85 },
                { name: 'Sunweb', price: 79 },
                { name: 'Corendon', price: 89 }
            ]
        },
        {
            id: 2,
            name: 'Resort Strand & Zee',
            location: 'Algarve, Portugal',
            whereKey: 'portugal',
            whatKeys: ['hotel'],
            whoKeys: ['couples'],
            accommodationKeys: ['hotel-room'],
            locationKeys: ['sea'],
            facilityKeys: ['relax', 'luxe', 'adult-only', 'all-inclusive'],
            stars: 5,
            coords: { x: 50, y: 70 },
            idealFor: "Koppels en stellen die luxe en rust zoeken, adult-only sfeer.",
            situated: "Aan de zuidkust van de Algarve met privéstrand en uitzicht op zee.",
            editorial: "Resort Strand & Zee biedt echte luxe voor koppels: attent personeel, een uitstekende spa en een privéstrand dat z’n naam waarmaakt. Het restaurant is een hoogtepunt; reserveer vooraf. Niet geschikt voor kleine kinderen—dit is bewust een rustige, volwassen omgeving.",
            ratingFrame: { ligging: 9.5, schoon: 9.3, personeel: 9.4, voorzieningen: 9.1, 'prijs/kwaliteit': 8.4, eten: 9.2 },
            climate: [
                { month: 'Mei', temp: 21, rain: 4, sun: 9 },
                { month: 'Juni', temp: 25, rain: 2, sun: 11 },
                { month: 'Juli', temp: 28, rain: 1, sun: 12 },
                { month: 'Aug', temp: 28, rain: 1, sun: 11 },
                { month: 'Sept', temp: 25, rain: 3, sun: 9 }
            ],
            editorialStories: [
                { rating: 8.6, title: '"Romantisch weekend aan zee"', author: 'Sanne', role: 'Redactielid', with: 'Met mijn partner', when: 'April 2024', excerpt: 'De spa is top en het eten was verfijnd. Een aanrader voor een romantisch weekend…', replies: 3 }
            ],
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
            ],
            price: 180, rating: 9.0, reviews: 456,
            description: 'Luxe strandresort met wereldklasse faciliteiten aan de Algarve-kust.',
            longDescription: 'Een premium strandresort met spa-behandelingen, gourmet dining en privéstrand. Perfect voor koppels die luxe en romantiek zoeken.',
            rooms: ['Superior Room', 'Deluxe Suite', 'Zeezicht Suite'],
            faq: [
                { q: 'Is er roomservice?', a: 'Ja, 24 uur per dag.' },
                { q: 'Is er een spa?', a: 'Ja, volledige spa met lokale behandelingen.' }
            ],
            hotspots: [
                { name: 'Privéstrand', distance: '0 m' },
                { name: 'Golfbaan Lagos', distance: '10 km' }
            ],
            providers: [
                { name: 'TUI', price: 180 },
                { name: 'Sunweb', price: 175 },
                { name: 'Corendon', price: 189 }
            ]
        },
        {
            id: 3,
            name: 'Berghut Alpen',
            location: 'Tiroler Alpen, Oostenrijk',
            whereKey: 'austria',
            whatKeys: ['adventure', 'camping'],
            whoKeys: ['friends', 'couples'],
            accommodationKeys: ['chalet'],
            locationKeys: ['mountains', 'nature'],
            facilityKeys: ['adventure', 'sports-games', 'nature'],
            stars: 3,
            coords: { x: 60, y: 40 },
            idealFor: "Vriendengroepen en avonturiers die de bergen in willen.",
            situated: "Hoog in de Tiroolse Alpen, direct aan wandelroutes en skipistes.",
            editorial: "Berghut Alpen is rustiek, warm en authentiek. Perfect voor actieve vakanties—wandelen in de zomer, skiën in de winter. De gedeelde eettafel schept een gemoedelijke sfeer. Minpunt: het kan koud zijn in het tussenseizoen, neem warme kleding mee.",
            ratingFrame: { ligging: 9.4, schoon: 8.6, personeel: 9.1, voorzieningen: 7.9, 'prijs/kwaliteit': 8.7, eten: 8.5 },
            climate: [
                { month: 'Juni', temp: 17, rain: 9, sun: 7 },
                { month: 'Juli', temp: 20, rain: 8, sun: 8 },
                { month: 'Aug', temp: 19, rain: 8, sun: 7 },
                { month: 'Dec', temp: -3, rain: 12, sun: 3 },
                { month: 'Jan', temp: -5, rain: 11, sun: 3 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop'
            ],
            price: 95, rating: 8.7, reviews: 215,
            description: 'Rustieke berghut met adembenemende uitzichten in de Oostenrijkse Alpen.',
            longDescription: 'Authentieke berghut in het hart van de Alpen. Ideaal voor natuurliefhebbers, wandelaars en vriendengroepen.',
            rooms: ['Chalet standaard', 'Chalet met sauna'],
            faq: [
                { q: 'Zijn huisdieren toegestaan?', a: 'Ja, honden zijn welkom tegen een kleine toeslag.' },
                { q: 'Is er een restaurant?', a: 'Ja, met lokale Tiroolse keuken.' }
            ],
            hotspots: [
                { name: 'Wandelroute Zillertal', distance: '1 km' },
                { name: 'Hallstatt', distance: '60 km' }
            ],
            providers: [
                { name: 'TUI', price: 95 },
                { name: 'Sunweb', price: 92 },
                { name: 'Corendon', price: 99 }
            ]
        },
        {
            id: 4,
            name: 'Glamping Toscane',
            location: 'Toscane, Italië',
            whereKey: 'italy',
            whatKeys: ['glamping', 'camping'],
            whoKeys: ['couples', 'friends'],
            accommodationKeys: ['safari-tent'],
            locationKeys: ['nature'],
            facilityKeys: ['relax', 'luxe', 'nature', 'adult-only'],
            stars: 5,
            coords: { x: 55, y: 55 },
            idealFor: "Koppels en kleine vriendengroepen die van luxe natuur houden.",
            situated: "Midden tussen de glooiende heuvels van Chianti, omringd door wijngaarden.",
            editorial: "Glamping Toscane is een gedroomde luxe natuurbeleving. De infinity pool is magisch bij zonsondergang en de outdoor cinema is een unieke toevoeging. Tenten zijn ruim en stijlvol ingericht. Let op: bereikbaarheid is wisselend—een auto is echt nodig.",
            ratingFrame: { ligging: 9.6, schoon: 9.2, personeel: 9.0, voorzieningen: 8.9, 'prijs/kwaliteit': 8.0, eten: 9.3 },
            climate: [
                { month: 'Mei', temp: 22, rain: 5, sun: 9 },
                { month: 'Juni', temp: 26, rain: 3, sun: 11 },
                { month: 'Juli', temp: 30, rain: 2, sun: 12 },
                { month: 'Aug', temp: 29, rain: 3, sun: 11 },
                { month: 'Sept', temp: 25, rain: 5, sun: 9 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
            ],
            price: 250, rating: 9.2, reviews: 198,
            description: 'Weelderig glampen in het hart van Toscane met uitzicht op de heuvels.',
            longDescription: 'Unieke glamping ervaring met luxe tenten, infinity pool en outdoor cinema onder de sterren.',
            rooms: ['Luxe glamping tent', 'Safari lodge'],
            faq: [
                { q: 'Is er een zwembad?', a: 'Ja, een infinity pool met uitzicht op de heuvels.' }
            ],
            hotspots: [
                { name: 'Siena', distance: '25 km' },
                { name: 'Chianti wijngaarden', distance: '5 km' }
            ],
            providers: [
                { name: 'TUI', price: 250 },
                { name: 'Sunweb', price: 239 },
                { name: 'Corendon', price: 259 }
            ]
        },
        {
            id: 5,
            name: 'Vakantiepark Veluwe',
            location: 'Gelderland, Nederland',
            whereKey: 'netherlands',
            whatKeys: ['holiday-park'],
            whoKeys: ['families-kids', 'families-teens', 'families-babies'],
            accommodationKeys: ['bungalow', 'chalet'],
            locationKeys: ['nature'],
            facilityKeys: ['water', 'kids-fun', 'sports-games', 'nature'],
            stars: 4,
            coords: { x: 40, y: 45 },
            idealFor: "Gezinnen met kinderen (0–12 jaar), ook geschikt voor tieners.",
            situated: "Rustig gelegen in de natuur van Midden-Limburg, gemeente Roggel.",
            editorial: "Vakantiepark De Leistert is een solide keuze voor gezinnen met jonge kinderen (0–10 jaar). Het overdekte plaza met speeljungle en het subtropisch zwembad maken het park weerbestendig. De standaard bungalows zijn functioneel maar niet luxe—overweeg een comfort-upgrade voor een beter slaapcomfort. Het animatieteam is enthousiast en creatief. Let op: in schoolvakanties is het park snel vol.",
            ratingFrame: { ligging: 9.0, schoon: 8.7, personeel: 8.8, voorzieningen: 8.9, 'prijs/kwaliteit': 8.3, eten: 7.8 },
            climate: [
                { month: 'Mei', temp: 16, rain: 10, sun: 6 },
                { month: 'Juni', temp: 19, rain: 9, sun: 7 },
                { month: 'Juli', temp: 22, rain: 9, sun: 7 },
                { month: 'Aug', temp: 22, rain: 9, sun: 7 },
                { month: 'Sept', temp: 18, rain: 10, sun: 5 }
            ],
            editorialStories: [
                { rating: 7.2, title: '"Ons kindje heeft een super tijd gehad!"', author: 'Mardy', role: 'Redactielid', with: 'Met een baby en een peuter', when: 'Meivakantie 2023', excerpt: 'Wij waren in afgelopen meivakantie een bezoek gaan brengen aan landal. Ons kindje heeft erg kunnen genieten van de kidsclub terwijl papa en mama lekker…', replies: 1 }
            ],
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'
            ],
            price: 110, rating: 8.6, reviews: 512,
            description: 'Ruim vakantiepark in de Veluwse natuur — ideaal voor gezinnen.',
            longDescription: 'Familiepark met tropisch zwembad, fietsverhuur en uitgebreide kinderanimatie. Midden in de Veluwse bossen.',
            rooms: ['4-persoons bungalow', '6-persoons chalet', 'Luxe villa'],
            faq: [
                { q: 'Zijn honden welkom?', a: 'Ja, in speciaal daarvoor aangewezen bungalows.' }
            ],
            hotspots: [
                { name: 'Hoge Veluwe', distance: '12 km' },
                { name: 'Apenheul', distance: '20 km' }
            ],
            providers: [
                { name: 'TUI', price: 110 },
                { name: 'Sunweb', price: 105 },
                { name: 'Corendon', price: 119 }
            ]
        },
        {
            id: 6,
            name: 'Boetiekhotel Parijs',
            location: 'Parijs, Frankrijk',
            whereKey: 'france',
            whatKeys: ['hotel', 'city-trip'],
            whoKeys: ['couples', 'solo'],
            accommodationKeys: ['hotel-room'],
            locationKeys: ['city'],
            facilityKeys: ['luxe', 'relax', 'festive'],
            stars: 4,
            coords: { x: 50, y: 50 },
            idealFor: "Koppels en solo-reizigers op citytrip in Parijs.",
            situated: "In het hart van Parijs, op loopafstand van Louvre en Seine.",
            editorial: "Boetiekhotel Parijs combineert Parijse charme met modern comfort. Vriendelijke service, uitstekende locatie en stijlvolle kamers. Het ontbijt is een hoogtepunt. Kamers aan de straatkant kunnen licht rumoerig zijn—vraag om een hofkamer voor extra rust.",
            ratingFrame: { ligging: 9.8, schoon: 9.0, personeel: 9.1, voorzieningen: 8.4, 'prijs/kwaliteit': 8.2, eten: 9.0 },
            climate: [
                { month: 'Apr', temp: 14, rain: 8, sun: 6 },
                { month: 'Mei', temp: 18, rain: 8, sun: 7 },
                { month: 'Juni', temp: 21, rain: 7, sun: 8 },
                { month: 'Sept', temp: 20, rain: 7, sun: 6 },
                { month: 'Okt', temp: 15, rain: 9, sun: 5 }
            ],
            editorialStories: [],
            image: 'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=600&h=400&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1631049307038-da0ec9d70304?w=800&h=600&fit=crop'
            ],
            price: 140, rating: 8.9, reviews: 287,
            description: 'Stijlvol boetiekhotel in hartje Parijs met uitzicht op de Seine.',
            longDescription: 'Klein, persoonlijk hotel met ontwerpinterieur, op loopafstand van Louvre en Eiffeltoren.',
            rooms: ['Parijs Klassiek', 'Seine View Suite'],
            faq: [
                { q: 'Is ontbijt inbegrepen?', a: 'Ja, Frans ontbijt is inbegrepen bij alle kamers.' }
            ],
            hotspots: [
                { name: 'Eiffeltoren', distance: '1,2 km' },
                { name: 'Louvre', distance: '800 m' }
            ],
            providers: [
                { name: 'TUI', price: 140 },
                { name: 'Sunweb', price: 135 },
                { name: 'Corendon', price: 145 }
            ]
        }
    ],

    // ========== INIT ==========
    init() {
        // Unified site header: alle pagina's delen dezelfde header via site.js
        if (typeof renderHeader === 'function') renderHeader('nav');
        this.bindTabs();
        this.bindBrowserBack();
        const params = new URLSearchParams(window.location.search);

        // Slug-mapping: site-data.js gebruikt andere slugs dan navigatie.js
        const whereMap = {
            'drenthe':'netherlands','gelderland':'netherlands','limburg':'netherlands','zeeland':'netherlands',
            'noord-holland':'netherlands','overijssel':'netherlands','flevoland':'netherlands','friesland':'netherlands',
            'groningen':'netherlands','noord-brabant':'netherlands','zuid-holland':'netherlands','utrecht':'netherlands',
            'belgie':'belgium','duitsland':'germany','frankrijk':'france','spanje':'spain',
            'italie':'italy','oostenrijk':'austria','portugal':'portugal','kroatie':'croatia',
            'netherlands':'netherlands','belgium':'belgium','germany':'germany','france':'france',
            'spain':'spain','italy':'italy','austria':'austria','croatia':'croatia'
        };
        const whatMap = { 'adventure-trip':'adventure','adventure':'adventure' };

        // 1) Deep-link naar detail-pagina: ?acc=<id>
        // _ensureAccommodation() synthetiseert zo nodig een detail-record
        // vanuit SITE_DATA, zodat alle IDs betrouwbaar openen.
        const accId = parseInt(params.get('acc'));
        if (accId && this._ensureAccommodation(accId)) {
            this.state.activeFilters = { who:[], what:[], where:[], accommodation:[], location:[], budget:[], facilities:[] };
            this.goToDetail(accId);
            return;
        }

        // 2) Meerdere filters via ?who=&what=&where=
        const who = params.get('who');
        const what = params.get('what');
        const whereRaw = params.get('where');
        const where = whereRaw ? (whereMap[whereRaw] || whereRaw) : null;
        const whatMapped = what ? (whatMap[what] || what) : null;

        const hasAny = (who && this.labels.who[who]) || (whatMapped && this.labels.what[whatMapped]) || (where && this.labels.where[where]);
        if (hasAny) {
            this.state.activeFilters = { who:[], what:[], where:[], accommodation:[], location:[], budget:[], facilities:[] };
            if (who && this.labels.who[who]) this.state.activeFilters.who.push(who);
            if (whatMapped && this.labels.what[whatMapped]) this.state.activeFilters.what.push(whatMapped);
            if (where && this.labels.where[where]) this.state.activeFilters.where.push(where);
            // Bij meerdere filters of een volledige combinatie → direct listing tonen
            this.goToListing();
            return;
        }

        // 3) Oude deep-link: ?filter=who|what|where&value=<slug>
        const filter = params.get('filter');
        const value = params.get('value');
        if (filter && value && this.labels[filter] && this.labels[filter][value]) {
            this.startFromEntry(filter, value);
        } else if (filter && this.labels[filter]) {
            this.openCategoryPage(filter);
        } else {
            // Geen parameters of bekende filter → stuur gebruiker naar de nieuwe Alle vakanties-pagina
            window.location.replace('alle-vakanties.html');
        }
    },

    bindTabs() {
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.addEventListener('click', e => this.switchTab(e.target.dataset.tab));
        });
    },

    bindBrowserBack() {
        // Geen eigen popstate-handler meer: het oude handler riep goBack() aan die op
        // zijn beurt history.back() aanroept — dat gaf oneindige recursie. De browser
        // regelt terug-navigatie nu zelf; onze eigen "← Terug"-knop gebruikt goBack().
    },

    // ========== NAVIGATIE ==========
    goToPage(pageName, pushHistory = true) {
        if (pushHistory && this.state.currentPage && this.state.currentPage !== pageName) {
            this.state.pageHistory.push(this.state.currentPage);
        }
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(`page-${pageName}`);
        if (!target) return;
        target.classList.add('active');
        this.state.currentPage = pageName;

        // Oude in-pagina header is vervangen door unified .site-header.
        // updateHeader() is nu een no-op wanneer #active-filters-display ontbreekt.
        this.updateHeader();
        window.scrollTo(0, 0);
    },

    goBack() {
        // 1) Interne detail → listing: blijf binnen Navigatie.html
        if (this.state.currentPage === 'detail' && document.getElementById('page-listing')) {
            this.goToPage('listing', false);
            return;
        }
        // 2) Anders: echte browser-history gebruiken (komt van elders binnen de site)
        if (document.referrer) {
            try {
                const ref = new URL(document.referrer);
                if (ref.origin === location.origin) {
                    history.back();
                    return;
                }
            } catch (_) { /* ongeldige referrer: val door naar home */ }
        }
        // 3) Geen zinnige history → terug naar de homepage
        window.location.href = 'index.html';
    },

    // ========== ENTRY VAN HOMEPAGINA ==========
    // Wordt aangeroepen met een filter-key (who|what|where) en een value slug.
    // Pre-selecteert de filter en brengt de gebruiker naar de category-pagina.
    startFromEntry(filterKey, value) {
        // Reset filters, pre-select de meegegeven waarde
        this.state.activeFilters = {
            who: [], what: [], where: [],
            accommodation: [], location: [], budget: [], facilities: []
        };
        if (this.labels[filterKey] && this.labels[filterKey][value]) {
            this.state.activeFilters[filterKey].push(value);
        }
        this.openCategoryPage(filterKey);
    },

    openCategoryPage(focusKey) {
        const titles = {
            who: { title: 'Wie gaat er mee?', sub: 'Verfijn op type vakantie en bestemming' },
            what: { title: 'Wat voor vakantie?', sub: 'Kies je reisgezelschap en favoriete bestemming' },
            where: { title: 'Waar wil je heen?', sub: 'Bepaal je reisgezelschap en type vakantie' }
        };
        const cfg = titles[focusKey] || { title: 'Verfijn jouw keuze', sub: 'Kies waar je mee wilt beginnen' };
        document.getElementById('category-title').textContent = cfg.title;
        document.getElementById('category-subtitle').textContent = cfg.sub;
        this.renderCategoryFilters();
        this.goToPage('category');
    },

    goToCombination() {
        this.renderCombinationFilters();
        this.goToPage('combination');
    },

    goToListing() {
        this.renderListing();
        this.goToPage('listing');
    },

    // Zoekt een accommodatie in this.accommodations; valt terug op SITE_DATA
    // en synthetiseert een detail-record als de id alleen daar bestaat.
    // Gedeeld door init() (?acc=) en goToDetail() (kaart-klik), zodat
    // alle accommodatie-links betrouwbaar openen.
    _ensureAccommodation(id) {
        const n = Number(id);
        let found = this.accommodations.find(a => a.id === n);
        if (found) return found;
        if (typeof SITE_DATA === 'undefined') return null;
        const src = SITE_DATA.accommodations.find(a => a.id === n);
        if (!src) return null;
        const emoji = src.emoji || '🏝️';
        const placeholder = `data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'>
             <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
             <stop offset='0%' stop-color='#667eea'/><stop offset='100%' stop-color='#764ba2'/>
             </linearGradient></defs>
             <rect width='1200' height='700' fill='url(%23g)'/>
             <text x='600' y='400' font-size='240' text-anchor='middle' font-family='system-ui'>${emoji}</text>
             </svg>`)}`;
        // Korte description / longDescription zonder de tag-array als
        // platte tekst te dumpen — die contextuele info wordt nu via
        // de tag-pills hieronder gerendeerd (zie _buildDisplayTags +
        // renderDetail). Voorheen kwamen tags uit SITE_DATA hier als
        // " · "-gescheiden zin op de pagina, wat het visuele design
        // doodde en de gebruiker tweemaal dezelfde info zag.
        const whoLabels = (src.who || []).map(k => (typeof DATA !== 'undefined' ? DATA.label('who', k) : k)).filter(Boolean);
        const whoText = whoLabels.length ? whoLabels.join(', ').toLowerCase() : 'verschillende reisgezelschappen';
        const editorial = this._buildContextualEditorial(src);
        const editorialStories = this._buildContextualStories(src);
        const longDescription = this._buildContextualLongDescription(src, whoText);
        const climate = this._buildContextualClimate(src);
        const synth = {
            id: src.id, name: src.name, location: src.location, price: src.price,
            rating: src.rating, reviews: src.reviews, tags: src.tags || [],
            images: [placeholder, placeholder, placeholder],
            image: placeholder,
            description: `${src.name} in ${src.location}.`,
            longDescription,
            editorial,
            editorialStories,
            climate,
            facilities: ['WiFi','Parkeren','Ontbijt inbegrepen','Kindvriendelijk'],
            facilityKeys: [], accommodationKeys: [],
            whoKeys: src.who || [], whatKeys: src.what || [], whereKey: src.where || '',
            faq: [
                { q: 'Is parkeren inbegrepen?', a: 'Ja, gratis parkeren is beschikbaar.' },
                { q: 'Is er WiFi?', a: 'Ja, gratis WiFi door de hele accommodatie.' },
                { q: 'Wat is het annuleringsbeleid?', a: 'Gratis annuleren tot 14 dagen voor aankomst.' }
            ],
            coords: { x: 50, y: 50 },
            hotspots: [
                { name: 'Dichtstbijzijnde supermarkt', distance: '1.2 km' },
                { name: 'Restaurant', distance: '800 m' },
                { name: 'Bezienswaardigheid', distance: '3 km' }
            ],
            rooms: ['Standaard kamer', 'Comfort kamer', 'Suite'],
            providers: [{ name: 'Booking.com', price: src.price }, { name: 'Expedia', price: Math.round(src.price*1.05) }]
        };
        this.accommodations.push(synth);
        return synth;
    },

    // ============================================================
    // CONTEXTUAL EDITORIAL CONTENT
    // Genereert reale-aanvoelende redactie-content voor SITE_DATA
    // synth-records i.p.v. de oude placeholder. Toon en framing
    // worden bepaald door het type accommodatie (camping/hotel/
    // glamping/...) gecombineerd met het reisgezelschap (couples/
    // families/...) en de ligging. Een luxe-strandresort krijgt
    // dus een ander verslag dan een familiecamping.
    // ============================================================
    _buildContextualEditorial(src) {
        const what = (src.what || [])[0] || 'hotel';
        const who = (src.who || [])[0] || 'couples';
        const where = src.where || '';
        const tags = src.tags || [];
        const isCoast = tags.some(t => /aan zee|strand|kust/i.test(t));
        const isMountain = tags.some(t => /berg|alpen|tirool/i.test(t));
        const isLake = tags.some(t => /meer|aan een meer/i.test(t));
        const isWellness = tags.includes('Wellness') || what === 'wellness';
        const isAdultOnly = tags.includes('Adult Only');
        const isLuxe = tags.includes('Luxe') || src.price >= 200;
        const isRomantic = tags.includes('Romantisch');
        const isFamily = who.startsWith('families') || tags.some(t => /voor gezinnen|kinder/i.test(t));
        const isCity = what === 'city-trip' || tags.includes('Stad') || tags.includes('In de stad');

        // Opening (bepaalt wie deze plek vooral past)
        let opening;
        if (isAdultOnly || isRomantic) {
            opening = `${src.name} is geen plek voor een willekeurige boeking — dit is een verblijf voor mensen die rust en privacy boven entertainment plaatsen.`;
        } else if (isFamily && (what === 'camping' || what === 'holiday-park')) {
            opening = `${src.name} doet wat een goede gezinsaccommodatie zou moeten doen: ouders genoeg ruimte geven, kinderen genoeg te doen, en niemand het gevoel geven dat de week op de andere helft van het gezin is afgestemd.`;
        } else if (isFamily) {
            opening = `${src.name} is duidelijk ingericht op gezinnen die niet de hele dag op het terrein willen zitten, maar wel willen weten dat het terrein klopt als ze terugkomen.`;
        } else if (isLuxe) {
            opening = `${src.name} hoort tot de categorie verblijven waar je merkt dat er over de details is nagedacht — niet alleen over het marketingmateriaal.`;
        } else if (isCity) {
            opening = `${src.name} ligt op de plek waar je hem wilt hebben: dichtbij genoeg om alles lopend te doen, ver genoeg van de drukke toeristische assen om 's avonds rust te vinden.`;
        } else {
            opening = `${src.name} is een van die plekken waar de redactie zonder reserve over schrijft — niet spectaculair, wel goed.`;
        }

        // Middle (context van de ligging / type)
        let middle;
        if (isCoast) {
            middle = ' De ligging aan zee maakt het verschil: ochtenden zijn er stil, en het zoute licht doet meer voor de sfeer dan welk interieur dan ook.';
        } else if (isMountain) {
            middle = ' De bergomgeving doet het werk dat geen accommodatie zelf kan doen — wandelingen vanaf de deur, koele avonden, en het soort uitzicht dat een ochtend rechtvaardigt.';
        } else if (isLake) {
            middle = ' Aan het water krijgt deze plek iets dat je elders niet vindt: de stilte van een meer in de ochtend, en korte loop- of vaarafstanden naar de natuur.';
        } else if (isCity) {
            middle = ' De omgeving levert het verhaal: korte loopafstanden naar het centrum, sfeervolle terrasstraten, en lokale spots die niet in de gemiddelde reisgids staan.';
        } else if (isWellness) {
            middle = ' Het wellness-gedeelte is geen bijzaak maar de reden om te komen — sauna, behandelingen en stille hoeken die een week écht ontstresend maken.';
        } else {
            middle = ` De omgeving van ${src.location} levert genoeg om elke dag iets anders te doen, zonder dat je het terrein hoeft te verlaten als je dat niet wilt.`;
        }

        // Closing (wat opvalt / waar je op moet letten)
        let closing;
        if (isLuxe && isAdultOnly) {
            closing = ' Reserveer vroeg in het seizoen — vrije periodes zijn schaars en deze plek werkt het beste buiten de drukke maanden.';
        } else if (isFamily && tags.includes('Glijbanen')) {
            closing = ' Tip van de redactie: in schoolvakanties is het waterpark vroeg in de ochtend het rustigst — buiten die uren is het druk maar werkbaar.';
        } else if (isCity) {
            closing = ' Tip van de redactie: vraag bij het inchecken naar de lokale lunchspots; de adressen in standaard-reisgidsen zijn niet de adressen waar de buurt zelf eet.';
        } else if (isMountain) {
            closing = ' Voorjaar en nazomer zijn hier de aangenaamste seizoenen — minder volk op de paden, en de natuur op zijn best.';
        } else if (isCoast) {
            closing = ' Buiten het hoogseizoen is dit de aangenaamste periode: zacht licht, minder volk op het strand, en restaurants die tijd voor je nemen.';
        } else {
            closing = ' Wat je vooral merkt na een paar dagen: deze plek hoeft niet hard te werken om indruk te maken — daar zit precies de kracht in.';
        }

        return opening + middle + closing;
    },

    _buildContextualLongDescription(src, whoText) {
        const what = (src.what || [])[0] || 'hotel';
        const typeWord = ({
            'camping': 'familiecamping',
            'glamping': 'glamping-verblijf',
            'hotel': 'hotel',
            'holiday-park': 'vakantiepark',
            'wellness': 'wellness-verblijf',
            'adventure-trip': 'actieve verblijfsplek',
            'city-trip': 'stadshotel',
            'sun': 'zonbestemming',
            'winter': 'wintersport-verblijf'
        })[what] || 'verblijf';
        return `${src.name} is een ${typeWord} in ${src.location}, populair bij ${whoText}. Onze redactie kent deze regio goed en houdt het verblijf in de gaten — de waardering van ${src.rating}/10 (${src.reviews} reviews) past bij wat we er zelf van zagen.`;
    },

    _buildContextualStories(src) {
        const what = (src.what || [])[0] || 'hotel';
        const who = (src.who || [])[0] || 'couples';
        const tags = src.tags || [];
        const isAdultOnly = tags.includes('Adult Only');
        const isFamily = who.startsWith('families');
        const isWellness = tags.includes('Wellness') || what === 'wellness';
        const isMountain = tags.some(t => /berg|alpen/i.test(t));
        const isCoast = tags.some(t => /aan zee|strand|kust/i.test(t));
        const isCity = what === 'city-trip';

        const seasons = ['Zomervakantie', 'Meivakantie', 'Herfstvakantie', 'Voorjaar', 'Late zomer'];
        const season = seasons[src.id % seasons.length];

        let author, role, withWho, title, excerpt, rating;
        if (isAdultOnly || (isWellness && !isFamily)) {
            author = 'Anouk'; role = 'Redacteur wellness & boutique';
            withWho = 'Met mijn partner';
            title = `"Stilte als de eigenlijke faciliteit"`;
            excerpt = `We boekten ${src.name} voor een lang weekend zonder enige verwachting — en kwamen terug met het gevoel dat we er een paar dagen langer hadden moeten blijven. Het is een van die plekken waar je merkt dat het personeel begrijpt waarom je hier bent…`;
            rating = 8.8;
        } else if (isFamily && (what === 'camping' || what === 'holiday-park')) {
            author = 'Mardy'; role = 'Redacteur kamperen';
            withWho = 'Met een peuter en een kleuter';
            title = `"De kids waren binnen tien minuten weg"`;
            excerpt = `Wat ons bij ${src.name} opviel was niet de grote dingen — de glijbaan, het zwembad, de animatie — maar de kleine: voldoende schaduw, geen ellenlange wachtrijen bij de receptie, sanitair dat 's avonds nog netjes is…`;
            rating = 8.3;
        } else if (isMountain) {
            author = 'Mark'; role = 'Redacteur bergvakanties';
            withWho = 'Met mijn partner';
            title = `"Een week wandelen, zonder ooit dezelfde route te doen"`;
            excerpt = `Vanaf ${src.name} liepen we elke dag een andere route — sommige korter, sommige van zonsopgang tot late middag. De accommodatie zelf was het ankerpunt waar we 's avonds graag terugkwamen…`;
            rating = 8.9;
        } else if (isCoast) {
            author = 'Lisa'; role = 'Redacteur kustvakanties';
            withWho = isFamily ? 'Met de kinderen' : 'Met mijn partner';
            title = `"De ochtenden waren het mooiste deel"`;
            excerpt = `We werden bij ${src.name} elke dag wakker met geluid van de zee — en hoe vaak je dat ook in een review leest, het maakt nog steeds een verschil. Vooral buiten de drukke uren voelt deze plek echt rustig…`;
            rating = 8.7;
        } else if (isCity) {
            author = 'Sanne'; role = 'Redacteur stedentrips';
            withWho = 'Met mijn partner';
            title = `"Centraal genoeg, maar net niet ín de drukte"`;
            excerpt = `${src.name} ligt op een loopafstand waardoor je 's avonds zonder taxi terug komt, maar net buiten de assen waar de groepsreizen samenkomen. We waren binnen vijf minuten in een buurtcafé dat niet in de Lonely Planet staat…`;
            rating = 8.5;
        } else {
            author = 'Quentin'; role = 'Redactielid';
            withWho = 'Met mijn vrouw';
            title = `"Een week die langer voelde dan het was"`;
            excerpt = `We hadden geen specifieke verwachtingen toen we ${src.name} boekten — wat ook waarom we er goede herinneringen aan over hebben. De accommodatie deed wat ze beloofde, en de omgeving deed de rest…`;
            rating = 8.4;
        }

        return [{
            rating,
            title,
            author,
            role,
            with: withWho,
            when: `${season} ${2023 + (src.id % 2)}`,
            excerpt,
            replies: 1 + (src.id % 3)
        }];
    },

    // ============================================================
    // CONTEXTUAL CLIMATE FALLBACK
    // Synth-records uit SITE_DATA hadden geen climate-array, waardoor
    // de "Weer & Klimaat" sectie als lege bordered container
    // verscheen op accommodatie-detail-pagina's. Deze helper bouwt
    // een vergelijkbaar profiel (5 vakantie-relevante maanden,
    // realistische temp/regen/zon-waarden) op basis van src.where
    // zodat élke detail-pagina een betekenisvolle klimaat-rij toont.
    // Profielen zijn regional gegroepeerd (Mediterraan, Atlantisch,
    // Centraal-Europees, Alpine) en aligned op de bestaande
    // hardcoded climate-records.
    // ============================================================
    _buildContextualClimate(src) {
        const where = src.where || '';
        // Regional climate profiles — 5 vakantie-relevante maanden
        // (Mei → Sept) plus winterse Dec→Feb opties via key. Houd
        // in sync met de hardcoded records (id 1-6) zodat de
        // visuele consistentie behouden blijft.
        const PROFILES = {
            // Mediterraan-zomer (warm + droog)
            mediterranean: [
                { month: 'Mei',  temp: 22, rain: 5, sun: 9 },
                { month: 'Juni', temp: 26, rain: 3, sun: 11 },
                { month: 'Juli', temp: 29, rain: 1, sun: 12 },
                { month: 'Aug',  temp: 29, rain: 2, sun: 11 },
                { month: 'Sept', temp: 26, rain: 4, sun: 9 }
            ],
            // Atlantisch (Frankrijk west-kust, Bretagne, Normandië)
            atlantic: [
                { month: 'Mei',  temp: 17, rain: 8, sun: 7 },
                { month: 'Juni', temp: 20, rain: 6, sun: 8 },
                { month: 'Juli', temp: 23, rain: 5, sun: 9 },
                { month: 'Aug',  temp: 23, rain: 6, sun: 8 },
                { month: 'Sept', temp: 20, rain: 8, sun: 6 }
            ],
            // Centraal-Europees (NL / BE / Duitsland-laagland)
            centraal: [
                { month: 'Mei',  temp: 16, rain: 9, sun: 7 },
                { month: 'Juni', temp: 19, rain: 8, sun: 8 },
                { month: 'Juli', temp: 22, rain: 8, sun: 8 },
                { month: 'Aug',  temp: 21, rain: 8, sun: 7 },
                { month: 'Sept', temp: 18, rain: 9, sun: 5 }
            ],
            // Alpine (Oostenrijk / Zuid-Tirol / hoog Duitsland)
            alpine: [
                { month: 'Mei',  temp: 14, rain: 10, sun: 6 },
                { month: 'Juni', temp: 18, rain: 11, sun: 7 },
                { month: 'Juli', temp: 21, rain: 10, sun: 8 },
                { month: 'Aug',  temp: 20, rain: 10, sun: 7 },
                { month: 'Sept', temp: 16, rain: 9, sun: 5 }
            ],
            // Adriatisch (Kroatië)
            adriatic: [
                { month: 'Mei',  temp: 21, rain: 6, sun: 9 },
                { month: 'Juni', temp: 25, rain: 4, sun: 11 },
                { month: 'Juli', temp: 28, rain: 3, sun: 12 },
                { month: 'Aug',  temp: 28, rain: 4, sun: 11 },
                { month: 'Sept', temp: 24, rain: 6, sun: 9 }
            ]
        };
        // Mapping van where-key naar profile. Default: centraal
        // (NL-laagland gevoel) voor onbekende of provincie-keys.
        const WHERE_PROFILE = {
            // EU
            'spanje': 'mediterranean', 'italie': 'mediterranean', 'portugal': 'mediterranean',
            'frankrijk': 'atlantic',
            'belgie': 'centraal', 'duitsland': 'centraal', 'nederland': 'centraal',
            'oostenrijk': 'alpine',
            'kroatie': 'adriatic',
            // NL provincies — allen centraal-europees
            'drenthe': 'centraal', 'gelderland': 'centraal', 'limburg': 'centraal',
            'zeeland': 'centraal', 'noord-holland': 'centraal', 'overijssel': 'centraal',
            'flevoland': 'centraal', 'friesland': 'centraal', 'groningen': 'centraal',
            'noord-brabant': 'centraal', 'zuid-holland': 'centraal', 'utrecht': 'centraal'
        };
        // Bergen-tag override: een hotel "in de bergen" in Italië krijgt
        // alpine-klimaat i.p.v. mediterraan, voor realisme.
        const tags = src.tags || [];
        const isMountain = tags.some(t => /berg|alpen|tirool/i.test(t));
        const profileKey = isMountain ? 'alpine' : (WHERE_PROFILE[where] || 'centraal');
        const profile = PROFILES[profileKey];
        // Defensief copy zodat downstream renders de array niet
        // accidenteel muteren tussen records.
        return profile.map(m => ({ ...m }));
    },

    goToDetail(id) {
        // Fallback-synth zorgt dat ook IDs uit SITE_DATA correct openen
        const acc = this._ensureAccommodation(id);
        if (!acc) { console.warn('Accommodatie niet gevonden:', id); return; }
        this.state.currentDetailId = acc.id;
        this.renderDetail();
        this.goToPage('detail');
    },

    // ========== RENDER: CATEGORY (Niveau 2) ==========
    renderCategoryFilters() {
        this.renderChips('filter-who', 'who');
        this.renderChips('filter-what', 'what');
        this.renderChips('filter-where', 'where');
        this.updateMatchCount('match-count');
    },

    // ========== RENDER: COMBINATION (Niveau 3) ==========
    renderCombinationFilters() {
        const container = document.getElementById('combination-filters');
        container.innerHTML = `
            <div class="filter-group">
                <h3>👥 Wie gaat er mee?</h3>
                <div class="filter-chips" id="combo-filter-who"></div>
            </div>
            <div class="filter-group">
                <h3>🏖️ Wat voor vakantie?</h3>
                <div class="filter-chips" id="combo-filter-what"></div>
            </div>
            <div class="filter-group">
                <h3>🗺️ Waar wil je heen?</h3>
                <div class="filter-chips" id="combo-filter-where"></div>
            </div>
        `;
        this.renderChips('combo-filter-who', 'who');
        this.renderChips('combo-filter-what', 'what');
        this.renderChips('combo-filter-where', 'where');
        this.renderChips('filter-accommodation', 'accommodation');
        this.renderChips('filter-location', 'location');
        this.renderChips('filter-budget', 'budget');
        this.renderChips('filter-facilities', 'facilities');
        this.updateMatchCount('combo-match-count');
    },

    // ========== RENDER: LISTING (Niveau 4) ==========
    renderListing() {
        ['who','what','where','accommodation','location','budget','facilities'].forEach(key => {
            this.renderChips(`sidebar-filter-${key}`, key, true);
        });
        this.updateListing();
    },

    updateListing() {
        const filtered = this.sortAccommodations(this.getFilteredAccommodations());
        const grid = document.getElementById('accommodations-grid');
        const noResults = document.getElementById('no-results');
        document.getElementById('results-count').textContent = filtered.length;

        if (filtered.length === 0) {
            grid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        grid.innerHTML = filtered.map(acc => {
            // Listing-card tags: type-tag + ligging-tag + tot 3
            // facility-tags afgeleid uit acc.facilityKeys via de
            // canonieke labels.facilities-map. Geeft elke kaart 3-5
            // betekenisvolle chips i.p.v. de oude 2. Dedupliceert
            // op label-niveau zodat we geen "Hotel · Hotel" krijgen
            // wanneer een what-/facility-key naar dezelfde tekst
            // resolved.
            const seen = new Set();
            const pushUnique = (txt, target) => {
                if (txt && !seen.has(txt)) { seen.add(txt); target.push(txt); }
            };
            const tagLabels = [];
            (acc.whatKeys || []).slice(0, 1).forEach(k => pushUnique(this.labels.what[k], tagLabels));
            (acc.locationKeys || []).slice(0, 1).forEach(k => pushUnique(this.labels.location[k], tagLabels));
            (acc.facilityKeys || []).slice(0, 3).forEach(k => pushUnique(this.labels.facilities[k], tagLabels));
            return `
                <div class="accommodation-card" onclick="app.goToDetail(${acc.id})">
                    <img src="${acc.image}" alt="${acc.name}" loading="lazy">
                    <div class="accommodation-card-content">
                        <h3>${acc.name}</h3>
                        <p class="accommodation-card-location">${acc.location}</p>
                        <div class="accommodation-card-rating">⭐ ${acc.rating.toFixed(1)} (${acc.reviews})</div>
                        <div class="accommodation-card-price">€${acc.price}/nacht</div>
                        <div class="accommodation-card-tags">
                            ${tagLabels.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ========== RENDER: DETAIL (Niveau 5) ==========
    renderDetail() {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        this.state.currentSlide = 0;

        // Header — title only. De oude #detail-stars span naast de
        // titel is verwijderd uit Navigatie.html: die concurreerde
        // met de actie-iconen op mobile en perste de title-breedte.
        // Sterren-rating is nog steeds zichtbaar in "In het Kort"
        // (acc.rating/10) + de reviews-rail verderop.
        document.getElementById('detail-title').textContent = acc.name;
        const starsEl = document.getElementById('detail-stars');
        if (starsEl) starsEl.innerHTML = '';

        // Slider
        document.getElementById('detail-main-image').src = acc.images[0];
        document.getElementById('slider-index').textContent = 1;
        document.getElementById('slider-total').textContent = acc.images.length;
        document.getElementById('gallery-thumbnails').innerHTML = acc.images.map((img, idx) => `
            <div class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="app.changeImage(${idx}, this)">
                <img src="${img}" alt="Afbeelding ${idx+1}" loading="lazy">
            </div>
        `).join('');

        // USP-row is samengevoegd met #detail-tags hieronder: alle
        // feature-cards (facilities, type, doelgroep, sfeer, ligging,
        // context) komen nu in ÉÉN canonical .detail-tags grid. De
        // oude tweede rij was visueel verwarrend omdat het dezelfde
        // accommodatie-traits als feature-cards toonde, alleen
        // verdeeld over 2 visueel-gelijke blokken. We leegen de
        // #usp-row mount zodat hij niet rendert (CSS `.usp-row:empty
        // { display: none }`). Facility-labels worden mee opgenomen
        // in de unified tag-list verderop. De TAG_ICONS map hieronder
        // bevat al alle facility-emoji's via de canonieke labels.
        const facilityKeys = acc.facilityKeys || [];
        const uspRow = document.getElementById('usp-row');
        if (uspRow) {
            uspRow.innerHTML = '';
            uspRow.classList.remove('has-overflow', 'expanded');
        }

        // Contextuele feature-card tags. Bouwt één geünifieerde lijst
        // op uit:
        //   • acc.tags  (synthesized-from-SITE_DATA records dragen
        //                hier de canonieke string-labels — bv.
        //                "Appartement", "Adult Only", "Aan zee")
        //   • acc.whatKeys      → this.labels.what[k]
        //   • acc.locationKeys  → this.labels.location[k]
        //   • acc.facilityKeys  → this.labels.facilities[k]
        // Dedupe via Set zodat we geen "Hotel · Hotel" krijgen.
        // Iedere tag wordt als feature-card met icon-circle + label
        // gerendered (.detail-tag) i.p.v. een flat pill — visueel
        // afgestemd op .usp-item zodat de detail-page één
        // feature-card vocabulaire heeft. TAG_ICONS hieronder bouwt
        // het icoon op via de canonieke tag-label.
        const TAG_ICONS = {
            // Accommodatie-type
            'Hotel': '🏨', 'Kamperen': '⛺', 'Camping': '⛺', 'Vakantiepark': '🎡',
            'Glamping': '✨', 'Bungalow': '🏡', 'Chalet': '🏔️', 'Resort': '🌴',
            'Villa': '🏛️', 'Appartement': '🏢', 'B&B': '🛌',
            'Boutique': '🛎️', 'Design': '🎨',
            // Ligging
            'Aan zee': '🌊', 'Aan het strand': '🏖️', 'In de bergen': '⛰️',
            'Aan een meer': '🚤', 'Nabij natuur': '🌲', 'Nabij natuur/bos': '🌲',
            'Centraal gelegen': '📍', 'Afgelegen': '🌌', 'Stad': '🏙️',
            'In de stad': '🏙️', 'Bos': '🌲', 'Natuur': '🌲',
            'Bergen': '⛰️', 'Europa': '🌍',
            // Faciliteiten
            'Binnenzwembad': '🏊', 'Glijbanen': '🛝', 'Kinderpret': '🎠',
            'All-inclusive': '🍽️', 'Sport & Spel': '⚽', 'Outdoor activiteiten': '🧗',
            'Ontspanning': '🧘', 'Bezienswaardigheden': '📷', 'Fietsroutes': '🚴',
            'Looproutes': '🥾', 'Diervriendelijk': '🐕', 'Luxe': '✨',
            'Entertainment': '🎭', 'Open bar': '🍸', 'Live muziek': '🎵',
            'Wateractiviteiten': '🌊', 'Feestelijk': '🎉',
            // Audience
            'Adult Only': '🥂', 'Volwassenen': '👥', 'Voor koppels': '💑',
            'Voor gezinnen': '👨‍👩‍👧', 'Voor gezinnen met kinderen': '👨‍👩‍👧',
            'Voor gezinnen met tieners': '🧑', "Voor gezinnen met baby's": '👶',
            'Voor senioren': '👴', 'Voor vrienden': '👫', 'Voor solo': '🚶',
            'Voor alleen reizenden': '🚶', 'Met huisdier': '🐕',
            // Vacation style
            'Weekendje weg': '🗓️', 'Zonvakantie': '☀️', 'Wintervakantie': '❄️',
            'Wintersport': '⛷️', 'Wellness': '💆', 'Cultuur': '🎭',
            'Romantisch': '💕', 'Avontuur': '🧭', 'Stedentrip': '🌆',
            'Citytrip': '🌆', 'Actief / Avontuur': '🧭', 'Actief': '🏃',
            // Country
            'Italië': '🍝', 'Spanje': '🥘', 'Frankrijk': '🗼', 'Duitsland': '🍺',
            'Nederland': '🇳🇱', 'België': '🍫', 'Portugal': '🍷', 'Kroatië': '⛵',
            'Oostenrijk': '🎿'
        };
        const tagsEl = document.getElementById('detail-tags');
        if (tagsEl) {
            // EENE canonieke feature-tag grid voor de hele detail-pagina.
            // Bouwt 1 geünifieerde lijst op uit:
            //   • acc.facilityKeys  → this.labels.facilities[k]  (was usp-row)
            //   • acc.tags           (canonieke string-labels)
            //   • acc.whatKeys       → this.labels.what[k]
            //   • acc.locationKeys   → this.labels.location[k]
            // Set-dedupe zodat we geen "Hotel · Hotel" of "Adult Only ·
            // Adult Only" krijgen wanneer een tag-string en een
            // facility-key naar dezelfde label resolven.
            //
            // Recommendation-phrasings die NIET in de feature-tag grid
            // horen — die zijn redactionele aanbevelings-context
            // (eerder thuis in "Ideaal voor" of de editorial-card),
            // geen harde accommodatie-trait. "Weekendje weg" is ook
            // de canonieke label voor what='city-trip' — we remappen
            // dat naar "Stedentrip" (een echte verblijfsstijl) zodat
            // de what-key visueel blijft maar niet als marketing-
            // phrase leest.
            const RECOMMENDATION_PHRASES = new Set([
                'Weekendje weg',
                'Korte vakantie',
                'Lang weekend',
                'Last minutes',
                'Lastminute'
            ]);
            const WHAT_FEATURE_REMAP = {
                'city-trip': 'Stedentrip'
            };
            const seen = new Set();
            const displayTags = [];
            const add = (txt) => {
                if (!txt || seen.has(txt)) return;
                if (RECOMMENDATION_PHRASES.has(txt)) return;
                seen.add(txt); displayTags.push(txt);
            };
            // Volgorde-strategie: type eerst (geeft direct context),
            // dan ligging, dan facilities/sfeer/context (acc.tags),
            // dan resterende facility-keys. Dat geeft een natuurlijke
            // lees-volgorde op de feature-card grid.
            (acc.whatKeys || []).forEach(k => add(WHAT_FEATURE_REMAP[k] || this.labels.what[k]));
            (acc.locationKeys || []).forEach(k => add(this.labels.location[k]));
            (acc.facilityKeys || []).forEach(k => add(this.labels.facilities[k]));
            (acc.tags || []).forEach(add);
            tagsEl.innerHTML = displayTags
                .map(t => `
                    <div class="detail-tag">
                        <span class="detail-tag-circle" aria-hidden="true">${TAG_ICONS[t] || '•'}</span>
                        <span class="detail-tag-label">${t}</span>
                    </div>
                `)
                .join('');
        }

        // In het kort
        document.getElementById('ihk-list').innerHTML = `
            <li><span class="ihk-icon">🧑</span><div><strong>Ideaal voor:</strong> ${acc.idealFor || acc.whoKeys.map(k => this.labels.who[k]).filter(Boolean).join(', ')}</div></li>
            <li><span class="ihk-icon">🌳</span><div><strong>Ligging:</strong> ${acc.situated || acc.location}</div></li>
            <li><span class="ihk-icon">⭐</span><div><strong>Beoordeling:</strong> ${acc.rating.toFixed(1)}/10 op basis van ${acc.reviews} beoordelingen</div></li>
        `;

        document.getElementById('detail-location').textContent = '📍 ' + acc.location;
        document.getElementById('detail-description').textContent = acc.description;

        // Favoriet-knop: schone SVG-hartje i.p.v. emoji. Active-state vult
        // de SVG (fill) via .is-fav klasse; toggleFavorite() uit site.js
        // slaat het op in localStorage.
        const favBtn = document.getElementById('detail-fav-btn');
        if (favBtn && typeof isFavorite === 'function') {
            const heartSvg = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
            const applyFavState = () => {
                const saved = isFavorite(acc.id);
                favBtn.classList.toggle('is-fav', saved);
                favBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
                favBtn.innerHTML = heartSvg;
                favBtn.title = saved ? 'Verwijder uit favorieten' : 'Opslaan als favoriet';
            };
            applyFavState();
            favBtn.onclick = () => { toggleFavorite(acc.id); applyFavState(); };
        }
        document.getElementById('detail-price').textContent = `€${acc.price}`;

        // Sticky CTA
        document.getElementById('sticky-cta-title').textContent = acc.name;
        document.getElementById('sticky-cta-price').textContent = `€${acc.price}`;

        // ===== Details-tab =====
        document.getElementById('editorial-verdict').textContent = acc.editorial ||
            'De redactie werkt aan een uitgebreid oordeel voor deze accommodatie.';
        document.getElementById('detail-long-description').textContent = acc.longDescription;
        // "Belangrijkste faciliteiten" is vervangen door het Reviews-blok (zie verderop).
        this.renderReviewsRail(acc);

        // Reisverslagen van onze redactie
        const storiesEl = document.getElementById('editorial-stories');
        if ((acc.editorialStories || []).length === 0) {
            storiesEl.innerHTML = `<p style="color:var(--secondary)">Er zijn nog geen redactie-reisverslagen voor deze accommodatie.</p>`;
        } else {
            storiesEl.innerHTML = acc.editorialStories.map(s => `
                <article class="story-card">
                    <div class="story-tags">
                        <span class="story-verified">✓ ZELF BEZOCHT &amp; GEVERIFIEERD</span>
                        <span class="story-rating">★ ${s.rating.toFixed(1)}</span>
                    </div>
                    <h4 class="story-title">${s.title}</h4>
                    <div class="story-author">
                        <div class="story-avatar">👤</div>
                        <div class="story-meta">
                            <div class="name">${s.author} <span class="verified-check">✓</span></div>
                            <div><strong>Rol:</strong> ${s.role}</div>
                            <div><strong>Met wie:</strong> ${s.with}</div>
                            <div><strong>Bezocht:</strong> ${s.when}</div>
                        </div>
                    </div>
                    <p class="story-excerpt">${s.excerpt}</p>
                    <div class="story-footer">
                        <span>${s.replies} reacties</span>
                        <a href="${s.id ? 'reisverslag-detail.html?id=' + s.id : 'reisverslagen.html'}" class="story-read">Lees reisverslag →</a>
                    </div>
                </article>
            `).join('');
        }

        // Het oude inline "Beoordelingen van gasten" blok is vervangen door
        // renderReviewsRail() bovenaan de Details-tab.

        // Rooms — direct zichtbaar met afbeelding per kamertype
        const roomGradients = [
            ['#667eea','#764ba2'], ['#f093fb','#f5576c'], ['#4facfe','#00c6ff'],
            ['#43e97b','#38f9d7'], ['#fa709a','#fee140'], ['#a8edea','#fed6e3']
        ];
        const roomEmoji = (name) => {
            const s = (name || '').toLowerCase();
            if (s.includes('suite')) return '🛏️';
            if (s.includes('villa')) return '🏡';
            if (s.includes('chalet')) return '🏔️';
            if (s.includes('bungalow')) return '🏘️';
            if (s.includes('tent') || s.includes('safari') || s.includes('glamping')) return '⛺';
            if (s.includes('apart') || s.includes('appart')) return '🏢';
            if (s.includes('lodge')) return '🌲';
            return '🛏️';
        };
        document.getElementById('rooms-list').innerHTML = acc.rooms.map((r, i) => {
            const [c1, c2] = roomGradients[i % roomGradients.length];
            const emoji = roomEmoji(r);
            const img = `data:image/svg+xml;utf8,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='300' viewBox='0 0 480 300'>
                 <defs><linearGradient id='rg' x1='0' y1='0' x2='1' y2='1'>
                 <stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/>
                 </linearGradient></defs>
                 <rect width='480' height='300' fill='url(%23rg)'/>
                 <text x='240' y='180' font-size='120' text-anchor='middle' font-family='system-ui'>${emoji}</text>
                 </svg>`)}`;
            return `
                <div class="room-item">
                    <img class="room-image" src="${img}" alt="${r}" loading="lazy">
                    <div class="room-body">
                        <div class="room-name">${r}</div>
                        <p>Comfortabel en goed uitgerust met moderne voorzieningen.</p>
                    </div>
                </div>
            `;
        }).join('');

        // ===== Info-tab =====
        // Klimaat — defensieve fallback: als een record geen climate-
        // array heeft (bv. een legacy hardcoded entry die ooit zonder
        // climate werd toegevoegd), genereren we er één op basis van
        // de where-key zodat NOOIT meer een lege "Weer & Klimaat"
        // bordered box verschijnt op een detail-pagina.
        const region = acc.location.split(',').slice(-1)[0].trim();
        document.getElementById('climate-title').textContent = `Weer & Klimaat — ${region}`;
        let climate = acc.climate;
        if (!climate || !climate.length) {
            climate = this._buildContextualClimate({
                where: acc.whereKey || '',
                tags: acc.tags || []
            });
        }
        document.getElementById('climate-months').innerHTML = climate.map(m => `
            <div class="climate-month">
                <div class="month-name">${m.month}</div>
                <div class="climate-row">☀️ ${m.temp}°C</div>
                <div class="climate-row">💧 ${m.rain} dagen regen</div>
                <div class="climate-row">🌞 ${m.sun}u zon</div>
            </div>
        `).join('');

        // Locatie & hotspots — eenvoudige kaart met pins
        const mapEl = document.getElementById('hotspot-map');
        const accX = acc.coords?.x ?? 50;
        const accY = acc.coords?.y ?? 50;
        // Genereer deterministische posities voor hotspot-pins rondom de accommodatie
        const hotspotPins = acc.hotspots.map((h, i) => {
            const angle = (i / Math.max(acc.hotspots.length, 1)) * Math.PI * 2;
            const r = 18 + (i % 2) * 6;
            const x = Math.max(8, Math.min(92, accX + Math.cos(angle) * r));
            const y = Math.max(15, Math.min(85, accY + Math.sin(angle) * r));
            return `<span class="hotspot-pin" data-kind="hotspot" style="left:${x}%; top:${y}%" title="${h.name}">📍</span>`;
        }).join('');
        mapEl.innerHTML = `
            <span class="hotspot-pin" data-kind="accommodation" style="left:${accX}%; top:${accY}%" title="${acc.name}">📍</span>
            ${hotspotPins}
        `;
        document.getElementById('hotspots-list').innerHTML =
            acc.hotspots.map(h => `<li><span>📍 <strong>${h.name}</strong></span><span>${h.distance}</span></li>`).join('');

        // Beoordelingskader — altijd renderen, ook als ratingFrame ontbreekt.
        // Fallback: 6 standaard-categorieën afgeleid van acc.rating zodat het
        // blok nooit leeg blijft en een zinvol beeld geeft.
        const defaultFrame = (() => {
            const base = typeof acc.rating === 'number' ? acc.rating : 8.5;
            const clamp = (n) => Math.max(5, Math.min(10, n));
            return {
                ligging:           clamp(base + 0.3),
                schoon:            clamp(base + 0.1),
                personeel:         clamp(base + 0.2),
                voorzieningen:     clamp(base - 0.1),
                'prijs/kwaliteit': clamp(base - 0.3),
                eten:              clamp(base - 0.2)
            };
        })();
        const frame = (acc.ratingFrame && Object.keys(acc.ratingFrame).length) ? acc.ratingFrame : defaultFrame;
        document.getElementById('rating-frame').innerHTML = Object.entries(frame).map(([label, raw]) => {
            const val = Number(raw) || 0;
            const pct = Math.max(0, Math.min(100, (val / 10) * 100));
            const cap = label.charAt(0).toUpperCase() + label.slice(1);
            return `
                <div class="rating-row">
                    <span class="rating-label">${cap}</span>
                    <div class="rating-bar-wrap"><div class="rating-bar-fill" style="width:${pct}%"></div></div>
                    <span class="rating-value">${val.toFixed(1)}</span>
                </div>
            `;
        }).join('');

        // FAQ + locatie-info
        document.getElementById('faq-accordion').innerHTML = acc.faq.map(f => `
            <div class="faq-item">
                <div class="faq-question" onclick="app.toggleFAQ(this)">
                    <span>${f.q}</span>
                    <span class="faq-toggle">▼</span>
                </div>
                <div class="faq-answer"><p>${f.a}</p></div>
            </div>
        `).join('');
        document.getElementById('location-info').textContent =
            `Gelegen in ${acc.location}, op korte afstand van lokale attracties en voorzieningen.`;

        // Prices
        this.renderPriceComparison(acc);

        // Vergelijkbare accommodaties: match op zelfde where of gedeelde what,
        // huidige uitsluiten, altijd minstens 3 resultaten tonen (pad aan met
        // best-gewaardeerde populaire items als er te weinig matches zijn).
        const curWhere = acc.whereKey || acc.where;
        const curWhat = acc.whatKeys || acc.what || [];
        const pool = (typeof SITE_DATA !== 'undefined' && SITE_DATA.accommodations) || [];
        const seen = new Set([acc.id]);
        const matches = pool.filter(a => {
            if (seen.has(a.id)) return false;
            return a.where === curWhere || (a.what || []).some(w => curWhat.includes(w));
        });
        matches.forEach(a => seen.add(a.id));
        // Fallback: vul aan met top-rated andere accommodaties
        const padding = pool
            .filter(a => !seen.has(a.id))
            .sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const alts = matches.concat(padding).slice(0, 4);

        // Kleine deterministische gradient per id, zelfde aanpak als elders
        const ALT_GRADIENTS = [
            ['#4facfe','#00c6ff'], ['#43e97b','#38f9d7'], ['#f093fb','#f5576c'],
            ['#fa709a','#fee140'], ['#667eea','#764ba2'], ['#84fab0','#8fd3f4']
        ];
        // Match signals + check-svg uit site.js gebruiken — zelfde
        // recommendation-taal als "Voor jou geselecteerd" cards.
        // Fallback: als buildMatchSignals niet beschikbaar is (oude
        // cache van site.js), tonen we alleen de basis-info zonder
        // crashen.
        const hasSignals = typeof buildMatchSignals === 'function';
        const checkSvg = '<svg class="match-check-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        document.getElementById('alternatives-grid').innerHTML = alts.map(a => {
            const [c1, c2] = ALT_GRADIENTS[a.id % ALT_GRADIENTS.length];
            const emoji = a.emoji || '🏝️';
            const signals = hasSignals ? buildMatchSignals(a) : [];
            const matchesHtml = signals.length
                ? `<ul class="listing-card-matches" aria-label="Waarom dit past">
                       ${signals.map(s => `<li class="listing-card-match-row">${checkSvg}<span>${s}</span></li>`).join('')}
                   </ul>`
                : '';
            return `
                <a class="card" href="Navigatie.html?acc=${a.id}" style="text-decoration:none;color:inherit;">
                    <div class="card-img-fallback" style="display:flex;align-items:center;justify-content:center;font-size:2.6rem;background:linear-gradient(135deg,${c1} 0%,${c2} 100%);color:white;">${emoji}</div>
                    <div class="card-content">
                        <h3>${a.name}</h3>
                        <p class="card-location">📍 ${a.location}</p>
                        ${matchesHtml}
                        <div class="card-price">€${a.price}<small>/nacht</small></div>
                    </div>
                </a>
            `;
        }).join('');
    },

    renderPriceComparison(acc) {
        const sortBy = document.getElementById('price-sort')?.value || 'price-asc';
        const sorted = [...acc.providers].sort((a,b) =>
            sortBy === 'price-asc' ? a.price - b.price : b.price - a.price);
        const cheapest = Math.min(...acc.providers.map(p => p.price));

        document.getElementById('price-table').innerHTML = `
            <thead>
                <tr><th>Aanbieder</th><th>Prijs</th><th>Actie</th></tr>
            </thead>
            <tbody>
                ${sorted.map(p => `
                    <tr class="${p.price === cheapest ? 'cheapest' : ''}">
                        <td class="provider-name">${p.name}</td>
                        <td class="provider-price">€${p.price}</td>
                        <td><button class="btn-book" onclick="alert('Boeken bij ${p.name}')">Boek</button></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    },

    // ========== FILTER LOGIC ==========
    renderChips(containerId, filterKey, reRenderOnToggle = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const labels = this.labels[filterKey];
        container.innerHTML = Object.entries(labels).map(([value, label]) => `
            <button class="filter-chip ${this.state.activeFilters[filterKey].includes(value) ? 'active' : ''}"
                    onclick="app.toggleFilter('${filterKey}', '${value}', ${reRenderOnToggle})">
                ${label}
            </button>
        `).join('');
    },

    toggleFilter(filterKey, value, reRenderListing = false) {
        const arr = this.state.activeFilters[filterKey];
        const idx = arr.indexOf(value);
        if (idx > -1) arr.splice(idx, 1); else arr.push(value);

        this.updateHeader();

        if (this.state.currentPage === 'category') this.renderCategoryFilters();
        else if (this.state.currentPage === 'combination') this.renderCombinationFilters();
        else if (this.state.currentPage === 'listing' || reRenderListing) this.renderListing();
    },

    clearFilters() {
        Object.keys(this.state.activeFilters).forEach(k => this.state.activeFilters[k] = []);
        if (this.state.currentPage === 'listing') this.renderListing();
        else if (this.state.currentPage === 'combination') this.renderCombinationFilters();
        else if (this.state.currentPage === 'category') this.renderCategoryFilters();
        this.updateHeader();
    },

    getFilteredAccommodations() {
        const f = this.state.activeFilters;
        return this.accommodations.filter(acc => {
            if (f.who.length && !f.who.some(v => acc.whoKeys.includes(v))) return false;
            if (f.what.length && !f.what.some(v => acc.whatKeys.includes(v))) return false;
            if (f.where.length && !f.where.includes(acc.whereKey)) return false;
            if (f.accommodation.length && !f.accommodation.some(v => acc.accommodationKeys.includes(v))) return false;
            if (f.location.length && !f.location.some(v => acc.locationKeys.includes(v))) return false;
            if (f.facilities.length && !f.facilities.some(v => acc.facilityKeys.includes(v))) return false;
            if (f.budget.length) {
                // Voor prijsklasse filteren we op prijs; aanbieding-tags (last-minute, korting, ...) filteren we niet weg
                const priceKeys = f.budget.filter(b => ['budget','comfort','luxury'].includes(b));
                if (priceKeys.length) {
                    const match = priceKeys.some(b => {
                        if (b === 'budget') return acc.price < 100;
                        if (b === 'comfort') return acc.price >= 100 && acc.price < 180;
                        if (b === 'luxury') return acc.price >= 180;
                        return true;
                    });
                    if (!match) return false;
                }
            }
            return true;
        });
    },

    sortAccommodations(list) {
        const sortBy = document.getElementById('sort-select')?.value || 'default';
        const sorted = [...list];
        switch (sortBy) {
            case 'price-asc': sorted.sort((a,b) => a.price - b.price); break;
            case 'price-desc': sorted.sort((a,b) => b.price - a.price); break;
            case 'rating-desc': sorted.sort((a,b) => b.rating - a.rating); break;
        }
        return sorted;
    },

    updateMatchCount(elementId) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = this.getFilteredAccommodations().length;
    },

    // ========== HEADER CHIPS ==========
    updateHeader() {
        // De oude top-header met #active-filters-display is vervangen door de
        // unified .site-header. Filter-chips verschijnen op de listing-pagina
        // nog steeds in de sidebar. Deze functie is een no-op wanneer het
        // oude element niet meer bestaat.
        const display = document.getElementById('active-filters-display');
        if (!display) return;
        const tags = [];
        for (const [key, values] of Object.entries(this.state.activeFilters)) {
            values.forEach(v => tags.push({ key, value: v, label: this.labels[key]?.[v] || v }));
        }
        display.innerHTML = tags.map(t => `
            <div class="filter-tag">
                ${t.label}
                <button onclick="app.toggleFilter('${t.key}', '${t.value}', true)">×</button>
            </div>
        `).join('');
    },

    // ========== UI HELPERS ==========
    switchTab(tabName) {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        const pane = document.getElementById(`tab-${tabName}`);
        pane.classList.add('active');

        // Scroll altijd naar de top van het tab-blok, ook als de gebruiker ver
        // naar beneden gescrold staat. Explicit met window.scrollTo zodat we
        // niet afhankelijk zijn van scroll-padding-top of scrollIntoView-
        // gedrag dat soms genegeerd wordt bij sticky descendants.
        const tabs = document.querySelector('.tabs');
        if (!tabs) return;
        // Wacht een frame tot de nieuwe .tab-content is gerenderd (layout kan
        // verschuiven doordat een andere pane in beeld kwam).
        requestAnimationFrame(() => {
            const siteHeader = document.querySelector('.site-header');
            const headerH = siteHeader ? siteHeader.offsetHeight : 64;
            const tabsTop = tabs.getBoundingClientRect().top + window.pageYOffset;
            const targetY = Math.max(0, tabsTop - headerH - 8);
            window.scrollTo({ top: targetY, behavior: 'smooth' });
        });
    },

    // Klap de USP-rij (faciliteiten-tags) uit/in op mobiel
    toggleUspExpanded() {
        const row = document.getElementById('usp-row');
        if (row) row.classList.toggle('expanded');
    },

    // ===== Reviews-rail (vervangt 'Belangrijkste faciliteiten') =====
    // Rendert een sleepbare rij review-kaarten op de Details-tab.
    // Gebruikt acc.reviewsList als die bestaat; anders worden deterministische
    // placeholder-reviews gegenereerd op basis van het id van de accommodatie
    // en het totaal aantal reviews (acc.reviews).
    renderReviewsRail(acc) {
        const rail = document.getElementById('reviews-rail');
        const total = document.getElementById('reviews-total');
        const allLink = document.getElementById('reviews-all-link');
        const writeBtn = document.getElementById('btn-write-review');
        if (!rail) return;

        const totalCount = typeof acc.reviews === 'number' ? acc.reviews : 0;
        if (total) total.textContent = totalCount;
        if (allLink) allLink.onclick = (e) => {
            e.preventDefault();
            // Plekhouder: in een echt backend-scenario gaat dit naar een reviews-
            // overzichtspagina. Voor nu tonen we een notificatie.
            alert(`Alle ${totalCount} reviews komen hier straks — volledig overzicht volgt.`);
        };
        if (writeBtn) writeBtn.onclick = () => {
            alert('Review schrijven — functionaliteit volgt in de volgende stap.');
        };

        // Gebruik echte review-data wanneer beschikbaar, anders placeholders
        const reviews = (acc.reviewsList && acc.reviewsList.length)
            ? acc.reviewsList
            : this.buildPlaceholderReviews(acc);

        const stars = (r) => {
            const full = Math.floor(r);
            const half = r - full >= 0.5 ? 1 : 0;
            const empty = 5 - full - half;
            return '★'.repeat(full) + (half ? '⯪' : '') + '☆'.repeat(empty);
        };
        rail.innerHTML = reviews.map(r => `
            <article class="review-card">
                <div class="review-stars" aria-label="${r.rating.toFixed(1)} van de 5 sterren">${stars(r.rating)}</div>
                <h4 class="review-title">"${r.title}"</h4>
                <p class="review-text">${r.text}</p>
                <div class="review-meta">${r.author} · ${r.date}</div>
            </article>
        `).join('');

        // Activeer sleepbare rail (hergebruik bestaande helper uit site.js)
        if (typeof makeHorizontalRail === 'function') {
            makeHorizontalRail(rail, { itemMinWidth: 320 });
        }
    },

    // Genereert 4 deterministische placeholder-reviews per accommodatie.
    // Zodra echte review-data bestaat (acc.reviewsList) wordt deze niet meer
    // gebruikt — structuur blijft identiek zodat frontend niet hoeft te wijzigen.
    buildPlaceholderReviews(acc) {
        const pool = [
            { title: 'Geweldig voor kids', text: 'Echt een aanrader voor de meivakantie. Het zwembad is super schoon en de animatie doet enorm hun best. We komen zeker terug!', author: 'Familie de Vries', date: 'Mei 2023' },
            { title: 'Leuk, maar druk in hoogseizoen', text: 'Het park is prima verzorgd, maar in het hoogseizoen is het erg vol. Huisje was ruim genoeg voor 6 personen.', author: 'Anoniem', date: 'Augustus 2023' },
            { title: 'Prachtige omgeving', text: 'Rustgevende plek, vriendelijk personeel. We hebben hier heerlijk gewandeld en gefietst. Aanrader!', author: 'Marjolein B.', date: 'September 2024' },
            { title: 'Prijs-kwaliteit top', text: 'Voor deze prijs kregen we een heel nette accommodatie met alles erop en eraan. Bedden waren uitstekend.', author: 'Peter & Sanne', date: 'Juli 2024' }
        ];
        const base = Math.max(3.5, Math.min(5, (acc.rating || 8.5) / 2));
        return pool.map((r, i) => ({ ...r, rating: Math.round((base - i * 0.3) * 2) / 2 }));
    },

    changeImage(idx, el) {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        this.state.currentSlide = idx;
        document.getElementById('detail-main-image').src = acc.images[idx];
        document.getElementById('slider-index').textContent = idx + 1;
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        if (el) {
            el.classList.add('active');
        } else {
            const thumb = document.querySelectorAll('.thumbnail')[idx];
            if (thumb) thumb.classList.add('active');
        }
    },

    sliderNav(dir) {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        const total = acc.images.length;
        const next = ((this.state.currentSlide ?? 0) + dir + total) % total;
        this.changeImage(next);
    },

    toggleFAQ(el) {
        const answer = el.nextElementSibling;
        answer.classList.toggle('active');
        el.querySelector('.faq-toggle').classList.toggle('active');
    },

    sortPrices() {
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (acc) this.renderPriceComparison(acc);
    },

    togglePriceView(mode) {
        this.state.priceView = mode;
        document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.toggle-btn[data-toggle="${mode}"]`).classList.add('active');
        const acc = this.accommodations.find(a => a.id === this.state.currentDetailId);
        if (!acc) return;
        if (mode === 'person') {
            // Indicatief: ca. 2 personen per kamer
            document.getElementById('detail-price').textContent = `€${Math.round(acc.price / 2)}`;
            document.getElementById('price-unit').textContent = 'per persoon per nacht';
        } else {
            document.getElementById('detail-price').textContent = `€${acc.price}`;
            document.getElementById('price-unit').textContent = 'per accommodatie per nacht';
        }
    }
};

app.init();
