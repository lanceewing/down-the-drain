/**
 * The is the core Game object that manages the starting of the game loop and the
 * core functions of the game that don't relate directly to an individual Sprite.
 */
$.Game = {
  
  items: [  
    ],
  
  itemTop: -1,
  
  invCount: 18,
    
  /**
   * Starts the game. 
   */
  start: function() {
    // Get a reference to each of the elements in the DOM that we'll need to update.
    $.screen = document.getElementById('screen');
    $.wall = document.getElementById('wall');
    $.bricks = document.getElementById('bricks');
    $.items = document.getElementById('itemlist');
    
    // Render the favicon and grass.
    this.wall = this.renderWall();
    this.wallCtx = $.wall.getContext('2d');
    this.wallCtx.drawImage(this.wall, 0, 0);
    
    // Render sky immediately after the grass is drawn so they appear at the same time.
    $.bricks.classList.add('bricks');
    
    // Register click event listeners for item list arrow buttons.
    document.getElementById("up").addEventListener("click", function(){
      $.Game.scrollInv(1);
    });
    document.getElementById("down").addEventListener("click", function(){
      $.Game.scrollInv(-1);
    });
    
    // Register click event listeners for the item list.
    
    
  },
  
  scrollInv: function(dir) {
    // TODO: Handle mouse button held down and multiple invocations of this function.
    var newTop = this.itemTop + (27 * dir);
    if ((newTop <= -1) && (newTop > -((this.invCount - 4) * 27))) {
      this.itemTop = newTop;
      $.items.style.top = this.itemTop + 'px';
    }
  },
  
  /**
   * Renders the grass canvas. It does this by randomly setting the luminousity of 
   * each pixel so that it looks like blades of grass from a distance.
   */
  renderWall: function() {
    // Render the base colour over the whole grass area first.
    var ctx = $.Util.create2dContext(960, 220);
    ctx.fillStyle = 'hsl(0, 0%, 10%)';
    ctx.fillRect(0, 0, 960, 220);
    
    // Now randomaly adjust the luminosity of each pixel.
    var imgData = ctx.getImageData(0, 0, 960, 220);
    for (var i=0; i<imgData.data.length; i+=4) {
      var texture = (Math.random() * 0.5);
      if (texture < 0.1) {
        texture = 1.0 - texture;
        imgData.data[i]=Math.floor(imgData.data[i] * texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] * texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] * texture);
      } else {
        texture = 0.5 + texture;
        imgData.data[i]=Math.floor(imgData.data[i] / texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] / texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] / texture);
      }
    }
    ctx.putImageData(imgData,0,0);
    return ctx.canvas;
  }
};

// The currently recommended requestAnimationFrame shim
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
 
  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

// On load, the game will start.
window.onload = function() { 
  $.Game.start();
};