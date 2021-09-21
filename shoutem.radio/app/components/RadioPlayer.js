import React from 'react';
import autoBindReact from 'auto-bind/react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import slugify from '@sindresorhus/slugify';
import {
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering
  TrackPlayer,
  TrackPlayerBase,
} from 'shoutem.audio';
import { connectStyle } from '@shoutem/theme';
import { Icon, Button, Spinner } from '@shoutem/ui';
import { ext, trackPlayerOptions } from '../const';

const COMMON_BUBBLE_PARAMS = {
  duration: 200,
  useNativeDriver: true,
};

const COMMON_APPEAR_PARAMS = {
  duration: 500,
  useNativeDriver: true,
};

class RadioPlayer extends TrackPlayerBase {
  static propTypes = {
    shouldResetPlayer: PropTypes.bool,
    onPlaybackStateChange: PropTypes.func,
    title: PropTypes.string,
    url: PropTypes.string,
  };

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

  async componentDidUpdate() {
    const { onPlaybackStateChange, shouldResetPlayer } = this.props;
    const { playbackState } = this.state;

    const isCurrentTrack = await this.isCurrentTrack();
    const isPlaying = playbackState === STATE_PLAYING;

    if (isCurrentTrack && shouldResetPlayer) {
      this.firstPlay = true;
      onPlaybackStateChange(STATE_STOPPED);

      if (isPlaying) {
        TrackPlayer.reset();
      }
    }
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

      const wasPlaying = state === STATE_PAUSED;

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
    onPlaybackStateChange(data.state);
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
    const { onPlaybackStateChange } = this.props;

    if (await TrackPlayer.getCurrentTrack()) {
      this.firstPlay = false;
    }

    this.setAsActiveTrack();
    this.setPlaybackState(STATE_BUFFERING);
    const playbackState = await TrackPlayer.getState();
    this.setPlaybackState(playbackState);
    this.addEventListeners();
    onPlaybackStateChange(playbackState);
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

export default connectStyle(ext('RadioPlayer'))(RadioPlayer);
