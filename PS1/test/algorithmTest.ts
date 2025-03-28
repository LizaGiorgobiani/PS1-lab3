import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";
import { create } from "domain";
import { get } from "http";

/**
 * Type Declarations
 */
const createFlashcard = (front: string, back: string): Flashcard => ({
  front,
  back,
  hint: "",
  tags: [],
});

/**
 * Testing strategy for toBucketSets():
 *
 * - Test empty bucket map
 * - Test bucket map with one bucket containing multiple cards
 * - Test bucket map with multiple buckets with various numbers of cards
 */
describe("toBucketSets()", () => {
  it("should handle an empty bucket map", () => {
    const buckets: BucketMap = new Map();
    const result = toBucketSets(buckets);
    assert.deepStrictEqual(result, []);
  });

  it("should handle a single bucket with cards", () => {
    const card1 = createFlashcard("cat", "კატა");
    const card2 = createFlashcard("dog", "ძაღლი");
    const buckets: BucketMap = new Map([
      [0, new Set<Flashcard>([card1, card2])],
    ]);

    const result = toBucketSets(buckets);
    assert.strictEqual(result.length, 1);
    assert.deepStrictEqual(result[0], new Set([card1, card2]));
  });

  it("should handle multiple buckets", () => {
    const card1 = createFlashcard("apple", "ვაშლი");
    const card2 = createFlashcard("banana", "ბანანი");
    const card3 = createFlashcard("cherry", "ალუბალი");
    const buckets: BucketMap = new Map([
      [0, new Set<Flashcard>([card1])],
      [1, new Set<Flashcard>([card2])],
      [2, new Set<Flashcard>([card3])],
    ]);

    const result = toBucketSets(buckets);
    assert.strictEqual(result.length, 3);
    assert.deepStrictEqual(result[0], new Set([card1]));
    assert.deepStrictEqual(result[1], new Set([card2]));
    assert.deepStrictEqual(result[2], new Set([card3]));
  });
});

/**
 * Testing strategy for update():
 *
 * - Test moving a card to the next bucket ("easy")
 * - Test moving a card to the previous bucket ("hard")
 * - Test resetting a card to bucket 0 ("wrong")
 */
describe("update()", () => {
  it("should move card to the next bucket for 'easy' response", () => {
    const card = createFlashcard("a", "A");
    const buckets: BucketMap = new Map([[0, new Set([card])]]);

    const result = update(buckets, card, AnswerDifficulty.Easy);
    assert.ok(result.get(1)?.has(card));
  });

  it("should move card to the previous bucket for 'hard' response", () => {
    const card = createFlashcard("a", "A");
    const buckets: BucketMap = new Map([[1, new Set([card])]]);

    const result = update(buckets, card, AnswerDifficulty.Hard);
    assert.ok(result.get(0)?.has(card));
  });

  it("should reset card to bucket 0 for 'wrong' response", () => {
    const card = createFlashcard("a", "A");
    const buckets: BucketMap = new Map([[2, new Set([card])]]);

    const result = update(buckets, card, AnswerDifficulty.Wrong);
    assert.ok(result.get(0)?.has(card));
  });
});

/**
 * Testing strategy for getHint():
 *
 * - Test with a single word
 */
describe("getHint()", () => {
  it("should return the first letter followed by '...'", () => {
    const card = createFlashcard("aa", "AA");
    const result = getHint(card);
    assert.strictEqual(result, "a...");
  });

  it("should reveal 30% of a single-word flashcard by default", () => {
    const card = createFlashcard("aa", "AA");
    const result = getHint(card);
    assert.strictEqual(result, "a...");
  });
  it("should reveal only the first word of a phrase", () => {
    const card = createFlashcard("b b", "B B");
    const result = getHint(card);
    assert.strictEqual(result, "b...");
  });
  it("should  respect the specified reveal percentage", () => {
    const card = createFlashcard("bbbb", "BBBB");
    const result = getHint(card, 50);
    assert.strictEqual(result, "bb...");
  });
  it("should throw an error for invalid percentage", () => {
    const card = createFlashcard("bb", "BB");
    assert.throws(
      () => getHint(card, -10),
      /revealPercentage must be between 1 and 100/
    );
  });
});

/**
 * Testing strategy for computeProgress():
 *
 * - Test with empty buckets
 * - Test with buckets containing cards
 * - Test with all cards retired
 */
describe("computeProgress()", () => {
  it("should return 0.00% progress for empty buckets", () => {
    const buckets: BucketMap = new Map();
    const result = computeProgress(buckets);
    assert.strictEqual(result, "0.00%");
  });

  it("should return 0.00% when there are cards but none are retired", () => {
    const card1 = createFlashcard("a", "A");
    const card2 = createFlashcard("b", "B");
    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [5, new Set([card2])],
    ]);

    const result = computeProgress(buckets);
    assert.strictEqual(result, "0.00%");
  });

  it("should return 100% progress when all cards are retired", () => {
    const card1 = createFlashcard("a", "A");
    const card2 = createFlashcard("b", "B");
    const buckets: BucketMap = new Map([[5, new Set([card1, card2])]]);

    const result = computeProgress(buckets);
    assert.strictEqual(result, "100.00%");
  });

  it("should return correct progress when some cards are retired", () => {
    const card1 = createFlashcard("a", "A");
    const card2 = createFlashcard("b", "B");
    const card3 = createFlashcard("c", "C");
    const buckets: BucketMap = new Map([
      [0, new Set([card1])],
      [5, new Set([card2, card3])],
    ]);
    const result = computeProgress(buckets);
    assert.strictEqual(result, "66.67%");
  });
});
