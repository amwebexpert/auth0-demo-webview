import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import Spinner from './components/Spinner/Spinner';
import { userService } from './services/user-service';

export default function App() {
  const uri = 'https://amwebexpert.github.io/auth0-demo-react';

  function onNavigationStateChange(navState: WebViewNavigation) {
    if (navState.loading) {
      console.log(`==> ${navState.url}...`);
    } else {
      console.log(`==> ${navState.url}.`);
    }
  }

  async function onMessage(event: WebViewMessageEvent) {
    if (!event.nativeEvent?.data) {
      return;
    }

    const { accessToken, userSub } = JSON.parse(event.nativeEvent.data);
    console.log('WebView.onMessage received!!!', accessToken, userSub);
    const userMetadata = await userService.loadUserMetadata(accessToken, userSub);
    console.log('userMetadata', userMetadata);
  }

  return (
    <View style={styles.container}>
      <View style={styles.userMetadata}>
        <Text>User metadata</Text>
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
            uri,
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
    flexDirection: 'row',
    justifyContent: 'center'
  },
});
