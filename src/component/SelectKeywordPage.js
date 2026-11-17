import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TouchableOpacity, FlatList, View, Image } from 'react-native';
import { COLORS, FONTS_SIZE, activeOpacity, elevation } from '../common/utils';
import ToolbarBackButton from '../common/ToolbarBackButton';
import TextCommonMedium from '../common/TextCommonMedium';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import InternetPermission from '../common/InternetPermission';
import APIWebCall from '../common/APIWebCall';
import SnackBarCommon from '../common/SnackBarCommon';
import Loader from '../common/LoadingScreen';
var _ = require('lodash');

function SelectKeywordPage({ route, navigation }) {
    const { title, selectedValuesArr } = route.params;

    const [dataList, setDataList] = useState([]);

    const [selected_keyword_Pass_Ayy, setSelected_keyword_Pass_Ayy] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setSelected_keyword_Pass_Ayy([]);
            getSelectedCategory();
        }, []),
    );



    const getSelectedCategory = async () => {
        console.log({selectedValuesArr});

        var isInternetGranted = await InternetPermission.checkInternetPermissions();
        if (isInternetGranted == true) {
            var data = new FormData();
            data.append('filter', "");
            data.append('category_id', "");      
            onGeHashListAPICall(data);
        }
    }

    const onGeHashListAPICall = async (data) => {
        setisLoading(true);
        APIWebCall.onGeHashListAPICall(data)
            .then(async (response) => {
                setisLoading(false);
                var keyword_Ayy = [];
                if (response.data.Hashtag.length> 0   && response.data.Hashtag != undefined && response.data.Hashtag != null) {
                    if (response.data.Hashtag.length > 0) {
                        response.data.Hashtag.forEach(element => {
                            var obj = {
                                name: element.hashtag_name, isSelected: false, id: element.id
                            }
                            keyword_Ayy.push(obj);
                        });
                    }
                   
                    if (selectedValuesArr.length > 0) {
                        const updatedArray = keyword_Ayy.map(item => {
                            const selectedItem = selectedValuesArr.flat().find(selected => selected.id === item.id);
                            console.log({
                                selectedItem
                            });
                            if (selectedItem) {
                                return { ...item, isSelected: !selectedItem.isSelected };
                            }
                            return item;
                        });
                       
                        setDataList(updatedArray);
                    }
                    else {
                        setDataList(keyword_Ayy);
                    }

                }

            })
            .catch((err) => {
                setisLoading(false);
                setTimeout(() => {
                    SnackBarCommon({ text: err.message });
                }, 120);
            })
            .finally(() => setisLoading(false));
    };

    const onRightClick = () => {
        if (selected_keyword_Pass_Ayy.length > 0) {
            AsyncStorage.setItem("selected_keyword_ayy", JSON.stringify(selected_keyword_Pass_Ayy))
        }
        else {
            AsyncStorage.removeItem('selected_keyword_ayy');
        }
        navigation.goBack();
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.white_txt }}>
            <ToolbarBackButton
                btnText={title}
                onBackPress={() => navigation.navigate("EditProfilePage")}
                rightIcon={require('../assets/right_icon.png')}
                onRightClick={() => onRightClick()}
            />
            <FlatList
                style={{ flex: 1 }}
                keyboardShouldPersistTaps={'always'}
                data={dataList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 20,
                    alignItems: 'center'
                }}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity
                            activeOpacity={activeOpacity}
                            style={{
                                backgroundColor: COLORS.white_txt,
                                borderRadius: 8,
                                paddingVertical: 10,
                                paddingHorizontal: 10,
                                width: "93%",
                                marginVertical: 5,
                                shadowColor: COLORS.shadow_color,
                                shadowOffset: { width: -2, height: 3 },
                                shadowOpacity: 0.2,
                                shadowRadius: 10,
                                elevation: elevation,
                                marginLeft: 10,
                                marginRight: 10,

                            }}
                            onPress={() => {
                                var temp = [...dataList];
                                temp[index].isSelected = !temp[index].isSelected;
                                setDataList(temp);

                                const selected_keyword_ayy = _.filter(
                                    temp,
                                    item => item.isSelected === true,
                                );
                                setSelected_keyword_Pass_Ayy(selected_keyword_ayy);

                            }}
                        >
                            <View
                                style={{

                                    width: "98%",
                                    flexDirection: 'row',
                                    height: 35,
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ flex: 1 }}>

                                    <TextCommonMedium
                                        text={item.name}
                                        color={COLORS.black_txt}
                                        fontSize={FONTS_SIZE.txt_14}
                                        fontWeight={'600'}
                                        textAlign={'left'}
                                    />
                                </View>
                                {item.isSelected ? (
                                    <Image
                                        source={require('../assets/right_icon.png')}
                                        resizeMode={'contain'}
                                        style={{
                                            tintColor: COLORS.colorGreen,
                                            height: 24,
                                            width: 24,
                                        }}
                                    />
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                //   ListEmptyComponent={() => {
                //     return isLoading === false ? (
                //       <ListEmptyView txt={'No data found'} />
                //     ) : null;
                //   }}
                keyExtractor={(_, index) => index.toString()}
            />
            <Loader loading={isLoading} />
        </View>
    );
}

export default SelectKeywordPage;
