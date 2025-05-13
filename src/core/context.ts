export interface Context<T = unknown> {
  req: Request;
  params: Record<string, string>;
  body?: T;

  text: (body: string, status?: number) => Response;
  json: <R>(body: R, status?: number) => Response;
}
