import * as THREE from 'three';
import { ARTIST, COLLECTIONS, RELEASES, PHOTOS } from './releases.js';
import { coverCanvas, detailCanvas } from './covers.js';

const $ = (s) => document.querySelector(s);
const byId = Object.fromEntries(RELEASES.map((r) => [r.id, r]));
const colById = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Make sure canvas-drawn text uses the web fonts.
try {
  await Promise.race([
    Promise.all([
      document.fonts.load('900 80px "Big Shoulders Display"'),
      document.fonts.load('700 80px "Big Shoulders Display"'),
      document.fonts.load('700 40px "Space Grotesk"'),
      document.fonts.load('500 40px "Space Grotesk"'),
    ]),
    new Promise((r) => setTimeout(r, 5000)),
  ]);
} catch { /* fall back to system fonts */ }

// Preload real cover art and photos (missing files simply resolve to null).
function loadImage(src) {
  return new Promise((res) => {
    if (!src) return res(null);
    const img = new Image();
    const t = setTimeout(() => res(null), 8000);
    img.onload = () => { clearTimeout(t); res(img); };
    img.onerror = () => { clearTimeout(t); res(null); };
    img.src = src;
  });
}
await Promise.all([
  ...RELEASES.map(async (r) => { r._img = await loadImage(r.cover); }),
  ...PHOTOS.map(async (p) => { p._img = await loadImage(p.src); }),
]);

function photoPlaceholder(photo, w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#e9e9e5'; ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#c9c9c3'; ctx.lineWidth = 3; ctx.setLineDash([14, 10]);
  ctx.strokeRect(18, 18, w - 36, h - 36);
  // simple head-and-shoulders glyph
  ctx.fillStyle = '#d3d3cd';
  ctx.beginPath(); ctx.arc(w / 2, h * 0.4, w * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(w / 2, h * 0.78, w * 0.3, h * 0.18, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#8a8a86'; ctx.textAlign = 'center';
  ctx.font = '600 26px "Space Grotesk", sans-serif';
  ctx.fillText('ADD PHOTO', w / 2, h * 0.86);
  ctx.font = '400 20px "Space Grotesk", sans-serif';
  ctx.fillText(photo.src, w / 2, h * 0.86 + 32);
  return c;
}
function photoCanvas(photo, w, h) {
  if (!photo._img) return photoPlaceholder(photo, w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const { naturalWidth: iw, naturalHeight: ih } = photo._img;
  const s = Math.max(w / iw, h / ih); // cover-fit
  ctx.drawImage(photo._img, (w - iw * s) / 2, (h - ih * s) / 2, iw * s, ih * s);
  return c;
}

// ═════════════════════════════════════════════════════════════
//  3D WALL
// ═════════════════════════════════════════════════════════════
const stage = $('#stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.prepend(renderer.domElement);

const BG = new THREE.Color('#f5f5f3');
const scene = new THREE.Scene();
scene.background = BG;
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

const maxAniso = renderer.capabilities.getMaxAnisotropy();
function tex(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}
function gradientCanvas(w, h, stops, radial = false) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const g = radial
    ? ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2)
    : ctx.createLinearGradient(0, h, 0, 0);
  stops.forEach(([p, col]) => g.addColorStop(p, col));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  return c;
}

// ── Layout: walk along the ring, placing items with arc-length spacing
const GAP = 0.85, SECTION_GAP = 2.4, EYE = 1.65;
const items = [];
for (const col of COLLECTIONS) {
  if (col.photos) {
    if (!PHOTOS.length) continue;
    items.push({ kind: 'placard', col, w: 1.25, h: 1.6, y: 1.55, gapBefore: SECTION_GAP });
    PHOTOS.forEach((photo, i) => {
      // keep each photo's real proportions, clamped to a sensible range
      const ar = photo._img ? Math.min(1.6, Math.max(0.6, photo._img.naturalWidth / photo._img.naturalHeight)) : 0.75;
      const h = photo.hero ? 2.8 : i % 2 ? 1.6 : 2.1;
      items.push({ kind: 'photo', col, photo, w: h * ar, h, y: photo.hero ? 1.9 : i % 2 ? 1.6 : 1.95, gapBefore: GAP });
    });
    continue;
  }
  const rels = RELEASES.filter((r) => r.collection === col.id);
  if (!rels.length) continue;
  items.push({ kind: 'placard', col, w: 1.25, h: 1.6, y: 1.55, gapBefore: SECTION_GAP });
  rels.forEach((rel, i) => {
    items.push({ kind: 'cover', col, rel, w: 2.3, h: 2.3, y: 1.8, gapBefore: GAP });
    const flip = i % 2;
    items.push({ kind: 'detail', col, rel, variant: 'a', w: flip ? 1.15 : 0.8, h: flip ? 0.85 : 1.08, y: flip ? 1.35 : 2.15, gapBefore: GAP });
    items.push({ kind: 'detail', col, rel, variant: 'b', w: flip ? 0.75 : 1.1, h: flip ? 1.0 : 0.82, y: flip ? 2.25 : 1.4, gapBefore: GAP * 0.6 });
  });
}
let length = items.reduce((s, it) => s + it.w + it.gapBefore, 0);
const R = Math.max(11, length / (Math.PI * 2));
// stretch section gaps so the ring closes seamlessly (endless loop)
const extra = Math.PI * 2 * R - length;
const nSections = items.filter((i) => i.kind === 'placard').length;
items.forEach((it) => { if (it.kind === 'placard') it.gapBefore += extra / nSections; });
let cursor = 0;
for (const it of items) {
  cursor += it.gapBefore + it.w / 2;
  it.theta = cursor / R;
  cursor += it.w / 2;
}
const dir = (t) => new THREE.Vector3(Math.sin(t), 0, -Math.cos(t));

// ── Room
const WALL_H = 5.6;
const wall = new THREE.Mesh(
  new THREE.CylinderGeometry(R, R, WALL_H, 360, 1, true),
  new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: tex(gradientCanvas(4, 512, [[0, '#d4d4d0'], [0.05, '#e7e7e4'], [0.3, '#f3f3f1'], [0.9, '#f7f7f5'], [1, '#e4e4e0']])),
  }),
);
wall.position.y = WALL_H / 2;
scene.add(wall);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(R, 180),
  new THREE.MeshBasicMaterial({ map: tex(gradientCanvas(512, 512, [[0, '#f4f4f2'], [0.85, '#ebebe8'], [1, '#dcdcd8']], true)) }),
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ceiling = new THREE.Mesh(new THREE.CircleGeometry(R, 180), new THREE.MeshBasicMaterial({ color: '#fbfbfa' }));
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = WALL_H;
scene.add(ceiling);

