import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import axios from 'axios';
import { kFormatter } from '../common/utils';
// import { TwitterApi } from 'twitter-api-v2';

function TestingPage({ navigation }) {
  const [twitterCount, setTwitterCount] = useState('0');
  const [twitterCountSimple, setTwitterCountSimple] = useState('0');

  const [fbCount, setFbCount] = useState('0');
  const [fbCountSimple, setFbCountSimple] = useState('0');
  const fbUserName = 'Google';

  const [count, setCount] = useState('0');
  const [countSimple, setCountSimple] = useState('0');

  const [countP, setCountP] = useState('0');
  const [countSimpleP, setCountSimpleP] = useState('0');

  // const twitterClient = new TwitterApi(
  //   'Bearer YOUR_TWITTER_BEARER_TOKEN'
  // );
  // const readOnlyClient = twitterClient.readOnly;

  useEffect(() => {
    // checkCode();
    // main();
    facebookApiCallCode();
    // twitterApiCallCode();
    // apiCallCode();
    // apiCallCodeP();
  }, []);

  // const checkCode = async () => {
  //   const user = await readOnlyClient.v2.userByUsername('Google');
  //   console.log('user ===> ', user);
  // };

  const facebookApiCallCode = () => {
    axios
      .get(
        // `https://graph.facebook.com/${fbUserName}?fields=fan_count&access_token=YOUR_ACCESS_TOKEN`
        // 'https://graph.facebook.com/oauth/access_token?client_id=2558238830983151&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials'
        `https://graph.facebook.com/${fbUserName}?fields=access_token&access_token=YOUR_FB_ACCESS_TOKEN`
      )
      .then((res) => {
        console.log('response facebook ====> ', JSON.stringify(res.data));

        axios
          .create({
            headers: {
              Authorization: 'Bearer ' + res.data.access_token,
            },
          })
          .get(
            `https://graph.facebook.com/${fbUserName}?access_token=${res.data.access_token}`
          )
          .then((res) => {
            console.log('response facebook ====> ', JSON.stringify(res.data));
            setFbCountSimple();
          })
          .catch((err) => {
            console.log('error:\n' + err);
          });
      })
      .catch((err) => {
        console.log('error:\n' + err);
      })
      .finally(() => console.log('end'));
  };

  const twitterApiCallCode = () => {
    axios
      .create({
        headers: {
          Authorization:
            'Bearer YOUR_TWITTER_BEARER_TOKEN',
        },
      })
      .get(
        // `https://api.twitter.com/2/users/${fbUserName}/followers`
        // `https://api.twitter.com/2/users/${fbUserName}?user.fields=public_metrics`
        `https://api.twitter.com/2/users/by/${fbUserName}?user.fields=public_metrics`
        // `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${fbUserName}`
        // `http://cdn.api.twitter.com/1/urls/count.json?url=${fbUserName}`
      )
      .then((res) => {
        console.log('response ====> ', JSON.stringify(res));
        console.log('response data ====> ', JSON.stringify(res.data));
        setTwitterCount(kFormatter(res.data[0]['followers_count']));
        setTwitterCountSimple(res.data[0]['followers_count']);
      })
      .catch((err) => {
        console.log('error:\n' + err);
      })
      .finally(() => console.log('end'));
  };

  const apiCallCode = () => {
    axios
      .create({
        headers: {
          'user-agent':
            'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
        },
      })
      .get(
        'https://i.instagram.com/api/v1/users/web_profile_info/?username=sandeep__maheshwari'
      )
      //   .get('https://www.instagram.com/sandeep__maheshwari')
      .then((res) => {
        console.log(
          'response ====> ',
          JSON.stringify(res.data.data.user.edge_followed_by.count)
        );
        setCountSimple(res.data.data.user.edge_followed_by.count);
        setCount(kFormatter(res.data.data.user.edge_followed_by.count));
        // if (
        //   res.data.indexOf('meta property="og:description" content="') != -1
        // ) {
        //   console.log(
        //     'followers count: ',
        //     res.data
        //       .split('meta property="og:description" content="')[1]
        //       .split('Followers')[0]
        //   );
        // }
        // setCount(
        //   res.data
        //     .split('meta property="og:description" content="')[1]
        //     .split('Followers')[0]
        // );
      })
      .catch((err) => {
        console.log('error:\n' + err);
      })
      .finally(() => console.log('end'));
  };

  const apiCallCodeP = () => {
    axios
      .create({
        headers: {
          'user-agent':
            'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
        },
      })
      .get(
        'https://i.instagram.com/api/v1/users/web_profile_info/?username=_pathik'
      )
      //   .get('https://www.instagram.com/sandeep__maheshwari')
      .then((res) => {
        console.log(
          'response ====> ',
          JSON.stringify(res.data.data.user.edge_followed_by.count)
        );
        setCountSimpleP(res.data.data.user.edge_followed_by.count);
        setCountP(kFormatter(res.data.data.user.edge_followed_by.count));
        // if (
        //   res.data.indexOf('meta property="og:description" content="') != -1
        // ) {
        //   console.log(
        //     'followers count: ',
        //     res.data
        //       .split('meta property="og:description" content="')[1]
        //       .split('Followers')[0]
        //   );
        // }
        // setCount(
        //   res.data
        //     .split('meta property="og:description" content="')[1]
        //     .split('Followers')[0]
        // );
      })
      .catch((err) => {
        console.log('error:\n' + err);
      })
      .finally(() => console.log('end'));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'black', marginTop: 20 }}>
        twitter followers count of SandeepSeminars: {twitterCount}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        twitter followers count of SandeepSeminars: {twitterCountSimple}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        Facebook followers count: {fbCount}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        Facebook followers count: {fbCountSimple}
      </Text>
      {/* <Text style={{ color: 'black', marginTop: 20 }}>
        followers count of sandeep__maheshwari: {count}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        followers count of sandeep__maheshwari: {countSimple}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        followers count of _pathik: {countP}
      </Text>
      <Text style={{ color: 'black', marginTop: 20 }}>
        followers count of _pathik: {countSimpleP}
      </Text> */}
    </View>
  );
}

export default TestingPage;
