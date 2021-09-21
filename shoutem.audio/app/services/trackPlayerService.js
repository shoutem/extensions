/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not
 * the UI such as processing media buttons or analytics
 */
import autoBind from 'auto-bind';
import { Platform } from 'react-native';
import TrackPlayer from 'react-native-track-player';

const eventListeners = [];

class TrackPlayerService {
  constructor() {
    autoBind(this);

    this.firstRemoteDuck = true;
    this.shouldResumeAfterDuck = true;
  }

  setShouldResumeAfterDuck(shouldResume) {
    this.shouldResumeAfterDuck = shouldResume;
  }

  remotePlay() {
    TrackPlayer.play();
  }

  remotePause() {
    TrackPlayer.pause();
  }

  remoteNext() {
    TrackPlayer.skipToNext();
  }

  remotePrevious() {
    TrackPlayer.skipToPrevious();
  }

  remoteStop() {
    TrackPlayer.destroy();
  }

  registerEvent(name, handler) {
    const handle = TrackPlayer.addEventListener(name, handler);
    eventListeners.push(handle);
  }

  removeEventListeners() {
    eventListeners.forEach(listener => listener.remove());
  }

  // remote-duck event is fired once when playback is interrupted by outside
  // means (e.g. a notification, playback of audio in another app, etc.) and
  // another time when the interruption is over. We want to continue playback
  // at the end of the interruption.
  // http://react-native-track-player.js.org/documentation/#eventremoteduck
  remoteDuck() {
    if (this.firstRemoteDuck) {
      // iOS pauses on it's own on interruptions, Android does not.
      if (Platform.OS === 'android') {
        this.remotePause();
      }

      this.firstRemoteDuck = false;
    } else {
      if (this.shouldResumeAfterDuck) {
        this.remotePlay();
      }

      this.firstRemoteDuck = true;
    }
  }

  // Must be async.
  async trackPlayerService() {
    // Do not set TrackPlayer methods as direct callbacks, as they do not
    // expect any arguments and will throw if they get them.
    this.registerEvent('remote-play', this.remotePlay);
    this.registerEvent('remote-pause', this.remotePause);
    this.registerEvent('remote-next', this.remoteNext);
    this.registerEvent('remote-previous', this.remotePrevious);
    this.registerEvent('remote-stop', this.remoteStop);
    this.registerEvent('remote-duck', this.remoteDuck);

    TrackPlayer.setupPlayer({ waitForBuffer: true });
  }

  register() {
    TrackPlayer.registerPlaybackService(() => this.trackPlayerService);
  }

  destroy() {
    TrackPlayer.stop();
    this.removeEventListeners();
    TrackPlayer.destroy();
  }
}

export const trackPlayerService = new TrackPlayerService();
