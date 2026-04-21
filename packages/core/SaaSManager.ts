// SaaSManager.ts
// Handles commercial logic, multi-tier isolation, and settings toggling for Resellers & Tenants.

export type Role = 'Super-Admin' | 'Reseller' | 'Tenant' | 'User';

export interface SubscriptionContext {
  id: string;
  tier: string;
  role: Role;
  features: {
    markup_engine: boolean;
    universal_sso: boolean;
    model_swapper: boolean;
    pii_anonymizer: boolean;
    roi_predictor: boolean;
  };
  limits: {
    maxConversations: number;
    maxTenants: number;
  };
}

export class SaaSManager {
  private subscriptionInfo: SubscriptionContext;

  constructor(context: SubscriptionContext) {
    this.subscriptionInfo = context;
  }

  public canAccessFeature(featureName: keyof SubscriptionContext['features']): boolean {
    return !!this.subscriptionInfo.features[featureName];
  }

  public calculateEndUserPrice(baseCost: number, resellerMarkupPercent: number = 0): number {
    if (this.canAccessFeature('markup_engine') && this.subscriptionInfo.role === 'Reseller') {
      return baseCost + (baseCost * (resellerMarkupPercent / 100));
    }
    return baseCost;
  }

  public getModelSourcePreference(): 'local' | 'cloud' {
    if (this.canAccessFeature('model_swapper')) {
      // Look up user DB preference; falling back to local
      return 'local'; 
    }
    return 'local'; // Default enforcing Global Compliance (data sovereignty)
  }

  public async validateSsoProvider(providerToken: string): Promise<boolean> {
    if (!this.canAccessFeature('universal_sso')) {
      throw new Error("Universal SSO is not enabled for this tenant. Please upgrade.");
    }
    // Entra ID, Auth0, Google ID verification goes here
    return true; 
  }
}
