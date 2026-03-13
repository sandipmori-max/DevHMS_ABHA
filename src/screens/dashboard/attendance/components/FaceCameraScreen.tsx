import React, {useRef, useEffect, useState} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native'
import {Camera, useCameraDevice, useFrameProcessor} from 'react-native-vision-camera'
import {useFaceDetector} from 'react-native-vision-camera-face-detector'
import {Worklets} from 'react-native-worklets-core'
import MaterialIcons from '@react-native-vector-icons/material-icons'

const FaceCameraScreen = ({navigation, route}) => {

  const {onCapture} = route.params
  const camera = useRef(null)

  const device = useCameraDevice('front')

  const [hasPermission, setHasPermission] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)

  useEffect(() => {
    const getPermission = async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    }
    getPermission()
  }, [])

  const {detectFaces} = useFaceDetector({
    performanceMode: 'fast',
    landmarkMode: 'all',
  })

  const updateFacesJS = Worklets.createRunOnJS((faces) => {
    setFaceDetected(faces.length > 0)
  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const faces = detectFaces(frame)
    updateFacesJS(faces)
  }, [])

  const takePhoto = async () => {
    const photo = await camera.current.takePhoto()
    onCapture(photo.path)
    navigation.goBack()
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting Camera Permission...</Text>
      </View>
    )
  }

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Loading Camera...</Text>
      </View>
    )
  }

  return (
    <View style={{flex:1}}>

      {/* Camera */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={3}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={26} color="#fff"/>
        </TouchableOpacity>

        <Text style={styles.title}>Face Verification</Text>

        <View style={{width:30}} />
      </View>
       <View style={styles.faceFrameContainer}>
        <View
          style={[
            styles.faceFrame,
            {borderColor: faceDetected ? "#00ff00" : "#ff3b30"}
          ]}
        />
      </View>

<View style={styles.messageContainer}>
        <Text style={styles.message}>
          {faceDetected ? "Face Detected" : "Align your face in the frame"}
        </Text>
      </View>
      {/* Face Frame */}
     

      {/* Message */}
      

      {/* Capture Button */}
      <View style={styles.bottomContainer}>

        <TouchableOpacity
          disabled={!faceDetected}
          onPress={takePhoto}
          style={[
            styles.captureOuter,
            {opacity: faceDetected ? 1 : 0.4}
          ]}
        >
          <View style={styles.captureInner}/>
        </TouchableOpacity>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  header:{
    position:'absolute',
    top:40,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    // backgroundColor: ERP_COLOR_CODE.ERP_APP_COLOR,
    paddingVertical:12
  },

  title:{
    color:'#fff',
    fontSize:18,
    fontWeight:'600'
  },

  faceFrameContainer:{
    position:'absolute',
    top:'18%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },

  faceFrame:{
    width:Dimensions.get('screen').width * 0.94,
    height: Dimensions.get('screen').height * 0.60,
    borderWidth: 1,
    borderRadius: 10
  },

  messageContainer:{
    position:'absolute',
    top:'11%',
    alignSelf:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
    paddingHorizontal:14,
    paddingVertical:6,
    borderRadius:8
  },

  message:{
    color:'#fff',
    fontSize:14
  },

  bottomContainer:{
    position:'absolute',
    bottom:60,
    width:'100%',
    alignItems:'center'
  },

  captureOuter:{
    width:80,
    height:80,
    borderRadius:40,
    borderWidth:5,
    borderColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
  },

  captureInner:{
    width:55,
    height:55,
    borderRadius:30,
    backgroundColor:'#fff'
  }

})

export default FaceCameraScreen