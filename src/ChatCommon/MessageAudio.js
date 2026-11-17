import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import Slider from "@react-native-community/slider";
import { createSound } from "react-native-nitro-sound";
import { COLORS } from "../common/utils";

const PLAYICON = require("../assets/play_icon.png");
const PAUSEICON = require("../assets/pause_icon.png");

const MessageAudio = ({ position = "left", currentMessage = {}, containerStyle = {} }) => {
  const [playSeconds, setPlaySeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isSeekingRef = useRef(false);
  const audioPlayerRef = useRef(null);

  if (!audioPlayerRef.current) {
    audioPlayerRef.current = createSound();
  }

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.stopPlayer().catch(() => {});
        audioPlayerRef.current.removePlayBackListener();
      }
    };
  }, []);

  const getAudioTimeString = (seconds) => {
    const totalSecs = Math.max(0, Math.floor(seconds || 0));
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const onPlay = async () => {
    const audioUrl = currentMessage.audio;
    if (!audioUrl) return;

    try {
      setIsPlaying(true);
      await audioPlayerRef.current.startPlayer(audioUrl);
      audioPlayerRef.current.addPlayBackListener((e) => {
        if (!isSeekingRef.current) {
          const currentPosSec = (e.currentPosition || 0) / 1000;
          const durationSec = (e.duration || 0) / 1000;
          setPlaySeconds(currentPosSec);
          if (durationSec > 0) {
            setDuration(durationSec);
          }
          if (e.currentPosition >= e.duration && e.duration > 0) {
            audioPlayerRef.current.stopPlayer().catch(() => {});
            setIsPlaying(false);
            setPlaySeconds(0);
          }
        }
      });
    } catch (error) {
      console.log("Audio playback error:", error);
      setIsPlaying(false);
    }
  };

  const onPause = async () => {
    try {
      await audioPlayerRef.current.pausePlayer();
      setIsPlaying(false);
    } catch (error) {
      console.log("Audio pause error:", error);
    }
  };

  const onSliderValueChange = (value) => {
    setPlaySeconds(value);
  };

  const onSlidingComplete = async (value) => {
    isSeekingRef.current = false;
    try {
      await audioPlayerRef.current.seekToPlayer(Math.floor(value * 1000));
    } catch (e) {
      console.log("Audio seek error:", e);
    }
  };

  if (!currentMessage.audio) {
    return null;
  }

  const textColor = position === "right" ? COLORS.white_txt : COLORS.black_txt;

  return (
    <View style={[styles[position].container, containerStyle[position]]}>
      <View
        style={{
          width: 230,
          flexDirection: "row",
          height: 60,
          alignItems: "center",
          paddingHorizontal: 15,
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={isPlaying ? onPause : onPlay}
          style={{
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 24,
              height: 24,
              tintColor: textColor,
            }}
            source={isPlaying ? PAUSEICON : PLAYICON}
          />
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Text
            style={{
              color: textColor,
              fontSize: 11,
              minWidth: 32,
              textAlign: "right",
            }}
          >
            {getAudioTimeString(playSeconds)}
          </Text>

          <Slider
            style={{
              flex: 1,
              height: 40,
              marginHorizontal: 4,
            }}
            value={playSeconds}
            minimumValue={0}
            maximumValue={duration > 0 ? duration : Math.max(playSeconds, 1)}
            minimumTrackTintColor={position === "right" ? "#fff" : COLORS.colorPrimary}
            maximumTrackTintColor={position === "right" ? "rgba(255,255,255,0.4)" : "#ccc"}
            thumbTintColor={position === "right" ? "#fff" : COLORS.colorPrimary}
            onSlidingStart={() => {
              isSeekingRef.current = true;
            }}
            onValueChange={onSliderValueChange}
            onSlidingComplete={onSlidingComplete}
          />

          <Text
            style={{
              color: textColor,
              fontSize: 11,
              minWidth: 32,
            }}
          >
            {getAudioTimeString(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = {
  left: StyleSheet.create({
    container: {},
  }),
  right: StyleSheet.create({
    container: {},
  }),
};

MessageAudio.propTypes = {
  position: PropTypes.oneOf(["left", "right"]),
  currentMessage: PropTypes.object,
  containerStyle: PropTypes.object,
};

export default MessageAudio;
