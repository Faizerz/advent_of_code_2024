const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Part One

  const splitList = data.split("\n").map((l) => l.split("   "));

  const [leftList, rightList] = splitList.reduce(
    ([left, right], [leftItem, rightItem]) => [
      [...left, leftItem],
      [...right, rightItem],
    ],
    [[], []]
  );

  const sortedLeftList = leftList.sort();
  const sortedRightList = rightList.sort();

  const totalDistance = sortedLeftList.reduce(
    (acc, _, i) =>
      acc + Math.abs(Number(sortedLeftList[i]) - Number(sortedRightList[i])),
    0
  );

  console.log(totalDistance);

  // Part Two

  const rightListCountMap = sortedRightList.reduce(
    (acc, number) => ({
      ...acc,
      [number]: acc?.[number] ? (acc[number] += 1) : 1,
    }),
    {}
  );

  const simalarityScore = sortedLeftList.reduce((acc, number) => {
    const count = rightListCountMap?.[number] ? rightListCountMap[number] : 0;
    return (acc += number * count);
  }, 0);

  console.log(simalarityScore);
});
