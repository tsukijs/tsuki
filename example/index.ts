import { Tsuki } from '../src/tsuki';


const app = new Tsuki();
app.get('/hello', () => new Response('Hello World!'));
app.get('/json', (c) => c.json({ message: 'Hello World!' }));
app.get('/text', (c) => c.text('this is a text response'));
app.get('/pokemon/:name', (c) => {
  console.log('name:', c.params.name);
  
  return c.json({ message: `Pokemon name: ${c.params.name}` });
})


// GET /user/:id
app.get('/user/:name/likes/:food', (c) => {
  return c.json({ message: {name: c.param('name'), food: c.param('food')} });
});

app.serve(3000);
