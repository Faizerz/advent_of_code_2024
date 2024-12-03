const fs = require("fs");

const validateLevels = (levels) => {
  let isIncreasing = undefined;

  for (let idx = 1; idx < levels.length; idx++) {
    const numberBefore = levels[idx - 1];
    const number = levels[idx];
    const differenceInAdjascentNumbers = Math.abs(number - numberBefore);

    if (
      differenceInAdjascentNumbers > 3 ||
      differenceInAdjascentNumbers < 1 ||
      (number > numberBefore && isIncreasing === false) ||
      (number < numberBefore && isIncreasing === true)
    ) {
      return false;
    }

    if (number > numberBefore) {
      isIncreasing = true;
    } else if (number < numberBefore) {
      isIncreasing = false;
    }
  }

  return true;
};

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const reports = data.split("\n");

  // Part One
  const numberOfSafeReports = reports.reduce((count, report) => {
    const levels = report.split(" ").map(Number);
    return validateLevels(levels) ? count + 1 : count;
  }, 0);

  console.log("Number of Safe Reports:", numberOfSafeReports);

  // Part Two
  const numberOfDampenedSafeReports = reports.reduce((count, report) => {
    const levels = report.split(" ").map(Number);

    if (validateLevels(levels)) {
      return count + 1;
    }

    for (let i = 0; i < levels.length; i++) {
      const modifiedLevels = levels.slice(0, i).concat(levels.slice(i + 1));
      if (validateLevels(modifiedLevels)) {
        return count + 1;
      }
    }

    return count;
  }, 0);

  console.log("Number of Dampened Safe Reports:", numberOfDampenedSafeReports);
});
