from js import Request, Response, Headers, URL, fetch


async def on_fetch(request, env):
    api_key = env.API_KEY
    print(f"received API Key: {api_key}")
    
    url = URL.new(request.url)
    if url.hostname.startswith("analyst"):
        url.hostname = 'fund-analyst-1049830028293.us-central1.run.app'
    else:
        url.hostname = 'whoami-1049830028293.us-central1.run.app'
    
    new_headers = Headers.new(request.headers)
    new_headers.set('X-API-KEY', api_key)
    
    body = None if request.method in ['GET', 'HEAD'] else request.body
    
    modified_request = Request.new(str(url), {
        'method': request.method,
        'headers': new_headers,
        'body': body,
        'redirect': 'follow',
    })
    
    return await fetch(modified_request)