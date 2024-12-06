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

  let totalVisited = 1;
  let getRoute = true;
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
    let finished = false;

    while (!finished) {
      const { x, y, direction } = currentState;
      const [dx, dy] = direction;
      const newX = x + dx;
      const newY = y + dy;

      const target = MAP[newX]?.[newY];

      if (!target) {
        finished = true;
        break;
      }

      if (!visitedLocations[newX]) visitedLocations[newX] = {};

      if (visitedLocations[newX][newY] > 4) {
        finished = true;
        totalLoopRoutes++;
        break;
      }

      if (target === "." || target === "^") {
        if (!visitedLocations[newX][newY]) {
          visitedLocations[newX][newY] = 1;
          totalVisited++;
        } else {
          visitedLocations[newX][newY]++;
        }

        currentState = { x: newX, y: newY, direction };

        if (getRoute) route.push({ x: newX, y: newY });

        continue;
      }

      if (target === "#") {
        currentState = { x, y, direction: getNewDirection(direction) };
      }
    }
  };

  // Part One
  navigateMap(STARTING_POINT.x, STARTING_POINT.y, STARTING_DIRECTION);
  console.log("Total locations visited:", totalVisited);

  // Part Two
  getRoute = false;

  const getUniqueRoute = (route) => {
    const unique = [];
    route.forEach((r) => {
      if (!unique.some((u) => u.x === r.x && u.y === r.y)) {
        unique.push(r);
      }
    });
    return unique;
  };

  const uniqueRoute = getUniqueRoute(route);

  uniqueRoute.forEach(({ x, y }) => {
    const initialChar = MAP[x][y];
    MAP[x][y] = "#";
    navigateMap(STARTING_POINT.x, STARTING_POINT.y, STARTING_DIRECTION);
    MAP[x][y] = initialChar;
  });

  console.log("Total loop routes:", totalLoopRoutes);
});
