// Runs before every request. Consolidates the www host onto the apex domain so
// search engines see one site instead of two copies, retires the old Wix
// export page, keeps internal project files (docs, Apps Script source) from
// being served publicly, and serves Markdown versions of pages to AI agents.
import { htmlToMarkdown } from "./_markdown.js";

const CANONICAL_HOST = "abgeliteskills.com";
const RETIRED_PATHS = new Set(["/old-site", "/old-site.html"]);
const PRIVATE_PATH_PATTERNS = [
  /\.md$/i,
  /^\/google-apps-script\//i,
];

// Public pages that also have a Markdown version at /<page>.md.
const MARKDOWN_PAGES = new Set(["index", "camps", "coaches", "development", "about", "register", "d1-blueprint"]);

const wantsMarkdown = (request) => (request.headers.get("Accept") || "").includes("text/markdown");

const markdownResponse = (markdown, canonicalUrl) =>
  new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Link": `<${canonicalUrl}>; rel="canonical"`,
      "Vary": "Accept",
      "Cache-Control": "public, max-age=300",
    },
  });

// Fetches the HTML page and converts it; falls back to the HTML if anything goes wrong.
const serveMarkdown = async (context, pagePath, canonicalUrl) => {
  const htmlResponse = await context.env.ASSETS.fetch(new URL(pagePath, canonicalUrl));
  const html = await htmlResponse.text();

  if (!htmlResponse.ok || !(htmlResponse.headers.get("Content-Type") || "").includes("text/html")) {
    return new Response(html, htmlResponse);
  }

  try {
    return markdownResponse(htmlToMarkdown(html, canonicalUrl), canonicalUrl);
  } catch (error) {
    return new Response(html, htmlResponse);
  }
};

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (url.hostname === `www.${CANONICAL_HOST}`) {
    url.hostname = CANONICAL_HOST;
    return Response.redirect(url.toString(), 301);
  }

  if (RETIRED_PATHS.has(url.pathname)) {
    return Response.redirect(`https://${CANONICAL_HOST}/`, 301);
  }

  // /camps.md, /coaches.md, ... : the Markdown version of that page.
  const markdownPage = url.pathname.match(/^\/([a-z0-9-]+)\.md$/i)?.[1]?.toLowerCase();
  if (request.method === "GET" && markdownPage && MARKDOWN_PAGES.has(markdownPage)) {
    const pagePath = markdownPage === "index" ? "/" : `/${markdownPage}`;
    return serveMarkdown(context, pagePath, `https://${CANONICAL_HOST}${pagePath}`);
  }

  if (PRIVATE_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    const notFoundPage = await context.env.ASSETS.fetch(new URL("/404", url));
    return new Response(notFoundPage.body, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Content negotiation: agents that ask for text/markdown get the Markdown version of the page.
  if (request.method === "GET" && wantsMarkdown(request)) {
    const pageName = url.pathname.replace(/^\/|\/$/g, "").replace(/\.html$/, "") || "index";
    if (MARKDOWN_PAGES.has(pageName)) {
      return serveMarkdown(context, url.pathname, `https://${CANONICAL_HOST}${url.pathname}`);
    }
  }

  return context.next();
}
