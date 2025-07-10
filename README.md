# Cloudflare worker to alter header

## Problem statement
[Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/) is a simple way to front your own web application or API, typically much easier to setup and it has fairly generation free tier.

However, sometimes the protected application relies on certain HTTP header to function, e.g. [Google Cloud Run](https://cloud.google.com/run?hl=en#build-apps-or-websites-quickly-on-a-fully-managed-platform) relies on the  ```Host``` header to dispatch request to corresponding containers. In this case none of the static rules in Cloudflare allow modifying the ```Host``` header.

## Solution
This worker allows modification to any header so that situations like Cloud Run can be fronted by Cloudflare Zero Trust.

+--------+         +--------------------+                      +------------+
|        |         |        +--------+  |  Host:<gcp url>      |            |
| Client | ------> |        | this   |  | -------------------->|  Cloud Run |
|        |         |        | worker |  |  X-API-KEY: secret   |            |
+--------+         |        +--------+  |                      +------------+
                   |                    |
                   |                    |
                   |    Cloudflare      |
                   |                    |
                   +--------------------+


## How to use it
1. Deploy app in Cloud Run with ```allow-unauthenticated```. It is probably desirable to modify it to check for certain cloudflare header or custom header like X-API-KEY for some basic protection. This is not strictly neccessary but without any protect using Cloudflare Zero Trust seems pointless.

2. In Cloudflare Zero Trust, create a new applicat of type ```self hosted```, setup the public domain name, e.g. ```app.example.com```, leave private hostname and private IP blank. Add policy to restrict access.

3. Create DNS record for ```app.example.com``` of type ```CNAME``` pointing to URL of the cloud run app, e.g. ```https://whoami-10498300.us-east1.run.app```

4. Update ```src/index.ts```, update the hostname accordingly, then deploy the worker by running ```npm run deploy```

5. Go to the working settings, under ```Domains & Routes```, add a new route that points to ```app.example.com/*```


