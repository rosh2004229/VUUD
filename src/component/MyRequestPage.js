import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ToolbarBackButton from '../common/ToolbarBackButton';
import { COLORS, IMG_BASE_URL } from '../common/utils';
import InternetPermission from '../common/InternetPermission';
import APIWebCall from '../common/APIWebCall';
import Loader from '../common/LoadingScreen';
import SnackBarCommon from '../common/SnackBarCommon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutDialog from '../common/LogoutDialog';
import EmptyView from '../common/EmptyView';
import ToolbarHeaderText from '../common/ToolbarHeaderText';
import ItemRequestmyItem from '../ItemView/ItemRequestmyItem';
import { useFocusEffect } from '@react-navigation/native';
import MyRequestFilterModal from '../common/MyRequestFilterModal';

const RequestPage = ({ navigation, route }) => {
  const [myRequestArr, setMyRequestArray] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [clickedItem, setClickedItem] = useState({});
  const [isAccept, setIsAccept] = useState(false);
  const [isConfirmAlertShow, setIsConfirmAlertShow] = useState(false);
  const [filterDialogVisible, setfilterDialogVisible] = useState(false);
  const [clearFilterVisible, setclearFilterVisible] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      onGetData()
    }, [])
  );

  const onGetData = async () => {
    var selectFilterCity_edit = await AsyncStorage.getItem('selectFilterCity_edit');
    console.log("selectFilterCity_edit===", selectFilterCity_edit);

    var isBackScreen = await AsyncStorage.getItem("isBackScreen")

    if (isBackScreen === "true") {
      AsyncStorage.setItem("isBackScreen", "false");
    } else {
      if (selectFilterCity_edit === null) {
        setMyRequestArray([]);
        getData("", "", "");
      } else {
        setfilterDialogVisible(true);
        setclearFilterVisible(false)
      }
    }
  }

  const getData = async (city, start_date, end_date) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    var user_id = await AsyncStorage.getItem('user_id');
    var data = new FormData();
    data.append('user_id', user_id);
    data.append('city', city);
    data.append('start_date', start_date);
    data.append('end_date', end_date);
    if (isInternetGranted == true) {
      setisLoading(true);
      onMyRequestListAPICall(data);
      console.log("onMyRequestListAPICall-------->", data);
    }
  };

  const onMyRequestListAPICall = async (data) => {
    setisLoading(true);
    APIWebCall.onMyRequestListAPICall(data)
      .then(async (response) => {
        setisLoading(false);
        console.log("response.data.user.length------>", response.data.user.length);
        if (response.data.user != undefined && response.data.user.length > 0)
          AsyncStorage.removeItem('selectFilterCity_edit');
        setMyRequestArray(response.data.user);
      })
      .catch((err) => {
        setisLoading(false);
        setTimeout(() => {
          SnackBarCommon({ text: err.message });
        }, 120);
      })
      .finally(() => setisLoading(false));
  };

  const onAcceptOrRejectClickCall = async () => {
    var data = new FormData();
    console.log({ clickedItem });
    data.append('id', clickedItem.id);
    onCancelRequestAPICall(data);
  };

  const onCancelRequestAPICall = async (data) => {
    var isInternetGranted = await InternetPermission.checkInternetPermissions();
    if (isInternetGranted == true) {
      setisLoading(true);
      APIWebCall.onCancelRequestAPICall(data)
        .then(async (response) => {
          setisLoading(false);
          SnackBarCommon({ text: response.message });
          getData("", "", "");
          setclearFilterVisible(false)
        })
        .catch((err) => {
          setisLoading(false);
          setTimeout(() => {
            SnackBarCommon({ text: err.message });
          }, 120);
        })
        .finally(() => setisLoading(false));
    }
  };

  const onMyRequestClick = async (item) => {
    navigation.navigate('MyRequestDetailPage', { item: item });
  };

  const handleSendMessage = (item) => {
    navigation.navigate('ChatScreen', {
      item: {
        id:
          item.user.id != undefined && item.user.id != null ? item.user.id : 0,
        name:
          item.user != undefined && item.user != null && item.user.fullname != undefined && item.user.fullname != null
            ? item.user.fullname
            : '',
        profileImgUrl:
          item.user != undefined && item.user != null &&
            item.user.image != undefined &&
            item.user.image != null &&
            item.user.image != ''
            ? IMG_BASE_URL + item.user.image
            : '',
      },
    });
  };

  const clearFilter = () => {
    getData("", "", "");
    setclearFilterVisible(false)
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white_txt,
      }}
    >
      <ToolbarBackButton
        btnText={'My Requests'}
        onBackPress={() => navigation.goBack()}
      />

      {
        clearFilterVisible != true ? (
          <TouchableOpacity style={{ position: "absolute", top: 25, right: 20, }} onPress={() => setfilterDialogVisible(true)}>
            <Image source={require("../assets/filter.png")} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={{ position: "absolute", top: 25, right: 20, }} onPress={() => setfilterDialogVisible(true)}>
              <Image source={require("../assets/filter.png")} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>

            <TouchableOpacity style={{ position: "absolute", top: 25, right: 50 }} onPress={() => clearFilter()}>
              <Image source={require("../assets/clear-filter.png")} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
          </>
        )
      }

      <FlatList
        data={myRequestArr}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
          marginTop: 5,
        }}
        renderItem={({ item, index }) => {
          return (
            <ItemRequestmyItem
              item={item}
              onItemClick={() => {
                onMyRequestClick(item);
              }}
              onCancelClick={() => {
                setIsAccept(false);
                setClickedItem(item);
                setIsConfirmAlertShow(true);
              }}
              sendMessage={() => handleSendMessage(item)}
            />
          );
        }}
        ListEmptyComponent={() => {
          return isLoading === false ? (
            <EmptyView msgText={'No data found'} />
          ) : null;
        }}
        keyExtractor={(_, index) => index.toString()}
      // onEndReachedThreshold={0.05}
      // onEndReached={fetchMoreData}
      // onRefresh={onRefresh}
      // refreshing={isRefresh}
      />

      <MyRequestFilterModal
        navigation={navigation}
        isDialogVisible={filterDialogVisible}
        modalTitle={"Search My Requests"}
        onPressClose={() => {
          setfilterDialogVisible(false);
          // setclearFilterVisible(false)
        }}
        onSubmitClose={(city, start_date, end_date) => {
          setclearFilterVisible(true)
          setfilterDialogVisible(false);
          getData(city, start_date, end_date)
        }}
      />

      <LogoutDialog
        loading={isConfirmAlertShow}
        msg_title={'Alert!'}
        msg_text={`Do you really want to cancel?`}
        leftButtonText={'NO'}
        rightButtonText={'YES'}
        onPressRightButton={() => {
          setIsConfirmAlertShow(false);
          onAcceptOrRejectClickCall();
        }}
        onPressLeftButton={() => setIsConfirmAlertShow(false)}
      />

      <Loader loading={isLoading} />
    </View>
  );
};

export default RequestPage;
