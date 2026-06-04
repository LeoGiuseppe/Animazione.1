// ======================= NEMICI =======================
// Modificato: Adesso carica correttamente le immagini e le textures per l'animazione grafica dei nemici.

function createEnemy(startCol, startRow, color, spd, dir, lives) {
  lives = lives || 3;
  return {
    x: 0, y: 0,
    width: 36, height: 36,
    color: color,
    speedX: spd,
    baseSpeed: spd,
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
    invulnerable: false,
    invulnerableTimer: 0,
    hasHealed: false,
    dead: false,

    startCol:       startCol,
    startRow:       startRow,
    startDirection: dir,
    homeZone:       null,

    // --------------------------------------------------
    update: function () {
      if (this.dead) return;
      if (this.hitCooldown > 0) this.hitCooldown--;
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer--;
        if (this.invulnerableTimer <= 0) this.invulnerable = false;
      }

      if (!this.homeZone) {
        var startTileX = Math.floor(this.x / tileSize);
        var startTileY = Math.floor(this.y / tileSize);
        for (var i = 0; i < zones.length; i++) {
          var z = zones[i];
          if (startTileX >= z.x1 && startTileX < z.x2 && startTileY >= z.y1 && startTileY < z.y2) {
            this.homeZone = z;
            break;
          }
        }
      }

      var nextX = this.x + this.speedX * this.direction;

      if (this.homeZone) {
        var nextTileLeft  = Math.floor(nextX / tileSize);
        var nextTileRight = Math.floor((nextX + this.width) / tileSize);

        if (nextTileLeft < this.homeZone.x1 || nextTileRight > this.homeZone.x2) {
          this.direction *= -1;
          this.facing = this.direction >= 0 ? 1 : -1;
        }
      }

      this.x += this.speedX * this.direction;
      this.facing = this.direction >= 0 ? 1 : -1;

      var lc = Math.floor(this.x / tileSize);
      var rc = Math.floor((this.x + this.width - 1) / tileSize);
      var tr = Math.floor(this.y / tileSize);
      var br = Math.floor((this.y + this.height - 1) / tileSize);

      if (this.direction < 0) {
        if (isSolidTile(tr, lc) || isSolidTile(br, lc)) {
          this.x = (lc + 1) * tileSize;
          this.direction = 1;
        }
      } else if (this.direction > 0) {
        if (isSolidTile(tr, rc) || isSolidTile(br, rc)) {
          this.x = rc * tileSize - this.width;
          this.direction = -1;
        }
      }

      this.speedY += this.gravity;
      this.y += this.speedY;

      lc = Math.floor(this.x / tileSize);
      rc = Math.floor((this.x + this.width - 1) / tileSize);
      tr = Math.floor(this.y / tileSize);
      br = Math.floor((this.y + this.height - 1) / tileSize);

      if (this.speedY > 0) {
        if (isSolidTile(br, lc) || isSolidTile(br, rc)) {
          this.y = br * tileSize - this.height;
          this.speedY = 0;
        }
      }

      // Animazione dei frame dei nemici basata sulle immagini caricate
      var imgs = this.runImages.length > 0 ? this.runImages : this.idleImages;
      if (imgs && imgs.length > 0) {
        this.contaFrame++;
        if (this.contaFrame === 6) {
          this.contaFrame = 0;
          this.actualFrame = (this.actualFrame + 1) % imgs.length;
          this.image = imgs[this.actualFrame];
        }
      }
    },

    // --------------------------------------------------
    loadImages: function () {
      var self = this;
      
      // Se sono definiti degli array specifici per i nemici in sprite.js li carichiamo
      if (typeof runningEnemies !== 'undefined' && runningEnemies[self.color]) {
        runningEnemies[self.color].forEach(function (s) {
          var img = new Image(self.width, self.height);
          img.src = s;
          self.runImages.push(img);
        });
      } else if (typeof running !== 'undefined') {
        // Fallback strutturato: carichiamo i frame di corsa standard se mancano texture dedicate
        running.forEach(function (s) {
          var img = new Image(self.width, self.height);
          img.src = s;
          self.runImages.push(img);
        });
      }

      if (typeof idleEnemies !== 'undefined' && idleEnemies[self.color]) {
        idleEnemies[self.color].forEach(function (s) {
          var img = new Image(self.width, self.height);
          img.src = s;
          self.idleImages.push(img);
        });
      } else if (typeof idle !== 'undefined') {
        idle.forEach(function (s) {
          var img = new Image(self.width, self.height);
          img.src = s;
          self.idleImages.push(img);
        });
      }
      
      this.image = this.runImages[0] || this.idleImages[0] || null;
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
      this.invulnerable = false;
      this.invulnerableTimer = 0;
      this.hasHealed = false;
      this.homeZone  = null; 
    }
  };
}

// ======================= LISTA NEMICI =======================
var enemies = [
  createEnemy(16,  MAP_H - 9,  '#8e2020', 2,  1,  3),
  createEnemy(25,  MAP_H - 9,  '#8e2020', 2, -1,  3),
  createEnemy(38,  MAP_H - 9,  '#1a5276', 3,  1,  4),
  createEnemy(50,  MAP_H - 9,  '#1a5276', 3, -1,  4),
  createEnemy(64,  MAP_H - 9,  '#196f3d', 2.5, 1, 4),
  createEnemy(75,  MAP_H - 9,  '#196f3d', 2.5, -1, 4),
  createEnemy(99,  MAP_H - 9,  '#7d6608', 3,  1,  5),
  createEnemy(108, MAP_H - 9,  '#7d6608', 3, -1,  5),
  createEnemy(3,   MAP_H - 23, '#5b2c6f', 2,  1,  3),
  createEnemy(10,  MAP_H - 23, '#5b2c6f', 2, -1,  3),
  createEnemy(39,  MAP_H - 29, '#111111', 2,  1,  3),
  createEnemy(52,  MAP_H - 29, '#111111', 2, -1,  3),
  createEnemy(58,  MAP_H - 29, '#7f8c8d', 3,  1,  3),
  createEnemy(68,  MAP_H - 29, '#7f8c8d', 3, -1,  3),
  createEnemy(75,  MAP_H - 29, '#212f3d', 3,  1,  4),
  createEnemy(86,  MAP_H - 29, '#212f3d', 3, -1,  4),
  createEnemy(93,  MAP_H - 29, '#78281f', 2,  1,  3),
  createEnemy(104, MAP_H - 29, '#78281f', 2, -1,  3),
  createEnemy(85,  MAP_H - 9,  '#e74c3c', 1.5, 1, 10), // Mini Boss
 // L'ultimo nemico (il Boss) viene spostato dalla colonna 115 alla colonna 125
  createEnemy(125, MAP_H - 9,  '#ffffff', 2.5,  1,  25)  // Unico Boss Finale (velocità ridotta)
];