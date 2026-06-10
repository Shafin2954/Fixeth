import {
  getJobMarketInsights,
  getPersonalizedJobMatches,
  getTrendingJobSignals
} from "@/lib/supabase/queries/jobs";

export async function runJobSignalsAgent(limit = 10) {
  const signals = await getTrendingJobSignals(limit);
  return {
    signals,
    generatedAt: new Date().toISOString()
  };
}

export async function runJobMatchesAgent(userId: string) {
  const matches = await getPersonalizedJobMatches(userId);
  return {
    ...matches,
    generatedAt: new Date().toISOString()
  };
}

export async function runJobInsightsAgent() {
  const insights = await getJobMarketInsights();
  return {
    ...insights,
    generatedAt: new Date().toISOString()
  };
}
