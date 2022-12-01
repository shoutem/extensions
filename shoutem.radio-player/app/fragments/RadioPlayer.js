import React from 'react';
import { Animated } from 'react-native';
import { connect } from 'react-redux';
import slugify from '@sindresorhus/slugify';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Button, Icon, Spinner } from '@shoutem/ui';
import {
  STATE_BUFFERING, // 6 buffering
  STATE_NONE, // 0 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_STOPPED, // 1 idle
  TrackPlayer,
  TrackPlayerBase,
} from 'shoutem.audio';
import { ext, trackPlayerOptions } from '../const';
import { getRadioMetadata } from '../redux';

const COMMON_BUBBLE_PARAMS = {
  duration: 200,
  useNativeDriver: true,
};

const COMMON_APPEAR_PARAMS = {
  duration: 500,
  useNativeDriver: true,
};

class RadioPlayer extends TrackPlayerBase {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.setTrackPlayerOptions();

    this.appearAnimationMain = new Animated.Value(0);
    this.appearAnimationOuter = new Animated.Value(0);
    this.bubbleAnimationMain = new Animated.Value(0);
    this.bubbleAnimationOuterA = new Animated.Value(1);
    this.bubbleAnimationOuterB = new Animated.Value(1);

    this.bubbleAnimation = this.composeBubbleAnimation();

