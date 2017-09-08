/**
 * @namespace Holds room logic functions.
 */
$.Logic = {};

$.Logic.process = function(verb, cmd, thing) {

  // TODO: Individual room logic up here.
  
  
  // Generic logic for all rooms.
  
  switch (verb) {
  
    case 'Look at':
      switch (thing) {
      
        case 'open drain':
          $.Game.say("That's where I made my entry and where I hope to exit.", 300, function() {
            $.Game.say("Seems a bit high now.", 250);
          });
          break;
          
        case 'drain':
          $.Game.say("Sunlight shines down through the drain.", 200, function() {
            $.Game.say("I wouldn't be able to see down here without it.", 200);
          });
          break;
          
        case 'chocolate coins':
          $.Game.say("What? I get hungry.", 250);
          break;
          
        case 'me':
          $.Game.say("I'm going for the gender neutral look.", 200);
          break;
          
        case 'book':
          $.Game.say("It's a book on sewer survival.", 250, function() {
            $.Game.say("Who am I kidding? I'm never going to read this.", 300);
          });
          break;
          
        default:
          $.Game.say("No phone there.", 190);
          break;
      
      }
      break;
      
    case 'Eat':
      switch (thing) {
        case 'chocolate coins':
          $.Game.say("Yummy! Plenty more where that came from.", 200);
          break;
          
        default:
          $.Game.say("Uh...  No.", 140);
          break;
      }
      break;
  
  }
  
  
};
