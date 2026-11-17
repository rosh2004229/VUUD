import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { errormsgstyles } from './errormsgstyles';
import { COLORS, FONTS, FONTS_SIZE } from './utils';

export default class VersionUpdateDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            loading,
            onPressRightButton,
            onPressLeftButton,
            msg_text,
            msg_title,
            iconColor,
            leftButtonText,
            rightButtonText,
        } = this.props;
        return (
            <Modal
                animationType="slide"
                visible={loading}
                animated={true}
                onRequestClose={onPressLeftButton}
                transparent={true}>
                <View style={errormsgstyles.errorMsgMainViewStyle}>
                    <View
                        style={{
                            ...errormsgstyles.errorMsgSecondViewStyle,
                            height: 195,
                        }}>
                        <View
                            style={{
                                marginTop: 20,
                            }}>

                            {msg_title != null && msg_title != '' ? (
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        color: COLORS.black,
                                        fontSize: FONTS_SIZE.txt_15,
                                        marginRight: 10,
                                        marginLeft: 10,
                                        textAlign: 'center',
                                        fontFamily: FONTS.FontMedium,
                                        fontWeight: '600',
                                    }}>
                                    {msg_title.toUpperCase()}
                                </Text>
                            ) : null}
                            <Text
                                allowFontScaling={false}
                                style={errormsgstyles.errorMsgTextStyle}>
                                {msg_text}
                            </Text>
                        </View>

                        <View
                            style={{
                                position: 'absolute',
                                bottom: 20,
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',

                            }}>
                            {rightButtonText != undefined &&
                                rightButtonText != null &&
                                rightButtonText != '' ? (
                                <TouchableOpacity
                                    style={{
                                        width: 100,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        backgroundColor: COLORS.colorGreen,
                                        padding: 3,
                                        borderRadius: 5,
                                    }}
                                    activeOpacity={1}
                                    onPress={onPressRightButton}>
                                    <Text
                                        allowFontScaling={false}
                                        style={{
                                            color: COLORS.white_txt,
                                            fontSize: FONTS_SIZE.txt_14,
                                            fontFamily: FONTS.FontSemiBold,
                                            alignSelf: 'center',
                                            padding: 2,
                                        }}>
                                        {rightButtonText}
                                    </Text>
                                </TouchableOpacity>
                            ) : null}

                            {/* <TouchableOpacity
                                style={{
                                    width: 100,
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    backgroundColor: COLORS.gry_light,
                                    borderRadius: 5,
                                    marginLeft: 10,
                                    padding: 3,
                                }}
                                activeOpacity={1}
                                onPress={onPressLeftButton}>
                                <Text
                                    allowFontScaling={false}
                                    style={{
                                        color: COLORS.white_txt,
                                        fontSize: FONTS_SIZE.txt_14,
                                        fontFamily: FONTS.FontRegular,
                                        alignSelf: 'center',
                                        padding: 2,
                                    }}>
                                    {leftButtonText}
                                </Text>
                            </TouchableOpacity> */}
                        </View>

                    </View>
                </View>
            </Modal>
        );
    }
}
