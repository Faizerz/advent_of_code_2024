const fs = require("fs");

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const [pageOrderingRulesData, pageUpdatesData] = data.split("\n\n");
  const orderingRules = pageOrderingRulesData.split("\n");
  const pageUpdates = pageUpdatesData.split("\n");

  // Build the rules index
  const rulesIndex = {};
  orderingRules.forEach((rule) => {
    const [currentPage, afterCurrentPage] = rule.split("|");
    if (!rulesIndex[currentPage]) {
      rulesIndex[currentPage] = [];
    }
    rulesIndex[currentPage].push(afterCurrentPage);
  });

  let totalMiddleNumber = 0;
  let invalidPageUpdates = [];

  // Part One
  pageUpdates.forEach((pageUpdate) => {
    const pages = pageUpdate.split(",");

    const pageIndexMap = {};
    pages.forEach((page, idx) => {
      pageIndexMap[page] = idx;
    });

    let validPage = true;

    // Check for ordering violations
    for (const currentPage of pages) {
      if (!validPage) break;

      const currentPageIndex = pageIndexMap[currentPage];
      const pagesAfterCurrent = rulesIndex[currentPage];

      if (!pagesAfterCurrent) continue;

      for (const pageAfter of pagesAfterCurrent) {
        if (!validPage) break;

        const pageAfterIndex = pageIndexMap[pageAfter];
        if (pageAfterIndex === undefined) continue;

        if (pageAfterIndex < currentPageIndex) {
          validPage = false;
          invalidPageUpdates.push(pages);
          break;
        }
      }
    }

    if (validPage) {
      totalMiddleNumber += Number(
        pages[(middleIndex = Math.floor(pages.length / 2))]
      );
    }
  });

  console.log("Total middle number:", totalMiddleNumber);

  // Part Two: Fix invalid page updates
  const fixedInvalidPageUpdates = invalidPageUpdates
    .map((pages) => fixInvalidUpdate(pages, rulesIndex))
    .filter((pages) => pages !== null);

  const partTwoAnswer = fixedInvalidPageUpdates.reduce(
    (acc, pages) => acc + Number(pages[Math.floor(pages.length / 2)]),
    0
  );

  console.log("Part two answer:", partTwoAnswer);
});

const fixInvalidUpdate = (pages, rulesIndex, triedPagesSet = new Set()) => {
  const pagesKey = pages.join(",");

  if (triedPagesSet.has(pagesKey)) {
    // Avoid infinite recursion by not reprocessing the same page sequence
    return null;
  }

  triedPagesSet.add(pagesKey);

  const validationResult = validatePages(pages, rulesIndex);

  if (validationResult.isValid) {
    return pages;
  }

  const invalidPairs = validationResult.invalidPairs;

  for (const [currentPageIndex, pageAfterIndex] of invalidPairs) {
    // Swap the pages causing invalidity
    const newPages = [...pages];
    [newPages[currentPageIndex], newPages[pageAfterIndex]] = [
      newPages[pageAfterIndex],
      newPages[currentPageIndex],
    ];

    // Recursively try to fix the ordering
    const result = fixInvalidUpdate(newPages, rulesIndex, triedPagesSet);

    if (result) {
      return result;
    }
  }
};

// Helper function to validate page ordering
const validatePages = (pages, rulesIndex) => {
  const pageIndexMap = {};
  pages.forEach((page, idx) => {
    pageIndexMap[page] = idx;
  });

  const invalidPairs = [];

  for (const currentPage of pages) {
    const currentPageIndex = pageIndexMap[currentPage];
    const pagesAfterCurrent = rulesIndex[currentPage];

    if (!pagesAfterCurrent) continue;

    for (const pageAfter of pagesAfterCurrent) {
      const pageAfterIndex = pageIndexMap[pageAfter];
      if (pageAfterIndex === undefined) continue;

      if (pageAfterIndex < currentPageIndex) {
        // Found an invalid ordering
        invalidPairs.push([currentPageIndex, pageAfterIndex]);
      }
    }
  }

  if (invalidPairs.length === 0) {
    return { isValid: true };
  } else {
    return { isValid: false, invalidPairs };
  }
};
