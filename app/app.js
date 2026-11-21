// Leonida Trophy Guide — tracker + roadmap for the 55 GTA VI trophies.
// All data comes from app/data/trophies.json (official names/descriptions, our own guides).
// Progress lives in localStorage; export/import move it as a JSON file. No network at runtime.
const EARNED_KEY = 'leonida-trophy-earned-v1';
const SPOILER_KEY = 'leonida-trophy-spoiler-v1';

// Sources cited beside the guides, in the order the guide sites are named there.
const SOURCE_URLS = {
  'PowerPyx': 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
  'KeenGamer': 'https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/',
  'Push Square': 'https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap',
  'GTABase': 'https://www.ggrecon.com/articles/gta-6-trophies-achievements-list-platinum/',
  'vi.ki': 'https://gta6.vi.ki/missables',
  'planetgta6': 'https://www.planetgta6.com/en/gta-6-trophies/',
  'Mobalytics': 'https://mobalytics.gg/gamebase/guides/grand-theft-auto-6-all-trophies',
  'Exophase': 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
};

const ROADMAP_STEPS = [
  {
    title: 'Step 1 — Play the story',
    hours: '60–80 HOURS · 5 CHAPTERS',
    points: [
      'Finish Chapters 1–5 and the final mission; 12 story trophies pop on their own.',
      'Do the one possibly missable thing first: the balcony meditation with Lucia in Chapter 1 (see the warning above).',
      'Keep a manual save at the start of each chapter — there is no mission replay.',
      'Scan vehicles with WAiNK and study animals with the binoculars as you go; the checklist needs 200 vehicles and 100 animals.',
    ],
  },
  {
    title: 'Step 2 — The 100% checklist',
    hours: 'ABOUT 100 HOURS · AFTER THE STORY',
    points: [
      'Open Progress > Stats > 100% Completion once the credits roll.',
      'Clear the robbery lines: 39 Gang Operations, 22 Bank Jobs, 7 Payday Loan Jobs, 8 bank vaults.',
      'Clear the collectibles the checklist counts: 15 of 18 card sets, 100 WAiNK scans, 33 underwater finds, 100 of 125 Cocaine Flamingos.',
      'Finish the activity lines: 42 of 42 shooting-range golds, 42 of 42 drone trials, 300 of 397 stunts, 70 of 80 challenges.',
    ],
  },
  {
    title: 'Step 3 — Cleanup',
    hours: '10–20 HOURS · FREE-ROAM',
    points: [
      'Finish the stranger questlines: Andy, Kenton, Billy, Randy, Tyrone, and any 8 Strangers & Freaks strands.',
      'Mop up the remaining meditations for Positive Mental Attitude.',
      'Earn the combat, driving, robbery and money trophies left over.',
      'Vice Got a Price! pops when the other 54 are yours.',
    ],
  },
];

const CHECKLIST_GROUPS = [
  ['Main story', 'All 5 chapters'],
  ['Optional tasks', '100'],
  ['Gang Operations', '39 of 39'],
  ['Bank Jobs', '22 of 22'],
  ['Payday Loan Jobs', '7 of 7'],
  ['Smash ’N’ Grabs', '34 of 35'],
  ['Stick Ups', '50 of 91'],
  ['Bank Vaults', '8 of 8'],
  ['Narcotics fenced', '$100,000'],
  ['Jewelry fenced', '$100,000'],
  ['Marked Bills fenced', '$250,000'],
  ['Vehicles fenced', '$200,000'],
  ['Kenton’s Treasure Sets', '5 of 7'],
  ['Collectible Card Sets', '15 of 18'],
  ['WAiNK Locations', '100 scans'],
  ['Underwater Discoveries', '33 of 33'],
  ['Magazines, Books, Comics', '30 of 34'],
  ['Meditations', '15 of 18'],
  ['Cocaine Flamingos', '100 of 125'],
  ['Unique Playlists', '2 of 2'],
  ['Discovered Styles', '70 of 79'],
  ['Base-Model Vehicles', '200 of 277'],
  ['Standard Issue Weapons', '50 of 66'],
  ['Animals Studied', '100 of 255'],
  ['Unique Races Won', '30 of 40'],
  ['Race Challenge Golds', '10 of 13'],
  ['Shooting Range Golds', '42 of 42'],
  ['Video Games', 'Play all 4'],
  ['Pool Opponents', 'Defeat 5 of 7'],
  ['Mini Golf', 'Play at 2 of 3'],
  ['Basketball Hoops', 'Score at 90 of 100'],
  ['Drone Time Trials', '42 of 42'],
  ['Stunts', '300 of 397'],
  ['Challenges', '70 of 80'],
  ['Bret’s Target Decks', '15 of 15'],
];

