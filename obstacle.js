class Obstacle {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
  }

  show() {
    strokeWeight(20);
    stroke("red");
    point(this.position.x, this.position.y);
  }
}
