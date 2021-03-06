import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { WebView } from 'react-native-webview';
import { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

import Spinner from './components/Spinner/Spinner';
import { userService } from './services/user-service';
import { Button } from 'react-native-paper';

export default function App() {
  const webviewRef = React.useRef<WebView>(null);
  const [fullName, setFullName] = React.useState('');
  const [metadata, setMetadata] = React.useState('');

  function onNavigationStateChange(navState: WebViewNavigation) {
    console.log('==> ${navState.url}' + navState.loading ? '...' : '.');
  }

  async function onMessage(event: WebViewMessageEvent) {
    const { type, data } = JSON.parse(event.nativeEvent.data);
    alert(`NATIVE: receiving [${type}]`);

    switch (type) {
      case 'accessTokenRetrieved':
        // Here we can put the accessToken into React Context
        const { accessToken, userSub } = data;
        const user = await userService.loadUserMetadata(accessToken, userSub);
        setFullName(user.name);
        setMetadata(JSON.stringify(user.user_metadata));
        break;

      default:
        console.log(`Unhandled message [${type}]`);
    }
  }

  async function postMessageToWebapp(type: string, data: string) {
    if (!webviewRef.current) {
      return;
    }

    const message = { type, data };
    webviewRef.current.injectJavaScript(`window.postMessage(${JSON.stringify(message)}, '*'); true;`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.userMetadata}>
        <Text>{fullName}</Text>
        <Text>{metadata}</Text>
        <Button icon="logout" onPress={() => postMessageToWebapp('getValidAccessToken', '')}>get Valid Token</Button>
      </View>
      <View style={styles.webView}>
        <WebView
          ref={webviewRef}
          onMessage={onMessage}
          source={{
            uri: 'https://amwebexpert.github.io/auth0-demo-react',
            headers: { 'spa-id': 'poc-react-native-webview-oauth2' },
          }}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          originWhitelist={["*"]}
          scalesPageToFit={true}
          startInLoadingState={true}
          mixedContentMode={"always"}
          allowsInlineMediaPlayback={true}
          allowsFullscreenVideo={true}
          allowsBackForwardNavigationGestures={true}
          allowsLinkPreview={false}
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          renderLoading={() => (<Spinner />)}
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
