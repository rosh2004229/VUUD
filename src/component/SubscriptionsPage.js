import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTS_SIZE } from '../common/utils'
import TextCommonSemiBlod from '../common/TextCommonSemiBlod'
import ToolbarBackButton from '../common/ToolbarBackButton'

const SubscriptionsPage = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            backgroundColor: COLORS.white_txt
        }}>
            <ToolbarBackButton
                btnText={'Subscriptions'}
                onBackPress={() => navigation.goBack()}
            />
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <TextCommonSemiBlod
                    text={"Comming Soon !!"}
                    fontSize={FONTS_SIZE.txt_20}
                    fontWeight={'500'}
                    color={COLORS.black_txt}
                />
            </View>

        </View>
    )
}

export default SubscriptionsPage