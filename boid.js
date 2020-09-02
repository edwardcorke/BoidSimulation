class Boid {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4))
    this.acceleration = createVector();
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.color = "#FFFFFF";//random(255);
    this.size = 15;

    this.cohesionPerceptionRadius = 0;
    this.separationPerceptionRadius = 0;
    this.avoidObstaclePerceptionRadius = 100;
    this.alignPerceptionRadius = 0;
  }

  edges() {
    // Infinity edge effect
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

  getLocalFlock(objects, perceptionRadius) {
    let localFlock = [];
    for (let other of objects) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < perceptionRadius) {
        localFlock.push(other);
      }
    }
    return localFlock;
  }

  align(boids) {
    let steering = createVector();
    let total = 0;
    // Operate in local flock
    for (let neighbour of this.getLocalFlock(boids, this.alignPerceptionRadius)) {
      steering.add(neighbour.velocity);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    // Operate in local flock
    for (let neighbour of this.getLocalFlock(boids, this.cohesionPerceptionRadius)) {
      steering.add(neighbour.position);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.position)
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids) {
    let steering = createVector();
    let total = 0;
    // Operate in local flock
    for (let neighbour of this.getLocalFlock(boids, this.separationPerceptionRadius)) {
      let difference = p5.Vector.sub(this.position, neighbour.position);
      let distance = dist(this.position.x, this.position.y, neighbour.position.x, neighbour.position.y);
      difference.div(distance * distance);
      steering.add(difference);
      total++;
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  avoidObstacle(obstacles) {
    let steering = createVector();
    let total = 0;
    // Operate in local flock
    for (let obstacle of this.getLocalFlock(obstacles, this.avoidObstaclePerceptionRadius)) {
        let difference = p5.Vector.sub(this.position, obstacle.position);
        let distance = dist(this.position.x, this.position.y, obstacle.position.x, obstacle.position.y);
        difference.div(distance * distance);
        difference.normalize();
        steering.add(difference);
        total++;
      }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flock(boids, obstacles) {
    let alignment = this.align(boids);
    let avoidAlignment = this.avoidObstacle(obstacles);
    let cohesion = this.cohesion(boids);
    let separation = this.separation(boids);

    separation.mult(separationSlider.value());
    cohesion.mult(cohesionSlider.value());
    alignment.mult(alignSlider.value());
    this.maxSpeed = maxSpeedSlider.value();
    this.maxForce = maxForceSlider.value();

    this.acceleration.add(alignment);
    this.acceleration.add(avoidAlignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); // reset (acceleration does not accumulate over time)

    this.alignPerceptionRadius = alignPerceptionRadiusSlider.value();
    this.cohesionPerceptionRadius = cohesionPerceptionRadiusSlider.value();
    this.separationPerceptionRadius = separationPerceptionRadiusSlider.value();
  }

  show() {
    this.drawBoidArrow(this.position, this.velocity, color(this.color));
  }

  setColor(newColor) {
    this.color = newColor;
  }


  // ###### CUT DOWN #####

  drawBoidArrow(base, vec, myColor) {
    push(); //save current drawings
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    translate(vec.mag() - this.size, 0);
    triangle(0, this.size / 2, 0, -this.size / 2, this.size, 0);
    pop(); //restore current drawings
  }
}
