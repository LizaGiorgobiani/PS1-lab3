"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrime = isPrime;
let count = 0;
function isPrime(x) {
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
