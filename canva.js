var myGameArea = {
  canvas : document.createElement("canvas"),
  cameraX: 0,
  cameraY: 0,
  start : function() {
    this.canvas.width = Math.min(window.innerWidth - 40, 1000);
    this.canvas.height = Math.min(window.innerHeight - 40, 700);
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.cameraX = 0;
    this.cameraY = 0;
    this.interval = setInterval(updateGameArea, 20);

    window.addEventListener('resize', function() {
      setTileSize();
      animatedObject.width = Math.max(32, Math.floor(tileSize * 0.8));
      animatedObject.height = Math.max(32, Math.floor(tileSize * 0.8));
      myGameArea.canvas.width = Math.min(window.innerWidth - 40, 1000);
      myGameArea.canvas.height = Math.min(window.innerHeight - 40, 700);
      animatedObject.resetPosition();
      enemies.forEach(function(enemy) {
        enemy.resetPosition();
      });
      myGameArea.updateCamera();
    });

    initControls();
  },

  drawMap: function() {
    var innerSize = tileSize - tilePadding;
    var offset = tilePadding / 2;
    this.context.save();
    this.context.translate(-this.cameraX, -this.cameraY);
    for (var r = 0; r < map.length; r++) {
      for (var c = 0; c < map[r].length; c++) {
        if (map[r][c] === 1) {
          this.context.fillStyle = "#444";
          this.context.fillRect(c * tileSize + offset, r * tileSize + offset, innerSize, innerSize);
        }
      }
    }
    this.context.restore();
  },

  updateCamera: function() {
    var maxX = map[0].length * tileSize - this.canvas.width;
    var maxY = map.length * tileSize - this.canvas.height;
    this.cameraX = animatedObject.x + animatedObject.width / 2 - this.canvas.width / 2;
    this.cameraY = animatedObject.y + animatedObject.height / 2 - this.canvas.height / 2;
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraY < 0) this.cameraY = 0;
    if (this.cameraX > maxX) this.cameraX = maxX;
    if (this.cameraY > maxY) this.cameraY = maxY;
  },

  clear: function () {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },

  drawGameObject: function(gameObject) {
    if (!gameObject.image) return;
    this.context.save();
    this.context.translate(-this.cameraX, -this.cameraY);
    var alpha = 1;
    if (gameObject === animatedObject && animatedObject.invulnerable) {
      alpha = (Math.floor(animatedObject.invulnerableTimer / 5) % 2 === 0) ? 0.25 : 1;
      this.context.globalAlpha = alpha;
    }
    if (gameObject.facing < 0) {
      this.context.translate(gameObject.x + gameObject.width, gameObject.y);
      this.context.scale(-1, 1);
      this.context.drawImage(gameObject.image, 0, 0, gameObject.width, gameObject.height);
    } else {
      this.context.drawImage(gameObject.image, gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    }
    this.context.restore();
  },

  drawEnemy: function(enemy) {
    if (enemy.dead) return;
    if (enemy.image) {
      this.drawGameObject(enemy);
    } else {
      this.context.save();
      this.context.translate(-this.cameraX, -this.cameraY);
      this.context.fillStyle = enemy.color;
      this.context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      this.context.restore();
    }
    this.context.save();
    this.context.translate(-this.cameraX, -this.cameraY);
    this.context.fillStyle = 'white';
    this.context.font = '14px Arial';
    this.context.textAlign = 'center';
    this.context.fillText(enemy.lives, enemy.x + enemy.width / 2, enemy.y - 6);
    this.context.restore();
  },

  drawHeart: function(x, y, size) {
    this.context.beginPath();
    this.context.arc(x + size * 0.25, y + size * 0.25, size * 0.25, 0, Math.PI * 2);
    this.context.arc(x + size * 0.75, y + size * 0.25, size * 0.25, 0, Math.PI * 2);
    this.context.moveTo(x, y + size * 0.35);
    this.context.lineTo(x + size * 0.5, y + size);
    this.context.lineTo(x + size, y + size * 0.35);
    this.context.closePath();
    this.context.fillStyle = 'red';
    this.context.fill();
  },

  drawHearts: function() {
    if (animatedObject.heartOverlayTimer <= 0) return;
    var size = 12;
    var spacing = 4;
    var totalWidth = animatedObject.lives * size + Math.max(0, animatedObject.lives - 1) * spacing;
    var startX = animatedObject.x + animatedObject.width / 2 - totalWidth / 2;
    var startY = animatedObject.y - 22;
    this.context.save();
    this.context.translate(-this.cameraX, -this.cameraY);
    for (var i = 0; i < animatedObject.lives; i++) {
      this.drawHeart(startX + i * (size + spacing), startY, size);
    }
    this.context.restore();
  },

  drawLives: function() {
    this.context.fillStyle = 'black';
    this.context.font = '20px Arial';
    this.context.textBaseline = 'bottom';
    this.context.fillText('Lives: ' + animatedObject.lives, 10, this.canvas.height - 10);
  },

  drawGameOver: function() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = 'white';
    this.context.font = 'bold 48px Arial';
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
    this.context.font = '20px Arial';
    this.context.fillText('Refresh to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
  }
};

