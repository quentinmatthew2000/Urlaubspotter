/* ============================================================
   landing.js — gedeelde renderer voor Level 1 landing pages.
   Iedere /hotels, /campings, /vakantieparken, /spanje, /belgie,
   etc. roept renderLandingPage(config) aan en deze script bouwt
   de hero, een filtervoorbeeld en een listing-grid op basis van
   SITE_DATA.

   Config:
     {
       kind: 'type' | 'land',
       value: string,            // 'hotel' | 'spanje' | ...
       title: string,            // hero titel
       lead: string,             // hero subtitel
       breadcrumb: string,       // breadcrumb-label
       eyebrow?: string,
       resultsHref?: string      // override van /accommodaties?...
     }
   ============================================================ */

(function () {
    "use strict";

    function renderLandingPage(config) {
        const heroEl     = document.getElementById('landing-hero');
        const listingEl  = document.getElementById('landing-listing');
        const countEl    = document.getElementById('landing-count');
        const moreLink   = document.getElementById('landing-more');
        const bcEl       = document.getElementById('landing-breadcrumb');

        // Breadcrumb
        if (bcEl) {
            bcEl.innerHTML = `
                <a href="index.html">Home</a>
                <span class="sep">›</span>
                <span class="current">${config.breadcrumb || config.title}</span>
            `;
        }

        // Hero
        if (heroEl) {
            heroEl.innerHTML = `
                <div class="section-head">
                    <div>
                        ${config.eyebrow ? `<span class="eyebrow">${config.eyebrow}</span>` : ''}
                        <h1 style="font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; margin-bottom: 8px;">${config.title}</h1>
                        ${config.lead ? `<p class="lead">${config.lead}</p>` : ''}
                    </div>
                </div>
            `;
        }

        // Filtering: hergebruik bestaande SITE_DATA.accommodations
        let list = SITE_DATA.accommodations.slice();
        const NL_KEYS = Object.keys(SITE_DATA.labels.whereNL);

        if (config.kind === 'type') {
            list = list.filter(a => a.what.includes(config.value));
        } else if (config.kind === 'land') {
            if (config.value === 'nederland') {
                list = list.filter(a => NL_KEYS.includes(a.where));
            } else {
                list = list.filter(a => a.where === config.value);
            }
        } else if (config.kind === 'continent') {
            // Filter op set van landen die bij dit continent horen.
            // config.countries = ['belgie','frankrijk',...]; lege set is OK
            // (continent zonder data → empty state).
            const set = new Set(config.countries || []);
            list = list.filter(a => set.has(a.where));
        }

        // Optionele extra what-carryover uit de URL (?what=hotel etc.) zodat
        // "Naar de camping in Europa" filtert op continent Europa én wat=camping.
        const qpWhat = (typeof URLSearchParams === 'function')
            ? new URLSearchParams(location.search).get('what')
            : null;
        if (qpWhat && config.kind !== 'type') {
            list = list.filter(a => a.what.includes(qpWhat));
        }

        if (countEl) countEl.textContent = list.length;

        // "Bekijk alle →" link naar /accommodaties met de juiste filter
        if (moreLink) {
            const params = new URLSearchParams();
            if (config.kind === 'type') params.set('type', config.value);
            if (config.kind === 'land') params.set('land', config.value);
            moreLink.href = config.resultsHref || ('accommodaties.html?' + params.toString());
        }

        // Listing — eerste 8 resultaten, klikt door naar detail.
        if (listingEl) {
            if (list.length === 0) {
                listingEl.innerHTML = `
                    <div class="listing-empty">
                        Nog geen accommodaties beschikbaar voor deze selectie —
                        <a href="accommodaties.html">bekijk alle accommodaties</a>.
                    </div>
                `;
            } else {
                listingEl.innerHTML = list.slice(0, 8).map(a => {
                    const slug = slugifyName(a.name);
                    const grad = (typeof gradientFor === 'function')
                        ? gradientFor(a)
                        : 'linear-gradient(135deg, #4facfe 0%, #00c6ff 100%)';
                    return `
                        <a class="listing-card" href="accommodatie.html?slug=${slug}">
                            <div class="listing-card-img" style="background: ${grad}">
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
                        </a>`;
                }).join('');
            }
        }
    }

    function slugifyName(s) {
        return String(s).toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    window.renderLandingPage = renderLandingPage;
})();