    this.state = { ...this.state, appearAnimationActive: false };
  }

  componentDidMount() {
    this.metadataListener = TrackPlayer.addEventListener(
      'playback-metadata-received',
      this.handleMetadataChange,
    );

    this.remotePauseListener = TrackPlayer.addEventListener(
      'remote-pause',
      () => TrackPlayer.pause(),
    );

    this.remotePlayListener = TrackPlayer.addEventListener('remote-play', () =>
      TrackPlayer.play(),
    );

    this.isCurrentTrack().then(isCurrentTrack => {
      if (isCurrentTrack) {
        this.handleReturnToPlayer();
      }
    });
  }

  async componentDidUpdate(prevProps) {
    const { onSleepTriggered, triggerSleep, shouldResetPlayer } = this.props;

    const isCurrentTrack = await this.isCurrentTrack();

    if (!isCurrentTrack) {
      return;
    }

    if (!prevProps.triggerSleep && triggerSleep) {
      TrackPlayer.pause();
      this.handlePlaybackStateChange({ state: STATE_PAUSED });
      onSleepTriggered();
    }

    if (isCurrentTrack && shouldResetPlayer) {
      this.firstPlay = true;

      this.handlePlaybackStateChange({ state: STATE_STOPPED });
      TrackPlayer.reset();
    }
  }

  componentWillUnmount() {
    if (this.metadataListener) {
      this.metadataListener.remove();
    }

    super.componentWillUnmount();
  }

  handleMetadataChange(metadata) {
    const { onMetadataStateChange } = this.props;

    onMetadataStateChange(metadata);
  }

  composeBubbleAnimation() {
    return Animated.loop(
      Animated.stagger(150, [
        Animated.sequence([
          Animated.timing(this.bubbleAnimationOuterA, {
            toValue: 1.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(this.bubbleAnimationOuterA, {
            toValue: 1,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
        Animated.sequence([
          Animated.timing(this.bubbleAnimationMain, {
            toValue: 0.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(this.bubbleAnimationMain, {
            toValue: 0,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
        Animated.sequence([
          Animated.timing(this.bubbleAnimationOuterB, {
            toValue: 1.05,
            ...COMMON_BUBBLE_PARAMS,
          }),
          Animated.timing(this.bubbleAnimationOuterB, {
            toValue: 1,
            ...COMMON_BUBBLE_PARAMS,
          }),
        ]),
      ]),
    );
  }

  composeAppearAnimation(appear) {
    const endValue = appear ? 1 : 0;

    const animations = [
      Animated.spring(this.appearAnimationMain, {
        toValue: endValue,
        ...COMMON_APPEAR_PARAMS,
      }),
      Animated.timing(this.appearAnimationOuter, {
        toValue: endValue,
        ...COMMON_APPEAR_PARAMS,
      }),
    ];

    this.appearAnimation = Animated.sequence(
      appear ? animations : _.reverse(animations),
    );
  }

  calculateOuterCircleStyle(leadingCircle) {
    const { style } = this.props;

    const bubbleAnimationValue = leadingCircle
      ? this.bubbleAnimationOuterA
      : this.bubbleAnimationOuterB;
    const translateOutputRange = leadingCircle ? [0, -10] : [0, 10];

    return [
      style.playbackMainCircle,
      {
        opacity: this.appearAnimationOuter.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.35],
        }),
        transform: [
          { scale: bubbleAnimationValue },
          { perspective: 1000 },
          {
            translateX: this.appearAnimationOuter.interpolate({
              inputRange: [0, 1],
              outputRange: translateOutputRange,
            }),
          },
          {
            translateY: this.appearAnimationOuter.interpolate({
              inputRange: [0, 1],
              outputRange: translateOutputRange,
            }),
          },
        ],
      },
    ];
  }

  setTrackPlayerOptions() {
    this.trackPlayerOptions = trackPlayerOptions;
  }

  getId() {
    const { url } = this.props;

    const id = slugify(`${url}`);

    return `radio-${id}`;
  }

  async addTrack() {
    const { title, url } = this.props;

    const id = this.getId();

    const stream = {
      artist: title,
      id,
      isLiveStream: true,
      title,
      url,
    };

    // Resets the player stopping the current track and clearing the queue.
    await this.reset();
    await TrackPlayer.add(stream);
  }

  handlePlaybackStateChange(data) {
    const { appearAnimationActive } = this.state;
    const { onPlaybackStateChange } = this.props;
    const { state } = data;

    if (
      state === STATE_STOPPED ||
      state === STATE_PLAYING ||
      state === STATE_PAUSED
    ) {
      if (appearAnimationActive) {
        this.appearAnimation.reset();
      }

      const wasPlaying = state === STATE_PAUSED || state === STATE_STOPPED;

      this.composeAppearAnimation(!wasPlaying);

      const callback = wasPlaying
        ? () => this.bubbleAnimation.reset()
        : () => this.bubbleAnimation.start();

      this.setState({ appearAnimationActive: true });

      this.appearAnimation.start(() => {
        this.setState({ appearAnimationActive: false });
        callback();
      });
    }

    super.handlePlaybackStateChange(data);
    onPlaybackStateChange(state);
  }

  handleActionButtonPress() {
    const { playbackState, appearAnimationActive } = this.state;

    if (appearAnimationActive) {
      this.appearAnimation.reset();
    }

    const wasPlaying = playbackState === STATE_PLAYING;

    this.composeAppearAnimation();

    const callback = wasPlaying
      ? () => this.bubbleAnimation.reset()
      : () => this.bubbleAnimation.start();

    this.setState({ appearAnimationActive: true });

    this.appearAnimation.start(() => {
      this.setState({ appearAnimationActive: false });
      callback();
    });

    super.handleActionButtonPress();
  }

  async handleReturnToPlayer() {
    const { onMetadataStateChange, metadata } = this.props;

    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null) {
      this.firstPlay = false;
    }

    this.setAsActiveTrack();
    this.setPlaybackState(STATE_BUFFERING);
    const playbackState = await TrackPlayer.getState();
    this.setPlaybackState(playbackState);
    this.handlePlaybackStateChange({ state: playbackState });

    if (currentTrack !== null && playbackState === STATE_PLAYING) {
      onMetadataStateChange(metadata, true);
    }

    this.addEventListeners();
  }

  resolveActionIcon() {
    const {
      style: { playbackIcon, spinner },
    } = this.props;
    const { playbackState } = this.state;

    const icons = {
      [STATE_NONE]: <Spinner style={spinner} />,
      [STATE_BUFFERING]: <Spinner style={spinner} />,
      [STATE_READY]: <Spinner style={spinner} />, // intermediate state
      [STATE_PLAYING]: <Icon name="pause" style={playbackIcon} />,
      [STATE_STOPPED]: <Icon name="play" style={playbackIcon} />,
      [STATE_PAUSED]: <Icon name="play" style={playbackIcon} />,
    };

    return icons[playbackState] || <Spinner style={spinner} />;
  }

  render() {
    const { style } = this.props;

    const ActionIcon = this.resolveActionIcon;

    return (
      <Button
        onPress={this.handleActionButtonPress}
        style={style.playbackButton}
      >
        <ActionIcon />
        <Animated.View
          style={[
            style.playbackMainCircle,
            { opacity: this.appearAnimationMain },
            {
              transform: [
                {
                  scale: Animated.add(
                    this.appearAnimationMain,
                    this.bubbleAnimationMain,
                  ),
                },
                { perspective: 1000 },
              ],
            },
          ]}
        />
        <Animated.View style={this.calculateOuterCircleStyle(true)} />
        <Animated.View style={this.calculateOuterCircleStyle(false)} />
      </Button>
    );
  }
}

RadioPlayer.propTypes = {
  shouldResetPlayer: PropTypes.bool.isRequired,
  triggerSleep: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
  onMetadataStateChange: PropTypes.func.isRequired,
  onPlaybackStateChange: PropTypes.func.isRequired,
  onSleepTriggered: PropTypes.func.isRequired,
  metadata: PropTypes.object,
  title: PropTypes.string,
};

RadioPlayer.defaultProps = {
  metadata: {},
  title: '',
};

const mapStateToProps = (state, ownProps) => {
  const { url } = ownProps;

  const id = slugify(`${url}`);
  const resolvedId = `radio-${id}`;

  return {
    metadata: getRadioMetadata(resolvedId, state),
  };
};

export default connect(mapStateToProps)(
  connectStyle(ext('RadioPlayer'))(RadioPlayer),
);
