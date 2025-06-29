import { ControllerInputType } from "./controller-input.type";

export type TypeRoute = {
  pattern: string;
  method: string;
  middleWare?: (input: ControllerInputType) => Promise<void>[];
  handler: (input: ControllerInputType) => Promise<void>;
};
