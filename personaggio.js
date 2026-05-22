var animatedObject = {
  speedX: 0,
  speedY: 0,
  gravity: 0.5,
  width: 64,
  height: 64,
  x: 0,
  y: 0,
  facing: 1,
  runImages: [],
  jumpImages: [],
  idleImages: [],
  attackImages: [],
  jumpAttackImages: [],
  hitImages: [],
  contaFrame: 0,
  actualFrame: 0,
  isGrounded: false,
  image: null,
  lives: 3,
  attacking: false,
  attackType: 'attack',
  attackTimer: 0,
  hitTimer: 0,
  heartOverlayTimer: 200,
  invulnerable: false,
  invulnerableTimer: 0,

  update: function() {
    // Gestione invulnerabilità
    if (this.invulnerable) {
      this.invulnerableTimer--;
      if (this.invulnerableTimer <= 0) {
        this.invulnerable = false;
      }
    }

    if (this.heartOverlayTimer > 0) {
      this.heartOverlayTimer--;
    }

    if (typeof keysPressed !== 'undefined') {
      if (keysPressed.a || keysPressed.arrowleft) {
        this.speedX = -10;
        this.facing = -1;
      } else if (keysPressed.d || keysPressed.arrowright) {
        this.speedX = 10;
        this.facing = 1;
      } else {
        this.speedX = 0;
      }

      if (jumpRequested) {
        if (this.isGrounded) {
          this.speedY = -15;
          this.isGrounded = false;
        }
        jumpRequested = false;
      }

      if (attackRequested && this.attackTimer <= 0) {
        this.attackTimer = 12;
        this.attacking = true;
        this.attackType = this.isGrounded ? 'attack' : 'jumpattack';
        attackRequested = false;
      }
    }

    this.x += this.speedX;
    var leftCol = Math.floor(this.x / tileSize);
    var rightCol = Math.floor((this.x + this.width - 1) / tileSize);
    var topRow = Math.floor(this.y / tileSize);
    var bottomRow = Math.floor((this.y + this.height - 1) / tileSize);

    if (this.speedX < 0) {
      if ((map[topRow] && map[topRow][leftCol] === 1) ||
          (map[bottomRow] && map[bottomRow][leftCol] === 1)) {
        this.x = (leftCol + 1) * tileSize;
        this.speedX = 0;
      }
    } else if (this.speedX > 0) {
      if ((map[topRow] && map[topRow][rightCol] === 1) ||
          (map[bottomRow] && map[bottomRow][rightCol] === 1)) {
        this.x = rightCol * tileSize - this.width;
        this.speedX = 0;
      }
    }

    this.speedY += this.gravity;
    this.y += this.speedY;

    leftCol = Math.floor(this.x / tileSize);
    rightCol = Math.floor((this.x + this.width - 1) / tileSize);
    topRow = Math.floor(this.y / tileSize);
    bottomRow = Math.floor((this.y + this.height - 1) / tileSize);

    if (this.speedY > 0) {
      if ((map[bottomRow] && map[bottomRow][leftCol] === 1) ||
          (map[bottomRow] && map[bottomRow][rightCol] === 1)) {
        this.y = bottomRow * tileSize - this.height;
        this.speedY = 0;
        this.isGrounded = true;
      } else {
        this.isGrounded = false;
      }
    } else if (this.speedY < 0) {
      if ((map[topRow] && map[topRow][leftCol] === 1) ||
          (map[topRow] && map[topRow][rightCol] === 1)) {
        this.y = (topRow + 1) * tileSize;
        this.speedY = 0;
      }
    }

    var maxX = map[0].length * tileSize - this.width;
    var maxY = map.length * tileSize - this.height;
    if (this.x < 0) this.x = 0;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 0) {
      this.y = 0;
      this.speedY = 0;
    }
    if (this.y > maxY) {
      this.y = maxY;
      this.speedY = 0;
      this.isGrounded = true;
    }

    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) {
        this.attacking = false;
      }
    }

    if (this.hitTimer > 0) {
      this.hitTimer--;
    }

    var currentImages;
    if (this.hitTimer > 0) {
      currentImages = this.hitImages;
    } else if (this.attackTimer > 0) {
      currentImages = this.attackType === 'jumpattack' ? this.jumpAttackImages : this.attackImages;
    } else if (!this.isGrounded) {
      currentImages = this.jumpImages;
    } else if (this.speedX !== 0) {
      currentImages = this.runImages;
    } else {
      currentImages = this.idleImages;
    }

    if (!this.image && this.idleImages.length > 0) {
      this.image = this.idleImages[0];
    }

    if (currentImages && currentImages.length > 0) {
      this.contaFrame++;
      if (this.contaFrame === 4) {
        this.contaFrame = 0;
        this.actualFrame = (this.actualFrame + 1) % currentImages.length;
        this.image = currentImages[this.actualFrame];
      }
    }
  },

  loadImages: function() {
    for (var imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.runImages.push(img);
    }
    for (var imgPath of jumping) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.jumpImages.push(img);
    }
    for (var imgPath of idle) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.idleImages.push(img);
    }
    for (var imgPath of attack) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.attackImages.push(img);
    }
    for (var imgPath of jumpattack) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.jumpAttackImages.push(img);
    }
    for (var imgPath of gettinghit) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.hitImages.push(img);
    }
    this.image = this.idleImages[0];
  },

  resetPosition: function() {
    this.x = tileSize;
    this.y = (map.length - 1) * tileSize - this.height;
    this.speedX = 0;
    this.speedY = 0;
    this.facing = 1;
    this.isGrounded = true;
    this.heartOverlayTimer = 200;
  }
};

function moveleft() {
  animatedObject.speedX = -10;
  animatedObject.facing = -1;
}

function moveright() {
  animatedObject.speedX = 10;
  animatedObject.facing = 1;
}

function clearmove() {
  animatedObject.speedX = 0;
}

function jump() {
  if (animatedObject.isGrounded) {
    animatedObject.speedY = -15;
    animatedObject.isGrounded = false;
  }
}

