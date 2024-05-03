const pack = require('../package.json');

// defines scope for the current extension state within the global app's state
function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

const DEFAULT_ADMOB_APPS = {
  IOS: 'ca-app-pub-7090812163729304~6362478856',
  ANDROID: 'ca-app-pub-7090812163729304~5646069659',
};

// The Google Mobile Ads SDK supports conversion tracking using Apple's SKAdNetwork, which lets Google and participating third-party buyers attribute an app install even when the IDFA is not available.
// https://docs.page/invertase/react-native-google-mobile-ads#appjson-3
const SK_AD_NETWORK_ITEMS = [
  'cstr6suwn9.skadnetwork',
  '4fzdc2evr5.skadnetwork',
  '4pfyvq9l8r.skadnetwork',
  '2fnua5tdw4.skadnetwork',
  'ydx93a7ass.skadnetwork',
  '5a6flpkh64.skadnetwork',
  'p78axxw29g.skadnetwork',
  'v72qych5uu.skadnetwork',
  'ludvb6z3bs.skadnetwork',
  'cp8zw746q7.skadnetwork',
  '3sh42y64q3.skadnetwork',
  'c6k4g5qg8m.skadnetwork',
  's39g8k73mm.skadnetwork',
  '3qy4746246.skadnetwork',
  'f38h382jlk.skadnetwork',
  'hs6bdukanm.skadnetwork',
  'v4nxqhlyqp.skadnetwork',
  'wzmmz9fp6w.skadnetwork',
  'yclnxrl5pm.skadnetwork',
  't38b2kh725.skadnetwork',
  '7ug5zh24hu.skadnetwork',
  'gta9lk7p23.skadnetwork',
  'vutu7akeur.skadnetwork',
  'y5ghdn5j9k.skadnetwork',
  'n6fk4nfna4.skadnetwork',
  'v9wttpbfk9.skadnetwork',
  'n38lu8286q.skadnetwork',
  '47vhws6wlr.skadnetwork',
  'kbd757ywx3.skadnetwork',
  '9t245vhmpl.skadnetwork',
  'eh6m2bh4zr.skadnetwork',
  'a2p9lx4jpn.skadnetwork',
  '22mmun2rn5.skadnetwork',
  '4468km3ulz.skadnetwork',
  '2u9pt9hc89.skadnetwork',
  '8s468mfl3y.skadnetwork',
  'klf5c3l5u5.skadnetwork',
  'ppxm28t8ap.skadnetwork',
  'ecpz2srf59.skadnetwork',
  'uw77j35x4d.skadnetwork',
  'pwa73g5rt2.skadnetwork',
  'mlmmfzh3r3.skadnetwork',
  '578prtvx9j.skadnetwork',
  '4dzt52r2t5.skadnetwork',
  'e5fvkxwrpn.skadnetwork',
  '8c4e2ghe7u.skadnetwork',
  'zq492l623r.skadnetwork',
  '3rd42ekr43.skadnetwork',
  '3qcr597p9d.skadnetwork',
];

module.exports = {
  ext,
  DEFAULT_ADMOB_APPS,
  SK_AD_NETWORK_ITEMS,
};
