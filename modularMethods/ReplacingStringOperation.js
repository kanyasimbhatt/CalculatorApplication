function conversionBetweenDegRad(value) {
  if (
    document.getElementsByClassName("deg-rad-button")[0].textContent === "DEG"
  ) {
    return (value * Math.PI) / 180;
  } else {
    return value;
  }
}
export function replaceAll(newStr, secondOperationToggle) {
  newStr = newStr.replace(`X`, `*`);
  newStr = newStr.replace(`÷`, `/`);
  newStr = newStr.replace("mod", "%");
  newStr = newStr.replace("π", `${Math.PI}`);
  newStr = newStr.replace("^", "**");
  if (secondOperationToggle === 1) {
    newStr = newStr.replace(`√`, "Math.cbrt");
  } else newStr = newStr.replace("√", "Math.sqrt");
  newStr = newStr.replace(
    /sin\((.+)\)/g,
    `Math.sin(${conversionBetweenDegRad}($1)).toFixed(2)`
  );
  newStr = newStr.replace(
    /cos\((.+)\)/g,
    `Math.cos(${conversionBetweenDegRad}($1)).toFixed(2)`
  );
  newStr = newStr.replace(
    /tan\((.+)\)/g,
    `Math.sin(${conversionBetweenDegRad}($1)).toFixed(2)/Math.cos(${conversionBetweenDegRad}($1)).toFixed(2)`
  );
  newStr = newStr.replace(
    /cosec\((.+)\)/g,
    `(1/Math.sin(${conversionBetweenDegRad}($1))).toFixed(2)`
  );
  newStr = newStr.replace(
    /sec\((.+)\)/g,
    `(1/Math.cos(${conversionBetweenDegRad}($1))).toFixed(2)`
  );
  newStr = newStr.replace(
    /cot\((.+)\)/g,
    `Math.cos(${conversionBetweenDegRad}($1)).toFixed(2)/Math.sin(${conversionBetweenDegRad}($1)).toFixed(2)`
  );

  newStr = newStr.replace(`log(`, `Math.log10(`);
  newStr = newStr.replace(`ln(`, `Math.log(`);
  newStr = newStr.replace("ceil", "Math.ceil");
  newStr = newStr.replace("floor", "Math.floor");
  newStr = newStr
    .replace(/(\d)e(\d)/g, "$1*Math.E*$2")
    .replace(/(\d)e\b/g, "$1*Math.E")
    .replace(/\be(\d)/g, "Math.E*$1")
    .replace(/\be\b/g, "Math.E");
  newStr = newStr.replace(`exp`, `e`);

  return newStr;
}

export function degreeRadianChange(ref) {
  ref.textContent = ref.textContent.trim();

  ref.textContent = ref.textContent === "DEG" ? "RAD" : "DEG";
}
