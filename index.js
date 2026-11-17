import 'react-native-gesture-handler';
/**
 * @format
 */

import { AppRegistry, View } from 'react-native';
import * as ReactNative from 'react-native';

// Safe fallback for removed InteractionManager in React Native 0.88+
const SafeInteractionManager = {
  runAfterInteractions(task) {
    let handle;
    const promise = new Promise((resolve) => {
      handle = requestAnimationFrame(() => {
        resolve(task ? task() : undefined);
      });
    });
    return {
      then: promise.then.bind(promise),
      done: (cb) => {
        if (cb) promise.then(cb);
      },
      cancel: () => {
        if (handle) cancelAnimationFrame(handle);
      },
    };
  },
  createInteractionHandle: () => 1,
  clearInteractionHandle: () => {},
  setDeadline: () => {},
  addListener: () => ({ remove: () => {} }),
};

try {
  Object.defineProperty(ReactNative, 'InteractionManager', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: SafeInteractionManager,
  });
} catch (e) {
  try {
    ReactNative.InteractionManager = SafeInteractionManager;
  } catch (err) {}
}

if (global.ErrorUtils) {
  const origHandler = global.ErrorUtils.getGlobalHandler && global.ErrorUtils.getGlobalHandler();
  global.ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.error('GLOBAL_ERROR_STACK:', error && error.message, error && error.stack);
    if (origHandler) origHandler(error, isFatal);
  });
}
if (View && !View.propTypes) {
  View.propTypes = { style: {} };
}
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
