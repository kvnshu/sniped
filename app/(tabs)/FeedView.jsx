// HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import Post from '../../components/Post';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase'; // Import your Supabase client
import { useUser } from '../contexts/UserContext';
/*
OLD POST STRUCTURE:
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

*/

const FeedView = () => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState([]);
  const { user, setUser } = useUser();



  useEffect(() => {
    const fetchPosts = async () => {
      const userId = user.id;

      // Fetch posts where user_id1 matches userId
      const { data: data1, error: error1 } = await supabase
        .from('snipes')
        .select(`
          *,
          user1:users!snipes_user_id1_fkey (
            full_name,
            profile_filename
          ),
          user2:users!snipes_user_id2_fkey (
            full_name,
            profile_filename
          )
        `)
        .eq('user_id1', userId);

      // Handle error
      if (error1) {
        console.log('Error fetching posts for user_id1:', error1);
        return;
      }

      //console.log("data1:");
      //console.log(data1);



      // Fetch the list of user IDs from the 'following' table
      const { data: followingData, error: followingError } = await supabase
        .from('following')
        .select('user_id2')
        .eq('user_id1', userId);

      // Handle error
      if (followingError) {
        console.log('Error fetching following user IDs:', followingError);
        return;
      }



      // Extract user IDs from the following data
      const userIDs = followingData.map(f => f.user_id2);

      //   console.log("following userIDs:");
      // console.log(userIDs);

      // Fetch posts where user_id2 is in the list of following user IDs
      const { data: data2, error: error2 } = await supabase
        .from('snipes')
        .select(`
          *,
          user1:users!snipes_user_id1_fkey (
            full_name,
            profile_filename
          ),
          user2:users!snipes_user_id2_fkey (
            full_name,
            profile_filename
          )
        `)
        .in('user_id2', userIDs);

      //  console.log("data2:");
      // console.log(data2);

      // Handle error
      if (error2) {
        console.log('Error fetching posts for user_id2:', error2);
        return;
      }

      const { data: data3, error: error3 } = await supabase
        .from('snipes')
        .select(`
          *,
          user1:users!snipes_user_id1_fkey (
            full_name,
            profile_filename
          ),
          user2:users!snipes_user_id2_fkey (
            full_name,
            profile_filename
          )
        `)
        .eq('user_id2', userId);

      // Handle error
      if (error3) {
        console.log('Error fetching posts for user_id1:', error1);
        return;
      }

      // console.log("data3:");
      // console.log(data3);

      // Combine the results from both queries
      const combinedData = [
        ...data1,
        ...data2.filter(d2 => !data1.find(d1 => d1.id === d2.id)),
        ...data3.filter(d3 => !data1.find(d1 => d1.id === d3.id) && !data2.find(d2 => d2.id === d3.id))
      ];
      console.log(combinedData);

      // Map the combined data to the format expected by Post component
      const formattedPosts = combinedData.map(post => ({
        id: post.id,
        creatorUsername: post.user1.full_name,
        taggedUsername: post.user2.full_name,
        creatorProfilePic: supabase.storage.from('profiles').getPublicUrl(post.user1.profile_filename).data.publicUrl,
        taggedProfilePic: supabase.storage.from('profiles').getPublicUrl(post.user2.profile_filename).data.publicUrl,
        postPicture: supabase.storage.from('snipes').getPublicUrl(post.file_name).data.publicUrl,
        timestamp: post.created_at // You might want to format this
      }));

      setPosts(formattedPosts); // Update the posts state
    };

    fetchPosts();
  }, []);




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