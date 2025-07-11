from js import Headers
from workers import fetch
from urllib.parse import urlparse

HOSTMAP = {
    "analyst-run.vino9.net": "fund-analyst-1049830028293.us-central1.run.app",
    "whoami-run.vino9.net": "whoami-1049830028293.us-central1.run.app",
    "-run.vino9.net":"whoami-1049830028293.us-central1.run.app", # local testing only
}


async def on_fetch(request, env):
    url = urlparse(request.url)
    orig_host = url.hostname

    if orig_host not in HOSTMAP:
        print(f"skipping host {url.hostname}")
        return await fetch(request)

    new_host = HOSTMAP[orig_host]
    new_url = url._replace(netloc=new_host).geturl()
    print(f"mapping {orig_host} to {new_host}, new_url={new_url}")


    new_headers = Headers.new(request.headers)
    new_headers.set("X-API-KEY", env.API_KEY)

    return await fetch(new_url,
        method=request.method,
        headers=new_headers.to_py(),
        body=request.body if request.method not in ["GET", "HEAD"] else None,
        redirect="follow"
    )
