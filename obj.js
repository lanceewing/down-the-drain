
$.Obj = function(width, height, x, z, y) {
  this.width = width;
  this.height = height;
  
  this.x = x;
  this.z = z;
  this.y = y;
  
  this.elem = document.createElement('span');
  var style = this.sprite.style;
  style.width = (this.size + 'px');
  style.height = (this.height + 'px');
  
  
};
