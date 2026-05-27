// ======================= NEMICI =======================
// Factory createEnemy() genera un nemico con fisica,
// pattugliamento, animazione sprite e HP.
// Il array enemies contiene tutti i nemici della mappa.

function createEnemy(startCol, startRow, color, spd, dir, lives) {
  lives = lives || 3;
  return {
    x: 0, y: 0,
    width: 36, height: 36,
    color: color,
    speedX: spd,
    direction: dir,
    facing: dir >= 0 ? 1 : -1,
    speedY: 0,
    gravity: 0.5,

    runImages:  [],
    idleImages: [],
    contaFrame:  0,
    actualFrame: 0,
    image: null,

    lives: lives,
    maxLives: lives,
    hitCooldown: 0,
    dead: false,

    startCol:       startCol,
    startRow:       startRow,
    startDirection: dir,

    // --------------------------------------------------
    update: function () {
      if (this.dead) return;
      if (this.hitCooldown > 0) this.hitCooldown--;

      // Movimento orizzontale
      this.x += this.speedX * this.direction;
      this.facing = this.direction >= 0 ? 1 : -1;

      var lc = Math.floor(this.x / tileSize);
      var rc = Math.floor((this.x + this.width - 1) / tileSize);
      var tr = Math.floor(this.y / tileSize);
      var br = Math.floor((this.y + this.height - 1) / tileSize);

      if (this.direction < 0) {
        if (isSolidTile(tr, lc) || isSolidTile(br, lc)) {
          this.direction = 1;
          this.x = (lc + 1) * tileSize;
        }
      } else if (this.direction > 0) {
        if (isSolidTile(tr, rc) || isSolidTile(br, rc)) {
          this.direction = -1;
          this.x = rc * tileSize - this.width;
        }
      }

      // Gravità
      this.speedY += this.gravity;
      this.y += this.speedY;
      lc = Math.floor(this.x / tileSize);
      rc = Math.floor((this.x + this.width - 1) / tileSize);
      br = Math.floor((this.y + this.height - 1) / tileSize);
      if (isSolidTile(br, lc) || isSolidTile(br, rc)) {
        this.y = br * tileSize - this.height;
        this.speedY = 0;
      }

      // Bordi mappa
      var maxX = map[0].length * tileSize - this.width;
      if (this.x < 0)    { this.x = 0;    this.direction =  1; }
      if (this.x > maxX) { this.x = maxX; this.direction = -1; }

      // Animazione
      if (this.runImages.length > 0) {
        this.contaFrame++;
        if (this.contaFrame === 7) {
          this.contaFrame  = 0;
          this.actualFrame = (this.actualFrame + 1) % this.runImages.length;
          this.image       = this.runImages[this.actualFrame];
        }
      }
    },

    // --------------------------------------------------
    loadImages: function () {
      var self = this;
      running.forEach(function (s) {
        var img = new Image(self.width, self.height);
        img.src = s;
        self.runImages.push(img);
      });
      idle.forEach(function (s) {
        var img = new Image(self.width, self.height);
        img.src = s;
        self.idleImages.push(img);
      });
      this.image = this.idleImages[0] || null;
    },

    // --------------------------------------------------
    resetPosition: function () {
      this.x         = this.startCol * tileSize;
      this.y         = this.startRow * tileSize - this.height;
      this.direction = this.startDirection;
      this.facing    = this.startDirection >= 0 ? 1 : -1;
      this.speedY    = 0;
      this.lives     = this.maxLives;
      this.dead      = false;
      this.hitCooldown = 0;
    }
  };
}

// ======================= LISTA NEMICI =======================
var enemies = [
  // Ancient Ruins — pattuglie lente
  createEnemy(16,  MAP_H - 9,  '#8e2020', 2,  1,  3),
  createEnemy(25,  MAP_H - 9,  '#8e2020', 2, -1,  3),

  // Hub — guardie medie
  createEnemy(38,  MAP_H - 9,  '#1a5276', 3,  1,  4),
  createEnemy(50,  MAP_H - 9,  '#1a5276', 3, -1,  4),

  // Research Lab
  createEnemy(64,  MAP_H - 9,  '#1a6b3c', 2,  1,  3),
  createEnemy(73,  MAP_H - 9,  '#1a6b3c', 2, -1,  3),

  // Miniboss Arena — Sentinel Drone (veloci, più HP)
  createEnemy(83,  MAP_H - 9,  '#7d3c98', 4,  1,  6),
  createEnemy(88,  MAP_H - 9,  '#7d3c98', 4, -1,  6),

  // High-Tech Lab
  createEnemy(100, MAP_H - 9,  '#0e6655', 3,  1,  4),

  // Final Boss Arena — Overmind Boss (2 istanze, molto HP)
  createEnemy(115, MAP_H - 9,  '#922b21', 5,  1,  8),
  createEnemy(115, MAP_H - 15, '#922b21', 4, -1,  8),
];