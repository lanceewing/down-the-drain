/**
 * Constructor for Obj, base class for all screen objects.
 */
$.Obj = function(width, height, zIndex) {
  this.x = 0;
  this.z = 0;
  this.y = 0;
  
  // Create the DOM element.
  this.elem = document.createElement('span');
  var style = this.elem.style;
  
  // Dimensions.
  this.width = width;
  this.height = height;
  style.width = (this.width + 'px');
  style.height = (this.height + 'px');
  
  // Allows a fixed z index to be specified.
  this.zIndex = zIndex;
  
  this.room = $.Game.room;
};

/**
 * Sets the Obj's position to the given x, y, and z position.
 * 
 * @param {number} x The x part of the new position.
 * @param {number} y The y part of the new position.
 * @param {number} z The z part of the new position.
 */
$.Obj.prototype.setPosition = function(x, y, z) {
  this.x = x;
  this.z = z;
  this.y = y;

  var top = Math.floor(this.z / 2) - this.height - Math.floor(this.y);
  this.elem.style.top = top + 'px';
  this.elem.style.left = (this.x) + 'px';
  
  // Supports a fixed z-index if passed in to the constructor.
  this.elem.style.zIndex = (this.zIndex? this.zIndex : Math.floor(this.z));
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
  try {
    $.screen.removeChild(this.elem);
  } catch (e) {
    // Ignore. We don't care if it has already been removed.
  }
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

/**
 * Tests whether the given object is touching this object. There is an optional gap 
 * parameter, which provides more of a "close too" check rather than actually touching.
 *
 * @param {Obj} obj Another object with which to test whether this Obj is touching it.
 * @param {number} gap If provided, then if the two Objs are within this distance, the method returns true.
 * @returns {boolean} true if this Obj is touching the given Obj; otherwise false.
 */
$.Obj.prototype.touching = function(obj, gap) {
  // Simply returns false for the base class.
  return false;  
};

/**
 * Updates this Obj for the current animation frame.
 */
$.Obj.prototype.update = function() {
  // Do nothing for base class.
};

/**
 * Invoked when this screen object hits another. The default behaviour is to ignore.
 */
$.Obj.prototype.hit = function(obj) {
  // Do nothing for base class.
};
