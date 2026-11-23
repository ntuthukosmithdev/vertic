// Generated placeholder cover art. Each release gets a deterministic,
// graphic poster-style image from its `art.style` + `art.palette`.
// Replace with real artwork by setting `cover` in releases.js.

function rng(seedStr) {
  let h = 2166136261;
  for (const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STYLES = {
  glitch(ctx, s, [bg, hot, light, mid], r) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, s, s);
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = s / 400;
    for (let i = 0; i <= 16; i++) {
      const p = (i / 16) * s;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(s, p); ctx.stroke();
    }
    // big block
    ctx.fillStyle = light; ctx.fillRect(s * 0.18, s * 0.22, s * 0.64, s * 0.5);
    // displaced slices
    for (let i = 0; i < 26; i++) {
      const y = s * (0.15 + r() * 0.65), h = s * (0.004 + r() * 0.035);
      const dx = (r() - 0.5) * s * 0.35;
      ctx.fillStyle = r() < 0.55 ? hot : r() < 0.5 ? bg : mid;
      ctx.fillRect(s * 0.18 + dx, y, s * (0.3 + r() * 0.5), h);
    }
    ctx.fillStyle = hot; ctx.fillRect(s * 0.18, s * 0.78, s * 0.2, s * 0.02);
    ctx.fillStyle = light;
    ctx.font = `700 ${s * 0.045}px "Space Grotesk", sans-serif`;
    ctx.fillText('SYSTEM_CORRUPT', s * 0.18, s * 0.86);
    ctx.font = `500 ${s * 0.025}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = mid; ctx.fillText('XPLR001 // VERTIC', s * 0.18, s * 0.9);
  },

  rings(ctx, s, [bg, a, b, ink], r) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, s, s);
    const cx = s * 0.5, cy = s * 0.46;
    for (let i = 14; i > 0; i--) {
      ctx.beginPath();
      ctx.arc(cx + (r() - 0.5) * s * 0.04, cy + (r() - 0.5) * s * 0.04, (i / 14) * s * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? a : bg; ctx.fill();
    }
    // head silhouette
    ctx.fillStyle = ink;
    ctx.beginPath(); ctx.ellipse(cx, cy - s * 0.03, s * 0.09, s * 0.11, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.17, cy + s * 0.36); ctx.quadraticCurveTo(cx, cy + s * 0.02, cx + s * 0.17, cy + s * 0.36); ctx.fill();
    ctx.fillStyle = b;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(cx + s * (0.14 + i * 0.05), cy - s * (0.12 + i * 0.05), s * (0.012 + i * 0.008), 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = ink;
    ctx.font = `700 ${s * 0.05}px "Big Shoulders Display", sans-serif`;
    ctx.fillText('VOICES IN MY HEAD', s * 0.08, s * 0.93);
  },

  rain(ctx, s, [bg, drop, moon, deep], r) {
    const g = ctx.createLinearGradient(0, 0, 0, s);
    g.addColorStop(0, bg); g.addColorStop(1, deep);
    ctx.fillStyle = g; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = moon; ctx.beginPath(); ctx.arc(s * 0.68, s * 0.28, s * 0.13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = drop; ctx.lineCap = 'round';
    for (let i = 0; i < 140; i++) {
      const x = r() * s, y = r() * s * 0.8, l = s * (0.02 + r() * 0.07);
      ctx.globalAlpha = 0.25 + r() * 0.6; ctx.lineWidth = s * (0.002 + r() * 0.004);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - l * 0.15, y + l); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // tribal band
    const by = s * 0.8;
    ctx.fillStyle = moon; ctx.fillRect(0, by, s, s * 0.012);
    for (let i = 0; i < 12; i++) {
      const x = (i / 12) * s;
      ctx.fillStyle = i % 2 ? moon : drop;
      ctx.beginPath(); ctx.moveTo(x, s); ctx.lineTo(x + s / 24, by + s * 0.03); ctx.lineTo(x + s / 12, s); ctx.fill();
    }
  },

  waves(ctx, s, [bg, a, b, ink], r) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, s, s);
    const bands = 9;
    for (let i = 0; i < bands; i++) {
      const base = s * (0.2 + i * 0.075), amp = s * (0.02 + r() * 0.04), f = 2 + r() * 3, ph = r() * 6;
      ctx.beginPath(); ctx.moveTo(0, s);
      for (let x = 0; x <= s; x += s / 120) ctx.lineTo(x, base + Math.sin((x / s) * f * Math.PI + ph) * amp);
      ctx.lineTo(s, s); ctx.closePath();
      ctx.fillStyle = i % 3 === 0 ? a : i % 3 === 1 ? bg : b; ctx.globalAlpha = i % 3 === 1 ? 0.85 : 1; ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink; ctx.fillRect(s * 0.08, s * 0.08, s * 0.035, s * 0.035);
    ctx.font = `700 ${s * 0.06}px "Big Shoulders Display", sans-serif`;
    ctx.fillText('SURFACES', s * 0.08, s * 0.17);
  },

  numerals(ctx, s, [bg, light, ink, gold], r) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = gold; ctx.fillRect(0, s * 0.62, s, s * 0.38);
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(s * 0.78, s * 0.62, s * 0.16, Math.PI, 0); ctx.fill();
    ctx.fillStyle = light;
    ctx.font = `900 ${s * 0.62}px "Big Shoulders Display", sans-serif`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('96', s * 0.05, s * 0.66);
    ctx.fillStyle = ink;
    ctx.font = `600 ${s * 0.035}px "Space Grotesk", sans-serif`;
    ctx.fillText('NINETEEN NINETY SIX', s * 0.06, s * 0.9);
    for (let i = 0; i < 7; i++) { ctx.fillRect(s * (0.06 + i * 0.035), s * 0.76, s * 0.018, s * (0.04 + r() * 0.06)); }
  },

  duo(ctx, s, [bg, light, hot, deep], r) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = deep; ctx.fillRect(s * 0.5, 0, s * 0.5, s);
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(s * 0.42, s * 0.48, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = hot; ctx.beginPath(); ctx.arc(s * 0.6, s * 0.52, s * 0.22, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = light; ctx.lineWidth = s * 0.004;
    for (let i = 0; i < 6; i++) { const y = s * (0.82 + i * 0.022); ctx.beginPath(); ctx.moveTo(s * 0.08, y); ctx.lineTo(s * (0.3 + r() * 0.5), y); ctx.stroke(); }
    ctx.fillStyle = light;
    ctx.font = `700 ${s * 0.05}px "Big Shoulders Display", sans-serif`;
    ctx.fillText('DEEP NARRATIVES', s * 0.08, s * 0.12);
  },
};

function grain(ctx, s, r) {
  const img = ctx.getImageData(0, 0, s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 18;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

const cache = new Map();

/** Full cover as a canvas. */
export function coverCanvas(release, size = 1024) {
  const key = release.id + ':' + size;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const r = rng(release.id);
  if (release._img) {
    // real artwork (preloaded in main.js) — centre-crop to square
    const { naturalWidth: w, naturalHeight: h } = release._img;
    const s = Math.min(w, h);
    ctx.drawImage(release._img, (w - s) / 2, (h - s) / 2, s, s, 0, 0, size, size);
  } else {
    (STYLES[release.art.style] || STYLES.duo)(ctx, size, release.art.palette, r);
    grain(ctx, size, r);
  }
  cache.set(key, c);
  return c;
}

/** A cropped "detail" of the cover — used for the smaller frames on the wall. */
export function detailCanvas(release, variant, w, h) {
  const src = coverCanvas(release, 1024);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const r = rng(release.id + variant);
  const scale = 1.6 + r() * 1.2;
  const sw = 1024 / scale, sh = sw * (h / w);
  const sx = r() * (1024 - sw), sy = r() * Math.max(0, 1024 - sh);
  ctx.drawImage(src, sx, sy, sw, Math.min(sh, 1024), 0, 0, w, h);
  return c;
}

/** URL usable in <img>: real cover if set, otherwise generated. */
export function coverURL(release) {
  return release.cover || coverCanvas(release, 1024).toDataURL('image/jpeg', 0.9);
}
