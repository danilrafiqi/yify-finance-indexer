import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { cors } from "hono/cors";

const app = new Hono();

// Enable CORS for frontend
app.use("/*", cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
