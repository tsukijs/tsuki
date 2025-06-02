import type { RouteHandler } from "./handler";
import type { HttpMethodType } from "./http-method";

export interface Route {
  method: HttpMethodType;
  path: string;
  paramNames: string[];
  handler: RouteHandler;

}