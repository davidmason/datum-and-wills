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

Read the [story on the wiki](https://github.com/davidmason/datum-and-wills/wiki/Story)
