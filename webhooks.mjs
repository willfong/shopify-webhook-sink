import express from "express";
import axios from "axios";

import { query } from "./mariadb.mjs";

const SHOPIFY_APP_API_KEY = process.env.SHOPIFY_APP_API_KEY;
const SHOPIFY_APP_API_SECRET = process.env.SHOPIFY_APP_API_SECRET;
const SHOPIFY_APP_API_SCOPE = process.env.SHOPIFY_APP_API_SCOPE;
const APP_URL = process.env.APP_URL;

export const router = express.Router();

router.get("/authorize", (req, res) => {
	const shop = req.query.shop;
	const redirect_uri = `${APP_URL}/oauth/callback`;
	const url = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_APP_API_KEY}&scope=${SHOPIFY_APP_API_SCOPE}&redirect_uri=${redirect_uri}`;
	res.redirect(url);
});

router.get("/callback", async (req, res) => {
	const code = req.query.code;
	const shop = req.query.shop;
	const url = `https://${shop}/admin/oauth/access_token`;
	const params = {
		client_id: SHOPIFY_APP_API_KEY,
		client_secret: SHOPIFY_APP_API_SECRET,
		code,
	};
	const response = await axios.post(url, params);
	const { access_token, scope } = response.data;
	await saveAuthData(shop, access_token, scope);
	await res.json(response.data);
});

const saveAuthData = async (shop, access_token, scope) => {
	const sql = `INSERT INTO stores (name, token, scope) VALUES (?,?,?)`;
	await query(sql, [shop, access_token, scope]);
};