scene.fog = new THREE.Fog(BG, R * 1.05, R * 3.2);

// ── Frames
const shadowTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  // shadowBlur trick (works in every browser, unlike ctx.filter)
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 1000;
  ctx.fillStyle = '#000';
  ctx.fillRect(22 - 1000, 22, 84, 84);
  const t = new THREE.CanvasTexture(c);
  return t;
})();
const edgeMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
const edgeDark = new THREE.MeshBasicMaterial({ color: '#dcdcd8' });

function placardCanvas(col) {
  const c = document.createElement('canvas');
  c.width = 500; c.height = 640;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 500, 640);
  ctx.fillStyle = '#8a8a86';
  ctx.font = '500 20px "Space Grotesk", sans-serif';
  ctx.fillText(col.kicker.toUpperCase(), 40, 70);
  ctx.fillStyle = '#111';
  ctx.font = '900 86px "Big Shoulders Display", sans-serif';
  const words = col.title.toUpperCase().split(' ');
  let line = '', y = 170;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > 420 && line) { ctx.fillText(line, 40, y); line = w; y += 82; }
    else line = test;
  }
  ctx.fillText(line, 40, y);
  ctx.fillStyle = '#111'; ctx.fillRect(40, 560, 40, 3);
  ctx.font = '500 18px "Space Grotesk", sans-serif';
  if (col.photos) ctx.fillText('PRODUCER · REMIXER · DJ', 40, 596);
  else {
    const n = RELEASES.filter((r) => r.collection === col.id).length;
    ctx.fillText(`${n} ${n === 1 ? 'work' : 'works'} · VERTIC`, 40, 596);
  }
  return c;
}

