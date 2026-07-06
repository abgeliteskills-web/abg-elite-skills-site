import { CAMP_CAPACITY, countKey } from "./_capacity-config.js";

export async function onRequestGet(context) {
  const { env } = context;
  const result = {};

  for (const [campName, campConfig] of Object.entries(CAMP_CAPACITY)) {
    result[campName] = { closed: Boolean(campConfig.closed) };
    for (const [ageGroup, groupConfig] of Object.entries(campConfig.ageGroups)) {
      const skater = Number(await env.REGISTRATION_KV.get(countKey(campName, ageGroup, "skater"))) || 0;
      const goalie = Number(await env.REGISTRATION_KV.get(countKey(campName, ageGroup, "goalie"))) || 0;
      result[campName][ageGroup] = {
        skater,
        goalie,
        skaterCap: groupConfig.skaterCap,
        goalieCap: groupConfig.goalieCap,
      };
    }
  }

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
