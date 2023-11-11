import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import PostDetails from './PostDetails';

// Get screen width
const screenWidth = (Dimensions.get('window').width * 9) / 10;
// Calculate height for 3:4 aspect ratio
const imageHeight = (screenWidth * 5) / 5;

const Post = ({ post }) => (
    <View style={styles.postContainer}>
        <PostDetails
            creatorUsername={post.creatorUsername}
            taggedUsername={post.taggedUsername}
            creatorProfilePic={post.creatorProfilePic}
            taggedProfilePic={post.taggedProfilePic}
            timestamp={post.timestamp}
        />
        <Image source={{ uri: post.postPicture }} style={[styles.postImage, { width: screenWidth, height: imageHeight }]} />
        <Text style={styles.timestamp}>Sniped {post.timestamp}</Text>
    </View>
);

const styles = StyleSheet.create({
    timestamp: {
        paddingTop: 5,
        color: '#aaa',
        marginLeft: 'auto',
        fontFamily: 'Inter_600SemiBold',
        fontSize: 15,
    },
    postContainer: {
        flex: 1,
        backgroundColor: '#000',
        marginBottom: 30,
    },
    postImage: {
        width: '100%',
        borderRadius: 20
        // height is set dynamically
    },
});

export default Post;
