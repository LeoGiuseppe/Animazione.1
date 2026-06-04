// ======================= MAP =======================
// Griglia di gioco — Tile: 0 = vuoto, 1 = solido
// VERSIONE AGGIORNATA: fix connessioni zone, piattaforme raggiungibili, item/checkpoint coerenti

var MAP_W = 150;
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

// =====================================================================
// ---- START (cols 0-14) ----
// FIX: aggiunta scala di piattaforme graduate per salire verso Submerged Caves
// =====================================================================
fillRect(0, MAP_H - 8, 14, 1);          // piano START
fillRect(0, MAP_H - 8, 1, 6);           // muro sinistro
fillRect(3, MAP_H - 11, 5, 1);          // piattaforma 1 salita (alzata di 3)
fillRect(6, MAP_H - 14, 5, 1);          // piattaforma 2 salita (alzata di 3)
fillRect(9, MAP_H - 17, 5, 1);          // piattaforma 3 — collega al piano Submerged Caves
// (il piano Submerged Caves è a MAP_H-22; dalla piattaforma 3 a MAP_H-17 con
//  un salto normale si raggiunge la piattaforma a MAP_H-22 tramite la piattaforma 4)
fillRect(11, MAP_H - 20, 4, 1);         // piattaforma 4 — gradino finale prima del piano superiore

// =====================================================================
// ---- ANCIENT RUINS (cols 14-35) ----
// FIX: pavimento raccordato con START, piattaforme interne più scalabili
// =====================================================================
fillRect(14, MAP_H - 8, 22, 1);         // piano principale (continua da START)
fillRect(14, MAP_H - 8, 1, 6);          // muro sinistra
fillRect(17, MAP_H - 12, 5, 1);         // piattaforma bassa sinistra
fillRect(23, MAP_H - 16, 6, 1);         // piattaforma media centrale (accorciata di 1 per gap)
fillRect(30, MAP_H - 12, 5, 1);         // piattaforma bassa destra — FIX posizione (era col 28, sovrapposta)
fillRect(14, MAP_H - 20, 22, 1);        // soffitto/piano superiore (accesso Submerged Caves sx)

// =====================================================================
// ---- SUBMERGED CAVES D1 (cols 0-14, area alta) ----
// FIX: muro perimetrale chiuso, piattaforme interne accessibili
// =====================================================================
fillRect(0, MAP_H - 22, 14, 1);         // piano inferiore cave
fillRect(0, MAP_H - 22, 1, 14);         // muro sinistro (fino al tetto)
fillRect(13, MAP_H - 22, 1, 2);         // muretto destra basso (lascia apertura sopra per tornare)
fillRect(4, MAP_H - 26, 8, 1);          // piattaforma media
fillRect(2, MAP_H - 30, 6, 1);          // piattaforma alta sinistra (spostata a col 2 per raggiungibilità)
fillRect(8, MAP_H - 33, 5, 1);          // piattaforma apicale (keyitem ◆ sopra)

// =====================================================================
// ---- HUB (cols 36-60) ----
// FIX: aggiunto collegamento verticale scala dal piano basso (MAP_H-8)
//      al piano superiore (MAP_H-20) senza richiedere High Jump
// =====================================================================
fillRect(36, MAP_H - 8, 25, 1);         // piano basso Hub
fillRect(36, MAP_H - 20, 25, 1);        // piano alto Hub
fillRect(36, MAP_H - 20, 1, 10);        // muro sinistro Hub
fillRect(60, MAP_H - 20, 1, 10);        // muro destro Hub
// Scala interna Hub: 3 piattaforme graduate per salire da MAP_H-8 a MAP_H-20
fillRect(39, MAP_H - 12, 6, 1);         // gradino 1 (era MAP_H-13, aggiustato)
fillRect(46, MAP_H - 15, 6, 1);         // gradino 2
fillRect(52, MAP_H - 18, 6, 1);         // gradino 3 — da qui si salta sul piano a MAP_H-20

// =====================================================================
// ---- STARTING CASTRUM A1 (cols 36-55, alto) ----
// =====================================================================
fillRect(36, MAP_H - 28, 20, 1);
fillRect(36, MAP_H - 28, 1, 6);
fillRect(55, MAP_H - 28, 1, 6);
fillRect(40, MAP_H - 32, 12, 1);
// FIX save point: piattaforma dedicata sotto il save (col 40, MAP_H-29 era sopra il soffitto)
// Il save viene spostato a col 42, row MAP_H-29 sopra la piattaforma a MAP_H-28 ✓ (già ok)

// =====================================================================
// ---- B2 CORRIDOR (cols 56-72, alto) ----
// =====================================================================
fillRect(56, MAP_H - 28, 17, 1);
fillRect(56, MAP_H - 28, 1, 6);
fillRect(72, MAP_H - 28, 1, 6);
fillRect(59, MAP_H - 32, 8, 1);

