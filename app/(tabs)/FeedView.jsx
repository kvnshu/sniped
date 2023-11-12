// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, } from 'react-native';
import Post from '../../components/Post';
import {useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase'; // Import your Supabase client

/*
Current Post Structure:
 id: '1',
        creatorUsername: 'Will K',
        taggedUsername: 'Kevin Xu',
        creatorProfilePic: 'https://media.licdn.com/dms/image/D5603AQHjysJw_3V-Aw/profile-displayphoto-shrink_800_800/0/1676439362951?e=2147483647&v=beta&t=VVreWq12TdxIMRadfHD08RegwzZDnbsyVdQztEljVNY',
        taggedProfilePic: 'https://miro.medium.com/v2/resize:fit:2400/1*wpbcWDYpdkB1MfGmOfis6Q.jpeg',
        postPicture: 'https://i.pinimg.com/736x/b6/28/51/b62851a2fe9a14ba8391afae55792ad7.jpg',
        timestamp: 'just now',

*/

const FeedView = () => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState([]); // State to store posts

  const fetchSnipes = async (oneUserID) => {
    try {
      const { data, error } = await supabase
        .from('snipes')
        .select(`
          *,
          user1: user_id1 (fullname, profilePicture),
          user2: user_id2 (fullname, profilePicture)
        `)
        .or(`
          user_id1.eq.'${oneUserID}',
          user_id2.in.(select user_id2 from following where user_id1.eq.'${oneUserID}')
        `);
  
      if (error) {
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching data', error.message);
    }
  };
  
  
  
  

  useEffect(() => {
    // Replace 'oneUserID' with the actual user ID
    fetchSnipes('eff113e7-b23d-4d1b-830b-fb9d3d81083c').then(data => {
      if (data) {
       // setPosts(data);
       console.log(data);
      }
    });
  }, []); // Empty dependency array to run only once on component mount

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', paddingTop: insets.top }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

};

export default FeedView;