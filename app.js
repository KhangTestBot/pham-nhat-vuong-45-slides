(() => {
  "use strict";

  const slidesData = Array.isArray(window.DECK_SLIDES) ? window.DECK_SLIDES : [];
  if (!slidesData.length) {
    console.error("DECK_SLIDES is empty or missing.");
    return;
  }

  // DOM References
  const deckEl = document.getElementById("deck");
  const railEl = document.getElementById("side-rail");
  const counterEl = document.getElementById("hud-slide-counter");
  const sectionEl = document.getElementById("hud-section-label");
  const progressBarEl = document.getElementById("hud-progress-bar");

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnToc = document.getElementById("btn-toc");
  const btnNotes = document.getElementById("btn-notes");
  const btnFullscreen = document.getElementById("btn-fullscreen");

  const lightboxEl = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCredit = document.getElementById("lightbox-credit");
  const lightboxClose = document.getElementById("lightbox-close");

  const tocModalEl = document.getElementById("toc-modal");
  const tocClose = document.getElementById("toc-close");
  const tocFiltersEl = document.getElementById("toc-filters");
  const tocGridEl = document.getElementById("toc-grid");

  const notesPanelEl = document.getElementById("notes-panel");
  const notesTitleEl = document.getElementById("notes-slide-title");
  const notesBodyEl = document.getElementById("notes-body");
  const notesClose = document.getElementById("notes-close");

  const totalSlides = slidesData.length;
  let currentIndex = 0;
  let currentTocFilter = "all";

  // ---------- Safe Utilities ----------
  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function safeAccentColor(col, fallback = "#FBBF24") {
    const map = {
      "#0F294A": "#38BDF8",
      "#1E3A5F": "#60A5FA",
      "#B45309": "#FBBF24",
      "#0F766E": "#2DD4BF",
      "#0D9488": "#2DD4BF",
      "#D97706": "#FBBF24"
    };
    if (!col) return fallback;
    return map[String(col).toUpperCase()] || col;
  }

  function cardClass(theme, accent = "") {
    const base = theme === "dark" ? "glass-card" : "edit-card";
    return accent ? `${base} ${accent}` : base;
  }

  function renderHeader(s, { showLead = true, darkOverride = false } = {}) {
    const titleClass = s.theme === "dark" || darkOverride
      ? "slide-title-serif"
      : "slide-title-serif";
    return `
      <div class="reveal d1">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <span class="eyebrow">${esc(s.kicker)}</span>
          ${s.scriptAccent ? `<span class="script-accent">${esc(s.scriptAccent)}</span>` : ""}
        </div>
        <h2 class="${titleClass}">${esc(s.title)}</h2>
        <div class="gold-rule"></div>
        ${showLead && s.lead ? `<p class="slide-lead">${esc(s.lead)}</p>` : ""}
      </div>
    `;
  }

  function renderPolaroid(s, {
    image = s.image,
    caption = s.polaroidCaption || s.imageCaption || s.title,
    tilt = s.tilt ?? -1.5,
    portrait = Boolean(s.portrait),
    title = s.title
  } = {}) {
    return `
      <div class="polaroid ${portrait ? "polaroid-portrait" : ""}"
           style="--tilt: ${Number(tilt) || 0}deg"
           role="button"
           tabindex="0"
           data-lightbox="true"
           data-src="${esc(image)}"
           data-title="${esc(title)}"
           data-caption="${esc(caption)}"
           data-credit=""
           aria-label="Phóng to ảnh: ${esc(caption)}">
        <img src="${esc(image)}" alt="${esc(caption)}" loading="lazy" />
        <div class="polaroid-caption">
          <span>${esc(caption)}</span>
        </div>
      </div>
    `;
  }

  function renderBulletPoints(points) {
    if (!Array.isArray(points) || !points.length) return "";
    return `
      <ul class="bullet-list">
        ${points.map((pt) => {
          if (typeof pt === "string") return `<li>${esc(pt)}</li>`;
          return `<li><strong>${esc(pt.bold)}:</strong> ${esc(pt.text)}</li>`;
        }).join("")}
      </ul>
    `;
  }

  function renderSlideBg(s) {
    if (!s.bgImage || s.kind === "cover" || s.kind === "conclusion_hub") return "";
    return `<div class="slide-bg-layer" aria-hidden="true"><img src="${esc(s.bgImage)}" alt="" loading="lazy" /></div>`;
  }

  function renderGalleryStrip(gallery, title) {
    if (!Array.isArray(gallery) || !gallery.length) return "";
    const tilts = [-1.6, 1.4, -1.1, 1.6];
    return `
      <div class="mini-gallery reveal d4">
        ${gallery.map((g, i) => `
          <div class="thumb-polaroid"
               style="--tilt: ${tilts[i % tilts.length]}deg"
               role="button"
               tabindex="0"
               data-lightbox="true"
               data-src="${esc(g.src)}"
               data-title="${esc(title)}"
               data-caption="${esc(g.cap)}"
               data-credit="">
            <img src="${esc(g.src)}" alt="${esc(g.cap)}" loading="lazy" />
            <div class="thumb-polaroid-cap">
              <span>${esc(g.cap)}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  // ---------- 24 Archetype Renderers ----------
  function renderCover(s) {
    const pillarsHtml = (s.pillars || []).map((p) => `
      <button type="button"
              class="cover-pillar-btn"
              style="--pillar-color: ${esc(p.color)}"
              data-jump="${Number(p.target) || 1}">
        <div class="cover-pillar-num">${esc(p.code)}</div>
        <div class="cover-pillar-name">${esc(p.name)}</div>
        <div class="cover-pillar-sub">${esc(p.tag)} · Màn ${pad2(p.target)} →</div>
      </button>
    `).join("");

    return `
      <div class="cover-backdrop">
        <img src="${esc(s.image)}" alt="Nền trang bìa Phạm Nhật Vượng" />
      </div>
      <div class="cover-scrim"></div>
      <div class="slide-inner">
        <div class="reveal d1" style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <span class="eyebrow">${esc(s.kicker)}</span>
          <span class="stamp-seal">40 MÀN TƯƠNG TÁC · 5 VIDEO</span>
        </div>
        <div class="reveal d1" style="margin-top:12px;">
          <span class="script-accent">${esc(s.scriptAccent)}</span>
        </div>
        <h1 class="cover-hero-h1 reveal d2">
          <span class="gold-metallic-text">${esc(s.title)}</span><br />
          <span style="font-size:0.68em;color:#F8FAFC;">${esc(s.subtitleHighlight || "")}</span>
        </h1>
        <p class="slide-lead reveal d3">${esc(s.lead)}</p>
        <div class="reveal d3" style="font-size:0.86rem;color:#94A3B8;font-weight:600;margin-bottom:8px;">
          ${esc(s.meta)}
        </div>
        <div class="cover-pillars reveal d4">${pillarsHtml}</div>
      </div>
    `;
  }

  function renderToc(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="stage-card-grid reveal d2">
          ${(s.stages || []).map((st) => {
            const accent = safeAccentColor(st.color);
            return `
            <button type="button"
                    class="edit-card stage-card"
                    style="border-top-color:${esc(accent)}"
                    data-jump="${Number(st.target)}">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                  <span style="font-family:var(--font-serif);font-size:1.5rem;font-weight:800;color:${esc(accent)}">${esc(st.num)}</span>
                  <span class="tag-pill">${esc(st.range)}</span>
                </div>
                <div class="card-title">${esc(st.title)}</div>
                <p style="font-size:0.88rem;color:#CBD5E1;line-height:1.5;">${esc(st.desc)}</p>
              </div>
              <div style="font-size:0.8rem;font-weight:700;color:${esc(accent)};">Đi tới Màn ${pad2(st.target)} →</div>
            </button>
          `;
          }).join("")}
        </div>
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderUtehyFacsimile(s) {
    const bars = s.bars || [];
    const first = bars[0] || {};
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-asymmetric-l reveal d2">
          <div>
            <div class="utehy-frame">
              <div class="utehy-frame-top">
                <span>Các nhân tố ảnh hưởng tới văn hóa doanh nhân</span>
                <span style="color:#FBBF24;">✦ 4 TRỤ CỘT</span>
              </div>
              <div class="utehy-frame-body">
                <div class="utehy-heading">5. CÁC BỘ PHẬN CẤU THÀNH<br />VĂN HÓA DOANH NHÂN</div>
                <div class="utehy-bars" data-utehy-group>
                  ${bars.map((b, idx) => `
                    <button type="button"
                            class="utehy-bar ${esc(b.cls)} ${idx === 0 ? "active" : ""}"
                            data-utehy-idx="${idx}">
                      <span>${esc(b.label)}</span>
                      <span style="font-size:0.82rem;color:#FBBF24;">Màn ${pad2(b.target)} ▸</span>
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>

          <div class="edit-card gold" data-utehy-detail style="min-height: 295px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <span class="card-kicker" data-utehy-code>BỘ PHẬN ${esc(first.code)}</span>
              <h3 class="card-title" data-utehy-title style="font-size:1.38rem;">${esc(first.label)}</h3>
              <div style="margin-top:12px;padding:12px 14px;background:rgba(255,255,255,0.05);border-radius:8px;border-left:4px solid #38BDF8;">
                <div style="font-size:0.76rem;font-weight:800;color:#38BDF8;text-transform:uppercase;">Cơ sở lý thuyết</div>
                <p data-utehy-theory style="font-size:0.94rem;color:#CBD5E1;margin-top:4px;">${esc(first.theory)}</p>
              </div>
              <div style="margin-top:12px;padding:12px 14px;background:rgba(251,191,36,0.08);border-radius:8px;border-left:4px solid #FBBF24;">
                <div style="font-size:0.76rem;font-weight:800;color:#FBBF24;text-transform:uppercase;">Minh họa thực tiễn · Phạm Nhật Vượng</div>
                <p data-utehy-pnv style="font-size:0.94rem;color:#FEF3C7;margin-top:4px;">${esc(first.pnv)}</p>
              </div>
            </div>
            <div style="margin-top:16px;">
              <button type="button" class="btn-gold" data-utehy-jump data-jump="${Number(first.target) || 21}">
                Đi tới Chương ${esc(first.code)} (Màn ${pad2(first.target)}) →
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderContrastSplit(s) {
    return `
      <div class="slide-inner">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;">
          <div style="flex:1;min-width:0;">${renderHeader(s)}</div>
          ${s.emblemImage ? `
            <div class="waving-flag-wrap reveal d2" style="flex-shrink:0;padding-top:6px;">
              <img class="waving-flag" src="${esc(s.emblemImage)}" alt="Quốc kỳ Việt Nam" />
            </div>
          ` : ""}
        </div>
        <div class="grid-2">
          <div class="glass-card reveal r-left d2" style="border-top:4px solid #0D9488;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap;">
              <h3 class="card-title" style="color:#5EEAD4;margin:0;">${esc(s.leftTitle)}</h3>
              <span class="stamp-seal" style="border-color:#0D9488;color:#5EEAD4;font-size:0.72rem;">${esc(s.leftBadge)}</span>
            </div>
            ${renderBulletPoints(s.leftPoints)}
          </div>
          <div class="glass-card reveal r-right d3" style="border-top:4px solid #EF4444;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap;">
              <h3 class="card-title" style="color:#FCA5A5;margin:0;">${esc(s.rightTitle)}</h3>
              <span class="stamp-seal crimson" style="font-size:0.72rem;">${esc(s.rightBadge)}</span>
            </div>
            ${renderBulletPoints(s.rightPoints)}
          </div>
        </div>
        ${s.bottomHighlight ? `<div class="bridge-callout reveal d4">${esc(s.bottomHighlight)}</div>` : ""}
      </div>
    `;
  }

  function renderStrata(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-2 reveal d2">
          ${(s.blocks || []).map((b, i) => `
            <div class="edit-card ${i === 1 ? "teal" : "gold"} reveal ${i === 0 ? "r-left" : "r-right"} d2" style="border-top-color:${esc(b.color)}">
              <div class="card-kicker">${esc(b.tag)}</div>
              <h3 class="card-title">${esc(b.title)}</h3>
              ${renderBulletPoints(b.points)}
            </div>
          `).join("")}
        </div>
        ${s.bridge ? `<div class="bridge-callout reveal d3">${esc(s.bridge)}</div>` : ""}
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderTrifoldCards(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-3 reveal d2">
          ${(s.cards || []).map((c, idx) => `
            <div class="${cardClass(s.theme, idx === 1 ? "gold" : idx === 2 ? "teal" : "")}"
                 style="${s.theme === "dark" ? `border-top:4px solid ${idx === 0 ? "#FBBF24" : idx === 1 ? "#0D9488" : "#60A5FA"}` : ""}">
              <div class="card-kicker">${esc(c.tag)}</div>
              <h3 class="card-title">${esc(c.title)}</h3>
              ${c.highlight ? `<div class="kpi-teal" style="font-weight:800;font-size:0.95rem;margin-bottom:10px;">${esc(c.highlight)}</div>` : ""}
              <p style="font-size:0.94rem;line-height:1.58;opacity:0.92;">${esc(c.desc)}</p>
            </div>
          `).join("")}
        </div>
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderPillarHub(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-asymmetric-l reveal d2">
          <div>
            ${renderPolaroid(s, {
              image: s.image,
              caption: "Mô hình 4 bộ phận cấu thành Văn hóa Doanh nhân",
              tilt: -1.5
            })}
          </div>
          <div class="grid-2" style="gap:14px;">
            ${(s.pillars || []).map((p) => {
              const accent = safeAccentColor(p.color);
              return `
              <button type="button"
                      class="edit-card"
                      style="text-align:left;cursor:pointer;border-top-color:${esc(accent)}"
                      data-jump="${Number(p.target)}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-family:var(--font-serif);font-size:1.35rem;font-weight:800;color:${esc(accent)}">${esc(p.code)}</span>
                  <span class="tag-pill">${esc(p.essence)}</span>
                </div>
                <div class="card-title" style="margin-top:8px;">${esc(p.title)}</div>
                <p style="font-size:0.86rem;color:#CBD5E1;line-height:1.48;">${esc(p.detail)}</p>
                <div style="margin-top:10px;font-size:0.78rem;font-weight:700;color:${esc(accent)};">Xem Màn ${pad2(p.target)} →</div>
              </button>
            `;
            }).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderMatrixTable(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="reveal d2" style="overflow-x:auto;">
          <table class="editorial-table">
            <thead>
              <tr>${(s.headers || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${(s.rows || []).map((row) => `
                <tr>${row.map((cell, idx) => `
                  <td style="${idx === 0 ? "font-weight:800;color:#FEF3C7;white-space:nowrap;" : ""}">${esc(cell)}</td>
                `).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderChapterDivider(s) {
    return `
      <div class="slide-inner">
        <div class="grid-asymmetric-l">
          <div class="reveal r-left d1">
            <span class="eyebrow">${esc(s.kicker)}</span>
            <div style="display:flex;align-items:center;gap:20px;margin:10px 0;">
              <div class="big-chapter-badge gold-metallic-text" style="margin:0;">${esc(s.bigNumber)}</div>
              ${s.image ? `
                <div class="polaroid polaroid-portrait"
                     style="--tilt: -2deg; max-width: 170px; padding: 8px 8px 10px;"
                     role="button"
                     tabindex="0"
                     data-lightbox="true"
                     data-src="${esc(s.image)}"
                     data-title="${esc(s.title)}"
                     data-caption="Chân dung Doanh nhân Phạm Nhật Vượng"
                     data-credit="">
                  <img src="${esc(s.image)}" alt="Chân dung Phạm Nhật Vượng" style="max-height:145px;object-fit:cover;object-position:top center;" loading="lazy" />
                  <div class="polaroid-caption" style="font-size:0.72rem;margin-top:6px;">
                    <span>Phạm Nhật Vượng</span>
                  </div>
                </div>
              ` : ""}
            </div>
            <div class="script-accent">${esc(s.scriptAccent || "")}</div>
            <h2 class="slide-title-serif">${esc(s.title)}</h2>
            <div class="gold-rule"></div>
            <p class="slide-lead">${esc(s.lead)}</p>
          </div>
          <div class="reveal r-right d2" style="display:flex;flex-direction:column;gap:12px;">
            ${(s.timeline || []).map((t) => `
              <div class="glass-card" style="padding:14px 18px;display:flex;align-items:center;gap:16px;">
                <span class="stamp-seal" style="flex-shrink:0;transform:none;">${esc(t.period)}</span>
                <div>
                  <div style="font-weight:700;color:#FEF3C7;">${esc(t.label)}</div>
                  <div style="font-size:0.88rem;color:#CBD5E1;">${esc(t.desc)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderPolaroidStory(s) {
    const mediaCol = `
      <div class="reveal d2">
        ${renderPolaroid(s)}
        ${Array.isArray(s.kpis) && s.kpis.length ? `
          <div class="grid-2" style="gap:12px;margin-top:16px;">
            ${s.kpis.map((k) => `
              <div class="${cardClass(s.theme, "gold")}" style="padding:12px 14px;text-align:center;">
                <div style="font-family:var(--font-serif);font-size:1.35rem;font-weight:800;color:#FBBF24">${esc(k.val)}</div>
                <div style="font-size:0.78rem;color:#CBD5E1;">${esc(k.lbl)}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
    const textCol = `
      <div class="reveal d3">
        <div class="${cardClass(s.theme, "teal")}">
          ${renderBulletPoints(s.points)}
        </div>
      </div>
    `;
    const flip = s.id % 2 === 1;
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="${flip ? "grid-asymmetric-r" : "grid-asymmetric-l"}">
          ${flip ? textCol + mediaCol : mediaCol + textCol}
        </div>
      </div>
    `;
  }

  function renderBreathingQuote(s) {
    const cardsHtml = `
      <div class="grid-3 reveal d3">
        ${(s.lessons || []).map((l, idx) => `
          <div class="edit-card ${idx === 1 ? "gold" : idx === 2 ? "teal" : ""}">
            <div class="card-kicker">ĐIỂM NHẤN ${esc(l.num)}</div>
            <h3 class="card-title">${esc(l.title)}</h3>
            <p style="font-size:0.92rem;color:#CBD5E1;line-height:1.55;">${esc(l.desc)}</p>
          </div>
        `).join("")}
      </div>
    `;

    return `
      <div class="slide-inner">
        ${renderHeader(s, { showLead: false })}
        <div class="quote-slab reveal d2">
          <blockquote>“${esc(s.quote)}”</blockquote>
          <div class="quote-attr">— ${esc(s.quoteAttr)}</div>
        </div>
        ${s.image ? `
          <div class="grid-asymmetric-r reveal d3">
            <div class="grid-3" style="grid-template-columns:1fr;gap:12px;">
              ${(s.lessons || []).map((l, idx) => `
                <div class="edit-card ${idx === 1 ? "gold" : idx === 2 ? "teal" : ""}" style="padding:14px 18px;">
                  <div class="card-kicker">BƯỚC NGOẶT ${esc(l.num)} · ${esc(l.title)}</div>
                  <p style="font-size:0.9rem;color:#CBD5E1;">${esc(l.desc)}</p>
                </div>
              `).join("")}
            </div>
            <div>
              ${renderPolaroid(s, {
                image: s.image,
                caption: "Khát vọng công nghệ Việt Nam vươn tầm thế giới",
                tilt: 2
              })}
            </div>
          </div>
        ` : cardsHtml}
      </div>
    `;
  }

  function renderVideoCinema(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="cinema-wrap reveal d2">
          <div>
            <div class="video-stage" data-video-stage data-video-id="${esc(s.videoId)}" data-thumb="${esc(s.thumb)}" data-channel="${esc(s.channel)}" data-duration="${esc(s.duration)}" data-title="${esc(s.videoTitle)}">
              <img class="poster" src="${esc(s.thumb)}" alt="${esc(s.videoTitle)}" loading="lazy" />
              <div class="video-yt-tag">
                <span>▶ YouTube</span>
                <span>· ${esc(s.channel)}</span>
              </div>
              <div class="video-duration-pill">${esc(s.duration)}</div>
              <div class="video-poster-overlay" data-play-video role="button" tabindex="0" aria-label="Phát video: ${esc(s.videoTitle)}">
                <div class="play-orb">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
                </div>
                <span style="font-weight:700;font-size:0.95rem;color:#FEF3C7;text-shadow:0 2px 8px rgba(0,0,0,0.8);">Nhấn để phát trực tiếp trong bài trình bày</span>
              </div>
            </div>
          </div>

          <div class="glass-card">
            <div class="card-kicker">TÀI LIỆU VIDEO BỔ TRỢ · ${esc(s.duration)}</div>
            <h3 class="card-title" style="color:#FEF3C7;">${esc(s.videoTitle)}</h3>
            <div style="font-size:0.84rem;color:#5EEAD4;font-weight:700;margin-bottom:12px;">Kênh: ${esc(s.channel)}</div>
            ${renderBulletPoints(s.highlights)}
            <div class="cta-row">
              <button type="button" class="btn-gold" data-play-inline-btn>▶ Phát Video Tại Chỗ</button>
              <a class="btn-outline-light" href="${esc(s.videoUrl)}" target="_blank" rel="noopener noreferrer">Mở trên YouTube ↗</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEcosystemWheel(s) {
    const spokes = s.spokes || [];
    const first = spokes[0] || {};
    const angles = [-90, 0, 90, 180];
    const radius = 132;
    const center = 170;
    const halfNode = 39;

    const nodesHtml = spokes.map((sp, i) => {
      const rad = (angles[i % angles.length] * Math.PI) / 180;
      const x = Math.round(center + radius * Math.cos(rad) - halfNode);
      const y = Math.round(center + radius * Math.sin(rad) - halfNode);
      return `
        <button type="button"
                class="orbit-node ${i === 0 ? "active" : ""}"
                style="left:${x}px;top:${y}px;"
                data-spoke-idx="${i}">
          <span style="font-size:1.15rem;line-height:1.1;">${esc(sp.icon)}</span>
          <span>${esc(sp.short)}</span>
        </button>
      `;
    }).join("");

    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="wheel-stage reveal d2" data-wheel-stage>
          <div class="orbit-ring">
            <div class="orbit-center">
              <span style="font-family:var(--font-serif);font-size:1.08rem;font-weight:800;color:#FBBF24;">${esc(s.hubLabel)}</span>
              <span style="font-size:0.74rem;color:#CBD5E1;margin-top:4px;">${esc(s.hubSub)}</span>
            </div>
            ${nodesHtml}
          </div>

          <div style="display:grid;grid-template-columns:1.15fr 0.85fr;gap:20px;align-items:center;">
            <div class="glass-card" style="border-top:4px solid #FBBF24;min-height:220px;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div class="card-kicker" data-wheel-kicker>TRỤ CỘT HỆ SINH THÁI (1/4)</div>
                <h3 class="card-title" data-wheel-title style="color:#FEF3C7;font-size:1.35rem;">${esc(first.icon)} ${esc(first.title)}</h3>
                <p data-wheel-desc style="font-size:0.96rem;color:#E2E8F0;line-height:1.6;">${esc(first.desc)}</p>
              </div>
              <div style="margin-top:14px;font-size:0.8rem;color:#5EEAD4;font-weight:600;">
                ✦ Nhấn vào 4 vòng tròn trên quỹ đạo để xoay và xem từng lĩnh vực
              </div>
            </div>
            <div>
              ${renderPolaroid(s, {
                image: s.image,
                caption: s.imageCaption || "Landmark 81 — Biểu tượng Tập đoàn Vingroup",
                tilt: 2
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBarChart(s) {
    // Verified facts:
    // Cars 2024: 97.399 | 2025: 196.919 (+102%)
    // 2-wheelers: 2024 baseline (1x = 406498 / 5.73 visually scaled for +473% ratio; labeled cleanly as "Nền 2024" without inventing an unprinted integer!) -> 2025: 406.498 (+473%)
    const maxVal = 440000;
    const hCar24 = Math.round((97399 / maxVal) * 185);
    const hCar25 = Math.round((196919 / maxVal) * 185);
    const hBike24 = Math.round(((406498 / 5.73) / maxVal) * 185);
    const hBike25 = Math.round((406498 / maxVal) * 185);

    const svgChart = `
      <svg class="svg-chart" viewBox="0 0 560 280" role="img" aria-label="Biểu đồ bàn giao VinFast 2024 và 2025">
        <defs>
          <linearGradient id="bar24" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#94A3B8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
          <linearGradient id="bar25Car" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#D97706"/>
          </linearGradient>
          <linearGradient id="bar25Bike" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2DD4BF"/>
            <stop offset="100%" stop-color="#0D9488"/>
          </linearGradient>
        </defs>
        <line x1="46" y1="228" x2="532" y2="228" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
        <line x1="46" y1="138" x2="532" y2="138" stroke="rgba(255,255,255,0.12)" stroke-dasharray="4 4"/>
        <line x1="46" y1="48" x2="532" y2="48" stroke="rgba(255,255,255,0.12)" stroke-dasharray="4 4"/>

        <!-- Legend -->
        <rect x="278" y="14" width="12" height="12" rx="3" fill="url(#bar24)"/>
        <text x="296" y="24" font-size="11" font-weight="700" fill="#CBD5E1">Năm 2024</text>
        <rect x="372" y="14" width="12" height="12" rx="3" fill="url(#bar25Car)"/>
        <text x="390" y="24" font-size="11" font-weight="700" fill="#FEF3C7">2025 (+102% / +473%)</text>

        <!-- Group 1: Cars -->
        <rect class="anim-bar" x="92" y="${228 - hCar24}" width="64" height="${hCar24}" rx="6" fill="url(#bar24)"/>
        <text x="124" y="${220 - hCar24}" text-anchor="middle" font-size="12" font-weight="700" fill="#CBD5E1">97.399</text>

        <rect class="anim-bar b2" x="172" y="${228 - hCar25}" width="64" height="${hCar25}" rx="6" fill="url(#bar25Car)"/>
        <text x="204" y="${220 - hCar25}" text-anchor="middle" font-size="13" font-weight="800" fill="#FBBF24">196.919 (+102%)</text>
        <text x="164" y="252" text-anchor="middle" font-size="13" font-weight="800" fill="#F8FAFC">Ô tô điện VinFast</text>

        <!-- Group 2: E-bikes -->
        <rect class="anim-bar b3" x="322" y="${228 - hBike24}" width="64" height="${hBike24}" rx="6" fill="url(#bar24)"/>
        <text x="354" y="${220 - hBike24}" text-anchor="middle" font-size="11" font-weight="700" fill="#CBD5E1">Nền 2024</text>

        <rect class="anim-bar b4" x="402" y="${228 - hBike25}" width="64" height="${hBike25}" rx="6" fill="url(#bar25Bike)"/>
        <text x="434" y="${220 - hBike25}" text-anchor="middle" font-size="13" font-weight="800" fill="#5EEAD4">406.498 (+473%)</text>
        <text x="394" y="252" text-anchor="middle" font-size="13" font-weight="800" fill="#F8FAFC">Xe máy điện &amp; Xe đạp điện</text>
      </svg>
    `;

    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-3 reveal d2" style="margin-bottom:18px;">
          ${(s.kpis || []).map((k) => {
            const accent = safeAccentColor(k.color);
            return `
            <div class="edit-card" style="border-top-color:${esc(accent)}">
              <div class="kpi-big" data-rollup="${esc(k.num)}" style="color:${esc(accent)}">${esc(k.num)}</div>
              <div style="font-weight:700;color:#F8FAFC;margin-top:4px;">${esc(k.unit)}</div>
              <div style="font-size:0.86rem;font-weight:700;color:#5EEAD4;margin-top:4px;">${esc(k.delta)}</div>
            </div>
          `;
          }).join("")}
        </div>
        <div class="grid-asymmetric-r reveal d3">
          <div class="edit-card gold">
            ${svgChart}
          </div>
          <div>
            ${renderGalleryStrip(s.gallery, s.title)}
          </div>
        </div>
      </div>
    `;
  }

  function renderAreaChart(s) {
    const ms = s.milestones || [];
    const coords = [
      { x: 75, y: 218 },
      { x: 225, y: 118 },
      { x: 375, y: 95 },
      { x: 525, y: 42 }
    ];
    const polyPoints = coords.map((c) => `${c.x},${c.y}`).join(" ");
    const areaPath = `M ${coords[0].x},235 L ${coords.map((c) => `${c.x},${c.y}`).join(" L ")} L ${coords[coords.length - 1].x},235 Z`;

    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-asymmetric-r reveal d2">
          <div class="glass-card" style="padding:18px;">
            <svg class="svg-chart" viewBox="0 0 600 280" role="img" aria-label="Biểu đồ tài sản ròng Phạm Nhật Vượng Forbes 2013-2026">
              <defs>
                <linearGradient id="forbesArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#FBBF24" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#0D9488" stop-opacity="0.04"/>
                </linearGradient>
              </defs>
              <line x1="40" y1="235" x2="565" y2="235" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
              <path d="${areaPath}" fill="url(#forbesArea)"/>
              <polyline class="anim-line" points="${polyPoints}" fill="none" stroke="#FBBF24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              ${ms.map((m, i) => {
                const c = coords[i];
                return `
                  <circle class="beacon-ring" cx="${c.x}" cy="${c.y}" r="9" fill="none" stroke="#FBBF24" stroke-width="2" style="animation-delay:${i * 0.4}s"/>
                  <circle cx="${c.x}" cy="${c.y}" r="8" fill="#0F294A" stroke="#FBBF24" stroke-width="3.5"/>
                  <text x="${c.x}" y="${c.y - 16}" text-anchor="middle" font-size="13" font-weight="800" fill="#FEF3C7">${esc(m.display)}</text>
                  <text x="${c.x}" y="258" text-anchor="middle" font-size="12" font-weight="700" fill="#94A3B8">${esc(m.year)}</text>
                `;
              }).join("")}
            </svg>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${ms.map((m) => `
              <div class="glass-card" style="padding:12px 16px;border-left:4px solid #FBBF24;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <span style="font-weight:800;color:#FBBF24;">${esc(m.year)}</span>
                  <span style="font-family:var(--font-serif);font-size:1.15rem;font-weight:800;color:#FFFFFF;">${esc(m.display)}</span>
                </div>
                <div style="font-size:0.84rem;color:#CBD5E1;margin-top:4px;">${esc(m.rank)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderPillarIntro(s) {
    return `
      <div class="slide-inner">
        <div class="grid-asymmetric-l">
          <div class="reveal d1">
            <span class="eyebrow">${esc(s.kicker)}</span>
            <div class="big-chapter-badge" style="color:${esc(safeAccentColor(s.accentColor))};margin:8px 0;">${esc(s.code)}</div>
            <div class="script-accent">${esc(s.scriptAccent || "")}</div>
            <h2 class="slide-title-serif">${esc(s.title)}</h2>
            <div class="gold-rule"></div>
            <p class="slide-lead">${esc(s.lead)}</p>
            <div class="tag-cloud">
              ${(s.tags || []).map((t) => `<span class="tag-pill">${esc(t)}</span>`).join("")}
            </div>
          </div>
          <div class="reveal d2">
            ${renderPolaroid(s, {
              image: s.image,
              caption: `Trụ cột ${s.code} · ${s.title}`,
              tilt: 2
            })}
          </div>
        </div>
      </div>
    `;
  }

  function renderGrid4Theory(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-2 reveal d2">
          ${(s.cards || []).map((c, idx) => `
            <div class="glass-card" style="border-top:4px solid ${idx % 2 === 0 ? "#FBBF24" : "#14B8A6"}">
              <div class="card-kicker">THÀNH TỐ ${esc(c.num)}</div>
              <h3 class="card-title" style="color:#FEF3C7;">${esc(c.title)}</h3>
              <p style="font-size:0.95rem;color:#E2E8F0;line-height:1.58;">${esc(c.desc)}</p>
            </div>
          `).join("")}
        </div>
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderGrid5Qualities(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-5 reveal d2">
          ${(s.items || []).map((it, idx) => `
            <div class="glass-card" style="border-top:4px solid ${idx % 2 === 0 ? "#FBBF24" : "#0D9488"};display:flex;flex-direction:column;gap:8px;">
              <div style="font-family:var(--font-serif);font-size:1.75rem;font-weight:800;color:#FBBF24;">${esc(it.idx)}</div>
              <h3 class="card-title" style="font-size:1.05rem;color:#FFFFFF;margin:0;">${esc(it.title)}</h3>
              <p style="font-size:0.86rem;color:#CBD5E1;line-height:1.52;">${esc(it.desc)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderStaircaseBets(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="staircase-row reveal d2">
          ${(s.steps || []).map((st, idx) => `
            <div class="edit-card stair-step step-${idx}" style="border-top-color:${esc(safeAccentColor(st.color))}">
              <div>
                ${st.img ? `
                  <img class="stair-photo"
                       src="${esc(st.img)}"
                       alt="${esc(st.title)}"
                       loading="lazy"
                       data-lightbox="true"
                       data-src="${esc(st.img)}"
                       data-title="${esc(st.title)}"
                       data-caption="${esc(st.year)} · ${esc(st.level)}"
                       data-credit="" />
                ` : ""}
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span class="card-kicker">${esc(st.year)}</span>
                  <span class="tag-pill">${esc(st.level)}</span>
                </div>
                <h3 class="card-title" style="margin-top:8px;">${esc(st.title)}</h3>
              </div>
              <p style="font-size:0.92rem;color:#CBD5E1;line-height:1.55;">${esc(st.desc)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderStatShowcase(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="edit-card gold reveal d2" style="margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
          <div>
            <div class="card-kicker">QUY MÔ ĐÓNG GÓP QUỸ THIỆN TÂM</div>
            <div class="kpi-big" data-rollup="${esc(s.heroStat)}" style="color:#FBBF24;">${esc(s.heroStat)}</div>
          </div>
          <p style="max-width:52ch;font-size:0.98rem;font-weight:600;color:#FEF3C7;">${esc(s.heroSub)}</p>
        </div>
        <div class="grid-4 reveal d3">
          ${(s.cards || []).map((c, idx) => `
            <div class="edit-card ${idx % 2 === 1 ? "teal" : ""}">
              <h3 class="card-title" style="font-size:1.05rem;">${esc(c.title)}</h3>
              <p style="font-size:0.88rem;color:#CBD5E1;line-height:1.52;">${esc(c.desc)}</p>
            </div>
          `).join("")}
        </div>
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderSynthesisFactors(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-3 reveal d2">
          <div class="edit-card" style="background:linear-gradient(145deg,#0F294A,#173D6E);color:#FFFFFF;border-top-color:#FBBF24;display:flex;flex-direction:column;justify-content:center;">
            <span class="card-kicker" style="color:#FBBF24;">TỔNG HỢP 5 NHÂN TỐ</span>
            <h3 class="card-title" style="color:#FFFFFF;font-size:1.45rem;">${esc(s.centerLabel)}</h3>
            <p style="color:#CBD5E1;font-size:0.94rem;">${esc(s.centerSub)}</p>
          </div>
          ${(s.factors || []).map((f, idx) => `
            <div class="edit-card ${idx % 2 === 0 ? "gold" : "teal"}">
              <div class="card-kicker">NHÂN TỐ HÌNH THÀNH</div>
              <h3 class="card-title">${esc(f.name)}</h3>
              <p style="font-size:0.92rem;color:#CBD5E1;line-height:1.55;">${esc(f.desc)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderRadarChart(s) {
    const axes = s.axes || [];
    const n = axes.length || 5;
    const cx = 230;
    const cy = 172;
    const maxR = 100;

    function pt(angleDeg, ratio) {
      const rad = ((angleDeg - 90) * Math.PI) / 180;
      return [cx + maxR * ratio * Math.cos(rad), cy + maxR * ratio * Math.sin(rad)];
    }

    const rings = [0.25, 0.5, 0.75, 1.0].map((r) => {
      const pts = Array.from({ length: n }, (_, i) => pt((360 / n) * i, r).join(",")).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="1.2"/>`;
    }).join("");

    const spokesSvg = Array.from({ length: n }, (_, i) => {
      const [x, y] = pt((360 / n) * i, 1);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>`;
    }).join("");

    const dataPoints = axes.map((ax, i) => pt((360 / n) * i, Math.min(ax.score, 10) / 10));
    const polyPts = dataPoints.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

    const labelsSvg = axes.map((ax, i) => {
      const deg = (360 / n) * i;
      const [lx, ly] = pt(deg, 1.18);
      const [dx, dy] = dataPoints[i];
      const anchor = Math.abs(lx - cx) < 12 ? "middle" : (lx > cx ? "start" : "end");
      const yAdj = ly < cy - 50 ? ly - 6 : (ly > cy + 50 ? ly + 12 : ly + 4);
      return `
        <circle class="beacon-ring" cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="6" fill="none" stroke="#FBBF24" stroke-width="1.8" style="animation-delay:${i * 0.35}s"/>
        <circle cx="${dx.toFixed(1)}" cy="${dy.toFixed(1)}" r="5.5" fill="#FBBF24" stroke="#071426" stroke-width="2"/>
        <text x="${lx.toFixed(1)}" y="${yAdj.toFixed(1)}" text-anchor="${anchor}" font-size="11.5" font-weight="700" fill="#FEF3C7">${esc(ax.label)} (${ax.score})</text>
      `;
    }).join("");

    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="grid-asymmetric-l reveal d2">
          <div class="glass-card" style="padding:14px;">
            <svg class="svg-chart" viewBox="0 0 460 330" role="img" aria-label="Biểu đồ Radar minh họa 5 chiều văn hóa doanh nhân">
              ${rings}
              ${spokesSvg}
              <polygon class="anim-radar" points="${polyPts}" fill="rgba(251, 191, 36, 0.28)" stroke="#FBBF24" stroke-width="2.8"/>
              ${labelsSvg}
            </svg>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${axes.map((ax) => `
              <div class="glass-card" style="padding:12px 16px;border-left:4px solid #14B8A6;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="color:#FEF3C7;">${esc(ax.label)}</strong>
                  <span style="font-family:var(--font-serif);font-weight:800;color:#5EEAD4;">${ax.score} / 10</span>
                </div>
                <div style="font-size:0.86rem;color:#CBD5E1;margin-top:3px;">${esc(ax.note)}</div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  }

  function renderLessonsTable(s) {
    return `
      <div class="slide-inner">
        ${renderHeader(s)}
        <div class="reveal d2" style="overflow-x:auto;">
          <table class="editorial-table">
            <thead>
              <tr>${(s.headers || []).map((h) => `<th>${esc(h)}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${(s.rows || []).map((row) => `
                <tr>${row.map((cell, idx) => `
                  <td style="${idx === 0 ? "font-weight:800;color:#FEF3C7;white-space:nowrap;" : ""}">${esc(cell)}</td>
                `).join("")}</tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        ${s.challenge ? `<div class="bridge-callout reveal d3">🎯 ${esc(s.challenge)}</div>` : ""}
        ${renderGalleryStrip(s.gallery, s.title)}
      </div>
    `;
  }

  function renderConclusionHub(s) {
    return `
      <div class="cover-backdrop">
        <img src="${esc(s.image)}" alt="Tương lai doanh nhân Việt Nam" style="opacity:0.35;" />
      </div>
      <div class="cover-scrim"></div>
      <div class="slide-inner">
        <div class="reveal d1" style="display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">
          <div style="flex:1;min-width:280px;">
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
              <span class="eyebrow">${esc(s.kicker)}</span>
              <span class="script-accent">${esc(s.scriptAccent || "")}</span>
            </div>
            <h2 class="slide-title-serif"><span class="gold-metallic-text">${esc(s.title)}</span></h2>
            <p class="slide-lead">${esc(s.lead)}</p>
          </div>
          ${s.flagEmblem ? `
            <div style="flex-shrink:0;text-align:center;">
              <img class="waving-flag flag-hero" src="${esc(s.flagEmblem)}" alt="Quốc kỳ Việt Nam" />
            </div>
          ` : ""}
        </div>

        <div class="reveal d2" style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:16px;">
          ${(s.seals || []).map((seal, i) => `
            <span class="stamp-seal ${i % 2 === 1 ? "crimson" : ""}" style="transform:none;">${esc(seal)}</span>
          `).join("")}
        </div>

        <div class="reveal d3">
          <div style="font-size:0.82rem;font-weight:700;color:#FBBF24;letter-spacing:0.06em;text-transform:uppercase;">
            Trung tâm Truy cập Nhanh 5 Video YouTube Trong Bài
          </div>
          <div class="conclusion-video-grid">
            ${(s.videos || []).map((v) => `
              <div class="conclusion-vid-card">
                <div>
                  <div style="font-size:0.72rem;font-weight:800;color:#FBBF24;">VIDEO 0${v.n} · ${esc(v.dur)}</div>
                  <div style="font-size:0.84rem;font-weight:700;margin-top:4px;line-height:1.35;">${esc(v.title)}</div>
                  <div style="font-size:0.74rem;color:#94A3B8;margin-top:4px;">${esc(v.ch)}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" class="btn-gold" style="padding:5px 9px;font-size:0.74rem;" data-jump="${Number(v.slide)}">Màn ${pad2(v.slide)}</button>
                  <a class="btn-outline-light" style="padding:4px 8px;font-size:0.72rem;" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">YT ↗</a>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="reveal d4" style="margin-top:20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
          <div style="font-family:var(--font-serif);font-size:1.05rem;font-weight:700;color:#5EEAD4;">${esc(s.closing)}</div>
          <button type="button" class="btn-gold" data-jump="1">↺ Quay lại Màn 01</button>
        </div>
      </div>
    `;
  }

  function renderSlideContent(s) {
    let body = "";
    switch (s.kind) {
      case "cover": body = renderCover(s); break;
      case "toc": body = renderToc(s); break;
      case "utehy_facsimile": body = renderUtehyFacsimile(s); break;
      case "contrast_split": body = renderContrastSplit(s); break;
      case "strata": body = renderStrata(s); break;
      case "trifold_cards": body = renderTrifoldCards(s); break;
      case "pillar_hub": body = renderPillarHub(s); break;
      case "matrix_table": body = renderMatrixTable(s); break;
      case "chapter_divider": body = renderChapterDivider(s); break;
      case "polaroid_story": body = renderPolaroidStory(s); break;
      case "breathing_quote": body = renderBreathingQuote(s); break;
      case "video_cinema": body = renderVideoCinema(s); break;
      case "ecosystem_wheel": body = renderEcosystemWheel(s); break;
      case "bar_chart": body = renderBarChart(s); break;
      case "area_chart": body = renderAreaChart(s); break;
      case "pillar_intro": body = renderPillarIntro(s); break;
      case "grid4_theory": body = renderGrid4Theory(s); break;
      case "grid5_qualities": body = renderGrid5Qualities(s); break;
      case "staircase_bets": body = renderStaircaseBets(s); break;
      case "stat_showcase": body = renderStatShowcase(s); break;
      case "synthesis_factors": body = renderSynthesisFactors(s); break;
      case "radar_chart": body = renderRadarChart(s); break;
      case "lessons_table": body = renderLessonsTable(s); break;
      case "conclusion_hub": body = renderConclusionHub(s); break;
      default:
        console.warn("Unknown slide kind:", s.kind);
        body = `<div class="slide-inner">${renderHeader(s)}</div>`;
    }
    return renderSlideBg(s) + body;
  }

  // ---------- Build Slides & Right Rail ----------
  function buildDeck() {
    const slidesFrag = document.createDocumentFragment();
    const railFrag = document.createDocumentFragment();

    slidesData.forEach((s, idx) => {
      const section = document.createElement("section");
      section.id = `slide-${pad2(s.id)}`;
      section.className = `slide theme-${s.theme || "dark"}${s.kind === "cover" ? " slide-cover" : ""}`;
      section.dataset.index = String(idx);
      section.dataset.slideId = String(s.id);
      section.innerHTML = renderSlideContent(s);
      slidesFrag.appendChild(section);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "rail-dot";
      if (s.kind === "video_cinema") dot.dataset.kind = "video";
      dot.dataset.jump = String(s.id);
      dot.dataset.tooltip = `Màn ${pad2(s.id)} · ${s.title}`;
      dot.setAttribute("aria-label", `Đi tới Màn ${s.id}: ${s.title}`);
      railFrag.appendChild(dot);
    });

    deckEl.appendChild(slidesFrag);
    railEl.appendChild(railFrag);
  }

  // ---------- Active Slide State & Navigation ----------
  function unloadAllInactiveVideos(activeIdx) {
    const stages = deckEl.querySelectorAll("[data-video-stage]");
    stages.forEach((stage) => {
      const parentSlide = stage.closest(".slide");
      const slideIdx = Number(parentSlide?.dataset.index ?? -1);
      if (slideIdx !== activeIdx && stage.dataset.playing === "true") {
        restoreVideoPoster(stage);
      }
    });
  }

  function restoreVideoPoster(stage) {
    const thumb = stage.dataset.thumb;
    const channel = stage.dataset.channel;
    const duration = stage.dataset.duration;
    const title = stage.dataset.title;
    stage.dataset.playing = "false";
    stage.innerHTML = `
      <img class="poster" src="${esc(thumb)}" alt="${esc(title)}" loading="lazy" />
      <div class="video-yt-tag"><span>▶ YouTube</span><span>· ${esc(channel)}</span></div>
      <div class="video-duration-pill">${esc(duration)}</div>
      <div class="video-poster-overlay" data-play-video role="button" tabindex="0" aria-label="Phát video: ${esc(title)}">
        <div class="play-orb">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
        </div>
        <span style="font-weight:700;font-size:0.95rem;color:#FEF3C7;text-shadow:0 2px 8px rgba(0,0,0,0.8);">Nhấn để phát trực tiếp trong bài trình bày</span>
      </div>
    `;
  }

  function activateVideoStage(stage) {
    const videoId = stage.dataset.videoId;
    const title = stage.dataset.title || "YouTube Video";
    if (!videoId) return;
    stage.dataset.playing = "true";
    stage.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0"
        title="${esc(title)}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>
    `;
  }

  function runRollups(slideEl) {
    if (!slideEl || slideEl.dataset.rolledUp === "true") return;
    slideEl.dataset.rolledUp = "true";
    const els = slideEl.querySelectorAll("[data-rollup]");
    els.forEach((el) => {
      const raw = el.dataset.rollup || "";
      const match = raw.match(/^([\d.,]+)(.*)$/);
      if (!match) return;
      const numStr = match[1];
      const suffix = match[2] || "";
      const hasCommaDecimal = numStr.includes(",");
      const cleanInt = Number(numStr.replace(/\./g, "").replace(",", "."));
      if (!Number.isFinite(cleanInt) || cleanInt <= 0) return;

      const decimals = hasCommaDecimal ? (numStr.split(",")[1]?.length || 0) : 0;
      const start = performance.now();
      const duration = 900;

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const cur = cleanInt * eased;
        const formatted = decimals > 0
          ? cur.toFixed(decimals).replace(".", ",")
          : Math.round(cur).toLocaleString("vi-VN");
        el.textContent = formatted + suffix;
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = raw;
      }
      requestAnimationFrame(tick);
    });
  }

  function setActiveSlide(idx) {
    if (idx < 0 || idx >= totalSlides) return;
    currentIndex = idx;
    const slide = slidesData[idx];

    counterEl.textContent = `${pad2(slide.id)} / ${pad2(totalSlides)}`;
    sectionEl.textContent = slide.section || "";
    progressBarEl.style.width = `${((idx + 1) / totalSlides) * 100}%`;

    btnPrev.disabled = idx === 0;
    btnNext.disabled = idx === totalSlides - 1;

    const allSlides = deckEl.querySelectorAll(".slide");
    allSlides.forEach((el, i) => el.classList.toggle("is-visible", i === idx));
    runRollups(allSlides[idx]);

    const dots = railEl.querySelectorAll(".rail-dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === idx));

    if (!notesPanelEl.hidden) {
      notesTitleEl.textContent = `Màn ${pad2(slide.id)} · ${slide.title}`;
      notesBodyEl.textContent = slide.notes || "Không có ghi chú bổ sung cho màn này.";
    }

    unloadAllInactiveVideos(idx);
  }

  function goToSlideByNumber(slideNumber) {
    const idx = Math.max(0, Math.min(totalSlides - 1, Number(slideNumber) - 1));
    const target = deckEl.children[idx];
    if (!target) return;
    setActiveSlide(idx);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- Scroll / Intersection Observer ----------
  function setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        }
        if (best) {
          const idx = Number(best.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveSlide(idx);
        }
      },
      { root: deckEl, threshold: 0.55 }
    );

    Array.from(deckEl.children).forEach((el) => observer.observe(el));
  }

  // ---------- Lightbox, TOC & Notes Modals ----------
  function openLightbox(triggerEl) {
    lightboxImg.src = triggerEl.dataset.src || "";
    lightboxImg.alt = triggerEl.dataset.caption || "";
    lightboxTitle.textContent = triggerEl.dataset.title || "";
    lightboxCaption.textContent = triggerEl.dataset.caption || "";
    lightboxCredit.textContent = triggerEl.dataset.credit || "";
    lightboxEl.hidden = false;
  }

  function closeLightbox() {
    lightboxEl.hidden = true;
    lightboxImg.src = "";
  }

  function renderTocGrid() {
    const filtered = slidesData.filter((s) => {
      if (currentTocFilter === "all") return true;
      if (currentTocFilter === "video") return s.kind === "video_cinema";
      return String(s.part) === String(currentTocFilter);
    });

    tocGridEl.innerHTML = filtered.map((s) => `
      <button type="button"
              class="toc-item ${s.id === slidesData[currentIndex].id ? "current" : ""}"
              data-toc-jump="${s.id}">
        <div class="toc-item-num">MÀN ${pad2(s.id)} ${s.kind === "video_cinema" ? "· ▶ VIDEO" : ""}</div>
        <div class="toc-item-title">${esc(s.title)}</div>
      </button>
    `).join("");
  }

  function openTocModal() {
    renderTocGrid();
    tocModalEl.hidden = false;
  }

  function closeTocModal() {
    tocModalEl.hidden = true;
  }

  function toggleNotes(forceOpen) {
    const nextOpen = typeof forceOpen === "boolean" ? forceOpen : notesPanelEl.hidden;
    notesPanelEl.hidden = !nextOpen;
    btnNotes.classList.toggle("active", nextOpen);
    if (nextOpen) {
      const s = slidesData[currentIndex];
      notesTitleEl.textContent = `Màn ${pad2(s.id)} · ${s.title}`;
      notesBodyEl.textContent = s.notes || "";
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  // ---------- Interactive Delegated Events ----------
  function bindEvents() {
    btnPrev.addEventListener("click", () => goToSlideByNumber(currentIndex));
    btnNext.addEventListener("click", () => goToSlideByNumber(currentIndex + 2));
    btnToc.addEventListener("click", () => (tocModalEl.hidden ? openTocModal() : closeTocModal()));
    btnNotes.addEventListener("click", () => toggleNotes());
    btnFullscreen.addEventListener("click", toggleFullscreen);

    lightboxClose.addEventListener("click", closeLightbox);
    lightboxEl.addEventListener("click", (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });

    tocClose.addEventListener("click", closeTocModal);
    tocModalEl.addEventListener("click", (e) => {
      if (e.target === tocModalEl) closeTocModal();
    });

    tocFiltersEl.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-part]");
      if (!chip) return;
      currentTocFilter = chip.dataset.part;
      tocFiltersEl.querySelectorAll(".toc-chip").forEach((c) => c.classList.toggle("active", c === chip));
      renderTocGrid();
    });

    tocGridEl.addEventListener("click", (e) => {
      const item = e.target.closest("[data-toc-jump]");
      if (!item) return;
      closeTocModal();
      goToSlideByNumber(Number(item.dataset.tocJump));
    });

    notesClose.addEventListener("click", () => toggleNotes(false));

    railEl.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-jump]");
      if (dot) goToSlideByNumber(Number(dot.dataset.jump));
    });

    deckEl.addEventListener("click", (e) => {
      // Jump CTA buttons inside slides
      const jumpBtn = e.target.closest("[data-jump]");
      if (jumpBtn) {
        goToSlideByNumber(Number(jumpBtn.dataset.jump));
        return;
      }

      // Polaroid lightbox
      const polaroid = e.target.closest("[data-lightbox]");
      if (polaroid) {
        openLightbox(polaroid);
        return;
      }

      // Video play (overlay or button)
      const playOverlay = e.target.closest("[data-play-video], [data-play-inline-btn]");
      if (playOverlay) {
        const slideEl = playOverlay.closest(".slide");
        const stage = slideEl?.querySelector("[data-video-stage]");
        if (stage) activateVideoStage(stage);
        return;
      }

      // UTEHY 5.1-5.4 Facsimile bar selector (Slide 03)
      const utehyBtn = e.target.closest("[data-utehy-idx]");
      if (utehyBtn) {
        const slideEl = utehyBtn.closest(".slide");
        const sObj = slidesData[Number(slideEl.dataset.index)];
        const bar = sObj?.bars?.[Number(utehyBtn.dataset.utehyIdx)];
        if (!bar) return;
        slideEl.querySelectorAll("[data-utehy-idx]").forEach((b) => b.classList.toggle("active", b === utehyBtn));
        slideEl.querySelector("[data-utehy-code]").textContent = `BỘ PHẬN ${bar.code}`;
        slideEl.querySelector("[data-utehy-title]").textContent = bar.label;
        slideEl.querySelector("[data-utehy-theory]").textContent = bar.theory;
        slideEl.querySelector("[data-utehy-pnv]").textContent = bar.pnv;
        const jBtn = slideEl.querySelector("[data-utehy-jump]");
        jBtn.dataset.jump = String(bar.target);
        jBtn.textContent = `Đi tới Chương ${bar.code} (Màn ${pad2(bar.target)}) →`;
        return;
      }

      // Ecosystem wheel spoke selector (Slide 16)
      const spokeBtn = e.target.closest("[data-spoke-idx]");
      if (spokeBtn) {
        const idx = Number(spokeBtn.dataset.spokeIdx);
        const slideEl = spokeBtn.closest(".slide");
        const sObj = slidesData[Number(slideEl.dataset.index)];
        const spoke = sObj?.spokes?.[idx];
        if (!spoke) return;
        slideEl.querySelectorAll("[data-spoke-idx]").forEach((n) => n.classList.toggle("active", n === spokeBtn));
        slideEl.querySelector("[data-wheel-kicker]").textContent = `TRỤ CỘT HỆ SINH THÁI (${idx + 1}/${sObj.spokes.length})`;
        slideEl.querySelector("[data-wheel-title]").textContent = `${spoke.icon} ${spoke.title}`;
        slideEl.querySelector("[data-wheel-desc]").textContent = spoke.desc;
      }
    });

    deckEl.addEventListener("keydown", (e) => {
      if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-lightbox], [data-play-video]")) {
        e.preventDefault();
        e.target.click();
      }
    });

    // Subtle 3D perspective tilt on interactive photo frames & cards
    deckEl.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".polaroid, .thumb-polaroid, .cover-pillar-btn");
      if (!card) return;
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${(nx * 7).toFixed(2)}deg) rotateX(${(-ny * 7).toFixed(2)}deg) translateY(-5px) scale(1.02)`;
    });

    deckEl.addEventListener("mouseleave", (e) => {
      const card = e.target.closest(".polaroid, .thumb-polaroid, .cover-pillar-btn");
      if (card) card.style.transform = "";
    }, true);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!lightboxEl.hidden) { closeLightbox(); return; }
        if (!tocModalEl.hidden) { closeTocModal(); return; }
        if (!notesPanelEl.hidden) { toggleNotes(false); return; }
      }

      if (!lightboxEl.hidden || !tocModalEl.hidden) return;
      if (e.target.matches("input, textarea, select")) return;

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case "PageDown":
          e.preventDefault();
          goToSlideByNumber(currentIndex + 2);
          break;
        case " ":
          if (!e.target.matches("button, a")) {
            e.preventDefault();
            goToSlideByNumber(currentIndex + 2);
          }
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          goToSlideByNumber(currentIndex);
          break;
        case "Home":
          e.preventDefault();
          goToSlideByNumber(1);
          break;
        case "End":
          e.preventDefault();
          goToSlideByNumber(totalSlides);
          break;
        case "g":
        case "G":
          e.preventDefault();
          tocModalEl.hidden ? openTocModal() : closeTocModal();
          break;
        case "n":
        case "N":
          e.preventDefault();
          toggleNotes();
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    });
  }

  // ---------- Init ----------
  buildDeck();
  setupObserver();
  bindEvents();
  setActiveSlide(0);
})();
