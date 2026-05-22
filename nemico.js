function createEnemy(startCol, startRow, color, speedX, startDirection) {
  return {
    x: 0,
    y: 0,
    width: 60,
    height: 60,
    color: color,
    speedX: speedX,
    direction: startDirection,
    facing: startDirection >= 0 ? 1 : -1,
    speedY: 0,
    gravity: 0.5,
    runImages: [],
    idleImages: [],
    contaFrame: 0,
    actualFrame: 0,
    image: null,
    lives: 3,
    hitCooldown: 0,
    dead: false,
    startCol: startCol,
    startRow: startRow,
    startDirection: startDirection,

    update: function() {
      if (this.dead) return;
      if (this.hitCooldown > 0) this.hitCooldown--;
      this.x += this.speedX * this.direction;
      this.facing = this.direction >= 0 ? 1 : -1;
      var leftCol = Math.floor(this.x / tileSize);
      var rightCol = Math.floor((this.x + this.width - 1) / tileSize);
      var topRow = Math.floor(this.y / tileSize);
      var bottomRow = Math.floor((this.y + this.height - 1) / tileSize);

      if (this.direction < 0) {
        if ((map[topRow] && map[topRow][leftCol] === 1) ||
            (map[bottomRow] && map[bottomRow][leftCol] === 1)) {
          this.direction = 1;
          this.x = (leftCol + 1) * tileSize;
        }
      } else if (this.direction > 0) {
        if ((map[topRow] && map[topRow][rightCol] === 1) ||
            (map[bottomRow] && map[bottomRow][rightCol] === 1)) {
          this.direction = -1;
          this.x = rightCol * tileSize - this.width;
        }
      }

      this.speedY += this.gravity;
      this.y += this.speedY;

      leftCol = Math.floor(this.x / tileSize);
      rightCol = Math.floor((this.x + this.width - 1) / tileSize);
      topRow = Math.floor(this.y / tileSize);
      bottomRow = Math.floor((this.y + this.height - 1) / tileSize);

      if ((map[bottomRow] && map[bottomRow][leftCol] === 1) ||
          (map[bottomRow] && map[bottomRow][rightCol] === 1)) {
        this.y = bottomRow * tileSize - this.height;
        this.speedY = 0;
      }

      var maxX = map[0].length * tileSize - this.width;
      if (this.x < 0) {
        this.x = 0;
        this.direction = 1;
      }
      if (this.x > maxX) {
        this.x = maxX;
        this.direction = -1;
      }

      if (this.runImages.length > 0) {
        this.contaFrame++;
        if (this.contaFrame === 6) {
          this.contaFrame = 0;
          this.actualFrame = (this.actualFrame + 1) % this.runImages.length;
          this.image = this.runImages[this.actualFrame];
        }
      }
    },

    loadImages: function() {
      for (var imgPath of running) {
        var img = new Image(this.width, this.height);
        img.src = imgPath;
        this.runImages.push(img);
      }
      for (var imgPath of idle) {
        var img = new Image(this.width, this.height);
        img.src = imgPath;
        this.idleImages.push(img);
      }
      if (this.idleImages.length > 0) {
        this.image = this.idleImages[0];
      }
    },

    resetPosition: function() {
      this.x = this.startCol * tileSize;
      this.y = this.startRow * tileSize - this.height;
      this.direction = this.startDirection;
      this.facing = this.startDirection >= 0 ? 1 : -1;
      this.speedY = 0;
      this.lives = 3;
      this.dead = false;
      this.hitCooldown = 0;
      if (this.idleImages.length > 0) {
        this.image = this.idleImages[0];
      }
    }
  };
}

var enemies = [
  createEnemy(33, 8, '#c00', 2, 1),
  createEnemy(54, 15, '#0c0', 3, -1)
];