function startGame() {
  setTileSize();
  // Make the character larger and keep proportions consistent with tile size
  animatedObject.width = Math.max(48, Math.floor(tileSize * 1.2));
  animatedObject.height = Math.max(48, Math.floor(tileSize * 1.2));
  myGameArea.start();
  animatedObject.loadImages();
  animatedObject.resetPosition();
  enemies.forEach(function(enemy) {
    if (typeof enemy.loadImages === 'function') {
      enemy.loadImages();
    }
    enemy.resetPosition();
  });
  myGameArea.updateCamera();
}

function updateGameArea() {
  myGameArea.clear();
  animatedObject.update();
  enemies.forEach(function(enemy) {
    enemy.update();
  });
  myGameArea.updateCamera();
  myGameArea.drawMap();
  myGameArea.drawGameObject(animatedObject);
  myGameArea.drawHearts();
  enemies.forEach(function(enemy) {
    myGameArea.drawEnemy(enemy);
  });

  // If attacking, create a short attack hitbox in front of the player for reliable hits
  var attackHitbox = null;
  if (animatedObject.attackTimer > 0) {
    var aw = Math.max(24, Math.floor(animatedObject.width * 0.8));
    var ah = Math.max(24, Math.floor(animatedObject.height * 0.6));
    var ax = animatedObject.facing > 0 ? (animatedObject.x + animatedObject.width) : (animatedObject.x - aw);
    var ay = animatedObject.y + Math.floor(animatedObject.height * 0.2);
    attackHitbox = { x: ax, y: ay, width: aw, height: ah };
    // draw debug hitbox briefly (subtle)
    myGameArea.context.save();
    myGameArea.context.translate(-myGameArea.cameraX, -myGameArea.cameraY);
    myGameArea.context.globalAlpha = 0.25;
    myGameArea.context.fillStyle = 'orange';
    myGameArea.context.fillRect(attackHitbox.x, attackHitbox.y, attackHitbox.width, attackHitbox.height);
    myGameArea.context.restore();
  }

  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (enemy.dead) continue;
    // Attack hit detection (uses attackHitbox if present)
    var wasHit = false;
    if (attackHitbox && enemy.hitCooldown <= 0) {
      if (attackHitbox.x < enemy.x + enemy.width &&
          attackHitbox.x + attackHitbox.width > enemy.x &&
          attackHitbox.y < enemy.y + enemy.height &&
          attackHitbox.y + attackHitbox.height > enemy.y) {
        wasHit = true;
      }
    }
    if (wasHit) {
      enemy.lives--;
      enemy.hitCooldown = 20;
      if (enemy.lives <= 0) enemy.dead = true;
      continue;
    }

    // Enemy damages player if touching and player is not invulnerable
    if (checkCollision(animatedObject, enemy) && !animatedObject.invulnerable) {
      animatedObject.lives--;
      animatedObject.invulnerable = true;
      animatedObject.invulnerableTimer = 150;
      animatedObject.hitTimer = 20;
      animatedObject.attacking = false;
      animatedObject.attackTimer = 0;
      animatedObject.heartOverlayTimer = 200;
      animatedObject.resetPosition();
      break;
    }
  }

  if (animatedObject.lives <= 0) {
    gameOver();
    return;
  }

  myGameArea.drawLives();
}

function checkCollision(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

function gameOver() {
  clearInterval(myGameArea.interval);
  myGameArea.drawGameOver();
}
