// HomeScreen.js
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Post from '../components/Post';
import {useSafeAreaInsets } from 'react-native-safe-area-context';

const FeedView = () => {
  const insets = useSafeAreaInsets();

  const posts = [
    {
        id: '1',
        creatorUsername: 'Will K',
        taggedUsername: 'Kevin Xu',
        creatorProfilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY',
        taggedProfilePic: 'https://miro.medium.com/v2/resize:fit:2400/1*wpbcWDYpdkB1MfGmOfis6Q.jpeg',
        postPicture: 'https://i.pinimg.com/736x/b6/28/51/b62851a2fe9a14ba8391afae55792ad7.jpg',
        timestamp: 'just now',
    },
    {
      id: '1',
      creatorUsername: 'Will K',
      taggedUsername: 'Kevin Xu',
      creatorProfilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY',
      taggedProfilePic: 'https://miro.medium.com/v2/resize:fit:2400/1*wpbcWDYpdkB1MfGmOfis6Q.jpeg',
      postPicture: 'https://i.pinimg.com/736x/b6/28/51/b62851a2fe9a14ba8391afae55792ad7.jpg',
      timestamp: '3 minutes ago',
  },
  {
    id: '1',
    creatorUsername: 'Will K',
    taggedUsername: 'Kevin Xu',
    creatorProfilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY',
    taggedProfilePic: 'https://miro.medium.com/v2/resize:fit:2400/1*wpbcWDYpdkB1MfGmOfis6Q.jpeg',
    postPicture: 'https://i.pinimg.com/736x/b6/28/51/b62851a2fe9a14ba8391afae55792ad7.jpg',
    timestamp: 'Just now',
},
    // ... more posts
  ];

  return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000',  paddingTop: insets.top }}>
      <FlatList
                data={posts}
                renderItem={({ item }) => <Post post={item} />}
                keyExtractor={(item) => item.id}
            />
    </View>
  );

};

export default FeedView;