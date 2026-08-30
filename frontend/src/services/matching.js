import { OPPORTUNITIES } from '../data/opportunities.js';

// Simple prototype scoring system — not a production ML recommender.
export function scoreOpportunity(opp, profile) {
  if (!profile) return 0;
  let score = 0;
  let total = 0;

  // Category / "looking for" match
  total += 35;
  if (profile.lookingFor) {
    const lookingForCategoryMap = {
      education: 'scholarship',
      job: 'job',
      skill: 'skill',
      government: 'government',
      financial: 'financial',
      internship: 'internship',
    };
    if (lookingForCategoryMap[profile.lookingFor] === opp.category) score += 35;
  }

  // Education level match
  total += 25;
  if (profile.education && opp.education.includes(profile.education)) score += 25;

  // Interest match
  total += 25;
  if (profile.interest && opp.interests.includes(profile.interest)) score += 25;

  // Location match
  total += 15;
  if (profile.state) {
    if (opp.location.state === 'All India') score += 10;
    else if (opp.location.state.toLowerCase() === profile.state.toLowerCase()) score += 15;
  }

  return Math.round((score / total) * 100);
}

export function getMatchedOpportunities(profile, { minScore = 0 } = {}) {
  return OPPORTUNITIES.map((opp) => ({ ...opp, match: scoreOpportunity(opp, profile) }))
    .filter((opp) => opp.match >= minScore)
    .sort((a, b) => b.match - a.match);
}

export function searchOpportunities(query) {
  if (!query || !query.trim()) return OPPORTUNITIES;
  const q = query.toLowerCase();
  return OPPORTUNITIES.filter((opp) => {
    const haystack = [
      opp.title,
      opp.category,
      opp.type,
      opp.description,
      opp.location.state,
      opp.location.city,
      ...opp.tags,
      ...opp.eligibility,
    ]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).some((word) => word.length > 1 && haystack.includes(word));
  });
}

export function applyFilters(list, filters) {
  return list.filter((opp) => {
    if (filters.category && filters.category !== 'all' && opp.category !== filters.category) return false;
    if (filters.education && filters.education !== 'all' && !opp.education.includes(filters.education))
      return false;
    if (
      filters.location &&
      filters.location !== 'all' &&
      opp.location.state.toLowerCase() !== filters.location.toLowerCase() &&
      opp.location.state !== 'All India'
    )
      return false;
    if (filters.type && filters.type !== 'all' && opp.category !== filters.type) return false;
    return true;
  });
}
