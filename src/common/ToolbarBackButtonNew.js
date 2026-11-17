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

function ToolbarBackButtonNew({
  btnText,
  onBackPress,
  onRightClick,
  rightIcon,
  onFilterClick,
  filterIcon,
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
          width: '100%',
          paddingHorizontal: 8,
        }}
      >
        <TouchableOpacity
          activeOpacity={activeOpacity}
          onPress={onBackPress}
          style={{
            width: 35,
            height: 35,
            borderRadius: 35 / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            style={{ width: 16, height: 16, tintColor: COLORS.black_txt }}
            resizeMode={'contain'}
            source={require('../assets/back.png')}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <TextCommonSemiBlod
            text={btnText}
            color={COLORS.black_txt}
            fontSize={FONTS_SIZE.txt_18}
            textAlign={'center'}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {filterIcon != undefined && filterIcon != null ? (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={onFilterClick}
              style={{
                width: 35,
                height: 35,
                borderRadius: 35 / 2,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 4,
              }}
            >
              <Image
                style={{ width: 20, height: 20, tintColor: COLORS.black_txt }}
                resizeMode={'contain'}
                source={filterIcon}
              />
            </TouchableOpacity>
          ) : null}
          {rightIcon != undefined && rightIcon != null ? (
            <TouchableOpacity
              activeOpacity={activeOpacity}
              onPress={onRightClick}
              style={{
                width: 35,
                height: 35,
                borderRadius: 35 / 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                style={{ width: 18, height: 18, tintColor: COLORS.black_txt }}
                resizeMode={'contain'}
                source={rightIcon}
              />
            </TouchableOpacity>
          ) : (
            filterIcon == null ? <View style={{ width: 35 }} /> : null
          )}
        </View>
      </View>
    </View>
  );
}

export default ToolbarBackButtonNew;
