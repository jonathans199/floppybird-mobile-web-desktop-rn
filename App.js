import React, { useEffect, useState } from 'react'
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Button,
} from 'react-native'
import Bird from './components/Bird'
import Obstacles from './components/Obstacles'

export default function App() {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const birdLeft = screenWidth / 2
  const [birdBottom, setBirdBottom] = useState(screenHeight / 2)
  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth)
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + screenWidth / 2 + 30)
  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0)
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const gravity = 3
  let obstacleWidth = 60
  let obstacleHeight = 300
  let gap = 200
  let gameTimerId
  let obstaclesTimerId
  let obstaclesTimerIdTwo

  //start bird falling
  useEffect(() => {
    if (birdBottom > 0) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity)
      }, 30)

      return () => {
        clearInterval(gameTimerId)
      }
    }
  }, [birdBottom])

  const jump = () => {
    if (!isGameOver && birdBottom < screenHeight) {
      setBirdBottom(birdBottom => birdBottom + 50)
    }
  }

  //start first obstacle
  useEffect(() => {
    if (obstaclesLeft > -60) {
      obstaclesTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesTimerId)
      }
    } else {
      setScore(score => score + 1)
      setObstaclesLeft(screenWidth)
      setObstaclesNegHeight(-Math.random() * 100)
    }
  }, [obstaclesLeft])

  //start second obstacle
  useEffect(() => {
    if (obstaclesLeftTwo > -60) {
      obstaclesTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5)
      }, 30)
      return () => {
        clearInterval(obstaclesTimerIdTwo)
      }
    } else {
      setScore(score => score + 1)
      setObstaclesLeftTwo(screenWidth)
      setObstaclesNegHeightTwo(-Math.random() * 100)
    }
  }, [obstaclesLeftTwo])

  //check for collisions
  useEffect(() => {
    if (
      ((birdBottom < obstaclesNegHeight + obstacleHeight + 30 || birdBottom > obstaclesNegHeight + obstacleHeight + gap - 30) &&
        obstaclesLeft > screenWidth / 2 - 30 &&
        obstaclesLeft < screenWidth / 2 + 30) ||
      ((birdBottom < obstaclesNegHeightTwo + obstacleHeight + 30 || birdBottom > obstaclesNegHeightTwo + obstacleHeight + gap - 30) &&
        obstaclesLeftTwo > screenWidth / 2 - 30 &&
        obstaclesLeftTwo < screenWidth / 2 + 30)
    ) {
      gameOver()
    }
  })

  const gameOver = () => {
    clearInterval(gameTimerId)
    clearInterval(obstaclesTimerId)
    clearInterval(obstaclesTimerIdTwo)
    setIsGameOver(true)
  }

  const startAgain = () => {
    setIsGameOver(false)
    setBirdBottom(birdBottom => birdBottom + 100)
    setScore(0)
    setObstaclesLeft(0)
    setObstaclesLeftTwo(screenWidth + screenWidth / 2 + 30)
    setObstaclesNegHeight(-Math.random() * 100)
  }

  const image = { uri: 'https://user-images.githubusercontent.com/18351809/46888871-624a3900-ce7f-11e8-808e-99fd90c8a3f4.png' }

  return (
    <ImageBackground source={image} resizeMode='cover' style={styles.container}>
      <SafeAreaView>
        <TouchableWithoutFeedback onPress={jump}>
          <View style={styles.container}>
            <Bird birdBottom={birdBottom} birdLeft={birdLeft} />
            <Obstacles
              color={'green'}
              obstacleWidth={obstacleWidth}
              obstacleHeight={obstacleHeight}
              randomBottom={obstaclesNegHeight}
              gap={gap}
              obstaclesLeft={obstaclesLeft}
            />
            <Obstacles
              color={'yellow'}
              obstacleWidth={obstacleWidth}
              obstacleHeight={obstacleHeight}
              randomBottom={obstaclesNegHeightTwo}
              gap={gap}
              obstaclesLeft={obstaclesLeftTwo}
            />
            {isGameOver && (
              <>
                <Text style={styles.score}>Game Over</Text>
                <Text style={{ ...styles.score, marginTop: 40 }}>Score: {score}</Text>
                {Platform.OS === 'web' ? (
                  <Button title='Play Again' color='#17BF63' style={{ width: '30%' }} />
                ) : (
                  <TouchableOpacity style={{ ...styles.button }} onPress={startAgain}>
                    <Text style={{ fontSize: 20 }}> Play Again</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'web' ? '100vh' : '100%',
  },
  score: {
    paddingTop: Platform.OS === 'web' ? '' : 40,
    fontSize: 30,
    position: 'absolute',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'yellow',
    padding: 10,
    width: '50%',
    borderRadius: 40,
  },
})
