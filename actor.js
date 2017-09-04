/**
 * Creates a new Actor, a special type of Sprite that is rendered differently 
 * depending on what direction it is moving. Not instantiated directly, but 
 * rather extended by Ego and Enemy.
 * 
 * @constructor
 * @extends Sprite
 */
$.Actor = function() {
  $.Sprite.apply(this, arguments);
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
      ctx.drawImage($.Util.renderPerson(this.size, this.size * 3, d, c), d * this.size, c * this.size * 3);
    }
  }
  
  return ctx.canvas;
};

$.Actor.prototype.stop = function(fully) {
  // Clear the current destination.
  this.destX = this.destZ = -1;
  this.heading = null;
  this.cell = 0;
  
  // To fully stop, we need to also clear the pending destinations.
  if (fully) this.dests = [];
};

$.Actor.prototype.moveTo = function(x, z) {
  this.dests.push({z: z, x: x});
};
