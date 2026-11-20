/* ==========================================================================
   Вкладка «Карусели»: обложки и карточки Instagram 1080×1340 одной серией.
   Макеты: Figma «Banners», раздел «2026» (обложки и карточки).
   Подключается после основного скрипта редактора и регистрируется через window.YTB.
   ========================================================================== */
(function () {
  var Y = window.YTB; if (!Y) return;
  var ic = Y.ic, esc = Y.esc, typo = Y.typo, toast = Y.toast, normHex = Y.normHex;
  var W = 1080, H = 1340, KEY = 'ytb-editor-carousel-v1';
  function v(id) { return document.getElementById(id); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function r3(n) { return Math.round(n * 1000) / 1000; }
  function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- темы (цвета из макета) ---------- */
  var THEMES = {
    green: { name: 'Зелёная', bg: { a: 246.267, s: [['#ecffb8', .11137], ['#f4f5ab', .77502], ['#ffffff', 1.221]] },
      title: '#465909', sub: '#597209', text: '#475b08', accent: '#465909', ov: '#465909', ovEnd: .8654,
      ink: ['#ecffb8', '#f4f5ab', '#ffffff'], pol: [-2, 1, 28, 'rgba(153,153,169,.3)'] },
    yellow: { name: 'Жёлтая', bg: { a: 102.49, s: [['#ffee92', .10021], ['#ffe6c1', .97888]] },
      title: '#775017', sub: '#775017', text: '#775017', accent: '#775017', ov: '#775017', ovEnd: .8654,
      ink: ['#ffee92', '#ffe6c1', '#ffffff'], pol: [-2, 1, 28, 'rgba(153,153,169,.3)'] },
    winter: { name: 'Зимняя', bg: { a: 180, s: [['#ffffff', 0], ['#ffffff', 1]] },
      title: '#6197d4', sub: '#6197d4', text: '#6197d4', accent: '#6197d4', ov: '#45617d', ovEnd: .94872,
      ink: ['#cee6f8'], pol: [.8, 4, 12, 'rgba(0,0,0,.2)'] }
  };
  var INK_ANGLE = 205.17;
  var COLOR_ROWS = [['bg1', 'Фон карточки · начало'], ['bg2', 'Фон карточки · конец'], ['title', 'Заголовок'], ['sub', 'Подзаголовок'], ['text', 'Текст'], ['accent', 'Стрелки на карточках'], ['ink', 'Текст на фото'], ['ov', 'Затемнение фото']];

  /* ---------- раскладки ---------- */
  var TYPES = {
    coverA: { name: 'Обложка · крупный заголовок', short: 'Обложка А', slots: 0, bgPhoto: true, ts: 312, tsMin: 140, tsMax: 360 },
    coverB: { name: 'Обложка · заголовок и текст', short: 'Обложка Б', slots: 0, bgPhoto: true, ts: 160, tsMin: 80, tsMax: 200 },
    cardC: { name: 'Карточка · два фото', short: 'Карточка 2 фото', slots: 2, ts: 150, tsMin: 70, tsMax: 180 },
    cardD: { name: 'Карточка · одно фото', short: 'Карточка 1 фото', slots: 1, ts: 150, tsMin: 70, tsMax: 180 }
  };
  // полароиды: центр, размер, поворот, рамки (верх, право, низ, лево); z — порядок наложения
  var POL = {
    cardC: [{ cx: 303.68, cy: 421.99, w: 485.73, h: 519.98, r: -2.66, b: [22, 22, 22, 22], rad: 5, z: 2 },
            { cx: 769.16, cy: 497.4, w: 453.08, h: 485.03, r: 9.13, b: [22, 22, 22, 22], rad: 5, z: 1 }],
    cardD: [{ cx: 540.3, cy: 936.42, w: 738.4, h: 790.46, r: 4.07, b: [33.53, 33.53, 117.71, 33.53], rad: 7.62, z: 1 }]
  };
  var ARROW_D = 'M31.5 36.5459C30.6716 36.5459 30 37.2175 30 38.0459C30 38.8744 30.6716 39.5459 31.5 39.5459V38.0459V36.5459ZM31.5 38.0459V39.5459H470.5V38.0459V36.5459H31.5V38.0459ZM471.561 39.1066C472.146 38.5208 472.146 37.5711 471.561 36.9853L462.015 27.4393C461.429 26.8536 460.479 26.8536 459.893 27.4393C459.308 28.0251 459.308 28.9749 459.893 29.5607L468.379 38.0459L459.893 46.5312C459.308 47.117 459.308 48.0668 459.893 48.6525C460.479 49.2383 461.429 49.2383 462.015 48.6525L471.561 39.1066Z';
  var TRI_D = 'M48.7013 0L68.2842 83.9327L36.1283 71.5816H0L48.7013 0Z';
  var ARROW_POS = { x: 73.5, y: 1238.95 };          // точка (30, 27) viewBox: линия на y=1250, начало на x=75
  var TRI_POS = { cardD: { cx: 968.44, cy: 1227.77 }, def: { cx: 955.44, cy: 1232.77 } };
  // облачко: 4 круга r 69.5 + хвостик (координаты группы 284×215 из макета)
  var CLOUD_C = [[75.5, 93.5], [156.5, 69.5], [214.5, 115.5], [120.5, 139.5]];
  var CLOUD_TAIL = 'M44 150L92 176L4 212Z';

  /* ---------- стикеры (вырезаны из макета, PNG с прозрачностью) ---------- */
  // стикеры стоят у края слайда, как в макете (вырезаны по видимой части)
  var STK = {
    baubleRed: { n: 'Красный шар', w: 130, ar: 130 / 232, x: 955, y: 116, r: 0 },
    baubleWhite: { n: 'Белый шар', w: 129, ar: 129 / 224, x: 949.5, y: 112, r: 0 },
    candy: { n: 'Леденец', w: 161, ar: 161 / 172, x: 999.5, y: 1080, r: 0 },
    ginger: { n: 'Пряник', w: 119, ar: 119 / 267, x: 59.5, y: 774.5, r: 0 },
    branch: { n: 'Еловая ветка со звездой', w: 272, ar: 272 / 234, x: 136, y: 117, r: 0 }
  };
  function stkUrl(k) { return k.indexOf('u:') === 0 ? (uStk[k.slice(2)] || {}).url : 'img/stickers/' + k + '.webp'; }
  function stkAr(k) { return k.indexOf('u:') === 0 ? (uStk[k.slice(2)] || { ar: 1 }).ar : STK[k].ar; }

  /* ---------- фото ---------- */
  var PH = { 'b:paraglider': { name: 'Параплан', url: 'img/bg-paraglider.jpg', ar: 1.5, builtin: true }, 'b:maldives': { name: 'Мальдивы', url: 'img/bg-maldives.jpg', ar: 1.5015, builtin: true } };
  var uStk = {};

  /* ---------- состояние ---------- */
  var TEXT = { title: 'Dorset', sub: 'Побережье пролива Ла-Манш.', text: 'Церемониальное неметропольное графство Англии, расположенное в юго-западной части страны на побережье пролива Ла-Манш.' };
  function ph(p) { return { p: p || 'b:paraglider', fx: .5, fy: .5, zoom: 1 }; }
  function newSlide(type, src) {
    var T = TYPES[type];
    var s = { id: uid(), type: type, title: TEXT.title, sub: TEXT.sub, text: TEXT.text, ts: T.ts,
      showSub: type !== 'coverA', showText: type !== 'coverA', showArrow: type !== 'cardD' && type !== 'coverA', showTri: type !== 'coverA',
      logo: true, cloud: { on: type === 'coverA', text: 'Ла-Манш', x: 538, y: 340 }, stickers: [], photos: [] };
    if (T.bgPhoto) s.photos = [ph(src || 'b:paraglider')];
    else for (var i = 0; i < T.slots; i++) s.photos.push(ph(i ? 'b:maldives' : (src || 'b:paraglider')));
    if (src) s.photos.forEach(function (x) { x.p = src; });
    var lib = visibleLib();
    s.photos.forEach(function (x, i) { if (lib.indexOf(x.p) < 0) x.p = lib[i % (lib.length || 1)] || ''; });
    return s;
  }
  // фото в библиотеке: встроенные можно скрыть, свои — удалить
  function visibleLib() { var hb = (typeof st === 'object' && st && st.hideB) || []; return Object.keys(PH).filter(function (id) { return hb.indexOf(id) < 0; }); }
  async function removePhoto(id) {
    if (PH[id] && PH[id].builtin) { st.hideB = (st.hideB || []).concat(id); }
    else { try { await Y.delBlob('igc:' + id); } catch (e) {} try { URL.revokeObjectURL(PH[id].url); } catch (e) {} delete PH[id]; st.photoLib = st.photoLib.filter(function (x) { return x.id !== id; }); }
    var lib = visibleLib(), n = 0;
    st.slides.forEach(function (s) { s.photos.forEach(function (p, i) { if (p.p === id) { p.p = lib[i % (lib.length || 1)] || ''; p.fx = .5; p.fy = .5; p.zoom = 1; n++; } }); });
    all(); toast(n ? 'Фото удалено. В слайдах, где оно стояло, подставлено другое.' : 'Фото удалено из библиотеки');
  }
  function defaults() {
    var a = newSlide('coverB'); a.photos[0].fx = .3;
    var b = newSlide('cardC'), c = newSlide('cardD', 'b:maldives');
    return { theme: 'green', colors: {}, grain: true, zoom: .3, sel: 0, photoLib: [], stkLib: [], hideB: [], slides: [a, b, c] };
  }
  var st = defaults();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  async function load() {
    var d = null; try { d = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!d || !Array.isArray(d.slides)) return;
    st = Object.assign(defaults(), d);
    var lib = [];
    for (var i = 0; i < (d.photoLib || []).length; i++) {
      var x = d.photoLib[i], b = await Y.getBlob('igc:' + x.id);
      if (b) { PH[x.id] = { name: x.name, url: URL.createObjectURL(b), ar: x.ar }; lib.push(x); }
    }
    st.photoLib = lib;
    var sl = [];
    for (var j = 0; j < (d.stkLib || []).length; j++) {
      var y = d.stkLib[j], b2 = await Y.getBlob('igcs:' + y.id);
      if (b2) { uStk[y.id] = { name: y.name, url: URL.createObjectURL(b2), ar: y.ar }; sl.push(y); }
    }
    st.stkLib = sl;
    st.slides.forEach(function (s) {
      s.photos.forEach(function (p) { if (p.p && !PH[p.p]) p.p = visibleLib()[0] || ''; });
      s.stickers = (s.stickers || []).filter(function (k) { return k.k.indexOf('u:') !== 0 || uStk[k.k.slice(2)]; });
    });
    if (st.sel >= st.slides.length) st.sel = Math.max(0, st.slides.length - 1);
  }

  /* ---------- тема с учётом своих цветов ---------- */
  function th() {
    var t = clone(THEMES[st.theme] || THEMES.green), c = st.colors || {};
    ['title', 'sub', 'text', 'accent', 'ov'].forEach(function (k) { if (normHex(c[k])) t[k] = c[k]; });
    if (normHex(c.ink)) t.ink = [c.ink];
    if (normHex(c.bg1) || normHex(c.bg2)) {
      var a = normHex(c.bg1) || t.bg.s[0][0], b = normHex(c.bg2) || normHex(c.bg1) || t.bg.s[t.bg.s.length - 1][0];
      t.bg = { a: t.bg.a, s: [[a, 0], [b, 1]] };
    }
    return t;
  }
  function tplColor(k) {
    var t = THEMES[st.theme];
    if (k === 'bg1') return t.bg.s[0][0];
    if (k === 'bg2') return t.bg.s[t.bg.s.length - 1][0];
    if (k === 'ink') return t.ink[0];
    return t[k];
  }
  function cssGrad(a, stops) { return 'linear-gradient(' + a + 'deg, ' + stops.map(function (x) { return x[0] + ' ' + r3(x[1] * 100) + '%'; }).join(', ') + ')'; }
  function themeStyle(t) {
    var g = t.ink.length > 1;
    return '--ig-bg:' + cssGrad(t.bg.a, t.bg.s) + ';--ig-title:' + t.title + ';--ig-sub:' + t.sub + ';--ig-text:' + t.text + ';--ig-accent:' + t.accent +
      ';--ig-ov:' + t.ov + ';--ig-ov-end:' + r3(t.ovEnd * 100) + '%;--ig-ink:' + t.ink[0] +
      (g ? ';--ig-ink-g:' + cssGrad(INK_ANGLE, t.ink.map(function (c, i) { return [c, [.11137, .77502, 1.221][i]]; })) : '') +
      ';--ig-pol-sh:' + t.pol[0] + 'px ' + t.pol[1] + 'px ' + t.pol[2] + 'px ' + t.pol[3];
  }

  /* ---------- зерно ---------- */
  var grainCanvas = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var x = c.getContext('2d'), d = x.createImageData(256, 256);
    for (var i = 0; i < d.data.length; i += 4) { var g = 128 + (Math.random() - .5) * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = g; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); return c;
  })();
  var grainUrl = grainCanvas.toDataURL('image/png');

  /* ---------- разметка слайда ---------- */
  function slotBox(s, i) {
    if (TYPES[s.type].bgPhoto) return { w: W, h: H };
    var g = POL[s.type][i]; return { w: g.w - g.b[1] - g.b[3], h: g.h - g.b[0] - g.b[2] };
  }
  function phHTML(s, i, cls, style) {
    var p = s.photos[i], P = PH[p.p], b = slotBox(s, i);
    return '<div class="igc__ph ' + cls + '" data-drag="ph:' + i + '" style="--w:' + r3(b.w) + ';--h:' + r3(b.h) + ';--ar:' + r3(P ? P.ar : 1.5) + ';--fx:' + r3(p.fx) + ';--fy:' + r3(p.fy) + ';--zoom:' + r3(p.zoom) + ';' + (style || '') + '">' +
      (P ? '<img src="' + esc(P.url) + '" alt="">' : '') + '</div>';
  }
  function lines(t) { return esc(typo(t)).split('|').join('<br>'); }
  function slideHTML(s, extra) {
    var t = th(), T = TYPES[s.type], o = [];
    o.push('<div class="igc" data-type="' + s.type + '" data-g="' + (t.ink.length > 1 ? 1 : 0) + '" style="' + themeStyle(t) + (extra || '') + '">');
    if (T.bgPhoto) { o.push(phHTML(s, 0, 'igc__ph--bg')); if (s.photos[0].dim) o.push('<div class="igc__dim" style="opacity:' + r3(s.photos[0].dim) + '"></div>'); }
    if (s.type === 'coverB') o.push('<div class="igc__ov"></div>');
    if (s.type === 'coverA') o.push('<div class="igc__bar"></div>');
    (POL[s.type] || []).map(function (g, i) { return [g, i]; }).sort(function (a, b) { return a[0].z - b[0].z; }).forEach(function (x) {
      var g = x[0], i = x[1];
      o.push('<div class="igc__pol" data-pol="' + i + '" style="left:' + r3(g.cx - g.w / 2) + 'px;top:' + r3(g.cy - g.h / 2) + 'px;width:' + g.w + 'px;height:' + g.h + 'px;border-radius:' + g.rad + 'px;transform:rotate(' + g.r + 'deg)">' +
        phHTML(s, i, '', 'left:' + g.b[3] + 'px;top:' + g.b[0] + 'px;width:' + r3(slotBox(s, i).w) + 'px;height:' + r3(slotBox(s, i).h) + 'px') + '</div>');
    });
    o.push('<div class="igc__txt igc__txt--' + (s.type === 'cardD' ? 'top' : 'bottom') + '">');
    if (s.title) o.push('<h2 class="igc__title" style="--ts:' + s.ts + '">' + lines(s.title) + '</h2>');
    if (s.type !== 'coverA') {
      if (s.showSub && s.sub) o.push('<p class="igc__sub">' + lines(s.sub) + '</p>');
      if (s.showText && s.text) o.push('<p class="igc__p">' + lines(s.text) + '</p>');
    }
    o.push('</div>');
    if (s.type !== 'coverA' && s.type !== 'cardD' && s.showArrow) o.push('<svg class="igc__arrow" viewBox="30 27 444 22" fill="currentColor" aria-hidden="true"><path d="' + ARROW_D + '"/></svg>');
    if (s.type !== 'coverA' && s.showTri) o.push('<svg class="igc__tri" viewBox="0 0 68.2842 83.9327" fill="currentColor" aria-hidden="true"><path d="' + TRI_D + '"/></svg>');
    if (s.type === 'coverA' && s.logo) o.push('<img class="igc__logo" src="img/logo-white.svg" alt="YouTravel.me">');
    if (s.type === 'coverA' && s.cloud.on) {
      o.push('<div class="igc__cloud" data-drag="cloud" style="left:' + r3(s.cloud.x) + 'px;top:' + r3(s.cloud.y) + 'px"><svg viewBox="0 0 284 215" fill="#ffffff" aria-hidden="true">' +
        CLOUD_C.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="69.5"/>'; }).join('') + '<path d="' + CLOUD_TAIL + '"/></svg><span>' + esc(typo(s.cloud.text)) + '</span></div>');
    }
    s.stickers.forEach(function (k, j) {
      var w = k.w, h = w / stkAr(k.k);
      o.push('<div class="igc__stk" data-drag="stk:' + j + '" style="left:' + r3(k.x - w / 2) + 'px;top:' + r3(k.y - h / 2) + 'px;width:' + r3(w) + 'px;height:' + r3(h) + 'px;transform:rotate(' + r3(k.r) + 'deg)"><img src="' + esc(stkUrl(k.k)) + '" alt=""></div>');
    });
    if (st.grain) o.push('<div class="igc__grain" style="background-image:url(' + grainUrl + ')"></div>');
    o.push('</div>');
    return o.join('');
  }

  /* ---------- панель ---------- */
  function cur() { return st.slides[st.sel]; }
  function seg(attr, items, val) { return '<div class="seg" ' + attr + '>' + items.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + (x[0] === val) + '">' + x[1] + '</button>'; }).join('') + '</div>'; }
  function slider(name, label, val, min, max, step, fmt) {
    return '<label class="slider"><span>' + label + '</span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-s="' + name + '"><output>' + fmt(val) + '</output></label>';
  }
  var pct = function (x) { return Math.round(x * 100) + '%'; }, px = function (x) { return Math.round(x) + ''; }, deg = function (x) { return Math.round(x) + '°'; };
  function colorRows() {
    var c = st.colors || {};
    return COLOR_ROWS.map(function (r) {
      var k = r[0], own = normHex(c[k]), val = own || tplColor(k);
      return '<div class="cr"><span>' + r[1] + '</span><input class="hex" type="text" value="' + val.toUpperCase() + '" data-hex="' + k + '" data-tpl="' + !own + '" aria-label="' + r[1] + ', HEX" spellcheck="false">' +
        '<button type="button" class="clr" data-clr="' + k + '" data-on="' + !!own + '">сброс</button>' +
        '<div class="sw"><label data-on="' + !!own + '" style="--c:' + val + '" title="Любой цвет"><input type="color" value="' + val + '" data-pick="' + k + '" aria-label="' + r[1] + '"></label></div></div>';
    }).join('');
  }
  function photoPicker(s, i) {
    var p = s.photos[i], lib = visibleLib();
    return '<div class="igc-slot"><div class="cg__t">' + (TYPES[s.type].bgPhoto ? 'Фон' : 'Фото ' + (i + 1)) + '</div>' +
      '<div class="igc-thumbs">' + lib.map(function (id) { return '<span class="igc-tw"><button type="button" class="igc-thumb" data-pp="' + i + '" data-id="' + id + '" aria-pressed="' + (p.p === id) + '" title="' + esc(PH[id].name) + '"><img src="' + esc(PH[id].url) + '" alt=""></button>' +
        '<button type="button" class="igc-del" data-delph="' + id + '" aria-label="Удалить фото «' + esc(PH[id].name) + '»" title="Удалить фото">' + ic('close') + '</button></span>'; }).join('') +
      '<label class="igc-thumb igc-thumb--add" title="Загрузить фото">' + ic('upload') + '<input class="vh" type="file" accept="image/*" data-up="' + i + '"></label></div>' +
      slider('ph:' + i + ':fx', 'Фокус X', p.fx, 0, 1, .01, pct) + slider('ph:' + i + ':fy', 'Фокус Y', p.fy, 0, 1, .01, pct) + slider('ph:' + i + ':zoom', 'Зум', p.zoom, 1, 2.5, .01, pct) + (TYPES[s.type].bgPhoto ? slider('ph:' + i + ':dim', 'Затемнение', p.dim || 0, 0, .6, .01, pct) : '') + '</div>';
  }
  function renderPanel() {
    var P = v('cpanel'), s = cur(), h = [];
    if (s) {
      var g0 = groupOf(st.sel), n0 = g0.idx.indexOf(st.sel) + 1;
      h.push('<div class="igc-selbar" role="status"><span class="igc-selbar__n">' + String(n0).padStart(2, '0') + '</span><span class="igc-selbar__t"><b>' + TYPES[s.type].name + '</b><span>Карусель ' + g0.n + ' · слайд ' + n0 + ' из ' + g0.idx.length + '</span></span></div>');
    }
    h.push('<h2>Слайды</h2><div class="igc-add">' + Object.keys(TYPES).map(function (k) { return '<button class="btn btn--sm" type="button" data-add="' + k + '">+ ' + TYPES[k].short + '</button>'; }).join('') + '</div>');
    h.push('<p class="note">Новая обложка начинает новую карусель. Карточка добавляется в конец карусели выбранного слайда. Нажмите на слайд справа, чтобы его редактировать.</p>');
    h.push('<h2>Тема</h2>' + seg('data-theme', Object.keys(THEMES).map(function (k) { return [k, THEMES[k].name]; }), st.theme));
    h.push('<div class="colors">' + colorRows() + '</div>');
    h.push('<div class="row" style="margin-top:10px"><input type="checkbox" id="igc-grain" data-g="grain"' + (st.grain ? ' checked' : '') + '><label for="igc-grain">Зерно поверх слайда, как в макете</label></div>');
    if (s) {
      var T = TYPES[s.type];
      h.push('<h2>Настройки слайда</h2>');
      h.push('<section class="el" style="margin-top:0;border-top:0;padding-top:0"><div class="el__head"><h2>Фото</h2></div>');
      s.photos.forEach(function (p, i) { h.push(photoPicker(s, i)); });
      h.push('<p class="note">Только бесплатные фото: свои генерации, Unsplash, Pexels. Фото хранятся в этом браузере.</p></section>');
      h.push('<section class="el"><div class="el__head"><h2>Заголовок</h2></div><label class="f">Текст · «|» — перенос строки<input type="text" data-t="title" value="' + esc(s.title).replace(/&nbsp;/g, ' ') + '"></label>' +
        slider('ts', 'Размер', s.ts, T.tsMin, T.tsMax, 1, px) + '</section>');
      if (s.type !== 'coverA') {
        h.push('<section class="el" data-off="' + !s.showSub + '"><div class="el__head"><h2>Подзаголовок</h2><label class="tg"><input type="checkbox" data-b="showSub"' + (s.showSub ? ' checked' : '') + '><span>Показать</span></label></div><div class="el__body"><label class="f">Текст<input type="text" data-t="sub" value="' + esc(s.sub).replace(/&nbsp;/g, ' ') + '"></label></div></section>');
        h.push('<section class="el" data-off="' + !s.showText + '"><div class="el__head"><h2>Текст</h2><label class="tg"><input type="checkbox" data-b="showText"' + (s.showText ? ' checked' : '') + '><span>Показать</span></label></div><div class="el__body"><label class="f">Абзац · «|» — перенос<textarea rows="3" data-t="text">' + esc(s.text).replace(/&nbsp;/g, ' ') + '</textarea></label></div></section>');
        h.push('<section class="el"><div class="el__head"><h2>Стрелки</h2></div>' +
          (s.type !== 'cardD' ? '<label class="tg"><input type="checkbox" data-b="showArrow"' + (s.showArrow ? ' checked' : '') + '><span>Линия со стрелкой</span></label>' : '') +
          '<label class="tg"><input type="checkbox" data-b="showTri"' + (s.showTri ? ' checked' : '') + '><span>Треугольник «листай»</span></label></section>');
      } else {
        h.push('<section class="el"><div class="el__head"><h2>Логотип</h2><label class="tg"><input type="checkbox" data-b="logo"' + (s.logo ? ' checked' : '') + '><span>Показать</span></label></div><p class="note">Белый логотип из DS 3.0, не перекрашивается.</p></section>');
        h.push('<section class="el" data-off="' + !s.cloud.on + '"><div class="el__head"><h2>Облачко</h2><label class="tg"><input type="checkbox" data-b="cloud.on"' + (s.cloud.on ? ' checked' : '') + '><span>Показать</span></label></div><div class="el__body"><label class="f">Текст<input type="text" data-t="cloud.text" value="' + esc(s.cloud.text).replace(/&nbsp;/g, ' ') + '"></label></div></section>');
      }
      h.push('<section class="el"><div class="el__head"><h2>Стикеры</h2></div><div class="igc-thumbs">' +
        Object.keys(STK).map(function (k) { return '<button type="button" class="igc-thumb igc-thumb--stk" data-stk="' + k + '" title="Добавить: ' + STK[k].n + '"><img src="' + stkUrl(k) + '" alt="' + STK[k].n + '"></button>'; }).join('') +
        st.stkLib.map(function (x) { return '<button type="button" class="igc-thumb igc-thumb--stk" data-stk="u:' + x.id + '" title="Добавить свой стикер"><img src="' + esc(uStk[x.id].url) + '" alt=""></button>'; }).join('') +
        '<label class="igc-thumb igc-thumb--add" title="Загрузить свой PNG">' + ic('upload') + '<input class="vh" type="file" accept="image/png,image/webp" data-upstk></label></div>');
      s.stickers.forEach(function (k, j) {
        var nm = k.k.indexOf('u:') === 0 ? 'Свой стикер' : STK[k.k].n;
        h.push('<div class="igc-stk"><div class="el__head"><span class="cg__t" style="margin:0">' + nm + '</span><button class="btn btn--sm btn--icon" type="button" data-delstk="' + j + '" aria-label="Удалить стикер" title="Удалить">' + ic('trash') + '</button></div>' +
          slider('stk:' + j + ':w', 'Размер', k.w, 40, 700, 1, px) + slider('stk:' + j + ':r', 'Поворот', k.r, -180, 180, 1, deg) + '</div>');
      });
      h.push('<p class="note">Стикер встаёт как в макете — у края слайда. Его можно перетащить мышью; свой PNG с прозрачностью — кнопкой со стрелкой.</p></section>');
    }
    P.innerHTML = h.join('');
  }

  /* ---------- сцена ---------- */
  // карусели: каждая обложка начинает новую карусель, карточки идут за ней
  function isCover(s) { return s.type.indexOf('cover') === 0; }
  function groups() {
    var g = [];
    st.slides.forEach(function (s, i) { if (!g.length || isCover(s)) g.push({ n: g.length + 1, idx: [] }); g[g.length - 1].idx.push(i); });
    return g;
  }
  function groupOf(i) { var g = groups(); for (var k = 0; k < g.length; k++) if (g[k].idx.indexOf(i) > -1) return g[k]; return null; }
  function addSlide(type, gEnd) {
    var s = cur(), src = s && s.photos[0] ? s.photos[0].p : null, ns = newSlide(type, src), at;
    if (isCover(ns)) at = st.slides.length;                                  // новая обложка — новая карусель в конце
    else if (gEnd != null) at = gEnd + 1;                                    // кнопка внутри карусели
    else { var g = groupOf(st.sel); at = g ? g.idx[g.idx.length - 1] + 1 : st.slides.length; } // в конец карусели выбранного слайда
    st.slides.splice(at, 0, ns); st.sel = at; all();
    if (isCover(ns)) toast('Новая обложка — новая карусель ' + groupOf(at).n);
  }
  function tileHTML(s, i, num, sc) {
    return '<div class="tile igc-tile" data-i="' + i + '" data-sel="' + (i === st.sel) + '" style="width:' + Math.round(W * sc) + 'px">' +
      '<div class="frame igc-frame" style="width:' + Math.round(W * sc) + 'px;height:' + Math.round(H * sc) + 'px">' + slideHTML(s, ';transform:scale(' + sc + ');transform-origin:0 0;position:absolute;left:0;top:0') + '</div>' +
      '<div class="tile__cap"><b>' + String(num).padStart(2, '0') + ' · ' + TYPES[s.type].short + '</b>' +
      '<button class="btn btn--sm btn--icon" type="button" data-mv="-1" aria-label="Сдвинуть влево" title="Сдвинуть влево"' + (i ? '' : ' disabled') + '>←</button>' +
      '<button class="btn btn--sm btn--icon" type="button" data-mv="1" aria-label="Сдвинуть вправо" title="Сдвинуть вправо"' + (i < st.slides.length - 1 ? '' : ' disabled') + '>→</button>' +
      '<button class="btn btn--sm btn--icon" type="button" data-dup aria-label="Дублировать" title="Дублировать">' + ic('copy') + '</button>' +
      '<button class="btn btn--sm btn--icon" type="button" data-del aria-label="Удалить слайд" title="Удалить слайд">' + ic('trash') + '</button>' +
      '<button class="btn btn--sm" type="button" data-png title="Скачать PNG в двойном размере 2160×2680">' + ic('download') + 'PNG ×2</button></div></div>';
  }
  function renderStage() {
    var S = v('cstage'), sc = st.zoom, h = [], G = groups();
    h.push('<section class="card igc-bar"><div class="card__head" style="margin:0"><h3>' + (G.length > 1 ? 'Карусели · ' + G.length : 'Карусель') + '<span>1080×1340 · превью ' + Math.round(sc * 100) + '%</span></h3>' +
      '<div class="hbtns">' + seg('data-zoom', [['0.22', 'S'], ['0.3', 'M'], ['0.42', 'L']], String(st.zoom)) +
      (G.length > 1 ? '<button class="btn btn--sm" type="button" data-zipall>' + ic('download') + 'ZIP: все карусели PNG ×2</button>' : '') +
      '<button class="btn btn--sm" type="button" data-add-cover>+ Новая карусель</button></div></div></section>');
    if (!st.slides.length) h.push('<section class="card empty">Добавьте обложку — с неё начнётся карусель.</section>');
    G.forEach(function (g) {
      var first = st.slides[g.idx[0]], last = g.idx[g.idx.length - 1];
      h.push('<section class="card igc-group" data-g="' + g.n + '"><div class="card__head"><h3>Карусель ' + g.n + '<span>' + g.idx.length + ' ' + plural(g.idx.length) + (isCover(first) ? '' : ' · без обложки') + '</span></h3>' +
        '<button class="btn btn--sm btn--acc" type="button" data-zipg="' + g.n + '">' + ic('download') + 'ZIP: карусель ' + g.n + ' PNG ×2</button></div><div class="tiles igc-tiles">');
      g.idx.forEach(function (i, k) { h.push(tileHTML(st.slides[i], i, k + 1, sc)); });
      h.push('<div class="igc-more" style="width:' + Math.round(W * sc) + 'px;height:' + Math.round(H * sc) + 'px"><span>Добавить карточку</span>' +
        '<button class="btn btn--sm" type="button" data-addin="cardC" data-end="' + last + '">+ ' + TYPES.cardC.short + '</button>' +
        '<button class="btn btn--sm" type="button" data-addin="cardD" data-end="' + last + '">+ ' + TYPES.cardD.short + '</button></div>');
      h.push('</div></section>');
    });
    S.innerHTML = h.join('');
    S.querySelectorAll('.igc-frame').forEach(function (f) { bindFrame(f, +f.parentElement.dataset.i); });
  }
  function plural(n) { var m = n % 10, c = n % 100; return m === 1 && c !== 11 ? 'слайд' : (m >= 2 && m <= 4 && (c < 12 || c > 14) ? 'слайда' : 'слайдов'); }
  var stT = null;
  function later() { clearTimeout(stT); stT = setTimeout(function () { renderStage(); save(); }, 40); }
  function all() { renderPanel(); renderStage(); save(); }
  function markSel() { document.querySelectorAll('.igc-tile').forEach(function (t) { t.dataset.sel = String(+t.dataset.i === st.sel); }); }

  /* перетаскивание: фото — кадр, стикер и облачко — положение */
  function bindFrame(frame, idx) {
    var drag = null, sc = st.zoom;
    frame.addEventListener('dragstart', function (e) { e.preventDefault(); });
    frame.addEventListener('pointerdown', function (ev) {
      if (ev.button !== 0) return;
      if (st.sel !== idx) { st.sel = idx; renderPanel(); markSel(); save(); }
      var tg = ev.target.closest('[data-drag]'); if (!tg) return;
      ev.preventDefault();
      var s = st.slides[idx], k = tg.dataset.drag.split(':'), d = { el: tg, k: k[0], i: +k[1], x: ev.clientX, y: ev.clientY, moved: false, s: s };
      if (d.k === 'ph') { var p = s.photos[d.i], P = PH[p.p], b = slotBox(s, d.i), ar = P ? P.ar : 1.5, sw = Math.max(b.w, b.h * ar) * p.zoom; d.p0 = clone(p); d.ox = b.w - sw; d.oy = b.h - sw / ar; }
      if (d.k === 'stk') d.p0 = clone(s.stickers[d.i]);
      if (d.k === 'cloud') d.p0 = clone(s.cloud);
      drag = d; try { frame.setPointerCapture(ev.pointerId); } catch (e) {}
      frame.classList.add('is-drag');
    });
    frame.addEventListener('pointermove', function (ev) {
      if (!drag) return;
      var dx = (ev.clientX - drag.x) / sc, dy = (ev.clientY - drag.y) / sc;
      if (!drag.moved && Math.abs(dx * sc) < 3 && Math.abs(dy * sc) < 3) return;
      drag.moved = true;
      var s = drag.s;
      if (drag.k === 'ph') {
        var p = s.photos[drag.i];
        if (drag.ox < -.5) p.fx = Math.min(1, Math.max(0, drag.p0.fx + dx / drag.ox));
        if (drag.oy < -.5) p.fy = Math.min(1, Math.max(0, drag.p0.fy + dy / drag.oy));
        drag.el.style.setProperty('--fx', r3(p.fx)); drag.el.style.setProperty('--fy', r3(p.fy));
      } else if (drag.k === 'stk') {
        var k = s.stickers[drag.i]; k.x = drag.p0.x + dx; k.y = drag.p0.y + dy;
        drag.el.style.left = r3(k.x - k.w / 2) + 'px'; drag.el.style.top = r3(k.y - k.w / stkAr(k.k) / 2) + 'px';
      } else if (drag.k === 'cloud') {
        s.cloud.x = drag.p0.x + dx; s.cloud.y = drag.p0.y + dy;
        drag.el.style.left = r3(s.cloud.x) + 'px'; drag.el.style.top = r3(s.cloud.y) + 'px';
      }
    });
    function end() { if (!drag) return; var m = drag.moved, k = drag.k; drag = null; frame.classList.remove('is-drag'); if (m) { if (k === 'ph') renderPanel(); save(); } }
    frame.addEventListener('pointerup', end); frame.addEventListener('pointercancel', end);
    frame.addEventListener('wheel', function (ev) {
      if (!ev.altKey) return;
      var tg = ev.target.closest('[data-drag^="ph:"]'); if (!tg) return;
      ev.preventDefault();
      var p = st.slides[idx].photos[+tg.dataset.drag.split(':')[1]];
      p.zoom = Math.min(2.5, Math.max(1, p.zoom * (1 - ev.deltaY * .0015))); tg.style.setProperty('--zoom', r3(p.zoom));
      clearTimeout(frame._wt); frame._wt = setTimeout(function () { renderPanel(); save(); }, 300);
    }, { passive: false });
  }

  /* ---------- события панели и сцены ---------- */
  function bindUI() {
    var P = v('cpanel'), S = v('cstage');
    P.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var s = cur();
      if (b.dataset.add) { addSlide(b.dataset.add); return; }
      if (b.parentElement.hasAttribute('data-theme')) { st.theme = b.dataset.v; st.colors = {}; all(); return; }
      if (b.dataset.clr) { delete st.colors[b.dataset.clr]; all(); return; }
      if (b.dataset.delph) { removePhoto(b.dataset.delph); return; }
      if (b.dataset.pp !== undefined) { s.photos[+b.dataset.pp].p = b.dataset.id; all(); return; }
      if (b.dataset.stk) { var d = STK[b.dataset.stk] || { w: 300, x: 540, y: 670, r: 0 }; s.stickers.push({ k: b.dataset.stk, w: d.w, x: d.x, y: d.y, r: d.r }); all(); return; }
      if (b.dataset.delstk !== undefined) { s.stickers.splice(+b.dataset.delstk, 1); all(); return; }
    });
    P.addEventListener('input', function (e) {
      var n = e.target, s = cur();
      if (n.dataset.t) { setPath(s, n.dataset.t, n.value); later(); return; }
      if (n.dataset.s) {
        var a = n.dataset.s.split(':'), val = +n.value;
        if (a[0] === 'ts') s.ts = val;
        else if (a[0] === 'ph') s.photos[+a[1]][a[2]] = val;
        else if (a[0] === 'stk') s.stickers[+a[1]][a[2]] = val;
        var f = a[0] === 'ts' || a[2] === 'w' ? px : a[2] === 'r' ? deg : pct;
        n.nextElementSibling.textContent = f(val); later(); return;
      }
      if (n.dataset.hex) { var x = normHex(n.value); n.setAttribute('aria-invalid', String(!x && n.value.trim() !== '')); if (x) { st.colors[n.dataset.hex] = x; later(); } return; }
      if (n.dataset.pick) { st.colors[n.dataset.pick] = n.value; var row = n.closest('.cr'); row.querySelector('.hex').value = n.value.toUpperCase(); row.querySelector('.hex').dataset.tpl = 'false'; n.parentElement.style.setProperty('--c', n.value); n.parentElement.dataset.on = 'true'; row.querySelector('.clr').dataset.on = 'true'; later(); }
    });
    P.addEventListener('change', async function (e) {
      var n = e.target, s = cur();
      if (n.dataset.b) { setPath(s, n.dataset.b, n.checked); all(); return; }
      if (n.dataset.g) { st.grain = n.checked; later(); return; }
      if (n.dataset.hex) { all(); return; }
      if (n.dataset.up !== undefined && n.files[0]) { var id = await addPhoto(n.files[0]); if (id) { s.photos[+n.dataset.up].p = id; s.photos[+n.dataset.up].fx = .5; s.photos[+n.dataset.up].fy = .5; s.photos[+n.dataset.up].zoom = 1; } all(); return; }
      if (n.hasAttribute('data-upstk') && n.files[0]) { await addSticker(n.files[0]); all(); }
    });
    S.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.parentElement.hasAttribute('data-zoom')) { st.zoom = +b.dataset.v; renderStage(); save(); return; }
      if (b.hasAttribute('data-zipall')) { zip(b); return; }
      if (b.dataset.zipg) { zip(b, +b.dataset.zipg); return; }
      if (b.hasAttribute('data-add-cover')) { addSlide('coverB'); return; }
      if (b.dataset.addin) { addSlide(b.dataset.addin, +b.dataset.end); return; }
      var tile = b.closest('.igc-tile'); if (!tile) return;
      var i = +tile.dataset.i;
      if (b.dataset.mv) { var j = i + +b.dataset.mv, x = st.slides.splice(i, 1)[0]; st.slides.splice(j, 0, x); st.sel = j; all(); return; }
      if (b.hasAttribute('data-dup')) { var c = clone(st.slides[i]); c.id = uid(); st.slides.splice(i + 1, 0, c); st.sel = i + 1; all(); return; }
      if (b.hasAttribute('data-del')) { st.slides.splice(i, 1); st.sel = Math.min(st.sel, st.slides.length - 1); all(); toast('Слайд удалён'); return; }
      if (b.hasAttribute('data-png')) { Y.job(b, function () { return renderSlide(st.slides[i]).then(function (bl) { return Y.saveFile(fname(i), bl); }); }); }
    });
  }
  function setPath(o, path, val) { var a = path.split('.'); while (a.length > 1) o = o[a.shift()]; o[a[0]] = val; }
  function fname(i) { var g = groupOf(i); return 'carousel-' + g.n + '-' + String(g.idx.indexOf(i) + 1).padStart(2, '0') + '-' + st.slides[i].type.toLowerCase() + '@2x.png'; }

  /* ---------- загрузка фото и своих стикеров ---------- */
  async function shrink(file, max, type) {
    var im = await Y.loadImage(file), k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
    var cv = document.createElement('canvas'); cv.width = Math.round(im.naturalWidth * k); cv.height = Math.round(im.naturalHeight * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
    var b = await new Promise(function (r) { cv.toBlob(r, type, .88); });
    return { blob: b, ar: cv.width / cv.height };
  }
  async function addPhoto(file) {
    if (!/^image\//.test(file.type)) { toast('Нужен файл картинки: JPG, PNG или WebP'); return null; }
    try {
      var r = await shrink(file, 2400, 'image/jpeg'), id = 'u:' + uid(), name = file.name.replace(/\.[^.]+$/, '').slice(0, 40);
      await Y.putBlob('igc:' + id, r.blob);
      PH[id] = { name: name, url: URL.createObjectURL(r.blob), ar: r.ar }; st.photoLib.push({ id: id, name: name, ar: r.ar });
      return id;
    } catch (e) { toast(e.message || 'Не получилось загрузить фото'); return null; }
  }
  async function addSticker(file) {
    try {
      var r = await shrink(file, 1200, 'image/png'), id = uid();
      await Y.putBlob('igcs:' + id, r.blob);
      uStk[id] = { name: file.name, url: URL.createObjectURL(r.blob), ar: r.ar }; st.stkLib.push({ id: id, name: file.name, ar: r.ar });
      cur().stickers.push({ k: 'u:' + id, w: 300, x: 540, y: 670, r: 0 });
    } catch (e) { toast(e.message || 'Не получилось загрузить стикер'); }
  }
  async function dropFiles(files) {
    var s = cur(), list = Array.prototype.filter.call(files, function (f) { return /^image\//.test(f.type); });
    if (!list.length) return toast('Нужны файлы картинок: JPG, PNG или WebP');
    var ids = [];
    for (var i = 0; i < list.length; i++) { var id = await addPhoto(list[i]); if (id) ids.push(id); }
    if (s) s.photos.forEach(function (p, i) { if (ids[i]) { p.p = ids[i]; p.fx = .5; p.fy = .5; p.zoom = 1; } });
    all(); toast(s ? 'Фото добавлены в слайд ' + (st.sel + 1) + ' и в библиотеку' : 'Фото добавлены в библиотеку');
  }

  /* ---------- PNG ---------- */
  function canvasGrad(ctx, a, stops, x, y, w, h) {
    var r = a * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r), L = (Math.abs(w * dx) + Math.abs(h * dy)) / 2;
    var cx = x + w / 2, cy = y + h / 2, lo = Math.min(0, stops[0][1]), hi = Math.max(1, stops[stops.length - 1][1]);
    var x0 = cx - dx * L, y0 = cy - dy * L, x1 = cx + dx * L, y1 = cy + dy * L;
    var g = ctx.createLinearGradient(x0 + (x1 - x0) * lo, y0 + (y1 - y0) * lo, x0 + (x1 - x0) * hi, y0 + (y1 - y0) * hi);
    stops.forEach(function (s) { g.addColorStop((s[1] - lo) / (hi - lo), s[0]); });
    return g;
  }
  function rgba(hex, a) { var c = Y.hexRgb(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function drawPhoto(ctx, im, p, ar, w, h) {
    if (!im || !im.naturalWidth) return;
    var sw = Math.max(w, h * ar) * p.zoom, sh = sw / ar;
    ctx.drawImage(im, (w - sw) * p.fx, (h - sh) * p.fy, sw, sh);
  }
  function waitImgs(el) {
    return Promise.all(Array.prototype.map.call(el.querySelectorAll('img'), function (im) { return im.complete && im.naturalWidth ? null : new Promise(function (r) { im.onload = im.onerror = r; }); }));
  }
  var SCALE = 2; // PNG ×2, как в обычных баннерах: 2160×2680
  async function renderSlide(s) {
    var host = v('offscreen'); host.innerHTML = slideHTML(s);
    var el = host.firstElementChild;
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      await waitImgs(el);
      var t = th(), T = TYPES[s.type], R = el.getBoundingClientRect();
      var cv = document.createElement('canvas'); cv.width = W * SCALE; cv.height = H * SCALE;
      var ctx = cv.getContext('2d'); ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      function rel(r) { return { x: r.left - R.left, y: r.top - R.top, w: r.width, h: r.height }; }
      function shadow(a) { ctx.shadowOffsetX = a ? a[0] * SCALE : 0; ctx.shadowOffsetY = a ? a[1] * SCALE : 0; ctx.shadowBlur = a ? a[2] * SCALE : 0; ctx.shadowColor = a ? a[3] : 'transparent'; }
      // фон
      if (T.bgPhoto) { var p0 = s.photos[0], P0 = PH[p0.p]; ctx.fillStyle = '#d9dde6'; ctx.fillRect(0, 0, W, H); drawPhoto(ctx, el.querySelector('.igc__ph--bg img'), p0, P0 ? P0.ar : 1.5, W, H); if (p0.dim) { ctx.fillStyle = 'rgba(0,0,0,' + p0.dim + ')'; ctx.fillRect(0, 0, W, H); } }
      else { ctx.fillStyle = canvasGrad(ctx, t.bg.a, t.bg.s, 0, 0, W, H); ctx.fillRect(0, 0, W, H); }
      if (s.type === 'coverB') {
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, rgba(t.ov, 0)); g.addColorStop(.5556, rgba(t.ov, 0)); g.addColorStop(.64961, rgba(t.ov, .5)); g.addColorStop(t.ovEnd, rgba(t.ov, 1)); g.addColorStop(1, rgba(t.ov, 1));
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
      if (s.type === 'coverA') { ctx.save(); ctx.filter = 'blur(' + 116.4 * SCALE + 'px)'; ctx.fillStyle = 'rgba(0,0,0,.81)'; ctx.fillRect(-12, 1118, 837, 135); ctx.restore(); }
      // полароиды
      (POL[s.type] || []).map(function (g, i) { return [g, i]; }).sort(function (a, b) { return a[0].z - b[0].z; }).forEach(function (x) {
        var g = x[0], i = x[1], p = s.photos[i], P = PH[p.p], b = slotBox(s, i);
        ctx.save(); ctx.translate(g.cx, g.cy); ctx.rotate(g.r * Math.PI / 180); ctx.translate(-g.w / 2, -g.h / 2);
        shadow(t.pol); ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(0, 0, g.w, g.h, g.rad); ctx.fill(); shadow(null);
        ctx.translate(g.b[3], g.b[0]); ctx.beginPath(); ctx.rect(0, 0, b.w, b.h); ctx.clip();
        ctx.fillStyle = '#e6e8ee'; ctx.fillRect(0, 0, b.w, b.h);
        drawPhoto(ctx, el.querySelector('[data-pol="' + i + '"] img'), p, P ? P.ar : 1.5, b.w, b.h);
        ctx.restore();
      });
      // тексты
      var onPhoto = !!T.bgPhoto;
      el.querySelectorAll('.igc__title, .igc__sub, .igc__p').forEach(function (node) {
        var box = rel(node.getBoundingClientRect()), fill;
        if (onPhoto) fill = t.ink.length > 1 ? canvasGrad(ctx, INK_ANGLE, t.ink.map(function (c, i) { return [c, [.11137, .77502, 1.221][i]]; }), box.x, box.y, box.w, box.h) : t.ink[0];
        drawText(ctx, node, rel, fill, !onPhoto && node.classList.contains('igc__title') ? [1, 3, 60, 'rgba(153,153,169,.35)'] : null, shadow);
      });
      // стрелки
      var ac = onPhoto ? t.ink[0] : t.accent;
      ctx.fillStyle = ac;
      if (el.querySelector('.igc__arrow')) { ctx.save(); ctx.translate(ARROW_POS.x - 30, ARROW_POS.y - 27); ctx.fill(new Path2D(ARROW_D)); ctx.restore(); }
      if (el.querySelector('.igc__tri')) { var tp = TRI_POS[s.type] || TRI_POS.def; ctx.save(); ctx.translate(tp.cx, tp.cy); ctx.rotate(-32.82 * Math.PI / 180); ctx.translate(-34.1421, -41.9664); ctx.fill(new Path2D(TRI_D)); ctx.restore(); }
      // логотип
      var lg = el.querySelector('.igc__logo'); if (lg && lg.naturalWidth) { var lr = rel(lg.getBoundingClientRect()); ctx.drawImage(lg, lr.x, lr.y, lr.w, lr.h); }
      // облачко
      if (s.type === 'coverA' && s.cloud.on) {
        ctx.save(); ctx.translate(s.cloud.x, s.cloud.y); shadow([-2, 1, 14, 'rgba(153,153,169,.3)']); ctx.fillStyle = '#ffffff';
        var cp = new Path2D(); CLOUD_C.forEach(function (c) { cp.moveTo(c[0] + 69.5, c[1]); cp.arc(c[0], c[1], 69.5, 0, Math.PI * 2); }); cp.addPath(new Path2D(CLOUD_TAIL));
        ctx.fill(cp); shadow(null); ctx.restore();
        drawText(ctx, el.querySelector('.igc__cloud span'), rel, '#121212', null, shadow);
      }
      // стикеры
      s.stickers.forEach(function (k, j) {
        var im = el.querySelectorAll('.igc__stk img')[j]; if (!im || !im.naturalWidth) return;
        var w = k.w, h = w / stkAr(k.k);
        ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.r * Math.PI / 180); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
      });
      if (st.grain) { ctx.save(); ctx.globalAlpha = .09; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = ctx.createPattern(grainCanvas, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore(); }
      return await new Promise(function (res, rej) { cv.toBlob(function (b) { b ? res(b) : rej({ message: 'пустой кадр' }); }, 'image/png'); });
    } finally { host.innerHTML = ''; }
  }
  // текст по словам на месте из вёрстки (учитывает переносы, поворот облачка не нужен для отдельных слов — рисуем с поворотом родителя)
  function drawText(ctx, node, rel, fill, sh, shadow) {
    var cs0 = getComputedStyle(node), tf = cs0.transform, rot = 0;
    if (tf && tf !== 'none') { var M = new DOMMatrix(tf); rot = Math.atan2(M.b, M.a); node.style.transform = 'none'; }
    var box = rel(node.getBoundingClientRect());
    ctx.save();
    if (rot) { ctx.translate(box.x + box.w / 2, box.y + box.h / 2); ctx.rotate(rot); ctx.translate(-(box.x + box.w / 2), -(box.y + box.h / 2)); }
    var tw = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), tn;
    while ((tn = tw.nextNode())) {
      var cs = getComputedStyle(tn.parentElement);
      ctx.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      try { ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing; } catch (e) {}
      ctx.fillStyle = fill || cs.color; shadow(sh); ctx.textBaseline = 'alphabetic';
      var re = /[^ \n\t\r]+/g, m, txt = tn.data;
      while ((m = re.exec(txt))) {
        var rg = document.createRange(); rg.setStart(tn, m.index); rg.setEnd(tn, m.index + m[0].length);
        var rr = rg.getClientRects()[0]; if (!rr) continue;
        var r = rel(rr), mt = ctx.measureText(m[0]);
        var asc = mt.fontBoundingBoxAscent || parseFloat(cs.fontSize) * .8, desc = mt.fontBoundingBoxDescent || parseFloat(cs.fontSize) * .2;
        ctx.fillText(m[0], r.x, r.y + (r.h + asc - desc) / 2);
      }
    }
    shadow(null); ctx.restore();
    if (rot) node.style.transform = '';
  }
  async function zip(btn, gn) {
    if (!window.JSZip) return toast('Архиватор не загрузился — скачайте PNG по одному');
    if (!st.slides.length) return toast('Сначала добавьте слайды');
    var G = groups().filter(function (g) { return !gn || g.n === gn; }), many = G.length > 1, list = [];
    G.forEach(function (g) { g.idx.forEach(function (i) { list.push([g, i]); }); });
    btn.disabled = true;
    try {
      var z = new JSZip();
      for (var k = 0; k < list.length; k++) {
        toast('Рендер ' + (k + 1) + ' из ' + list.length + '…');
        var g = list[k][0], i = list[k][1];
        z.file((many ? 'carousel-' + g.n + '/' : '') + fname(i), await renderSlide(st.slides[i]));
      }
      toast('Собираю архив…');
      await Y.saveFile(many ? 'carousels@2x.zip' : 'carousel-' + G[0].n + '@2x.zip', await z.generateAsync({ type: 'blob' }));
      toast('Сохранено');
    } catch (e) { toast(Y.errText(e)); }
    btn.disabled = false;
  }


  /* ---------- регистрация вкладки ---------- */
  var ready = load().catch(function () {});
  bindUI();
  Y.register('carousel', {
    name: 'Карусели',
    lead: 'Обложка и карточки для карусели Instagram 1080×1340 одной серией. Фото, стикеры и облачко двигаются мышью прямо в слайде.',
    zipLabel: 'ZIP: все карусели PNG ×2',
    render: function () { ready.then(function () { renderPanel(); renderStage(); }); },
    drop: dropFiles,
    zip: zip,
    reset: function () { var lib = st.photoLib, sl = st.stkLib; st = defaults(); st.hideB = []; st.photoLib = lib; st.stkLib = sl; all(); toast('Карусель сброшена к примеру. Загруженные фото и стикеры остались.'); }
  });
})();
