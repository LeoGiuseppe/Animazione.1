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
  updateStaminaHUD();
  enemies.forEach(function (e) { e.update(); });
  myGameArea.updateCamera();

  myGameArea.drawMap();
  myGameArea.drawItems();

  var attackHitbox = getAttackHitbox();
  
  // ---- RENDERING DEL FENDENTE AZZURRO CON IMMAGINI PRECARICATE ----
  if (attackHitbox) {
    // Mappatura dinamica basata sul timer decrescente per calcolare il frame progressivo
    var maxTimer   = 14;
    var frameCount = (typeof slashFramesPreloaded !== 'undefined' ? slashFramesPreloaded.length : 6) || 6;
    var progress   = Math.max(0, Math.min(1, (maxTimer - animatedObject.attackTimer) / maxTimer));
    var frameIndex = Math.floor(progress * frameCount);
    if (frameIndex >= frameCount) frameIndex = frameCount - 1;

    // Pesca l'oggetto Image generato dai link i.ibb.co forniti in sprite.js
    var currentSlashImg = typeof slashFramesPreloaded !== 'undefined' ? slashFramesPreloaded[frameIndex] : null;
    var ctx = myGameArea.ctx;

    if (currentSlashImg && currentSlashImg.complete && ctx) {
      ctx.save();
      ctx.translate(-myGameArea.cameraX, -myGameArea.cameraY);

      // Bagliore di luce neon azzurra attorno al fendente
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(0, 191, 255, 0.7)";

      if (animatedObject.facing === -1) {
        // Se il giocatore guarda a sinistra, specchia lo sprite sull'asse delle X
        ctx.translate(attackHitbox.x + attackHitbox.width, attackHitbox.y);
        ctx.scale(-1, 1);
        ctx.drawImage(currentSlashImg, 0, 0, attackHitbox.width, attackHitbox.height);
      } else {
        // Se guarda a destra, disegno lineare standard
        ctx.drawImage(currentSlashImg, attackHitbox.x, attackHitbox.y, attackHitbox.width, attackHitbox.height);
      }
      
      ctx.restore();
    } else if (ctx) {
      // fallback semitrasparente solo se le immagini non sono ancora pronte
      ctx.save();
      ctx.translate(-myGameArea.cameraX, -myGameArea.cameraY);
      ctx.fillStyle = "rgba(0, 191, 255, 0.15)";
      ctx.fillRect(attackHitbox.x, attackHitbox.y, attackHitbox.width, attackHitbox.height);
      ctx.restore();
    }
  }
  // ---- FINE MECCANICA DI DISEGNO DELLO SLASH ----

  myGameArea.drawGameObject(animatedObject);
  enemies.forEach(function (enemy) { myGameArea.drawEnemy(enemy); });

  for (var i = 0; i < enemies.length; i++) {
    var enemy = enemies[i];
    if (enemy.dead) continue;

    if (attackHitbox && enemy.hitCooldown <= 0 && !enemy.invulnerable) {
      if (checkCollision(attackHitbox, enemy)) {
        var dmg = (animatedObject.baseDamage || 1) * (animatedObject.damageMultiplier || 1);
        enemy.lives -= dmg;
        enemy.hitCooldown = 40;
        enemy.invulnerable = true;
        enemy.invulnerableTimer = 40;
        enemy.flashTimer = 10; 
        
        var pushDirection = (animatedObject.x + animatedObject.width / 2 < enemy.x + enemy.width / 2) ? 1 : -1;
        enemy.x += pushDirection * 25; 

        // Se è il boss finale: quando scende a metà vita, si potenzia e guarisce UNA VOLTA
        if (i === enemies.length - 1) {
          if (enemy.lives <= Math.floor(enemy.maxLives / 2) && !enemy.hasHealed) {
            enemy.speedX = enemy.baseSpeed * 1.25;
            enemy.lives = enemy.maxLives;
            enemy.hasHealed = true;
            enemy.invulnerable = true;
            enemy.invulnerableTimer = 60;
          }
        }

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

  var finalBoss = enemies[enemies.length - 1];
  if (finalBoss && finalBoss.dead && !window._won) {
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
  
  enemies.forEach(function (e, index) {
    if (index === 18) {
      e.width  = Math.max(24, Math.floor(tileSize)) * 2;
      e.height = Math.max(24, Math.floor(tileSize)) * 2;
    } else if (index === enemies.length - 1) {
      e.width  = Math.max(24, Math.floor(tileSize)) * 3;
      e.height = Math.max(24, Math.floor(tileSize)) * 3;
    } else {
      e.width  = Math.max(24, Math.floor(tileSize));
      e.height = Math.max(24, Math.floor(tileSize));
    }
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