import { isPrime } from "./primenum";
describe("prime num function", () => {
  it("returns true for prime numbers", () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(3)).toBe(true);
    expect(isPrime(5)).toBe(true);
    expect(isPrime(7)).toBe(true);
  });
  it("returns false for numbers which are not prime", () => {
    expect(isPrime(4)).toBe(false);
    expect(isPrime(6)).toBe(false);
    expect(isPrime(8)).toBe(false);
  });
  it("should work for big prime numbers", () => {
    expect(isPrime(101)).toBe(true);
    expect(isPrime(113)).toBe(true);
  });
  it("should work for big non prime numbers", () => {
    expect(isPrime(100)).toBe(false);
    expect(isPrime(220)).toBe(false);
  });
});
