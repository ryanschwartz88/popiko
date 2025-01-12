import React from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';

const ReviewLibrary = () => {
    return (
        <View style={styles.wrapper}>
            <ImageBackground
                source={require('@/assets/images/swimming-girl-underwater.jpg')} // Replace with your water-like pattern image path
                style={styles.container}
                resizeMode="cover"
                imageStyle={styles.image}
            >
                <View style={styles.overlay} />
                <Text style={styles.title}>Parent Water Safety Course</Text>
                <Text style={styles.subtitle}>
                    We're excited to announce that our new water safety course for parents is coming soon!
                    Stay tuned for updates, tips, and lessons to help keep your family safe around water.
                </Text>
            </ImageBackground>
        </View>
    );
};

export default ReviewLibrary;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        overflow: 'hidden', // Ensures the image and overlay respect the border radius
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire background
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text visibility
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        zIndex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 20,
        zIndex: 1,
    },
});
