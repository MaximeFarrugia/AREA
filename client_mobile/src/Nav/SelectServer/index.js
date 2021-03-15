import React, { useState } from 'react'
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'react-native';

const Login = () => {
  const [address, setAddress] = useState('')
  const [port, setPort] = useState('')

  const handleSubmit = () => {
    global.backendUrl = `http://${address}:${port}`
    Actions.reset('login')
  }

  return (
    <ImageBackground style={ styles.imgBackground } 
      resizeMode='cover' 
      source={require('../../../assets/back-2.png')}
    >
      <View>
        <Text style={styles.logo}>Connect to server</Text>
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Address..."
            placeholderTextColor="white"
            value={address}
            onChangeText={text => setAddress(text)}
          />
        </View>
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Port..."
            placeholderTextColor="white"
            value={port}
            onChangeText={text => setPort(text)}/>
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit} >
          <Text style={styles.loginText}>Validate</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground> 
  )
}

const styles = StyleSheet.create({
  imgBackground: {
    justifyContent: 'center',
    flex: 1,
},
  container: {
    backgroundColor: '#003f5c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"white",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    marginStart: 45,
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginStart: 45,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});

export default Login