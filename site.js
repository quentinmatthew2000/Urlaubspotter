// site.js — gedeelde interacties (searchbar + carousel + favorites)

// ============ FAVORITES (localStorage) ============
// Opgeslagen accommodatie-IDs. Backend-onafhankelijk; overleeft refresh.
const FAV_KEY = 'urlaubspotter_favorites';
function getFavorites() {
    try {
        const raw = localStorage.getItem(FAV_KEY);
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.map(Number).filter(n => !Number.isNaN(n)) : [];
    } catch (_) { return []; }
}
function setFavorites(ids) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch (_) {}
}
function isFavorite(id) { return getFavorites().includes(Number(id)); }
function toggleFavorite(id) {
    const ids = getFavorites();
    const n = Number(id);
    const idx = ids.indexOf(n);
    if (idx >= 0) ids.splice(idx, 1); else ids.push(n);
    setFavorites(ids);
    return idx < 0; // true = nu bewaard
}

// ============ SEARCHBAR ============
// Render 3 dropdowns (Wie, Wat, Waar groepen NL/EU)
// en link naar Navigatie.html?who=&what=&where=
function renderSearchbar(containerId, { big = false, compact = false, preset = {} } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const cls = compact ? 'searchbar compact' : (big ? 'searchbar big' : 'searchbar');

    const whereOpts = `
        <optgroup label="Nederland">
            ${DATA.whereNL().map(([v, l]) => `<option value="${v}" ${preset.where === v ? 'selected' : ''}>${l}</option>`).join('')}
        </optgroup>
        <optgroup label="Europa">
            ${DATA.whereEU().map(([v, l]) => `<option value="${v}" ${preset.where === v ? 'selected' : ''}>${l}</option>`).join('')}
        </optgroup>`;

    const whatOpts = DATA.what().map(([v, l]) =>
        `<option value="${v}" ${preset.what === v ? 'selected' : ''}>${l}</option>`).join('');

    const whoOpts = DATA.who().map(([v, l]) =>
        `<option value="${v}" ${preset.who === v ? 'selected' : ''}>${l}</option>`).join('');

    container.innerHTML = `
        <form class="${cls}" onsubmit="return submitSearchbar(event)">
            <div class="searchbar-field">
                <label>Met wie ga je?</label>
                <div class="select-wrap">
                    <select name="who" data-placeholder="${!preset.who}">
                        <option value="">Kies reisgezelschap</option>
                        ${whoOpts}
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
            </div>
            <div class="searchbar-field">
                <label>Wat zoek je?</label>
                <div class="select-wrap">
                    <select name="what" data-placeholder="${!preset.what}">
                        <option value="">Kies vakantietype</option>
                        ${whatOpts}
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
            </div>
            <div class="searchbar-field">
                <label>Waar wil je naartoe?</label>
                <div class="select-wrap">
                    <select name="where" data-placeholder="${!preset.where}">
                        <option value="">Kies een bestemming</option>
                        ${whereOpts}
                    </select>
                    <span class="select-arrow">▼</span>
                </div>
            </div>
            <button type="submit" class="searchbar-btn">Toon vakanties →</button>
        </form>
    `;

    // Dynamisch placeholder-styling toggelen
    container.querySelectorAll('select').forEach(sel => {
        const sync = () => sel.setAttribute('data-placeholder', sel.value === '' ? 'true' : 'false');
        sel.addEventListener('change', sync);
        sync();
    });
}

function submitSearchbar(e) {
    e.preventDefault();
    const form = e.target;
    const params = new URLSearchParams();
    ['who','what','where'].forEach(k => {
        const val = form.elements[k]?.value;
        if (val) params.set(k, val);
    });
    window.location.href = 'alle-vakanties.html' + (params.toString() ? '?' + params.toString() : '');
    return false;
}

// ============ RAIL (sleepbare horizontale rij) ============
// Maak van een container een rail. Bindt ook muis-drag scroll.
function makeRail(el, { threshold = 5 } = {}) {
    if (!el || el.dataset.railBound === '1') return;
    // Zet wrapper voor fade-edges (alleen als parent nog geen rail-wrap is)
    if (!el.parentElement.classList.contains('rail-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'rail-wrap';
        el.parentElement.insertBefore(wrap, el);
        wrap.appendChild(el);
    }
    el.classList.remove('cat-grid', 'small');
    el.classList.add('rail');
    // Check 'small' flag from original classes via data-attr
    if (el.dataset.railSize === 'small') el.classList.add('small');
    el.dataset.railBound = '1';

    // Muis drag-to-scroll — alleen activeren als gebruiker daadwerkelijk sleept
    let isDown = false, startX = 0, startLeft = 0, moved = 0, dragging = false;
    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDown = true; moved = 0; dragging = false;
        startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        moved = Math.abs(dx);
        if (moved > threshold) {
            if (!dragging) { dragging = true; el.classList.add('dragging'); }
            el.scrollLeft = startLeft - dx;
            e.preventDefault();
        }
    });
    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        if (dragging) {
            el.classList.remove('dragging');
            // Block de eerstvolgende klik zodat de tegel waarop we zijn losgelaten niet navigeert
            const blocker = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
            el.addEventListener('click', blocker, { capture: true, once: true });
            setTimeout(() => el.removeEventListener('click', blocker, true), 50);
        }
        dragging = false;
    });

    // Muiswiel → horizontaal scrollen als er geen verticale overloop mogelijk is
    el.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });
}

// Upgrade alle .cat-grid met > minItems tiles naar rails
function autoUpgradeRails(minItems = 5) {
    document.querySelectorAll('.cat-grid').forEach(el => {
        if (el.children.length > minItems) {
            if (el.classList.contains('small')) el.dataset.railSize = 'small';
            makeRail(el);
        }
    });
}

