const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const pebbles = data.split(" ").map(Number);

  console.log("Part One =", getPebbleLength(pebbles, 25));
  console.log("Part Two =", getPebbleLength(pebbles, 75));
});

const transformMap = { 0: [1] };

const getPebbleLength = (initialPebbles, numberOfBlinks) => {
  let pebbleCountsMap = getInitialPebbleCountsMap(initialPebbles);

  for (let i = 0; i < numberOfBlinks; i++) {
    pebbleCountsMap = processBlinks(pebbleCountsMap);
  }

  return Object.values(pebbleCountsMap).reduce((sum, count) => sum + count, 0);
};

const getInitialPebbleCountsMap = (pebbles) => {
  const counts = {};
  for (const pebble of pebbles) {
    counts[pebble] = (counts[pebble] || 0) + 1;
  }
  return counts;
};

const processBlinks = (pebbleCountsMap) => {
  const newCounts = {};
  for (const pebble in pebbleCountsMap) {
    const count = pebbleCountsMap[pebble];
    const transformed = transformPebble(Number(pebble));
    for (const newPebble of transformed) {
      newCounts[newPebble] = (newCounts[newPebble] || 0) + count;
    }
  }
  return newCounts;
};

const transformPebble = (pebble) => {
  if (transformMap[pebble]) return transformMap[pebble];

  const strPebble = String(pebble);
  if (strPebble.length % 2 === 0) {
    const mid = strPebble.length / 2;
    const left = Number(strPebble.slice(0, mid));
    const right = Number(strPebble.slice(mid));
    return (transformMap[pebble] = [left, right]);
  }

  return (transformMap[pebble] = [pebble * 2024]);
};
