var createGame = require('voxel-engine')
  , player = require('voxel-player')
  , texturePath = require('painterly-textures')(__dirname)
  , trigger = require('spatial-trigger')
  , aabb = require('aabb-3d')
  , spatialEvents = require('spatial-events')
  , walk = require('voxel-walk')



var hud = {}
window.hud = hud;

hud.instructionOverlay = document.querySelector('.instruction-overlay');
hud.errorOverlay = document.querySelector('.error-overlay');
hud.tutorial = document.querySelector('.accordion');
hud.walkTutorial = document.getElementsByClassName('accordion-item')[0];
hud.jumpTutorial = document.getElementsByClassName('accordion-item')[1];
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
    code.moveForward = moveForward;
    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    code.handleWalkError(e);
  }
};

// TODO de-duplicate handling of walk and jump here
hud.jumpCircuit = document.querySelector('#jump-circuit')
hud.jumpCircuit.onchange = function() {
  console.log('updating jump')
  var functionBody = hud.jumpCircuit.value;
  try {
    var funcString = "var jump = function (robot, dt) {" + functionBody + "}"
    console.log(funcString)
    eval(funcString);
    console.log(jump)
    code.jump = jump;
    hud.jumpError.style.display = 'none';
    hud.jumpError.innerText = '';
  } catch(e) {
    code.handleJumpError(e);
  }
}

hud.bindAccordionItems = function () {
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

hud.bindAccordionItems();

hud.showInstruction = function (message) {
  var overlay = hud.instructionOverlay
  overlay.style.display = 'block';
  overlay.innerText = message;
  if (hud.clearInstructionsTimeout)
    hud.clearInstructionsTimeout = null
  hud.clearInstructionsTimeout = setTimeout(hud.clearInstructions, 4000)
}

hud.clearInstructions = function () {
  hud.clearInstructionsTimeout = null;
  hud.instructionOverlay.style.display = 'none';
}

hud.showError = function (message) {
  var errorOverlay = hud.errorOverlay;
  errorOverlay.style.display = 'block';
  errorOverlay.innerText = message;
  setTimeout(hud.showTutorials, 2200)
  if (hud.clearErrorTimeoutHandle)
    clearTimeout(hud.clearErrorTimeoutHandle)
  hud.clearErrorTimeoutHandle = setTimeout(hud.clearError, 2000)
}

hud.showTutorials = function () {
  hud.tutorial.style.display = 'block';
}

hud.showJumpTutorial = function () {
  hud.jumpTutorial.classList.remove('hidden')
  hud.accordion.collapseAll();
  hud.jumpTutorial.classList.add('active');
}

hud.clearError = function () {
  hud.clearErrorTimeoutHandle = null;
  hud.errorOverlay.style.display = 'none';
}

hud.decorateCircuits = function () {
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

hud.decorateCircuits();



window.code = {}
code = window.code
code.moveForwardError = function() {
  hud.showError("Error! Walking circuit damaged!");
};

code.moveForward = code.moveForwardError;

code.moveForwardWrapper = function(target, speed, dt) {
  var robot = {
    speed: {
      forward: target.velocity.z * -100
    }
  }
  try {
    code.moveForward(robot, speed, dt);
    target.velocity.z = robot.speed.forward / -100

    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    code.handleWalkError(e);
  }
}

code.handleWalkError = function (e) {
  hud.walkError.innerText = e.message
  hud.walkError.style.display = 'block';
}

code.inert = function () {
  console.log('not implemented')
}

code.jumpError = function () {
  hud.showError("Error! Jumping circuit broken!");
}

code.jump = code.inert

code.jumpWrapper = function(target, dt) {
  // TODO consider providing more than just y
  // could also make a function to convert a target to a robot
  // and another for the reverse
  var robot = {
    speed: {
      up: target.velocity.y * 100
    }
  }
  try {
    code.jump(robot, dt);
    target.velocity.y = robot.speed.up / 100

    hud.jumpError.style.display = 'none';
    hud.jumpError.innerText = '';
  } catch(e) {
    code.handleJumpError(e)
  }
}

code.handleJumpError = function(e) {
  hud.jumpError.innerText = e.message
  hud.jumpError.style.display = 'block';
}

window.world = {}
world = window.world


world.Material = {
    SKY: 0
  , GRASS: 1
  , BRICK: 2
  , DIRT: 3
}

var coordinatesInRange = function (x, z, range) {
    return x < range && x > -range && z < range && z > -range;
}

var dirtColumnWithBrickCube = function(x, y, z) {
    var Material = world.Material
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
    moveForward: code.moveForwardWrapper,
    jump: code.jumpWrapper
  }
});
game.appendTo(document.body);
window.game = game; // for easy debugging

var createPlayer = player(game)
var avatar = createPlayer('player.png')
avatar.pov(3)
avatar.possess()
avatar.yaw.position.set(0, 2, 10)

game.on('tick', function() {
  walk.render(avatar.playerSkin)
  var vx = Math.abs(avatar.velocity.x)
  var vz = Math.abs(avatar.velocity.z)
  if (vx > 0.001 || vz > 0.001) walk.stopWalking()
  else walk.startWalking()
})


var triggers = {
    atJumpObstacle: aabb([-5, 1, 6], [11, 1, 3])
  , atStrafeObstacle: aabb([-5, 3, 0], [11, 1, 6])
}
window.triggers = triggers

trigger(game.spatial, triggers.atJumpObstacle).on('enter', function() {
  hud.walkTutorial.classList.add('complete')
  hud.showInstruction('Press [spacebar] to jump')
  if (code.jump === code.inert) {
      code.jump = code.jumpError
  }

  setTimeout(hud.showJumpTutorial, 2000)
})

trigger(game.spatial, triggers.atStrafeObstacle).on('enter', function () {
  hud.jumpTutorial.classList.add('complete')
  // TODO next challenge
})



for (var triggerName in triggers) {
  game.addAABBMarker(triggers[triggerName])
}



