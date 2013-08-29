datum-and-wills
===============

A narative browser-based voxel game that aims to introduce and teach javascript coding interactively.

# Playable Prototype

[Try the prototype here](http://www.proto.pixelaped.com/datum-and-wills/datum-wills.html).


# Installation

This project requires node.js, grunt and a webgl-capable browser.

 1. If node.js is not installed, download and install it from [the node.js website](http://nodejs.org/). This will also install npm.
 1. If grunt is not installed, install grunt with ```npm install -g grunt-cli``` (this may need sudo permission).
 1. Clone this repository and navigate to the repository root directory.
 1. Download all the dependencies by running ```npm install```
 1. Compile the game by running ```grunt```
 1. Run the game by opening datum-wills.html (*see note)

*Note: this has only been tested with Google Chrome Version 24.0.1312.69 running on Red Hat Enterprise Linux 6. With my setup it is necessary to run Chrome with the ```--allow-file-access-from-files``` flag. e.g. I might run

```bash
google-chrome datum-wills.html --allow-file-access-from-files
```

Story
=====

At the time of writing, only a small part of the first chapter of the story has been implemented. There are currently 4 chapters planned, each with several code-writing challenges.
You can [read the story on the wiki](https://github.com/davidmason/datum-and-wills/wiki/Story).
