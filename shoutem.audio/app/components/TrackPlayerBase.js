import { PureComponent } from 'react';
import autoBind from 'auto-bind';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import { trackPlayerService } from '../services/trackPlayerService';
import {
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_BUFFERING, // 6 loading
} from '../const';

class TrackPlayerBase extends PureComponent {
  constructor(props) {
    super(props);

    autoBind(this);

    this.setPlaybackState = _.throttle(this.setPlaybackState.bind(this), 100);

    this.stateListener = null;
    this.errorListener = null;

    this.unmounting = false;
    this.firstPlay = true;

    this.state = {
      // eslint-disable-next-line react/no-unused-state
      currentlyActiveTrack: false,
      playbackState: STATE_STOPPED,
    };

    this.setTrackPlayerOptions();
  }

  async componentDidMount() {
    if (await this.isCurrentTrack()) {
      this.handleReturnToPlayer();
    }
  }

  componentWillUnmount() {
    this.unmounting = true;

    this.removeEventListeners();
  }

  setTrackPlayerOptions() {
    this.trackPlayerOptions = trackPlayerOptions;
  }

  // eslint-disable-next-line class-methods-use-this
  getId() {
    return 'audio-player-track-id';
  }

  // throttled
  setPlaybackState(playbackState) {
    this.setState({ playbackState });
  }

  setAsActiveTrack() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      currentlyActiveTrack: true,
    });
  }

  addEventListeners() {
    if (this.stateListener) {
      return;
    }

    this.stateListener = TrackPlayer.addEventListener(
      'playback-state',
      this.handlePlaybackStateChange,
    );
    this.errorListener = TrackPlayer.addEventListener(
      'playback-error',
      this.handlePlaybackError,
    );
    this.remoteStopListener = TrackPlayer.addEventListener(
      'remote-stop',
      this.handleRemoteStop,
    );
  }

  removeEventListeners() {
    if (this.stateListener) {
      this.stateListener.remove();
    }

    if (this.errorListener) {
      this.errorListener.remove();
    }

    if (this.remoteStopListener) {
      this.remoteStopListener.remove();
    }
  }

  async handlePlaybackStateChange(data) {
    if (this.unmounting) {
      return;
    }

    this.setPlaybackState(data.state);
  }

  // eslint-disable-next-line class-methods-use-this
  handlePlaybackError(err) {
    // eslint-disable-next-line no-console
    console.log('handlePlaybackError', err);
  }

  handleRemoteStop() {
    this.firstPlay = true;
    this.setPlaybackState(STATE_STOPPED);
    trackPlayerService.setShouldResumeAfterDuck(false);
  }

  async handleReturnToPlayer() {
    if (await TrackPlayer.getCurrentTrack()) {
      this.firstPlay = false;
    }

    this.setAsActiveTrack();
    this.setPlaybackState(STATE_BUFFERING);
    const playbackState = await TrackPlayer.getState();
    this.setPlaybackState(playbackState);
    this.addEventListeners();
  }

  async handleFirstPlay() {
    this.firstPlay = false;

    TrackPlayer.updateOptions(this.trackPlayerOptions);

    this.setAsActiveTrack();
    this.setPlaybackState(STATE_BUFFERING);
    this.addEventListeners();

    if (!(await this.isCurrentTrack())) {
      await this.reset();
      await this.addTrack();
      this.play();
    }
  }

  handleActionButtonPress() {
    const { playbackState } = this.state;

    if (this.firstPlay && playbackState !== STATE_PLAYING) {
      this.handleFirstPlay();
      return;
    }

    if (playbackState === STATE_PLAYING) {
      this.pause();
    } else {
      this.play();
    }
  }

  async isCurrentTrack() {
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    const queue = await TrackPlayer.getQueue();

    if (_.isEmpty(queue) || currentTrackIndex === null) {
      return false;
    }

    const currentTrack = await TrackPlayer.getTrack(currentTrackIndex);
    const currentTrackId = _.get(currentTrack, 'id');

    return currentTrackId === this.getId();
  }

  async play() {
    this.setPlaybackState(STATE_PLAYING);

    await TrackPlayer.play();
    trackPlayerService.setShouldResumeAfterDuck(true);
  }

  async pause() {
    this.setPlaybackState(STATE_PAUSED);

    await TrackPlayer.pause();
    trackPlayerService.setShouldResumeAfterDuck(false);
  }

  async reset() {
    this.setPlaybackState(STATE_STOPPED);

    await TrackPlayer.reset();
    trackPlayerService.setShouldResumeAfterDuck(false);
  }
}

export default TrackPlayerBase;
