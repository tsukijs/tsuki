import type { HttpMethodType } from "../types";
import type { Context } from "./context";

export type RouteHandler = (c: Context) => Promise<Response> | Response;

interface Route {
    method: HttpMethodType;
    path: string;
    handler: RouteHandler;
}

export class Router {
    private routes: Route[] = [];

    addRoute(method: HttpMethodType, path: string, handler: RouteHandler) {
        this.routes.push({method, path, handler});
    }

    findRoute(method: HttpMethodType, path: string): Route | null  {
        const res = this.routes.find(route => (
            route.method === method && route.path === path
        ))

        return res || null;
    }
} 