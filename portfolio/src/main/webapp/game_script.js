function startGame() {
  gameArea.start();
}

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}