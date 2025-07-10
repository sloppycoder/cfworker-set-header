export default {
	async fetch(request: Request, env: { API_KEY: string }): Promise<Response> {
		const apiKey = env.API_KEY;
		console.log(`received API Key: ${apiKey}`);

		const url = new URL(request.url);
		if (url.hostname.startsWith("analyst")) {
			url.hostname = 'fund-analyst-1049830028293.us-central1.run.app';
		} else {
			url.hostname = 'whoami-1049830028293.us-central1.run.app'
		}

		const newHeaders = new Headers(request.headers);
		newHeaders.set('X-API-KEY', apiKey);

		const modifiedRequest = new Request(url.toString(), {
			method: request.method,
			headers: newHeaders,
			body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
			redirect: 'follow',
		});

		return fetch(modifiedRequest);
	},
};