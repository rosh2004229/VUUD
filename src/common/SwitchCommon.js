import React, { Component, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { COLORS, FONTS_SIZE, FONTS } from "../common/utils";

function SwitchCommon({ onValueChange, value }) {
  return (
    <Switch
      style={{
        height: 35,
        marginLeft: 10,
        transform:
          Platform.OS === "ios"
            ? [{ scaleX: 0.8 }, { scaleY: 0.8 }]
            : [{ scaleX: 1.1 }, { scaleY: 1.1 }],
      }}
      trackColor={{ false: "#767577", true: COLORS.primary }}
      tintColor={COLORS.primary}
      thumbColor={"#eb297b"}
      onValueChange={onValueChange}
      value={value}
    />
  );
}

export default SwitchCommon;
