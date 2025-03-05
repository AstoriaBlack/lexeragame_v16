"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Dimensions, Alert } from "react-native"
import { Audio } from "expo-av"
import * as Speech from "expo-speech"
import * as Haptics from "expo-haptics"
import LottieView from "lottie-react-native"
import WordDisplay from "./components/WordDisplay"
import AudioControls from "./components/AudioControls"
import ScoreBoard from "./components/ScoreBoard"
import { getRandomWords } from "./utils/supabaseService"

const { width, height } = Dimensions.get("window")

export default function SpellingGame() {
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState(null)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFailure, setShowFailure] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const successAnimationRef = useRef(null)
  const failureAnimationRef = useRef(null)
  const soundRef = useRef(null)

  useEffect(() => {
    fetchWords()
    setupAudio()

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync()
      }
    }
  }, [])

  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      setCurrentWord(words[currentWordIndex])
      preloadAudio(words[currentWordIndex].audio_url)
    }
  }, [words, currentWordIndex])

  const fetchWords = async () => {
    try {
      // Fetch random words from Supabase
      const wordsWithUrls = await getRandomWords()

      if (wordsWithUrls && wordsWithUrls.length > 0) {
        setWords(wordsWithUrls)
      } else {
        Alert.alert("Error", "No words found in the database. Please add words to your Supabase database.")
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching words:", error)
      Alert.alert("Error", "Failed to load game data. Please check your Supabase connection.")
      setLoading(false)
    }
  }

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })
    } catch (error) {
      console.error("Error setting up audio:", error)
    }
  }

  const preloadAudio = async (audioUrl) => {
    if (!audioUrl) return

    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: false })
      soundRef.current = sound
    } catch (error) {
      console.error("Error preloading audio:", error)
    }
  }

  const playWordAudio = async () => {
    if (!soundRef.current) return

    try {
      await soundRef.current.setRateAsync(playbackRate, true)
      await soundRef.current.playFromPositionAsync(0)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  const speakWord = () => {
    if (!currentWord) return

    Speech.speak(currentWord.word, {
      language: "en-US",
      rate: playbackRate,
      onStart: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    })
  }

  const startListening = async () => {
    setIsListening(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    try {
      Speech.speak("Please spell the word", {
        language: "en-US",
        rate: 1.0,
        onDone: () => {
          setTimeout(() => {
            // In a real app, you would implement actual speech recognition here
            // For this example, we'll simulate it with a timeout
            setTimeout(() => {
              setIsListening(false)
              // Simulate user input
              const simulatedInput = Math.random() > 0.5 ? currentWord.word : "wrong"
              checkAnswer(simulatedInput)
            }, 2000)
          }, 500)
        },
      })
    } catch (error) {
      console.error("Error with speech recognition:", error)
      setIsListening(false)
    }
  }

  const checkAnswer = (input) => {
    const isCorrect = input.toLowerCase() === currentWord.word.toLowerCase()

    if (isCorrect) {
      handleCorrectAnswer()
    } else {
      handleIncorrectAnswer()
    }
  }

  const handleCorrectAnswer = async () => {
    setScore(score + 1)
    setShowSuccess(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

    successAnimationRef.current?.play()

    setTimeout(() => {
      setShowSuccess(false)
      moveToNextWord()
    }, 2000)
  }

  const handleIncorrectAnswer = () => {
    setShowFailure(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

    failureAnimationRef.current?.play()

    setTimeout(() => {
      setShowFailure(false)
    }, 2000)
  }

  const moveToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      Alert.alert("Game Complete!", `You scored ${score} out of ${words.length}!`, [
        { text: "Play Again", onPress: resetGame },
      ])
    }
  }

  const resetGame = () => {
    setCurrentWordIndex(0)
    setScore(0)
    setUserInput("")
    setShowSuccess(false)
    setShowFailure(false)
    // Shuffle words for a new game
    setWords([...words].sort(() => Math.random() - 0.5))
  }

  const startGame = () => {
    setGameStarted(true)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    )
  }

  if (!gameStarted) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.titleText}>Spelling Game</Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScoreBoard score={score} total={words.length} currentIndex={currentWordIndex} />

      {currentWord && (
        <View style={styles.gameContent}>
          <WordDisplay word={currentWord.word} showWord={showFailure} />

          {currentWord.image_url && (
            <Image source={{ uri: currentWord.image_url }} style={styles.wordImage} resizeMode="contain" />
          )}

          <AudioControls
            onPlayAudio={playWordAudio}
            onSpeak={speakWord}
            playbackRate={playbackRate}
            setPlaybackRate={setPlaybackRate}
          />

          <TouchableOpacity
            style={[styles.listenButton, isListening && styles.listeningButton]}
            onPress={startListening}
            disabled={isListening}
          >
            <Text style={styles.listenButtonText}>{isListening ? "Listening..." : "Speak to Spell"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={moveToNextWord}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {showSuccess && (
        <View style={styles.animationContainer}>
          <LottieView
            ref={successAnimationRef}
            source={require("./assets/animations/correct.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>
      )}

      {showFailure && (
        <View style={styles.animationContainer}>
          <LottieView
            ref={failureAnimationRef}
            source={require("./assets/animations/incorrect.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
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
    fontFamily: "OpenDyslexic",
    color: "#6A1B9A",
  },
  startContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  titleText: {
    fontSize: 32,
    fontFamily: "OpenDyslexic",
    color: "#6A1B9A",
    marginBottom: 40,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  startButtonText: {
    color: "white",
    fontSize: 24,
    fontFamily: "OpenDyslexic",
    textAlign: "center",
  },
  gameContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wordImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginVertical: 20,
    borderRadius: 10,
  },
  listenButton: {
    backgroundColor: "#6A1B9A",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 3,
  },
  listeningButton: {
    backgroundColor: "#4A148C",
  },
  listenButtonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "OpenDyslexic",
    textAlign: "center",
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipButtonText: {
    color: "#6A1B9A",
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    textDecorationLine: "underline",
  },
  animationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 10,
  },
  animation: {
    width: 200,
    height: 200,
  },
})

