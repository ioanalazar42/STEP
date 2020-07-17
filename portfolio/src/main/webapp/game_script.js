var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    gameArea.mouseControl = false;
    window.addEventListener('keydown', function (e) {
      gameArea.key = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
      if (gameArea.key == 77) {
        /* if the key that was just pressed was "m"
           activate mouse controls */ 
          gameArea.mouseControl = !gameArea.mouseControl;
      }
      gameArea.key = false;
    })
    window.addEventListener('mousemove', function (e) {
      gameArea.x = e.pageX;
      gameArea.y = e.pageY;
    })
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
} // gameArea

var player;
var obstacle;

function startGame() {
  gameArea.start();
  player = new component(30, 30, "red", 10, window.innerHeight/2);
  obstacle = new component(10, 200, "green", 300, 120);
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
    this.mouseControl = false;
    this.updatePos = function() {
      ctx = gameArea.context;
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (gameArea.x && gameArea.y && gameArea.mouseControl) {
            /* if mouse position exists and mouse control 
               is enabled set player y coord to mouse y coord
               - player only moves vertically*/
            this.y = gameArea.y;
        }
    }
    this.newSpeed = function() {
        this.speedX = 0;
        this.speedY = 0;

        keyPressed = getKey(gameArea.key);
        switch(keyPressed) {
            case "UP":
              this.speedY = -3;
              break;
            case "DOWN":
              this.speedY = 3;
              console.log("down");
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

/* Returns a string depending on the code of 'key' */
function getKey(key) {
    if (gameArea.key == 38 || gameArea.key == 87) {
      return "UP";
    } else if (gameArea.key == 40 || gameArea.key == 83) {
      return "DOWN";
    } else {
        return -1;
    }
}