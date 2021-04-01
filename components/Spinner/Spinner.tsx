import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';

const Spinner: React.FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="orange" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Spinner;
