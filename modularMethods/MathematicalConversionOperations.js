export function fact(num) {
  let factOutput = 1;
  for (let i = 2; i <= num; i++) {
    factOutput *= i;
  }
  return factOutput;
}
