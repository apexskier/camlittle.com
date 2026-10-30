const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/248a99f9bda7156fee6c18b3f6346583.jpg";

const ORIGIN_PATH_PREFIXES = [
  "/go-template-validation",
  "/strava-tile-proxy",
  "/.well-known/acme-challenge/",
];

// _headers isn't applied to responses built here, so these mirror its /* rule.
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

const SECRET_SHARING_HEADERS = {
  "Referrer-Policy": "no-referrer-when-downgrade",
  "Permissions-Policy":
    "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
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

function cspNonce() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// The app's own <meta> CSP references __CSP_NONCE__, which must be unique per
// response, so HTML here is never cacheable.
async function secretSharing(request, env) {
  const asset = await env.ASSETS.fetch(request);
  const headers = { ...SECURITY_HEADERS, ...SECRET_SHARING_HEADERS };
  let response;
  if (asset.headers.get("Content-Type")?.startsWith("text/html")) {
    const body = (await asset.text()).replaceAll("__CSP_NONCE__", cspNonce());
    response = withHeaders(new Response(body, asset), {
      ...headers,
      "Cache-Control": "no-store",
    });
    response.headers.delete("ETag");
    response.headers.delete("Content-Length");
  } else {
    response = withHeaders(asset, headers);
  }
  // The site-wide CSP would block the app's nonce-based styles.
  response.headers.delete("Content-Security-Policy");
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
    if (path === "/secret-sharing" || path.startsWith("/secret-sharing/")) {
      return secretSharing(request, env);
    }
    if (ORIGIN_PATH_PREFIXES.some((prefix) => path.startsWith(prefix))) {
      return fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};
