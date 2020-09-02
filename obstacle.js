class Obstacle {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
  }

  show() {
    strokeWeight(20);
    stroke(color(255, 209, 25));
    point(this.position.x, this.position.y);
  }
}
