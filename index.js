const UrlPrefix = "cfgasw"; // pls replace with random  string
const EndPointScramble = "gallect"; // pls replace with random string
const EndPoint = "collect";
const GAHostname = "www.google-analytics.com";

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event));
})

async function handleRequest(event) {
    //script file request or data to proxy to google
    if (new URL(event.request.url).pathname === "/" + UrlPrefix + ".js") {
        return await getScript(event);
    } else {
        return await proxy(event);
    }
}

async function getScript(event) {
    let cache = caches.default;
    let response = await cache.match(event.request);
    if (!response) {
        let scriptRequest = await fetch("https://www.google-analytics.com/analytics.js");
        let scriptCode = await (scriptRequest.clone()).text();
        let scrambledCode = replace(scriptCode, GAHostname, '"+location.host+"/' + UrlPrefix);
        scrambledCode = replace(scrambledCode, EndPoint, EndPointScramble);
        response = new Response(scrambledCode, scriptRequest);
        event.waitUntil(cache.put(event.request, response.clone()));
    }
    return response;
}

async function proxy(event) {
    let url = new URL(event.request.url);
    //removing prefix http://example.com/PREFIX/Scramble?v => http://example.com/Scramble?v
    url.pathname = url.pathname.replace("/" + UrlPrefix, '');
    //unscramble => http://example.com/Scramble?v => http://example.com/collect?v
    url.pathname = url.pathname.replace(EndPointScramble, EndPoint);
    url.hostname = GAHostname;
    url.searchParams.set('uip', event.request.headers.get('CF-Connecting-IP'));
    let response = await fetch(url, event.request);
    return response;
}

function replace(text, find, r) {
    text = text.replace(new RegExp(find, 'g'), r);
    return text;
}