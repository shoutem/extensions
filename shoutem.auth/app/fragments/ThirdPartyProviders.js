import { authProviders } from '../services/authProviders';

export default function ThirdPartyProviders() {
  const providers = authProviders.getAuthProviders();

  if (providers.length === 1 && providers[0].noOtherProviderAction) {
    providers[0].noOtherProviderAction();
  }

  if (providers.length === 1 && providers[0].renderLoginScreen) {
    // If there's only one 3rd party provider and they have a defined
    // renderLoginScreen, we'll render that instead of just the button.
    return providers[0].renderLoginScreen();
  }

  return providers.map(
    provider => provider.renderLoginButton && provider.renderLoginButton(),
  );
}
