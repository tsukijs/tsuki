import type { Context } from "./context";

export type RouteHandler = (c: Context) => Promise<Response> | Response;
