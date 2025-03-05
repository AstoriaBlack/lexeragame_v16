import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"

const AudioControls = ({ onPlayAudio, onSpeak, playbackRate, setPlaybackRate }) => {
  const handlePlaybackRateChange = (newRate) => {
    setPlaybackRate(newRate)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <View style={styles.container}>
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.audioButton} onPress={onPlayAudio} accessibilityLabel="Play word audio">
          <Feather name="volume-2" size={24} color="white" />
          <Text style={styles.buttonText}>Play Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.audioButton} onPress={onSpeak} accessibilityLabel="Speak word">
          <Feather name="mic" size={24} color="white" />
          <Text style={styles.buttonText}>Speak Word</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speedControls}>
        <Text style={styles.speedLabel}>Playback Speed:</Text>
        <View style={styles.speedButtons}>
          <TouchableOpacity
            style={[styles.speedButton, playbackRate === 0.5 && styles.activeSpeedButton]}
            onPress={() => handlePlaybackRateChange(0.5)}
            accessibilityLabel="Slow playback speed"
          >
            <Text style={[styles.speedButtonText, playbackRate === 0.5 && styles.activeSpeedButtonText]}>0.5x</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedButton, playbackRate === 0.75 && styles.activeSpeedButton]}
            onPress={() => handlePlaybackRateChange(0.75)}
            accessibilityLabel="Medium-slow playback speed"
          >
            <Text style={[styles.speedButtonText, playbackRate === 0.75 && styles.activeSpeedButtonText]}>0.75x</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedButton, playbackRate === 1.0 && styles.activeSpeedButton]}
            onPress={() => handlePlaybackRateChange(1.0)}
            accessibilityLabel="Normal playback speed"
          >
            <Text style={[styles.speedButtonText, playbackRate === 1.0 && styles.activeSpeedButtonText]}>1.0x</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedButton, playbackRate === 1.25 && styles.activeSpeedButton]}
            onPress={() => handlePlaybackRateChange(1.25)}
            accessibilityLabel="Medium-fast playback speed"
          >
            <Text style={[styles.speedButtonText, playbackRate === 1.25 && styles.activeSpeedButtonText]}>1.25x</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.speedButton, playbackRate === 1.5 && styles.activeSpeedButton]}
            onPress={() => handlePlaybackRateChange(1.5)}
            accessibilityLabel="Fast playback speed"
          >
            <Text style={[styles.speedButtonText, playbackRate === 1.5 && styles.activeSpeedButtonText]}>1.5x</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  controlsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  audioButton: {
    backgroundColor: "#8E24AA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    minWidth: 150,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    marginLeft: 8,
  },
  speedControls: {
    width: "100%",
    alignItems: "center",
  },
  speedLabel: {
    fontSize: 16,
    fontFamily: "OpenDyslexic",
    color: "#333",
    marginBottom: 8,
  },
  speedButtons: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  speedButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#8E24AA",
    marginHorizontal: 5,
    marginBottom: 5,
  },
  activeSpeedButton: {
    backgroundColor: "#8E24AA",
  },
  speedButtonText: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    color: "#8E24AA",
  },
  activeSpeedButtonText: {
    color: "white",
  },
})

export default AudioControls

