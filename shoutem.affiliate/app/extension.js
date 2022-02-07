// This file is managed by Shoutem CLI
// It exports screens and themes from extension.json
// You should not change it manually

// screens imports
import LevelDetailsScreen from './screens/LevelDetailsScreen';
import LevelsListScreen from './screens/LevelsListScreen';

export const screens = {
  LevelsListScreen,
  LevelDetailsScreen,
  SolidNavbarLargeLevelDetailsScreen: LevelDetailsScreen,
};
