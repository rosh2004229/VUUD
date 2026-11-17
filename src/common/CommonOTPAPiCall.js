import APIWebCall from './APIWebCall';

async function onSendOTP_fornt_APICall(data) {
  return await new Promise(function (resolve, reject) {
    APIWebCall.onSendOTP_fornt_APICall(data)
      .then((data) => {
        if (data.Status === 'Success') resolve(data);
        else reject(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function onVERIFYOTP_fornt_APICall(data) {
  return await new Promise(function (resolve, reject) {
    APIWebCall.onVERIFYOTP_fornt_APICall(data)
      .then((data) => {
        // console.log('data -> ', data);
        if (data.Status === 'Success') resolve(data);
        else reject(data);
      })
      .catch((error) => {
        reject(error);
        Snackbar.show({
          text: error.Details,
          duration: Snackbar.LENGTH_LONG,
        });
      });
  });
}

const CommonOTPAPiCall = {
  onSendOTP_fornt_APICall,
  onVERIFYOTP_fornt_APICall,
};

export default CommonOTPAPiCall;
