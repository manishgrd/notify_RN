import React, { Component } from 'react';
import { StyleSheet, View, TextInput, NavigatorIOS, Image, props, status, AsyncStorage } from 'react-native';
import { Container, Header, Item, Label, Input, Left, Button, TouchableOpacity, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';
import Login from './Login';
import {Actions} from 'react-native-router-flux';
import {error} from 'util';


export default class Home extends Component {

    constructor() {
        super();
        this.state = {
        username: "", password: "",
        };
        }                

  _handleButtonPressLogin = () => {
    var authToken = null;
    var url = "https://auth.astigmatic44.hasura-app.io/v1/login";
    var requestOptions = {
    "method": "POST",
    "headers": {  "Content-Type": "application/json" } };
    var body = { "provider": "username",
        "data": { "username": this.state.username,
                  "password": this.state.password,}};

    requestOptions.body = JSON.stringify(body);
    
    fetch(url, requestOptions)
    .then((response)=> {
        return response.json();
      })
      .then((result)=> {
        authToken = result.auth_token;
        AsyncStorage.setItem('HASURA_AUTH_TOKEN', authToken);
    
        if(authToken!=null)
        {  this.sendSessionID(result.auth_token,result.username);
            
          }
        else
            alert("Invalid credentials--Try Again !!");
      })
      .catch(function(error) {
        console.log('Request Failed:' + error);
      });
  }

  sendSessionID = (sessionid,username) => {
    var urlq = "https://data.astigmatic44.hasura-app.io/v1/query";
    var requestOptions = {
       "method": "POST",
       "headers": {"Content-Type": "application/json",
                   "Authorization": "Bearer " + sessionid},};
         var body= {
       "type": "update",
       "args": {
           "table": "User_Details",
           "where": {
               "User_Name": {
                   "$eq": username }},
           "$set": { "Session_Id": sessionid }}};
    
         requestOptions.body = JSON.stringify(body);
         fetch(urlq, requestOptions)
         .then((response)=> {
           console.log(response);
           return 1;
           console.log("Session ID update Successful");
         })
         .then((result)=> {
          return Actions.main();
           //console.log("Token Update",result);
         })
         .catch((error)=> {
           console.log('Request Failed:' + error);
         }); }

    render(){
        
      return (
        <View style={{backgroundColor:"#3498db", flex:  1, padding: 20, justifyContent: 'center'}}>
        <Image source={require('.././firebaseprojectfiles/notify_logo.png')} style={{height: 180, width: 210, marginLeft: 80, marginBottom: 60, marginTop: -70}}/>
        <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center'}} >Notify App </Text>
        <Text style={{color: 'darkblue', justifyContent: 'center'}} >Please login to continue </Text>
         <TextInput value={this.state.username} onChangeText={text => this.setState({ username: text })} placeholder=" Username" placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
         <TextInput value={this.state.password} onChangeText={text => this.setState({ password: text })} placeholder=" Password" secureTextEntry={true} placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, borderColor: 'rgba(255,255,255,0.7)', marginTop: 15, backgroundColor: 'rgba(255,255,255,0.7)'}}/>
         <Button block round style={{backgroundColor: 'orange', marginTop: 10}} onPress={this._handleButtonPressLogin.bind(this)}>
         <Text style={{color: 'white'}}>Login</Text>
         </Button>
         <Button block round style={{backgroundColor: 'violet', marginTop: 5}} onPress={() => Actions.Login()}>
         <Text style={{color: 'white'}}>Register</Text>
         </Button>
        
       </View>
      );
           }
};