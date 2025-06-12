import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import './globals.css';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#00000000')
    }
  }, [])

  return (
  <>
    <StatusBar style="light" translucent backgroundColor="transparent" />
    <Stack>
      <Stack.Screen 
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="movies/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  </>
  );
}
