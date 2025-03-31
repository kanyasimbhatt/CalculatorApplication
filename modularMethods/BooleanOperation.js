export function opInclude(str, opArr) {
  for (let i of opArr) {
    if (str.includes(i)) return true;
  }
  return false;
}
