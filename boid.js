class Boid {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.noise = createVector(0,0); // default off
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.color = "#FFFFFF"; // default white
    this.size = 15;

    this.alignPerceptionRadius = defaultAlignPerceptionRadius;
    this.cohesionPerceptionRadius = defaultCohesionPerceptionRadius;
    this.separationPerceptionRadius = defaultSeparationPerceptionRadius;
    this.avoidObstaclePerceptionRadius = 100;
  }

  // Infinity Edge Effect
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

  // Returns list of boids in inputted percepion radius around boid
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

  // Boid alignment rule
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

  // Boid cohesion rule
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

  // Boid separation rule
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

  // Avoid obstacles rule
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

  // Boid flock behaviour
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

  // Apply most recent movement variables to boid
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    this.updateNoise();
    this.velocity.add(this.noise);

    this.acceleration.mult(0); // reset (acceleration does not accumulate over time)

    this.alignPerceptionRadius = alignPerceptionRadiusSlider.value();
    this.cohesionPerceptionRadius = cohesionPerceptionRadiusSlider.value();
    this.separationPerceptionRadius = separationPerceptionRadiusSlider.value();
  }

  // Set movement noise of boid based on noise slider
  updateNoise() {
    this.noise = createVector(random(noiseSlider.value()) - (noiseSlider.value()/2),
                              random(noiseSlider.value()) - (noiseSlider.value()/2)
                              );
  }

  // Draw boid
  show() {
    this.drawBoidArrow(this.position, this.velocity, color(this.color));
  }

  // Set color of boid
  setColor(newColor) {
    this.color = newColor;
  }

  // Draw the arrow of boid facing direction of acceleration
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
