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
window.story.tutorial = document.getElementsByClassName('accordion')[0];
window.story.walkError = document.getElementById('walk-error');
window.story.jumpError = document.getElementById('jump-error');


window.story.walkCircuit = document.getElementById('walk-circuit');
//editor.onclick = function() {
//    this.contentEditable='true';
//}

window.story.walkCircuit.onchange = function() {
  console.log('updating moveForward')
  // FIXME could be this.value
  var functionBody = window.story.walkCircuit.value;
  try {
    var funcString = "var moveForward = function (robot, speed, dt) {" + functionBody + "}"
    eval(funcString);
    window.moveForward = moveForward;
    window.story.walkError.style.display = 'none';
    window.story.walkError.innerText = '';
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
    window.story.walkError.style.display = 'none';
    window.story.walkError.innerText = '';
  } catch(e) {
    handleWalkError(e);
  }
}

function handleWalkError(e) {
  window.story.walkError.innerText = e.message
  window.story.walkError.style.display = 'block';
}

function decorateCircuits() {
  var circuits = document.getElementsByClassName('circuit');
  var i, status, circuit;
  for (i = 0; i < circuits.length; i++) {
    circuit = circuits[i];
    status = circuit.insertBefore(document.createElement('div'), circuit.firstChild);
    status.className = 'status';
    status = circuit.appendChild(document.createElement('div'));
    status.className = 'status';
  }
}

decorateCircuits();

