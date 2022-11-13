import express from "express";
import morgan from "morgan";
import { router as OAUTH } from "./oauth.mjs";
import * as SHOPIFY from "./shopify.mjs";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());
app.use(morgan("combined"));

app.use("/oauth", OAUTH);

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.post("/webhooks", (req, res) => {
	const { topic, shopDomain } = SHOPIFY.parseHeaders(req.headers);
	console.log(`[${shopDomain}] ${topic}`);
	console.log(req.body);
	res.send("kthxbye");
});

app.get("/error", (req, res) => {
	throw new Error("This error was intentionally thrown");
});

app.use((req, res) => {
	res.status(404).send("404 - File not found");
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(500).send("500 - Internal server error");
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
