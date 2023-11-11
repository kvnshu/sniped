import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
// import Account from './(tabs)/Account'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Redirect } from 'expo-router'
import Login from './(auth)/login'


export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  console.log(session)

  return (
    <View>
      {session && session.user ? <Redirect href="/FeedView" /> : <Login />}
    </View>
  )
}