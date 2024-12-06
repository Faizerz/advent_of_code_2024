const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const MAP = {};
  const rows = data.split("\n");
  const Directions = {
    UP: [0, -1],
    DOWN: [0, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
  };

  const getNewDirection = (direction) => {
    if (direction === Directions.UP) return Directions.RIGHT;
    if (direction === Directions.RIGHT) return Directions.DOWN;
    if (direction === Directions.DOWN) return Directions.LEFT;
    if (direction === Directions.LEFT) return Directions.UP;
  };

  const STARTING_POINT = { x: null, y: null };
  const STARTING_DIRECTION = Directions.UP;
  let totalVisited = 1;

  // Map Builder
  rows.forEach((row, y) =>
    row.split("").forEach((char, x) => {
      if (!MAP[x]) MAP[x] = {};
      MAP[x][y] = char;

      if (char === "^" && STARTING_POINT.x === null) {
        STARTING_POINT.x = x;
        STARTING_POINT.y = y;
      }
    })
  );

  const visitedLocations = { [STARTING_POINT.x]: { [STARTING_POINT.y]: true } };
  let finished = false;

  const navigateMap = (startX, startY, startDirection) => {
    let currentState = { x: startX, y: startY, direction: startDirection };

    while (!finished) {
      const { x, y, direction } = currentState;
      const [dx, dy] = direction;
      const newX = x + dx;
      const newY = y + dy;

      const target = MAP[newX]?.[newY];

      if (!target) {
        console.log("Total locations visited:", totalVisited);
        finished = true;
        break;
      }

      if (!visitedLocations[newX]) visitedLocations[newX] = {};

      if (target === "." || target === "^") {
        if (!visitedLocations[newX][newY]) {
          visitedLocations[newX][newY] = true;
          totalVisited++;
        }
        currentState = { x: newX, y: newY, direction }; // Move forward
        continue;
      }

      if (target === "#") {
        const newDirection = getNewDirection(direction);
        currentState = { x, y, direction: newDirection }; // Change direction
      }
    }
  };

  // Start navigation
  navigateMap(STARTING_POINT.x, STARTING_POINT.y, STARTING_DIRECTION);
});
