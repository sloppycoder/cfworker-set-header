from js import Headers
from workers import handler, fetch
import workers
from urllib.parse import urlparse

HOSTMAP = {
    "analyst-run.vino9.net": "fund-analyst-1049830028293.us-central1.run.app",
    "whoami-run.vino9.net": "whoami-1049830028293.us-central1.run.app",
    "-run.vino9.net":"whoami-1049830028293.us-central1.run.app", # local testing only
}

def _headers_to_dict(headers):
    result = {}
    for name, value in headers.entries():
        result[name] = value
    return result

@handler
async def on_fetch(request, env):
    print(dir(workers))

    url = urlparse(request.url)
    orig_host = url.hostname
    print(f"orig_host is {orig_host}")

    if orig_host not in HOSTMAP:
        print(f"skipping host {url.hostname}")
        return await fetch(request)

    new_host = HOSTMAP[orig_host]
    new_url = request.url.replace(orig_host, new_host)
    print(f"mapping {orig_host} to {new_host}, new_url={new_url}")

    # new_headers = Headers.new(request.headers)
    # new_headers.set("X-API-KEY", env.API_KEY)
    # print(f"received API Key: {env.API_KEY}")

    return await fetch(new_url,
        method=request.method,
        headers={"API-KEY": "abc"},
        body=request.body if request.method not in ["GET", "HEAD"] else None,
        redirect="follow"
    )
