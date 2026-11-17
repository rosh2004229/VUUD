import React, { useEffect } from "react";
import {
  View,
  StatusBar,
  Platform,
  LogBox,
} from "react-native";
import RootStack from "./Routes";
import { NavigationContainer } from "@react-navigation/native";
import { COLORS, FONTS, FONTS_SIZE } from "./common/utils";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App() {
  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent={Platform.OS === "ios"}
            backgroundColor={
              Platform.OS === "ios" ? COLORS.white_txt : COLORS.black_txt
            }
            barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"}
          />
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
          <FlashMessage
            position="top"
            statusBarHeight={Platform.OS === "ios" ? 30 : 5}
            titleStyle={{
              fontFamily: FONTS.FontRegular,
              fontSize: FONTS_SIZE.txt_14,
              color: COLORS.white_txt,
            }}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
