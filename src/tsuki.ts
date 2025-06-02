import type { Params } from './core/types/params';
import type { Context } from './core/types/context';
import type { HttpMethodType } from './core/types/http-method';
import { Router } from './core/router';
import type { RouteHandler } from './core/types/handler';

export class Tsuki {
  private router: Router = new Router();

  private createContext(req: Request, params: Params): Context {
    const text = (body: string, status = 200) => {
      return new Response(body, {
        status,
        headers: { 'Content-Type': 'text/plain' },
      });
    };

    const json = (body: any, status = 200) => {
      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const ctx = { req, params, body: null, text, json, param: (key: string) => params[key] };

    return ctx as Context;
  }

  get(
    path: string,
    handler: RouteHandler,
  ) {

    this.router.addRoute('GET', path,  handler);
    return this;
  }

  post(
    path: string,
    handler: RouteHandler,
  ) {
    this.router.addRoute('POST', path, handler );
    return this;
  }

  


  private async handleRequest(req: Request): Promise<Response> {
      const url = new URL(req.url);
        const {handler, params} = this.router.findRoute(
          req.method as HttpMethodType,
          url.pathname
        );

        //If router is found then
        if (handler) {
          const ctx = this.createContext(req, params);
       
          return handler(ctx);
        }
        return new Response('Not Found', { status: 404 });
  }

  //Running server
  serve(port: number) {
    //Bun server
    Bun.serve({
      port,
      fetch: (req) => this.handleRequest(req),
    });

    console.log(`Server running on http://localhost:${port}`);
  }
}
