import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import Spinner from './components/Spinner/Spinner';
import { userService } from './services/user-service';

export default function App() {
  const [fullName, setFullName] = React.useState('');
  const [metadata, setMetadata] = React.useState('');

  function onNavigationStateChange(navState: WebViewNavigation) {
    if (navState.loading) {
      console.log(`==> ${navState.url}...`);
    } else {
      console.log(`==> ${navState.url}.`);
    }
  }

  async function onMessage(event: WebViewMessageEvent) {
    console.log(event.nativeEvent.data);

    // Here we can put the accessToken (and refresh token) into 
    const { accessToken, userSub } = JSON.parse(event.nativeEvent.data);
    const user = await userService.loadUserMetadata(accessToken, userSub);
    setFullName(user.name);
    setMetadata(JSON.stringify(user.user_metadata));
  }

  return (
    <View style={styles.container}>
      <View style={styles.userMetadata}>
        <Text>{fullName}</Text>
        <Text>{metadata}</Text>
      </View>
      <View style={styles.webView}>
        <WebView
          javaScriptEnabled={true}
          startInLoadingState={true}
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          renderLoading={() => (<Spinner />)}
          onNavigationStateChange={onNavigationStateChange}
          sharedCookiesEnabled={true}
          onMessage={onMessage}
          source={{
            uri: 'https://amwebexpert.github.io/auth0-demo-react',
            headers: { 'spa-id': 'poc-react-native-webview-oauth2' },
          }}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
    padding: 10,
    borderWidth: 8,
    borderColor: 'green',
  },
  userMetadata: {
    borderWidth: 8,
    borderColor: 'lightblue',
    padding: 30,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