function captionCanvas(title, sub) {
  const c = document.createElement('canvas');
  c.width = 800; c.height = 90;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#111';
  ctx.font = '700 38px "Big Shoulders Display", sans-serif';
  ctx.fillText(title.toUpperCase(), 0, 40);
  ctx.fillStyle = '#85857f';
  ctx.font = '500 22px "Space Grotesk", sans-serif';
  ctx.fillText(sub, 0, 76);
  return c;
}

const clickables = [];
const groups = [];
for (const it of items) {
  const g = new THREE.Group();
  const p = dir(it.theta).multiplyScalar(R - 0.07);
  g.position.set(p.x, it.y, p.z);
  g.lookAt(0, it.y, 0);
  scene.add(g);

  let canvas;
  if (it.kind === 'placard') canvas = placardCanvas(it.col);
  else if (it.kind === 'cover') canvas = coverCanvas(it.rel, 1024);
  else if (it.kind === 'photo') canvas = photoCanvas(it.photo, Math.round(it.w * 420), Math.round(it.h * 420));
  else canvas = detailCanvas(it.rel, it.variant, Math.round(it.w * 400), Math.round(it.h * 400));

  const front = new THREE.MeshBasicMaterial({ color: '#ffffff', map: tex(canvas) });

  const depth = it.kind === 'placard' ? 0.02 : 0.05;
  const art = new THREE.Mesh(new THREE.BoxGeometry(it.w, it.h, depth), [edgeMat, edgeMat, edgeMat, edgeDark, front, edgeMat]);
  art.position.z = depth / 2;
  art.userData = it;
  g.add(art);

  const sh = new THREE.Mesh(
    new THREE.PlaneGeometry(it.w * 1.45, it.h * 1.45),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: it.kind === 'placard' ? 0.35 : 0.6 }),
  );
  sh.position.set(0.05, -0.08, 0.005);
  g.add(sh);

  if (it.kind === 'cover' || (it.kind === 'photo' && it.photo.caption)) {
    const capCanvas = it.kind === 'cover'
      ? captionCanvas(it.rel.title, [it.rel.type, it.rel.label, it.rel.date].filter(Boolean).join(' · '))
      : captionCanvas(it.photo.caption, it.photo.credit ? `Via ${it.photo.credit}` : 'Vertic');
    const cap = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.18),
      new THREE.MeshBasicMaterial({ map: tex(capCanvas), transparent: true, depthWrite: false }),
    );
    cap.renderOrder = 2;
    cap.position.set(-it.w / 2 + 0.8, -it.h / 2 - 0.26, 0.01);
    g.add(cap);
  }

  it.group = g;
  it.home = g.position.clone();
  it.lift = 0;
  clickables.push(art);
  groups.push(it);
}

// ── Camera rig
let PARK = 0.12; // covers sit slightly right of centre on wide screens
let phi = items.find((i) => i.kind !== 'placard').theta - PARK; // current angle
let target = phi;
let velocity = 0;
const mouse = new THREE.Vector2(0, 0), mouseSmooth = new THREE.Vector2(0, 0);
const BACK = 0.15; // how far behind the ring centre the camera stands (× R)

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  PARK = w / h < 1 ? 0 : 0.12;
  camera.fov = w / h < 0.8 ? 62 : w / h < 1.2 ? 52 : 42;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
resize();
phi = target = items.find((i) => i.kind !== 'placard').theta - PARK;

// ── Input
let dragging = false, dragX = 0, downX = 0, downY = 0, lastInput = performance.now();
const hint = $('#hint');
function touched() {
  lastInput = performance.now();
  hint.classList.add('gone');
}
stage.addEventListener('wheel', (e) => {
  if (state.view !== 'gallery') return;
  e.preventDefault();
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  target += d * 0.0007;
  touched();
}, { passive: false });

stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('button')) return; // let the arrow buttons receive their click
  dragging = true; dragX = downX = e.clientX; downY = e.clientY;
  stage.setPointerCapture(e.pointerId);
  stage.classList.add('dragging');
  touched();
});
stage.addEventListener('pointermove', (e) => {
  mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (dragging) {
    const dx = e.clientX - dragX;
    dragX = e.clientX;
    const k = 0.0035 * (42 / camera.fov);
    target -= dx * k;
    velocity = -dx * k;
  }
  if (e.pointerType === 'mouse') pick(e.clientX, e.clientY);
});
stage.addEventListener('pointerup', (e) => {
  if (!dragging) return;
  stage.classList.remove('dragging');
  const moved = Math.hypot(e.clientX - downX, e.clientY - downY);
  dragging = false;
  if (moved < 6) {
    const hit = raycast(e.clientX, e.clientY);
    if (hit) openItem(hit.userData);
  } else {
    target += velocity * 12; // inertia
  }
});
stage.addEventListener('pointerleave', () => { hovered = null; tooltip.hidden = true; stage.classList.remove('pointing'); });

const covers = items.filter((i) => i.kind === 'cover' || (i.kind === 'photo' && i.photo.hero));
function step(dirn) {
  // jump to next/previous cover relative to where we are now
  const twoPi = Math.PI * 2;
  const cur = target;
  let best = null;
  for (const c of covers) {
    const base = c.theta - PARK;
    const n = Math.floor((cur - base) / twoPi);
    for (const t of [base + n * twoPi, base + (n + 1) * twoPi, base + (n - 1) * twoPi, base + (n + 2) * twoPi]) {
      if (dirn > 0 ? t > cur + 0.02 : t < cur - 0.02) {
        if (best === null || Math.abs(t - cur) < Math.abs(best - cur)) best = t;
      }
    }
  }
  if (best !== null) target = best;
  touched();
}
$('#next').addEventListener('click', () => step(1));
$('#prev').addEventListener('click', () => step(-1));
addEventListener('keydown', (e) => {
  if (state.view !== 'gallery' || e.target.closest('input,textarea,select')) return;
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'ArrowLeft') step(-1);
});

function flyTo(rel) {
  const it = covers.find((c) => c.rel === rel);
  if (!it) return;
  const twoPi = Math.PI * 2;
  const base = it.theta - PARK;
  target = base + Math.round((target - base) / twoPi) * twoPi;
  touched();
}

// ── Picking
const raycaster = new THREE.Raycaster();
const tooltip = $('#tooltip');
let hovered = null;
function raycast(x, y) {
  const rect = renderer.domElement.getBoundingClientRect();
  const v = new THREE.Vector2(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(v, camera);
  const hit = raycaster.intersectObjects(clickables, false)[0];
  return hit ? hit.object : null;
}
function pick(x, y) {
  if (dragging) return;
  const obj = raycast(x, y);
  hovered = obj ? obj.userData : null;
  stage.classList.toggle('pointing', !!hovered);
  if (hovered) {
    tooltip.hidden = false;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.textContent = hovered.kind === 'placard' ? `${hovered.col.title} →`
      : hovered.kind === 'photo' ? 'About Vertic →' : `${hovered.rel.title} — view`;
  } else tooltip.hidden = true;
}
function openItem(it) {
  if (it.kind === 'photo' || (it.kind === 'placard' && it.col.photos)) {
    location.hash = '#/info';
    return;
  }
  if (it.kind === 'placard') {
    const first = RELEASES.find((r) => r.collection === it.col.id);
    if (first) flyTo(first);
    return;
  }
  location.hash = '#/release/' + it.rel.id;
}

// ── Current-collection caption at the bottom (like the template)
const nowEl = $('#now'), nowTitle = $('#now-title'), nowKicker = $('#now-kicker');
let nowCol = null;
function updateNow() {
  const twoPi = Math.PI * 2;
  const a = ((phi + PARK) % twoPi + twoPi) % twoPi;
  let best = null, bd = Infinity;
  for (const it of items) {
    if (it.kind === 'placard') continue;
    let d = Math.abs(it.theta - a); d = Math.min(d, twoPi - d);
    if (d < bd) { bd = d; best = it; }
  }
  if (best && best.col !== nowCol) {
    nowCol = best.col;
    nowEl.classList.add('fade');
    setTimeout(() => {
      nowTitle.textContent = nowCol.title;
      nowKicker.textContent = nowCol.kicker;
      nowEl.classList.remove('fade');
    }, 250);
  }
}

// ── Render loop
const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (state.view !== 'gallery') return; // pause while a page covers the wall

  if (!reduceMotion && !dragging && performance.now() - lastInput > 5000) target += dt * 0.025; // gentle drift
  phi += (target - phi) * (1 - Math.pow(0.0015, dt));
  mouseSmooth.lerp(mouse, 1 - Math.pow(0.02, dt));

  const fwd = dir(phi);
  camera.position.copy(fwd).multiplyScalar(-R * BACK);
  camera.position.y = EYE;
  const look = dir(phi + mouseSmooth.x * 0.07).multiplyScalar(R);
  look.y = EYE + 0.15 + mouseSmooth.y * 0.35;
  camera.lookAt(look);

  for (const it of groups) {
    const want = hovered === it ? 1 : 0;
    it.lift += (want - it.lift) * (1 - Math.pow(0.001, dt));
    const s = 1 + it.lift * 0.05;
    it.group.scale.set(s, s, 1);
    it.group.position.copy(it.home).addScaledVector(dir(it.theta), -it.lift * 0.12);
  }
  updateNow();
  renderer.render(scene, camera);
}

