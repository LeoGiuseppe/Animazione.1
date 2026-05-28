// ======================= MAP =======================
// Griglia di gioco modificata con spiragli verticali per passare tra le zone sopra/sotto.
// Tile: 0 = vuoto, 1 = solido

var MAP_W = 150; // <-- Aumentato da 120 a 150 per allargare la mappa complessiva
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
fillRect(0, MAP_H - 8, 1, 6);        
fillRect(3, MAP_H - 11, 6, 1);       
fillRect(6, MAP_H - 14, 6, 1);       

// ---- ANCIENT RUINS E1 (cols 14-35) ----
fillRect(14, MAP_H - 8, 22, 1);      
fillRect(14, MAP_H - 8, 1, 6);       
fillRect(17, MAP_H - 12, 5, 1);
fillRect(23, MAP_H - 16, 7, 1);      
fillRect(28, MAP_H - 12, 5, 1);
fillRect(14, MAP_H - 20, 22, 1);     

// ---- SUBMERGED CAVES D1 (cols 0-14, area alta) ----
fillRect(0, MAP_H - 22, 14, 1);
fillRect(0, MAP_H - 22, 1, 14);
fillRect(13, MAP_H - 22, 1, 5);     
fillRect(4, MAP_H - 26, 8, 1);
fillRect(4, MAP_H - 30, 6, 1);

// ---- HUB (cols 36-60) ----
fillRect(36, MAP_H - 8, 25, 1);
fillRect(36, MAP_H - 20, 25, 1);
fillRect(36, MAP_H - 20, 1, 10);    
fillRect(60, MAP_H - 20, 1, 10);    
fillRect(39, MAP_H - 13, 8, 1);
fillRect(50, MAP_H - 13, 8, 1);
fillRect(43, MAP_H - 17, 6, 1);

// ---- STARTING CASTRUM A1 (cols 36-55, alto) ----
fillRect(36, MAP_H - 28, 20, 1);
fillRect(36, MAP_H - 28, 1, 6);     
fillRect(55, MAP_H - 28, 1, 6);     
fillRect(40, MAP_H - 32, 12, 1);

// ---- B2 CORRIDOR (cols 56-72, alto) ----
fillRect(56, MAP_H - 28, 17, 1);
fillRect(56, MAP_H - 28, 1, 6);     
fillRect(72, MAP_H - 28, 1, 6);     
fillRect(59, MAP_H - 32, 8, 1);

// ---- RESEARCH LAB B1 (cols 61-80) ----
fillRect(61, MAP_H - 8, 20, 1);      
fillRect(61, MAP_H - 20, 20, 1);
fillRect(61, MAP_H - 20, 1, 10);    
fillRect(64, MAP_H - 13, 7, 1);
fillRect(73, MAP_H - 13, 5, 1);

// ---- HIGH-TECH HALLWAY B3 (cols 73-90, alto) ----
fillRect(73, MAP_H - 28, 18, 1);
fillRect(73, MAP_H - 28, 1, 6);     
fillRect(90, MAP_H - 28, 1, 6);     
fillRect(76, MAP_H - 32, 10, 1);

// ---- OPTIONAL LOOP B4 (cols 91-108, alto) ----
fillRect(91, MAP_H - 28, 18, 1);
fillRect(91, MAP_H - 28, 1, 6);     
fillRect(108, MAP_H - 28, 1, 6);    
fillRect(95, MAP_H - 32, 10, 1);
fillRect(100, MAP_H - 35, 6, 1);

// ---- MINIBOSS ARENA C1 (cols 81-96) ----
fillRect(81, MAP_H - 8, 16, 1);
fillRect(81, MAP_H - 20, 16, 1);
fillRect(81, MAP_H - 20, 1, 10);    
fillRect(96, MAP_H - 20, 1, 10);    
fillRect(84, MAP_H - 13, 5, 1);
fillRect(90, MAP_H - 13, 5, 1);

// ---- HIGH-TECH LAB C2 (cols 97-112) ----
fillRect(97, MAP_H - 8, 16, 1);
fillRect(97, MAP_H - 20, 16, 1);
fillRect(97, MAP_H - 20, 1, 10);    
fillRect(112, MAP_H - 20, 1, 10);   
fillRect(100, MAP_H - 13, 6, 1);
fillRect(106, MAP_H - 16, 5, 1);

// ---- FINAL BOSS ARENA (Estesa massicciamente da colonna 100 a 150) ----
fillRect(100, MAP_H - 8, 50, 1);     // Pavimento dell'arena allargato a 50 blocchi di lunghezza
fillRect(100, MAP_H - 35, 50, 1);    // Soffitto dell'arena molto alto
fillRect(149, MAP_H - 35, 1, 28);    // Nuovo muro di fine mappa riposizionato alla colonna 149

// Piattaforme fluttuanti all'interno della grande arena per sfruttare la verticalità
fillRect(110, MAP_H - 16, 8, 1);     
fillRect(125, MAP_H - 22, 10, 1);    
fillRect(138, MAP_H - 14, 8, 1);     

// ======================= ZONE DEFINITIONS =======================
// Aggiorna i confini delle ultime zone per coprire le nuove colonne della mappa
var zones = [
  { name: "START",             x1: 0,   x2: 14,  y1: MAP_H - 10, y2: MAP_H },
  { name: "Ancient Ruins",     x1: 14,  x2: 36,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Submerged Caves",   x1: 0,   x2: 14,  y1: 0,          y2: MAP_H - 10 },
  { name: "Hub",               x1: 36,  x2: 61,  y1: MAP_H - 22, y2: MAP_H },
  { name: "Starting Castrum",  x1: 36,  x2: 56,  y1: 0,          y2: MAP_H - 20 },
  { name: "B2 Corridor",       x1: 56,  x2: 73,  y1: 0,          y2: MAP_H - 20 },
  { name: "Research Lab",      x1: 61,  x2: 81,  y1: MAP_H - 22, y2: MAP_H },
  { name: "High-Tech Hallway", x1: 73,  x2: 91,  y1: 0,          y2: MAP_H - 20 },
  { name: "Optional Loop",     x1: 91,  x2: 100, y1: 0,          y2: MAP_H - 20 },
  { name: "Miniboss Arena",    x1: 81,  x2: 97,  y1: MAP_H - 22, y2: MAP_H },
  { name: "High-Tech Lab",     x1: 97,  x2: 100, y1: MAP_H - 22, y2: MAP_H },
  { name: "Final Boss Arena",  x1: 100, x2: 150, y1: 0,          y2: MAP_H }, // Zona estesa fino a colonna 150
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
  'High-Tech Lab':     '#1a2a3a',
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