// ======================= PLAYER =======================
// Modificato: Il tasto F ora gestisce unicamente la meccanica del Doppio Salto.

var lastCheckpoint = null;

var animatedObject = {
  speedX: 0,
  speedY: 0,
  gravity: 0.55,
  width: 40,
  originalHeight: 40, 
  height: 40,
  x: 0,
  y: 0,
  facing: 1,

  runImages:       [],
  jumpImages:      [],
  idleImages:      [],
  attackImages:    [],
  jumpAttackImages:[],
  hitImages:       [],

  contaFrame:  0,
  actualFrame: 0,
  image:       null,

  isGrounded:        false,
  hasDoubleJumped:   false, // Tiene traccia se il doppio salto è già stato usato
  lives:             5,
  attacking:         false,
  attackType:        'attack',
  attackTimer:       0,
  hitTimer:          0,
  heartOverlayTimer: 0,
  invulnerable:      false,
  invulnerableTimer: 0,
  isMorphed:         false, 

  // --------------------------------------------------
  update: function () {

    if (this.invulnerable) {
      this.invulnerableTimer--;
      if (this.invulnerableTimer <= 0) this.invulnerable = false;
    }
    if (this.heartOverlayTimer > 0) this.heartOverlayTimer--;

    // ---- ABILITÀ: MORPH BALL (Tasto R) ----
    if (morphRequested) {
      morphRequested = false;
      if (playerAbilities.morphBall) {
        if (!this.isMorphed) {
          this.isMorphed = true;
          var diff = this.originalHeight - 20;
          this.height = 20;
          this.y += diff; 
          showBanner("Morph Ball Attiva! [R]");
        } else {
          var checkRow = Math.floor((this.y - (this.originalHeight - 20)) / tileSize);
          var lc = Math.floor(this.x / tileSize);
          var rc = Math.floor((this.x + this.width - 0.1) / tileSize);
          
          if (!isSolidTile(checkRow, lc) && !isSolidTile(checkRow, rc)) {
            this.y -= (this.originalHeight - 20);
            this.height = this.originalHeight;
            this.isMorphed = false;
            showBanner("Morph Ball Disattivata");
          } else {
            showBanner("Spazio insufficiente per rialzarsi!");
          }
        }
      }
    }

    // ---- MECCANICA: DOPPIO SALTO (Tasto F) ----
    if (skillRequested) {
      skillRequested = false;
      // Può essere eseguito solo in aria e una sola volta per salto
      if (!this.isGrounded && !this.hasDoubleJumped && !this.isMorphed) {
        var doubleJumpPower = playerAbilities.highJump ? -15 : -12.5;
        this.speedY = doubleJumpPower; 
        this.hasDoubleJumped = true; 
        showBanner("Doppio Salto!");
      }
    }

    // ---- Input Movimento ----
    var baseSpeed = this.isMorphed ? 3 : 5; 
    var jumpPower = playerAbilities.highJump ? -21 : -15.5;

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
      if (this.isGrounded && !this.isMorphed) { 
        this.speedY = jumpPower; 
        this.isGrounded = false; 
      }
      jumpRequested = false;
    }

    if (attackRequested && this.attackTimer <= 0 && !this.isMorphed) {
      this.attackTimer = 14;
      this.attacking   = true;
      this.attackType  = this.isGrounded ? 'attack' : 'jumpattack';
      attackRequested  = false;
    }

    // ---- STEP 1: MOVIMENTO E COLLISIONI ASSE X ----
    this.x += this.speedX;
    
    var lc = Math.floor(this.x / tileSize);
    var rc = Math.floor((this.x + this.width - 0.1) / tileSize);
    var tr = Math.floor(this.y / tileSize);
    var br = Math.floor((this.y + this.height - 0.1) / tileSize);

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

    // ---- STEP 2: MOVIMENTO E COLLISIONI ASSE Y ----
    this.speedY += this.gravity;
    this.y += this.speedY;
    
    lc = Math.floor(this.x / tileSize);
    rc = Math.floor((this.x + this.width - 0.1) / tileSize);
    tr = Math.floor(this.y / tileSize);
    br = Math.floor((this.y + this.height - 0.1) / tileSize);

    if (this.speedY > 0) {
      if (isSolidTile(br, lc) || isSolidTile(br, rc)) {
        this.y = br * tileSize - this.height;
        this.speedY = 0;
        this.isGrounded = true;
        this.hasDoubleJumped = false; // Resetta il doppio salto quando tocca terra
      } else {
        this.isGrounded = false;
      }
    } else if (this.speedY < 0) {
      if (isSolidTile(tr, lc) || isSolidTile(tr, rc)) {
        this.y = (tr + 1) * tileSize;
        this.speedY = 0;
      }
    }

    // ---- Confini del Mondo ----
    var maxX = map[0].length * tileSize - this.width;
    var maxY = map.length  * tileSize - this.height;
    if (this.x < 0)   this.x = 0;
    if (this.x > maxX) this.x = maxX;
    if (this.y < 0)   { this.y = 0; this.speedY = 0; }
    if (this.y > maxY){ this.y = maxY; this.speedY = 0; this.isGrounded = true; this.hasDoubleJumped = false; }

    if (this.attackTimer > 0) {
      this.attackTimer--;
      if (this.attackTimer === 0) this.attacking = false;
    }
    if (this.hitTimer > 0) this.hitTimer--;

    checkItemCollection(this);
    detectZone(Math.floor((this.x + this.width/2) / tileSize), Math.floor((this.y + this.height/2) / tileSize));

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
    this.hasDoubleJumped  = false;
    this.isMorphed        = false;
    this.height           = this.originalHeight;
    this.heartOverlayTimer = 200;
  }
};