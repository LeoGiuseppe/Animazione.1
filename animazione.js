function startGame() {
    myGameArea.start();
   animatedObject.loadImages();
   animatedObject.idle();
}

var myGameArea = {  
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
         this.interval = setInterval(updateGameArea, 20);
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
  groundLevel: 420,
  width: 60,
  height: 60,
  x: 10,
  y: 420,
  imageList: [], 
  contaFrame: 0, 
  actualFrame: 0, 

  update: function() {
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Applica la gravità
    if (this.y < this.groundLevel) {
      this.speedY += this.gravity;
    } else {
      this.y = this.groundLevel;
      this.speedY = 0;
    }
    
    if (this.speedX !== 0 || this.speedY !== 0) {
      this.contaFrame++;
      if (this.contaFrame == 4) {
        this.contaFrame = 0;
        this.actualFrame = (1 + this.actualFrame) % this.imageList.length;
        this.image = this.imageList[this.actualFrame];
      }
    } else {
      this.idle();
    }
  },

  idle: function(){
     this.image = new Image(this.width, this.height);
    this.image.src = "https://i.ibb.co/4wG3nPHb/Idle-000.png";
  },
  

  loadImages: function() {
     for (imgPath of running) {
      var img = new Image(this.width, this.height);
      img.src = imgPath;
      this.imageList.push(img);
     
    }
    this.image = this.imageList[this.actualFrame];
  }
};




