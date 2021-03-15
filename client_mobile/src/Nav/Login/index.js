import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActionSheetIOS } from 'react-native';
import { Actions } from 'react-native-router-flux';
import request from '../../Helpers/request'
import { ImageBackground } from 'react-native';


const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await request({
      endpoint: '/user/auth/login',
      method: 'post',
      data: {
        email: email,
        password: password,
      },
      doAlert: true,
    })
    if (res?.data?.token) {
      global.authorization = res.data.token;
      Actions.reset('home')
    }
  }

  return (
    <ImageBackground style={ styles.imgBackground } 
      resizeMode='cover'
      source={require('../../../assets/back-2.png')}
    >
      <View>
        <Text style={styles.logo}>Log into Area</Text>
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Email..."
            placeholderTextColor="white"
            value={email}
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View style={styles.inputView} >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="white"
            value={password}
            onChangeText={text => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleSubmit}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => Actions.reset('register')}>
          <Text style={styles.loginText}>GO TO REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={() => Actions.reset('selectServer')}>
          <Text style={styles.loginText}>CHANGE SERVER</Text>
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
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"white",
    marginTop: -80,
    marginBottom:40,
    marginStart: 55,
  },
  inputView:{
    width:"80%",
    backgroundColor:'rgba(52, 52, 52, 0.5)',
    borderRadius:25,
    height:50,
    marginBottom:20,
    marginStart: 45,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11,
    marginStart: 55,
    marginTop: -10,
  },
  loginBtn:{
    width:"80%",
    backgroundColor:'rgba(52, 52, 52, 0.5)',
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