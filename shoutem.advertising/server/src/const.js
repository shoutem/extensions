import pack from '../package.json';

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DEFAULT_EXTENSION_SETTINGS = {
  iOSBannerAdId: null,
  iOSAdAppId: null,
  AndroidAdAppId: null,
  AndroidBannerAdId: null,
  maxAdContentRating: "G",
  tagForChildDirectedTreatment: true,
  tagForUnderAgeOfConsent: true,
  bannerPlacement: "Top",
  keywords: "",
  iOSInterstitialAdId: null,
  AndroidInterstitialAdId: null
};
