import {
  getCombinationByResponseId,
  storeCombination,
  storeResponse,
  findLabel,
  storeLabel,
} from "./combination-generator.repository.js";

export async function generateValidCombinations(items, length) {
  const labels = generateLabels(items);

  for (const label of labels) {
    const exists = await findLabel(label);
    if (!exists) {
      await storeLabel(label);
    }
  }

  const customId = generateCustomId(items, length);
  const existedResponse = await getCombinationByResponseId(customId);

  if (existedResponse) {
    const { combinationId, combination } = existedResponse;
    return { id: combinationId, combinations: combination };
  }

  const combinations = generateCombinations(labels, length);
  const combinationId = await storeCombination(combinations);

  await storeResponse(customId, combinationId);

  return { id: combinationId, combinations };
}

function generateCustomId(items, length) {
  return `${items.join("")}$${length}`;
}

function generateLabels(input) {
  const result = [];
  const asciiA = "A".charCodeAt(0);

  for (let index = 0; index < input.length; index++) {
    const letter = String.fromCharCode(asciiA + index);
    for (let i = 1; i <= input[index]; i++) {
      result.push(`${letter}${i}`);
    }
  }

  return result;
}

function generateCombinations(arr, combinationLength) {
  const result = [];
  const current = [];

  for (let i = 0; i < combinationLength; i++) {
    current[i] = i;
  }

  while (true) {
    const currentCombination = [];
    for (let i = 0; i < combinationLength; i++) {
      currentCombination.push(arr[current[i]]);
    }

    if (!hasSameStartingLetter(currentCombination)) {
      result.push(currentCombination);
    }

    let i = combinationLength - 1;
    while (i >= 0 && current[i] === arr.length - combinationLength + i) {
      i--;
    }

    if (i < 0) {
      break;
    }

    current[i]++;
    for (let j = i + 1; j < combinationLength; j++) {
      current[j] = current[j - 1] + 1;
    }
  }

  return result;
}

function hasSameStartingLetter(combination) {
  const seenLetters = {};
  for (let i = 0; i < combination.length; i++) {
    const firstLetter = combination[i][0];
    if (seenLetters[firstLetter]) {
      return true;
    }
    seenLetters[firstLetter] = true;
  }
  return false;
}
