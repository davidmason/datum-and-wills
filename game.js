var createGame = require('voxel-engine');
var player = require('voxel-player')
var texturePath = require('painterly-textures')(__dirname)

var Material = {
    SKY: 0
  , GRASS: 1
  , BRICK: 2
  , DIRT: 3
}

var coordinatesInRange = function (x, z, range) {
    return x < range && x > -range && z < range && z > -range;
}

var dirtColumnWithBrickCube = function(x, y, z) {
    var inMiddle = coordinatesInRange(x, z, 3);
    var inRange = coordinatesInRange(x, z, 30);
    var underground = y < 0;
    var surface = y === 0;
    var aboveGround = y > 0;
    var highUp = y > 5;
    
    if (inMiddle && aboveGround && !highUp) return Material.BRICK;
    if (surface && inRange) return Material.GRASS;
    if (underground && inRange) return Material.DIRT;
    return Material.SKY;
}

var game = createGame({
  texturePath: texturePath
, generate: dirtColumnWithBrickCube
, controls: {
    moveForward: moveForwardFunction
  }
});
game.appendTo(document.body);
window.game = game; // for easy debugging

var createPlayer = player(game)
var avatar = createPlayer('player.png')
avatar.pov(3)
avatar.possess()
avatar.yaw.position.set(2, 14, 4)

window.story = {};
window.story.errorOverlay = document.getElementsByClassName('error-overlay')[0];
window.story.tutorial = document.getElementsByClassName('tutorial')[0];
window.story.scriptError = document.getElementById('script-error');


editor = document.getElementById('editor');
//editor.onclick = function() {
//    this.contentEditable='true';
//}

editor.onchange = function() {
  console.log('updating moveForward')
  var functionBody = editor.value;
  try {
    var funcString = "var moveForward = function (robot, speed, dt) {" + functionBody + "}"
    eval(funcString);
    window.moveForward = moveForward;
    window.story.scriptError.style.display = 'none';
    window.story.scriptError.innerText = '';
  } catch(e) {
    handleWalkError(e);
  }
};

// do nothing initially...
window.moveForward = function() {
  console.log('not implemented');
  window.story.errorOverlay.style.display = 'block';
  setTimeout(function () {
      window.story.errorOverlay.style.display = 'none';
      window.story.tutorial.style.display = 'block';
  }, 2000)
};

function moveForwardFunction(target, speed, dt) {
  try {
    window.moveForward(target, speed, dt);
    window.story.scriptError.style.display = 'none';
    window.story.scriptError.innerText = '';
  } catch(e) {
    handleWalkError(e);
  }
}

function handleWalkError(e) {
  window.story.scriptError.innerText = e.message
  window.story.scriptError.style.display = 'block';
}

