import { Alert } from 'react-native';
import { StackActions } from '@react-navigation/native';
const LoginCheckDialog = async (navigation) => {

    Alert.alert(
        'Alert Message!',
        `${"Please try to login."}`,
        [
            {
                text: 'Cancel',
                onPress: () => {
                    { }
                },
                style: 'cancel',
            },
            {
                text: 'Login', onPress: () => {
                    navigation.navigate('LoginPage');
                }
            },
        ],
        { cancelable: false },
    );
}

export default { LoginCheckDialog };
