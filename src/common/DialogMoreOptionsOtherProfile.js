import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import TextCommonregular from '../common/TextCommonregular';
import { COLORS, FONTS_SIZE } from '../common/utils';

function DialogMoreOptionsOtherProfile({
    navigation,
    reportClick,
    cancelClick,
    isDialogVisible,
    toggleModalClick,
    item,
    user_id,
    BlockClick,
    title_report,
    title_block,
}) {
    var formUserid;

    return (
        <Modal
            animationIn={'fadeInDown'}
            animationOut={'fadeOutDown'}
            backdropOpacity={0.8}
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
                    justifyContent: 'flex-end',
                    paddingStart: 15,
                    paddingEnd: 15,
                }}>
                <View
                    backgroundColor={COLORS.white_txt}
                    style={{
                        borderRadius: 10,
                    }}>
                    {formUserid === user_id ? null : (
                        <View>
                            <TouchableOpacity
                                onPress={reportClick}
                                style={{
                                    height: 55,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TextCommonregular
                                    text={title_report}
                                    fontWeight={'500'}
                                    fontSize={FONTS_SIZE.txt_15}
                                    color={COLORS.black_txt}
                                />
                            </TouchableOpacity>

                            <View
                                backgroundColor={COLORS.black_txt}
                                style={{
                                    height: 0.5,
                                }}
                            />
                        </View>
                    )}

                    {formUserid === user_id ? null : (
                        <View>
                            <TouchableOpacity
                                onPress={BlockClick}
                                style={{
                                    height: 55,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <TextCommonregular
                                    text={title_block}
                                    fontWeight={'500'}
                                    fontSize={FONTS_SIZE.txt_15}
                                    color={COLORS.colorBlack}
                                />
                            </TouchableOpacity>
                            <View
                                backgroundColor={COLORS.black_txt}
                                style={{
                                    height: 0.5,
                                }}
                            />
                        </View>
                    )}
                </View>

                <View
                    backgroundColor={COLORS.colorGreen}
                    style={{
                        borderRadius: 5,
                        paddingStart: 10,
                        marginTop: 10,
                        marginBottom: 25,
                        paddingEnd: 10,
                    }}>
                    <TouchableOpacity
                        onPress={cancelClick}
                        style={{
                            height: 55,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <TextCommonregular
                            text={'Cancel'}
                            fontWeight={'500'}
                            fontSize={FONTS_SIZE.txt_15}
                            color={COLORS.white_txt}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default DialogMoreOptionsOtherProfile;
