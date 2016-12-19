// TODO
// Making hearts throb should not be hard
// Also, making a couple of different layers of stars, with slower, more dim stars in the background
// Also, making a movement vector, so you have to chase it.
// ALSO, make a cooooool ending sequence, where the stars speed up and it goes white, and then you get one last chance.

var

    WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    FPS = 60; // Frames per second
    hearts = [],
    NUM_OF_HEARTS = 12,
    
    stars = [],
    NUM_OF_STARS = 40,
    score = 0,
    tmpHeartImage = null,
    tmpBrokenHeartImage = null;
    
function preload() {
  //tmpHeartImage = loadImage("lifeshooter/images/Heart.svg");
  
  tmpHeartImage = loadImage("images/Heart.svg", 
  function() {console.log("succeeded in loading");},
  function(e) {console.log("Failed to load because: "+e); } );
  //console.log("Loaded :" + tmpHeartImage);
  
  tmpBrokenHeartImage = loadImage("images/Broken_heart.svg", 
  function() {console.log("succeeded in loading");},
  function(e) {console.log("Failed to load because: "+e); } );
  
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  
  // Initialize onscreen entities
  for(var i = 0; i < NUM_OF_STARS; i++) {
    stars.push(new Star);
  }
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts.push(new Heart);
  }
  
  
  
  imageMode(CENTER);
  
  frameRate(FPS);
  loop();
}

function draw() {
  
  background(0, 0, 0);
  
  // There is much debate about best practices for iteration in js...
  // Draw stars
  for(var i = 0; i < NUM_OF_STARS; i++) {
    stars[i].display();
  }
  // Draw hearts
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts[i].display();
  }
  
  //image(tmpHeartImage, 50, 50, 80, 80);
  
  drawScore();
  
  update();
}

function update() {
  // Move stars
  for(var i = 0; i < NUM_OF_STARS; i++) {
    stars[i].move();
  }
  // Move hearts
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts[i].move();
  }
}

function drawScore() {
  // Draw score
  fill(255, 255, 255);
  textSize(32);
  //text("High score: " + score, 20, 30);
  text("Score:", 20, 30);
  image(tmpHeartImage, 38, 55, 40, 40);
  text(" X " + score, 55, 65);
  image(tmpBrokenHeartImage, 38, 95, 35, 35);
  text(" X " + score, 55, 105);
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
  this.color = 255;
  
  this.move = function() {
    this.y++;
    if(this.y > HEIGHT) {
      this.y = 0;
      this.x = Math.random() * WIDTH;
    }
  }
  
  this.display = function() {
    fill(this.color, this.color, this.color);
    noStroke();
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

// Heart class
function Heart() {
  this.x = Math.random() * WIDTH;
  this.y = Math.random() * HEIGHT;
  this.speed = 1;
  this.diameter = 4;
  this.size = 30;
  
  minBeatSize = this.size - 5;
  this.currentSize = this.size;
  
  
  this.move = function() {
    this.y++;
    if(this.y > HEIGHT) {
      this.y = 0;
      this.x = Math.random() * WIDTH;
    }
    
    this.currentSize--;
    if(this.currentSize < minBeatSize) {
      this.currentSize = this.size;
    }
  }
  
  this.display = function() {
    image(tmpHeartImage, this.x, this.y, this.currentSize, this.currentSize);
    //fill(255, 255, 255);
    //noStroke();
    //ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}