
// ======================= PLAYER =======================
// Oggetto principale del giocatore: movimento, fisica,
// collisioni con la mappa, animazione sprite, stati.

var lastCheckpoint = null;

var animatedObject = {
  speedX: 0,
  speedY: 0,
  gravity: 0.55,
  width: 40,
  height: 40,
  x: 0,
  y: 0,
  facing: 1,

  // Array sprite (popolati da loadImages)
  runImages:       [],
  jumpImages:      [],
  idleImages:      [],
  attackImages:    [],
  jumpAttackImages:[],
  hitImages:       [],

  // Frame corrente
  contaFrame:  0,
  actualFrame: 0,
  image:       null,

  // Stato
  isGrounded:        false,
  lives:             5,
  attacking:         false,
  attackType:        'attack',
  attackTimer:       0,
  hitTimer:          0,
  heartOverlayTimer: 0,
  invulnerable:      false,
  invulnerableTimer: 0,

  // --------------------------------------------------
  update: function () {

    // Invulnerabilità dopo danno
    if (this.invulnerable) {
      this.invulnerableTimer--;
      if (this.invulnerableTimer <= 0) this.invulnerable = false;
    }
    if (this.heartOverlayTimer > 0) this.heartOverlayTimer--;

    // ---- Input movimento ----
    var baseSpeed = 5;
    var jumpPower = playerAbilities.highJump ? -18 : -13;

    if (keysPressed['a'] || keysPressed['arrowleft']) {
      this.speedX = -baseSpeed;
      this.facing = -1;
    } else if (keysPressed['d'] || keysPressed['arrowright']) {
      this.speedX = baseSpeed;
      this.facing = 1;
    } else {
      this.speedX = 0;
    }

    if (jumpRequested) {
      if (this.isGrounded) { this.speedY = jumpPower; this.isGrounded = false; }
      jumpRequested = false;
    }

    if (attackRequested && this.attackTimer <= 0) {
      this.attackTimer = 14;
      this.attacking   = true;
      this.attackType  = this.isGrounded ? 'attack' : 'jumpattack';
      attackRequested  = false;
    }

    // ---- Movimento orizzontale + collisioni ----
    this.x += this.speedX;
    var lc = Math.floor(this.x / tileSize);
    var rc = Math.floor((this.x + this.width - 1) / tileSize);
    var tr = Math.floor(this.y / tileSize);
    var br = Math.floor((this.y + this.height - 1) / tileSize);

    if (this.speedX < 0) {
      if (isSolidTile(tr, lc) || isSolidTile(br, lc)) {
        this.x = (lc + 1) * tileSize;
        this.speedX = 0;
      }
    } else if (this.speedX > 0) {
      if (isSolidTile(tr, rc) || isSolidTile(br, rc)) {
        this.x = rc * tileSize - this.width;
        this.speedX = 0;
      }
    }

    // ---- Gravità + collisioni verticali ----
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
        this.isGrounded = true;
      } else {
        this.isGrounded = false;
      }
    } else if (this.speedY < 0) {
      if (isSolidTile(tr, lc) || isSolidTile(tr, rc)) {
        this.y = (tr + 1) * tileSize;
        this.speedY = 0;
      }
    }

    // ---- Bordi mappa ----
    var maxX = map[0].length * tileSize - this.width;
    var maxY = map.length  * tileSize - this.height;
    if (this.x < 0)   this.x = 0;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 0)   { this.y = 0; this.speedY = 0; }
    if (this.y > maxY){ this.y = maxY; this.speedY = 0; this.isGrounded = true; }

    // ---- Timer attacco ----
    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) this.attacking = false;
    }
    if (this.hitTimer > 0) this.hitTimer--;

    // ---- Raccolta item ----
    checkItemCollection(this);

    // ---- Rilevamento zona ----
    detectZone(Math.floor(this.x / tileSize), Math.floor(this.y / tileSize));

    // ---- Animazione sprite ----
    var imgs;
    if      (this.hitTimer > 0)    imgs = this.hitImages;
    else if (this.attackTimer > 0) imgs = (this.attackType === 'jumpattack') ? this.jumpAttackImages : this.attackImages;
    else if (!this.isGrounded)     imgs = this.jumpImages;
    else if (this.speedX !== 0)    imgs = this.runImages;
    else                           imgs = this.idleImages;

    if (!this.image && this.idleImages.length > 0) this.image = this.idleImages[0];

    if (imgs && imgs.length > 0) {
      this.contaFrame++;
      if (this.contaFrame === 4) {
        this.contaFrame  = 0;
        this.actualFrame = (this.actualFrame + 1) % imgs.length;
        this.image       = imgs[this.actualFrame];
      }
    }
  },

  // --------------------------------------------------
  loadImages: function () {
    var self = this;
    function load(arr, target) {
      arr.forEach(function (src) {
        var img = new Image(self.width, self.height);
        img.src = src;
        target.push(img);
      });
    }
    load(running,     this.runImages);
    load(jumping,     this.jumpImages);
    load(idle,        this.idleImages);
    load(attack,      this.attackImages);
    load(jumpattack,  this.jumpAttackImages);
    load(gettinghit,  this.hitImages);
    this.image = this.idleImages[0];
  },

  // --------------------------------------------------
  resetPosition: function () {
    if (lastCheckpoint) {
      this.x = lastCheckpoint.x;
      this.y = lastCheckpoint.y;
    } else {
      this.x = 2 * tileSize;
      this.y = (MAP_H - 9) * tileSize - this.height;
    }
    this.speedX = 0;
    this.speedY = 0;
    this.facing = 1;
    this.isGrounded       = true;
    this.heartOverlayTimer = 200;
  }
};
