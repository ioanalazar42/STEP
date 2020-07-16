var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
     window.addEventListener('keydown', function (e) {
      gameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
      gameArea.key = false;
    })
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

var player;

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
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.updatePos = function() {
      ctx = gameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.newSpeed = function() {
        player.speedX = 0;
        player.speedY = 0;

        keyPressed = getKey(gameArea.key);
        switch(keyPressed) {
            case "UP":
              player.speedY = -3;
              break;
            case "DOWN":
              player.speedY = 3;
              break;
            default:
              break;
        } // switch
    }
} // component

function updateGameArea() {
  gameArea.clear();
  player.newSpeed();
  player.newPos();
  player.updatePos();
}

function getKey(key) {
    if (gameArea.key == 38 || gameArea.key == 87) {
      return "UP";
    } else if (gameArea.key == 40 || gameArea.key == 83) {
      return "DOWN";
    } else {
      return -1;
    }
}