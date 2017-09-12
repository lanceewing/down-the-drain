/**
 * Creates a new Actor, a special type of Sprite that is rendered differently 
 * depending on what direction it is moving. 
 * 
 * @constructor
 * @extends Sprite
 */
$.Actor = function(width, height, colour, texture, xzstep, face, hat, pack) {
  this.face = face;
  this.hat = hat;
  this.pack = pack;
  $.Sprite.call(this, width, height, colour, texture, xzstep);
  this.elem.classList.add('actor');
};

$.Actor.prototype = Object.create($.Sprite.prototype);
$.Actor.prototype.constructor = $.Actor;

/**
 * Builds the background image canvas for the Actor. 
 */
$.Actor.prototype.buildCanvas = function() {
  // Create a single canvas to render the sprite sheet for the four directions.
  var ctx = $.Util.create2dContext(this.width * 4, this.width * 3 * 3);
  
  // For each direction, render the Actor facing in that direction.
  for (var c = 0; c < 3; c++) {
    for (var d = 0; d < 4; d++) {
      ctx.drawImage(
          $.Util.renderPerson(this.width, this.width * 3, d, c, this.face, this.colour, this.hat, this.pack), 
          d * this.width, 
          c * this.width * 3);
    }
  }
  
  return ctx.canvas;
};

/**
 * Tells the Actor to stop moving. If fully is not provided, and there are pending destination
 * points, then the Actor will start moving to the next point. If fully is set to true then 
 * all pending destination points are cleared.
 */
$.Actor.prototype.stop = function(fully) {
  // Clear the current destination.
  this.destX = this.destZ = -1;
  this.heading = null;
  this.cell = 0;
  
  if (this.destFn) {
    this.destFn();
    this.destFn = null;
  }
  
  // To fully stop, we need to also clear the pending destinations.
  if (fully) this.dests = [];
};

/**
 * Tells the Actor to move to the given position on the screen.
 */
$.Actor.prototype.moveTo = function(x, z, fn) {
  this.dests.push({z: z, x: x, fn: fn});
};

/**
 * Tells the Actor to say the given text within a speech bubble of the given width. Will
 * execute the given optional next function if provided after the speech bubble is removed.
 */
$.Actor.prototype.say = function(text, width, next) {
  $.Game.userInput = false;
  
  var bubble = document.createElement('span');
  bubble.className = 'bubble';
  bubble.innerHTML = text;
  
  var left;
  if (this.x > 800) {
    left = -width + 40;
  } else if (this.x < 100) {
    left = -10;
  } else {
    left = -(width / 2);
  }
  
  bubble.style.width = width + 'px';
  bubble.style.left = left + 'px';
  
  var elem = this.elem;
  elem.appendChild(bubble);
  elem.classList.add('speech');
  
  setTimeout(function() {
    elem.classList.remove('speech');
    elem.removeChild(bubble);
    setTimeout(function() {
      if (next) {
        next();
      } else {
        // Re-enable user input if nothing is happening after the speech.
        $.Game.userInput = true;
      }
    }, 500);
  }, (text.length / 10) * 1500);
};

/**
 * Updates the Actor's position based on its current heading and destination point.
 */
$.Actor.prototype.update = function() {
  // Mask out left/right/in/out but retain the current jumping directions.
  var direction;
  
  if ((this.destX != -1) && (this.destZ != -1)) {
    if (this.touching({cx: this.destX, cy: this.cy, z: this.destZ, radius: -this.radius}, 20)) {
      // We've reached the destination.
      this.stop();
    
    } else {
      this.heading = Math.atan2(this.destZ - this.z, this.destX - this.cx);
      
      // Cycle cell
      this.cell = ((this.cell + 1) % 30);
    }
  } else if (this.dests.length > 0) {
    // If there is a destination position waiting for ego to move to, pop it now.
    var pos = this.dests.shift();
    this.destZ = pos.z
    this.destX = pos.x;
    this.destFn = pos.fn;
  }
  
  if (this.heading !== null) {
    // Convert the heading to a direction value.
    if (Math.abs(this.heading) > 2.356) {
      direction |= $.Sprite.LEFT;
    } else if (Math.abs(this.heading) < 0.785) {
      direction |= $.Sprite.RIGHT;
    } else if (this.heading > 0) {
      direction |= $.Sprite.OUT;
    } else {
      direction |= $.Sprite.IN;
    }
  }
  
  // Update Ego's direction to what was calculated above.
  this.setDirection(direction);
  
  // Move Ego based on it's heading.
  if (this.heading !== null) this.move();
};
