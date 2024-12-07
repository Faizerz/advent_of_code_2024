const fs = require("fs");

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

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const MAP = {};
  const rows = data.split("\n");

  const STARTING_POINT = { x: null, y: null };
  const STARTING_DIRECTION = Directions.UP;

  let totalVisited = 0;
  let route = [];
  let totalLoopRoutes = 0;

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

  const navigateMap = (startX, startY, startDirection) => {
    let visitedLocations = { [startX]: { [startY]: 0 } };
    let currentState = { x: startX, y: startY, direction: startDirection };

    while (true) {
      const { x, y, direction } = currentState;
      const [dx, dy] = direction;
      const newX = x + dx;
      const newY = y + dy;

      const nextLocation = MAP[newX]?.[newY];

      if (!nextLocation) {
        break;
      }

      if (!visitedLocations[newX]) visitedLocations[newX] = {};

      if (visitedLocations[newX][newY] > 4) {
        totalLoopRoutes++;
        break;
      }

      if (nextLocation === "." || nextLocation === "^") {
        if (!visitedLocations[newX][newY]) {
          visitedLocations[newX][newY] = 1;
          route.push({ x: newX, y: newY });
          totalVisited++;
        } else {
          visitedLocations[newX][newY]++;
        }

        currentState = { x: newX, y: newY, direction };

        continue;
      }

      if (nextLocation === "#") {
        currentState = { x, y, direction: getNewDirection(direction) };
      }
    }
  };

  // Part One
  navigateMap(STARTING_POINT.x, STARTING_POINT.y, STARTING_DIRECTION);
  console.log("Total locations visited:", totalVisited);

  // Part Two
  route.forEach(({ x, y }) => {
    const initialChar = MAP[x][y];
    MAP[x][y] = "#";
    navigateMap(STARTING_POINT.x, STARTING_POINT.y, STARTING_DIRECTION);
    MAP[x][y] = initialChar;
  });

  console.log("Total loop routes:", totalLoopRoutes);
});
