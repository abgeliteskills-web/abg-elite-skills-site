// Shared capacity config for the registration capacity guard.
// Add more camps here later by adding another entry with the same shape.
export const CAMP_CAPACITY = {
  "Total Skill Integration": {
    closed: true, // registration closed for summer 2026, sold out
    ageGroups: {
      "2011-2013": { skaterCap: 23, goalieCap: 3 },
      "2014-2016": { skaterCap: 23, goalieCap: 3 },
      "2017-2019": { skaterCap: 18, goalieCap: 3 },
    },
  },
  "Body Contact Prep Camp": {
    closed: true, // registration closed for summer 2026, sold out
    ageGroups: {},
  },
  "Position-Specific Clinic": {
    closed: true, // registration closed for summer 2026, sold out
    ageGroups: {},
  },
  "High-Performance Prep": {
    // Oldest group (2011-2013) is closed; the two younger groups are open
    // with no cap.
    ageGroups: {
      "2011-2013": { skaterCap: 0, goalieCap: 0 },
    },
  },
};

export const countKey = (campName, ageGroup, kind) =>
  `count:${campName}:${ageGroup}:${kind}`;