// ============ GENERIC HORIZONTAL RAIL (voor blog/offer/listing/editorial) ============
// Zet een grid-container om in een sleepbare horizontale rij met pijltjes.
// Werkt op listing-grid, offer-grid, editorial-grid, blog-grid — behoudt de kaart-styles.
function makeHorizontalRail(el, { itemMinWidth = 300, threshold = 5 } = {}) {
    if (!el || el.dataset.hrailBound === '1') return;
    el.dataset.hrailBound = '1';

    // Wrap in hrail-wrap met pijltjes
    const wrap = document.createElement('div');
    wrap.className = 'hrail-wrap';
    el.parentElement.insertBefore(wrap, el);

    const prev = document.createElement('button');
    prev.className = 'hrail-btn hrail-prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Vorige');
    prev.innerHTML = '‹';

    const next = document.createElement('button');
    next.className = 'hrail-btn hrail-next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Volgende');
    next.innerHTML = '›';

    wrap.appendChild(el);
    wrap.appendChild(prev);
    wrap.appendChild(next);

    // Vervang grid door horizontale flex-scroll, maar behoud kaart-styles
    el.classList.add('hrail');
    el.style.setProperty('--hrail-min', `${itemMinWidth}px`);

    const scrollBy = () => Math.max(el.clientWidth * 0.8, 200);
    prev.addEventListener('click', () => el.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next.addEventListener('click', () => el.scrollBy({ left: scrollBy(), behavior: 'smooth' }));

    const updateBtns = () => {
        const max = el.scrollWidth - el.clientWidth - 1;
        prev.disabled = el.scrollLeft <= 0;
        next.disabled = el.scrollLeft >= max;
        const canScroll = el.scrollWidth > el.clientWidth + 1;
        wrap.classList.toggle('hrail-has-overflow', canScroll);
    };
    el.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns);
    setTimeout(updateBtns, 50);

    // Muis drag-to-scroll
    let isDown = false, startX = 0, startLeft = 0, moved = 0, dragging = false;
    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        // Niet slepen vanaf een knop
        if (e.target.closest('.hrail-btn')) return;
        isDown = true; moved = 0; dragging = false;
        startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        moved = Math.abs(dx);
        if (moved > threshold) {
            if (!dragging) { dragging = true; el.classList.add('dragging'); }
            el.scrollLeft = startLeft - dx;
            e.preventDefault();
        }
    });
    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        if (dragging) {
            el.classList.remove('dragging');
            const blocker = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
            el.addEventListener('click', blocker, { capture: true, once: true });
            setTimeout(() => el.removeEventListener('click', blocker, true), 50);
        }
        dragging = false;
    });

    // Muiswiel horizontaal
    el.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }, { passive: false });
}

// ============ CAROUSEL ============
function bindCarousel(carouselId) {
    const root = document.getElementById(carouselId);
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    const prev = root.querySelector('[data-dir="prev"]');
    const next = root.querySelector('[data-dir="next"]');
    if (!track) return;

    const scrollBy = () => Math.max(track.clientWidth * 0.8, 200);
    prev?.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));

    const updateBtns = () => {
        const max = track.scrollWidth - track.clientWidth - 1;
        if (prev) prev.disabled = track.scrollLeft <= 0;
        if (next) next.disabled = track.scrollLeft >= max;
    };
    track.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns);
    updateBtns();
}

// ============ RENDER HELPERS ============

// ---- Match signals voor "Voor jou geselecteerd" cards --------------
// Vervangt de oude blauwe .tag-pill chips met een curatie-gevoel:
// elke kaart krijgt 3 compacte ✓-rijen — 1 doelgroep, 1 locatie/ligging,
// 1 sfeer/vibe. Visuele taal afgestemd op de keuzehulp-result cards
// (.match-explain-row--yes) zodat "Voor jou geselecteerd" daadwerkelijk
// recommendation-driven voelt i.p.v. een random metadata-chip-strip.
//
// IMPORTANT: blijf bewust onder 3-4 rijen. Cards moeten readable,
// scanbaar en visueel rustig blijven — geen tag-overload meer.
const _MATCH_LIGGING = new Set([
    'Aan zee','Aan het strand','In de bergen','Aan een meer',
    'Nabij natuur','Nabij natuur/bos','Centraal gelegen','Afgelegen',
    'Stad','In de stad','Bos','Natuur','Bergen'
]);
const _MATCH_WHO_PHRASE = {
    'couples':         'Ideaal voor koppels',
    'families-kids':   'Voor gezinnen met kinderen',
    'families-babies': 'Voor jonge gezinnen',
    'families-teens':  'Voor gezinnen met tieners',
    'friends':         'Top voor vriendengroepen',
    'seniors':         'Comfortabel voor senioren',
    'solo':            'Fijn voor solo-reizigers',
    'pets':            'Welkom met huisdier'
};
const _MATCH_VIBE_PHRASE = {
    'Wellness':        'Wellness sfeer',
    'Romantisch':      'Romantische setting',
    'Adult Only':      'Volwassenen-only',
    'Luxe':            'Luxe verblijf',
    'All-inclusive':   'All-inclusive comfort',
    'Sport & Spel':    'Actief & sportief',
    'Cultuur':         'Cultureel rijke omgeving',
    'Avontuur':        'Avontuurlijke setting',
    'Kinderpret':      'Veel voor kinderen',
    'Ontspanning':     'Rustige, ontspannen sfeer',
    'Diervriendelijk': 'Diervriendelijk',
    'Feestelijk':      'Feestelijke sfeer',
    'Stedentrip':      'Sfeervolle stedentrip',
    'Citytrip':        'Sfeervolle stedentrip',
    'Weekendje weg':   'Perfect voor een weekendje',
    'Bezienswaardigheden': 'Veel te ontdekken'
};
function buildMatchSignals(a) {
    const signals = [];
    const used = new Set();
    const add = (text) => { if (text && !used.has(text)) { used.add(text); signals.push(text); } };

    // 1. Doelgroep — eerste who-key, natuurlijke NL-frasering.
    const who = (a.who || [])[0];
    if (who) add(_MATCH_WHO_PHRASE[who] || `Ideaal voor ${(DATA.label('who', who) || who).toLowerCase()}`);

    // 2. Locatie / ligging — ligging-tag uit acc.tags; anders where-label.
    const lig = (a.tags || []).find(t => _MATCH_LIGGING.has(t));
    if (lig) add(lig);
    else if (a.where) add(DATA.label('where', a.where));

    // 3. Sfeer / vibe — eerste matchende vibe-tag uit phrase-map.
    const vibe = (a.tags || []).find(t => _MATCH_VIBE_PHRASE[t]);
    if (vibe) add(_MATCH_VIBE_PHRASE[vibe]);

    return signals.slice(0, 3);
}
const _MATCH_CHECK_SVG = '<svg class="match-check-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderListingPreview(containerId, accommodations, { limit = 6 } = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const list = accommodations.slice(0, limit);
    if (list.length === 0) {
        el.innerHTML = `<div class="listing-empty">Geen accommodaties gevonden — <a href="Navigatie.html">bekijk alle</a></div>`;
        return;
    }
    el.innerHTML = list.map(a => {
        const signals = buildMatchSignals(a);
        return `
        <a class="listing-card" href="Navigatie.html?acc=${a.id}">
            <div class="listing-card-img" style="background: ${gradientFor(a)}">
                <img src="${photoUrlFor(a, 640, 420)}" alt="${a.name}" loading="lazy" onerror="this.style.display='none'"/>
                <span class="listing-card-emoji" aria-hidden="true">${a.emoji || '✦'}</span>
                <span class="listing-card-badge">${DATA.label('where', a.where)}</span>
            </div>
            <div class="listing-card-body">
                <h3>${a.name}</h3>
                <p class="listing-card-loc">📍 ${a.location}</p>
                <ul class="listing-card-matches" aria-label="Waarom dit past">
                    ${signals.map(s => `<li class="listing-card-match-row">${_MATCH_CHECK_SVG}<span>${s}</span></li>`).join('')}
                </ul>
                <div class="listing-card-foot">
                    <span class="listing-card-rating">★ ${a.rating.toFixed(1)} · ${a.reviews}</span>
                    <span class="listing-card-price">€${a.price}<small>/nacht</small></span>
                </div>
            </div>
        </a>`;
    }).join('');
}

