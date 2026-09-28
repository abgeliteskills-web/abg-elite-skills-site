// Runs before every request. Consolidates the www host onto the apex domain so
// search engines see one site instead of two copies, retires the old Wix
// export page, and keeps internal project files (docs, Apps Script source)
// from being served publicly.
const CANONICAL_HOST = "abgeliteskills.com";
const RETIRED_PATHS = new Set(["/old-site", "/old-site.html"]);
const PRIVATE_PATH_PATTERNS = [
  /\.md$/i,
  /^\/google-apps-script\//i,
];

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (RETIRED_PATHS.has(url.pathname)) {
    return Response.redirect(`https://${CANONICAL_HOST}/`, 301);
  }

  if (PRIVATE_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    const notFoundPage = await context.env.ASSETS.fetch(new URL("/404", url));
    return new Response(notFoundPage.body, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return context.next();
}
