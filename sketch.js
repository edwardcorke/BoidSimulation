const flock = [];
const obstacles = [];

let alignSlider, cohesionSlider, separationSlider, maxSpeedSlider, maxForceSlider, alignPerceptionRadiusSlider, cohesionPerceptionRadiusSlider, separationPerceptionRadiusSlider;

function setup() {

  let environmentWrapperWidth = document.getElementById("environmentWrapper").offsetWidth;
  let environmentWrapperHeight = document.getElementById("environmentWrapper").offsetHeight;
  environment = createCanvas(environmentWrapperWidth, environmentWrapperHeight);
  environment.parent('environmentWrapper')


  let sliderWidth = "300px";
  let marginTop = "0px";
  createP("Alignment").parent("allControlsInner");
  alignSlider = createSlider(0, 2, 1, 0.1).parent("allControlsInner").style('width', sliderWidth).style("margin-top", marginTop);
  createP("Cohesion").parent("allControlsInner");
  cohesionSlider = createSlider(0, 2, 1, 0.1).parent("allControlsInner").style('width', sliderWidth).style("margin-top", marginTop);
  createP("Separation").parent("allControlsInner");
  separationSlider = createSlider(0, 2, 1, 0.1).parent("allControlsInner").style('width', sliderWidth).style("margin-top", marginTop);
  createP("Max Speed").parent("allControlsInner");
  maxSpeedSlider = createSlider(0.1, 8, 4, 0.1).parent("allControlsInner").style('width', sliderWidth).style("margin-top", marginTop);
  createP("Max Force").parent("allControlsInner");
  maxForceSlider = createSlider(0.1, 4, 1, 0.1).parent("allControlsInner").style('width', sliderWidth).style("margin-top", marginTop);



  for (let i = 0; i < 100; i++) {
    flock.push(new Boid(random(width), random(height)));
  }

  new p5(boidInspect);
}

function mouseClicked() {
  // flock.push(new Boid(mouseX, mouseY));
  obstacles.push(new Obstacle(mouseX, mouseY));
}

function draw() {
  background(51);
  noStroke();
  ellipse(flock[0].position.x, flock[0].position.y, flock[0].alignPerceptionRadius, flock[0].alignPerceptionRadius)
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

var boidInspect = function(sketch) {
  sketch.setup = function() {
    let boidInspectWrapperWidth = document.getElementById("boidInspectWrapper").offsetWidth;
    let boidInspectWrapperHeight = document.getElementById("boidInspectWrapper").offsetHeight;

    let boidInspectCanvas = sketch.createCanvas(boidInspectWrapperWidth, boidInspectWrapperHeight);
    boidInspectCanvas.parent('boidInspectWrapper');

    // createP("Align Perception").parent("boidPerceptionControlsInner");
    alignValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
    alignPerceptionRadiusSlider = createSlider(10, 250, 50, 10).parent('boidPerceptionControlsInner');

    // createP("Cohesion Perception").parent("boidPerceptionControlsInner");
    cohesionValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
    cohesionPerceptionRadiusSlider = createSlider(10, 250, 100, 10).parent('boidPerceptionControlsInner');

    // createP("Separation Perception").parent("boidPerceptionControlsInner");
    separationValueLabel = createDiv("").parent("boidPerceptionControlsInner").addClass("sliderValueLabel");
    separationPerceptionRadiusSlider = createSlider(10, 250, 50, 10).parent('boidPerceptionControlsInner');

  }
  sketch.draw = function() {
    sketch.background(48);
    selectedBoid = flock[0]; //random(flock.length)


    sketch.fill(color(150));
    sketch.ellipse(sketch.width/2, sketch.height/2, flock[0].alignPerceptionRadius, flock[0].alignPerceptionRadius);
    alignValueLabel.html("Align Perception: " + flock[0].alignPerceptionRadius + "px");

    sketch.fill(color(200,200,200,126));
    sketch.ellipse(sketch.width/2, sketch.height/2, flock[0].cohesionPerceptionRadius, flock[0].cohesionPerceptionRadius);
    cohesionValueLabel.html("Cohesion Perception: " + flock[0].cohesionPerceptionRadius + "px");

    sketch.fill(color(255,255,255,126));
    sketch.ellipse(sketch.width/2, sketch.height/2, flock[0].separationPerceptionRadius, flock[0].separationPerceptionRadius);
    separationValueLabel.html("Separation Perception: " + flock[0].separationPerceptionRadius + "px");

    sketch.fill(255);
    let size = flock[0].size / 2;
    sketch.triangle((sketch.width/2)-size, sketch.height/2, (sketch.width/2)+size, (sketch.height/2)+size, (sketch.width/2)+size, (sketch.height/2)-size);

  }
}

// // TODO: remove repeat


// TODO:
//  - flock colouring
//  - display controls
//  - add obsticles
