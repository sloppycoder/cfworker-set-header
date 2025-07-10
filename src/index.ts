export default {
	async fetch(request: Request): Promise<Response> {
		const cloudRunHostname = 'fund-analyst-1049830028293.us-central1.run.app';
		const apiKey = 'n5aNKscfqByA6WE9xLGz7zBf7VzRuDQI';

		const url = new URL(request.url);
		url.hostname = cloudRunHostname;

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