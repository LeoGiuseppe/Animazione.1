// Programmatic map generator to approximate the 'expanded' Metroidvania layout
// 1 = wall/platform, 0 = empty
var MAP_W = 100;
var MAP_H = 34;

function makeGrid(w,h,fill){
  var g = [];
  for(var r=0;r<h;r++){
    var row = [];
    for(var c=0;c<w;c++) row.push(fill);
    g.push(row);
  }
  return g;
}

var map = makeGrid(MAP_W, MAP_H, 0);

// Helper to draw a filled rectangle of 1s
function fillRect(x,y,w,h){
  for(var r=y; r<y+h; r++){
    if(r<0||r>=MAP_H) continue;
    for(var c=x; c<x+w; c++){
      if(c<0||c>=MAP_W) continue;
      map[r][c] = 1;
    }
  }
}

// Floor across bottom
fillRect(0, MAP_H-1, MAP_W, 1);

// START area (left)
fillRect(2, MAP_H-8, 10, 1); // small platform (moved down for spacing)
map[MAP_H-9][6] = 1; // small ceiling to hint room (moved)

// Ancient Ruins (E1) early area with morph ball star (platform cluster)
fillRect(20, MAP_H-11, 12, 1);
fillRect(20, MAP_H-14, 4, 1);

// Left branch - Submerged Caves (D1)
fillRect(2, MAP_H-15, 10, 1);
fillRect(0, MAP_H-16, 1, 12); // left wall (moved up)

// Hub (central large oval approximated with rectangular platforms)
fillRect(44, MAP_H-12, 18, 1);
fillRect(46, MAP_H-15, 14, 1);
fillRect(50, MAP_H-18, 6, 1);

// Research Lab (B1/C1) to the right of hub
fillRect(72, MAP_H-13, 12, 1);
fillRect(74, MAP_H-16, 8, 1);

// High-Tech Hallway and Optional Loop (top-right)
fillRect(74, MAP_H-26, 12, 1);
fillRect(84, MAP_H-26, 8, 1);

// Miniboss Arena (C1) below research
fillRect(70, MAP_H-11, 10, 1);

// High-Tech Lab (C2) further right bottom
fillRect(86, MAP_H-11, 6, 1);

// Connections and gates (red gates are just small solid blocks representing doors)
// Morph Ball gate between Ancient Ruins and Hub
fillRect(38, MAP_H-12, 2, 1); // gate (moved)

// Gate to Miniboss (require ability) - small block
fillRect(68, MAP_H-11, 2, 1);

// Make some intermediate platforms to create traversal
fillRect(30, MAP_H-15, 6, 1);
fillRect(60, MAP_H-16, 6, 1);
fillRect(66, MAP_H-9, 8, 1);

// Add walls/room boundaries (visual blocks)
fillRect(42, MAP_H-20, 1, 9); // left hub wall (moved)
fillRect(66, MAP_H-20, 1, 12); // right hub wall (moved)

// Small checkpoints / save terminals represented by small platforms
fillRect(10, MAP_H-18, 2, 1); // save near submerged caves
fillRect(48, MAP_H-20, 2, 1); // save near hub top
fillRect(80, MAP_H-27, 2, 1); // save top-right

// Ensure all rooms have some floor
fillRect(8, MAP_H-8, 8, 1);

var tileSize = 50; // default
var tilePadding = 0;

function setTileSize() {
    var maxWidth = window.innerWidth - 40;
    var maxHeight = window.innerHeight - 40;
    tileSize = Math.min(
      60,
      Math.max(30, Math.min(
        Math.floor(maxWidth / map[0].length),
        Math.floor(maxHeight / map.length)
      ))
    );
}
