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
      const keycode_M = 77;
      if (gameArea.key == keycode_M) {
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
  },
  updateInstructions : function() {
      INSTR_UP.update();
      INSTR_DOWN.update();
      INSTR_MOUSE.update();
  }
} // gameArea

/* Returns true if the current frame number
   corresponds with the given interval */
function everyInterval(givenInterval) {
  return gameArea.frameNo % givenInterval == 0;
}

var player;
var obstacles = [];
var score;

/* multiple intruction boxes becaise
   canvas does not support multi-line */
var INSTR_UP;
var INSTR_DOWN;
var INSTR_MOUSE;

function startGame() {
  player = new component(30, 30, "red", 10, window.innerHeight/2);
  score = new component("30px", "Consolas", "black", window.innerWidth - 200, 30, "text");

  // create a component for each instruction box
  INSTR_UP = new component("20px", "Consolas", "black", window.innerWidth - 250, window.innerHeight - 90, "text");
  INSTR_DOWN = new component("20px", "Consolas", "black", window.innerWidth - 250, window.innerHeight - 65, "text");
  INSTR_MOUSE = new component("20px", "Consolas", "black", window.innerWidth - 250, window.innerHeight - 40, "text");

  // unicodes for down and up arrows
  UPArrSymbol = "\u2B06";
  DOWNArrSymbol = "\u2B07";

  INSTR_UP.text = "w/" + UPArrSymbol + " > up";
  INSTR_DOWN.text = "s/" + DOWNArrSymbol + " > down";
  INSTR_MOUSE.text = "m > on/off mouse control";

  gameArea.start();
}

/* Construct a component with specifiec width
   height, color and coordinates where it is
   places in the canvas */
function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.mouseControl = false;
    this.update = function() {
      ctx = gameArea.context;
      if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
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
  var xObstacle;
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
    /* x coord <- width because new obstacle always spans at end of screen */
    xObstacle = gameArea.canvas.width;

    minHeight = gameArea.canvas.height/6;
    maxHeight = gameArea.canvas.height/2;
    height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);

    minGap = 80;
    maxGap = gameArea.canvas.height/3;
    gap = gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

    obstacles.push(new component(50, height, "green", xObstacle, 0));
    obstacles.push(new component(50, xObstacle - height - gap, "green", xObstacle, height + gap));
  }
  for (i = 0; i < obstacles.length; i += 1) {
    obstacles[i].x += -5;
    obstacles[i].update();
  }
  score.text = "SCORE: " + gameArea.frameNo;
  score.update();
  gameArea.updateInstructions();
  player.newSpeed();
  player.newPos();
  player.update();
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