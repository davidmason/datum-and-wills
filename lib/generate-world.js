
var coordinatesInRange = function (x, z, range) {
  return x < range && x > -range && z < range && z > -range;
};

module.exports = function dirtColumnWithBrickCube (x, y, z) {
  var materials = {
        SKY: 0,
        GRASS: 1,
        BRICK: 2,
        DIRT: 3
      },
      canyonWall = (x > 5 || x < -5) && y > 0 && y < 10,
      inMiddle = coordinatesInRange(x, z, 6),
      inRange = coordinatesInRange(x, z, 30),
      underground = y < 0,
      surface = y === 0,
      aboveGround = y > 0,
      highUp = y > 2;

  if (canyonWall && inRange) { return materials.DIRT; }
  if (inMiddle && aboveGround && !highUp) { return materials.DIRT; }
  if (surface && inRange) { return materials.GRASS; }
  if (underground && inRange) { return materials.DIRT; }
  return materials.SKY;
};