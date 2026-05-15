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
      enemy.resetPosition();
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
    this.context.save();
    this.context.translate(-this.cameraX, -this.cameraY);
    this.context.fillStyle = enemy.color;
    this.context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    this.context.restore();
  }
};

function startGame() {
  setTileSize();
  animatedObject.width = Math.max(32, Math.floor(tileSize * 0.8));
  animatedObject.height = Math.max(32, Math.floor(tileSize * 0.8));
  myGameArea.start();
  animatedObject.loadImages();
  animatedObject.resetPosition();
  enemy.resetPosition();
  myGameArea.updateCamera();
}

function updateGameArea() {
  myGameArea.clear();
  animatedObject.update();
  myGameArea.updateCamera();
  myGameArea.drawMap();
  myGameArea.drawGameObject(animatedObject);
  enemy.update();
  myGameArea.drawEnemy(enemy);
}
