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
function renderListingPreview(containerId, accommodations, { limit = 6 } = {}) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const list = accommodations.slice(0, limit);
    if (list.length === 0) {
        el.innerHTML = `<div class="listing-empty">Geen accommodaties gevonden — <a href="Navigatie.html">bekijk alle</a></div>`;
        return;
    }
    el.innerHTML = list.map(a => `
        <a class="listing-card" href="Navigatie.html?acc=${a.id}">
            <div class="listing-card-img" style="background: ${gradientFor(a)}">
                ${a.emoji || '🏝️'}
                <span class="listing-card-badge">${DATA.label('where', a.where)}</span>
            </div>
            <div class="listing-card-body">
                <h3>${a.name}</h3>
                <p class="listing-card-loc">📍 ${a.location}</p>
                <div class="listing-card-tags">
                    ${a.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
                <div class="listing-card-foot">
                    <span class="listing-card-rating">★ ${a.rating.toFixed(1)} · ${a.reviews}</span>
                    <span class="listing-card-price">€${a.price}<small>/nacht</small></span>
                </div>
            </div>
        </a>
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

// ============ HEADER / FOOTER INJECT ============
function renderHeader(activePage = '') {
    const header = document.querySelector('.site-header .inner');
    if (!header) return;
    header.innerHTML = `
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false" type="button">
            <span></span><span></span><span></span>
        </button>
        <a href="index.html" class="site-logo" aria-label="Urlaubspotter home">
            <img src="logo.png" alt="Urlaubspotter" onerror="this.remove()">
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
            <span class="has-dropdown">
                <a href="Niveau2-Wat.html" ${activePage === 'wat' ? 'class="active"' : ''}>Vakantietypen</a>
                <div class="nav-dropdown wide">
                    <div class="nav-dd-col">
                        <h5>🏨 Hotels</h5>
                        <a href="Navigatie.html?what=hotel">Alle hotels</a>
                        <a href="Navigatie.html?what=hotel&sub=boutique">Boutique hotels</a>
                        <a href="Navigatie.html?what=wellness">Wellness hotels</a>
                        <a href="Navigatie.html?what=hotel&sub=all-inclusive">All-inclusive hotels</a>
                        <a href="Navigatie.html?what=hotel&sub=design">Design hotels</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🏕️ Kamperen</h5>
                        <a href="Navigatie.html?what=camping">Alle campings</a>
                        <a href="Navigatie.html?what=glamping">Glampings</a>
                        <a href="Navigatie.html?what=camping&sub=waterpark">Campings met waterpark</a>
                        <a href="Navigatie.html?what=camping&sub=natuur">Camping in de natuur</a>
                        <a href="Navigatie.html?what=camping&sub=kids">Kindercampings</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🏡 Vakantieparken</h5>
                        <a href="Navigatie.html?what=holiday-park">Alle vakantieparken</a>
                        <a href="Navigatie.html?what=holiday-park&sub=attractie">Met attractiepark</a>
                        <a href="Navigatie.html?what=holiday-park&sub=zwemparadijs">Met zwemparadijs</a>
                        <a href="Navigatie.html?what=holiday-park&sub=luxe">Luxe parken</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>🗓️ Weekendjes weg</h5>
                        <a href="Navigatie.html?what=weekend">Alle weekendjes</a>
                        <a href="Navigatie.html?what=weekend&sub=nl">In eigen land</a>
                        <a href="Navigatie.html?what=weekend&sub=buurlanden">In buurlanden</a>
                        <a href="Navigatie.html?what=weekend&sub=europa">In Europa</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>☀️ Zonvakanties</h5>
                        <a href="Navigatie.html?what=zon">Alle zonvakanties</a>
                        <a href="Navigatie.html?what=zon&sub=middellandse-zee">Middellandse Zee</a>
                        <a href="Navigatie.html?what=zon&sub=strand">Strandvakanties</a>
                    </div>
                    <div class="nav-dd-col">
                        <h5>❄️ Wintervakanties</h5>
                        <a href="Navigatie.html?what=winter">Alle wintersport</a>
                        <a href="Navigatie.html?what=winter&sub=ski">Skivakanties</a>
                        <a href="Navigatie.html?what=winter&sub=kerst">Kerstvakantie</a>
                    </div>
                </div>
            </span>
            <span class="has-dropdown">
                <a href="Niveau2-Waar.html" ${activePage === 'waar' ? 'class="active"' : ''}>Bestemmingen</a>
                <div class="nav-dropdown">
                    <div class="nav-dd-col">
                        <h5>🇳🇱 Nederland</h5>
                        ${DATA.whereNL().map(([v,l]) => `<a href="Navigatie.html?where=${v}">${l}</a>`).join('')}
                    </div>
                    <div class="nav-dd-col">
                        <h5>🌍 Europa</h5>
                        ${DATA.whereEU().map(([v,l]) => `<a href="Navigatie.html?where=${v}">${l}</a>`).join('')}
                    </div>
                </div>
            </span>
            <a href="Keuzehulp.html" ${activePage === 'keuzehulp' ? 'class="active"' : ''}>Keuzehulp</a>
            <a href="alle-vakanties.html" ${activePage === 'nav' ? 'class="active"' : ''}>Alle vakanties</a>
        </nav>
    `;
    bindMobileNav(header);
    bindSiteSearch(header);
}

// Hamburger + accordion (mobiel) — vanilla JS, geen library
function bindMobileNav(header) {
    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.classList.toggle('open', open);
    });
    // Accordion-toggle voor dropdown-secties: drawer wordt nu op alle breedtes
    // gebruikt, dus klik toggelt open/dicht ongeacht viewport.
    nav.querySelectorAll('.has-dropdown > a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = link.parentElement;
            // Sluit andere open secties
            nav.querySelectorAll('.has-dropdown.open').forEach(el => {
                if (el !== parent) el.classList.remove('open');
            });
            parent.classList.toggle('open');
        });
    });
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
            return `
                <a class="blog-card" href="blog-detail.html?id=${b.id}">
                    <div class="blog-img" style="background: ${bg}">${emoji}</div>
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
function renderKeuzehulpCTA(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `
        <div class="keuzehulp-cta">
            <div>
                <h3>Niet zeker wat je zoekt?</h3>
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
