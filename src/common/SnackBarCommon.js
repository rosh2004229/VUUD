import React, { Component } from 'react';
import Snackbar from 'react-native-snackbar';
import { COLORS } from './utils';
import { showMessage } from 'react-native-flash-message';

function SnackBarCommon({ text, isSuccess }) {
  let messageText = "Something went wrong, Please try again later";
  if (typeof text === "string" && text.trim().length > 0) {
    messageText = text;
  } else if (text && typeof text.message === "string") {
    messageText = text.message;
  } else if (text && typeof text.error === "string") {
    messageText = text.error;
  } else if (text && typeof text.msg === "string") {
    messageText = text.msg;
  } else if (text && text.data && typeof text.data.message === "string") {
    messageText = text.data.message;
  }

  return showMessage({
    message: messageText,
    type: isSuccess ? "success" : "danger",
  });
}

export default SnackBarCommon;
