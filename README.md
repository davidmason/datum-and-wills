datum-and-wills
===============

A narative browser-based voxel game that aims to introduce and teach javascript coding interactively.


# Installation

This project requires node.js, browserify and a webgl-capable browser.

 1. If node.js is not installed, download and install it from [the node.js website](http://nodejs.org/). This will also install npm.
 1. Install browserify using ```npm install browserify -g``` (this may need sudo permission).
 1. Clone this repository and navigate to the repository root directory.
 1. Download all the dependencies by running ```npm install```
 1. Compile the game by running ```browserify game.js -o game-compiled.js```
 1. Run the game by opening datum-wills.html (*see note)

*Note: this has only been tested with Google Chrome Version 24.0.1312.69 running on Red Hat Enterprise Linux 6. With my setup it is necessary to run Chrome with the ```--allow-file-access-from-files``` flag. e.g. I might run

```bash
google-chrome datum-wills.html --allow-file-access-from-files
```

Story
=====

The story begins when Datum (an android) and Sir William ("Wills", a robotic dog) lose control of their spaceship and are forced to eject before it crashes. This story is under active development and will likely change as new ideas are thought up.

The game is played from the perspective of Datum.

![Prototype for wills robot](https://raw.github.com/davidmason/datum-and-wills/master/prototypes/wills-prototype.png)
Prototype for Sir William made at voxelbuilder.com, see [interactive Wills model on voxelbuilder.com](http://voxelbuilder.com/#A/dlkkUhUhUhcheYhYhZhhdehfYfbhhhSeXhhfShSeeieiYfYfSeYhYhedihShYfchfYfWheYhUfYfchfYfehifYfWffYhWhlYfWfhYhUfSaSkYfaffUfUfYfUhUhYfUfUfYfUhUhejffYfYfYfajiYfYfYfeiheYfYfaiiYfYfaffUfUfcfiUeUhcfhUfcfhUfYfcifcbichfYhceichfemfhYfYfcihYfYfaieYfYfcifYfYfejihYfYfedahSeUhUhWfiUhchiUfUfchhefhechfYfUfeneiSeefjiYhcffUfUfSeUhUhchhYfelhiYhafeYhafhYeYh:C/2ecc713498db34495ee67e22ecf0f1000000)


## Chapter 1
Your circuits were damaged during the crash and you are malfunctioning. Sir William's parachute is hooked on a tree. Repair yourself as you journey over and rescue him.

Challenges:-

 - assign name to variable
 - bind walk action to key
 - bind jump action to key (to get over a log)
 - bind strafe (sidestep) keys (to get around something)
 - bind look angle to mouse movement

## Chapter 2
Sir William is acting strangely. Fix his programming so you can take him with you to look for your crashed spaceship.

Challenges:-

 - script dog follows player
 - script dog to avoid danger
 - script dog to barks if it is stuck too far away
 - script dog to stay or approach when clicked on (or in response to some other command)
 - script dog to 'smell' for the spaceship and do 'pointing' behaviour towards it

## Chapter 3
You have found your ship. It is badly damaged and needs repairs. Fix the damaged hull and other ship systems.

## Chapter 4
You need a beryllium sphere to power the ship. Go on an adventure to find one.

Challenges:-

 - program a sensor module to detect berylium
 - build a bridge over a chasm
 - get up a cliff face
 - make a light (to navigate a cave)
 - make a hole in cave wall (to get to beryllium)
 - teleport back to the ship
