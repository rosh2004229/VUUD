import NetInfo from '@react-native-community/netinfo';
import Snackbar from 'react-native-snackbar';
import {API_INTERNET_CONNECTION_CAPTION_EN} from './utils';

export async function checkInternetPermissions() {
  const isInternetGranted = await NetInfo.fetch().then((state) => {
    return state.isConnected;
  });

  if (isInternetGranted === true) {
    return isInternetGranted;
  } else {
    Snackbar.show({
      text: API_INTERNET_CONNECTION_CAPTION_EN,
      duration: Snackbar.LENGTH_LONG,
    });
  }
}
export default {checkInternetPermissions};
