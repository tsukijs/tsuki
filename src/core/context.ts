export interface Context<B = unknown> {
  req: Request;
  params: Record<string, string>;
  body: B;

  text: (body: string, status?: number) => Response;
  json: <R>(body: R, status?: number) => Response;
}
