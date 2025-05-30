import { z } from 'zod';
import { Tsuki } from '../src/core/tsuki';
import type { Context } from '../src/core/context';

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string().email(),
  username: z.string().min(3).max(20),
})

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(20),
})

const loginHandler = (c:Context<z.infer<typeof loginSchema>>) => {
  return c.json({ message: 'Login successful!', data: c.body });
}

const app = new Tsuki();
app.get('/hello', () => new Response('Hello World!'));
app.get('/json', (c) => c.json({ message: 'Hello World!' }));
app.get('/text', (c) => c.text('this is a text response'));
app.post('/user', userSchema, (c) => {
    console.log('user data: ', c.body);
    
    return c.json({ message: 'User created successfully!', data: c.body });
})

app.post('/login', loginSchema, loginHandler);

app.serve(3000);
