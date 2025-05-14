import type { z, ZodObject, ZodRawShape } from 'zod';
import type { HttpMethodType } from '../types';
import type { Context } from './context';
import { Router, type RouteHandler } from './router';

export class Tsuki {
  private router: Router = new Router();

  private createContext<T = unknown>(req: Request): Context<T> {
    const text = (body: string, status = 200) => {
      return new Response(body, {
        status,
        headers: { 'Content-Type': 'text/plain' },
      });
    };

    const json = <R>(body: R, status = 200) => {
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const ctx = { req, params: {}, body: null, text, json };

    return ctx as Context<T>;
  }

  get(path: string, handler: RouteHandler) {
    this.router.addRoute('GET', path, handler);
    return this;
  }

  post<T extends ZodRawShape>(path: string, schema: ZodObject<T>,handler: RouteHandler<z.infer<ZodObject<T>>>) {
    this.router.addRoute('POST', path, schema, handler);
    return this;
  }

  put<T extends ZodRawShape>(path: string, schema: ZodObject<T>,handler: RouteHandler<z.infer<ZodObject<T>>>) {
    this.router.addRoute('PUT', path, schema, handler);
    return this;
  }

   patch<T extends ZodRawShape>(path: string, schema: ZodObject<T>,handler: RouteHandler<z.infer<ZodObject<T>>>) {
    this.router.addRoute('PATCH', path, schema, handler);
    return this;
  }

  delete(path: string, handler: RouteHandler) {
    this.router.addRoute('DELETE', path, handler);
    return this;
  }



  //Running server
  serve(port: number) {
    //Bun server
    Bun.serve({
      port,
      fetch: async (req) => {
        const url = new URL(req.url);
        const route = this.router.findRoute(
          req.method as HttpMethodType,
          url.pathname
        );
        // console.log('reached in serve: ', route);

        //If router is found then
        if (route) {
          const ctx = this.createContext(req);

          //If route has schema then validate the body
          if(route.schema)  {
            try {
              if(!req.body) {
                return new Response('Invalid request body', { status: 400 });
              }
              const body = await req.json();
              console.log('body: ', body);
              ctx.body = route.schema.parse(body);
              
            } catch(err) {
              console.error('Validation error: ', err);
              return new Response('Invalid request body', { status: 400 });
            }
          }

       
          return route.handler(ctx as Context<typeof ctx.body>);
        }
        return new Response('Not Found', { status: 404 });
      },
    });

    console.log(`Server running on http://localhost:${port}`);
  }
}
