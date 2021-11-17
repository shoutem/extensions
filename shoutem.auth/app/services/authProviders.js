import { ext } from '../const';

let providers = [];

function addProvider(provider) {
  const providerExists = !!providers.find(p => p.name === provider.name);

  if (!providerExists) {
    providers.push(provider);
  }
}

function getAuthProviders() {
  return providers;
}

function hasThirdPartyProviders() {
  const providerCount = providers.length;

  if (!providerCount) {
    return false;
  }

  // 'email' is used for our authentication, if it's the only provider
  // registered, there are no third party providers.
  if (providerCount === 1 && providers[0].name === ext('provider.email')) {
    return false;
  }

  return true;
}

function removeProvider(providerName) {
  providers = providers.filter(provider => provider.name !== providerName);
}

function removeAllProviders() {
  providers.length = 0;
}

export const authProviders = {
  addProvider,
  getAuthProviders,
  hasThirdPartyProviders,
  removeProvider,
  removeAllProviders,
};
