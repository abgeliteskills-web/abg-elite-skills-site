// Shared capacity config for the registration capacity guard.
// Add more camps here later by adding another entry with the same shape.
export const CAMP_CAPACITY = {
  "Total Skill Integration": {
    ageGroups: {
      "2011-2013": { skaterCap: 23, goalieCap: 3 },
      "2014-2016": { skaterCap: 23, goalieCap: 3 },
      "2017-2019": { skaterCap: 18, goalieCap: 3 },
    },
  },
};

export const countKey = (campName, ageGroup, kind) =>
  `count:${campName}:${ageGroup}:${kind}`;
