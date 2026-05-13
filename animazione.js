function startGame() {
    myGameArea.start();
   animatedObject.loadImages();
}

var myGameArea = {  
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
         this.interval = setInterval(updateGameArea, 20);
         
         // Controlli tastiera WASD
         document.addEventListener('keydown', function(e) {
           switch(e.key.toLowerCase()) {
             case 'w': moveup(); break;
             case 'a': moveleft(); break;
             case 's': movedown(); break;
             case 'd': moveright(); break;
             case ' ': jump(); e.preventDefault(); break; // Previene scroll
           }
         });
         
         document.addEventListener('keyup', function(e) {
           if (['w','a','s','d'].includes(e.key.toLowerCase())) {
             clearmove();
           }
         });
      },
     draw: function(component) {
    this.context.fillStyle = component.color;
    this.context.fillRect(component.x, component.y, component.width, component.height);
  },
  clear: function () {
    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  },
   drawGameObject: function(gameObject) {
    this.context.drawImage(
      gameObject.image,
      gameObject.x,
      gameObject.y,
      gameObject.width,
      gameObject.height
    );
  }
}

function updateGameArea() {
     myGameArea.clear();
    myGameArea.drawGameObject(animatedObject);
  animatedObject.update();
}
function moveup() {
 
  animatedObject.speedY = -10;
}

function movedown() {
  
  animatedObject.speedY = 10;
}

function moveleft() {
  
  animatedObject.speedX = -10;
}

function moveright() {
 
  animatedObject.speedX = 10;
}
function clearmove() {
    animatedObject.speedX = 0; 
    animatedObject.speedY = 0; 
}

function jump() {
  if (animatedObject.y === animatedObject.groundLevel) {
    animatedObject.speedY = -15;
  }
}



var animatedObject = {
  speedX: 0,
  speedY: 0,
  gravity: 0.5,
  groundLevel: 440,
  width: 60,
  height: 60,
  x: 10,
  y: 420,
  runImages: [], 
  jumpImages: [],
  idleImages: [],
  contaFrame: 0, 
  actualFrame: 0, 

  update: function() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Boundary checks
    if (this.x < 0) this.x = 0;
    if (this.x > myGameArea.canvas.width - this.width) this.x = myGameArea.canvas.width - this.width;
    
    // Scegli quale animazione usare
    var currentImages;
    if (this.y < this.groundLevel || this.speedY < 0) {
      // In aria = salto
      currentImages = this.jumpImages;
    } else if (this.speedX !== 0) {
      // In movimento = corsa
      currentImages = this.runImages;
    } else {
      // Fermo = idle
      currentImages = this.idleImages;
    }
    
    if (this.y < this.groundLevel) {
            this.speedY += this.gravity;
        } else {
            this.y = this.groundLevel;
            // Se tocchi terra mentre cadi, fermati
            if (this.speedY > 0) this.speedY = 0; 
        }

    // Anima
    if (currentImages.length > 0) {
      this.contaFrame++;
      if (this.contaFrame == 4) {
        this.contaFrame = 0;
        this.actualFrame = (this.actualFrame + 1) % currentImages.length;
        this.image = currentImages[this.actualFrame];
      }
    }
  },

  loadImages: function() {
     for (imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.runImages.push(img);
    }
    for (imgPath of jumping) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.jumpImages.push(img);
    }
    for (imgPath of idle) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.idleImages.push(img);
    }
    this.image = this.idleImages[0];
  }
};