// ---- Feature-card tags voor detail-pagina's ------------------------
// Shared TAG_ICONS map + renderFeatureTags() helper. Gebruikt door
// accommodatie.html (slug-based detail) voor consistente premium
// visual language met Navigatie.html?acc= — geen oude blauwe
// .acd-tag pills meer. Navigatie.html?acc= heeft een vrijwel
// identieke map intern in navigatie.js voor strikte deduplicatie
// met de USP-row; houd beide in sync.
const FEATURE_TAG_ICONS = {
    'Hotel': '🏨', 'Kamperen': '⛺', 'Camping': '⛺', 'Vakantiepark': '🎡',
    'Glamping': '✨', 'Bungalow': '🏡', 'Chalet': '🏔️', 'Resort': '🌴',
    'Villa': '🏛️', 'Appartement': '🏢', 'B&B': '🛌',
    'Boutique': '🛎️', 'Design': '🎨',
    'Aan zee': '🌊', 'Aan het strand': '🏖️', 'In de bergen': '⛰️',
    'Aan een meer': '🚤', 'Nabij natuur': '🌲', 'Nabij natuur/bos': '🌲',
    'Centraal gelegen': '📍', 'Afgelegen': '🌌', 'Stad': '🏙️',
    'In de stad': '🏙️', 'Bos': '🌲', 'Natuur': '🌲',
    'Bergen': '⛰️', 'Europa': '🌍',
    'Binnenzwembad': '🏊', 'Glijbanen': '🛝', 'Kinderpret': '🎠',
    'All-inclusive': '🍽️', 'Sport & Spel': '⚽', 'Outdoor activiteiten': '🧗',
    'Ontspanning': '🧘', 'Bezienswaardigheden': '📷', 'Fietsroutes': '🚴',
    'Looproutes': '🥾', 'Diervriendelijk': '🐕', 'Luxe': '✨',
    'Entertainment': '🎭', 'Open bar': '🍸', 'Live muziek': '🎵',
    'Wateractiviteiten': '🌊', 'Feestelijk': '🎉',
    'Adult Only': '🥂', 'Volwassenen': '👥', 'Voor koppels': '💑',
    'Voor gezinnen': '👨‍👩‍👧', 'Voor gezinnen met kinderen': '👨‍👩‍👧',
    'Voor gezinnen met tieners': '🧑', "Voor gezinnen met baby's": '👶',
    'Voor senioren': '👴', 'Voor vrienden': '👫', 'Voor solo': '🚶',
    'Voor alleen reizenden': '🚶', 'Met huisdier': '🐕',
    'Weekendje weg': '🗓️', 'Zonvakantie': '☀️', 'Wintervakantie': '❄️',
    'Wintersport': '⛷️', 'Wellness': '💆', 'Cultuur': '🎭',
    'Romantisch': '💕', 'Avontuur': '🧭', 'Stedentrip': '🌆',
    'Citytrip': '🌆', 'Actief / Avontuur': '🧭', 'Actief': '🏃',
    'Italië': '🍝', 'Spanje': '🥘', 'Frankrijk': '🗼', 'Duitsland': '🍺',
    'Nederland': '🇳🇱', 'België': '🍫', 'Portugal': '🍷', 'Kroatië': '⛵',
    'Oostenrijk': '🎿'
};
// Recommendation-phrases die NIET in de feature-tag grid horen — die
// zijn redactionele aanbevelings-context (Ideaal voor / editorial-
// card), geen harde accommodatie-trait. Houd in sync met de copy
// in navigatie.js renderDetail().
const FEATURE_TAG_RECOMMENDATION_PHRASES = new Set([
    'Weekendje weg', 'Korte vakantie', 'Lang weekend', 'Last minutes', 'Lastminute'
]);
function renderFeatureTags(containerId, tags) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const seen = new Set();
    const list = (tags || []).filter(t => {
        if (!t || seen.has(t)) return false;
        if (FEATURE_TAG_RECOMMENDATION_PHRASES.has(t)) return false;
        seen.add(t); return true;
    });
    el.innerHTML = list.map(t => `
        <div class="detail-tag">
            <span class="detail-tag-circle" aria-hidden="true">${FEATURE_TAG_ICONS[t] || '•'}</span>
            <span class="detail-tag-label">${t}</span>
        </div>
    `).join('');
}

function renderCategoryTiles(containerId, entries, { linkBuilder, gradient, icons = true, size = 'default' } = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = entries.map(([value, label]) => `
        <a class="cat-tile" href="${linkBuilder(value)}">
            <div class="cat-tile-img" style="background: ${gradient}">
                ${icons ? DATA.icon(value) : ''}
            </div>
            <div class="cat-tile-body">
                <h3>${label}</h3>
                <span class="meta">Bekijk vakanties →</span>
            </div>
        </a>
    `).join('');
    // Auto-upgrade: als er meer dan 4 tegels zijn, maak er een sleepbare rail van
    if (entries.length > 4) {
        if (el.classList.contains('small')) el.dataset.railSize = 'small';
        makeRail(el);
    }
    // Bind bestaande carousel-tracks ook als rail voor drag-support
    if (el.classList.contains('carousel-track') && el.dataset.railBound !== '1') {
        // Laat carousel-track CSS intact, maar voeg drag-behaviour toe
        bindDragOnly(el);
    }
}

// Alleen drag-to-scroll, zonder classes te wijzigen (voor bestaande carousel-tracks)
function bindDragOnly(el, { threshold = 5 } = {}) {
    if (!el || el.dataset.railBound === '1') return;
    el.dataset.railBound = '1';
    el.style.cursor = 'grab';
    let isDown = false, startX = 0, startLeft = 0, moved = 0, dragging = false;
    el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        isDown = true; moved = 0; dragging = false;
        startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        moved = Math.abs(dx);
        if (moved > threshold) {
            if (!dragging) { dragging = true; el.style.cursor = 'grabbing'; el.style.userSelect = 'none'; }
            el.scrollLeft = startLeft - dx;
            e.preventDefault();
        }
    });
    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        el.style.cursor = 'grab';
        el.style.userSelect = '';
        if (dragging) {
            const blocker = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
            el.addEventListener('click', blocker, { capture: true, once: true });
            setTimeout(() => el.removeEventListener('click', blocker, true), 50);
        }
        dragging = false;
    });
}

