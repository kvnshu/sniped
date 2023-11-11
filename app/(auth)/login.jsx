import { useState } from 'react'
import { Link, } from 'expo-router';
import { Alert, StyleSheet, View, ViewBase } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'
import { Pressable } from 'react-native';
// import { router } from 'expo-router';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneProvided, setPhoneProvided] = useState(false);
  const [token, setToken] = useState('');

  async function authWithPhone() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
    setPhoneProvided(true)
  }

  async function verifyOtp() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms',
    })
    // update users table on upsert
    if (error) Alert.alert(error.message)
    setLoading(false)
  };

  return (
    <View style={[styles.verticallySpaced, styles.mt20]}>
      {!phoneProvided ? (
        <View>
          <Input
            label="Phone"
            keyboardType="phone-pad"
            onChangeText={(text) => setPhone(text)}
            value={phone}
            placeholder="1112223333"
          />
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button title="Log in" disabled={loading} onPress={authWithPhone} />
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.verticallySpaced}>
            <Input
              label="OTP"
              keyboardType="phone-pad"
              onChangeText={(text) => setToken(text)}
              value={token}
              secureTextEntry={true}
              placeholder="123456"
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button title="Verify" disabled={loading} onPress={() => verifyOtp()} />
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})