import React from "react";
import { useState } from "react";
import {
  Button,
  Alert,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { supabase } from "../lib/supabase"; // Import your Supabase configuration
import { router } from "expo-router";
import PhoneNumberInput from "../../components/PhoneNumberInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  parsePhoneNumberFromString,
  isValidNumber,
  parse,
} from "libphonenumber-js";
import PrimaryButton from "../../components/PrimaryButton";
import { useUser } from "../contexts/UserContext";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");

  const insets = useSafeAreaInsets();

  const { user, setUser } = useUser();

  const handleLogout = async () => {
    setLoading(true);
    // Sign out the user from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error logging out:", error.message);
    }
    // Navigate back to the Home screen or any other screen');
    router.push("/");
    setLoading(false);
  };

  // TODO: mutate user.id upon user registration
  const handleSubmit = async () => {
    // setLoading(true);
    const phoneNumber = parsePhoneNumberFromString(phoneInput, 'US');
    if (phoneNumber.isValid()) {
      // upsert phone number into user table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .eq("phone", phoneNumber.countryCallingCode + phoneNumber.nationalNumber);

      if (userError) {
        Alert.alert("Oops! Your friend has not yet joined Sniped.");
        return;
      }
      // upsert record where logname follows friend in following table
      const { data: followingData, error: followingError } = await supabase
        .from("following")
        .upsert({
          user_id1: user.id,
          user_id2: userData[0].id
        },
          { onConflict: 'user_id1, user_id2' }
        )
        .select();

      if (followingError) {
        Alert.alert("Oops! Unable to friend user:");
      } else {
        Alert.alert("Befriended phone number!");
      }
    } else {
      Alert.alert("Oops! Invalid phone number.");
      setPhoneInput("");
    }
    Keyboard.dismiss()
    setPhoneInput("");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#000" }}
      >
        <Text style={styles.title}>Profile</Text>
        <View>
          <Text>Are you sure you want to log out?</Text>
          <PrimaryButton
            title="Logout"
            disabled={loading}
            onPress={handleLogout}
          />
        </View>

        <PhoneNumberInput
          title="💃 Add your friend via phone number"
          value={phoneInput}
          onChangeText={setPhoneInput}
          placeholder="12345678901"
        />
        <View style={{ paddingTop: 20, paddingBottom: 250 }}>
          <PrimaryButton
            title="Add Friend"
            disabled={loading}
            onPress={handleSubmit}
          />
        </View>
      </View>
        
      </TouchableWithoutFeedback>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  input: {
    color: "#ccc", // White text color
    width: "100%",
    padding: 0,
    borderRadius: 5,
    fontSize: 22,
    fontFamily: "Inter_600SemiBold", // Use the correct font weight
    textAlign: "left", // Align text to the left
  },
  container: {
    flex: 1,
    backgroundColor: "#000", // Dark background
    alignItems: "stretch", // Stretch child components
    justifyContent: "flex-start", // Align to top
    paddingTop: 20, // Add padding at the top
  },
  title: {
    color: "#fff", // Bold white text
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Inter_700Bold", // Use the correct font weight
    paddingHorizontal: 20,
  },
});

export default Profile;