// Genereer een gradient per accommodatie voor placeholder-afbeelding
const GRADIENTS = [
    'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
];
function gradientFor(acc) { return GRADIENTS[acc.id % GRADIENTS.length]; }

// ============ REAL PHOTO HELPERS (Phase 3 — content realism) ============
// Map an accommodation/blog/story to a deterministic Unsplash Source URL so
// every card gets a real travel photo instead of a gradient+emoji placeholder.
// We never invent local image files; Unsplash Source serves a stable image
// per seed, so the same accommodation always renders the same shot.
const PHOTO_KEYWORDS = {
    // WAT (vakantietype) → primaire visuele identiteit
    'hotel': 'boutique-hotel,interior',
    'camping': 'camping,nature,tent',
    'holiday-park': 'cabin,forest,lodge',
    'glamping': 'glamping,safari-tent,nature',
    'wellness': 'spa,wellness,pool',
    'adventure-trip': 'mountains,hiking,adventure',
    'city-trip': 'city,architecture,europe',
    'sun': 'beach,mediterranean,coast',
    'winter': 'ski,alps,snow',
    // WAAR (regio's) — voegen 'plek' toe aan de visual
    'zeeland': 'dunes,beach,netherlands',
    'drenthe': 'forest,heath,netherlands',
    'gelderland': 'veluwe,forest',
    'limburg': 'hills,vineyard,limburg',
    'noord-holland': 'dunes,coast,texel',
    'overijssel': 'twente,forest',
    'flevoland': 'lake,polder',
    'friesland': 'wadden,boat,island',
    'groningen': 'nature,wadden',
    'noord-brabant': 'forest,heath',
    'zuid-holland': 'beach,scheveningen',
    'utrecht': 'castle,countryside',
    'belgie': 'ardennen,bruges',
    'duitsland': 'black-forest,berlin',
    'frankrijk': 'provence,france-landscape',
    'spanje': 'costa-brava,andalusia',
    'italie': 'tuscany,amalfi,italy',
    'oostenrijk': 'tirol,alps,austria',
    'portugal': 'algarve,porto,portugal',
    'kroatie': 'plitvice,croatia-coast'
};
// Vertaal accommodation → Unsplash query (where + wat + sub-tags)
function photoQueryFor(acc) {
    const parts = [];
    if (acc.where && PHOTO_KEYWORDS[acc.where]) parts.push(PHOTO_KEYWORDS[acc.where]);
    if (Array.isArray(acc.what)) {
        const w = acc.what.find(k => PHOTO_KEYWORDS[k]);
        if (w) parts.push(PHOTO_KEYWORDS[w]);
    }
    if (!parts.length) parts.push('travel,europe');
    return parts.join(',');
}
// Unsplash Source — deterministic per seed
function photoUrlFor(acc, w = 640, h = 420) {
    const q = encodeURIComponent(photoQueryFor(acc));
    const seed = encodeURIComponent('upspot-' + acc.id);
    return `https://source.unsplash.com/${w}x${h}/?${q}&sig=${seed}`;
}
// Editorial photo voor blog/story-entries — gebruikt categorie of tag-hint
function photoUrlForEditorial(item, w = 720, h = 460) {
    const cat = (item.category || '').toLowerCase();
    const map = {
        'kamperen': 'camping,nature', 'wellness': 'spa,relaxation',
        'wintersport': 'ski,alps,winter', 'bestemmingen': 'travel,europe',
        'reistips': 'travel,suitcase', 'inspiratie': 'travel,landscape',
        'hotels': 'boutique-hotel,interior', 'citytrip': 'city,europe',
        'glamping': 'glamping,nature', 'vakantiepark': 'pool,resort',
        'luxe': 'luxury-hotel,pool'
    };
    let q = map[cat] || 'travel,europe';
    const seed = encodeURIComponent('upspot-blog-' + item.id);
    return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}&sig=${seed}`;
}

// ============ HEADER / FOOTER INJECT ============
function renderHeader(activePage = '') {
    const header = document.querySelector('.site-header .inner');
    if (!header) return;
    header.innerHTML = `
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false" type="button">
            <span></span><span></span><span></span>
        </button>
        <a href="index.html" class="site-logo" aria-label="Urlaubspotter home">
            <span class="site-logo-text">Urlaubspotter</span>
        </a>
        <div class="site-actions">
            <a class="site-action site-fav-link${activePage === 'favorites' ? ' active' : ''}" href="favorieten.html" aria-label="Favorieten" title="Favorieten">
                <svg class="icon-heart" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </a>
            <button class="site-action site-search-toggle" type="button" aria-label="Zoeken" aria-expanded="false">
                <svg class="icon-search" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
        </div>
        <div class="site-search" id="site-search" role="search" aria-hidden="true">
            <form class="site-search-form" onsubmit="return submitSiteSearch(event)">
                <span class="site-search-icon" aria-hidden="true">🔍</span>
                <input type="search" id="site-search-input" placeholder="Zoek accommodatie, bestemming, type…" autocomplete="off" aria-label="Zoeken">
                <button type="button" class="site-search-close" aria-label="Zoekbalk sluiten">×</button>
            </form>
            <div class="site-search-results" id="site-search-results" role="listbox"></div>
        </div>
        <nav class="site-nav">
            <a href="Homepagina.html" ${activePage === 'home' ? 'class="active"' : ''}>Home</a>
            <a href="Keuzehulp.html" ${activePage === 'keuzehulp' ? 'class="active"' : ''}>Keuzehulp</a>
            <a href="alle-vakanties.html" ${activePage === 'nav' ? 'class="active"' : ''}>Alle vakanties</a>
            <span class="has-dropdown">
                <a href="Niveau2-Wat.html" ${activePage === 'wat' ? 'class="active"' : ''}>Vakantietypen</a>
                <div class="nav-dropdown wide">
                    <div class="nav-dd-col">
                        <h5>🏨 Hotels</h5>
                        <a href="Niveau2-Wat.html?what=hotel">Alle hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=boutique">Boutique hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=wellness">Wellness hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=adult-only">Adult Only hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=all-inclusive">All-inclusive hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=design">Design hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=city">Centrumgelegen hotels</a>
                        <a href="Niveau2-Wat.html?what=hotel&sub=resort">Resorts</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🏕️ Kamperen</h5>
                        <a href="Niveau2-Wat.html?what=camping">Alle campings</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=glamping">Glamping</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=waterpark">Camping met waterpark</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=natuur">Camping in de natuur</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=kids">Kindercampings</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=honden">Hondvriendelijke campings</a>
                        <a href="Niveau2-Wat.html?what=camping&sub=zee">Campings aan zee</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🏡 Vakantieparken</h5>
                        <a href="Niveau2-Wat.html?what=holiday-park">Alle vakantieparken</a>
                        <a href="Niveau2-Wat.html?what=holiday-park&sub=zwemparadijs">Met zwemparadijs</a>
                        <a href="Niveau2-Wat.html?what=holiday-park&sub=attractiepark">Met attractiepark</a>
                        <a href="Niveau2-Wat.html?what=holiday-park&sub=luxe">Luxe parken</a>
                        <a href="Niveau2-Wat.html?what=holiday-park&sub=kids">Kindvriendelijk</a>
                        <a href="Niveau2-Wat.html?what=holiday-park&sub=natuur">In de natuur</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🗓️ Andere types</h5>
                        <a href="Niveau2-Wat.html?what=glamping">Glamping</a>
                        <a href="Niveau2-Wat.html?what=wellness">Wellness</a>
                        <a href="Niveau2-Wat.html?what=city-trip">Weekendje weg</a>
                        <a href="Niveau2-Wat.html?what=sun">Zonvakantie</a>
                        <a href="Niveau2-Wat.html?what=winter">Wintersport</a>
                        <a href="Niveau2-Wat.html?what=adventure-trip">Actief / Avontuur</a>
                    </div>
                </div>
            </span>
            <span class="has-dropdown">
                <a href="Niveau2-Waar.html" ${activePage === 'waar' ? 'class="active"' : ''}>Bestemmingen</a>
                <div class="nav-dropdown wide">
                    <div class="nav-dd-col">
                        <h5>🌍 Continenten & regio's</h5>
                        <a href="Niveau2-Waar.html?region=europa">Europa</a>
                        <a href="Niveau2-Waar.html?region=azie">Azië</a>
                        <a href="Niveau2-Waar.html?region=afrika">Afrika</a>
                        <a href="Niveau2-Waar.html?region=scandinavie">Scandinavië</a>
                        <a href="Niveau2-Waar.html?region=bergen">Bergen</a>
                        <a href="Niveau2-Waar.html?region=aan-zee">Aan zee</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🇳🇱 Nederland</h5>
                        ${DATA.whereNL().map(([v,l]) => `<a href="Niveau2-Waar.html?where=${v}">${l}</a>`).join('')}
                    </div>
                    <div class="nav-dd-col">
                        <h5>🇪🇺 Europese landen</h5>
                        ${DATA.whereEU().map(([v,l]) => `<a href="Niveau2-Waar.html?where=${v}">${l}</a>`).join('')}
                    </div>
                </div>
            </span>
            <span class="has-dropdown">
                <a href="Niveau2-Wie.html" ${activePage === 'wie' ? 'class="active"' : ''}>Reisgezelschap</a>
                <div class="nav-dropdown">
                    <div class="nav-dd-col">
                        <h5>👨‍👩‍👧 Gezinnen</h5>
                        <a href="Niveau2-Wie.html?who=families-babies">Gezinnen met baby's</a>
                        <a href="Niveau2-Wie.html?who=families-kids">Gezinnen met kinderen</a>
                        <a href="Niveau2-Wie.html?who=families-teens">Gezinnen met tieners</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🥂 Volwassenen</h5>
                        <a href="Niveau2-Wie.html?who=couples">Koppels</a>
                        <a href="Niveau2-Wie.html?who=friends">Vrienden</a>
                        <a href="Niveau2-Wie.html?who=seniors">Senioren</a>
                        <a href="Niveau2-Wie.html?who=solo">Alleen reizend</a>
                        <a href="Niveau2-Wie.html?who=pets">Met huisdieren</a>
                    </div>
                </div>
            </span>
            <a href="over-ons.html" ${activePage === 'over' ? 'class="active"' : ''}>Over ons</a>
        </nav>
    `;
    bindMobileNav(header);
    bindSiteSearch(header);
    autoMountSearchNavigation();
}

// Zorgt dat de homepage zoek-component (Begin je zoektocht + Resorts &
// Hotels / Campings / Vakantieparken) op iedere pagina onder de header
// verschijnt. Wordt automatisch aangeroepen vanuit renderHeader, dus
// elke pagina die renderHeader gebruikt krijgt deze gratis. Pages
// kunnen opt-out met <body data-no-searchnav>.
function autoMountSearchNavigation() {
    if (document.body.hasAttribute('data-no-searchnav')) return;

    // 1. Stylesheet laden als deze nog niet staat (homepages hebben hem
    //    al, andere paginas niet).
    if (!document.querySelector('link[href*="search-navigation.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'search-navigation.css?v=8';
        document.head.appendChild(link);
    }

    // 2. Mount-div garanderen, ALTIJD binnen .site-header zodat header
    //    en categorie-nav samen één sticky systeem vormen (zero gap,
    //    gedeelde achtergrond, gedeelde z-index). Bestaande pagina's
    //    waar #hero-searchbar als sibling stond worden hier verplaatst.
    const headerEl = document.querySelector('.site-header');
    let mount = document.getElementById('hero-searchbar');
    if (!mount) {
        mount = document.createElement('div');
        mount.id = 'hero-searchbar';
    }
    if (headerEl) {
        if (mount.parentElement !== headerEl) headerEl.appendChild(mount);
    } else {
        document.body.insertBefore(mount, document.body.firstChild);
    }

    // 2b. --header-h dynamisch syncen op de werkelijke header-hoogte
    //     (inclusief de categorie-strip). De search-modal en andere
    //     sticky-offsets gebruiken deze variabele. Cruciaal: de
    //     ResizeObserver-referentie wordt op `window` gehangen zodat
    //     hij niet door GC verdwijnt zodra deze functie returnt — de
    //     cat-nav-content laadt namelijk async, dus de meting die
    //     telt komt PAS na een volgende layout-cycle.
    //
    // === DRAWER-OPEN GUARD (drawer-flicker root cause fix) ===
    // De .site-nav drawer leeft als flex-child IN de .site-header.
    // Wanneer hij opent groeit de header met de drawer-content erbij
    // (van ~64px naar ~580px). Zonder guard zou syncHeaderHeight die
    // grote waarde naar --header-h schrijven, waarna site.css
    // ".site-nav { max-height: calc(100vh - var(--header-h) - 16px) }"
    // een tiny max-height berekent → drawer shrinks → header shrinks
    // → ResizeObserver fires opnieuw → --header-h wordt kleiner →
    // max-height grows → drawer expands → header grows → loop. Dit
    // is een klassieke RO ⇄ CSS-var feedback-loop en is de visuele
    // oorzaak van het "flicker / jitter / shrink / collapse"-gedrag
    // dat de gebruiker rapporteerde (desktop én mobiel).
    //
    // De fix: als de drawer open is, schrijf NIET naar --header-h.
    // De laatst-gemeten closed-header-waarde blijft staan — wat alle
    // consumers (max-height calc, sticky-offsets in search-
    // navigation.css, premium-hero.css, accommodaties.html,
    // alle-vakanties.html) feitelijk verwachten: --header-h = de
    // chrome-hoogte BOVEN de drawer, niet inclusief de drawer zelf.
    // Wanneer de drawer sluit triggert de header-shrink een nieuwe
    // RO-callback; op dat moment is .open weg en wordt de waarde
    // weer correct ge-sync't. Geen extra timers nodig.
    //
    // Bijwerking: scroll op iOS (address-bar collapse → window.resize)
    // raakt --header-h niet meer mid-drawer-open. Dat lost het
    // "scrollen achter de drawer veroorzaakt instabiliteit" symptoom
    // op zonder body-scroll-lock toe te voegen.
    const syncHeaderHeight = () => {
        if (!headerEl) return;
        const nav = headerEl.querySelector('.site-nav');
        if (nav && nav.classList.contains('open')) return;
        const h = headerEl.getBoundingClientRect().height;
        if (h) document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
    };
    syncHeaderHeight();
    requestAnimationFrame(syncHeaderHeight);
    // Gebakken-in fallbacks: de async search-navigation.js render
    // landt ergens binnen het eerste seconde-venster. We meten
    // gewoon meerdere keren — goedkoper en betrouwbaarder dan
    // proberen het "juiste" moment te raden.
    [50, 150, 400, 900, 1800].forEach(ms => setTimeout(syncHeaderHeight, ms));
    if (window.ResizeObserver && headerEl) {
        try {
            // Bewaar zowel observer als de target op window zodat de
            // GC ze niet kan opruimen wanneer autoMount returnt.
            if (window.__siteHeaderRO) {
                try { window.__siteHeaderRO.disconnect(); } catch (_) {}
            }
            const ro = new ResizeObserver(syncHeaderHeight);
            ro.observe(headerEl);
            window.__siteHeaderRO = ro;
            window.__siteHeaderEl = headerEl;
        } catch (_) { /* noop */ }
    }
    window.addEventListener('resize', syncHeaderHeight, { passive: true });

    // 3. Render aanroepen — laadt het script dynamisch als nodig.
    const callRender = () => {
        if (typeof window.renderSearchNavigation === 'function') {
            window.renderSearchNavigation('hero-searchbar');
        }
    };
    if (typeof window.renderSearchNavigation === 'function') {
        callRender();
    } else if (!document.querySelector('script[src*="search-navigation.js"]')) {
        const s = document.createElement('script');
        s.src = 'search-navigation.js?v=8';
        s.async = false;
        s.onload = callRender;
        document.head.appendChild(s);
    } else {
        // Script staat al in DOM maar render-functie nog niet beschikbaar
        // (parser-volgorde) — wacht tot DOM ready of polling op functie.
        const wait = setInterval(() => {
            if (typeof window.renderSearchNavigation === 'function') {
                clearInterval(wait);
                callRender();
            }
        }, 50);
        setTimeout(() => clearInterval(wait), 5000);
    }
}

// ============ MOBILE NAV — SINGLE DELEGATED CLICK MODEL ============
//
// Eerdere iteraties bonden click-listeners rechtstreeks aan de
// .nav-toggle button-instance. Die aanpak is structureel kwetsbaar:
// elke keer dat header.innerHTML overschreven wordt (renderHeader
// kan om allerlei redenen meer dan eens draaien — re-init,
// soft-navigatie, OneDrive-sync edge-case, search-navigation auto-
// mount race) ontstaat een verse button. Per-button-binding zonder
// een GLOBALE garantie geeft geen bescherming tegen het scenario
// "twee verschillende code-paden binden allebei iets aan de toggle".
//
// Deze versie verplaatst de hele click-afhandeling naar één enkele
// document-level click-delegate. Eigenschappen:
//
//   • Bind EXACT één keer per page-lifecycle (sentinel op
//     <html data-nav-delegate="1">). Idempotent: bindMobileNav 1×
//     of 100× aanroepen levert hetzelfde resultaat.
//   • Refereert geen specifieke button-instance — selecteert de
//     toggle per click via e.target.closest('.nav-toggle'). Werkt
//     dus na iedere renderHeader-re-render zonder her-bind.
//   • Behandelt EN het drawer-toggle EN de accordion-submenu-
//     toggles in dezelfde delegate, met identieke
//     idempotency-garantie.
//   • Onmogelijk om met deze constructie meerdere state-flips per
//     tap te veroorzaken: één listener, één event, één toggle.
//
// De CSS-laag (touch-action: manipulation + pointer-events: none
// op .nav-toggle / .nav-toggle span uit de vorige commit) blijft
// onaangetast — die adresseert orthogonale mobiele compat-
// gedragingen. Samen vormen ze de structurele fix.
function ensureNavDelegate() {
    if (document.documentElement.dataset.navDelegate === '1') return;
    document.documentElement.dataset.navDelegate = '1';

    document.addEventListener('click', (e) => {
        // 1. Hamburger — opent / sluit de drawer.
        const toggleHit = e.target.closest('.nav-toggle');
        if (toggleHit) {
            e.preventDefault();
            const nav = document.querySelector('.site-header .site-nav');
            if (!nav) return;
            const willOpen = !nav.classList.contains('open');
            nav.classList.toggle('open', willOpen);
            toggleHit.classList.toggle('open', willOpen);
            toggleHit.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            return;
        }
        // 2. Accordion-submenu header — opent één sub binnen de drawer.
        const dropdownLink = e.target.closest('.site-nav .has-dropdown > a');
        if (dropdownLink) {
            e.preventDefault();
            const parent = dropdownLink.parentElement;
            const drawer = parent.closest('.site-nav');
            if (!drawer) return;
            drawer.querySelectorAll('.has-dropdown.open').forEach(el => {
                if (el !== parent) el.classList.remove('open');
            });
            parent.classList.toggle('open');
        }
    });
}

// bindMobileNav — wordt aangeroepen vanuit renderHeader(). Bouwt
// zelf geen listeners meer op de fresh button; vertrouwt op
// ensureNavDelegate() voor de event-afhandeling. Doet alleen
// nog: aria-expanded sync op de (mogelijk nieuwe) toggle-button
// zodat screen-readers het correcte state-attribuut zien als de
// header net opnieuw gerenderd is met een al-open drawer.
function bindMobileNav(header) {
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    if (toggle && nav) {
        const isOpen = nav.classList.contains('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.classList.toggle('open', isOpen);
    }
    ensureNavDelegate();
}

// ============ LIVE SEARCH ============
// Doorzoekt SITE_DATA.accommodations + labels (who/what/where) en toont
// voorgestelde resultaten onder de zoekbalk. Geen fake data, geen fuzzy
// magic — gewoon substring-matches op name/location/label.
function bindSiteSearch(header) {
    const toggleBtn = header.querySelector('.site-search-toggle');
    const panel = header.querySelector('#site-search');
    const input = header.querySelector('#site-search-input');
    const results = header.querySelector('#site-search-results');
    const closeBtn = header.querySelector('.site-search-close');
    if (!toggleBtn || !panel || !input || !results) return;

    const open = () => {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        setTimeout(() => input.focus(), 30);
    };
    const close = () => {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        results.innerHTML = '';
        results.classList.remove('open');
    };

    toggleBtn.addEventListener('click', () => {
        panel.classList.contains('open') ? close() : open();
    });
    closeBtn?.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });
    // Klik buiten de zoekbalk sluit 'm
    document.addEventListener('click', (e) => {
        if (!panel.classList.contains('open')) return;
        if (panel.contains(e.target) || toggleBtn.contains(e.target)) return;
        close();
    });

    let lastQuery = '';
    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (q === lastQuery) return;
        lastQuery = q;
        if (!q) { results.innerHTML = ''; results.classList.remove('open'); return; }
        results.innerHTML = renderSiteSearchResults(q);
        results.classList.add('open');
    });
}

// Bouwt de suggesties-dropdown op basis van SITE_DATA + DATA labels
function renderSiteSearchResults(q) {
    if (typeof SITE_DATA === 'undefined' || typeof DATA === 'undefined') return '';
    const match = (s) => (s || '').toLowerCase().includes(q);

    // 1) Accommodaties (naam of locatie bevat query)
    const accs = SITE_DATA.accommodations
        .filter(a => match(a.name) || match(a.location))
        .slice(0, 5);

    // 2) Tags: wat / waar / wie — labels die de query bevatten
    const labelHits = (dim) => Object.entries(SITE_DATA.labels[dim] || {})
        .filter(([, label]) => match(label))
        .slice(0, 5);

    const whatHits = labelHits('what');
    const whereHits = [...labelHits('whereNL'), ...labelHits('whereEU')].slice(0, 5);
    const whoHits = labelHits('who');

    const groups = [];
    if (accs.length) {
        groups.push(`<div class="ss-group-title">Accommodaties</div>` +
            accs.map(a => `
                <a class="ss-item" href="Navigatie.html?acc=${a.id}">
                    <span class="ss-icon">${a.emoji || '🏝️'}</span>
                    <span class="ss-body"><span class="ss-name">${a.name}</span><span class="ss-meta">${a.location}</span></span>
                </a>`).join(''));
    }
    if (whatHits.length) {
        groups.push(`<div class="ss-group-title">Vakantietypen</div>` +
            whatHits.map(([v,l]) => `
                <a class="ss-item" href="alle-vakanties.html?what=${encodeURIComponent(v)}">
                    <span class="ss-icon">${DATA.icon(v)}</span>
                    <span class="ss-body"><span class="ss-name">${l}</span><span class="ss-meta">Type vakantie</span></span>
                </a>`).join(''));
    }
    if (whereHits.length) {
        groups.push(`<div class="ss-group-title">Bestemmingen</div>` +
            whereHits.map(([v,l]) => `
                <a class="ss-item" href="alle-vakanties.html?where=${encodeURIComponent(v)}">
                    <span class="ss-icon">${DATA.icon(v)}</span>
                    <span class="ss-body"><span class="ss-name">${l}</span><span class="ss-meta">Bestemming</span></span>
                </a>`).join(''));
    }
    if (whoHits.length) {
        groups.push(`<div class="ss-group-title">Reisgezelschap</div>` +
            whoHits.map(([v,l]) => `
                <a class="ss-item" href="alle-vakanties.html?who=${encodeURIComponent(v)}">
                    <span class="ss-icon">${DATA.icon(v)}</span>
                    <span class="ss-body"><span class="ss-name">${l}</span><span class="ss-meta">Reisgezelschap</span></span>
                </a>`).join(''));
    }
    if (!groups.length) return `<div class="ss-empty">Geen resultaten voor "${q}"</div>`;
    return groups.join('');
}

// Enter in zoekbalk: ga naar Alle vakanties met de query als 'q'-parameter
function submitSiteSearch(e) {
    e.preventDefault();
    const input = document.getElementById('site-search-input');
    const q = (input?.value || '').trim();
    if (!q) return false;
    window.location.href = 'alle-vakanties.html?q=' + encodeURIComponent(q);
    return false;
}

function renderFooter() {
    const footer = document.querySelector('.site-footer .footer-inner');
    if (!footer) return;
    footer.innerHTML = `
        <div class="footer-col">
            <h4>Urlaubspotter</h4>
            <p style="font-size:0.9rem; line-height:1.6;">Jouw onafhankelijke gids voor de perfecte vakantie — van camping in Drenthe tot luxe chalet in Oostenrijk.</p>
        </div>
        <div class="footer-col">
            <h4>Vakantietype</h4>
            <ul>
                <li><a href="Niveau2-Wat.html">Alle types</a></li>
                <li><a href="Navigatie.html?what=camping">Camping</a></li>
                <li><a href="Navigatie.html?what=holiday-park">Vakantieparken</a></li>
                <li><a href="Navigatie.html?what=glamping">Glamping</a></li>
                <li><a href="Navigatie.html?what=hotel">Hotels</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Bestemmingen</h4>
            <ul>
                <li><a href="Niveau2-Waar.html">Alle bestemmingen</a></li>
                <li><a href="Navigatie.html?where=zeeland">Zeeland</a></li>
                <li><a href="Navigatie.html?where=drenthe">Drenthe</a></li>
                <li><a href="Navigatie.html?where=spanje">Spanje</a></li>
                <li><a href="Navigatie.html?where=oostenrijk">Oostenrijk</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Reisgezelschap</h4>
            <ul>
                <li><a href="Niveau2-Wie.html">Alle doelgroepen</a></li>
                <li><a href="Navigatie.html?who=families-kids">Gezinnen</a></li>
                <li><a href="Navigatie.html?who=couples">Koppels</a></li>
                <li><a href="Navigatie.html?who=seniors">Senioren</a></li>
                <li><a href="Navigatie.html?who=pets">Met huisdieren</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>Hulp & info</h4>
            <ul>
                <li><a href="Keuzehulp.html">Keuzehulp</a></li>
                <li><a href="#">Over ons</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Veelgestelde vragen</a></li>
                <li><a href="#">Privacy</a></li>
            </ul>
        </div>
    `;
    const bottom = document.querySelector('.site-footer .footer-bottom');
    if (bottom) {
        bottom.innerHTML = `
            <span>© ${new Date().getFullYear()} Urlaubspotter · Alle rechten voorbehouden</span>
            <span>Onafhankelijke vakantiegids · Geen affiliate sturing</span>
        `;
    }
}

// ============ NEWS + SOCIAL ============
function renderNewsSocial(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
        <div class="news-block">
            <h3>Meld je aan voor onze nieuwsbrief</h3>
            <p>Ontvang de leukste aanbiedingen, reistips en nieuwe gidsen in je mailbox.</p>
            <form class="news-form" onsubmit="event.preventDefault(); alert('Bedankt voor je aanmelding!'); this.reset();">
                <input type="email" placeholder="Jouw emailadres" required>
                <button type="submit">Aanmelden</button>
            </form>
        </div>
        <div class="social-block">
            <h3>Volg ons</h3>
            <p>Reisinspiratie en behind-the-scenes op onze social kanalen.</p>
            <div class="social-icons">
                <a href="#" aria-label="Instagram" title="Instagram" class="social-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Facebook" title="Facebook" class="social-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
                </a>
                <a href="#" aria-label="YouTube" title="YouTube" class="social-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.54 3.5 12 3.5 12 3.5s-7.54 0-9.4.58A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12C4.46 20.5 12 20.5 12 20.5s7.54 0 9.4-.58a3 3 0 0 0 2.1-2.12A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
                </a>
                <a href="#" aria-label="TikTok" title="TikTok" class="social-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.1 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.14-.1z"/></svg>
                </a>
            </div>
        </div>
    `;
}

