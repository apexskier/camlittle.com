const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/248a99f9bda7156fee6c18b3f6346583.jpg";

const ORIGIN_PATH_PREFIXES = [
  "/go-template-validation",
  "/strava-tile-proxy",
  "/.well-known/acme-challenge/",
];

// _headers isn't applied to responses built here, so these mirror its /* rule
// (minus the CSP, which only matters for documents).
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function withHeaders(response, headers) {
  const merged = new Headers(response.headers);
  for (const [name, value] of Object.entries(headers)) {
    merged.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: merged,
  });
}

async function profile(request, env, url) {
  const upstream = await fetch(GRAVATAR_URL + url.search, {
    cf: { cacheEverything: true, cacheTtl: 60 * 60 * 24 },
  });
  if (!upstream.ok) {
    return env.ASSETS.fetch(request);
  }
  const response = withHeaders(upstream, {
    ...SECURITY_HEADERS,
    "Cache-Control": "public, max-age=604800",
  });
  response.headers.delete("Access-Control-Allow-Origin");
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/profile.jpg") {
      return profile(request, env, url);
    }
    if (path === "/typescript.novaextension") {
      return new Response(null, {
        status: 302,
        headers: { Location: "nova://extension/?id=apexskier.typescript" },
      });
    }
    if (ORIGIN_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