const params = new URLSearchParams(location.search);
const $ = (id) => document.getElementById(id);

const listEl = $('trophyList');
const countLine = $('countLine');
const emptyNote = $('emptyNote');
const progressFill = $('progressFill');
const progressText = $('progressText');
const searchInput = $('search');
const kindSelect = $('kind');
const gradeSelect = $('grade');
const earnedFilter = $('earnedFilter');
const spoilerBox = $('spoiler');

let trophies = [];
let earned = new Set();
let openId = null;

try { earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]')); } catch { earned = new Set(); }
let spoilerOn = localStorage.getItem(SPOILER_KEY) === '1';

function saveEarned() {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned]));
}
function saveSpoiler() {
  localStorage.setItem(SPOILER_KEY, spoilerOn ? '1' : '0');
}

function trophyHiddenBySpoiler(t) {
  return spoilerOn && t.kind === 'story' && !earned.has(t.name);
}

function sourceLinks(names) {
  return names.map((n) => {
    const url = SOURCE_URLS[n];
    return url ? `<a href="${url}" target="_blank" rel="noopener">${n}</a>` : n;
  }).join(' · ');
}

function renderRoadmap() {
  $('roadmapSteps').replaceChildren(...ROADMAP_STEPS.map((s) => {
    const div = document.createElement('div');
    div.className = 'step';
    const h = document.createElement('h3');
    h.textContent = s.title;
    const hrs = document.createElement('p');
    hrs.className = 'hours';
    hrs.textContent = s.hours;
    const ul = document.createElement('ul');
    for (const p of s.points) {
      const li = document.createElement('li');
      li.textContent = p;
      ul.append(li);
    }
    div.append(h, hrs, ul);
    return div;
  }));
  $('checkGrid').replaceChildren(...CHECKLIST_GROUPS.map(([label, value]) => {
    const div = document.createElement('div');
    div.className = 'check-cell';
    const a = document.createElement('span');
    a.textContent = label;
    const b = document.createElement('b');
    b.textContent = value;
    div.append(a, b);
    return div;
  }));
}

