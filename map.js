// ======================= MAP =======================
// Griglia di gioco ispirata al layout Metroidvania 101
// Tile: 0 = vuoto, 1 = solido

var MAP_W = 120;
var MAP_H = 36;

function makeGrid(w, h, fill) {
  var g = [];
  for (var r = 0; r < h; r++) {
    var row = [];
    for (var c = 0; c < w; c++) row.push(fill);
    g.push(row);
  }
  return g;
}

var map = makeGrid(MAP_W, MAP_H, 0);

function fillRect(x, y, w, h, val) {
  val = val || 1;
  for (var r = y; r < y + h; r++) {
    if (r < 0 || r >= MAP_H) continue;
    for (var c = x; c < x + w; c++) {
      if (c < 0 || c >= MAP_W) continue;
      map[r][c] = val;
    }
  }
}

// ---- PAVIMENTO GLOBALE ----
fillRect(0, MAP_H - 1, MAP_W, 1);

// ---- START (cols 0-14) ----
fillRect(0, MAP_H - 8, 14, 1);
fillRect(0, MAP_H - 8, 1, 8);        // muro sinistro
fillRect(3, MAP_H - 11, 6, 1);       // piattaforma bassa
fillRect(6, MAP_H - 14, 6, 1);       // piattaforma alta

// ---- ANCIENT RUINS E1 (cols 14-35) ----
// NOTE: rimosso il muro destra a col 35 per permettere il passaggio verso Hub
fillRect(14, MAP_H - 8, 22, 1);      // pavimento zona
fillRect(14, MAP_H - 8, 1, 8);       // muro sinistra
// Col 35 NON ha più un muro — passaggio libero verso Hub
fillRect(17, MAP_H - 12, 5, 1);
fillRect(23, MAP_H - 16, 7, 1);      // piattaforma alta — Morph Ball item
fillRect(28, MAP_H - 12, 5, 1);
fillRect(14, MAP_H - 20, 22, 1);     // soffitto parziale

// ---- SUBMERGED CAVES D1 (cols 0-14, area alta) ----
fillRect(0, MAP_H - 22, 14, 1);
fillRect(0, MAP_H - 22, 1, 14);
fillRect(13, MAP_H - 22, 1, 7);
fillRect(4, MAP_H - 26, 8, 1);
fillRect(4, MAP_H - 30, 6, 1);

// ---- HUB (cols 36-60) ----
fillRect(36, MAP_H - 8, 25, 1);
fillRect(36, MAP_H - 20, 25, 1);
fillRect(36, MAP_H - 20, 1, 12);
fillRect(60, MAP_H - 20, 1, 12);
fillRect(39, MAP_H - 13, 8, 1);
fillRect(50, MAP_H - 13, 8, 1);
fillRect(43, MAP_H - 17, 6, 1);

// ---- STARTING CASTRUM A1 (cols 36-55, alto) ----
fillRect(36, MAP_H - 28, 20, 1);
fillRect(36, MAP_H - 28, 1, 8);
fillRect(55, MAP_H - 28, 1, 8);
fillRect(40, MAP_H - 32, 12, 1);

// ---- B2 CORRIDOR (cols 56-72, alto) ----
fillRect(56, MAP_H - 28, 17, 1);
fillRect(56, MAP_H - 28, 1, 8);
fillRect(72, MAP_H - 28, 1, 8);
fillRect(59, MAP_H - 32, 8, 1);

// ---- RESEARCH LAB B1 (cols 61-80) ----
// NOTE: rimosso muro destra a col 80 per permettere passaggio verso Miniboss Arena
fillRect(61, MAP_H - 8, 20, 1);      // pavimento zona
fillRect(61, MAP_H - 20, 20, 1);
fillRect(61, MAP_H - 20, 1, 12);     // muro sinistra
// Col 80 NON ha più un muro — passaggio libero verso Miniboss Arena
fillRect(64, MAP_H - 13, 7, 1);
fillRect(73, MAP_H - 13, 5, 1);

// ---- HIGH-TECH HALLWAY B3 (cols 73-90, alto) ----
fillRect(73, MAP_H - 28, 18, 1);
fillRect(73, MAP_H - 28, 1, 8);
fillRect(90, MAP_H - 28, 1, 8);
fillRect(76, MAP_H - 32, 10, 1);

// ---- OPTIONAL LOOP B4 (cols 91-108, alto) ----
fillRect(91, MAP_H - 28, 18, 1);
fillRect(91, MAP_H - 28, 1, 8);
fillRect(108, MAP_H - 28, 1, 8);
fillRect(95, MAP_H - 32, 10, 1);
fillRect(100, MAP_H - 35, 6, 1);

