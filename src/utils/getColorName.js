import namer from "color-namer";

export function getColorName(hexCode = "") {
  if (!hexCode) return "";
  let hex = hexCode.trim();

  if (/^#?[0-9A-Fa-f]{3}$/.test(hex)) {
    hex =
      "#" +
      hex
        .replace("#", "")
        .split("")
        .map((c) => c + c)
        .join("");
  }

  if (/^#?[0-9A-Fa-f]{4}$/.test(hex)) {
    const v = hex.replace("#", "").split("");
    const r = parseInt(v[0] + v[0], 16);
    const g = parseInt(v[1] + v[1], 16);
    const b = parseInt(v[2] + v[2], 16);
    hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
  const result = namer(hex, { pick: ["ntc"] });
  return result.ntc[0].name;
}
