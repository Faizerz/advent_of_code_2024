const fs = require("fs");

const getAntinodes = (nodeOne, nodeTwo, n) => {
  const isNodeOneFurtherRight = nodeOne.x > nodeTwo.x;
  const isNodeOneFurtherDown = nodeOne.y > nodeTwo.y;
  const isNodeOneFurtherLeft = nodeOne.x < nodeTwo.x;
  const isNodeOneFurtherUp = nodeOne.y < nodeTwo.y;

  const dx = Math.abs(nodeOne.x - nodeTwo.x) * (n || 1);
  const dy = Math.abs(nodeOne.y - nodeTwo.y) * (n || 1);

  if (isNodeOneFurtherRight && isNodeOneFurtherDown) {
    return [
      { x: nodeOne.x + dx, y: nodeOne.y + dy },
      { x: nodeTwo.x - dx, y: nodeTwo.y - dy },
    ];
  } else if (isNodeOneFurtherRight && isNodeOneFurtherUp) {
    return [
      { x: nodeOne.x + dx, y: nodeOne.y - dy },
      { x: nodeTwo.x - dx, y: nodeTwo.y + dy },
    ];
  } else if (isNodeOneFurtherLeft && isNodeOneFurtherDown) {
    return [
      { x: nodeOne.x - dx, y: nodeOne.y + dy },
      { x: nodeTwo.x + dx, y: nodeTwo.y - dy },
    ];
  } else if (isNodeOneFurtherLeft && isNodeOneFurtherUp) {
    return [
      { x: nodeOne.x - dx, y: nodeOne.y - dy },
      { x: nodeTwo.x + dx, y: nodeTwo.y + dy },
    ];
  } else if (nodeOne.x === nodeTwo.x) {
    return [
      {
        x: nodeOne.x,
        y: isNodeOneFurtherDown ? nodeOne.y + dy : nodeOne.y - dy,
      },
      {
        x: nodeTwo.x,
        y: isNodeOneFurtherDown ? nodeTwo.y - dy : nodeTwo.y + dy,
      },
    ];
  } else if (nodeOne.y === nodeTwo.y) {
    return [
      {
        x: isNodeOneFurtherRight ? nodeOne.x + dx : nodeOne.x - dx,
        y: nodeOne.y,
      },
      {
        x: isNodeOneFurtherRight ? nodeTwo.x - dx : nodeTwo.x + dx,
        y: nodeTwo.y,
      },
    ];
  }
};

const buildNodeMap = (rows) => {
  const nodeMap = {};

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const symbol = rows[y][x];
      if (symbol !== ".") {
        nodeMap[symbol] = [...(nodeMap[symbol] || []), { x, y }];
      }
    }
  }

  return nodeMap;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.split("\n").map((row) => row.split(""));

  const Y_MAX = rows.length;
  const X_MAX = rows[0].length;

  const nodeMap = buildNodeMap(rows);
  const visitedLocations = {};
  let uniqueLocations = 0;

  Object.values(nodeMap).forEach((coordinates) => {
    coordinates.forEach((coordinate, i) => {
      if (i === coordinates.length - 1) {
        return;
      }

      const nodeOne = coordinate;

      for (let j = i + 1; j < coordinates.length; j++) {
        const nodeTwo = coordinates[j];
        const antinodes = getAntinodes(nodeOne, nodeTwo);

        antinodes.forEach((antinode) => {
          if (
            antinode.x >= 0 &&
            antinode.x < X_MAX &&
            antinode.y >= 0 &&
            antinode.y < Y_MAX
          ) {
            if (!visitedLocations[`${antinode.x},${antinode.y}`]) {
              visitedLocations[`${antinode.x},${antinode.y}`] = true;
              uniqueLocations++;
            }
          }
        });
      }
    });
  });

  console.log(uniqueLocations);
});
