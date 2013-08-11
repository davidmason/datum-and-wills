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
    var canyonWall = (x > 5 || x < -5) && y > 0 && y < 10;
    var inMiddle = coordinatesInRange(x, z, 6);
    var inRange = coordinatesInRange(x, z, 30);
    var underground = y < 0;
    var surface = y === 0;
    var aboveGround = y > 0;
    var highUp = y > 2;
    
    if (canyonWall && inRange) return Material.DIRT;
    if (inMiddle && aboveGround && !highUp) return Material.DIRT;
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
avatar.yaw.position.set(0, 2, 10)

window.story = {};
window.story.errorOverlay = document.getElementsByClassName('error-overlay')[0];
window.story.tutorial = document.getElementsByClassName('accordion')[0];
window.story.walkError = document.getElementById('walk-error');
window.story.jumpError = document.getElementById('jump-error');

window.story.walkCircuit = document.getElementById('walk-circuit');
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


function bindAccordionItems() {
  window.story.accordion = document.querySelector('.accordion');
  window.story.accordionItems = window.story.accordion.querySelectorAll('.accordion-item');
  window.story.accordion.collapseAll = function () {
    var items = this.querySelectorAll('.accordion-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  };
  var i;
  for (i = 0; i < window.story.accordionItems.length; i++) {
    var item = window.story.accordionItems[i];
    item.querySelector('.accordion-title').onclick = function () {
      var parent = this.parentElement
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
      } else {
        window.story.accordion.collapseAll();
        parent.classList.add('active');
      }
    };
  }
}

bindAccordionItems();


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

