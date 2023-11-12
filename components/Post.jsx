import React from "react";
import { View, Image, StyleSheet, Dimensions, Text } from "react-native";
import PostDetails from "./PostDetails";
import { formatDistanceToNow, parseISO } from "date-fns";

// Get screen width
const screenWidth = (Dimensions.get("window").width * 9) / 10;
// Calculate height for 3:4 aspect ratio
const imageHeight = (screenWidth * 6) / 5;

const Post = ({ post }) => {

  function parseAndHumanizeDate(dateString) {
    console.log(dateString)
    const parsedDate = parseISO(dateString);
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  }

  return (
    <View style={styles.postContainer}>
      <PostDetails
        creatorUsername={post.creatorUsername}
        taggedUsername={post.taggedUsername}
        creatorProfilePic={post.creatorProfilePic}
        taggedProfilePic={post.taggedProfilePic}
        timestamp={post.timestamp}
      />
      <Image
        source={{ uri: post.postPicture }}
        style={[styles.postImage, { width: screenWidth, height: imageHeight }]}
      />
      <Text style={styles.timestamp}>Sniped {parseAndHumanizeDate(post.timestamp)}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  timestamp: {
    paddingTop: 5,
    color: "#aaa",
    marginLeft: "auto",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  postContainer: {
    flex: 1,
    backgroundColor: "#000",
    marginBottom: 30,
  },
  postImage: {
    width: "100%",
    borderRadius: 20,
    // height is set dynamically
  },
});

export default Post;
