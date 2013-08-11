var createGame = require('voxel-engine')
  , player = require('voxel-player')
  , texturePath = require('painterly-textures')(__dirname)
  , trigger = require('spatial-trigger')
  , aabb = require('aabb-3d')
  , spatialEvents = require('spatial-events')


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

var hud = {}
window.hud = hud;

hud.errorOverlay = document.getElementsByClassName('error-overlay')[0];
hud.tutorial = document.getElementsByClassName('accordion')[0];
hud.walkError = document.getElementById('walk-error');
hud.jumpError = document.getElementById('jump-error');

hud.walkCircuit = document.getElementById('walk-circuit');
hud.walkCircuit.onchange = function() {
  console.log('updating moveForward')
  // FIXME could be this.value
  var functionBody = hud.walkCircuit.value;
  try {
    var funcString = "var moveForward = function (robot, speed, dt) {" + functionBody + "}"
    eval(funcString);
    window.moveForward = moveForward;
    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    handleWalkError(e);
  }
};


function bindAccordionItems() {
  hud.accordion = document.querySelector('.accordion');
  hud.accordionItems = hud.accordion.querySelectorAll('.accordion-item');
  hud.accordion.collapseAll = function () {
    var items = this.querySelectorAll('.accordion-item');
    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove('active');
    }
  };
  var i;
  for (i = 0; i < hud.accordionItems.length; i++) {
    var item = hud.accordionItems[i];
    item.querySelector('.accordion-title').onclick = function () {
      var parent = this.parentElement
      if (parent.classList.contains('active')) {
        parent.classList.remove('active');
      } else {
        hud.accordion.collapseAll();
        parent.classList.add('active');
      }
    };
  }
}

bindAccordionItems();



// do nothing initially...
window.moveForward = function() {
  console.log('not implemented');
  var errorOverlay = hud.errorOverlay;
  errorOverlay.style.display = 'block';
  errorOverlay.innerText = "Error! Walking circuit damaged!";
  setTimeout(function () {
      errorOverlay.style.display = 'none';
      hud.tutorial.style.display = 'block';
  }, 2000)
};

function moveForwardFunction(target, speed, dt) {
  try {
    window.moveForward(target, speed, dt);
    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    handleWalkError(e);
  }
}

function handleWalkError(e) {
  hud.walkError.innerText = e.message
  hud.walkError.style.display = 'block';
}




var walkTrigger = aabb([-5, 1, 6], [11, 1, 3])

// var eventEmitter = new spatialEvents()
//trigger(eventEmitter, walkTrigger, 'point')
trigger(game.spatial, walkTrigger)
  .on('enter', function() {
    console.log('at obstacle')
    // TODO trigger next phase
    // show message 'press spacebar to jump'
    // add function for jump handler (make default function inert)
        // show error about jump circit (recycle error component, set its text)
        // timeout remove hidden attribute from challenge
  })

game.addAABBMarker(walkTrigger)


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

