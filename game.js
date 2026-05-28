// ======================= GAME LOOP =======================

function getAttackHitbox() {
  if (animatedObject.attackTimer <= 0 || animatedObject.isMorphed) return null; // Non si attacca in modalità palla
  var aw = Math.max(20, Math.floor(animatedObject.width  * 0.9));
  var ah = Math.max(20, Math.floor(animatedObject.height * 0.7));
  var ax = animatedObject.facing > 0
    ? animatedObject.x + animatedObject.width
    : animatedObject.x - aw;
  var ay = animatedObject.y + Math.floor(animatedObject.height * 0.15);
  return { x: ax, y: ay, width: aw, height: ah };
}

function checkCollision(a, b) {
  return a.x < b.x + b.width  &&
         a.x + a.width  > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function updateGameArea() {
  myGameArea.clear();

  animatedObject.update();
  enemies.forEach(function (e) { e.update(); });
  myGameArea.updateCamera();

  myGameArea.drawMap();
  myGameArea.drawItems();

  var attackHitbox = getAttackHitbox();
  if (attackHitbox) myGameArea.drawAttackHitbox(attackHitbox);

  myGameArea.drawGameObject(animatedObject);
  enemies.forEach(function (enemy) { myGameArea.drawEnemy(enemy); });

  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (enemy.dead) continue;

    if (attackHitbox && enemy.hitCooldown <= 0) {
      if (checkCollision(attackHitbox, enemy)) {
        enemy.lives--;
        enemy.hitCooldown = 20;
        if (enemy.lives <= 0) enemy.dead = true;
        continue;
      }
    }

    if (checkCollision(animatedObject, enemy) && !animatedObject.invulnerable) {
      animatedObject.lives--;
      animatedObject.invulnerable      = true;
      animatedObject.invulnerableTimer = 150;
      animatedObject.hitTimer          = 20;
      animatedObject.attacking         = false;
      animatedObject.attackTimer       = 0;
      animatedObject.heartOverlayTimer = 200;
      animatedObject.resetPosition();
      updateHeartsHUD();
      break;
    }
  }

  if (animatedObject.lives <= 0) {
    clearInterval(myGameArea.interval);
    myGameArea.drawGameOver();
    return;
  }

  var finalBosses = enemies.slice(-2);
  if (finalBosses.every(function (e) { return e.dead; }) && !window._won) {
    window._won = true;
    clearInterval(myGameArea.interval);
    myGameArea.drawWin();
  }
}

function setTileSize() {
  var maxW = window.innerWidth  - 32;
  var maxH = window.innerHeight - 120;
  tileSize = Math.max(16, Math.min(32,
    Math.min(Math.floor(maxW / 20), Math.floor(maxH / 15))
  ));
}

function startGame() {
  setTileSize();
  animatedObject.width  = Math.max(28, Math.floor(tileSize * 1.1));
  animatedObject.originalHeight = Math.max(28, Math.floor(tileSize * 1.1));
  animatedObject.height = animatedObject.originalHeight;
  
  enemies.forEach(function (e) {
    e.width  = Math.max(24, Math.floor(tileSize));
    e.height = Math.max(24, Math.floor(tileSize));
  });

  myGameArea.start();
  animatedObject.loadImages();
  animatedObject.resetPosition();
  enemies.forEach(function (e) { e.loadImages(); e.resetPosition(); });
  myGameArea.updateCamera();

  updateAbilitiesHUD();
  updateHeartsHUD();
  initControls();
  showBanner('START — trova le Ancient Ruins!');
}

window.addEventListener('load', startGame);