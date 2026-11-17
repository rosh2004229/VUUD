import {Alert, Linking} from 'react-native';
// import {check, PERMISSIONS, RESULTS, openSettings, request} from 'react-native-permissions';

// const checkPermission = async (permission,permissionMsg,onCancel, onOkPress) => {
//   const result = await request(permission);
// //   const result = await check(permission);
// console.log("result ==> ", result);


//   let permissionEnabled = false;
//   switch (result) {
//     case RESULTS.UNAVAILABLE:
//       break;
//     case RESULTS.DENIED:
//       break;
//     case RESULTS.GRANTED:
//       permissionEnabled = true;
//       break;
//     case RESULTS.BLOCKED:
//       break;
    
//       case RESULTS.LIMITED:
//       break;
//   };
//   if(!permissionEnabled){
//     Alert.alert(
//       'Permission Required',
//       `${permissionMsg}`,
//       [
//         {
//           text: 'Cancel',
//           onPress: () => {
//             if(onCancel)
//             onCancel()
//           },
//           style: 'cancel',
//         },
//         {text: 'OK', onPress: () =>{
//           openSettings()
//           if(onOkPress)
//           onOkPress();
//         }},
//       ],
//       {cancelable: false},
//     );
//   }
//   return permissionEnabled;
// };

// export default {checkPermission};


import {
    check,
    request,
    RESULTS,
    requestMultiple,
  } from 'react-native-permissions';
  
  // This function can be used anywhere as it supports multiple permissions. 
  // It checks for permissions and then requests for it.
  export async function checkMultiplePermissions(permissions,permissionMsg,) {
    let isPermissionGranted = false;
    const statuses = await requestMultiple(permissions);
    for (var index in permissions) {
      if (statuses[permissions[index]] === RESULTS.GRANTED) {
        isPermissionGranted = true;
      } else {
        isPermissionGranted = false;
        break;
      }
    }
    return isPermissionGranted;
  }
  
  // In case you want to check a single permission
  export async function checkPermission(permission, permissionMsg) {
    var isPermissionGranted ;
    const result = await check(permission);
    switch (result) {
      case RESULTS.GRANTED:
        isPermissionGranted = true;
        break;
      case RESULTS.DENIED:
        isPermissionGranted = false;
        break;
      case RESULTS.BLOCKED:
        isPermissionGranted = false;
        break;
      case RESULTS.UNAVAILABLE:
        isPermissionGranted = false;
        break;
    }
    
    if(isPermissionGranted === false ){
        // Show an alert in case permission was not granted
        Alert.alert(
          'Permission Request',
          permissionMsg,
          [
            {
              text: 'Go to Settings',
              onPress: () => {
                Linking.openSettings();
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
          { cancelable: false },
        );
      }
      return isPermissionGranted;

  }

  export default {checkPermission, checkMultiplePermissions};