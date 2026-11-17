import Snackbar from 'react-native-snackbar';
import APIWebCall from './APIWebCall';

async function onCMSAPICall(data) {
  return await new Promise(function (resolve, reject) {
    APIWebCall.onCMSAPICall(data)
      .then((data) => {
        if (data.status) resolve(data.data);
        else {
          Snackbar.show({
            text: data.message,
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch((error) => {
        Snackbar.show({
          text: error.message,
          duration: Snackbar.LENGTH_LONG,
        });
      });
  });
}

const CommonApiCall = {
  onCMSAPICall,
};

export default CommonApiCall;
