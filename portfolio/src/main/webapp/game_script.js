var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
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
  },
  stop : function() {
    clearInterval(this.interval);
  }
} // gameArea

/* Returns true if the current frame number
   corresponds with the given interval */
function everyInterval(givenInterval) {
  if ((gameArea.frameNo / givenInterval) % 1 == 0) {return true;}
  return false;
}

var player;
var obstacles = [];

function startGame() {
  player = new component(30, 30, "red", 10, window.innerHeight/2);
  gameArea.start();
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
              break;
            default:
              break;
        } // switch
    },
    this.crashWith = function(otherObj) {
      /* Get left, right, top, bottom for this object */
      var l = this.x;
      var r = this.x + (this.width);
      var top = this.y;
      var bttm = this.y + (this.height);

      /* Get left, right, top, bottom for other object */
      var otherL = otherObj.x;
      var otherR = otherObj.x + (otherObj.width);
      var otherTop = otherObj.y;
      var otherBttm = otherObj.y + (otherObj.height);
      var crash = true;

      var crash = true;
      if ((bttm < otherTop) ||
          (top > otherBttm) ||
          (r < otherL)      ||
          (l > otherR)) {
      crash = false;
    }
    return crash;
  }
} // component

function updateGameArea() {
  var x, y;
  for (i = 0; i < obstacles.length; i += 1) {
    if (player.crashWith(obstacles[i])) {
      gameArea.stop();
      return;
    } 
  }
  gameArea.clear();
  /* count frames and add obstacle every 100th frame */
  gameArea.frameNo += 1;
  if (gameArea.frameNo == 1 || everyInterval(100)) {
    /* x <- width because new obstacle always spans at end of screen */
    x = gameArea.canvas.width;  
    y = gameArea.canvas.height - gameArea.canvas.height/2;
    obstacles.push(new component(50, gameArea.canvas.height/2, "green", x, y));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -5;
    obstacles[i].updatePos();
  }
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