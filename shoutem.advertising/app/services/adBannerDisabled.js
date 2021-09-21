// function that decorates given Screen with adsDisabled property
// Screen decorated with that property should not display Banner ads
export function adBannerDisabled(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.adBannerDisabled = value;
  return Screen;
}
