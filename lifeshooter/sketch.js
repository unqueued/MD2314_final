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
    NUM_OF_HEARTS = 20,
    
    stars = [],
    NUM_OF_STARS = 40,
    score = 0,
    brokenHeartScore = 0,
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
  text(" X " + brokenHeartScore, 55, 105);
}

function mouseMoved() {
  return false;
}

function mouseDragged() {

}

function mousePressed() {
  
  //console.log("Testing X: " + mouseX + " Y: " + mouseY);
  // This really belongs inside the class... but since I'm jsut gonna only have one clickable thing, then w/e
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    if(mouseX > hearts[i].x-15 && mouseX < hearts[i].x+15
    &&
    mouseY > hearts[i].y-15 && mouseY < hearts[i].y+15) {
      console.log("Collision detected for: (" + hearts[i].x + ", " + hearts[i].y);
      hearts[i].clickedOn();
    }
  }
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
// I KNOW I can do this really ellegant where I make the beats line up by framerate... but do I NEED to?
// Maybe do... framerate / minBeatSize, so that's how much we should change each iteration to make a full cycle each second?

// Also, a very simple solution is to just have the hearts start wayyyy into negative land.
function Heart() {
  // This is really messy and I'm sure there is a much more elllegant way to do it...
  this.x = Math.random() * WIDTH;
  this.y = Math.random() * -3000;
  this.speed = 1;
  this.diameter = 4;
  this.size = 30 - (Math.random() * 5);
  this.beats = 0;
  this.alive = true;
  this.broken = false;
  this.chaseme = false;
  this.fading = false;
  this.myTint = 255;
  
  minBeatSize = 7;
  this.currentSize = this.size;
  this.lastFrameCount = 0;
  
  //console.log("Initialized heart with size: " + this.size);
  
  this.move = function() {
    this.y++;
    if(this.y > HEIGHT) {
      this.y = 0;
      this.x = Math.random() * WIDTH;
      this.size = 30 - Math.random() * 10;
    }
    
    if(this.fading) {
      return;
    }
    
    if(this.broken) {
      return;
    }
    
    // Just want it to iterate size change once every 1/4th second
    this.lastFrameCount++;
    if(this.lastFrameCount > 4) {
      this.currentSize++;
      this.lastFrameCount = 0;
    }
    
    //console.log(this.beats);
    //if(frameCount % 20 == 0) {
    //  this.beats++;
    //  this.currentSize--;
    //}

    // frameCount / minBeatSize
    //console.log("FrameCount: " + frameCount + " Mod 20: " + frameCount % 20);
    
    //this.currentSize--;
    if(this.currentSize > (this.size + minBeatSize)) {
      //if(frameRate / minBeatSize )
      
      this.currentSize = this.size;
    }
  }
  
  this.display = function() {
    if(this.fading) {
      if(this.myTint > 1) {
        this.myTint--;
      }
      tint(255, this.myTint);
    }
    if(this.broken) {
      image(tmpBrokenHeartImage, this.x, this.y, this.currentSize, this.currentSize);
    } else {
      image(tmpHeartImage, this.x, this.y, this.currentSize, this.currentSize);
    }
    noTint();
    //fill(255, 255, 255);
    //noStroke();
    //ellipse(this.x, this.y, this.diameter, this.diameter);
  }
  
  this.collidesWith = function(x, y) {
    
  }
  
  this.clickedOn = function() {
    if(!this.alive) {
      return;
    }
    //this.broken = true;
    //this.alive = false;
    //return;
    
    var outcome = Math.floor(Math.random() * 2);
    Math.floor(outcome);
    // Meh, don't wanna use switch() here
    console.log(outcome);
    // Broken
    if(outcome == 0 || outcome == 1) {
      this.broken = true;
      this.alive = false;
      this.currentSize = this.size;
      this.fading = true;
      brokenHeartScore++;
    }
    if(outcome == 1) {
      
    }
    if(outcome == 2) {
      
    }
  }
}