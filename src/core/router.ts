import type { Params } from './types/params';
import type { HttpMethodType } from './types/http-method';
import type { RouteHandler } from './types/handler';
import type { Route } from './types/route';
import type { TrieNode } from './types/trie-node';


export class Router {

  private root: TrieNode = {
    segment: '',
    children: new Map(),
    isParam: false 
  }


  //Implementation of addRoute
   addRoute (method: HttpMethodType, path: string, handler: RouteHandler): Route{

      const segments = path.split('/').filter(Boolean);
      let node = this.root;

      for (const segment of segments) {
        const isParam = segment.startsWith(':');
        const key = isParam ? ':param' : segment
        const paramName = isParam ? segment.slice(1) : undefined;

        let child = node.children.get(key);

        if(!child) {
          child = {
            segment,
            children: new Map(),
            isParam,
            paramName
          }
          node.children.set(key, child);
        }

        node = child;
      }

      // Store handler with method as suffix (e.g., '/users/:id@GET')
      node.handler = handler;
  }
  

  findRoute(method: HttpMethodType, path: string): {handler?: RouteHandler; params: Params} {
    const segments = path.split('/').filter(Boolean);
    const params: Params = {}

    const search = (
      node: TrieNode,
      index: number
    ): { handler?: RouteHandler; params: Params } | null => {
      if (index === segments.length) {
        return node.handler ? { handler: node.handler, params } : null;
      } 
      
      const segment = segments[index];
      // Try exact match
      const exactChild = node.children.get(segment);
      if (exactChild) {
        const result = search(exactChild, index + 1);
        if (result) return result;
      }


      // Try dynamic match
      const paramChild = node.children.get(':param');
      if (paramChild && paramChild.paramName) {
        params[paramChild.paramName] = segment;
        const result = search(paramChild, index + 1);
        if (result) return result;
      }

      return null;
  }

    const result = search(this.root, 0);
    return result || { params: {} };

}

}
