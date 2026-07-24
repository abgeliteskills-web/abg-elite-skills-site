import { CAMP_CAPACITY, countKey } from "./_capacity-config.js";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw5cNw0SPkC8mxGAQLUWYoou3wrYJqTeEadMwzsZVa6JLnE_r-XqUDlq3JyDsjrS2ftoQ/exec";

const jsonResponse = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function onRequestPost(context) {
  const { request, env } = context;

  let payload;
  try {
    payload = JSON.parse(await request.text());
  } catch (error) {
    return jsonResponse({ ok: false, error: "Invalid registration request." }, 400);
  }

  const position = String(payload.playerPosition || "").toLowerCase();
  const isGoalie = position.includes("goalie");
  const isDefenseman = position.includes("defence") || position.includes("defense");
  const camps = Array.isArray(payload.camps) ? payload.camps : [];

  // Check every guarded camp in this submission before reserving anything,
  // so a multi-camp submission never partially succeeds.
  const reservations = [];
  for (const camp of camps) {
    const campConfig = CAMP_CAPACITY[camp.campName];

    if (campConfig?.closed) {
      return jsonResponse({
        ok: false,
        error: `${camp.campName} is sold out for summer 2026 — thank you for the incredible response! Email abgeliteskills@gmail.com to be added to next year's early access list.`,
      });
    }

    const config = campConfig?.ageGroups[camp.ageGroup];
    if (!config) {
      continue; // not a guarded camp/age group, no cap enforced
    }

    let kind;
    let cap;
    if (isGoalie) {
      kind = "goalie";
      cap = config.goalieCap;
    } else if ("forwardCap" in config || "defenseCap" in config) {
      kind = isDefenseman ? "defense" : "forward";
      cap = isDefenseman ? config.defenseCap : config.forwardCap;
    } else {
      kind = "skater";
      cap = config.skaterCap;
    }

    const key = countKey(camp.campName, camp.ageGroup, kind);
    const current = Number(await env.REGISTRATION_KV.get(key)) || 0;

    if (current >= cap) {
      return jsonResponse({
        ok: false,
        error: `${camp.campName} (${camp.ageGroup}) is full for ${kind}s right now. Please email abgeliteskills@gmail.com to be added to the waitlist.`,
      });
    }

    reservations.push({ key, next: current + 1 });
  }

  for (const reservation of reservations) {
    await env.REGISTRATION_KV.put(reservation.key, String(reservation.next));
  }

  try {
    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      await rollback(env, reservations);
      return jsonResponse({ ok: false, error: "Registration could not be submitted." }, 502);
    }

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    await rollback(env, reservations);
    return jsonResponse({ ok: false, error: "Registration could not be submitted." }, 502);
  }
}

async function rollback(env, reservations) {
  for (const reservation of reservations) {
    await env.REGISTRATION_KV.put(reservation.key, String(reservation.next - 1));
  }
}
