"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const primenum_1 = require("./primenum");
describe("prime num function", () => {
    it("returns true for prime numbers", () => {
        expect((0, primenum_1.isPrime)(2)).toBe(true);
        expect((0, primenum_1.isPrime)(3)).toBe(true);
        expect((0, primenum_1.isPrime)(5)).toBe(true);
        expect((0, primenum_1.isPrime)(7)).toBe(true);
    });
    it("returns false for numbers which are not prime", () => {
        expect((0, primenum_1.isPrime)(4)).toBe(false);
        expect((0, primenum_1.isPrime)(6)).toBe(false);
        expect((0, primenum_1.isPrime)(8)).toBe(false);
    });
    it("should work for big prime numbers", () => {
        expect((0, primenum_1.isPrime)(101)).toBe(true);
        expect((0, primenum_1.isPrime)(113)).toBe(true);
    });
    it("should work for big non prime numbers", () => {
        expect((0, primenum_1.isPrime)(100)).toBe(false);
        expect((0, primenum_1.isPrime)(220)).toBe(false);
    });
});
