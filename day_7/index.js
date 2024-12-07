const fs = require("fs");

const multiplyNumbers = (a, b) => a * b;
const addNumbers = (a, b) => a + b;

const processNumbers = (numbers, sum, startingNumber) => {
  let result = startingNumber;

  for (let i = 0; i < numbers.length; i++) {
    const isLastNumber = i === numbers.length - 1;
    const current = numbers[i];
    const resultMultiplyCurrent = multiplyNumbers(current, result);
    const resultPlusCurrent = addNumbers(current, result);

    console.log("===");
    console.log("result", result);
    console.log("current", current);
    console.log("resultMultiplyCurrent", resultMultiplyCurrent);
    console.log("resultPlusCurrent", resultPlusCurrent);

    if (
      (resultMultiplyCurrent === sum || resultPlusCurrent === sum) &&
      isLastNumber
    ) {
      console.log("**SUM REACHED**", sum);
      return sum;
    }

    if (resultMultiplyCurrent < sum) {
      console.log("multiplying", resultMultiplyCurrent);
      result = resultMultiplyCurrent;
      continue;
    }

    if (resultMultiplyCurrent > sum) {
      if (resultPlusCurrent < sum) {
        console.log("adding", resultPlusCurrent);
        result = resultPlusCurrent;
        continue;
      }
      if (resultPlusCurrent > sum) {
        console.log("adding is too large", result);
        break;
      }

      if (resultPlusCurrent === sum) {
        if (isLastNumber) {
          console.log("**SUM REACHED**", resultPlusCurrent);
          return sum;
        }
        console.log("sum reached early", resultPlusCurrent);
        break;
      }
    }
  }

  console.log("something went wrong: no valid combination found", result);
  return;
};

fs.readFile("test.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const rows = data.split("\n");

  let total = 0;

  rows.forEach((row) => {
    let [sum, numbers] = row.split(": ");
    sum = Number(sum);
    let initialNumbers = numbers.split(" ").map(Number);
    let success = false;
    console.log(
      "\n\n\n***************************************************************\n",
      initialNumbers
    );

    initialNumbers.forEach((_, index) => {
      if (index === 0 || success) return;
      const nums = initialNumbers.slice(index);
      const startingResult = initialNumbers
        .slice(0, index)
        .reduce((acc, n) => acc + n, 0);
      console.log(`\n**${sum}**`, "----------------", nums, startingResult);
      const result = processNumbers(nums, sum, startingResult);
      if (result) {
        total += result;
        success = true;
      }
    });
  });

  console.log(total);
});
