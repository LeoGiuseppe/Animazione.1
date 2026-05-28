
// ======================= CANVAS & CAMERA =======================
// myGameArea gestisce il canvas, la telecamera e tutte
// le funzioni di disegno (mappa, player, nemici, item).

var myGameArea = {
  canvas:  document.getElementById('gameCanvas'),
  cameraX: 0,
  cameraY: 0,
  ctx:     null,
  interval: null,

  // --------------------------------------------------
  start: function () {
    this.canvas.width  = Math.min(window.innerWidth  - 32,  1000);
    this.canvas.height = Math.min(window.innerHeight - 130,  640);
    this.ctx = this.canvas.getContext('2d');
    this.interval = setInterval(updateGameArea, 20);

    window.addEventListener('resize', function () {
      setTileSize();
      myGameArea.canvas.width  = Math.min(window.innerWidth  - 32,  1000);
      myGameArea.canvas.height = Math.min(window.innerHeight - 130,  640);
      var prevTile = tileSize;
      animatedObject.width  = Math.max(28, Math.floor(tileSize * 1.1));
      animatedObject.height = Math.max(28, Math.floor(tileSize * 1.1));
      // Rescale player position proportionally instead of resetting to spawn
      if (prevTile > 0) {
        animatedObject.x = animatedObject.x / prevTile * tileSize;
        animatedObject.y = animatedObject.y / prevTile * tileSize;
      }
      myGameArea.updateCamera();
    });
  },

  // --------------------------------------------------
 
   // Dentro myGameArea.updateCamera() in canva.js
updateCamera: function () {
  var maxX = map[0].length * tileSize - this.canvas.width; // Deve usare map[0].length
  var maxY = map.length    * tileSize - this.canvas.height;
    this.cameraX = animatedObject.x + animatedObject.width  / 2 - this.canvas.width  / 2;
    this.cameraY = animatedObject.y + animatedObject.height / 2 - this.canvas.height / 2;
    this.cameraX = Math.max(0, Math.min(maxX, this.cameraX));
    this.cameraY = Math.max(0, Math.min(maxY, this.cameraY));
  },

  // --------------------------------------------------
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // --------------------------------------------------
  drawMap: function () {
    var ctx  = this.ctx;
    var pad  = tilePadding / 2;
    var inner = tileSize - tilePadding;
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    for (var r = 0; r < map.length; r++) {
      for (var c = 0; c < map[r].length; c++) {
        var tile = map[r][c];
        if (tile === 1) {
          ctx.fillStyle = getTileColor(c, r);
          ctx.fillRect(c * tileSize + pad, r * tileSize + pad, inner, inner);
          // highlight superiore sottile
          ctx.fillStyle = 'rgba(255,255,255,0.06)';
          ctx.fillRect(c * tileSize + pad, r * tileSize + pad, inner, 3);

        }
      }
    }
    ctx.restore();
  },

  // --------------------------------------------------
  drawItems: function () {
    var ctx = this.ctx;
    var t   = Date.now() / 1000;
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.collected) continue;

      var px = item.col * tileSize + tileSize / 2;
      var py = item.row * tileSize + tileSize / 2 - Math.sin(t * 2) * 4;
      var sz = item.type === 'ability' ? tileSize * 0.9 : tileSize * 0.65;

      // alone colorato
      ctx.beginPath();
      ctx.arc(px, py, sz * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = item.color + '44';
      ctx.fill();

      // simbolo
      ctx.font          = 'bold ' + Math.floor(sz * 0.7) + 'px monospace';
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'middle';
      ctx.fillStyle     = item.color;
      ctx.fillText(item.symbol, px, py);
    }
    ctx.restore();
  },

  // --------------------------------------------------
  // Disegna un game object con gestione flip e invulnerabilità
  drawGameObject: function (obj) {
    if (!obj.image) return;
    var ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    if (obj === animatedObject && animatedObject.invulnerable) {
      ctx.globalAlpha = (Math.floor(animatedObject.invulnerableTimer / 5) % 2 === 0) ? 0.25 : 1;
    }

    if (obj.facing < 0) {
      ctx.translate(obj.x + obj.width, obj.y);
      ctx.scale(-1, 1);
      ctx.drawImage(obj.image, 0, 0, obj.width, obj.height);
    } else {
      ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height);
    }
    ctx.restore();
  },

  // --------------------------------------------------
  // Disegna un nemico con barra HP sopra
  drawEnemy: function (enemy) {
    if (enemy.dead) return;
    this.drawGameObject(enemy);

    var ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);

    var barW = enemy.width;
    ctx.fillStyle = '#333';
    ctx.fillRect(enemy.x, enemy.y - 10, barW, 5);
    ctx.fillStyle = enemy.lives > enemy.maxLives / 2 ? '#2ecc71' : '#e74c3c';
    ctx.fillRect(enemy.x, enemy.y - 10, barW * (enemy.lives / enemy.maxLives), 5);

    ctx.restore();
  },

  // --------------------------------------------------
  // Hitbox d'attacco visiva (semitrasparente)
  drawAttackHitbox: function (hb) {
    var ctx = this.ctx;
    ctx.save();
    ctx.translate(-this.cameraX, -this.cameraY);
    ctx.globalAlpha  = 0.3;
    ctx.fillStyle    = '#f39c12';
    ctx.fillRect(hb.x, hb.y, hb.width, hb.height);
    ctx.restore();
  },

  // --------------------------------------------------
  drawGameOver: function () {
    var ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle    = '#e74c3c';
    ctx.font         = 'bold 48px Courier New';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 20);
    ctx.fillStyle = '#aaa';
    ctx.font      = '18px Courier New';
    ctx.fillText('Refresh to restart', this.canvas.width / 2, this.canvas.height / 2 + 30);
  },

  // --------------------------------------------------
  drawWin: function () {
    var ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle    = '#f1c40f';
    ctx.font         = 'bold 44px Courier New';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YOU WIN!', this.canvas.width / 2, this.canvas.height / 2 - 20);
    ctx.fillStyle = '#2ecc71';
    ctx.font      = '18px Courier New';
    ctx.fillText('All bosses defeated!', this.canvas.width / 2, this.canvas.height / 2 + 30);
  }
};
