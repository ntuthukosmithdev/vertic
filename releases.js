// ─────────────────────────────────────────────────────────────
//  VERTIC — site content
//  Edit this file to update the gallery. Everything on the site
//  (the 3D wall, the list view, release pages) is built from it.
//
//  COVER ART: drop the real artwork into /site/covers/ and set
//  `cover: 'covers/system-corrupt.jpg'` on a release. Until then a
//  generated placeholder cover is drawn from `art`.
// ─────────────────────────────────────────────────────────────

export const ARTIST = {
  name: 'Vertic',
  realName: 'Khayelihle Ngcobo',
  role: 'Producer · Remixer · DJ',
  home: 'Pietermaritzburg, KwaZulu-Natal, South Africa',
  bookingEmail: 'vertic@renitent.co.za',
  bio: [
    'Vertic is a South African producer and DJ, born and raised in Pietermaritzburg, KwaZulu-Natal.',
    'He first emerged as one half of the duo Deep Narratives, and has since released music on Sondela Recordings, BFM Records and Madorasindahouse Records. Records like “Surfaces” and “1996” point to a sound built on depth, tension and movement.',
    'His rise has been gradual rather than sudden. He didn’t chase trends; he let the sound develop until other artists and dancefloors confirmed it had an identity of its own.',
  ],
  labels: ['XPLR', 'TIIK Music Collective', 'Sondela Recordings', 'BFM Records', 'Madorasindahouse Records', 'Ulu Records'],
  links: [
    { label: 'Instagram', url: 'https://www.instagram.com/vertic_v/' },
    { label: 'Threads', url: 'https://www.threads.com/@vertic_v' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/vertic' },
  ],
};

// ─────────────────────────────────────────────────────────────
//  PHOTOS OF VERTIC
//  Save the images into /site/photos/ using these file names (or
//  change the names here). Any size/orientation works — portrait
//  shots look best. Until a file exists, its frame on the wall shows
//  an "add photo" placeholder. Add or remove entries freely.
// ─────────────────────────────────────────────────────────────
export const PHOTOS = [
  // Sourced from Instagram (@vertic_v and the labels' posts he shared).
  // Low-res (≈500px) — swap in originals/press shots when available.
  { src: 'photos/vertic-1.jpg', caption: 'Vertic', credit: 'boolood music', hero: true },
  { src: 'photos/vertic-2.jpg', caption: 'Behind the decks' },
  { src: 'photos/vertic-3.jpg', caption: 'Sondela Live, Johannesburg', credit: 'Sondela Recordings' },
  { src: 'photos/vertic-4.jpg', caption: 'Backstage' },
];

// Wall sections, in the order you walk past them.
// The section with `photos: true` hangs the PHOTOS above.
export const COLLECTIONS = [
  { id: 'portraits', title: 'Vertic', kicker: 'Khayelihle Ngcobo · Pietermaritzburg', photos: true },
  { id: 'xplr', title: 'System Corrupt', kicker: 'XPLR 001 · 2026' },
  { id: 'tiik', title: 'Voices In My Head', kicker: 'TIIK' },
  { id: 'debut', title: 'Rainy Spirits', kicker: 'The solo debut' },
  { id: 'signatures', title: 'Signatures', kicker: 'Depth · Tension · Movement' },
  { id: 'origins', title: 'Deep Narratives', kicker: 'Where it started' },
];

export const RELEASES = [
  {
    id: 'system-corrupt',
    collection: 'xplr',
    title: 'System Corrupt',
    type: 'Release',
    label: 'XPLR',
    date: '26 June 2026',
    genre: 'Afro House',
    blurb:
      'The first release on XPLR, the new label from Rocco Rodamaal, launched alongside his imprint Memories Records. A record with its own momentum.',
    quote: { text: 'It doesn’t try too hard to explain itself, it just finds its place.', by: 'Rocco Rodamaal' },
    tracks: null,
    links: [{ label: 'Buy / Stream', url: 'https://orcd.co/verticsystemcorrupt', primary: true }],
    cover: 'covers/system-corrupt.jpg',
    art: { style: 'glitch', palette: ['#0d0d0d', '#e8322b', '#f4f1ea', '#5a5a5a'] },
  },
  {
    id: 'voices-in-my-head',
    collection: 'tiik',
    title: 'Voices In My Head',
    type: 'EP',
    label: 'TIIK Records',
    date: null,
    genre: 'Afro House',
    blurb: 'An EP released with the TIIK Music Collective family. Out on Beatport, Traxsource, Bandcamp and every streaming platform.',
    tracks: null,
    links: [{ label: 'Buy / Stream', url: 'https://hypeddit.com/voicesinmyheadep', primary: true }],
    cover: null,
    art: { style: 'rings', palette: ['#efe6d4', '#1f4b43', '#e0702e', '#2a1d17'] },
  },
  {
    id: 'rainy-spirits',
    collection: 'debut',
    title: 'Rainy Spirits',
    type: 'EP',
    label: null,
    date: null,
    genre: 'Afro House',
    blurb:
      'Vertic’s solo debut: two Afro House cuts that blend tribal percussion, ethereal vocal textures and electronic depth.',
    tracks: null,
    links: [{ label: 'Traxsource', url: 'https://www.traxsource.com/title/2551696/rainy-spirits', primary: true }],
    cover: null,
    art: { style: 'rain', palette: ['#16324a', '#9cc7d6', '#f2d16b', '#0b1a26'] },
  },
  {
    id: 'surfaces',
    collection: 'signatures',
    title: 'Surfaces',
    type: 'Track',
    label: null,
    date: null,
    genre: 'Afro House',
    blurb: 'One of the records that defined the Vertic sound: depth, tension and movement.',
    tracks: null,
    links: [{ label: 'SoundCloud', url: 'https://soundcloud.com/vertic', primary: true }],
    cover: null,
    art: { style: 'waves', palette: ['#f3efe6', '#2b5d8a', '#d9a441', '#1a1a1a'] },
  },
  {
    id: '1996',
    collection: 'signatures',
    title: '1996',
    type: 'Track',
    label: null,
    date: null,
    genre: 'Afro House',
    blurb: 'A signature record, and one of the reasons other DJs started paying attention.',
    tracks: null,
    links: [{ label: 'SoundCloud', url: 'https://soundcloud.com/vertic', primary: true }],
    cover: null,
    art: { style: 'numerals', palette: ['#c8402f', '#f4ead8', '#1b1b1b', '#e9b53b'] },
  },
  {
    id: 'deep-narratives',
    collection: 'origins',
    title: 'Deep Narratives',
    type: 'Duo',
    label: null,
    date: null,
    genre: 'Deep / Afro House',
    blurb: 'Before Vertic went solo, he was one half of the acclaimed duo Deep Narratives.',
    tracks: null,
    links: [],
    cover: null,
    art: { style: 'duo', palette: ['#2f6b3a', '#efe7d6', '#c2462e', '#14261a'] },
  },
];
