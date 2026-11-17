import React from 'react';
import {
  Platform,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextCommonSemiBlod from './TextCommonSemiBlod';
import { activeOpacity, COLORS, FONTS_SIZE } from './utils';

function ToolbarHeaderText({
  btnText,
  onBackPress,
  onFilterClick,
  rightIcon,
}) {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0);

  return (
    <View
      style={{
        backgroundColor: COLORS.white_txt,
        paddingTop: topInset,
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#EEEEEE',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          height: 50,
          alignItems: 'center',
          backgroundColor: COLORS.refecode_backcolor,
          width: '100%',
          paddingHorizontal: 8,
        }}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TextCommonSemiBlod
            text={btnText}
            color={COLORS.primary}
            fontSize={FONTS_SIZE.txt_18}
            textAlign={'center'}
          />
        </View>
        {rightIcon != undefined && rightIcon != null ? (
          <TouchableOpacity
            activeOpacity={activeOpacity}
            onPress={onFilterClick}
            style={{
              width: 35,
              height: 35,
              borderRadius: 35 / 2,
              backgroundColor: COLORS.color_toolbar_btn_BG,
              position: 'absolute',
              right: 8,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              style={{ width: 20, height: 20, tintColor: COLORS.white_txt }}
              resizeMode={'contain'}
              source={rightIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default ToolbarHeaderText;
