import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import { activeOpacity, COLORS, FONTS_SIZE } from "../common/utils";

import Loader from "../common/LoadingScreen";
import ZoomableImage from "./ZoomableImage";
import { Carousel } from "react-native-reanimated-carousel";

const { width: sWidth, height: sHeight } = Dimensions.get("window");
const mediaHeight = sWidth * 0.86;
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";
import Video from 'react-native-video';
import { useFocusEffect } from "@react-navigation/native";

function ImageDetailPage({ route, navigation }) {
  const { allDataItem } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [paused, setPaused] = useState(true);

  const handleBackButtonClick = useCallback(() => {
    setPaused(true);
    setTimeout(() => {
      navigation.goBack(null);
    }, 200);
    return true;
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      if (allDataItem?.length > currentIndex) {
        if (allDataItem[currentIndex] != null) {
          if (allDataItem[currentIndex].type != "video") {
            setPaused(true);
          }
        }
      }
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
      return () => {
        subscription.remove();
      };
    }, [currentIndex, allDataItem, handleBackButtonClick])
  );

  const _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {/* {item.type === 'video' ? (
          <Video
            source={{ uri: item.illustration }}
            resizeMode="contain"
            paused={paused}
            controls={true}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        ) : (
          <FastImage
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: item.illustration,
              priority: FastImage.priority.high,
            }}
          />
        )} */}
        {item.type === "video" ? (
          <Video
            source={{ uri: item.illustration }}
            resizeMode="contain"
            paused={paused}
            controls={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : null}

        {item.type === "image" && paused === true ? (
          <FastImage
            style={{
              width: "100%",
              height: "100%",
            }}
            resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: item.illustration,
              priority: FastImage.priority.high,
            }}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.black_txt,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <ZoomableImage
        source={{ uri: imgLink }}
        minScale={1}
        maxScale={3}
        imageWidth={sWidth}
        imageHeight={sHeight}
        style={{
          width: sWidth,
          height: sHeight,
        }}
       
      /> */}

      {allDataItem.length > 0 ? (
        <Carousel
          loop={false}
          style={{ width: wp(100), height: mediaHeight }}
          width={wp(100)}
          height={mediaHeight}
          data={allDataItem}
          onSnapToItem={(index) => {
            setCurrentIndex(index);
            if (allDataItem?.[index]?.type === "video") {
              setPaused(false);
            } else {
              setPaused(true);
            }
          }}
          renderItem={({ item, index }) => _renderItem({ item, index })}
        />
      ) : null}

      <TouchableOpacity
        style={{
          width: 50,
          height: 50,
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          top: 35,
          left: 10,
          backgroundColor: COLORS.color_transparent_black,
        }}
        activeOpacity={activeOpacity}
        onPress={() => {
          handleBackButtonClick();
        }}
      >
        <Image
          source={require("../assets/close_icon.png")}
          style={{ width: 15, height: 15, tintColor: COLORS.white_txt }}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Loader loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  itemSizeStyle: {
    height: sWidth * 0.86,
    width: sWidth,
  },
});

export default ImageDetailPage;
