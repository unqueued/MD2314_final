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
    NUM_OF_STARS = 90,
    score = 0,
    brokenHeartScore = 0,
    tmpHeartImage = null,
    tmpBrokenHeartImage = null,
    missedHearts = 0,
    endingState = false,
    finalHeart = null,
    missedHeartsThreshold = 10,
    brokenHeartsThreshold = 10,
    scoreHeart = null,
    creditsState = false;
    
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
    stars.push(new Star());
    if(i < 30) {
      stars[i].color = 100;
      stars[i].speed = 1;
    }
    else if(i < 60) {
      stars[i].color = 150;
      stars[i].speed = 2;
    }
  }
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts.push(new Heart());
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
    // THere's a much more ellegant way to do this... but just gonna do it static
    
  }
  // Draw hearts
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts[i].display();
  }
  
  if(endingState) {
    finalHeart.display();
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
  
  if(endingState) {
    finalHeart.move();
  }
}

function drawScore() {
  // Draw score
  fill(255, 255, 255);
  textSize(32);
  //text("High score: " + score, 20, 30);
  text("Score:", 20, 30);
  
  if(!creditsState) {
    image(tmpHeartImage, 38, 55, 40, 40);
    text(" X " + score, 55, 65);
  } else {
    if(scoreHeart != null) {
      scoreHeart.move();
      scoreHeart.display();
      text("Congratulations", (WIDTH / 2) - 100, HEIGHT / 3);
    }
    //image(tmpHeartImage, 38, 55, 40, 40);
    text(" X " + score, 55, 65);
  }
  image(tmpBrokenHeartImage, 38, 95, 35, 35);
  text(" X " + brokenHeartScore, 55, 105);
}

function startEndingState() {
  // As the other hearts fade, this new one starts to rise
  endingState = true;
  for(var i = 0; i < NUM_OF_HEARTS; i++) {
    hearts[i].fading = true;
    hearts[i].alive = false;
  }
  finalHeart = new Heart();
  finalHeart.x = WIDTH / 2;
  finalHeart.y = HEIGHT;
  finalHeart.speed = -1;
  //finalHeart.size = finalHeart.size * 2;
  finalHeart.isFinalHeart = true;
  //hearts.push(finalHeart); // So that collision detection detects it
}

function mouseMoved() {
  return false;
}

function mouseDragged() {

}

function keyPressed() {
  if(keyCode === ENTER) {
    startEndingState();
  }
}

function mousePressed() {
  
  if(endingState) {
    if(mouseX > finalHeart.x-15 && mouseX < finalHeart.x+15) {
      finalHeart.clickedOn();
      //finalHeart.x = 38;
      //finalHeart.y = 55;
      score++;
      console.log("GAME IS ENDED");
      creditsState = true;
      scoreHeart = new Heart();
      scoreHeart.x = 38;
      scoreHeart.y = 55;
      scoreHeart.speed = 0;
    }
  }
  
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
  this.speed = 3;
  this.diameter = 4;
  this.color = 255;
  
  this.move = function() {
    this.y+=this.speed;
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
  this.y = Math.random() * -1000;
  this.speed = 1;
  this.diameter = 4;
  this.size = 30 - (Math.random() * 5);
  this.beats = 0;
  this.alive = true;
  this.broken = false;
  this.chaseme = false;
  this.fading = false;
  this.myTint = 255;
  this.layer = 0;
  this.isFinalHeart = false;
  
  minBeatSize = 7;
  this.currentSize = this.size;
  this.lastFrameCount = 0;
  
  //console.log("Initialized heart with size: " + this.size);
  
  this.move = function() {
    if(this.isFinalHeart) {
      if(this.y > HEIGHT / 2) {
        this.y += this.speed;
      }
    } else {
      this.y += this.speed;
    }
    
    if(this.fading) {
      return;
    }
    
    if(this.broken) {
      return;
    }
    
    if(!this.alive) {
      return;
    }
    
    if(this.y > HEIGHT) {
      missedHearts++;
      console.log("MissedHearts: " + missedHearts)
      this.alive = false;
      if(missedHearts > missedHeartsThreshold) {
        startEndingState();
      }
      //this.y = 0;
      //this.x = Math.random() * WIDTH;
      //this.size = 30 - Math.random() * 10;
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
    if(this.myTint < 10) {
      return;
    }
    
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
    if(this.isFinalHeart) {
      if(this.y >= HEIGHT / 2) {
        return;
      } else {
        console.log("IM DOING THIS BECAUSE " + this.y + " >= " + HEIGHT / 2);
        //score++;
        this.fading = true;
        this.alive = false;
      }
    }
    
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
      if(brokenHeartScore > missedHeartsThreshold) {
        startEndingState();
      }
    }
    if(outcome == 1) {
      
    }
    if(outcome == 2) {
      
    }
  }
}