// ============ BLOG PLACEHOLDERS ============
function renderBlogPreview(containerId, topic = '') {
    const el = document.getElementById(containerId);
    if (!el) return;

    // Gebruik echte blog-data uit SITE_DATA als die beschikbaar is; anders
    // tonen we nog steeds een set placeholder-kaarten zonder dood link.
    const haveBlogs = typeof SITE_DATA !== 'undefined' && Array.isArray(SITE_DATA.blogs) && SITE_DATA.blogs.length;
    if (haveBlogs) {
        // Sorteer op datum (nieuw naar oud), neem eerste 4
        const list = SITE_DATA.blogs.slice()
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
            .slice(0, 4);
        const imgFor = (spec, idx) => {
            const m = (spec || '').match(/^gradient:([^,]+),([^|]+)\|(.+)$/);
            if (m) {
                const [, c1, c2, emoji] = m;
                return { bg: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, emoji };
            }
            return { bg: GRADIENTS[idx % GRADIENTS.length], emoji: '📰' };
        };
        el.innerHTML = list.map((b, i) => {
            const { bg, emoji } = imgFor(b.image, i);
            const photo = photoUrlForEditorial(b, 720, 460);
            return `
                <a class="blog-card" href="blog-detail.html?id=${b.id}">
                    <div class="blog-img" style="background: ${bg}">
                        <img src="${photo}" alt="${b.title}" loading="lazy" onerror="this.style.display='none'"/>
                        <span class="blog-img-emoji" aria-hidden="true">${emoji}</span>
                    </div>
                    <div class="blog-body">
                        <div class="blog-tag">${b.category}</div>
                        <h3>${b.title}</h3>
                        <p>${b.intro}</p>
                    </div>
                </a>
            `;
        }).join('');
        return;
    }

    // Fallback (geen SITE_DATA.blogs): drie placeholder-kaarten
    const articles = [
        { tag: 'Reistips', title: `${topic ? topic + ': ' : ''}10 tips voor de perfecte vakantie`,
          lead: 'Van planning tot pakken — zo haal je het maximum uit je reis.', emoji: '📋', grad: GRADIENTS[0] },
        { tag: 'Bestemming', title: `Hidden gems die je moet zien`,
          lead: 'Onze redactie tipt de minder bekende plekken die je verrassen.', emoji: '🗺️', grad: GRADIENTS[2] },
        { tag: 'Inspiratie', title: `Wat neem je mee op vakantie?`,
          lead: 'De ultieme paklijst voor elk type reis en gezelschap.', emoji: '🎒', grad: GRADIENTS[4] }
    ];
    el.innerHTML = articles.map(a => `
        <a class="blog-card" href="blogs.html">
            <div class="blog-img" style="background: ${a.grad}">${a.emoji}</div>
            <div class="blog-body">
                <div class="blog-tag">${a.tag}</div>
                <h3>${a.title}</h3>
                <p>${a.lead}</p>
            </div>
        </a>
    `).join('');
}