// =====================================================================
// ---- RESEARCH LAB B1 (cols 61-80) ----
// FIX: aggiunta scala interna (come nel Hub)
// =====================================================================
fillRect(61, MAP_H - 8, 20, 1);
fillRect(61, MAP_H - 20, 20, 1);
fillRect(61, MAP_H - 20, 1, 10);
// Scala interna Research Lab
fillRect(64, MAP_H - 12, 6, 1);         // gradino 1
fillRect(71, MAP_H - 16, 6, 1);         // gradino 2 — porta al piano alto

// =====================================================================
// ---- HIGH-TECH HALLWAY B3 (cols 73-90, alto) ----
// =====================================================================
fillRect(73, MAP_H - 28, 18, 1);
fillRect(73, MAP_H - 28, 1, 6);
fillRect(90, MAP_H - 28, 1, 6);
fillRect(76, MAP_H - 32, 10, 1);

// =====================================================================
// ---- OPTIONAL LOOP B4 (cols 91-108, alto) ----
// =====================================================================
fillRect(91, MAP_H - 28, 18, 1);
fillRect(91, MAP_H - 28, 1, 6);
fillRect(108, MAP_H - 28, 1, 6);
fillRect(95, MAP_H - 32, 10, 1);
fillRect(100, MAP_H - 35, 6, 1);

// =====================================================================
// ---- MINIBOSS ARENA C1 (cols 81-96) ----
// FIX: muro a col 96 con apertura in basso per passare alla Final Boss Arena
// =====================================================================
fillRect(81, MAP_H - 8, 16, 1);
fillRect(81, MAP_H - 20, 16, 1);
fillRect(81, MAP_H - 20, 1, 10);
// FIX: muro divisore a col 96 con apertura (lascia liberi i 4 tile bassi per passare)
fillRect(96, MAP_H - 20, 1, 6);         // muro alto (da MAP_H-20 a MAP_H-14) — apertura sotto!
fillRect(84, MAP_H - 13, 5, 1);
fillRect(90, MAP_H - 13, 5, 1);

// =====================================================================
// ---- FINAL BOSS ARENA (cols 97-149) ----
// FIX: piattaforma sotto il High Jump item (col 107, MAP_H-17)
//      piattaforme più graduate per sfruttare la verticalità
// =====================================================================
fillRect(97, MAP_H - 8, 53, 1);         // pavimento arena
fillRect(97, MAP_H - 35, 52, 1);        // soffitto arena (lascia col 149 al muro)
fillRect(149, MAP_H - 35, 1, 28);       // muro fine mappa

// Piattaforme arena — FIX: aggiunta piattaforma sotto High Jump item
fillRect(105, MAP_H - 16, 8, 1);        // piattaforma sinistra (include col 107 per High Jump ★)
// Piattaforma di collegamento per rendere raggiungibile la zona dal Miniboss
fillRect(97, MAP_H - 13, 8, 1);         // ponte graduale verso sinistra (cols 97-104)
fillRect(118, MAP_H - 22, 8, 1);        // piattaforma centrale
fillRect(130, MAP_H - 16, 8, 1);        // piattaforma destra bassa
fillRect(140, MAP_H - 26, 8, 1);        // piattaforma alta finale

// =====================================================================
// ---- ZONE DEFINITIONS ----
// =====================================================================
var zones = [
  { name: "START",             x1: 0,   x2: 14,  y1: MAP_H - 10, y2: MAP_H },
  { name: "Ancient Ruins",     x1: 14,  x2: 36,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Submerged Caves",   x1: 0,   x2: 14,  y1: 0,          y2: MAP_H - 10 },
  { name: "Hub",               x1: 36,  x2: 61,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Starting Castrum",  x1: 36,  x2: 56,  y1: 0,          y2: MAP_H - 20 },
  { name: "B2 Corridor",       x1: 56,  x2: 73,  y1: 0,          y2: MAP_H - 20 },
  { name: "Research Lab",      x1: 61,  x2: 81,  y1: MAP_H - 22, y2: MAP_H },
  { name: "High-Tech Hallway", x1: 73,  x2: 91,  y1: 0,          y2: MAP_H - 20 },
  { name: "Optional Loop",     x1: 91,  x2: 109, y1: 0,          y2: MAP_H - 20 },
  { name: "Miniboss Arena",    x1: 81,  x2: 97,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Final Boss Arena",  x1: 97,  x2: 150, y1: 0,          y2: MAP_H },
];

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
  'Final Boss Arena':  '#3a0000',
};

function getTileColor(c, r) {
  for (var i = 0; i < zones.length; i++) {
    var z = zones[i];
    if (c >= z.x1 && c < z.x2 && r >= z.y1 && r < z.y2)
      return zoneColors[z.name] || '#444';
  }
  return '#3a3a3a';
}

function isSolidTile(r, c) {
  return map[r] && map[r][c] === 1;
}
