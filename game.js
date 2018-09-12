// Screen dimensions
const WIDTH = 740
const HEIGHT = 480

// Create the canvas and context
var screen = document.createElement('canvas');
var screenCtx = screen.getContext('2d');
screen.height = HEIGHT;
screen.width = WIDTH;
document.body.appendChild(screen);

/* Game state variables */
var start = null;
var currentInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false
}
var priorInput = {
  space: false,
  left: false,
  right: false,
  up: false,
  down: false
}
var x = 0;
var y = 0;
var bullets = [];

/** @function handleKeydown
  * Event handler for keydown events
  * @param {KeyEvent} event - the keydown event
  */
function handleKeydown(event) {
  switch(event.key) {
    case ' ':
    console.log('fire?', currentInput, priorInput)
      currentInput.space = true;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = true;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = true;
      break;
  }
}
// Attach keyup event handler to the window
window.addEventListener('keydown', handleKeydown);

/** @function handleKeyup
  * Event handler for keyup events
  * @param {KeyEvent} event - the keyup event
  */
function handleKeyup(event) {
  switch(event.key) {
    case ' ':
    console.log('no fire?', currentInput, priorInput)
      currentInput.space = false;
      break;
    case 'ArrowUp':
    case 'w':
      currentInput.up = false;
      break;
    case 'ArrowDown':
    case 's':
      currentInput.down = false;
      break;
  }
}
// Attach keyup event handler to the window
window.addEventListener('keyup', handleKeyup);

/** @function loop
  * The main game loop
  * @param {DomHighResTimestamp} timestamp - the current system time,
  * in milliseconds, expressed as a double.
  */
function loop(timestamp) {
  if(!start) start = timestamp;
  var elapsedTime = timestamp - start;
  start = timestamp;
  update(elapsedTime);
  render(elapsedTime);
  copyInput();
  window.requestAnimationFrame(loop);
}

/** @function copyInput
  * Copies the current input into the previous input
  */
function copyInput() {
  priorInput = JSON.parse(JSON.stringify(currentInput));
}

/** @function update
  * Updates the game's state
  * @param {double} elapsedTime - the amount of time
  * elapsed between frames
  */
function update(elapsedTime) {
  // move the red square when the space bar is down
  if(currentInput.space && !priorInput.space) {
    // TODO: Fire bullet
    bullets.push(new Bullet(x+11, y, 2));
  }
  if(currentInput.up) {
    y -= 0.1 * elapsedTime;
  }
  if(currentInput.down) {
    y += 0.1 * elapsedTime;
  }
  bullets.forEach(function(bullet, index){
    bullet.update(elapsedTime);
    // check to see if bullet is off-screen
    if(bullet.x >= WIDTH + bullet.r) bullets.splice(index, 1);
  });
}

/** @function render
  * Renders the game into the canvas
  * @param {double} elapsedTime - the amount of time
  * elapsed between frames
  */
function render(elapsedTime) {
  screenCtx.clearRect(0, 0, WIDTH, HEIGHT);
  screenCtx.fillStyle = "#ff0000";
  screenCtx.fillRect(x,y-10,20,20);
  bullets.forEach(function(bullet){
    bullet.render(screenCtx);
  });
}

// Start the game loop
window.requestAnimationFrame(loop);


// Bullet class
function Bullet(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
}

Bullet.prototype.update = function(deltaT) {
  this.x += deltaT * 0.5;
}

Bullet.prototype.render = function(context) {
  context.beginPath();
  context.fillStyle = 'pink';
  context.arc(this.x - this.r, this.y - this.r, 2*this.r, 2*this.r, 0, 2 * Math.pi);
  context.fill();
}
