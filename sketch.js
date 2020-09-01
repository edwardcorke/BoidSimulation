const flock = [];
const obstacles = [];

let alignSlider, cohesionSlider, separationSlider, maxSpeedSlider, maxForceSlider;

function setup() {
  createCanvas(1500, 900);
  alignSlider = createSlider(0, 2, 1, 0.1);
  cohesionSlider = createSlider(0, 2, 1, 0.1);
  separationSlider = createSlider(0, 2, 1, 0.1);
  maxSpeedSlider = createSlider(0.1, 8, 4, 0.1);
  maxForceSlider = createSlider(0.1, 4, 1, 0.1);

  for (let i = 0; i < 100; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
}

function mouseClicked() {
  // flock.push(new Boid(mouseX, mouseY));
  obstacles.push(new Obstacle(mouseX, mouseY));
}

function draw() {
  background(51);
  noStroke();
  ellipse(flock[0].position.x, flock[0].position.y, 50, 50)
  fill(color(255, 204, 0));
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock, obstacles);
    boid.update();
    boid.show();
  }
  for (let obstacle of obstacles) {
    obstacle.show();
  }
}

// TODO:
//  - flock colouring
//  - display controls
//  - add obsticles
