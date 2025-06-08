import { isUndefined } from "./is-undefined";

export const isNotEmptyString = <T>(input: T): boolean => {
  return !isUndefined(input) && typeof input === "string" && input.length > 0;
};