// ═════════════════════════════════════════════════════════════
//  PAGES
// ═════════════════════════════════════════════════════════════
const state = { view: 'gallery' };
const pages = { list: $('#list'), release: $('#release'), info: $('#info') };
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const thumbs = {};
const thumb = (rel) => (thumbs[rel.id] ??= rel.cover || coverCanvas(rel, 1024).toDataURL('image/jpeg', 0.85));

function renderList(q = '') {
  const needle = q.trim().toLowerCase();
  const rows = RELEASES.filter((r) =>
    !needle || [r.title, r.type, r.label, r.genre, colById[r.collection]?.title].filter(Boolean).join(' ').toLowerCase().includes(needle));
  $('#list-count').textContent = `${rows.length} of ${RELEASES.length}`;
  $('#list-rows').innerHTML = rows.length
    ? rows.map((r) => `
      <li><a href="#/release/${r.id}">
        <img src="${thumb(r)}" alt="" loading="lazy" />
        <span><span class="t">${esc(r.title)}</span><br><span class="m">${esc(r.type)}</span></span>
        <span class="m hide-sm">${esc(colById[r.collection]?.kicker ?? '')}</span>
        <span class="m hide-sm">${esc(r.label ?? '—')}</span>
        <span class="m hide-sm">${esc(r.date ?? '')}</span>
        <span class="arr">→</span>
      </a></li>`).join('')
    : `<li class="empty">Nothing on the wall matches “${esc(q)}”.</li>`;
}

