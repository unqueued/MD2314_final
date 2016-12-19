var

    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    FPS = 60; // Frames per second
    hearts = [],
    NUM_OF_HEARTS = 3,
    
    stars = [],
    NUM_OF_STARS = 20,
    score = 0;
    

function setup() {
  createCanvas(WIDTH, HEIGHT);
  frameRate(FPS);
  loop();
}

function draw() {
  background(0, 0, 0);
  
  
  
  update();
}

function windowResized() {
    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    resizeCanvas(WIDTH, HEIGHT);
}

function update() {
  
}