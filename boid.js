class Boid {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4))
    this.acceleration = createVector();
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.color = random(10);
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
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

 // TODO: refactor so looking at local flock code is not repeated
  cohesion(boids) {
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < perceptionRadius) {
        steering.add(other.position);
        total++;
      }
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
    let perceptionRadius = 50;
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < perceptionRadius) {
        let difference = p5.Vector.sub(this.position, other.position);
        difference.div(distance * distance);
        steering.add(difference);
        total++;
      }
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
    let perceptionRadius = 100;
    let steering = createVector();
    let total = 0;
    for (let obstacle of obstacles) {
      let distance = dist(
        this.position.x,
        this.position.y,
        obstacle.position.x,
        obstacle.position.y
      );
      if (obstacle != this && distance < perceptionRadius) {
        let difference = p5.Vector.sub(this.position, obstacle.position);
        difference.div(distance * distance);
        difference.normalize();
        steering.add(difference);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  flockColor(boids) {
    let perceptionRadius = 50;
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < perceptionRadius) {
        this.color += (other.color * 0.5);
        total++;
      }
    }
    if (total > 0) {
      this.color = this.color / total;
    }
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
    this.flockColor(boids);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0); // reset (acceleration does not accumulate over time)
  }

  show() {
    strokeWeight(8);
    // stroke(this.color);
    // point(this.position.x, this.position.y);
    drawArrow(this.position, this.velocity, color(this.color));
  }
}

// ###########

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
