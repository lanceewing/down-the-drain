/**
 * @namespace Holds room logic functions.
 */
$.Logic = {};

/**
 * 
 */
$.Logic.process = function(verb, cmd, thing, e) {

  // TODO: Individual room logic up here.
  
  
  // Generic logic for all rooms.
  
  switch (verb) {
  
    case 'Walk to':
      switch (thing) {
        case 'door':
          $.ego.stop();
          // Walk to be in front of the door
          $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), $.ego.z);
          // Now walk through the door.
          $.ego.moveTo(e.target.offsetLeft + (e.target.offsetWidth / 2), e.target.offsetTop);
          break;
          
        default:
          $.ego.stop(true);
          var z = (e.pageY - $.wrap.offsetTop - 27) * 2;
          if (z > 530) {
            $.ego.moveTo(e.pageX - $.wrap.offsetLeft, (e.pageY - $.wrap.offsetTop - 27) * 2);
          } else {
            $.ego.moveTo(e.pageX - $.wrap.offsetLeft, 600);
          }
          break;
      }
      break;
  
    case 'Look at':
      switch (thing) {
      
        case 'open drain':
          $.ego.say("That's where I made my entry and where I hope to exit.", 300, function() {
            $.ego.say("Seems a bit high now.", 250);
          });
          break;
          
        case 'drain':
          $.ego.say("Sunlight shines down through the drain.", 200, function() {
            $.ego.say("I wouldn't be able to see down here without it.", 200);
          });
          break;
          
        case 'chocolate coins':
          $.ego.say("What? I get hungry.", 250);
          break;
          
        case 'me':
          $.ego.say("I'm going for the gender neutral look.", 200);
          break;
          
        case 'reaper':
          $.ego.say("It's the Grim Reaper.", 270);
          break;
          
        case 'book':
          $.ego.say("It's a book on sewer survival.", 250, function() {
            $.ego.say("Who am I kidding? I'm never going to read this.", 300);
          });
          break;
          
        default:
          $.ego.say("No phone there.", 190);
          break;
      
      }
      break;
      
    case 'Eat':
      switch (thing) {
        case 'chocolate coins':
          $.ego.say("Yummy! Plenty more where that came from.", 200);
          break;
          
        default:
          $.ego.say("Uh...  No.", 130);
          break;
      }
      break;
      
    case 'Talk to':
      switch (thing) {
        case 'reaper':
          $.ego.say("Hey mate! Did you see a phone fall through that drain?", 300, function() {
            $.reaper.say("Finders reapers.", 200);
          });
          break;
      }
      break;
  
  }
  
  
};

