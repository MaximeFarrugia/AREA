import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import request from '../../Helpers/request'
import { ImageBackground } from 'react-native';


const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await request({
      endpoint: '/user/auth/register',
      method: 'post',
      data: {
        email: email,
        password: password,
      },
      doAlert: true,
    })
    if (res) {
      Actions.reset('login')
    }
  }

  return (
    <ImageBackground style={ styles.imgBackground }
      resizeMode='cover'
      source={require('../../../assets/back-2.png')}
    >
      <View>
        <Text style={styles.logo}>Register into Area</Text>
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
        <TouchableOpacity style={styles.registerBtn} onPress={handleSubmit}>
          <Text style={styles.registerText}>REGISTER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => Actions.reset('login')}>
          <Text style={styles.registerText}>GO TO LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerBtn} onPress={() => Actions.reset('selectServer')}>
          <Text style={styles.registerText}>CHANGE SERVER</Text>
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
    marginBottom:40,
    marginStart: 5,
    marginTop: -80,
    textAlign: "center",

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
  registerBtn:{
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
  registerText:{
    color:"white",
  }
});

export default Register