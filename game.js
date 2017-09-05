/**
 * The is the core Game object that manages the starting of the game loop and the
 * core functions of the game that don't relate directly to an individual Sprite.
 */
$.Game = {

  /**
   * The time of the last animation frame. 
   */ 
  lastTime: 0,
  
  /**
   * The time difference between the last animation frame and the current animaton frame.
   */  
  delta: 0,
  
  /**
   * 
   */
  userInput: true,
  
  /**
   * Regions have a name, wall type, wall colour, and water colour
   */
  regions: [
    ['Sewers',     1, '108,141,36', '108,141,36'],    // Greenish tint, green water, bricks
    ['Caves',      0, '#000000', '#000000'],    // Grey walls, blue water
    ['Mines',      0, '#000000', ''],           // Brown walls, no water
    ['Catacombs',  1, '#000000', ''],           // Grey walls, no water, bricks
    ['Underworld', 0, '#000000', '#000000'],    // Red tint, lava
  ],
  
  /**
   * Rooms have a region type, left exit, left door, right door, right exit (other types of 
   * door are handled as props), name override.
   */
  rooms: [
    // Sewers
    [0, , [2, 4], ,       , ''],  // [1] Entrance room.
    [0, ,       , , [1, 2], ''],  // [2]
  ],
  
  
  props: [
    
  ],
  
  items: [
    
  ],
  
  
    
  itemTop: -1,
  
  invCount: 18,
    
  /**
   * Starts the game. 
   */
  start: function() {
    // Get a reference to each of the elements in the DOM that we'll need to update.
	  $.wrap = document.getElementById('wrap');
    $.screen = document.getElementById('screen');
    $.shadow = document.getElementById('shadow');
    $.wall = document.getElementById('wall');
    $.bricks = document.getElementById('bricks');
    $.sides = document.getElementById('sides');
    $.water = document.getElementById('water');
    $.region = document.getElementById('region');
    $.doors = document.getElementsByClassName('door');
    $.drains = document.getElementsByClassName('drain');
    $.time = document.getElementById('time');
    $.score = document.getElementById('score');
    $.items = document.getElementById('itemlist');
    
    // Render the wall texture.
    this.wall = this.renderWall();
    this.wallCtx = $.wall.getContext('2d');
    this.wallCtx.drawImage(this.wall, 0, 0);
    
    // Register click event listeners for item list arrow buttons.
    document.getElementById("up").addEventListener("click", function(){
      $.Game.scrollInv(1);
    });
    document.getElementById("down").addEventListener("click", function(){
      $.Game.scrollInv(-1);
    });
    
    // Register click event listeners for the item list.
    
    $.doors[0].addEventListener("click", function(e) {
      $.ego.stop();
      
      var door = e.target;
      
      // Walk to be in front of the door
      $.ego.moveTo(door.offsetLeft + (door.offsetWidth / 2), $.ego.z);
      
      $.ego.moveTo(door.offsetLeft + (door.offsetWidth / 2), door.offsetTop);
      
      // We don't want the normal screen onclick to be fire.
      e.stopPropagation();
    });
    
    $.screen.onclick = function(e) {
      if ($.Game.userInput) {
        // Fully stop (includes clearing queued destination points)
        $.ego.stop(true);
        
        var z = (e.pageY - $.wrap.offsetTop - 27) * 2;
        
        if (z > 530) {
          $.ego.moveTo(e.pageX - $.wrap.offsetLeft, (e.pageY - $.wrap.offsetTop - 27) * 2);
        }
      }
    };
    
    // Initialise and then start the game loop.
    $.Game.init();
    $.Game.loop();
  },
  
  /**
   * Initialised the parts of the game that need initialising on both
   * the initial start and then subsequent restarts. 
   */
  init: function() {
    // For restarts, we'll need to remove the objects from the screen.
    if (this.objs) {
      for (var i=0; i<this.objs.length; i++) {
        this.objs[i].remove();
      }
    }
    
    // Set the room back to the start, and clear the object map.
    this.objs = [];
    this.room = 1;
    
    // Create Ego (the main character) and add it to the screen.
    $.ego = new $.Ego();
    $.ego.add();
    $.ego.setPosition(550, 0, 600);
    
    // Enter the starting room.
    this.newRoom();
  },
  
  /**
   * This is a wrapper around the main game loop whose primary purpose is to make
   * the this reference point to the Game object within the main game loop. This 
   * is the method invoked by requestAnimationFrame and it quickly delegates to 
   * the main game loop.
   *  
   * @param {number} now Time in milliseconds.
   */
  _loop: function(now) {
    $.Game.loop(now);
  },
  
  /**
   * This is the main game loop, in theory executed on every animation frame.
   * 
   * @param {number} now Time. The delta of this value is used to calculate the movements of Sprites.
   */
  loop: function(now) {
    // Immediately request another invocation on the next
    requestAnimationFrame(this._loop);
    
    // Calculates the time since the last invocation of the game loop.
    this.updateDelta(now);
    
    // Game has focus and is not paused, so execute normal game loop, which is
    // to update all objects on the screen.
    this.updateObjects();
    
    // If after updating all objects, the room that Ego says it is in is different
    // that what it was previously in, then we trigger entry in to the new room.
    if ($.ego.room != this.room) {
      this.fadeOut($.screen);
      setTimeout(function() {
        $.Game.newRoom();
      }, 200);
    }
  },
  
  /**
   * Updates the delta, which is the difference between the last time and now. Both values
   * are provided by the requestAnimationFrame call to the game loop. The last time is the
   * value from the previous frame, and now is the value for the current frame. The difference
   * between them is the delta, which is the time between the two frames. From this value
   * it can calculate the stepFactor, which is used in the calculation of the Sprites' motion.
   * In this way if a frame is skipped for some reason, the Sprite position will be updated to 
   * compensate.
   * 
   * @param {Object} now The current time provided in the invocation of the game loop.
   */
  updateDelta: function(now) {
    this.delta = now - (this.lastTime? this.lastTime : (now - 16));
    this.stepFactor = this.delta * 0.06;
    this.lastTime = now;
  },
  
  /**
   * The main method invoked on every animation frame when the game is unpaused. It 
   * interates through all of the Sprites and invokes their update method. The update
   * method will invoke the move method if the calculated position has changed. This
   * method then tests if the Sprite is touching another Sprite. If it is, it invokes
   * the hit method on both Sprites. 
   */
  updateObjects: function() {
    var i=-1, j, a1=$.ego, a2;
    var objsLen = this.objs.length;

    // Iterate over all of the Sprites in the current room, invoking update on each on.
    for (;;) {
      if (a1) {
        a1.update();

        // Check if the Sprite is touching another Sprite.
        for (j = i + 1; j < objsLen; j++) {
          a2 = this.objs[j];
          if (a2 && a1.touching(a2)) {
            // If it is touching, then invoke hit on both Sprites. They might take 
            // different actions in response to the hit.
            a1.hit(a2);
            a2.hit(a1);
          }
        }
        
        // Clears the Sprite's moved flag, which is only of use to the hit method.
        a1.moved = false;
      }
      
      if (++i < objsLen) {
        a1 = this.objs[i];
      } else {
        break;
      }
    }
  },
  
  /**
   * Invoked when Ego is entering a room.  
   */
  newRoom: function() {
    this.room = $.ego.room;
    
    var roomData = this.rooms[this.room - 1];
    this.region = this.regions[roomData[0]];
    
    // Room 1 has an open drain for entry and exit.
    if (this.room == 1) {
      $.drains[2].classList.add('entry');
    } else {
      $.drains[2].classList.remove('entry');
    }
    
    // Update the region name.
    $.region.innerHTML = 'In the ' + this.region[0];
    
    // Draw the bricks if the region has them.
    if (this.region[1]) $.bricks.classList.add('bricks');
    
    // Room colouring
    $.wall.style.backgroundColor = 'rgb(' + this.region[2] + ')';
    $.water.style.backgroundColor = 'rgb(' + this.region[3] + ')';
    
    // Sides
    $.sides.className = "";
    if (!roomData[1]) {
      $.sides.classList.add('left');
    }
    if (!roomData[4]) {
      $.sides.classList.add('right');
    }
    
    // Doors (display none, display block)
    $.doors[0].style.display = (roomData[2]? 'block' : 'none');
    $.doors[1].style.display = (roomData[3]? 'block' : 'none');
    
    $.ego.show();
    
    $.Game.fadeIn($.screen);
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
        imgData.data[i+3]=210;
      } else {
        texture = 0.5 + texture;
        imgData.data[i]=Math.floor(imgData.data[i] / texture);
        imgData.data[i+1]=Math.floor(imgData.data[i+1] / texture);
        imgData.data[i+2]=Math.floor(imgData.data[i+2] / texture);
      }
    }
    ctx.putImageData(imgData,0,0);
    return ctx.canvas;
  },
  
  /**
   * Fades in the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade in.
   */
  fadeIn: function(elem) {
    // Remove any previous transition.
    elem.removeAttribute('style');

    // We need to change the opacity in a setTimeout to give the display change time to take effect first.
    //setTimeout(function() {
      // Setting the transition inline so that we can cancel it with the removeAttribute.
      elem.style.transition = 'opacity 0.2s';
      elem.style.opacity = 1.0;
    //}, 100);
  },
  
  /**
   * Fades out the given DOM Element.
   * 
   * @param {Object} elem The DOM Element to fade out.
   */
  fadeOut: function(elem) {
    elem.style.transition = 'opacity 0.2s';
    elem.style.opacity = 0.0;
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