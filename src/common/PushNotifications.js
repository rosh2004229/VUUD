import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import InternetPermission from "../common/InternetPermission";
import APIWebCall from "../common/APIWebCall";
import useAsyncStorageCommon from "./AsyncStorageCommon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import Geolocation from "react-native-geolocation-service";
import { PERMISSIONS } from "react-native-permissions";
import permission from "./permission";
import { LOCATION_CONFIG } from "./utils";

const createDefaultChannel = async () => {
  if (Platform.OS === "android") {
    try {
      await notifee.createChannel({
        id: "arty-notification-channel-id",
        name: "Arty Learning",
        description: "Notifications for new messages and updates.",
        importance: AndroidImportance.HIGH,
        sound: "default",
        vibration: true,
      });
    } catch (e) {
      console.warn("Failed to create notification channel:", e);
    }
  }
};

const PushNotifications = ({ navigation }) => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [deviceVersion, setDeviceVersion] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");

  const { setItem: setNotiCount } = useAsyncStorageCommon("noti_count");

  useEffect(() => {
    createDefaultChannel();

    const fetchDeviceInfo = async () => {
      try {
        setDeviceName(await DeviceInfo.getDeviceName());
        setDeviceId(DeviceInfo.getDeviceId());
        setDeviceVersion(await DeviceInfo.getSystemVersion());
      } catch (error) {
        console.error("Device info error:", error);
      }
    };

    fetchDeviceInfo();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let locationEnabled = false;

      if (Platform.OS === "ios") {
        await permission.checkMultiplePermissions([
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          PERMISSIONS.IOS.LOCATION_ALWAYS,
        ]);
        locationEnabled = await permission.checkPermission(
          PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        );
      } else {
        await permission.checkMultiplePermissions([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ]);
        locationEnabled = await permission.checkPermission(
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        );
        if (!locationEnabled) {
          locationEnabled = await permission.checkPermission(
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
          );
        }
      }

      if (locationEnabled) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLatitude(String(position.coords.latitude));
            setLongitude(String(position.coords.longitude));
          },
          (error) => console.warn("Location error:", error.message),
          LOCATION_CONFIG
        );
      } else {
        console.warn("Location permission not granted.");
      }
    } catch (error) {
      console.warn("Location setup error:", error);
    }
  };

  const onAddDevicesAPICall = (data) => {
    APIWebCall.onFCMTokenAPICall(data, navigation).catch((error) => {
      console.log("FCM token API error:", error);
    });
  };

  const registerTokenAPICall = async (fcmToken) => {
    try {
      const isInternetGranted =
        await InternetPermission.checkInternetPermissions();
      const userId = await AsyncStorage.getItem("user_id");

      if (isInternetGranted && userId) {
        const data = new FormData();
        data.append("user_id", userId);
        data.append("push_token", fcmToken);
        data.append("device_name", deviceName);
        data.append("device_id", deviceId);
        data.append("device_version", deviceVersion);
        data.append("latitude", String(latitude));
        data.append("longitude", String(longitude));
        data.append("type", Platform.OS === "ios" ? "ios" : "android");
        onAddDevicesAPICall(data);
      }
    } catch (error) {
      console.log("Register FCM token error:", error);
    }
  };

  const getNotificationCount = async () => {
    try {
      const userId = await AsyncStorage.getItem("user_id");

      if (!userId) {
        setNotiCount("0");
        return;
      }

      const data = new FormData();
      data.append("user_id", userId);
      const response = await APIWebCall.onNotificationCount(data);
      const count = response?.data?.notificationcount ?? 0;
      setNotiCount(String(count));
    } catch (error) {
      console.log("Notification count error:", error);
    }
  };

  const onPressNotification = (data) => {
    console.log("Notification pressed:", data);
  };

  useEffect(() => {
    let unsubscribeOnMessage;
    let unsubscribeOnNotificationOpened;
    let unsubscribeForegroundEvent;
    let isMounted = true;

    const setupNotifications = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled || !isMounted) {
          await getNotificationCount();
          return;
        }

        const fcmToken = await messaging().getToken();

        if (isMounted) {
          await registerTokenAPICall(fcmToken);
          await getNotificationCount();

          unsubscribeForegroundEvent = notifee.onForegroundEvent(
            ({ type, detail }) => {
              if (
                type === EventType.PRESS &&
                detail.notification &&
                detail.notification.data
              ) {
                onPressNotification(detail.notification.data);
              }
            }
          );
        }

        unsubscribeOnMessage = messaging().onMessage(
          async (remoteMessage) => {
            console.log("Foreground FCM message:", remoteMessage);
            await getNotificationCount();

            const data = remoteMessage.data || {};
            const title =
              data.title ||
              remoteMessage.notification?.title ||
              "New notification";
            const body =
              data.body ||
              remoteMessage.notification?.body ||
              "You have a new message";

            if (Platform.OS === "android") {
              await notifee.displayNotification({
                title: title,
                body: body,
                data: data,
                android: {
                  channelId: "arty-notification-channel-id",
                  smallIcon: "ic_notification",
                  importance: AndroidImportance.HIGH,
                  pressAction: {
                    id: "default",
                  },
                },
              });
            }
          }
        );

        unsubscribeOnNotificationOpened =
          messaging().onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage?.data) {
              onPressNotification(remoteMessage.data);
            }
          });

        const initialNotification =
          await messaging().getInitialNotification();

        if (initialNotification?.data && isMounted) {
          onPressNotification(initialNotification.data);
        }
      } catch (error) {
        console.log("Push notification setup error:", error);
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
      unsubscribeOnMessage?.();
      unsubscribeOnNotificationOpened?.();
      unsubscribeForegroundEvent?.();
    };
  }, []);

  return null;
};

export default PushNotifications;
