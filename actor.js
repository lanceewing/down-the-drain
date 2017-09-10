/**
 * Creates a new Actor, a special type of Sprite that is rendered differently 
 * depending on what direction it is moving. Not instantiated directly, but 
 * rather extended by Ego and Enemy.
 * 
 * @constructor
 * @extends Sprite
 */
$.Actor = function(size, height, colour, texture, xzstep, face, hat, pack) {
  this.face = face;
  this.hat = hat;
  this.pack = pack;
  $.Sprite.call(this, size, height, colour, texture, xzstep);
  this.sprite.classList.add('actor');
};

$.Actor.prototype = Object.create($.Sprite.prototype);
$.Actor.prototype.constructor = $.Actor;

/**
 * Builds the background image canvas for the Actor. Ego and Enemy are visually 
 * similar. It is only the colour that differs. The colour, size, and texture
 * are already defined on the object as part of the object instantiation.
 */
$.Actor.prototype.buildCanvas = function() {
  // Create a single canvas to render the sprite sheet for the four directions.
  var ctx = $.Util.create2dContext(this.size * 4, this.size * 3 * 3);
  
  // For each direction, render the Actor facing in that direction.
  for (var c = 0; c < 3; c++) {
    for (var d = 0; d < 4; d++) {
      ctx.drawImage(
          $.Util.renderPerson(this.size, this.size * 3, d, c, this.face, this.colour, this.hat, this.pack), 
          d * this.size, 
          c * this.size * 3);
    }
  }
  
  return ctx.canvas;
};

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

$.Actor.prototype.moveTo = function(x, z, fn) {
  this.dests.push({z: z, x: x, fn: fn});
};

$.Actor.prototype.say = function(text, width, next) {
  var bubble = document.createElement('span');
  bubble.className = 'bubble';
  bubble.innerHTML = text;
  bubble.style.width = width + 'px';
  bubble.style.left = -(width / 2) + 'px';
  
  var sprite = this.sprite;
  sprite.appendChild(bubble);
  sprite.classList.add('speech');
  
  setTimeout(function() {
    sprite.classList.remove('speech');
    sprite.removeChild(bubble);
    setTimeout(function() {
      if (next) {
        next();
      }
    }, 500);
  }, (text.length / 10) * 1500);
};
