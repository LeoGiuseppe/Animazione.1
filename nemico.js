var enemy = {
  x: 0,
  y: 0,
  width: 60,
  height: 60,
  color: '#c00',
  speedX: 2,
  direction: 1,
  speedY: 0,
  gravity: 0.5,

  update: function() {
    this.x += this.speedX * this.direction;
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
  },

  resetPosition: function() {
    this.x = tileSize * 10;
    this.y = (map.length - 3) * tileSize - this.height;
    this.direction = 1;
    this.speedY = 0;
  }
};
