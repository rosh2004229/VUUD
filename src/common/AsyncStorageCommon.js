import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

const defaultLoadTransformer = (value) => value;
const defaultSetTransformer = (value) => {
  if (typeof value === 'string') {
    return value;
  } else {
    return JSON.stringify(value);
  }
};

class Observer {
  subscribers = new Map();
  static instance = null;

  static getInstance() {
    if (Observer.instance === null) {
      Observer.instance = new Observer();
    }
    return Observer.instance;
  }

  subscribe(key, cb) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).push(cb);
    } else {
      this.subscribers.set(key, [cb]);
    }
    cb(); // call callback on subscribe to get latest data
  }

  notify(key) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach((cb) => cb());
    }
  }

  clear(key, cb) {
    const listeners = this.subscribers.get(key);
    const filteredlisteners = listeners.filter((fn) => cb !== fn);
    if (filteredlisteners.length) {
      this.subscribers.set(key, filteredlisteners);
    } else {
      this.subscribers.delete(key);
    }
  }
}

const useAsyncStorage = (
  key,
  params = {postLoad: defaultLoadTransformer, preSet: defaultSetTransformer},
) => {
  const [item, setItem] = useState({});

  const onLoadTransformValue = params.postLoad
    ? params.postLoad
    : defaultLoadTransformer;

  const onSetTransformValue = params.preSet
    ? params.preSet
    : defaultSetTransformer;

  const removeElement = async () => {
    await AsyncStorage.removeItem(key);
    Observer.getInstance().notify(key);
  };

  const setElement = async (value) => {
    await AsyncStorage.setItem(key, onSetTransformValue(value));
    Observer.getInstance().notify(key);
  };

  useEffect(() => {
    const loadElement = async () => {
      const element = await AsyncStorage.getItem(key);
      setItem(element);
    };
    Observer.getInstance().subscribe(key, loadElement);
    return () => {
      Observer.getInstance().clear(key, loadElement);
    };
  }, []);

  return {
    item: onLoadTransformValue(item),
    setItem: setElement,
    removeItem: removeElement,
  };
};

export default useAsyncStorage;
