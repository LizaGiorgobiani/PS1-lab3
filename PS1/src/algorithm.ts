/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  const maxBucket = Math.max(...Array.from(buckets.keys()));
  const totalBuckets = maxBucket + 1;
  const result: Array<Set<Flashcard>> = Array.from(
    { length: totalBuckets },
    () => new Set()
  );
  for (let i = 0; i < totalBuckets; i++) {
    result[i] = buckets.get(i) || new Set();
  }
  return result;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  // TODO: Implement this function
  const nonEmptyBuckets = buckets
    .map((set, index) => ({ index, size: set.size }))
    .filter((item) => item.size > 0)
    .map((item) => item.index);

  if (nonEmptyBuckets.length === 0) {
    return undefined;
  }

  return {
    minBucket: Math.min(...nonEmptyBuckets),
    maxBucket: Math.max(...nonEmptyBuckets),
  };
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard>>,
  day: number
): Set<Flashcard> {
  const practiceSet = new Set<Flashcard>();
  for (let i = 0; i < buckets.length; i++) {
    const bucket = buckets[i];
    if (bucket && day % 2 ** i === 0) {
      for (const card of bucket) {
        practiceSet.add(card);
      }
    }
  }
  return practiceSet;
}

/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {
  const currentBucket =
    [...buckets.entries()].find(([_, cards]) => cards.has(card))?.[0] ?? 0;

  // Remove the card from the current bucket
  if (buckets.get(currentBucket)) {
    buckets.get(currentBucket)?.delete(card);
  }

  let newBucket = currentBucket;
  switch (difficulty) {
    case AnswerDifficulty.Easy:
      newBucket += 1;
      break;
    case AnswerDifficulty.Hard:
      if (currentBucket > 0) newBucket -= 1;
      break;
    case AnswerDifficulty.Wrong:
      newBucket = 0;
      break;
  }

  if (!buckets.has(newBucket)) {
    buckets.set(newBucket, new Set());
  }

  buckets.get(newBucket)?.add(card);

  return buckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(
  card: Flashcard,
  revealPercentage: number = 30
): string {
  if (revealPercentage <= 0 || revealPercentage > 100) {
    throw new Error("revealPercentage must be between 1 and 100");
  }
  const text = card.front;
  if (text.includes(" ")) {
    return text.split(" ")[0] + "...";
  }
  const revealCount = Math.ceil((revealPercentage / 100) * text.length);
  return text.slice(0, revealCount) + "...";
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */

/*
computes the percentage of the cards which are correct 
 */
export function computeProgress(buckets: BucketMap): string {
  if (buckets.size === 0) {
    return "0.00%";
  }
  const totalCards = Array.from(buckets.values()).reduce(
    (sum, cards) => sum + cards.size,
    0
  );

  if (totalCards === 0) {
    return "0.00%";
  }

  const retiredCards = buckets.get(5)?.size || 0;
  const progressPercentage = (retiredCards / totalCards) * 100;

  return progressPercentage.toFixed(2) + "%";
}
