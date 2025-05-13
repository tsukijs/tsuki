import type { HttpMethodType } from '../types';
import type { Context } from './context';
import { Router, type RouteHandler } from './router';

export class Tsuki {
  private router: Router = new Router();

  private createContext(req: Request): Context {
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
    const ctx: Context = { req, params: {}, body: null, text, json };

    return ctx;
  }

  get(path: string, handler: RouteHandler) {
    this.router.addRoute('GET', path, handler);
    return this;
  }

  //Running server
  serve(port: number) {
    //Bun server
    Bun.serve({
      port,
      fetch: (req) => {
        const url = new URL(req.url);
        const route = this.router.findRoute(
          req.method as HttpMethodType,
          url.pathname
        );
        console.log('reached in serve: ', route);

        //If router is found then
        if (route) {
          const ctx = this.createContext(req);

          return route.handler(ctx);
        }
        return new Response('Not Found', { status: 404 });
      },
    });

    console.log(`Server running on http://localhost:${port}`);
  }
}
