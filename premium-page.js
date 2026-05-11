// ============================================================
// premium-page.js — shared "premium category page" orchestrator.
// ============================================================
//
// Eén entry-point: window.applyPremiumPage(ctx) — Niveau 2 + 3
// pagina's roepen 'm aan met de actieve {who, what, where,
// region, sub} context en de helper bouwt vervolgens:
//
//   1. Editorial hero (.ph-hero met thema-variant)
//   2. Mount + render van #inspiration-tabs (sub-aware)
//   3. "Tips per vakantietype" carousel met SITE_DATA.blogs
//      gescoord op relevantie tegen de context
//   4. "Reisverslagen van onze redactie" carousel met
//      SITE_DATA.stories idem gescoord
//   5. "De ultieme zoektool" verplaatsing naar direct onder
//      het matches-listing (zodat de zoektool de logische
//      volgende stap is na de accommodatie-suggesties)
//
// Bewust ZONDER per-pagina hardcoding van card-inhoud: alle
// content komt uit site-data.js. Hierdoor introduceren we
// nieuwe premium-pagina's door simpelweg applyPremiumPage()
// aan te roepen — geen card-arrays per pagina meer.
//
// Hangt af van (in deze volgorde geladen):
//   site-data.js (DATA, SITE_DATA)
//   sub-context.js (window.safeSubLabel)
//   context-copy.js (window.buildContextLead)  [optional]
//   site.js (renderHeader / renderListingPreview / ...)
//   inspiration-tabs.js (window.renderInspirationTabs) [optional]
//   premium-hero.css (visuele basis + thema-varianten)
// ============================================================

