import { Tsuki } from "../src/core/tsuki";


const app = new Tsuki();
app.get('/hello', (ctx)=> new Response('Hello World!'));
app.serve(3000);