function renderList() {
  const q = searchInput.value.trim().toLowerCase();
  const kind = kindSelect.value;
  const grade = gradeSelect.value;
  const show = earnedFilter.value;
  const visible = trophies.filter((t) => {
    if (kind === 'missable' && !t.missable) return false;
    if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
    if (kind === 'online') return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (show === 'earned' && !earned.has(t.name)) return false;
    if (show === 'remaining' && earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.guide.toLowerCase().includes(q))) return false;
    return true;
  });

  if (kind === 'online') {
    emptyNote.hidden = false;
    emptyNote.textContent = 'No online trophies: all 55 are offline single-player, and there is no online mode to wait for. (GTABase, PowerPyx, Exophase)';
  } else if (visible.length === 0) {
    emptyNote.hidden = false;
    emptyNote.textContent = 'Nothing matches these filters. Clear the search or pick another kind.';
  } else {
    emptyNote.hidden = true;
  }

  countLine.textContent = `Showing ${visible.length} of ${trophies.length} trophies · ${earned.size} earned`;
  progressFill.style.width = `${Math.round((earned.size / trophies.length) * 100)}%`;
  progressText.textContent = `${earned.size} of ${trophies.length} earned — ${Math.round((earned.size / trophies.length) * 100)}% to the platinum`;

  listEl.replaceChildren(...visible.map((t) => {
    const li = document.createElement('li');
    li.className = `trophy grade-${t.grade}${earned.has(t.name) ? ' earned' : ''}`;
    const isSpoiler = trophyHiddenBySpoiler(t);
    const isOpen = openId === t.id;

    const head = document.createElement('div');
    head.className = 'trophy-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Mark ${t.name} as earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveEarned();
      renderList();
    });
    const title = document.createElement('div');
    title.className = 'trophy-title';
    const h = document.createElement('h3');
    h.textContent = isSpoiler ? 'Hidden story trophy' : t.name;
    if (earned.has(t.name)) {
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = ' ✓';
      h.append(mark);
    }
    const desc = document.createElement('p');
    desc.textContent = isSpoiler ? 'Hidden until earned — tick it off once you have earned it in-game.' : t.description;
    title.append(h, desc);
    const chips = document.createElement('div');
    chips.className = 'chips';
    const gradeChip = document.createElement('span');
    gradeChip.className = `chip ${t.grade}`;
    gradeChip.textContent = t.grade;
    chips.append(gradeChip);
    const kindChip = document.createElement('span');
    kindChip.className = 'chip kind';
    kindChip.textContent = t.kind;
    chips.append(kindChip);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'chip missable';
      m.textContent = '⚠ Missable';
      chips.append(m);
    }
    const stageChip = document.createElement('span');
    stageChip.className = 'chip';
    stageChip.textContent = t.stage === 1 ? 'Roadmap 1' : t.stage === 2 ? 'Roadmap 2' : 'Roadmap 3';
    chips.append(stageChip);
    head.append(box, title, chips);
    head.addEventListener('click', () => {
      openId = isOpen ? null : t.id;
      renderList();
    });
    li.append(head);

    if (isOpen && !isSpoiler) {
      const detail = document.createElement('div');
      detail.className = 'trophy-detail';
      const label = document.createElement('p');
      label.className = 'guide-label';
      label.textContent = 'GUIDE';
      const guide = document.createElement('p');
      guide.textContent = t.guide;
      const src = document.createElement('p');
      src.className = 'sources';
      src.innerHTML = `<strong>Sources:</strong> ${sourceLinks(t.sources)}`;
      detail.append(label, guide, src);
      li.append(detail);
    } else if (isOpen && isSpoiler) {
      const detail = document.createElement('div');
      detail.className = 'trophy-detail';
      const p = document.createElement('p');
      p.className = 'spoiler-note';
      p.textContent = 'This guide names story missions, so it stays hidden while spoilers are on. Earn the trophy, or turn spoilers off, to read it.';
      detail.append(p);
      li.append(detail);
    }
    return li;
  }));
}

function showView(name) {
  $('listView').hidden = name !== 'list';
  $('roadmapView').hidden = name !== 'roadmap';
  $('tabList').classList.toggle('active', name === 'list');
  $('tabRoadmap').classList.toggle('active', name === 'roadmap');
}

$('tabList').addEventListener('click', () => showView('list'));
$('tabRoadmap').addEventListener('click', () => showView('roadmap'));
searchInput.addEventListener('input', renderList);
kindSelect.addEventListener('change', renderList);
gradeSelect.addEventListener('change', renderList);
earnedFilter.addEventListener('change', renderList);
spoilerBox.addEventListener('change', () => {
  spoilerOn = spoilerBox.checked;
  saveSpoiler();
  renderList();
});

$('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earned] };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = new Set(trophies.map((t) => t.name));
    const incoming = Array.isArray(data) ? data : data.earned;
    earned = new Set((incoming || []).filter((n) => names.has(n)));
    saveEarned();
    renderList();
  } catch {
    emptyNote.hidden = false;
    emptyNote.textContent = 'That file could not be imported — it is not a progress file this guide wrote.';
  }
  e.target.value = '';
});

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;

// Query-string state, for deep links and screenshots: ?view=roadmap, ?filter=missable,
// ?spoiler=on, ?demo=1 (a mid-progress checklist), ?open=<trophy id>.
if (params.get('view') === 'roadmap') showView('roadmap');
if (params.get('filter')) kindSelect.value = params.get('filter');
if (params.get('spoiler') === 'on') spoilerOn = true;
if (params.get('demo') === '1') {
  for (const id of [2, 3, 4, 5, 6, 7, 8, 15, 17, 20, 21, 35]) {
    const t = trophies.find((x) => x.id === id);
    if (t) earned.add(t.name);
  }
  saveEarned();
}
if (params.get('open')) openId = Number(params.get('open'));
spoilerBox.checked = spoilerOn;
renderRoadmap();
renderList();
$('sourceList').innerHTML = `Sources used across this guide: ${sourceLinks(Object.keys(SOURCE_URLS))}. Official trophy names and descriptions: PlayStation, as listed by Exophase and cross-checked with PSNProfiles (planetgta6).`;
window.__shotReady = true;
