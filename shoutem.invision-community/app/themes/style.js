import { resolveFontWeight } from '@shoutem/ui';

export default () => ({
  'shoutem.invision-community.LoginButton': {
    invisionButton: {
      width: '100%',
      minWidth: 140,
      height: 44,
      marginVertical: 10,
      borderRadius: 6,
      backgroundColor: '#24476F',
      alignSelf: 'center',
    },
    invisionButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: resolveFontWeight('600'),
      fontFamily: 'Rubik-Regular',
    },
    invisionButtonLogo: {
      width: 16,
      height: 16,
    },
  },
});
