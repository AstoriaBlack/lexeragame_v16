import { View, Text, StyleSheet } from "react-native"

const ScoreBoard = ({ score, total, currentIndex }) => {
  const progressPercentage = (currentIndex / total) * 100

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>
          Score: {score}/{total}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Word {currentIndex + 1} of {total}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontFamily: "OpenDyslexic",
    color: "#6A1B9A",
    fontWeight: "bold",
  },
  progressContainer: {
    width: "100%",
  },
  progressBackground: {
    height: 15,
    backgroundColor: "#E1BEE7",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8E24AA",
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "OpenDyslexic",
    color: "#333",
    textAlign: "center",
    marginTop: 5,
  },
})

export default ScoreBoard

