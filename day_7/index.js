const fs = require("fs");

const tryAllCombinations = (nums, target) => {
  if (nums.length === 1) {
    return nums[0] === target ? target : null;
  }

  const [first, second, ...rest] = nums;

  const addResult = tryAllCombinations([first + second, ...rest], target);
  if (addResult !== null) {
    return addResult;
  }

  const multiplyResult = tryAllCombinations([first * second, ...rest], target);
  if (multiplyResult !== null) {
    return multiplyResult;
  }

  // PART TWO
  const concatResult = tryAllCombinations(
    [Number(`${first}${second}`), ...rest],
    target
  );
  if (concatResult !== null) {
    return concatResult;
  }

  return null;
};

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.trim().split("\n");
  let total = 0;

  rows.forEach((row) => {
    let [sum, nums] = row.split(": ");
    const target = Number(sum);
    const numbers = nums.split(" ").map(Number);

    const result = tryAllCombinations(numbers, target);
    if (result !== null) {
      total += result;
    }
  });

  console.log(total);
});
