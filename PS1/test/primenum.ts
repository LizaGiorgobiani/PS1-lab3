let count = 0;
export function isPrime(x: number): boolean {
  for (let i = 1; i <= x; i++) {
    if (x % i == 0) {
      count++;
    }
  }
  if (count == 2) {
    return true;
  }
  return false;
}
console.log(isPrime(5));