(function () {
    'use strict';

    // ---------- helpers: label-resolution ----------
    function safeSubLabelLocal(what, sub) {
        if (!what || !sub) return '';
        if (typeof window.safeSubLabel === 'function') return window.safeSubLabel(what, sub) || '';
        return (DATA.subLabel && DATA.subLabel(what, sub)) || '';
    }

    function labelOrEmpty(dim, key) {
        return key ? DATA.label(dim, key) : '';
    }

    // ---------- THEME RESOLUTION ----------
    // Destination (region / where) heeft visuele voorrang op WAT —
    // de pagina "Hotels in Italië" voelt italiaans, niet hotel-goud.
    // Sub-themes alleen voor sterke visuele identiteit (wellness,
    // glamping). Daaronder de WAT-base. Default: 'generic'.
    function themeForContext(ctx) {
        const { what, sub, where, region } = ctx;
        if (region === 'bergen')      return 'bergen';
        if (region === 'aan-zee')     return 'aan-zee';
        if (region === 'europa')      return 'europa';
        if (region === 'scandinavie') return 'bergen';
        if (where === 'italie')       return 'italie';
        if (where === 'frankrijk')    return 'frankrijk';
        if (where === 'spanje')       return 'aan-zee';
        if (where === 'portugal')     return 'aan-zee';
        if (where === 'kroatie')      return 'aan-zee';
        if (where === 'oostenrijk')   return 'bergen';
        if (where === 'duitsland')    return 'generic';
        if (where === 'belgie')       return 'generic';
        if (what === 'hotel' && sub === 'wellness')   return 'wellness';
        if (what === 'camping' && sub === 'glamping') return 'glamping';
        if (what === 'hotel')         return 'hotel';
        if (what === 'camping')       return 'camping';
        if (what === 'holiday-park')  return 'vakantiepark';
        if (what === 'glamping')      return 'glamping';
        if (what === 'wellness')      return 'wellness';
        if (what === 'sun')           return 'aan-zee';
        if (what === 'winter')        return 'bergen';
        if (what === 'city-trip')     return 'citytrip';
        if (what === 'adventure-trip')return 'avontuur';
        return 'generic';
    }

    // ---------- HERO COPY ----------
    // Bouwt {title, lead, eyebrow} op uit de actieve context.
    // - Title: <noun> [voor <who>] [in/aan <where|region>]
    // - Lead: probeer buildContextLead() (sub × WIE × WAAR matrix);
    //         fallback op een vriendelijke generieke zin.
    // - Eyebrow: chip-style "WIE · WAT · WAAR" segmenten.
    function heroCopyForContext(ctx) {
        const { what, sub, who, where, region } = ctx;
        const whatLabel  = labelOrEmpty('what', what);
        const subLabel   = safeSubLabelLocal(what, sub);
        const whoLabel   = labelOrEmpty('who', who);
        const whereLabel = labelOrEmpty('where', where);
        const regionLabel   = region ? DATA.regionLabel(region) : '';
        const regionDisplay = region ? DATA.regionDisplayName(region) : '';
        const regionPrep    = region ? DATA.regionPreposition(region) : 'in';

        const noun = subLabel || whatLabel || (region || where ? 'Vakantie' : 'Jouw vakantie');
        const destPhrase = region ? `${regionPrep} ${regionLabel}` : (where ? `in ${whereLabel}` : '');
        const audPhrase  = whoLabel ? `voor ${whoLabel.toLowerCase()}` : '';

        let title;
        if (what || sub || where || region || who) {
            const parts = [noun];
            if (audPhrase)  parts.push(audPhrase);
            if (destPhrase) parts.push(destPhrase);
            title = parts.join(' ');
        } else {
            title = 'Vind jouw perfecte vakantie';
        }

        let lead = '';
        if (typeof window.buildContextLead === 'function') {
            lead = window.buildContextLead({ what, sub, who, where, region }) || '';
        }
        if (!lead) {
            const nounLower = noun.toLowerCase();
            const destExtra = destPhrase ? ` ${destPhrase}` : '';
            lead = `Onze redactie selecteerde de mooiste ${nounLower}${destExtra} — handpicked, eerlijk getest en met persoonlijke tips voor jouw reis.`;
        }

        const eyebrowParts = [];
        if (whoLabel) eyebrowParts.push(whoLabel);
        if (subLabel || whatLabel) eyebrowParts.push(subLabel || whatLabel);
        if (regionDisplay || whereLabel) eyebrowParts.push(regionDisplay || whereLabel);
        const eyebrow = eyebrowParts.length ? eyebrowParts.join(' · ') : 'Premium selectie';

        return { title, lead, eyebrow };
    }

    // ---------- BREADCRUMB / CHIPS ----------
    function breadcrumbForContext(ctx, root) {
        const { what, sub, who, where, region } = ctx;
        const whoLabel   = labelOrEmpty('who', who);
        const whatLabel  = labelOrEmpty('what', what);
        const subLabel   = safeSubLabelLocal(what, sub);
        const destDisplay = region ? DATA.regionDisplayName(region)
                                   : labelOrEmpty('where', where);
        const identity = [whoLabel, subLabel || whatLabel, destDisplay].filter(Boolean).join(' · ');
        const crumb = (root && root.length) ? root.slice() : [
            { href: 'Homepagina.html', text: 'Home' }
        ];
        if (identity) crumb.push({ text: identity });
        return crumb;
    }

    function chipsForContext(ctx) {
        const { what, sub, who, where, region } = ctx;
        const chips = [];
        if (who) {
            chips.push({ icon: DATA.icon(who), label: DATA.label('who', who), active: true });
        }
        if (what || sub) {
            const subLabel = safeSubLabelLocal(what, sub);
            chips.push({
                icon: DATA.icon(what || sub),
                label: subLabel || DATA.label('what', what),
                active: true,
            });
        }
        if (region) {
            chips.push({ icon: '🌍', label: DATA.regionDisplayName(region), active: true });
        } else if (where) {
            chips.push({ icon: DATA.icon(where), label: DATA.label('where', where), active: true });
        }
        return chips;
    }

    // ---------- TIPS / STORIES SCORING ----------
    // Scoort een blog/story tegen de context. Hoger = meer relevant.
    // De scores zijn empirisch ingesteld op de huidige SITE_DATA
    // omvang (10 blogs, 11 stories). Sub-treffers wegen het zwaarst
    // omdat een "Wellness Hotels" pagina vooral wellness-content
    // moet surface'en, niet algemene hotel-content.
    function scoreEntry(entry, ctx) {
        const { what, sub, where, region, who } = ctx;
        const haystack = [
            entry.title || '', entry.intro || '', entry.content || '',
            entry.category || '', entry.author || ''
        ].join(' ').toLowerCase();
        let score = 0;

        if (what) {
            const whatLabel = DATA.label('what', what).toLowerCase();
            if (entry.category && entry.category.toLowerCase().includes(whatLabel)) score += 6;
            if (haystack.includes(whatLabel)) score += 3;
            if (haystack.includes(what.toLowerCase())) score += 2;
        }
        if (sub) {
            const subLabel = safeSubLabelLocal(what, sub).toLowerCase();
            if (subLabel && haystack.includes(subLabel)) score += 9;
            if (haystack.includes(sub.toLowerCase())) score += 6;
        }
        if (where) {
            const whereLabel = DATA.label('where', where).toLowerCase();
            if (whereLabel && haystack.includes(whereLabel)) score += 4;
        }
        if (region) {
            const regionLabel   = DATA.regionLabel(region).toLowerCase();
            const regionDisplay = DATA.regionDisplayName(region).toLowerCase();
            if (regionLabel && haystack.includes(regionLabel)) score += 3;
            if (regionDisplay && haystack.includes(regionDisplay)) score += 3;
            const wheres = (DATA.region(region) && DATA.region(region).wheres) || [];
            wheres.forEach(w => {
                const lbl = DATA.label('where', w).toLowerCase();
                if (lbl && haystack.includes(lbl)) score += 1;
            });
        }
        if (who) {
            const whoLabel = DATA.label('who', who).toLowerCase();
            // who-treffer is een lichte boost — content is zelden
            // expliciet "voor koppels" geschreven maar wel "romantisch".
            if (haystack.includes(whoLabel)) score += 2;
            if (who.includes('couples') && /romantisch|koppel/.test(haystack)) score += 2;
            if (who.includes('families') && /gezin|kind|familie/.test(haystack)) score += 2;
            if (who.includes('friends') && /vrienden|groep/.test(haystack)) score += 2;
        }
        return score;
    }

    // image-formaat "gradient:#xxx,#yyy|emoji" → {gradient, emoji}.
    // Fallback genereert een neutraal grijs verloop zodat ontbrekend
    // beeld nooit een lege card oplevert.
    function parseGradient(image) {
        const m = (image || '').match(/^gradient:(#[0-9a-fA-F]+),(#[0-9a-fA-F]+)\|(.+)$/);
        if (m) return {
            gradient: `linear-gradient(135deg, ${m[1]} 0%, ${m[2]} 100%)`,
            emoji: m[3],
        };
        return {
            gradient: 'linear-gradient(135deg, #e6e6e6 0%, #bdbdbd 100%)',
            emoji: '📰',
        };
    }

    // Compacte intro voor stories — eerste 160 tekens met clean cut-off.
    function shortIntro(text, maxLen) {
        if (!text) return '';
        const lim = maxLen || 160;
        if (text.length <= lim) return text;
        return text.slice(0, lim).replace(/\s+\S*$/, '') + '…';
    }

    function tipsForContext(ctx, limit) {
        const all = (SITE_DATA.blogs || []).slice();
        const scored = all
            .map(b => ({ entry: b, s: scoreEntry(b, ctx) }))
            .sort((a, z) => z.s - a.s)
            .slice(0, limit || 4)
            .map(({ entry }) => {
                const g = parseGradient(entry.image);
                return {
                    tag: entry.category || 'Inspiratie',
                    emoji: g.emoji,
                    gradient: g.gradient,
                    title: entry.title,
                    intro: entry.intro,
                    href: `blog-detail.html?id=${entry.id}`,
                };
            });
        return scored;
    }

    function storiesForContext(ctx, limit) {
        const all = (SITE_DATA.stories || []).slice();
        const scored = all
            .map(s => ({ entry: s, s: scoreEntry(s, ctx) }))
            .sort((a, z) => z.s - a.s)
            .slice(0, limit || 5)
            .map(({ entry }) => {
                const g = parseGradient(entry.image);
                return {
                    emoji: g.emoji,
                    gradient: g.gradient,
                    author: `Door ${entry.author}`,
                    title: entry.title,
                    intro: shortIntro(entry.content, 160),
                    href: `reisverslag-detail.html?id=${entry.id}`,
                };
            });
        return scored;
    }

    function tipsTitleForContext(ctx) {
        const { what, sub } = ctx;
        const subLabel = safeSubLabelLocal(what, sub);
        if (subLabel) return `Tips over ${subLabel.toLowerCase()}`;
        if (what) return `Tips over ${DATA.label('what', what).toLowerCase()}`;
        return 'Tips per vakantietype';
    }

    function storiesTitleForContext(/* ctx */) {
        // Story-rail-titel houden we bewust constant — het gaat om de
        // redactie-personae, niet om filtering. De cards zelf zijn
        // gescoord op de context, dus de relevantie zit in de selectie.
        return 'Reisverslagen van onze redactie';
    }

    // ---------- DRAG RAIL ----------
    // Touch/swipe is native; deze helper voegt muis-drag toe voor
    // desktop. Click-blocker voorkomt dat een drag per ongeluk een
    // card-klik triggert.
    function makePhDragRail(el) {
        if (!el || el.dataset.phDragBound === '1') return;
        el.dataset.phDragBound = '1';
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
            if (moved > 5) {
                if (!dragging) {
                    dragging = true;
                    el.style.cursor = 'grabbing';
                    el.style.userSelect = 'none';
                }
                el.scrollLeft = startLeft - dx;
                e.preventDefault();
            }
        });
        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            if (dragging) {
                const blocker = (ev) => { ev.preventDefault(); ev.stopPropagation(); };
                el.addEventListener('click', blocker, { capture: true, once: true });
                setTimeout(() => el.removeEventListener('click', blocker, true), 50);
            }
            dragging = false;
            el.style.cursor = '';
            el.style.userSelect = '';
        });
        el.style.cursor = 'grab';
        el.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                el.scrollLeft += e.deltaY;
                e.preventDefault();
            }
        }, { passive: false });
    }

    // ---------- HERO INJECTOR ----------
    // Hide de bestaande "vanilla" header (#bc breadcrumb + section.tight
    // met h1+lead) en injecteer de premium hero ONDER de search-nav
    // zodat de zoekbalk altijd bovenaan blijft als primaire interactie-
    // laag.
    function applyPremiumHero(config) {
        // Idempotentie: een tweede call mag geen tweede hero produceren.
        if (document.querySelector('.ph-hero')) return;

        const oldCrumb = document.getElementById('bc');
        const oldHeadSection = document.querySelector('section.section.tight');
        if (oldCrumb) oldCrumb.style.display = 'none';
        if (oldHeadSection) oldHeadSection.style.display = 'none';
        // Sommige Niveau 3 paginas hebben een tweede .section.tight
        // (de chips-strook); die hoort ook niet meer in de premium
        // flow want de chips komen mee in de hero.
        document.querySelectorAll('section.section.tight').forEach(el => el.style.display = 'none');

        const crumbHTML = (config.breadcrumb || []).map((seg, i, arr) => {
            const isLast = i === arr.length - 1;
            const sep = i > 0 ? `<span class="ph-sep">/</span>` : '';
            const node = seg.href && !isLast
                ? `<a href="${seg.href}">${seg.text}</a>`
                : `<span class="ph-current">${seg.text}</span>`;
            return sep + node;
        }).join('');

        const chipsHTML = (config.chips || []).map(c => `
            <span class="ph-chip${c.active ? ' ph-chip--active' : ''}">
                ${c.icon ? `<span class="ph-chip-icon" aria-hidden="true">${c.icon}</span>` : ''}
                <span>${c.label}</span>
            </span>
        `).join('');

        const heroHTML = `
            <section class="ph-hero ph-hero--${config.theme || 'generic'}">
                <div class="ph-hero-inner">
                    <nav class="ph-hero-breadcrumb" aria-label="Kruimelpad">${crumbHTML}</nav>
                    ${config.eyebrow ? `<span class="ph-hero-eyebrow">${config.eyebrow}</span>` : ''}
                    <h1 class="ph-hero-title">${config.title}</h1>
                    ${config.lead ? `<p class="ph-hero-lead">${config.lead}</p>` : ''}
                    ${chipsHTML ? `<div class="ph-hero-chips">${chipsHTML}</div>` : ''}
                </div>
            </section>
        `;

        const anchor = document.getElementById('hero-searchbar')
            || document.querySelector('header.site-header');
        if (anchor) anchor.insertAdjacentHTML('afterend', heroHTML);
        document.title = `${config.title} · Urlaubspotter`;
    }

    // ---------- TIPS INJECTOR ----------
    function applyPremiumTips(config) {
        if (document.querySelector('.ph-tips')) return;

        const anchor = document.getElementById('inspiration-tabs')
            || document.querySelector('.ph-hero');
        if (!anchor) return;

        const cardsHTML = (config.cards || []).map(c => `
            <a class="ph-tip-card" href="${c.href}">
                <div class="ph-tip-img" style="background: ${c.gradient}">
                    <span class="ph-tip-emoji" aria-hidden="true">${c.emoji}</span>
                </div>
                <div class="ph-tip-body">
                    <span class="ph-tip-tag">${c.tag}</span>
                    <h3 class="ph-tip-title">${c.title}</h3>
                    <p class="ph-tip-intro">${c.intro}</p>
                </div>
            </a>
        `).join('');

        const sectionHTML = `
            <section class="ph-tips ph-tips--${config.theme || 'generic'}" aria-label="${config.title}">
                <div class="ph-tips-inner">
                    <div class="ph-tips-head">
                        <div>
                            <span class="ph-tips-eyebrow">${config.eyebrow || 'Inspiratie'}</span>
                            <h2 class="ph-tips-title">${config.title}</h2>
                        </div>
                        ${config.moreHref ? `<a class="ph-tips-more" href="${config.moreHref}">${config.moreLabel || 'Alle tips →'}</a>` : ''}
                    </div>
                    <div class="ph-tips-grid">${cardsHTML}</div>
                </div>
            </section>
        `;
        anchor.insertAdjacentHTML('afterend', sectionHTML);

        // Hide de legacy blog-strook (id=blog-preview in een
        // .section-bg-alt-wrap) om duplicate content te voorkomen.
        const blogPreview = document.getElementById('blog-preview');
        const legacyWrap = blogPreview ? blogPreview.closest('.section-bg-alt-wrap') : null;
        if (legacyWrap) legacyWrap.style.display = 'none';

        const newGrid = document.querySelector('.ph-tips-grid');
        if (newGrid) makePhDragRail(newGrid);
    }

    // ---------- STORIES INJECTOR ----------
    function applyPremiumStories(config) {
        if (document.querySelector('.ph-stories')) return;

        const anchor = document.querySelector('.ph-tips')
            || document.getElementById('inspiration-tabs')
            || document.querySelector('.ph-hero');
        if (!anchor) return;

        const cardsHTML = (config.stories || []).map(s => `
            <article class="ph-story-card">
                <div class="ph-story-img" style="background: ${s.gradient}">
                    <span class="ph-story-emoji" aria-hidden="true">${s.emoji}</span>
                </div>
                <div class="ph-story-body">
                    <span class="ph-story-author">${s.author}</span>
                    <h3 class="ph-story-title">${s.title}</h3>
                    <p class="ph-story-intro">${s.intro}</p>
                    ${s.href ? `<a class="ph-story-link" href="${s.href}">Lees het verslag →</a>` : ''}
                </div>
            </article>
        `).join('');

        const sectionHTML = `
            <section class="ph-stories ph-stories--${config.theme || 'generic'}" aria-label="${config.title}">
                <div class="ph-stories-inner">
                    <div class="ph-tips-head">
                        <div>
                            <span class="ph-tips-eyebrow">${config.eyebrow || 'Van de redactie'}</span>
                            <h2 class="ph-tips-title">${config.title}</h2>
                        </div>
                        ${config.moreHref ? `<a class="ph-tips-more" href="${config.moreHref}">${config.moreLabel || 'Alle verslagen →'}</a>` : ''}
                    </div>
                    <div class="ph-stories-rail">${cardsHTML}</div>
                </div>
            </section>
        `;
        anchor.insertAdjacentHTML('afterend', sectionHTML);

        // Hide legacy editorial-grid blokken (Niveau 2 + 3 hadden
        // allemaal een hardcoded "Reisverslagen" sectie onder hun
        // listing). Iedere .section-bg-alt-wrap die een
        // .editorial-grid bevat wordt nu vervangen door de premium
        // stories-carousel.
        document.querySelectorAll('.section-bg-alt-wrap').forEach(el => {
            if (el.querySelector('.editorial-grid')) el.style.display = 'none';
        });

        const newRail = document.querySelector('.ph-stories-rail');
        if (newRail) makePhDragRail(newRail);
    }

    // ---------- INSPIRATION TABS MOUNT ----------
    // Sommige Niveau 3 paginas hebben geen #inspiration-tabs div in
    // de HTML staan. Deze helper plaatst hem direct na de hero zodat
    // renderInspirationTabs() altijd een mount-punt heeft.
    function ensureInspirationMount() {
        let mount = document.getElementById('inspiration-tabs');
        if (mount) return mount;
        const anchor = document.querySelector('.ph-hero')
            || document.getElementById('hero-searchbar')
            || document.querySelector('header.site-header');
        if (!anchor) return null;
        mount = document.createElement('div');
        mount.id = 'inspiration-tabs';
        anchor.insertAdjacentElement('afterend', mount);
        return mount;
    }

    // ---------- KEUZEHULP REPOSITIONING ----------
    // "De ultieme zoektool" hoort als logische volgende stap NA
    // de accommodatie-suggesties te staan.
    //   • Niveau 2 (1 dim): keuzehulp DIRECT onder het matches-blok
    //     — de zoektool is daar de natuurlijke vervolgstap.
    //   • Niveau 3 (2 dims): keuzehulp NA de stories-rail — de
    //     bezoeker krijgt eerst zijn aanbevelingen + inspiratie en
    //     daarna pas de verfijning-CTA.
    function repositionKeuzehulp(layout) {
        const keuzehulpBlock = document.getElementById('keuzehulp-block');
        if (!keuzehulpBlock) return;
        if (layout === 'niveau3') {
            const stories = document.querySelector('.ph-stories');
            if (stories) { stories.insertAdjacentElement('afterend', keuzehulpBlock); return; }
        }
        const listing = document.getElementById('matches-listing')
            || document.getElementById('listing');
        const section = listing ? listing.closest('section') : null;
        if (section) section.insertAdjacentElement('afterend', keuzehulpBlock);
    }

    // ---------- NIVEAU 3 LAYOUT REORDER ----------
    // Telt actieve dimensies — (WIE, WAT+sub, WAAR+region) elk
    // tellen als 1. Op een Niveau 3 pagina staan er precies 2 aan;
    // Niveau 2 = 1, Niveau 4 = 3.
    function activeDimensionCount(ctx) {
        let n = 0;
        if (ctx.who) n++;
        if (ctx.what || ctx.sub) n++;
        if (ctx.where || ctx.region) n++;
        return n;
    }

    // Op Niveau 3 (2 actieve dimensies) wil de gebruiker eerst de
    // aanbevelingen zien, dán pas de Inspiratie-tabs. We verplaatsen
    // daarom het accommodatie-listing-blok naar DIRECT onder de hero,
    // en de inspiratie-mount erónder. ph-tips / ph-stories volgen
    // automatisch omdat die na #inspiration-tabs worden geïnjecteerd.
    //
    // Doel-volgorde op Niveau 3 (na deze reorder):
    //   1. Hero
    //   2. Voor jou geselecteerd (listing)
    //   3. Inspiratie voor jou (#inspiration-tabs)
    //   4. Tips per vakantietype (.ph-tips — later injected)
    //   5. Reisverslagen (.ph-stories — later injected)
    //   6. De ultieme zoektool (#keuzehulp-block — later moved)
    //   7. Rest van de pagina (Wie/Waar carousels etc.)
    function applyNiveau3Layout() {
        const hero = document.querySelector('.ph-hero');
        if (!hero) return;
        const listing = document.getElementById('listing')
            || document.getElementById('matches-listing');
        const listingSection = listing ? listing.closest('section') : null;
        if (!listingSection) return;
        // 1. Listing direct na de hero
        hero.insertAdjacentElement('afterend', listingSection);
        // 2. Inspiration-tabs mount NA de listing (zodat ph-tips en
        //    ph-stories straks op de juiste plek terechtkomen)
        const insp = document.getElementById('inspiration-tabs');
        if (insp) listingSection.insertAdjacentElement('afterend', insp);
    }

    // ---------- ORCHESTRATOR ----------
    // ctx accepteert:
    //   who, what, where, region, sub : URL-params strings
    //   root      : optionele breadcrumb root array (default Home)
    //   eyebrow   : optionele eyebrow override
    //   title     : optionele title override (anders auto)
    //   lead      : optionele lead override (anders auto)
    //   renderInspirationTabs : default true (zet op false voor
    //                           pagina's waar de tabs niet passen)
    function applyPremiumPage(ctx) {
        ctx = ctx || {};
        const theme = themeForContext(ctx);
        // 2 actieve dimensies = Niveau 3. Daar krijgt de bezoeker
        // eerst de "Voor jou geselecteerd" listing, dán pas Inspiratie
        // (zie applyNiveau3Layout). Op Niveau 2 (1 dim) blijft de
        // volgorde Inspiratie → Tips → Stories → Matches → Zoektool.
        const dims = activeDimensionCount(ctx);
        const layout = dims >= 2 ? 'niveau3' : 'niveau2';

        // Body classes: ph-premium-page voor de generieke styling
        // (sticky tabs, hidden search-pill, tight hero spacing).
        // Backwards-compat: hotel-thema houdt z'n eigen body-class
        // zodat oude selectors blijven werken. Layout-class maakt
        // CSS-tweaks per niveau mogelijk zonder JS-werk.
        document.body.classList.add('ph-premium-page');
        document.body.classList.add(`ph-theme-${theme}`);
        document.body.classList.add(`ph-layout-${layout}`);
        if (theme === 'hotel') document.body.classList.add('ph-hotel-page');

        const copy       = heroCopyForContext(ctx);
        const breadcrumb = breadcrumbForContext(ctx, ctx.root);
        const chips      = chipsForContext(ctx);

        applyPremiumHero({
            theme,
            eyebrow: ctx.eyebrow || copy.eyebrow,
            title:   ctx.title   || copy.title,
            lead:    ctx.lead    || copy.lead,
            breadcrumb,
            chips,
        });

        // Niveau 3 reorder: listing direct onder de hero, dan
        // inspiration-tabs. Doen we VOORDAT we de tabs renderen +
        // tips/stories injecteren zodat alle volgende inserties
        // automatisch op de juiste plek landen.
        if (layout === 'niveau3') {
            applyNiveau3Layout();
        }

        // Inspiration-tabs (optioneel). Alleen mounten als we WAT-
        // of sub-context hebben — anders levert het een lege div op.
        // Wanneer de page-script de tabs zelf al gerenderd heeft
        // (Niveau 2 — Wat doet dat eerder in het script), pakt
        // ensureInspirationMount de bestaande mount.
        const wantTabs = ctx.renderInspirationTabs !== false
                         && (ctx.what || ctx.sub)
                         && typeof window.renderInspirationTabs === 'function';
        if (wantTabs) {
            ensureInspirationMount();
            window.renderInspirationTabs('inspiration-tabs', {
                contextWhat: ctx.what || null,
                contextSub:  ctx.sub  || null,
            });
        }

        applyPremiumTips({
            theme,
            eyebrow:  'Inspiratie',
            title:    tipsTitleForContext(ctx),
            moreHref: 'blogs.html',
            moreLabel:'Alle tips →',
            cards:    tipsForContext(ctx, 4),
        });

        applyPremiumStories({
            theme,
            eyebrow:  'Van de redactie',
            title:    storiesTitleForContext(ctx),
            moreHref: 'reisverslagen.html',
            moreLabel:'Alle reisverslagen →',
            stories:  storiesForContext(ctx, 5),
        });

        // Keuzehulp-positionering hangt af van het layout-niveau —
        // zie repositionKeuzehulp() voor de regels.
        repositionKeuzehulp(layout);
    }

    // ---------- EXPORT ----------
    window.applyPremiumPage   = applyPremiumPage;
    window.applyPremiumHero   = applyPremiumHero;
    window.applyPremiumTips   = applyPremiumTips;
    window.applyPremiumStories = applyPremiumStories;
    window.makePhDragRail     = makePhDragRail;
    window.themeForContext    = themeForContext;
    window.tipsForContext     = tipsForContext;
    window.storiesForContext  = storiesForContext;
    window.heroCopyForContext = heroCopyForContext;
})();
