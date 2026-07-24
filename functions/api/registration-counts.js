import { CAMP_CAPACITY, countKey } from "./_capacity-config.js";

export async function onRequestGet(context) {
  const { env } = context;
  const result = {};

  for (const [campName, campConfig] of Object.entries(CAMP_CAPACITY)) {
    result[campName] = { closed: Boolean(campConfig.closed) };
    for (const [ageGroup, groupConfig] of Object.entries(campConfig.ageGroups)) {
      const kinds =
        "forwardCap" in groupConfig || "defenseCap" in groupConfig
          ? ["forward", "defense", "goalie"]
          : ["skater", "goalie"];

      const groupResult = {};
      for (const kind of kinds) {
        groupResult[kind] = Number(await env.REGISTRATION_KV.get(countKey(campName, ageGroup, kind))) || 0;
        groupResult[`${kind}Cap`] = groupConfig[`${kind}Cap`];
      }
      result[campName][ageGroup] = groupResult;
    }
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
