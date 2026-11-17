import React, { useState, useEffect } from "react";
import { GiftedChat, Send, Composer } from "react-native-gifted-chat";
import Bubble from "../ChatCommon/Bubble";
import { COLORS, analyticsLog } from "../common/utils";
import { View, Image, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import ChatHeader from "../common/ChatHeader";

const ChatScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [messages, setMessages] = useState([]);
  const [user_id, setUser_id] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      setMessages([]);
      analyticsLog("ChatList_screen");
      getData();
    }, [item])
  );

  const generateChatId = (myUser_id) => {
    const toUserId = item.id || 0;
    return toUserId > myUser_id
      ? `${toUserId}-${myUser_id}`
      : `${myUser_id}-${toUserId}`;
  };

  const getData = async () => {
    const user_id_db = await AsyncStorage.getItem("user_id");
    if (user_id_db) {
      setUser_id(user_id_db);
      const chatId = generateChatId(user_id_db);

      firestore()
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          if (!querySnapshot || querySnapshot.empty) {
            console.log("No messages found or querySnapshot is null.");
            return;
          }

          const fetchedMessages = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("data", data.createdAt);

            return {
              _id: data._id,
              text: data.text,
              createdAt: data.createdAt, // Handle missing timestamp
              user: {
                _id: data.user._id,
                name: data.user.name || "",
                avatar: data.user.avatar || "",
              },
            };
          });
          setMessages(fetchedMessages);
        });
    }
  };

  const onSend = async (newMessages = []) => {
    if (!newMessages.length) return;

    const chatId = generateChatId(user_id);
    const messageObj = {
      _id: newMessages[0]._id,
      text: newMessages[0].text,
      createdAt: new Date().toString(),
      user: {
        _id: user_id,
        name: item.name || "",
        avatar: item.profileImgUrl || "",
      },
      type: "text",
    };

    await firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add(messageObj);
  };

  return (
    <View style={{ flex: 1 }}>
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
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user_id,
          name: item.name || "",
          avatar: item.profileImgUrl || "",
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{ left: { backgroundColor: COLORS.backgroundcolor } }}
          />
        )}
        renderSend={(props) => (
          <Send {...props} disabled={!props.text}>
            <Image
              style={{ width: 30, height: 30, tintColor: COLORS.primary }}
              source={require("../assets/send.png")}
            />
          </Send>
        )}
      />
    </View>
  );
};

export default ChatScreen;
