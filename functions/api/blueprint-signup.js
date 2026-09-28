// Forwards D1 Blueprint signups to the Apps Script web app that logs the
// lead and emails the PDF. See google-apps-script/blueprint-signup.gs for
// that script and deployment instructions.
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxMWHcyJ2VlzPHlUuryYcGL0UTyhGxbMYpZYOJrrIu_EcW68TIC3wZOcsyepRSv3gYC9w/exec";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost(context) {
  const { request } = context;

  let payload;
  try {
    payload = JSON.parse(await request.text());
  } catch (error) {
    return jsonResponse({ ok: false, error: "Invalid request." }, 400);
  }

  const email = String(payload.email || "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return jsonResponse({ ok: false, error: "A valid email address is required." }, 400);
  }

  if (!APPS_SCRIPT_URL.startsWith("https://")) {
    return jsonResponse(
      {
        ok: false,
        error:
          "The D1 Blueprint signup isn't wired up yet. Email abgeliteskills@gmail.com and we'll send it directly.",
      },
      503
    );
  }

  try {
    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        parentName: String(payload.parentName || "").trim(),
        email,
        playerBirthYear: String(payload.playerBirthYear || "").trim(),
      }),
    });

    const text = await upstream.text();

    // If Apps Script throws (Drive or Gmail hiccup) it answers with an HTML error page
    // instead of JSON, so only report success when the script confirmed it.
    let result = null;
    try {
      result = JSON.parse(text);
    } catch (error) {
      result = null;
    }

    if (!upstream.ok || !result?.ok) {
      return jsonResponse(
        {
          ok: false,
          error:
            "The D1 Blueprint could not be sent right now. Email abgeliteskills@gmail.com and we'll send it directly.",
        },
        502
      );
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: "The D1 Blueprint could not be sent right now." }, 502);
  }
}
