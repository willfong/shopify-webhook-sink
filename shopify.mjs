export const parseHeaders = (rawHeaders) => {
	return {
		topic: rawHeaders["x-shopify-topic"],
		shopDomain: rawHeaders["x-shopify-shop-domain"],
		hmacSha256: rawHeaders["x-shopify-hmac-sha256"],
		webhookId: rawHeaders["x-shopify-webhook-id"],
	};
};
