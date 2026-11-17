import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import TextCommonregular from '../common/TextCommonregular';
import { COLORS, FONTS, FONTS_SIZE } from '../common/utils';

function DialogReport({
    navigation,
    placeholder,
    onChangeText,
    onsubmitClick,
    value,
    isDialogVisible,
    toggleModalClick,
    oncancelClick,
}) {
    return (
        <Modal
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            backdropOpacity={0.9}
            backdropColor={COLORS.black_txt}
            isVisible={isDialogVisible}
            onBackdropPress={toggleModalClick}
            onSwipeComplete={toggleModalClick}
            swipeDirection="right"
            useNativeDriver={false}
            hideModalContentWhileAnimating={true}>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingStart: 15,
                    paddingEnd: 15,
                    paddingBottom: 15,
                    paddingTop: 15,
                }}>
                <View
                    backgroundColor={COLORS.white_txt}
                    style={{
                        borderRadius: 5,
                        padding: 15,
                    }}>

                    <TextInput
                        style={{
                            height: 100,
                            borderRadius: 5,
                            borderWidth: 0.5,
                            borderColor: COLORS.color_333333,
                            color: COLORS.black_txt,
                            fontSize: FONTS_SIZE.txt_14,
                            fontWeight: '400',
                            fontFamily: FONTS.FontRegular,
                            padding: 10,
                            textAlignVertical: 'top',
                        }}
                        placeholder={placeholder}
                        onChangeText={onChangeText}
                        value={value}
                        keyboardType={'default'}
                        returnKeyType={'done'}
                        multiline={true}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 20,
                        }}>
                        <TouchableOpacity
                            style={{
                                height: 38,
                                justifyContent: 'center',
                                borderRadius: 5,
                                backgroundColor: COLORS.colorGreen,
                                paddingStart: 15,
                                paddingEnd: 15,
                            }}
                            onPress={onsubmitClick}>
                            <TextCommonregular
                                text={'Submit'}
                                color={COLORS.white_txt}
                                fontSize={FONTS_SIZE.txt_16}
                                fontWeight={'500'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                height: 38,
                                justifyContent: 'center',
                                borderRadius: 5,
                                backgroundColor: COLORS.colorGreen,
                                paddingStart: 15,
                                paddingEnd: 15,
                                marginLeft: 20,
                            }}
                            onPress={oncancelClick}>
                            <TextCommonregular
                                text={'Cancel'}
                                color={COLORS.white_txt}
                                fontSize={FONTS_SIZE.txt_16}
                                fontWeight={'500'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default DialogReport;
