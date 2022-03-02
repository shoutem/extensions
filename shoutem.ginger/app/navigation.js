import { NavigationStacks } from 'shoutem.navigation';
import { ext, VERIFICATION_STACK } from './const';
import {
  AgeVerificationScreen,
  ChangePasswordScreen,
  ChangePhoneNumberScreen,
  ForgotPasswordScreen,
  LoginScreen,
  PhoneVerificationScreen,
  PrivacyPolicyScreen,
  RegisterScreen,
  SelectLocationScreen,
  TermsOfServiceScreen,
} from './screens';

NavigationStacks.registerNavigationStack({
  name: ext(),
  screens: [
    {
      name: ext('LoginScreen'),
      component: LoginScreen,
    },
    {
      name: ext('PhoneVerificationScreen'),
      component: PhoneVerificationScreen,
    },
    {
      name: ext('ChangePhoneNumberScreen'),
      component: ChangePhoneNumberScreen,
    },
    {
      name: ext('RegisterScreen'),
      component: RegisterScreen,
    },
    {
      name: ext('SelectLocationScreen'),
      component: SelectLocationScreen,
    },
    {
      name: ext('ForgotPasswordScreen'),
      component: ForgotPasswordScreen,
    },
    {
      name: ext('ChangePasswordScreen'),
      component: ChangePasswordScreen,
    },
  ],
});

NavigationStacks.registerNavigationStack({
  name: VERIFICATION_STACK,
  screens: [
    {
      name: ext('AgeVerificationScreen'),
      component: AgeVerificationScreen,
    },
    {
      name: ext('PrivacyPolicyScreen'),
      component: PrivacyPolicyScreen,
    },
    {
      name: ext('TermsOfServiceScreen'),
      component: TermsOfServiceScreen,
    },
  ],
});
