// SchoolDesk (and other Desk products) pricing tiers -> feature flags.
// Same code + schema for every tier; behaviour is gated by these flags,
// which provisioning writes into organisations.features.
export interface TierFeatures {
  maxRecords: number | null;   // null = unlimited
  customSubdomain: boolean;
  customDomain: boolean;
  basicAnalytics: boolean;
  advancedAnalytics: boolean;
  apiAccess: boolean;
  multipleAdmins: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
  multiBranch: boolean;
  sla: boolean;
}

export interface Tier {
  id: string;
  label: string;
  setup: number;
  monthly: number;
  features: TierFeatures;
}

const STANDARD: TierFeatures = {
  maxRecords: 500,
  customSubdomain: true,
  customDomain: false,
  basicAnalytics: true,
  advancedAnalytics: false,
  apiAccess: false,
  multipleAdmins: false,
  prioritySupport: false,
  whiteLabel: false,
  multiBranch: false,
  sla: false,
};

export const TIERS: Record<string, Tier> = {
  standard: { id: "standard", label: "Standard", setup: 300000, monthly: 50000, features: { ...STANDARD } },
  pro: {
    id: "pro", label: "Pro", setup: 500000, monthly: 75000,
    features: { ...STANDARD, maxRecords: null, customDomain: true, advancedAnalytics: true, apiAccess: true, multipleAdmins: true, prioritySupport: true },
  },
  enterprise: {
    id: "enterprise", label: "Enterprise", setup: 2000000, monthly: 200000,
    features: { ...STANDARD, maxRecords: null, customDomain: true, advancedAnalytics: true, apiAccess: true, multipleAdmins: true, prioritySupport: true, whiteLabel: true, multiBranch: true, sla: true },
  },
};

export function featuresForPlan(plan?: string): TierFeatures {
  return (TIERS[(plan || "").toLowerCase()] || TIERS.standard).features;
}
