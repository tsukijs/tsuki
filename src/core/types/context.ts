
export interface Context {
  req: Request;
  params: any;
  body: any;

  text: (body: string, status?: number) => Response;
  json: (body: any, status?: number) => Response;
  param: (key: string) => string | undefined;  //Access Params
}
