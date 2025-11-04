import React from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoadingIndicator = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
        </View>
    );
};

export default function WebViewScreen() {
    const webViewUrl = 'https://blog.lateinit.net/';

    return (
        <SafeAreaView style={styles.container}>
            <WebView
                source={{ uri: webViewUrl }}
                startInLoadingState={true}
                renderLoading={LoadingIndicator}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        // ActivityIndicator를 화면 중앙에 위치시키기 위한 스타일
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});