
export interface Context {
    req: Request;
    params: Record<string, string>;
    body?: any;
}