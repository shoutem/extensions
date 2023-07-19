// function that decorates given Screen with adsDisabled property
// Screen decorated with that property should not display Banner ads
export function adBannerDisabled(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.adBannerDisabled = value;
  return Screen;
}

// A function that decorates given Screen with hasCustomAdRenderer property
// Screen decorated with that property will not render regular ad banner
// positioned at the bottom or the top. Instead, this type of screen will
// receive renderAdBanner prop which can be used to display banner in a custom
// way. The same thing can be achieved by setting hasCustomAdRenderer screen
// setting inside the extension.json section for a specific screen.
export function hasCustomAdRenderer(Screen, value = true) {
  // eslint-disable-next-line no-param-reassign
  Screen.hasCustomAdRenderer = value;
  return Screen;
}
