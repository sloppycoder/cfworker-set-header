const HOSTMAP: Map<string, string> = new Map([
	['analyst-run.vino9.net', 'fund-analyst-1049830028293.us-central1.run.app'],
	['whoami-run.vino9.net', 'whoami-1049830028293.us-central1.run.app'],
	['-run.vino9.net', 'whoami-1049830028293.us-central1.run.app'], // local testing only
]);

export default {
	async fetch(request: Request, env: { API_KEY: string }): Promise<Response> {
		const url = new URL(request.url);
		const oldHost = url.hostname;

		if (!HOSTMAP.has(oldHost)) {
			console.log(`no matching entry for ${oldHost}`);
			return fetch(request);
		}

		url.hostname = HOSTMAP.get(url.hostname) ?? url.hostname;
		console.log(`mapped ${oldHost} to ${url.hostname}`);

		const apiKey = env.API_KEY;
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