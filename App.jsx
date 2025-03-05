"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ActivityIndicator } from "react-native"
import * as Font from "expo-font"
import SpellingGame from "./SpellingGame"
import AdminScreen from "./screens/AdminScreen"

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // Set to true to access admin screen

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          OpenDyslexic: require("./assets/fonts/OpenDyslexic3-Regular.ttf"),
          "OpenDyslexic-Bold": require("./assets/fonts/OpenDyslexic3-Bold.ttf"),
          "OpenDyslexic-Italic": require("./assets/fonts/OpenDyslexic-Italic.otf"),
        })
        setFontsLoaded(true)
      } catch (error) {
        console.error("Error loading fonts:", error)
        // Fallback to system fonts if OpenDyslexic fails to load
        setFontsLoaded(true)
      }
    }

    loadFonts()
  }, [])

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading fonts...</Text>
      </View>
    )
  }

  // Render AdminScreen or SpellingGame based on isAdmin state
  return <View style={styles.container}>{isAdmin ? <AdminScreen /> : <SpellingGame />}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: "System",
    color: "#6A1B9A",
  },
})

