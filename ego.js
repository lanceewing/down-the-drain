/**
 * Creates a new Ego. This is the main character whom the player controls. The
 * name originates with the old Sierra On-Line 3D animated adventure games. There
 * should be only one instance of this class.
 * 
 * @constructor
 * @extends Actor
 */
$.Ego = function() {
  $.Actor.call(this, 50, 150, 'rgb(197,179,88)', 0.95, 5);
  this.sprite.classList.add('ego');
  this.setDirection($.Sprite.OUT);
};

$.Ego.prototype = Object.create($.Actor.prototype);
$.Ego.prototype.constructor = $.Ego;

/**
 * Updates Ego for the current frame. The update method of every Sprite is 
 * invoked once per frame. For Ego, it checks the direction keys to see if
 * Ego's direction and movement needs to change. It also handles jumping,
 * flying, dropping Rocks, firing glow Bombs, and absorbing energy from the
 * Orb. It is where most of the player's control of the game takes place.
 */
$.Ego.prototype.update = function() {
  // Mask out left/right/in/out but retain the current jumping directions.
  var direction = (this.direction & $.Sprite.UP_DOWN);
  
  if ($.Game.mouseButton) {
    $.Game.mouseButton = 0;
    this.destZ = $.Game.yMouse * 2;
    this.destX = $.Game.xMouse;
  }
  
  if ((this.destX != -1) && (this.destZ != -1)) {
	  if (this.touching({cx: this.destX, cy: this.cy, z: this.destZ, radius: -this.radius}, 20)) {
	    if (this.step > 1.5) {
		    this.reset();
	    } else {
	      this.destX = this.destZ = -1;
	      this.heading = null;
	      this.cell = 0;
	    }
    } else {
      this.heading = Math.atan2(this.destZ - $.ego.z, this.destX - $.ego.cx);
      
      // Cycle cell
      this.cell = ((this.cell + 1) % 30);
    }
  }
  
  if (this.heading) {
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
  if (this.heading) this.move();
  //}

  // The hit method sets the bounce flag, and it is cleared here.
  this.bounce = false;
};

/**
 * Invoked when Ego has hit another Sprite.
 * 
 * @param obj The Sprite that Ego has hit.
 */
$.Ego.prototype.hit = function(obj) {
  // This flag is set so that the update method knows in an efficient way that 
  // Ego is currently touching something. 
  this.bounce = true;
  
  // Reset the position to the last one that isn't touching another Sprite. Resetting
  // the position prevents Ego from walking through obstacles. 
  for (;this.reset() && this.touching(obj););
};

/**
 * Invoked by the move method when Ego has hit an edge. If the edge is the ground, then the
 * edge parameter is undefined. If the edge is one of the four directions, then Ego is 
 * attempting to exit the current room. 
 *  
 * @param {Array} edge If defined, it will be an array that represents the edge that was hit.
 */
$.Ego.prototype.hitEdge = function(edge) {
  if (edge) {
    // Ego is attempting to exit the room. Check if this is okay and enter the new room 
    // if it is okay.
    $.Game.hitEdge(this, edge);
  }
};