// ---- MINIBOSS ARENA C1 (cols 81-96) ----
fillRect(81, MAP_H - 8, 16, 1);
fillRect(81, MAP_H - 20, 16, 1);
fillRect(81, MAP_H - 20, 1, 12);
fillRect(96, MAP_H - 20, 1, 12);
fillRect(84, MAP_H - 13, 5, 1);
fillRect(90, MAP_H - 13, 5, 1);

// ---- HIGH-TECH LAB C2 (cols 97-112) ----
fillRect(97, MAP_H - 8, 16, 1);
fillRect(97, MAP_H - 20, 16, 1);
fillRect(97, MAP_H - 20, 1, 12);
fillRect(112, MAP_H - 20, 1, 12);
fillRect(100, MAP_H - 13, 6, 1);
fillRect(106, MAP_H - 16, 5, 1);

// ---- FINAL BOSS ARENA (cols 113-119) ----
fillRect(113, MAP_H - 8, 7, 1);
fillRect(113, MAP_H - 22, 7, 1);
fillRect(113, MAP_H - 22, 1, 14);
fillRect(119, MAP_H - 22, 1, 14);
fillRect(114, MAP_H - 14, 5, 1);

// ---- TUNNEL DI CONNESSIONE ----
fillRect(12, MAP_H - 20, 3, 1);      // start → ruins (alto)
fillRect(7, MAP_H - 22, 1, 3);       // submerged caves → ancient ruins

// ---- PASSAGGI TRA ZONE (pavimento di transizione) ----
// Passaggio Ancient Ruins → Hub (col 35-36, riga pavimento)
// Nessun muro a col 35 e 36, il pavimento globale copre già MAP_H-1
// ma il pavimento delle zone finisce a col 35 e inizia a col 36 — aggiunge tile di connessione
fillRect(35, MAP_H - 8, 2, 1);       // raccordo pavimento Ruins-Hub

// Passaggio Research Lab → Miniboss Arena (col 80-81)
fillRect(80, MAP_H - 8, 2, 1);       // raccordo pavimento Lab-Miniboss

// ======================= ZONE DEFINITIONS =======================
var zones = [
  { name: "START",             x1: 0,   x2: 14,  y1: MAP_H - 10, y2: MAP_H },
  { name: "Ancient Ruins",     x1: 14,  x2: 36,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Submerged Caves",   x1: 0,   x2: 14,  y1: 0,          y2: MAP_H - 10 },
  { name: "Hub",               x1: 36,  x2: 61,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Starting Castrum",  x1: 36,  x2: 56,  y1: 0,          y2: MAP_H - 20 },
  { name: "B2 Corridor",       x1: 56,  x2: 73,  y1: 0,          y2: MAP_H - 20 },
  { name: "Research Lab",      x1: 61,  x2: 81,  y1: MAP_H - 22, y2: MAP_H },
  { name: "High-Tech Hallway", x1: 73,  x2: 91,  y1: 0,          y2: MAP_H - 20 },
  { name: "Optional Loop",     x1: 91,  x2: 113, y1: 0,          y2: MAP_H - 20 },
  { name: "Miniboss Arena",    x1: 81,  x2: 97,  y1: MAP_H - 22, y2: MAP_H },
  { name: "High-Tech Lab",     x1: 97,  x2: 113, y1: MAP_H - 22, y2: MAP_H },
  { name: "Final Boss Arena",  x1: 113, x2: 120, y1: MAP_H - 24, y2: MAP_H },
];

// Colori per zona (usati per colorare i tile)
var zoneColors = {
  'START':             '#2c3e50',
  'Ancient Ruins':     '#4a235a',
  'Submerged Caves':   '#1a3a5c',
  'Hub':               '#1c3a2a',
  'Starting Castrum':  '#3d3400',
  'B2 Corridor':       '#333333',
  'Research Lab':      '#0d2b3a',
  'High-Tech Hallway': '#1a2a1a',
  'Optional Loop':     '#2a1a2a',
  'Miniboss Arena':    '#3a1a1a',
  'High-Tech Lab':     '#1a2a3a',
  'Final Boss Arena':  '#3a0000',
};

// Restituisce il colore del tile in base alla zona
function getTileColor(c, r) {
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (c >= z.x1 && c < z.x2 && r >= z.y1 && r < z.y2)
      return zoneColors[z.name] || '#444';
  }
  return '#3a3a3a';
}

// Tile solido? (solo tipo 1 — tipo 2 (gate) rimosso, non più usato)
function isSolidTile(r, c) {
  return map[r] && map[r][c] === 1;
}
