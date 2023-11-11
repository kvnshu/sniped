import { useState } from 'react';
import { Button } from 'react-native';
import { View, Text } from 'react-native'
import React from 'react'
import { supabase } from '../lib/supabase'; // Import your Supabase configuration
import { router } from 'expo-router';

const Profile = () => {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    // Sign out the user from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error logging out:', error.message);
    }
    // Navigate back to the Home screen or any other screen');
    router.push('/')
    setLoading(false)
  };

  return (
    <View>
      <Text>Profile</Text>
      <View>
        <Text>Are you sure you want to log out?</Text>
        <Button title="Logout" disabled={loading} onPress={handleLogout} />
      </View>

    </View>
  )
}

export default Profile