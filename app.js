/* ==========================================================================
   PHẠM NHẬT VƯỢNG & HỆ SINH THÁI VINGROUP — 41 SLIDES × 12 ARCHETYPES ENGINE
   - Opens ALL 41 SLIDES (01 / 41) by default!
   - Native HTML5 <video controls> with full 09:57 HD MP4 (assets/vid03.mp4)
     + External YouTube Link!
   - 4 Distinct Real Photos per slide (Main Morph Frames + Card Inline Thumbs)
   - 12 Non-Repeating Layout Archetypes + 10 3D Camera Morph Transitions
   ========================================================================== */

(function () {
  "use strict";

  const RAW_SLIDES = window.DECK_SLIDES || window.SLIDES_DATA || [];
  const TIKTOK_14_IDS = [1, 3, 4, 11, 13, 14, 15, 17, 18, 21, 24, 29, 35, 41];

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function getPhotosForSlide(s) {
    if (Array.isArray(s.gallery) && s.gallery.length >= 3) {
      return s.gallery;
    }
    return [
      { src: s.image || "assets/pnv_portrait.jpg", tag: "PHẠM NHẬT VƯỢNG", cap: s.imageCaption || s.title },
      { src: "assets/pnv_vinfast_tour.jpg", tag: "NHÀ MÁY VINFAST", cap: "Ông Phạm Nhật Vượng thị sát dây chuyền sản xuất VinFast" },
      { src: "assets/landmark81_vingroup.jpg", tag: "LANDMARK 81", cap: "Biểu tượng tòa tháp Landmark 81 của Tập đoàn Vingroup" },
      { src: "assets/vinfast_vf9.jpg", tag: "SUV ĐIỆN VF 9", cap: "Mẫu SUV điện cỡ lớn VinFast VF 9" }
    ];
  }

  function renderPhotoBox(photo, morphKey, extraClass) {
    const p = photo || { src: "assets/pnv_portrait.jpg", tag: "VINGROUP", cap: "Tỷ phú Phạm Nhật Vượng" };
    return `
      <div class="m-photo-frame ${extraClass || ""} js-zoom-trigger"
           data-morph="${esc(morphKey)}"
           data-src="${esc(p.src)}"
           data-title="${esc(p.tag)}"
           data-caption="${esc(p.cap)}">
        <div class="m-photo-inner">
          <img src="${esc(p.src)}" alt="${esc(p.cap)}" onerror="this.src='assets/pnv_portrait.jpg'" />
          <div class="m-photo-cap">
            <span class="m-photo-tag">${esc(p.tag)}</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderCardBodyContent(it) {
    if (Array.isArray(it.points) && it.points.length) {
      return `<ul class="m-card-bullets">${it.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>`;
    }
    return `<div class="m-card-body">${esc(it.body || "")}</div>`;
  }

  function renderInlineThumb(photo, customClass) {
    const p = photo || { src: "assets/pnv_portrait.jpg", tag: "VINGROUP", cap: "Tỷ phú Phạm Nhật Vượng" };
    return `
      <div class="${customClass || "m-card-thumb"} js-zoom-trigger"
           data-src="${esc(p.src)}"
           data-title="${esc(p.tag)}"
           data-caption="${esc(p.cap)}">
        <img src="${esc(p.src)}" alt="${esc(p.cap)}" onerror="this.src='assets/pnv_portrait.jpg'" />
      </div>
    `;
  }

  // =========================================================================
  // 12 DISTINCT VISUAL ARCHETYPE RENDERERS (WITH COMPLETE PHOTOS & VIDEOS)
  // =========================================================================

  // 1. ARCHETYPE: HERO POSTER SPLIT (Cover & Grand Openers)
  function renderArchHeroPoster(s, idx, total, photos) {
    const metrics = s.metrics || [
      { val: "1968", label: "Sinh tại Hà Nội" },
      { val: "1993", label: "Lập Technocom (Mivina)" },
      { val: "2012", label: "Hợp nhất Vingroup" },
      { val: "2023", label: "Niêm yết Nasdaq (VFS)" }
    ];
    const pillars = s.pillars || (s.lessons ? s.lessons.map((l) => ({
      code: l.code || l.num,
      label: l.title,
      desc: l.desc || l.action
    })) : []);
    const isFinal = s.layout === "final_lessons_utehy";

    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || "VĂN HÓA DOANH NHÂN UTEHY")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="arch-hero-grid">
          <div class="arch-hero-left">
            <div>
              <h1 class="fs-title fs-title-hero" data-morph="morph-title">${esc(s.title)}</h1>
              <p class="fs-lead" data-morph="morph-subtitle">${esc(s.subtitle || s.lead || "")}</p>
            </div>

            ${!isFinal ? `
              <div class="arch-hero-metrics" data-morph="morph-stats">
                ${metrics.slice(0, 4).map((m, i) => `
                  <div class="arch-metric-box" data-morph="morph-stat-${i + 1}">
                    <div class="arch-metric-val">${esc(m.val || m.num)}</div>
                    <div class="arch-metric-lbl">${esc(m.label)}</div>
                  </div>
                `).join("")}
              </div>
            ` : ""}

            <div class="arch-hero-pillars ${isFinal ? "is-final" : ""}">
              ${pillars.slice(0, 4).map((p, i) => `
                <div class="m-card m-card-flex" data-morph="morph-card-${i + 1}">
                  ${renderInlineThumb(photos[i % photos.length])}
                  <div>
                    <div class="m-card-title">${esc(p.code ? (p.code + " · ") : "")}${esc(p.label || p.title)}</div>
                    ${p.desc ? `<div class="m-card-body">${esc(p.desc)}</div>` : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="arch-hero-right">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>${esc(s.closing || "Phạm Nhật Vượng & Hệ sinh thái Vingroup")}</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)} · Bấm ảnh để phóng to</span>
        </footer>
      </div>
    `;
  }

  // 2. ARCHETYPE: CENTRAL RADIAL HUB (Photos in Center, 4 Photo-Cards Orbit in 4 Corners!)
  function renderArchRadialHub(s, idx, total, photos, items) {
    const list = items.slice(0, 4);
    const renderCorner = (it, i) => {
      if (!it) return `<div></div>`;
      return `
        <div class="m-card m-card-flex" data-morph="morph-card-${i + 1}">
          ${renderInlineThumb(photos[(i + 1) % photos.length])}
          <div>
            <div class="m-card-title">${esc(it.badge ? (it.badge + " · ") : "")}${esc(it.title)}</div>
            ${renderCardBodyContent(it)}
          </div>
        </div>
      `;
    };

    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.section || "TÂM ĐIỂM")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block center">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || s.subtitle || "")}</p>
        </div>

        <div class="arch-radial-stage">
          ${renderCorner(list[0], 0)}

          <!-- CENTER HUB PHOTO -->
          <div class="arch-radial-center">
            ${renderPhotoBox(photos[0], "morph-photo-1", "hex-frame")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
          </div>

          ${renderCorner(list[1], 1)}
          ${renderCorner(list[2], 2)}
          ${renderCorner(list[3], 3)}
        </div>

        <footer class="fs-footer">
          <span>Phạm Nhật Vượng &amp; Hệ sinh thái Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 3. ARCHETYPE: TOP PANORAMIC 3-PHOTO STRIP + BENTO GRID BELOW
  function renderArchPanoramicBento(s, idx, total, photos, items) {
    const colsClass = items.length <= 4 ? "cols-2" : (items.length === 5 ? "items-5" : "");
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.section || "TOÀN CẢNH")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || s.subtitle || "")}</p>
        </div>

        <div class="arch-pano-layout">
          <div class="arch-pano-strip">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
            ${renderPhotoBox(photos[2], "morph-photo-3", "")}
          </div>

          <div class="arch-bento-grid ${colsClass}">
            ${items.slice(0, 6).map((it, i) => `
              <div class="m-card m-card-flex" data-morph="morph-card-${i + 1}">
                ${items.length <= 5 ? renderInlineThumb(photos[(i + 1) % photos.length]) : ""}
                <div>
                  <div class="m-card-title">${esc(it.badge ? (it.badge + " · ") : "")}${esc(it.title)}</div>
                  ${renderCardBodyContent(it)}
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Phạm Nhật Vượng &amp; Hệ sinh thái Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 4. ARCHETYPE: UTEHY CLASSROOM SLIDE REPLICA (4 Giant Colored Bars with Thumbs + Right Photos)
  function renderArchUtehyReplica(s, idx, total, photos) {
    const bars = s.bars || [];
    const showPractice = s.part >= 3 || s.id >= 23;
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || "KHUNG BÀI GIẢNG UTEHY")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || "")}</p>
        </div>

        <div class="arch-utehy-grid">
          <div class="arch-utehy-bars">
            ${bars.map((b, i) => `
              <div class="arch-utehy-pill" data-morph="morph-card-${i + 1}">
                <div class="arch-utehy-code">${esc(b.code)}</div>
                <div class="arch-utehy-text">
                  <div class="arch-utehy-name">${esc(b.label || b.text)}</div>
                  <div class="arch-utehy-sub">${esc(showPractice ? (b.practice || b.theory) : (b.theory || b.sub || b.practice))}</div>
                </div>
                ${renderInlineThumb(photos[i % photos.length], "arch-utehy-thumb")}
              </div>
            `).join("")}
          </div>

          <div class="arch-hero-right">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Khung bài giảng UTEHY · Ánh xạ thực tiễn Phạm Nhật Vượng</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 5. ARCHETYPE: 3 TALL VERTICAL PHOTO PILLARS
  function renderArchThreePillars(s, idx, total, photos, cols) {
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.section || "3 TRỤ CỘT")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || s.subtitle || "")}</p>
        </div>

        <div class="arch-pillars-grid">
          ${cols.slice(0, 3).map((col, i) => {
            const p = photos[i % photos.length];
            return `
              <div class="arch-pillar-col" data-morph="morph-card-${i + 1}">
                <div class="arch-pillar-photo js-zoom-trigger"
                     data-morph="morph-photo-${i + 1}"
                     data-src="${esc(p.src)}"
                     data-title="${esc(col.title || p.tag)}"
                     data-caption="${esc(p.cap)}">
                  <img src="${esc(p.src)}" alt="${esc(col.title)}" onerror="this.src='assets/pnv_portrait.jpg'" />
                  <div class="m-photo-cap">
                    <span class="m-photo-tag">${esc(col.tag || col.num || p.tag)}</span>
                  </div>
                </div>
                <div class="arch-pillar-body">
                  <div class="arch-pillar-head">
                    <div class="m-hex-badge">${esc((col.num && String(col.num).length <= 3) ? col.num : ("0" + (i + 1)))}</div>
                    <div class="arch-pillar-title">${esc(col.title)}</div>
                  </div>
                  ${col.subtitle ? `<div class="m-card-body" style="color:#FEF08A;font-weight:800;">${esc(col.subtitle)}</div>` : ""}
                  <ul class="arch-pillar-list">
                    ${(col.items || []).slice(0, 4).map((li) => `<li>${esc(li)}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <footer class="fs-footer">
          <span>Phạm Nhật Vượng &amp; Hệ sinh thái Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 6. ARCHETYPE: DUAL VERSUS SYMMETRY (Left Card with Banner + Center Photo Bridge + Right Card with Banner)
  function renderArchDualVersus(s, idx, total, photos) {
    const left = s.leftCol || { title: "Giai đoạn Khởi đầu", badge: "NỀN TẢNG", items: [] };
    const right = s.rightCol || { title: "Bước ngoặt Bứt phá", badge: "VƯƠN TẦM", items: [] };
    const renderItem = (it) => {
      if (it && typeof it === "object") {
        return `<li><strong>${esc(it.bold)}:</strong> ${esc(it.text)}</li>`;
      }
      return `<li>${esc(it)}</li>`;
    };

    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || "ĐỐI CHIẾU HAI CHIỀU")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block center">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || "")}</p>
        </div>

        <div class="arch-versus-grid">
          <div class="arch-versus-col" data-morph="morph-card-1">
            ${renderInlineThumb(photos[2 % photos.length], "arch-col-banner")}
            <div class="fs-pill-badge" style="align-self:flex-start;">${esc(left.badge || "CHIỀU 01")}</div>
            <div class="m-card-title" style="font-size:21px;">${esc(left.title)}</div>
            <ul class="arch-pillar-list">
              ${(left.items || []).slice(0, 4).map(renderItem).join("")}
            </ul>
          </div>

          <div class="arch-versus-center">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
          </div>

          <div class="arch-versus-col" data-morph="morph-card-2">
            ${renderInlineThumb(photos[3 % photos.length], "arch-col-banner")}
            <div class="fs-pill-badge" style="align-self:flex-start;">${esc(right.badge || "CHIỀU 02")}</div>
            <div class="m-card-title" style="font-size:21px;">${esc(right.title)}</div>
            <ul class="arch-pillar-list">
              ${(right.items || []).slice(0, 4).map(renderItem).join("")}
            </ul>
          </div>
        </div>

        <footer class="fs-footer">
          <span>Phạm Nhật Vượng &amp; Hệ sinh thái Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 7. ARCHETYPE: HONEYCOMB HEXAGON PHOTO CLUSTER + STORY STACK WITH THUMBS
  function renderArchHoneycombStory(s, idx, total, photos, items) {
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.pillLabel || s.kicker || s.section || "CHUYÊN SÂU")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || s.subtitle || "")}</p>
        </div>

        <div class="arch-honeycomb-grid">
          <div class="arch-hex-cluster">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "hex-frame")}
            ${renderPhotoBox(photos[2], "morph-photo-3", "hex-frame")}
          </div>

          <div class="arch-story-stack">
            ${items.slice(0, 4).map((it, i) => {
              const rawBadge = it.badge ? String(it.badge).trim() : "";
              const hexText = rawBadge && rawBadge.length <= 4 ? rawBadge : ("0" + (i + 1));
              const eyebrow = rawBadge.length > 4 ? rawBadge : "";
              return `
                <div class="arch-story-row" data-morph="morph-card-${i + 1}">
                  <div class="m-hex-badge">${esc(hexText)}</div>
                  <div style="flex:1;min-width:0;">
                    ${eyebrow ? `<div class="m-card-eyebrow">${esc(eyebrow)}</div>` : ""}
                    <div class="m-card-title">${esc(it.title)}</div>
                    ${renderCardBodyContent(it)}
                  </div>
                  ${renderInlineThumb(photos[(i + 1) % photos.length])}
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Phạm Nhật Vượng &amp; Hệ sinh thái Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 8. ARCHETYPE: HORIZONTAL ASCENDING TIMELINE / STAIRCASE
  function renderArchTimeline(s, idx, total, photos, steps) {
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.section || "TIẾN TRÌNH")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || s.subtitle || "")}</p>
        </div>

        <div class="arch-timeline-layout">
          <div class="arch-timeline-row">
            ${steps.slice(0, 5).map((st, i) => `
              <div class="arch-step-card" data-morph="morph-card-${i + 1}">
                <span class="arch-step-year">${esc(st.year || st.badge || ("MỐC " + (i + 1)))}</span>
                <div class="m-card-title">${esc(st.title)}</div>
                <div class="m-card-body">${esc(st.body)}</div>
              </div>
            `).join("")}
          </div>

          <div class="arch-timeline-photos">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
            ${renderPhotoBox(photos[2], "morph-photo-3", "")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Hành trình Tỷ phú Phạm Nhật Vượng (1993 – 2026)</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 9. ARCHETYPE: GIANT CENTER QUOTE SHOWCASE (“ ”) + 3 PHOTO-BACKED PROOF CARDS
  function renderArchQuoteSpotlight(s, idx, total, photos) {
    const pts = s.points || [];
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.pillLabel || "PHÁT NGÔN & TẦM NHÌN")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          ${s.lead ? `<p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead)}</p>` : ""}
        </div>

        <div class="arch-quote-layout">
          <div class="arch-quote-top">
            <div class="arch-quote-banner" data-morph="morph-quote">
              <div class="arch-quote-text">${esc(s.quote || s.lead)}</div>
              <div class="arch-quote-author">— ${esc(s.quoteAuthor || "Chủ tịch Phạm Nhật Vượng")}</div>
            </div>
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
          </div>

          <div class="arch-quote-bottom">
            ${pts.slice(0, 3).map((pt, i) => `
              <div class="m-card m-card-flex" data-morph="morph-card-${i + 1}">
                ${renderInlineThumb(photos[(i + 1) % photos.length])}
                <div>
                  <div class="m-card-title">${esc(pt.title)}</div>
                  <div class="m-card-body">${esc(pt.desc || pt.text || "")}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Triết lý hành động · Chủ tịch Phạm Nhật Vượng</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 10. ARCHETYPE: ENTERPRISE SHOWROOM (KPI Counters + Details/Bar Chart + Right Photos)
  function renderArchEnterpriseShowroom(s, idx, total, photos) {
    const kpis = (s.kpis && s.kpis.length)
      ? s.kpis.map((k) => ({
          val: k.val || k.num,
          label: k.label || [k.unit, k.delta].filter(Boolean).join(" · ")
        }))
      : (s.heroMetric ? [
          { val: s.heroMetric.val, label: s.heroMetric.sub || s.heroMetric.label },
          { val: "2006–2026", label: "20 năm khắp 63 tỉnh thành" },
          { val: "5 Trụ cột", label: "Sinh kế · Giáo dục · Y tế · Tri ân · Thiên tai" }
        ] : []);

    const details = s.details || s.programs || [];
    const barsData = s.barsData || null;

    let leftBodyHTML = "";
    if (barsData && barsData.length) {
      leftBodyHTML = `
        <div class="arch-chart-stack">
          ${barsData.map((b, i) => {
            const hasPair = typeof b.v2024 === "number" && typeof b.v2025 === "number";
            const fmt = (n) => Number(n).toLocaleString("vi-VN");
            const valLabel = hasPair
              ? `2024: ${fmt(b.v2024)} → 2025: ${fmt(b.v2025)}${b.unit || ""}`
              : (b.val || "");
            const pct = hasPair && b.max
              ? Math.min(100, Math.round((b.v2025 / b.max) * 100))
              : Math.min(100, Number(b.pct) || 50);
            return `
              <div class="arch-chart-row" data-morph="morph-card-${i + 1}">
                <div class="arch-chart-head">
                  <span>${esc(b.label)}</span>
                  <span>${esc(valLabel)}</span>
                </div>
                <div class="arch-chart-track">
                  <div class="arch-chart-fill" style="width:${pct}%"></div>
                </div>
              </div>
            `;
          }).join("")}
          ${s.note ? `<div class="m-card-body" style="color:#FEF08A;padding:4px 6px;">★ ${esc(s.note)}</div>` : ""}
        </div>
      `;
    } else {
      leftBodyHTML = `
        <div class="arch-story-stack">
          ${details.slice(0, 4).map((d, i) => `
            <div class="arch-story-row" data-morph="morph-card-${i + 1}">
              <div class="m-hex-badge">0${i + 1}</div>
              <div style="flex:1;">
                <div class="m-card-title">${esc(d.heading || d.title || d.bold)}</div>
                <div class="m-card-body">${esc(d.text || d.desc)}</div>
              </div>
              ${renderInlineThumb(photos[(i + 2) % photos.length])}
            </div>
          `).join("")}
        </div>
      `;
    }

    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || s.section || "DOANH NGHIỆP")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || "")}</p>
        </div>

        <div class="arch-showroom-layout">
          ${kpis.length ? `
            <div class="arch-kpi-strip" data-morph="morph-stats">
              ${kpis.slice(0, 3).map((k, i) => `
                <div class="arch-kpi-card" data-morph="morph-stat-${i + 1}">
                  <div class="arch-kpi-num">${esc(k.val)}</div>
                  <div class="arch-kpi-desc">${esc(k.label)}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          <div class="arch-showroom-body">
            ${leftBodyHTML}
            <div class="arch-showroom-photos">
              ${renderPhotoBox(photos[0], "morph-photo-1", "")}
              ${renderPhotoBox(photos[1], "morph-photo-2", "")}
            </div>
          </div>
        </div>

        <footer class="fs-footer">
          <span>Hệ sinh thái Doanh nghiệp Vingroup</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 11. ARCHETYPE: MATRIX COMPARISON ROWS + SIDE PHOTO TOWER
  function renderArchMatrix(s, idx, total, photos) {
    const rows = s.rows || [];
    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">★ ${esc(s.kicker || "MA TRẬN ĐỐI CHIẾU")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || "")}</p>
        </div>

        <div class="arch-matrix-layout">
          <div class="arch-matrix-rows">
            ${rows.slice(0, 5).map((r, i) => `
              <div class="arch-story-row" data-morph="morph-card-${i + 1}">
                <div class="m-hex-badge">0${i + 1}</div>
                <div style="flex:1;">
                  <div class="m-card-title">${esc(r[0])} → ${esc(r[1])}</div>
                  <div class="m-card-body">${esc(r[2] || "")} ${r[3] ? (" · " + esc(r[3])) : ""}</div>
                </div>
                ${renderInlineThumb(photos[(i + 1) % photos.length])}
              </div>
            `).join("")}
          </div>

          <div class="arch-hero-right">
            ${renderPhotoBox(photos[0], "morph-photo-1", "")}
            ${renderPhotoBox(photos[1], "morph-photo-2", "")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Bảng đối chiếu thực chứng · Phạm Nhật Vượng</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // 12. ARCHETYPE: VIDEO DOCUMENTARY THEATER (Full 09:57 MP4 Player + YouTube Link!)
  function renderArchVideo(s, idx, total, photos) {
    const mp4Src = s.localVideo || "assets/vid03.mp4";
    const posterSrc = s.thumb || photos[0].src;
    const ytUrl = s.videoUrl || ("https://www.youtube.com/watch?v=" + (s.videoId || ""));
    const takeaways = s.takeaways || [];

    return `
      <div class="fs-slide">
        <header class="fs-topbar">
          <div class="fs-pill-badge" data-morph="morph-badge">▶ ${esc(s.kicker || "VIDEO TƯ LIỆU")}</div>
          <div class="fs-pill-sub" data-morph="morph-subbadge">SLIDE ${pad2(idx + 1)} / ${pad2(total)} · ${esc(s.duration || "HD")}</div>
        </header>

        <div class="fs-header-block">
          <h1 class="fs-title" data-morph="morph-title">${esc(s.title)}</h1>
          <p class="fs-lead" data-morph="morph-subtitle">${esc(s.lead || "")}</p>
        </div>

        <div class="arch-video-layout">
          <div class="arch-video-stage">
            <div class="arch-video-player" data-morph="morph-photo-1">
              <video controls playsinline preload="metadata" poster="${esc(posterSrc)}">
                <source src="${esc(mp4Src)}" type="video/mp4" />
                Trình duyệt không hỗ trợ phát video.
              </video>
            </div>
            <div class="arch-video-toolbar">
              <span>🎬 Nguồn: <strong>${esc(s.channel || "Tư liệu")}</strong></span>
              <a class="arch-video-btn" href="${esc(ytUrl)}" target="_blank" rel="noopener noreferrer">Mở YouTube ↗</a>
            </div>
          </div>

          <div class="arch-story-stack">
            ${takeaways.slice(0, 3).map((t, i) => `
              <div class="arch-story-row" data-morph="morph-card-${i + 1}">
                <div class="m-hex-badge">0${i + 1}</div>
                <div class="m-card-body" style="font-size:17px;flex:1;">${esc(t)}</div>
              </div>
            `).join("")}
            ${renderPhotoBox(photos[1] || photos[0], "morph-photo-2", "")}
          </div>
        </div>

        <footer class="fs-footer">
          <span>Video tư liệu MP4 phát trực tiếp</span>
          <span>Slide ${pad2(idx + 1)} / ${pad2(total)}</span>
        </footer>
      </div>
    `;
  }

  // =========================================================================
  // MASTER ROUTER: MAPS EACH OF THE 45 SLIDES TO ITS DISTINCT ARCHETYPE
  // =========================================================================
  function renderSlideMaster(s, idx, total) {
    const photos = getPhotosForSlide(s);
    const lay = s.layout || "";

    if (lay === "cover_hero" || lay === "final_lessons_utehy") {
      return renderArchHeroPoster(s, idx, total, photos);
    }
    if (lay === "utehy_slide_replica") {
      return renderArchUtehyReplica(s, idx, total, photos);
    }
    if (lay === "video_slide") {
      return renderArchVideo(s, idx, total, photos);
    }
    if (lay === "split_comparison") {
      return renderArchDualVersus(s, idx, total, photos);
    }
    if (lay === "quote_analysis") {
      return renderArchQuoteSpotlight(s, idx, total, photos);
    }
    if (lay === "matrix_table") {
      return renderArchMatrix(s, idx, total, photos);
    }
    if (lay === "enterprise_deep_dive" || lay === "chart_bars_kpi" || lay === "charity_showcase") {
      if (s.id === 18) {
        const items18 = (s.details || []).map((d, i) => ({
          badge: s.kpis && s.kpis[i] ? (s.kpis[i].val || s.kpis[i].num) : ("0" + (i + 1)),
          title: d.heading || d.title || d.bold,
          body: d.text || d.desc
        }));
        return renderArchRadialHub(s, idx, total, photos, items18);
      }
      if (s.id === 36) {
        const items36 = (s.details || []).map((d, i) => ({
          badge: s.kpis && s.kpis[i] ? (s.kpis[i].val || s.kpis[i].num) : ("0" + (i + 1)),
          title: d.heading || d.title || d.bold,
          body: d.text || d.desc
        }));
        return renderArchPanoramicBento(s, idx, total, photos, items36);
      }
      return renderArchEnterpriseShowroom(s, idx, total, photos);
    }
    if (lay === "three_columns" || lay === "ecosystem_architecture") {
      const cols = (s.columns || s.pillars || []).map((c, i) => ({
        num: c.num || c.code || ("0" + (i + 1)),
        tag: c.num && String(c.num).length > 3 ? `${c.num} · ${c.tag || ""}`.replace(/ · $/, "") : (c.tag || c.code || ""),
        title: c.title || c.name,
        subtitle: c.subtitle || "",
        items: c.items || c.entities || (Array.isArray(c.brands) ? [...c.brands, c.desc].filter(Boolean) : (c.desc ? [c.desc] : []))
      }));
      return renderArchThreePillars(s, idx, total, photos, cols);
    }
    if (lay === "chapter_cover" || lay === "forbes_trajectory" || lay === "staircase_decisions") {
      const steps = (s.milestones || s.steps || []).map((m) => ({
        year: m.year || m.step || m.val,
        title: m.event || m.name || m.title || m.label || m.val,
        body: m.desc || m.sub || m.rank || m.context || [m.risk, m.outcome].filter(Boolean).join(" · ") || (m.action ? (m.action + " → " + (m.outcome || "")) : "")
      }));
      return renderArchTimeline(s, idx, total, photos, steps);
    }
    if (lay === "agenda_grid" || lay === "five_factors_diagram" || lay === "pillar_section_intro") {
      const items = (s.chapters || s.factors || s.components || []).map((c) => ({
        badge: c.num || c.code || "",
        title: c.title || c.name,
        body: c.desc || (c.theory ? (c.theory + " · " + (c.pnv || "")) : "")
      }));
      if (items.length >= 5) {
        return renderArchPanoramicBento(s, idx, total, photos, items);
      }
      if (idx % 2 === 1) {
        return renderArchRadialHub(s, idx, total, photos, items);
      }
      return renderArchHoneycombStory(s, idx, total, photos, items);
    }
    if (lay === "bio_overview" || lay === "six_core_values" || lay === "two_cards_image") {
      const items = (s.facts || s.values || s.cards || []).map((f) => ({
        badge: f.code || f.sub || f.tag || f.label || "",
        title: f.val || f.word || f.name || f.title,
        points: Array.isArray(f.points) ? f.points : null,
        body: f.detail || f.desc || (Array.isArray(f.bullets) ? f.bullets.join(" · ") : "")
      }));
      if (s.id === 8) {
        return renderArchHoneycombStory(s, idx, total, photos, items);
      }
      return renderArchPanoramicBento(s, idx, total, photos, items);
    }
    if (lay === "photo_story") {
      const items = (s.bullets || []).map((b, i) => ({
        badge: "0" + (i + 1),
        title: b.heading || b.bold,
        body: b.text
      }));
      if (idx % 2 === 0) {
        return renderArchHoneycombStory(s, idx, total, photos, items);
      }
      return renderArchRadialHub(s, idx, total, photos, items);
    }

    return renderArchHeroPoster(s, idx, total, photos);
  }

  // =========================================================================
  // STATE & DOM REFERENCES (Default = Full 45 Slides!)
  // =========================================================================
  let activeDeck = RAW_SLIDES.slice();
  let currentIndex = 0;
  let isTransitioning = false;
  let autoplayTimer = null;

  const stageViewport = document.getElementById("stage-viewport");
  const slideStage = document.getElementById("slide-stage");
  const slideActive = document.getElementById("slide-active");
  const slideOutgoing = document.getElementById("slide-outgoing");
  const progressFill = document.getElementById("stage-progress-fill");

  const pGlow = document.getElementById("p-glow");
  const pRings = document.getElementById("p-rings");
  const pSilhouette = document.getElementById("p-silhouette");
  const pSilkTop = document.getElementById("p-silk-top");
  const pSilkBottom = document.getElementById("p-silk-bottom");
  const pFlashBeam = document.getElementById("p-flash-beam");

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const btnToc = document.getElementById("btn-toc");
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const btnAutoplay = document.getElementById("btn-autoplay");
  const autoplayLabel = document.getElementById("autoplay-label");
  const selDeckMode = document.getElementById("sel-deck-mode");
  const slideCounter = document.getElementById("slide-counter");
  const slideScrubber = document.getElementById("slide-scrubber");
  const sectionIndicator = document.getElementById("section-indicator");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  const tocModal = document.getElementById("toc-modal");
  const tocClose = document.getElementById("toc-close");
  const tocGrid = document.getElementById("toc-grid");
  const tocFilters = document.getElementById("toc-filters");

  function fitStageToViewport() {
    if (!stageViewport || !slideStage) return;
    const rect = stageViewport.getBoundingClientRect();
    const availW = Math.max(300, rect.width - 4);
    const availH = Math.max(180, rect.height - 4);
    const scale = Math.min(availW / 1280, availH / 720);
    slideStage.style.transform = `scale(${scale.toFixed(4)})`;
  }

  window.addEventListener("resize", fitStageToViewport);

  function updateBackgroundStage(idx, triggerBeam) {
    const angle = idx * 42;
    const gx = Math.cos(idx * 1.1) * 240;
    const gy = Math.sin(idx * 0.9) * 65;

    if (pGlow) {
      pGlow.style.transform = `translate3d(${gx.toFixed(0)}px, ${gy.toFixed(0)}px, 0) scale(${1.05 + (idx % 3) * 0.1})`;
    }
    if (pRings) {
      pRings.style.transform = `translate3d(${(-gx * 0.8).toFixed(0)}px, ${(gy * 0.6).toFixed(0)}px, 0) rotate(${angle}deg) scale(${0.92 + (idx % 4) * 0.08})`;
    }
    if (pSilhouette) {
      pSilhouette.style.transform = `translate3d(${((idx % 5) - 2) * 20}px, ${((idx % 3) - 1) * 10}px, 0) scale(${1.02 + (idx % 3) * 0.025})`;
    }
    if (pSilkTop) {
      pSilkTop.style.transform = `translate3d(${((idx % 4) - 2) * 18}px, ${((idx % 3) - 1) * 10}px, 0) rotate(${((idx % 3) - 1) * 2.5}deg)`;
    }
    if (pSilkBottom) {
      pSilkBottom.style.transform = `translate3d(${((idx % 4) - 2) * -18}px, ${((idx % 3) - 1) * -10}px, 0) rotate(${((idx % 3) - 1) * -2.5}deg)`;
    }
    if (triggerBeam && pFlashBeam) {
      pFlashBeam.classList.remove("sweeping");
      void pFlashBeam.offsetWidth;
      pFlashBeam.classList.add("sweeping");
    }
  }

  function runFlipMorph(outLayer, inLayer) {
    if (!outLayer || !inLayer || !slideStage) return;

    const stageRect = slideStage.getBoundingClientRect();
    const scale = stageRect.width / 1280 || 1;

    const outMap = new Map();
    outLayer.querySelectorAll("[data-morph]").forEach((el) => {
      const key = el.getAttribute("data-morph");
      if (key) outMap.set(key, el.getBoundingClientRect());
    });

    inLayer.querySelectorAll("[data-morph]").forEach((el) => {
      const key = el.getAttribute("data-morph");
      if (!key || !outMap.has(key)) return;

      const first = outMap.get(key);
      const last = el.getBoundingClientRect();

      const dx = (first.left - last.left) / scale;
      const dy = (first.top - last.top) / scale;
      const sw = Math.max(0.35, Math.min(2.2, first.width / Math.max(1, last.width)));
      const sh = Math.max(0.35, Math.min(2.2, first.height / Math.max(1, last.height)));

      if (Math.abs(dx) < 3 && Math.abs(dy) < 3 && Math.abs(sw - 1) < 0.04) return;

      const isPhoto = key.startsWith("morph-photo");
      const rotZ = isPhoto ? ((dx > 0 ? 6 : -6)) : 0;

      el.animate(
        [
          {
            transformOrigin: "top left",
            transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, ${isPhoto ? 90 : 40}px) scale(${sw.toFixed(3)}, ${sh.toFixed(3)}) rotateZ(${rotZ}deg)`,
            filter: isPhoto ? "brightness(1.22) drop-shadow(0 20px 35px rgba(250,204,21,0.55))" : "brightness(1.18)"
          },
          {
            transformOrigin: "top left",
            transform: "translate3d(0, 0, 0) scale(1, 1) rotateZ(0deg)",
            filter: "brightness(1)"
          }
        ],
        {
          duration: 900,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "none"
        }
      );
    });
  }

  function clearCamClasses() {
    for (let i = 0; i < 10; i++) {
      slideOutgoing.classList.remove(`cam-out-${i}`);
      slideActive.classList.remove(`cam-in-${i}`);
    }
  }

  function goToSlide(targetIdx, immediate) {
    const total = activeDeck.length;
    if (!total) return;

    let nextIdx = targetIdx;
    if (nextIdx >= total) nextIdx = 0;
    if (nextIdx < 0) nextIdx = total - 1;

    if (!immediate && (nextIdx === currentIndex || isTransitioning)) return;

    // Pause any playing video before leaving slide
    slideActive.querySelectorAll("video").forEach((v) => {
      try { v.pause(); } catch (_) {}
    });

    const slide = activeDeck[nextIdx];
    const html = renderSlideMaster(slide, nextIdx, total);

    if (immediate) {
      currentIndex = nextIdx;
      slideActive.innerHTML = html;
      slideOutgoing.innerHTML = "";
      updateBackgroundStage(nextIdx, false);
      updateControlsUI();
      bindSlideInteractions(slideActive);
      return;
    }

    isTransitioning = true;
    currentIndex = nextIdx;

    clearCamClasses();
    slideOutgoing.innerHTML = slideActive.innerHTML;
    slideActive.innerHTML = html;

    // Measure FLIP start/end positions cleanly BEFORE 3D camera keyframes offset the layer!
    runFlipMorph(slideOutgoing, slideActive);

    const camMode = nextIdx % 10;
    slideOutgoing.classList.add(`cam-out-${camMode}`);
    slideActive.classList.add(`cam-in-${camMode}`);

    updateBackgroundStage(nextIdx, true);

    updateControlsUI();
    bindSlideInteractions(slideActive);

    setTimeout(() => {
      slideOutgoing.innerHTML = "";
      clearCamClasses();
      isTransitioning = false;
    }, 930);
  }

  function updateControlsUI() {
    const total = activeDeck.length;
    const slide = activeDeck[currentIndex];
    if (slideCounter) slideCounter.textContent = `${pad2(currentIndex + 1)} / ${pad2(total)}`;
    if (slideScrubber) {
      slideScrubber.max = String(total);
      slideScrubber.value = String(currentIndex + 1);
    }
    if (sectionIndicator && slide) {
      sectionIndicator.textContent = slide.section || `Slide ${pad2(currentIndex + 1)} / ${pad2(total)}`;
    }
    if (progressFill) {
      const pct = ((currentIndex + 1) / total) * 100;
      progressFill.style.width = `${pct.toFixed(1)}%`;
    }
  }

  function openLightbox(src, title, caption) {
    if (!lightbox || !src) return;
    lightboxImg.src = src;
    lightboxImg.alt = title || "Phạm Nhật Vượng & Hệ sinh thái Vingroup";
    lightboxTitle.textContent = title || "Phạm Nhật Vượng & Hệ sinh thái Vingroup";
    lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
  }

  function bindSlideInteractions(container) {
    if (!container) return;
    container.querySelectorAll(".js-zoom-trigger").forEach((el) => {
      el.addEventListener("click", () => {
        openLightbox(
          el.getAttribute("data-src"),
          el.getAttribute("data-title"),
          el.getAttribute("data-caption")
        );
      });
    });
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function setDeckMode(mode) {
    if (mode === "tiktok14") {
      activeDeck = RAW_SLIDES.filter((s) => TIKTOK_14_IDS.includes(s.id));
    } else {
      activeDeck = RAW_SLIDES.slice();
    }
    goToSlide(0, true);
    renderTocGrid("all");
  }

  if (selDeckMode) {
    selDeckMode.addEventListener("change", (e) => {
      setDeckMode(e.target.value);
    });
  }

  function toggleAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      if (autoplayLabel) autoplayLabel.textContent = "▶ Tự chạy (4.5s)";
    } else {
      if (autoplayLabel) autoplayLabel.textContent = "⏸ Đang chạy...";
      autoplayTimer = setInterval(() => {
        goToSlide(currentIndex + 1, false);
      }, 4500);
    }
  }

  if (btnAutoplay) btnAutoplay.addEventListener("click", toggleAutoplay);
  if (btnPrev) btnPrev.addEventListener("click", () => goToSlide(currentIndex - 1, false));
  if (btnNext) btnNext.addEventListener("click", () => goToSlide(currentIndex + 1, false));

  if (slideScrubber) {
    slideScrubber.addEventListener("input", (e) => {
      const idx = parseInt(e.target.value, 10) - 1;
      goToSlide(idx, false);
    });
  }

  function renderTocGrid(filterPart) {
    if (!tocGrid) return;
    const items = activeDeck.filter((s) => {
      if (filterPart === "all") return true;
      if (filterPart === "video") return s.layout === "video_slide";
      return String(s.part) === String(filterPart);
    });

    tocGrid.innerHTML = items.map((s) => {
      const realIdx = activeDeck.indexOf(s);
      const isAct = realIdx === currentIndex ? "active" : "";
      const isVid = s.layout === "video_slide" ? "🎬 " : "";
      return `
        <button type="button" class="toc-item ${isAct}" data-idx="${realIdx}">
          <div class="toc-item-num">SLIDE ${pad2(realIdx + 1)} · ${esc(s.section || "")}</div>
          <div class="toc-item-title">${isVid}${esc(s.title)}</div>
        </button>
      `;
    }).join("");

    tocGrid.querySelectorAll(".toc-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        tocModal.hidden = true;
        goToSlide(idx, false);
      });
    });
  }

  if (btnToc) {
    btnToc.addEventListener("click", () => {
      renderTocGrid("all");
      tocModal.hidden = false;
    });
  }
  if (tocClose) tocClose.addEventListener("click", () => { tocModal.hidden = true; });
  if (tocModal) {
    tocModal.addEventListener("click", (e) => {
      if (e.target === tocModal) tocModal.hidden = true;
    });
  }
  if (tocFilters) {
    tocFilters.querySelectorAll(".toc-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        tocFilters.querySelectorAll(".toc-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        renderTocGrid(chip.getAttribute("data-part"));
      });
    });
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!lightbox.hidden) {
      if (e.key === "Escape") closeLightbox();
      return;
    }
    if (!tocModal.hidden) {
      if (e.key === "Escape") tocModal.hidden = true;
      return;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      goToSlide(currentIndex + 1, false);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      goToSlide(currentIndex - 1, false);
    } else if (e.key === "g" || e.key === "G") {
      e.preventDefault();
      renderTocGrid("all");
      tocModal.hidden = !tocModal.hidden;
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      btnFullscreen.click();
    }
  });

  fitStageToViewport();
  setDeckMode("full45");
})();