// ============ KEUZEHULP CTA ============
// Compacte CTA-kaart, gebruikt op subpagina's (Niveau 2/3/4) onder
// de matches. Op de homepage gebruiken we de grotere
// renderKeuzehulpHero hieronder als emotionele instap.
function renderKeuzehulpCTA(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
        <div class="keuzehulp-cta">
            <div>
                <h3>De ultieme zoektool</h3>
                <p>Onze Keuzehulp stelt je 7 slimme vragen en vindt precies de juiste vakantie voor jou.</p>
                <div class="benefits">
                    <span>⚡ Snel</span>
                    <span>🧠 Slim</span>
                    <span>❤️ Persoonlijk</span>
                </div>
            </div>
            <a class="btn-ghost-white" href="Keuzehulp.html">Start Keuzehulp →</a>
        </div>
    `;
}

// ============ KEUZEHULP HERO BANNER (homepage) ============
// Single-column dark premium discovery-blok (geen illustratie meer).
// Vervangt de oude functionele Keuzehulp-kaart op de homepage door
// een compact emotioneel CTA-blok: deep-night gradient achtergrond,
// editorial copy en één primaire CTA "Start de keuzehulp" die naar
// Keuzehulp.html linkt.
//
// De vorige iteratie had ook een CSS+SVG mountain-scene aan de
// linkerkant; die maakte het blok te hero-achtig en visueel zwaar.
// Nu alleen het content-paneel — strakker, premium, content-eerst.
function renderKeuzehulpHero(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    // Redesign — Booking/Airbnb clarity. White card, brand-blue
    // accent, generous whitespace, single clear CTA. Geen gradient,
    // geen gold, geen decoratieve experimentele lagen. Calm,
    // trustworthy, premium-modern travel-platform register.
    el.innerHTML = `
        <section class="kh-hero" aria-label="Start de keuzehulp">
            <div class="kh-hero-content">
                <span class="kh-hero-eyebrow">Keuzehulp</span>
                <h2 class="kh-hero-title">Vind de vakantie die bij je past.</h2>
                <p class="kh-hero-lead">Beantwoord zeven korte vragen en wij stellen een persoonlijke lijst samen — accommodaties, bestemmingen en tips, op maat van jouw reisstijl.</p>
                <div class="kh-hero-actions">
                    <a class="btn btn-primary kh-hero-cta" href="Keuzehulp.html">Start de keuzehulp</a>
                    <span class="kh-hero-note">Onder de 60 seconden · Geen account nodig</span>
                </div>
            </div>
        </section>
    `;
}
