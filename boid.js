class Boid {
  constructor(positionX, positionY) {
    this.position = createVector(positionX, positionY);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4))
    this.acceleration = createVector();
    this.maxForce = 1;
    this.maxSpeed = 4;
    this.color = 255;  //random(255);
    this.size = 15;

    this.cohesionPerceptionRadius = 0;
    this.separationPerceptionRadius = 0;
    this.avoidObstaclePerceptionRadius = 100;
    this.alignPerceptionRadius = 0;
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
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.alignPerceptionRadius) {
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
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.cohesionPerceptionRadius) {
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
    let steering = createVector();
    let total = 0;
    for (let other of boids) {
      let distance = dist(
        this.position.x,
        this.position.y,
        other.position.x,
        other.position.y
      );
      if (other != this && distance < this.separationPerceptionRadius) {
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
    let steering = createVector();
    let total = 0;
    for (let obstacle of obstacles) {
      let distance = dist(
        this.position.x,
        this.position.y,
        obstacle.position.x,
        obstacle.position.y
      );
      if (obstacle != this && distance < this.avoidObstaclePerceptionRadius) {
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
    this.drawArrow(this.position, this.velocity, color(this.color));
  }


  // ###### CUT DOWN #####

  drawArrow(base, vec, myColor) {
    push();
    // stroke(myColor);
    strokeWeight(3);
    fill(color(255));
    translate(base.x, base.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    translate(vec.mag() - this.size, 0);
    triangle(0, this.size / 2, 0, -this.size / 2, this.size, 0);
    pop();
  }
}
