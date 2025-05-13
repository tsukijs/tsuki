import { Tsuki } from '../src/core/tsuki';

const app = new Tsuki();
app.get('/hello', (c) => new Response('Hello World!'));
app.get('/json', (c) => c.json({ message: 'Hello World!' }));
app.get('/text', (c) => c.text('this is a text response'));
app.serve(3000);
