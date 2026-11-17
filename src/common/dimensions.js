import React from 'react-native';
import {Dimensions, StatusBar, Platform} from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const BAR_HEIGHT = Platform.OS === 'ios' ? 0 : 10;

const TAB_BAR_HEIGHT = 60;
const HEADER_HEIGHT = 60;

const relativeWidth = (num) => (DEVICE_WIDTH * num) / 100;
const relativeHeight = (num) => (DEVICE_HEIGHT * num) / 100;

const DASHBOARD_CARD_HEIGHT = DEVICE_HEIGHT - TAB_BAR_HEIGHT;

export default {
  relativeWidth,
  relativeHeight,
  TAB_BAR_HEIGHT,
  DEVICE_HEIGHT,
  DEVICE_WIDTH,
  HEADER_HEIGHT,
  STATUS_BAR_HEIGHT,
  DASHBOARD_CARD_HEIGHT,
};
