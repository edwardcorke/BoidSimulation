class Boid {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4))
    this.acceleration = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  align(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(this.position.x, this.position.y, other.position.x, this.position.y);
      if (distance < perceptionRadius && other != this) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce)
      return steering;
    }
    return steering;
  }

 // TODO: refactor so looking at local flock code is not repeated
  cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(this.position.x, this.position.y, other.position.x, this.position.y);
      if (distance < perceptionRadius && other != this) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position)
      // steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce)
      return steering;
    }
    return steering;
  }

  flock(boids) {
    this.acceleration.mult(0); // reset (acceleration does not accumulate over time)
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids)
    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
  }

  show() {
    strokeWeight(8);
    stroke(255);
    point(this.position.x, this.position.y);
  }
}
