var

    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    FPS = 60; // Frames per second
    hearts = [],
    NUM_OF_HEARTS = 3,
    
    stars = [],
    NUM_OF_STARS = 40,
    score = 0;
    

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  // Initialize onscreen entities
  for(var i = 0; i < NUM_OF_STARS; i++) {
    /*
    stars.push({
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT
    });
    */
    stars.push(new Star);
  }
  
  frameRate(FPS);
  loop();
}

function draw() {
  
  background(0, 0, 0);
  
  // Draw stars
  // There is much debate about best practices for iteration in js...
  for(var i = 0; i < NUM_OF_STARS; i++) {
    stars[i].display();
    //fill(255, 255, 255);
    //noStroke();
    //ellipse(stars[i].x, stars[i].y, 10, 10);
  }
  
  update();
}



function update() {
  //console.log("Updating...");
  //console.log("Star: " + stars[2].x);
  for(var i = 0; i < NUM_OF_STARS; i++) {
    /*
    stars[i].y++;
    if(stars[i].y > HEIGHT) {
      stars[i].y = 0;
      stars[i].x = Math.random() * WIDTH;
    }
    */
    stars[i].move();
  }
}

function mouseMoved() {
  return false;
}

function mouseDragged() {

}

function mousePressed() {

}

function windowResized() {
    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    resizeCanvas(WIDTH, HEIGHT);
}

// Star class
function Star() {
  this.x = Math.random() * WIDTH;
  this.y = Math.random() * HEIGHT;
  this.speed = 1;
  this.diameter = 4;
  
  this.move = function() {
    this.y++;
    if(this.y > HEIGHT) {
      this.y = 0;
      this.x = Math.random() * WIDTH;
    }
  }
  
  this.display = function() {
    fill(255, 255, 255);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}