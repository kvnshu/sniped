import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import {
  useFonts,
  Inter_900Black,
  Inter_200ExtraLight,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_400Regular,
} from "@expo-google-fonts/inter";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Redirect } from "expo-router";

import Login from "./(auth)/login";

const StartPage = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Inter_200ExtraLight,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <SafeAreaProvider>
        {/*TODO fix logic to allow new users to input name*/}
        {session && user?.registered ? <Redirect href="/FeedView" /> : <Login />}
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});

export default StartPage;
