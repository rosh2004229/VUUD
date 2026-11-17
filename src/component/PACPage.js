import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import ToolbarBackButton from '../common/ToolbarBackButton';
import { COLORS, FONTS_SIZE, elevation } from '../common/utils';
import TextCommonMedium from '../common/TextCommonMedium';
import TextInputView from '../common/TextInputView';
import TextCommonSemiBlod from '../common/TextCommonSemiBlod';
import TextCommonregular from '../common/TextCommonregular';

function PACPage({ route, navigation }) {
  const { text, link } = route.params;

  const commonContactUsView = (lable, txt) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          marginTop: 15,
          shadowColor: COLORS.shadow_color,
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: elevation,
          backgroundColor: COLORS.white_txt,
          borderRadius: 10,
        }}
      >
        <TextCommonSemiBlod
          text={lable}
          color={COLORS.black_txt}
          fontSize={FONTS_SIZE.txt_17}
          fontWeight={'400'}
          numberOfLines={2}
        />
        <TextCommonregular
          text={txt}
          color={COLORS.gry_light}
          fontSize={FONTS_SIZE.txt_15}
          fontWeight={'200'}
          numberOfLines={2}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
      <ToolbarBackButton
        btnText={text}
        onBackPress={() => navigation.goBack(null)}
      />

      {text === 'Contact Us' ? (
        <View style={{ padding: 20 }}>
          {commonContactUsView('Email :', ' IndiaInfluencer@gmail.com')}
          {commonContactUsView('Contact No. :', ' 1234567890')}
          {commonContactUsView('Address :', ' Ahemdabad')}
        </View>
      ) : (
        <WebView source={{ uri: link }} style={{ flex: 1 }} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  modalBackground: {
    height: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 60,
    width: 60,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
export default PACPage;
