const fs = require("fs");

const getAntinodes = (nodeOne, nodeTwo, nMax, X_MAX, Y_MAX) => {
  const antinodes = [];
  const isValid = (x, y) => x >= 0 && x < X_MAX && y >= 0 && y < Y_MAX;

  const isFurtherRight = nodeOne.x > nodeTwo.x;
  const isFurtherDown = nodeOne.y > nodeTwo.y;
  const isFurtherLeft = nodeOne.x < nodeTwo.x;
  const isFurtherUp = nodeOne.y < nodeTwo.y;

  const addAntinode = (x, y) => isValid(x, y) && antinodes.push({ x, y });

  for (let n = -nMax; n <= nMax; n++) {
    const dx = Math.abs(nodeOne.x - nodeTwo.x) * n;
    const dy = Math.abs(nodeOne.y - nodeTwo.y) * n;

    if (isFurtherRight && isFurtherDown) {
      addAntinode(nodeOne.x + dx, nodeOne.y + dy);
      addAntinode(nodeTwo.x - dx, nodeTwo.y - dy);
    } else if (isFurtherRight && isFurtherUp) {
      addAntinode(nodeOne.x + dx, nodeOne.y - dy);
      addAntinode(nodeTwo.x - dx, nodeTwo.y + dy);
    } else if (isFurtherLeft && isFurtherDown) {
      addAntinode(nodeOne.x - dx, nodeOne.y + dy);
      addAntinode(nodeTwo.x + dx, nodeTwo.y - dy);
    } else if (isFurtherLeft && isFurtherUp) {
      addAntinode(nodeOne.x - dx, nodeOne.y - dy);
      addAntinode(nodeTwo.x + dx, nodeTwo.y + dy);
    } else if (nodeOne.x === nodeTwo.x) {
      addAntinode(nodeOne.x, isFurtherDown ? nodeOne.y + dy : nodeOne.y - dy);
      addAntinode(nodeTwo.x, isFurtherDown ? nodeTwo.y - dy : nodeTwo.y + dy);
    } else if (nodeOne.y === nodeTwo.y) {
      addAntinode(isFurtherRight ? nodeOne.x + dx : nodeOne.x - dx, nodeOne.y);
      addAntinode(isFurtherRight ? nodeTwo.x - dx : nodeTwo.x + dx, nodeTwo.y);
    }
  }

  return antinodes;
};

// Build a map of nodes
const buildNodeMap = (rows) =>
  rows.reduce((nodeMap, row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== ".") {
        nodeMap[symbol] = [...(nodeMap[symbol] || []), { x, y }];
      }
    });
    return nodeMap;
  }, {});

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.split("\n").map((row) => row.split(""));
  const Y_MAX = rows.length;
  const X_MAX = rows[0].length;

  const nodeMap = buildNodeMap(rows);
  const visitedLocations = new Set();
  let uniqueLocations = 0;

  Object.values(nodeMap).forEach((coordinates) => {
    coordinates.forEach((nodeOne, i) => {
      for (let j = i + 1; j < coordinates.length; j++) {
        const nodeTwo = coordinates[j];
        const antinodes = getAntinodes(nodeOne, nodeTwo, Y_MAX, X_MAX, Y_MAX);

        antinodes.forEach(({ x, y }) => {
          const key = `${x},${y}`;
          if (!visitedLocations.has(key)) {
            visitedLocations.add(key);
            uniqueLocations++;
          }
        });
      }
    });
  });

  console.log(uniqueLocations);
});
