import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import ButtonView from "../common/ButtonView";
import ToolbarBackButton from "../common/ToolbarBackButton";
import { COLORS, FONTS, FONTS_SIZE } from "../common/utils";

function RequestSendSuccessful({ route, navigation }) {
  const { meg } = route.params;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_original,
        //  marginTop: 30,
      }}
    >
      <View style={{ width: "100%", height: 60 }}>
        <ToolbarBackButton
          btnText={"Successful!"}
          onBackPress={() => navigation.goBack(null)}
        ></ToolbarBackButton>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{}}
      >
        <View style={{ flexDirection: "column", padding: 15 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Image
              style={{
                width: 250,
                height: 250,
              }}
              // source={require('../assets/success.gif')}
              source={{
                uri: "https://i.pinimg.com/originals/32/b6/f2/32b6f2aeeb2d21c5a29382721cdc67f7.gif",
              }}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                color: COLORS.colorBlack,
                fontSize: FONTS_SIZE.txt_15,
                textAlign: "center",
                textAlignVertical: "center",
                alignItems: "center",
                justifyContent: "center",
                alignContent: "center",
                alignSelf: "center",
                fontFamily: FONTS.FontMedium,
                includeFontPadding: false,
                marginLeft: 5,
                marginRight: 5,
              }}
            >
              {meg}
            </Text>
          </View>

          <Image
            style={{
              width: 150,
              height: 150,
              marginTop: 20,
              alignSelf: "center",
            }}
            source={require("../assets/thumbs_up.gif")}
          />

          <View
            style={{
              marginTop: 40,
              width: "80%",

              alignSelf: "center",
            }}
          >
            <ButtonView
              backgroundColor={COLORS.colorGreen}
              btnText={"OK"}
              btntxColor={COLORS.white_original}
              borderColor={COLORS.gry_light}
              onPress={() => navigation.goBack(null)}
              fontSize={FONTS_SIZE.txt_15}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default RequestSendSuccessful;
