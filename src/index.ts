export default {
	async fetch(request, env, ctx): Promise<Response> {
		const allApiKeys = JSON.parse(env.ALL_API_KEYS);
		const api_key = allApiKeys["fund_analyst"];
		
		console.log('API Key:', api_key);

		const requestWithApiKey = new Request(request);
		requestWithApiKey.headers.set('X-API-KEY', api_key);
		return fetch(requestWithApiKey);
	},
} satisfies ExportedHandler<Env>;