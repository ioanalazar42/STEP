var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

var player;

document.addEventListener('keydown', function(event) {
    console.log(event.key);
    movePlayer(event.key);
});

function startGame() {
  gameArea.start();
  player = new component(30, 30, "red", 10, window.innerHeight/2);
}

/* Construct a component with specifiec width
   height, color and coordinates where it is
   places in the canvas */
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 1;
    this.speedY = y;
    this.x = x;
    this.y = y;
    this.update = function() {
      ctx = gameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y = this.speedY;
    }
}

function updateGameArea() {
  gameArea.clear();
  player.newPos();
  player.update();
}

function moveUp() {
     player.speedY -= 20;
}

function moveDown() {
     player.speedY += 20;
}

function movePlayer(key) {
    switch(key) {
        case "w":
          moveUp();
          break;
        case "s":
          moveDown();
          break;
    } // switch
}