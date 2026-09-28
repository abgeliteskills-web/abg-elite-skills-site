// Converts one of our HTML pages into clean Markdown for AI agents that ask for it
// (Accept: text/markdown). Written for this site's own markup, not arbitrary HTML.

const ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  middot: "·",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  hellip: "…",
};

const decodeEntities = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);

const stripTags = (html) => html.replace(/<[^>]+>/g, "");

const inlineText = (html) => decodeEntities(stripTags(html)).replace(/\s+/g, " ").trim();

// Absolute links using the site's clean paths (/camps, not ./camps.html).
const absoluteUrl = (href, baseUrl) => {
  try {
    const url = new URL(href, baseUrl);
    if (url.hostname === new URL(baseUrl).hostname) {
      url.pathname = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
    return url.toString();
  } catch (error) {
    return href;
  }
};

const convertSection = (html, baseUrl) => {
  let text = html
    // Things an agent can't use: scripts, styles, decoration, media, the signup form fields.
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|svg|video|form|button|noscript)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<(ul|ol|span|div|p)\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/<\/dt>\s*<dd/gi, "</dt><dd")
    // Inline pieces laid out on separate lines by CSS still need a space between them in text.
    .replace(/<\/(strong|b|span|em)>(?=[A-Za-z0-9]|<span)/gi, "</$1> ");

  // Inline links become Markdown links; links that wrap whole cards just keep their text.
  text = text.replace(
    /<a\b[^>]*href="([^"]*)"[^>]*>((?:(?!<\/?(?:h[1-6]|p|div|ul|ol|li)\b)[\s\S])*?)<\/a>/gi,
    (_, href, inner) => {
      const label = inlineText(inner);
      return label ? `[${label}](${absoluteUrl(decodeEntities(href), baseUrl)})` : "";
    }
  );

  text = text
    .replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => `\n\n${"#".repeat(Number(level))} ${inlineText(inner)}\n\n`)
    .replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => `\n\n> ${inlineText(inner)}\n\n`)
    .replace(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, (_, inner) => `\n\n**${inlineText(inner)}**\n\n`)
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, inner) => `\n- ${inlineText(inner)}`)
    .replace(/<dt\b[^>]*>([\s\S]*?)<\/dt>/gi, (_, inner) => `\n- **${inlineText(inner)}**`)
    .replace(/<dd\b[^>]*>([\s\S]*?)<\/dd>/gi, (_, inner) => `: ${inlineText(inner)}`)
    .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner) => `**${inlineText(inner)}**`)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|figure|figcaption|ul|ol|dl|details|header)>/gi, "\n\n");

  return decodeEntities(stripTags(text))
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^(- .*)\n\n+(?=- )/gm, "$1\n")
    .trim();
};

export const htmlToMarkdown = (html, pageUrl) => {
  const title = inlineText(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || "");
  const description = decodeEntities(
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] || ""
  );
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || "";
  const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] || "";

  return [
    `# ${title}`,
    description ? `> ${description}` : "",
    `Source: ${pageUrl}`,
    convertSection(main, pageUrl),
    "---",
    convertSection(footer, pageUrl),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
};
