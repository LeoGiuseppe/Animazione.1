function startGame() {
    setTileSize();
    myGameArea.start();
    animatedObject.loadImages();
    animatedObject.resetPosition();
    enemies.forEach(function(enemy) {
      enemy.resetPosition();
    });
}

function setTileSize() {
    var maxWidth = window.innerWidth - 20;
    var maxHeight = window.innerHeight - 20;
    tileSize = Math.min(
      Math.floor(maxWidth / map[0].length),
      Math.floor(maxHeight / map.length)
    );
    if (tileSize < 20) tileSize = 20;
}


var myGameArea = {  
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = map[0].length * tileSize;
        this.canvas.height = map.length * tileSize;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
         this.interval = setInterval(updateGameArea, 20);
         window.addEventListener('resize', function() {
           setTileSize();
           myGameArea.canvas.width = map[0].length * tileSize;
           myGameArea.canvas.height = map.length * tileSize;
           animatedObject.resetPosition();
           enemies.forEach(function(enemy) {
             enemy.resetPosition();
           });
         });
         
         // Controlli tastiera WASD
         document.addEventListener('keydown', function(e) {
           switch(e.key.toLowerCase()) {
             case 'w': jump(); break;
             case 'a': moveleft(); break;
             case 'd': moveright(); break;
             case ' ': jump(); e.preventDefault(); break; // Previene scroll
           }
         });
         
         document.addEventListener('keyup', function(e) {
           if (['a','d'].includes(e.key.toLowerCase())) {
             clearmove();
           }
         });
      },
     draw: function(component) {
    this.context.fillStyle = component.color;
    this.context.fillRect(component.x, component.y, component.width, component.height);
  },
    drawMap: function() {
        for (var r = 0; r < map.length; r++) { // r = riga
            for (var c = 0; c < map[r].length; c++) { // c = colonna
                if (map[r][c] === 1) {
                    this.context.fillStyle = "#444"; // Colore dei blocchi
                    this.context.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
                }
              }
            }
          },
  clear: function () {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
   drawGameObject: function(gameObject) {
    if (gameObject.image) {
      this.context.save();
      if (gameObject.facing < 0) {
        this.context.translate(gameObject.x + gameObject.width, gameObject.y);
        this.context.scale(-1, 1);
        this.context.drawImage(
          gameObject.image,
          0,
          0,
          gameObject.width,
          gameObject.height
        );
      } else {
        this.context.drawImage(
          gameObject.image,
          gameObject.x,
          gameObject.y,
          gameObject.width,
          gameObject.height
        );
      }
      this.context.restore();
    } else if (gameObject.color) {
      this.context.fillStyle = gameObject.color;
      this.context.fillRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
    }
  },
  drawHitbox: function(gameObject) {
    this.context.strokeStyle = gameObject.invulnerable ? 'yellow' : 'red';
    this.context.lineWidth = 2;
    this.context.strokeRect(gameObject.x, gameObject.y, gameObject.width, gameObject.height);
  },
  drawEnemy: function(enemy) {
    this.context.fillStyle = enemy.color;
    this.context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  },
  drawLives: function() {
    this.context.fillStyle = 'white';
    this.context.font = '20px Arial';
    this.context.fillText('Lives: ' + animatedObject.lives, 10, 30);
  }

}


function updateGameArea() {
     myGameArea.clear();
     myGameArea.drawMap();
     animatedObject.update();
     enemies.forEach(function(enemy) {
       enemy.update();
     });

     for (var i = 0; i < enemies.length; i++) {
       if (checkCollision(animatedObject, enemies[i]) && !animatedObject.invulnerable) {
         animatedObject.lives--;
         animatedObject.invulnerable = true;
         animatedObject.invulnerableTimer = 150; // 3 secondi a ~50 fps
         animatedObject.resetPosition();
         break;
       }
     }

     if (animatedObject.lives <= 0) {
       gameOver();
       return;
     }

    myGameArea.drawGameObject(animatedObject);
    enemies.forEach(function(enemy) {
      myGameArea.drawGameObject(enemy);
      myGameArea.drawHitbox(enemy);
    });
    // Visualizza hitbox
    myGameArea.drawHitbox(animatedObject);
    // Disegna vite
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
  alert("Game Over");
  window.close();
}






