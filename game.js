var createGame = require('voxel-engine'),
    player = require('voxel-player'),
    texturePath = require('painterly-textures')(__dirname),
    trigger = require('spatial-trigger'),
    aabb = require('aabb-3d'),
    walk = require('voxel-walk'),


    hud = require('./lib/hud.js'),
    generateWorld = require('./lib/generate-world.js'),
    code = {};


hud.walkCircuit.onchange = function() {
  console.log('updating moveForward');
  // FIXME could be this.value
  var moveForward, funcString, functionBody = hud.walkCircuit.value;
  try {
    funcString = "moveForward = function (robot, speed, dt) {" + functionBody + "}";
    eval(funcString);
    code.moveForward = moveForward;
    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    code.handleWalkError(e);
  }
};

// TODO de-duplicate handling of walk and jump here
hud.jumpCircuit.onchange = function() {
  console.log('updating jump');
  var jump, funcString, functionBody = hud.jumpCircuit.value;
  try {
    funcString = "jump = function (robot, dt) {" + functionBody + "}";
    console.log(funcString);
    eval(funcString);
    console.log(jump);
    code.jump = jump;
    hud.jumpError.style.display = 'none';
    hud.jumpError.innerText = '';
  } catch(e) {
    code.handleJumpError(e);
  }
};


code.moveForwardError = function() {
  hud.showError("Error! Walking circuit damaged!");
};

code.moveForward = code.moveForwardError;

code.moveForwardWrapper = function(target, speed, dt) {
  var robot = {
    speed: {
      forward: target.velocity.z * -100
    }
  };
  try {
    code.moveForward(robot, speed, dt);
    target.velocity.z = robot.speed.forward / -100;

    hud.walkError.style.display = 'none';
    hud.walkError.innerText = '';
  } catch(e) {
    code.handleWalkError(e);
  }
};

code.handleWalkError = function (e) {
  hud.walkError.innerText = e.message;
  hud.walkError.style.display = 'block';
};

code.inert = function () {
  console.log('not implemented');
};

code.jumpError = function () {
  hud.showError("Error! Jumping circuit broken!");
  setTimeout(hud.showJumpTutorial, 2000);
};

code.jump = code.inert;

code.jumpWrapper = function(target, dt) {
  // TODO consider providing more than just y
  // could also make a function to convert a target to a robot
  // and another for the reverse
  var robot = {
    speed: {
      up: target.velocity.y * 100
    }
  };
  try {
    code.jump(robot, dt);
    target.velocity.y = robot.speed.up / 100;

    hud.jumpError.style.display = 'none';
    hud.jumpError.innerText = '';
  } catch(e) {
    code.handleJumpError(e);
  }
};

code.handleJumpError = function(e) {
  hud.jumpError.innerText = e.message;
  hud.jumpError.style.display = 'block';
};

var game = createGame({
  texturePath: texturePath,
  generate: generateWorld,
  controls: {
    moveForward: code.moveForwardWrapper,
    jump: code.jumpWrapper
  }
});
game.appendTo(document.body);


// TODO move player creation and walking to separate script - only needs game
//      and can require walk from there.
var createPlayer = player(game);
var avatar = createPlayer('player.png');
avatar.pov(3);
avatar.possess();
avatar.yaw.position.set(0, 2, 10);

game.on('tick', function() {
  walk.render(avatar.playerSkin);
  var vx = Math.abs(avatar.velocity.x),
      vz = Math.abs(avatar.velocity.z);
  if (vx > 0.001 || vz > 0.001) { walk.stopWalking(); }
  else { walk.startWalking(); }
});


var triggers = {
    atJumpObstacle: aabb([-5, 1, 6], [11, 1, 3]),
    atStrafeObstacle: aabb([-5, 3, 0], [11, 1, 6])
  };
triggers = triggers;

trigger(game.spatial, triggers.atJumpObstacle).on('enter', function() {
  hud.walkTutorial.classList.add('complete');
  hud.showInstruction('Press [spacebar] to jump');
  if (code.jump === code.inert) {
    code.jump = code.jumpError;
  }
});

trigger(game.spatial, triggers.atStrafeObstacle).on('enter', function () {
  hud.jumpTutorial.classList.add('complete');
  // TODO next challenge
});



(function drawTriggers () {
  for (var triggerName in triggers) {
    game.addAABBMarker(triggers[triggerName]);
  }
});


var critterCreator = require('voxel-critter')(game);

var img = new Image();
img.onload = function() {
  var wills = critterCreator(img);

  wills.position.clone(game.controls.target().avatar.position);
  wills.position.z -= 4;
  wills.position.y += 10;

};
img.src = 'wills.png';


