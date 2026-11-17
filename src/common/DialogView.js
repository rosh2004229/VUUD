import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import TextCommonMedium from './TextCommonMedium';
import { COLORS, FONTS_SIZE } from './utils';
import Modal from 'react-native-modal';
import TextCommonregular from './TextCommonregular';

function DialogView({ isVisible, title, titleMeg, onBtnClick }) {
    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver={true}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <View
                style={{
                    width: '85%',
                    height: 200,
                    backgroundColor: COLORS.white_txt,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 15,
                }}>
                <TextCommonMedium
                    text={title}
                    color={COLORS.black_txt}
                    fontSize={FONTS_SIZE.txt_18}
                    textAlign={'center'}
                    fontWeight={'600'}
                />

                <TextCommonregular
                    text={titleMeg}
                    color={COLORS.black_txt}
                    fontSize={FONTS_SIZE.txt_14}
                    textAlign={'center'}
                    fontWeight={'400'}
                    marginTop={10}
                />


                <TouchableOpacity
                    onPress={onBtnClick}
                    style={{
                        width: '40%',
                        height: 35,
                        backgroundColor: COLORS.yellow_light,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        marginTop: 20,
                    }}>
                    <TextCommonMedium
                        text={'OK'}
                        color={COLORS.colorWhite}
                        fontSize={FONTS_SIZE.txt_14}
                        textAlign={'center'}
                    />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

export default DialogView;
