import {beforeAll, expect, describe, it} from "bun:test";
import { Tsuki } from "../../src/core/tsuki";
import { z } from "zod";

describe("Zod Validation for Request Body", () =>{
    beforeAll(() => {
        const app = new Tsuki();

        app.get('/hello', () => new Response('Hello World!'));
        app.get('/json', (c) => c.json({ message: 'Hello World!' }));

        const userSchema = z.object({
            username: z.string().min(3).max(20),
            email: z.string().email(),
        })

        app.post("/users", userSchema, (c) => {
            return c.json({ username: c.body.username, email: c.body.email }, 201);
        })

        app.serve(3000);

    })

    const BASE_URL = "http://localhost:3000";


    it("handles GET /hello", async () => {
        const res = await fetch(`${BASE_URL}/hello`);
        const text = await res.text();
        expect(text).toEqual("Hello World!");
        expect(res.status).toEqual(200);
    })

    it("handles POST /users with valid body", async() => {
        const res = await fetch(`${BASE_URL}/users`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'spellsaif',
                email: 'saif@example.com'
            })
        })

        const json = await res.json();

        expect(res.status).toEqual(201);
        expect(json).toEqual({username: 'spellsaif', email: 'saif@example.com'})
    })

    it("rejects POST /users with invalid body", async() => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: "spellsaif",
            })
        })
        expect(res.status).toEqual(400);
    })

    it("returns 400 for empty request body", async() => {
        const res = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        expect(res.status).toEqual(400);
    })

    it("returns 404 for unknown routes", async() => {
        const res = await fetch(`${BASE_URL}/invalid`);
        expect(res.status).toEqual(404);
    })




})