function renderRelease(rel) {
  $('#r-img').src = thumb(rel);
  $('#r-img').alt = `${rel.title} cover art`;
  $('#r-kicker').textContent = colById[rel.collection]?.kicker ?? '';
  $('#r-title').textContent = rel.title;
  $('#r-sub').textContent = ['Vertic', rel.type].join(' — ');
  $('#r-blurb').textContent = rel.blurb;
  const q = $('#r-quote');
  q.hidden = !rel.quote;
  if (rel.quote) q.innerHTML = `“${esc(rel.quote.text)}”<cite>— ${esc(rel.quote.by)}</cite>`;
  const meta = [['Artist', 'Vertic'], ['Format', rel.type], ['Label', rel.label], ['Released', rel.date], ['Genre', rel.genre]]
    .filter(([, v]) => v);
  if (rel.tracks) meta.push(['Tracks', rel.tracks.join('<br>')]);
  $('#r-meta').innerHTML = meta.map(([k, v]) => `<dt>${k}</dt><dd>${k === 'Tracks' ? v : esc(v)}</dd>`).join('');
  $('#r-actions').innerHTML = rel.links.map((l) =>
    `<a class="btn ${l.primary ? '' : 'alt'}" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('');
  $('#r-more').innerHTML = RELEASES.filter((r) => r !== rel).map((r) =>
    `<a href="#/release/${r.id}"><img src="${thumb(r)}" alt="" loading="lazy" /><span>${esc(r.title)}</span></a>`).join('');
  document.title = `${rel.title} — Vertic`;
}

function renderInfo() {
  $('#i-role').textContent = `${ARTIST.realName} · ${ARTIST.role} · ${ARTIST.home}`;
  $('#i-bio').innerHTML = ARTIST.bio.map((p) => `<p>${esc(p)}</p>`).join('');
  $('#i-labels').innerHTML = ARTIST.labels.map((l) => `<li>${esc(l)}</li>`).join('');
  $('#i-links').innerHTML = ARTIST.links.map((l) => `<li><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a></li>`).join('');
  $('#i-email').textContent = ARTIST.bookingEmail;
  const loaded = PHOTOS.filter((p) => p._img);
  $('#i-photos').innerHTML = loaded.length
    ? loaded.map((p, i) => `<figure class="${i === 0 ? 'hero' : ''}"><img src="${esc(p.src)}" alt="${esc(p.caption || 'Vertic')}" loading="lazy" />${p.caption ? `<figcaption>${esc(p.caption)}${p.credit ? ` · via ${esc(p.credit)}` : ''}</figcaption>` : ''}</figure>`).join('')
    : `<figure class="hero placeholder"><span>Add photos of Vertic to <b>site/photos/</b></span></figure>`;
}

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [view, id] = h.split('/');
  Object.values(pages).forEach((p) => (p.hidden = true));
  document.title = 'Vertic — Producer · Remixer · DJ';
  if (view === 'list') { state.view = 'list'; renderList($('#search').value); pages.list.hidden = false; }
  else if (view === 'release' && byId[id]) { state.view = 'release'; renderRelease(byId[id]); pages.release.hidden = false; pages.release.scrollTop = 0; flyTo(byId[id]); }
  else if (view === 'info') { state.view = 'info'; renderInfo(); pages.info.hidden = false; pages.info.scrollTop = 0; }
  else { state.view = 'gallery'; clock.getDelta(); }
  tooltip.hidden = true;
  const navKey = state.view === 'release' ? 'gallery' : state.view;
  document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === navKey));
  document.querySelectorAll('[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === (state.view === 'list' ? 'list' : 'gallery')));
}
addEventListener('hashchange', route);

// ── Search: filters the list; Enter in gallery flies to the first match
const search = $('#search');
search.addEventListener('input', () => {
  if (state.view === 'list') renderList(search.value);
});
search.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const q = search.value.trim().toLowerCase();
  if (!q) return;
  const hit = RELEASES.find((r) => [r.title, r.label, colById[r.collection]?.title].filter(Boolean).join(' ').toLowerCase().includes(q));
  if (state.view === 'gallery' && hit) { flyTo(hit); search.blur(); }
  else if (state.view !== 'list') location.hash = '#/list';
});

// ═════════════════════════════════════════════════════════════
//  BOOKINGS DRAWER
// ═════════════════════════════════════════════════════════════
const drawer = $('#drawer'), scrim = $('#scrim');
$('#d-email').textContent = ARTIST.bookingEmail;
function openDrawer() { scrim.hidden = false; drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); setTimeout(() => drawer.querySelector('input')?.focus(), 350); }
function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); scrim.hidden = true; }
document.querySelectorAll('[data-open-drawer]').forEach((b) => b.addEventListener('click', openDrawer));
$('#drawer-close').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

$('#booking').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const subject = `Booking request: ${f.type}${f.date ? ' — ' + f.date : ''}${f.city ? ' — ' + f.city : ''}`;
  const body = [
    `Name: ${f.name}`, `Email: ${f.email}`, `Request: ${f.type}`,
    `Date: ${f.date || '—'}`, `City: ${f.city || '—'}`, `Event / venue: ${f.event || '—'}`, '', f.message || '',
  ].join('\n');
  location.href = `mailto:${ARTIST.bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const s = $('#form-status');
  s.hidden = false;
  s.textContent = `Your email app should open with the request filled in. If it doesn't, email ${ARTIST.bookingEmail} directly.`;
});

// ═════════════════════════════════════════════════════════════
//  GO
// ═════════════════════════════════════════════════════════════
route();
frame();
requestAnimationFrame(() => $('#loader').classList.add('done'));
