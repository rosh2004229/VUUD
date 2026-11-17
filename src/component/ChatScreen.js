import React, { useState, useEffect, useRef, useCallback } from "react";
import { GiftedChat, Send, InputToolbar } from "react-native-gifted-chat";
import Bubble from "../ChatCommon/Bubble";
import { COLORS, analyticsLog, FONTS_SIZE } from "../common/utils";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Keyboard,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import database from "@react-native-firebase/database";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import ChatHeader from "../common/ChatHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Sound from "react-native-nitro-sound";
import storage from "@react-native-firebase/storage";

const ImagePicker = require("react-native-image-picker");

const ChatScreen = ({ route, navigation }) => {
  const item = route?.params?.item || {};
  const insets = useSafeAreaInsets();
  const messagesContainerRef = useRef(null);
  const messagesCollectionRef = useRef(null);
  const listenerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [user_id, setUser_id] = useState("");
  const [startAudio, setStartAudio] = useState(false);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    AsyncStorage.setItem("isBackScreen", "true").catch(console.error);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setMessages([]);
      analyticsLog("ChatList_screen");
      let isActive = true;

      const getData = async () => {
        try {
          const userId = await AsyncStorage.getItem("user_id");
          if (!isActive || !userId) return;
          setUser_id(userId);

          const chatId = (() => {
            const toUserId = Number(item.id) || 0;
            const myUserId = Number(userId) || 0;
            return toUserId > myUserId
              ? `${toUserId}-${myUserId}`
              : `${myUserId}-${toUserId}`;
          })();

          const collection = database().ref(`/chat/${chatId}`);
          messagesCollectionRef.current = collection;

          const listener = collection.on("value", snapshot => {
            if (!isActive) return;
            const data = snapshot.val();
            if (!data || !Array.isArray(data.messages)) {
              setMessages([]);
              return;
            }

            const formattedMessages = data.messages.map(node => ({
              _id: node._id,
              text: node.text || "",
              createdAt: node.createdAt ? new Date(node.createdAt) : new Date(),
              user: {
                _id: node.user?._id,
                name: node.user?.name || "",
                avatar: node.user?.avatar || "",
              },
              ...(node.image ? { image: node.image } : {}),
              ...(node.audio ? { audio: node.audio } : {}),
              ...(node.type ? { type: node.type } : {}),
            }));

            setMessages(formattedMessages);
          });

          listenerRef.current = listener;
        } catch (error) {
          console.error("Failed to load chat:", error);
        }
      };

      getData();

      return () => {
        isActive = false;
        if (messagesCollectionRef.current && listenerRef.current) {
          messagesCollectionRef.current.off("value", listenerRef.current);
        }
        messagesCollectionRef.current = null;
        listenerRef.current = null;
      };
    }, [item.id, item.name, item.profileImgUrl])
  );

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
      setTimeout(() => {
        messagesContainerRef.current?.scrollToOffset?.({ offset: 0, animated: true });
      }, 150);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const messageIdGenerator = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  const onGetData = async msg => {
    try {
      const isInternetGranted = await InternetPermission.checkInternetPermissions();
      if (!isInternetGranted) return;

      const data = new FormData();
      data.append("user_id", user_id);
      data.append("influencer_id", item.id != null ? String(item.id) : "0");
      data.append("description", msg);
      await APIWebCall.onLastMessageUpdatedAPICall(data);
    } catch (error) {
      console.error("Failed to update last message:", error);
    }
  };

  const onSend = async (newMessages = []) => {
    const rawText = (newMessages[0]?.text || inputText || "").trim();
    setInputText("");

    if (!rawText || !messagesCollectionRef.current) return;

    const messageObj = {
      _id: messageIdGenerator(),
      text: rawText,
      createdAt: new Date().toISOString(),
      user: {
        _id: Number(user_id) || 0,
        name: "",
        avatar: "",
      },
      type: "text",
      from: user_id,
      to: Number(item.id) || 0,
      is_read: false,
      is_delete: false,
    };

    try {
      await messagesCollectionRef.current.update({
        messages: [messageObj, ...messages],
      });
      if (user_id) onGetData(messageObj.text);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const renderBubble = props => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: { backgroundColor: COLORS.backgroundcolor },
      }}
    />
  );

  const renderSend = props => {
    const hasText = !!(props.text?.trim() || inputText.trim());

    return (
      <Send
        {...props}
        text={inputText}
        disabled={!hasText}
        containerStyle={{
          width: 40,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: hasText ? COLORS.primary : "#E0E0E0",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 18,
              height: 18,
              tintColor: COLORS.white_txt,
              marginLeft: 2,
            }}
            resizeMode="contain"
            source={require("../assets/send.png")}
          />
        </View>
      </Send>
    );
  };

  const handleAudio = async () => {
    try {
      if (!startAudio) {
        setStartAudio(true);
        await Sound.startRecorder();
      } else {
        setStartAudio(false);
        const audioPath = await Sound.stopRecorder();
        audioUpload(audioPath, `${messageIdGenerator()}.aac`);
      }
    } catch (error) {
      setStartAudio(false);
      console.error("Audio recording failed:", error);
    }
  };

  const audioUpload = (path, name) => {
    const toUserId = String(item.id ?? 0);
    const reference = storage().ref().child(`sounds/${toUserId}_${Date.now()}.mp3`);

    reference.putFile(path).then(() => reference.getDownloadURL()).then(downloadURL => {
      const messageObj = {
        _id: messageIdGenerator(),
        text: "",
        createdAt: new Date().toISOString(),
        user: {
          _id: Number(user_id) || 0,
          name: item.name || "",
          avatar: item.profileImgUrl || "",
        },
        type: "audio",
        audio: downloadURL,
        from: user_id,
        to: Number(item.id) || 0,
        is_read: false,
        is_delete: false,
        messageType: "audio",
      };

      if (messagesCollectionRef.current) {
        messagesCollectionRef.current.update({ messages: [messageObj, ...messages] });
      }
      if (user_id) onGetData(downloadURL);
    }).catch(error => console.error("Audio upload failed:", error));
  };

  const handleAddPicture = () => {
    const options = {
      mediaType: "photo",
      selectionLimit: 1,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      uploadImageToStorage(asset.uri, asset.fileName || `${messageIdGenerator()}.jpg`);
    });
  };

  const uploadImageToStorage = (path, name) => {
    const reference = storage().ref(`${item.id ?? 0}/${name}`);

    reference.putFile(path).then(() => reference.getDownloadURL()).then(downloadURL => {
      const messageObj = {
        _id: messageIdGenerator(),
        text: "",
        audio: "",
        createdAt: new Date().toISOString(),
        user: {
          _id: Number(user_id) || 0,
          name: item.name || "",
          avatar: item.profileImgUrl || "",
        },
        type: "image",
        image: downloadURL,
        from: user_id,
        to: Number(item.id) || 0,
        is_read: false,
        is_delete: false,
        messageType: "image",
      };

      if (messagesCollectionRef.current) {
        messagesCollectionRef.current.update({ messages: [messageObj, ...messages] });
      }
      if (user_id) onGetData(downloadURL);
    }).catch(error => console.error("Image upload failed:", error));
  };

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: COLORS.white_original || "#FFFFFF",
        borderTopWidth: 0.5,
        borderTopColor: "#EEEEEE",
        paddingTop: 6,
        paddingBottom: isKeyboardVisible ? 6 : Math.max(insets.bottom, 6),
        paddingHorizontal: 8,
        justifyContent: "center",
      }}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  const renderComposer = props => (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F4F7",
        borderRadius: 22,
        paddingHorizontal: 12,
        marginRight: 6,
        minHeight: 40,
      }}
    >
      <TextInput
        value={inputText}
        onChangeText={text => {
          setInputText(text);
          if (props.textInputProps?.onChangeText) {
            props.textInputProps.onChangeText(text);
          }
          if (props.onTextChanged) {
            props.onTextChanged(text);
          }
        }}
        placeholder="Type a message..."
        placeholderTextColor="#8E8E93"
        selectionColor={COLORS.primary}
        multiline={true}
        scrollEnabled={true}
        style={{
          flex: 1,
          color: COLORS.black_txt || "#0A0303",
          fontSize: FONTS_SIZE.txt_14 || 14,
          lineHeight: 20,
          paddingTop: Platform.OS === "ios" ? 8 : 6,
          paddingBottom: Platform.OS === "ios" ? 8 : 6,
          paddingHorizontal: 4,
          maxHeight: 100,
        }}
      />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleAddPicture}
        style={{ padding: 4, justifyContent: "center", alignItems: "center" }}
      >
        <Image
          source={require("../assets/gallery_icon.png")}
          style={{
            height: 22,
            width: 22,
            tintColor: COLORS.primary,
            resizeMode: "contain",
          }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white_txt }}
      edges={["top"]}
    >
      <StatusBar
        backgroundColor={COLORS.white_txt}
        barStyle="dark-content"
        translucent={false}
      />
      <ChatHeader
        btnText={item.name || ""}
        onBackPress={() => {
          navigation.goBack();
          setMessages([]);
        }}
        rightIcon={
          item.profileImgUrl
            ? { uri: item.profileImgUrl }
            : require("../assets/user_pro.png")
        }
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#F7F8FA",
        }}
      >
        <GiftedChat
          messagesContainerRef={messagesContainerRef}
          messages={messages}
          onSend={onSend}
          text={inputText}
          onInputTextChanged={text => setInputText(text)}
          user={{
            _id: Number(user_id) || 0,
            name: "",
            avatar: "",
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          alwaysShowSend
          minInputToolbarHeight={54}
          placeholder="Type a message..."
          scrollToBottom
          scrollToBottomComponent={() => (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
                elevation: 4,
              }}
            >
              <Image
                source={require("../assets/back.png")}
                style={{
                  width: 14,
                  height: 14,
                  tintColor: "#FFFFFF",
                  transform: [{ rotate: "-90deg" }],
                }}
              />
            </View>
          )}
          keyboardAvoidingViewProps={{
            enabled: true,
            behavior: "padding",
            keyboardVerticalOffset: insets.top + 54 + (Platform.OS === "android" ? 24 : 0),
          }}
          listViewProps={{
            keyboardShouldPersistTaps: "handled",
            keyboardDismissMode: "on-drag",
            showsVerticalScrollIndicator: true,
          }}
          messagesContainerStyle={{ backgroundColor: "#F7F8FA" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
