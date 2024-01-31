export type Valid =
  | { type: "num"; num: number }
  | { type: "range"; from: number; to: number }
  | { type: "enum"; num: number; str: string };

const validateSingle = (rule: Valid, value: string | number): number | undefined => {
  if (rule.type === "num") {
    if (typeof value === "number" && rule.num === value) return value;
  }
  if (rule.type === "range") {
    if (typeof value === "number" && rule.from <= value && value < rule.to) return value;
  }
  if (rule.type === "enum") {
    if (typeof value === "string" && rule.str === value) return rule.num;
    if (typeof value === "number" && rule.num) return value;
  }
};

export const validator = (rule: Valid[], value: string | number) => {
  for (const valid of rule) {
    const ret = validateSingle(valid, value);
    if (ret) return ret;
  }
  return undefined;
};

export const useValidator = (rule: Valid[]) => (value: string | number) => validator(rule, value);
