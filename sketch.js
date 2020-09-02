let flock = [];
let obstacles = [];

const defaultAlignPerceptionRadius = 80;
const defaultCohesionPerceptionRadius = 90;
const defaultSeparationPerceptionRadius = 50;
// Sliders
let alignSlider, cohesionSlider, separationSlider, noiseSlider, maxSpeedSlider, maxForceSlider, alignPerceptionRadiusSlider, cohesionPerceptionRadiusSlider, separationPerceptionRadiusSlider;

function setup() {
  // Create control sliders
  createControlSliders();

  // Create canvas for inspect boid parameters
  new p5(boidInspect);

  // Create evironment canvas (resize once inserted into environmentWrapper (expands))
  environment = createCanvas(1,1);
  environment.parent('environmentWrapper');
  let environmentWrapperWidth = document.getElementById("environmentWrapper").offsetWidth;
  let controlsWrapperHeight = document.getElementById("controlsWrapper").offsetHeight;
  resizeCanvas(environmentWrapperWidth, controlsWrapperHeight);
  environment.mouseClicked(mouseClickedOnEvironment);

  // Create boids and add to flock
  for (let i = 0; i < 50; i++) {
    flock.push(new Boid(random(width), random(height)));
  }
  // Create randomly placed obstacles
  for (let i = 0; i < 6; i++) {
    obstacles.push(new Obstacle(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(document.getElementById("environmentWrapper").offsetWidth, document.getElementById("controlsWrapper").offsetHeight);
}

function mouseClickedOnEvironment() {
  // Find what to place (checkbox)
  if (document.getElementById("placementA").checked == true) {
    flock.push(new Boid(mouseX, mouseY));
  }
  if (document.getElementById("placementB").checked == true) {
    obstacles.push(new Obstacle(mouseX, mouseY));
  }
}

function updateBoidColor() {
  for (let boid of flock) {
    boid.setColor(document.getElementById("boidColorPicker").value);
  }
}

function draw() {
  background(50);
  // background()
  noStroke();
  // Update each boid
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock, obstacles);
    boid.update();
    boid.show();
  }
  // Update each obstacle
  for (let obstacle of obstacles) {
    obstacle.show();
  }
  // Update slider labels
  updateControlSliderLabels();
}

function clearObstacles() {
  obstacles = [];
}

function clearBoids() {
  flock = [];
}

var boidInspect = function(sketch) {
  sketch.setup = function() {
    //create boid inspect canvas
    let boidInspectWrapperWidth = document.getElementById("boidInspectWrapper").offsetWidth;
    let boidInspectWrapperHeight = document.getElementById("boidInspectWrapper").offsetHeight;
    let boidInspectCanvas = sketch.createCanvas(boidInspectWrapperWidth, boidInspectWrapperHeight);
    boidInspectCanvas.parent('boidInspectWrapper');

    // Crate labels for boid inspect
    createBoidInspectSliders();
  }
  sketch.draw = function() {
    sketch.background(48);
    updateBoidInspectLabels(flock[0], sketch);

  }
}

function createControlSliders() {
  let sliderWidth = document.getElementById("allControlsInnerSliders").offsetWidth + "px";
  let marginTop = "0px";

  alignmentValueLabel= createDiv("Alignment: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  alignSlider = createSlider(0, 2, 1, 0.1).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);

  cohesionValueLabel= createDiv("Cohesion: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  cohesionSlider = createSlider(0, 2, 0.8, 0.1).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);

  separationValueLabel= createDiv("Separation: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  separationSlider = createSlider(0, 2, 1.1, 0.1).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);

  noiseValueLabel= createDiv("Noise: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  noiseSlider = createSlider(0, 1.5, 0.25  , 0.25).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);

  maxSpeedValueLabel= createDiv("Max Speed: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  maxSpeedSlider = createSlider(2.5, 12, 6, 0.5).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);

  maxForceValueLabel= createDiv("Max Force: ").parent("allControlsInnerSliders").addClass("sliderValueLabel");
  maxForceSlider = createSlider(0.1, 4, 1.1, 0.1).parent("allControlsInnerSliders").style('width', sliderWidth).style("margin-top", marginTop);
}

function updateControlSliderLabels() {
  if (alignSlider.value() == 0) { alignmentValueLabel.html("Alignment: OFF");
  } else { alignmentValueLabel.html("Alignment: " + alignSlider.value()); }

  if (cohesionSlider.value() == 0) { cohesionValueLabel.html("Cohesion: OFF");
  } else { cohesionValueLabel.html("Cohesion: " + cohesionSlider.value()); }

  if (separationSlider.value() == 0) { separationValueLabel.html("Separation: OFF");
  } else { separationValueLabel.html("Separation: " + separationSlider.value()); }

  if (noiseSlider.value() == 0) { noiseValueLabel.html("Noise: OFF");
} else { noiseValueLabel.html("Noise: " + noiseSlider.value()); }

  maxSpeedValueLabel.html("Max Speed: " + maxSpeedSlider.value());

  maxForceValueLabel.html("Max Force: " + maxForceSlider.value());
}

function createBoidInspectSliders() {
  sliderWidth = document.getElementById("boidPerceptionControlsInner").offsetWidth + "px";

  alignPerceptionValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
  alignPerceptionRadiusSlider = createSlider(10, 200, defaultAlignPerceptionRadius, 10).parent('boidPerceptionControlsInner').style('width', sliderWidth);

  cohesionPerceptionValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
  cohesionPerceptionRadiusSlider = createSlider(10, 200, defaultCohesionPerceptionRadius, 10).parent('boidPerceptionControlsInner').style('width', sliderWidth);

  separationPerceptionValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
  separationPerceptionRadiusSlider = createSlider(10, 200, defaultSeparationPerceptionRadius, 10).parent('boidPerceptionControlsInner').style('width', sliderWidth);
}

function updateBoidInspectLabels(selectedBoid, sketch) {
  if (selectedBoid == null) {
    // New Boid won't appear because it is not added to the flock array
    selectedBoid = new Boid(0,0);
  }
  sketch.fill(color(255, 212, 38));
  sketch.ellipse(sketch.width/2, sketch.height/2, selectedBoid.alignPerceptionRadius, selectedBoid.alignPerceptionRadius);
  alignPerceptionValueLabel.html("Align Perception: " + selectedBoid.alignPerceptionRadius + "px");

  sketch.fill(color(200,204,0,126));
  sketch.ellipse(sketch.width/2, sketch.height/2, selectedBoid.cohesionPerceptionRadius, selectedBoid.cohesionPerceptionRadius);
  cohesionPerceptionValueLabel.html("Cohesion Perception: " + selectedBoid.cohesionPerceptionRadius + "px");

  sketch.fill(color(255,226,110,126));
  sketch.ellipse(sketch.width/2, sketch.height/2, selectedBoid.separationPerceptionRadius, selectedBoid.separationPerceptionRadius);
  separationPerceptionValueLabel.html("Separation Perception: " + selectedBoid.separationPerceptionRadius + "px");

  sketch.fill(selectedBoid.color);
  let size = selectedBoid.size / 2;
  sketch.triangle((sketch.width/2)-size, sketch.height/2, (sketch.width/2)+size, (sketch.height/2)+size, (sketch.width/2)+size, (sketch.height/2)-size);
}
