/**
 * Constructor for Obj, base class for all screen objects.
 */
$.Obj = function(width, height, x, z, y) {
  // Create the DOM element.
  this.elem = document.createElement('span');
  var style = this.elem.style;
  
  // Dimensions.
  this.width = width;
  this.height = height;
  style.width = (this.width + 'px');
  style.height = (this.height + 'px');
  
  // Position. 
  this.x = x;
  this.z = z;
  this.y = y;

  var top = Math.floor(this.z / 2) - this.height - Math.floor(this.y);
  style.top = top + 'px';
  style.left = (this.x) + 'px';
  style.zIndex = Math.floor(this.z);
  
  this.room = $.Game.room;
};

/**
 * Adds this Obj into the current room.
 */
$.Obj.prototype.add = function() {
  $.screen.appendChild(this.elem);
};

/**
 * Removes this Obj from the current room.
 */
$.Obj.prototype.remove = function() {
  $.screen.removeChild(this.elem);
};

/**
 * Hides the Obj but retains element in the DOM.
 */
$.Obj.prototype.hide = function() {
  this.elem.style.display = 'none';
  
  // This is mainly to reset any lower opacity that might have been in
  // place prior to being hidden, such as as the result of a fade.
  this.elem.style.opacity = 1.0;
};

/**
 * Shows the Obj.
 */
$.Obj.prototype.show = function() {
  this.elem.style.display = 'block';
};
