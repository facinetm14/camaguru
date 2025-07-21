import { Err, Ok, Result } from "./result";

export const parseRequestBodyAsJson = (
  body: any
): Result<any, "BAD_REQUEST"> => {
  try {
    const parsedBody = JSON.parse(body);
    return Ok(parsedBody);
  } catch (error) {
    console.error(error);
    return Err("BAD_REQUEST");
  }
};
