# Google Analytics shield - Cloudflare worker
simple cloudflare worker to protect google analytics from being blocked by ad blockers(it can be anywhere around 5 to 30 percent of the users)


It works by proxy the google analytics script file and endpoint url.

right now it support only the analytics.js tracking and the `https://www.google-analytics.com/*collect` endpoint
there is other urls which not proxied right now(which will get blocked), in my case I dont need them, like:
* ampcid.google.com
* stats.g.doubleclick.net

## How to install:
* change UrlPrefix and EndPointScramble Parameters to random string, a common ads\analytics related words will get blocked
* make your worker route to url matches `http://example.com/UrlPrefix*`
* change your site google analytics script from `https://www.google-analytics.com/analytics.js` to `/UrlPrefix.js`

** `(change UrlPrefix to the value you used in the worker parameter)`

## Warnings:
* pay attention to the gdpr law
* if you have millions of requests I am  not 100% sure its good idea to use it as google can rate limit the cloudflare worker ips, as the ips are shared between all cloudflare accounts so its good idea to reconsider it\ask google about it
* make sure to rescramble the urls from time to time

### todo:
- [ ] log failed requests
- [ ] proxy all the urls needed for analytics(?)
- [ ] support the new gtag.js script
- [ ] auto scrambled the endpoint from time to time