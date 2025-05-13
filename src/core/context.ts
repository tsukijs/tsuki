
export interface Context {
    req: Request;
    params: Record<string, string>;
    body?: any;

    text: (body:string, status?: number) => Response;
    json: (body:any, status?: number) => Response;

}