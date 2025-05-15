import type {z, ZodObject, ZodRawShape } from 'zod';
import type { HttpMethodType } from '../types';
import type { Context } from './context';

export type RouteHandler<B = unknown> = (c: Context<B>) => Promise<Response> | Response;




interface Route<B = unknown, T extends ZodRawShape = ZodRawShape> {
  method: HttpMethodType;
  path: string;
  handler: RouteHandler<B>;
  schema?: ZodObject<T>;

}

export class Router {
  private routes: Route[] = [];

  // Route without schema
  addRoute(
    method: HttpMethodType,
    path: string,
    handler: RouteHandler
  ): void;

  //Route with Schema (POST, PUT, PATCH)
  addRoute<T extends ZodRawShape>(
    method: HttpMethodType,
    path: string,
    schema: ZodObject<T>,
    handler: RouteHandler<z.infer<ZodObject<T>>>
  ): void;



  //Implementation of addRoute
  addRoute<T extends ZodRawShape> (
    method: HttpMethodType,
    path: string,
    schemaOrHandler: ZodObject<T> | RouteHandler,
    handler?: RouteHandler<z.infer<ZodObject<T>>>

  ):void {
    const route: Route = {
      method,
      path,
      handler: (handler || schemaOrHandler) as RouteHandler,
      schema: handler ? (schemaOrHandler as ZodObject<T>): undefined
    };

    this.routes.push(route);
  }
  

  findRoute(method: HttpMethodType, path: string): Route | null {
    const res = this.routes.find(
      (route) => route.method === method && route.path === path
    );

    return res || null;
  }
}
