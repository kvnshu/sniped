// PostDetails.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostDetails = ({ creatorUsername, taggedUsername, creatorProfilePic, taggedProfilePic }) => (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: creatorProfilePic }} style={styles.profilePic} />
            <Text style={styles.username}>{creatorUsername}</Text>
        </View>

        {/* Centered Snipe Emoji */}
        <Text style={styles.sniped}> 🔫 </Text>

        {/* Right-aligned Tagged User details */}
        {taggedUsername && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.username}>{taggedUsername}</Text>
                <Image source={{ uri: taggedProfilePic }} style={styles.profilePic} />
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 2,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
    },
    username: {
        color: '#fff',
        marginRight: 10,
        fontSize: 15,
        fontFamily: 'Inter_600SemiBold'
    },
    sniped: {
        transform: [{rotateY: '180deg'}],
        color: '#fff',
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold'
        
    }
});

export default PostDetails;
