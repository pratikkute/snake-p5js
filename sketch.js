let s;
let food;
let cols;
let rows;
let score = 0;
let pause = false;
let gameOver = false;
let myFont;
let winWidth=400;
let winHeight=400;
let scl = 20;
let fps = 10;
let scoreSpan;

function preload() {
  scoreSpan = document.querySelector("#score");
  myFont = loadFont("aAbstractGroovy.ttf");
}

function setup() {
  var myCanvas = createCanvas(winWidth, winHeight);
  myCanvas.parent("canvasDiv");
  frameRate(fps);
  cols = floor(width / scl);
  rows = floor(height / scl);

  s = new Snake();
  food = new Food();
  food.pickFoodLocation();
}

function draw() {
  background(51);
  for (let i = 0; i < cols; i++) {
    line(i * scl, 0, i * scl, height);
    line(0, i * scl, width, i * scl);
  }

  if (!pause) {
    s.update();
  }
  s.show();
  if (s.death()) {
    gameOver = true;
    s.reset();
  }

  if (s.eat(food)) {
    food.pickFoodLocation();
  }

  fill(255, 0, 0);
  rect(food.x, food.y, scl, scl);
  textSize(32);
  scoreSpan.innerHTML= score;
  if (gameOver) {
    background(0);
    textSize(50);
    textAlign(CENTER);
    fill(255, 0, 0);
    textFont(myFont);
    text("Game Over", width / 2, height / 2);
    textSize(20);
    text("press 'r' to restart", width / 2, height / 2 + 50);
    noLoop();
  }
}

keyPressed = function () {
  switch (keyCode) {
    case UP_ARROW:
      if (!s.ySpeed) {
        s.dir(0, -1);
      }
      break;
    case DOWN_ARROW:
      if (!s.ySpeed) {
        s.dir(0, 1);
      }
      break;
    case RIGHT_ARROW:
      if (!s.xSpeed) {
        s.dir(1, 0);
      }
      break;
    case LEFT_ARROW:
      if (!s.xSpeed) {
        s.dir(-1, 0);
      }
      break;
    case 32:
      pause = !pause;
      break;
    case 82:
      console.log("r");
      score = 0;
      gameOver = false;
      s.reset();
      loop();
      break;
  }
};

class Cell {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Food {
  pickFoodLocation() {
    this.x = scl * floor(random(cols));
    this.y = scl * floor(random(rows));
  }
}

class Snake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = (scl * cols) / 2;
    this.y = (scl * rows) / 2;

    this.xSpeed = 1;
    this.ySpeed = 0;

    this.total = 0;
    this.tail = [];
  }
  update() {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.total - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = new Cell(this.x, this.y);

    this.x = this.x + this.xSpeed * scl;
    this.y = this.y + this.ySpeed * scl;

    if (this.x === width || this.x < 0) {
      switch (this.xSpeed) {
        case 1:
          this.x = 0;
          break;
        case -1:
          this.x = width;
          break;
      }
    }

    if (this.y === height || this.y < 0) {
      switch (this.ySpeed) {
        case 1:
          this.y = 0;
          break;
        case -1:
          this.y = height;
          break;
      }
    }

    this.x = constrain(this.x, 0, width - scl);
    this.y = constrain(this.y, 0, height - scl);
  }
  show() {
    fill(255);
    rect(this.x, this.y, scl, scl);
    for (let i = 0; i < this.total; i++) {
      rect(this.tail[i].x, this.tail[i].y, scl, scl);
    }
  }
  dir(xdir, ydir) {
    this.xSpeed = xdir;
    this.ySpeed = ydir;
  }
  eat(eatfood) {
    let d = dist(this.x, this.y, eatfood.x, eatfood.y);
    if (d < 1) {
      this.total++;
      score++;
    }
    return d < 1;
  }
  death() {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) return true;
    }
  }
}
