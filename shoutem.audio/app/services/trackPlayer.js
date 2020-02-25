/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */
import TrackPlayer from 'react-native-track-player';

const trackPlayerDummy = {
  pause: () => {},
  destroy: () => {},
  addEventListener: () => {},
  registerPlaybackService: () => {},
};

const eventListeners = [];

function remotePlay() {
  TrackPlayer.play();
}

function remotePause() {
  TrackPlayer.pause();
}

function remoteNext() {
  TrackPlayer.skipToNext();
}

function remotePrevious() {
  TrackPlayer.skipToPrevious();
}

function remoteStop() {
  TrackPlayer.destroy();
}

function registerEvent(name, handler) {
  const handle = TrackPlayer.addEventListener(name, handler);
  eventListeners.push(handle);
}

function removeEventListeners() {
  eventListeners.forEach(listener => listener.remove());
}

function remoteDuck() {
  remotePause();
}

// needs to be async
async function trackPlayerService() {
  // do not set TrackPlayer methods as direct callbacks, as they do not
  // expect any arguments and will throw if they do get them
  registerEvent('remote-play', remotePlay);
  registerEvent('remote-pause', remotePause);
  registerEvent('remote-next', remoteNext);
  registerEvent('remote-previous', remotePrevious);
  registerEvent('remote-stop', remoteStop);

  registerEvent('remote-duck', remoteDuck);

  TrackPlayer.setupPlayer({ waitForBuffer: true });
}

export function registerTrackPlayerService() {
  TrackPlayer.registerPlaybackService(() => trackPlayerService);
}

export function destroyTrackPlayer() {
  TrackPlayer.stop();
  removeEventListeners();
  TrackPlayer.destroy();
}
