import React, { Component } from 'react';
import { StyleSheet, View, TextInput, NavigatorIOS, Image } from 'react-native';
import { Container, Header, Item, Label, Input, Left, Button, TouchableOpacity, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';
import {Actions} from 'react-native-router-flux';



export default class LoginScreen extends Component {

    state={ firstname: '', lastname: '', username: '', password: '', email: '', mobile: ''};

    sendUserInfo = (auth,hid,user,passwd,Fname,Lname,Email,Phn) => {

      var urlq = "https://data.astigmatic44.hasura-app.io/v1/query";
      var requestOptionsQ = {
         "method": "POST",
         "headers": {"Content-Type": "application/json",
                     "Authorization": "Bearer " + auth}};
   
           var body= {
         "type": "insert",
         "args": {
             "table": "User_Details",
             "objects": [{
               "Hasura_Id": hid,
               "User_Name": user,
               "Pass": passwd,
               "F_Name": Fname,
               "L_Name": Lname,
               "Email_Id": Email,
               "Phone_No": Phn,
             //  "Session_Id": auth,
               }]}};
   
           requestOptionsQ.body = JSON.stringify(body);
   
          console.log(urlq, requestOptionsQ)
           fetch(urlq, requestOptionsQ)
           .then((response)=> {
           console.log(response);
             return response.json();
           })
           .then((result)=> {
             alert("Success !! now login to continue");
           })
           .catch((error)=> {
               alert('Error updating user info');
           });
   
         }
  
  register = () => {
const url = "https://auth.astigmatic44.hasura-app.io/v1/signup";
const requestOptions = {
    "method": "POST",
    "headers": {"Content-Type": "application/json"}};
    var body = {
      "provider": "username",
      "data": {   "username": this.state.username,
                  "password": this.state.password }   };

    requestOptions.body = JSON.stringify(body);
    //console.log(requestOptions);
    fetch(url, requestOptions)
    .then((response)=>{
      return response.json();
    })
    .then((result)=> {
     // console.log(result);
      let authToken = result.auth_token; let h_id=result.hasura_id;
      if(result.auth_token!=null)
     this.sendUserInfo(authToken,h_id,this.state.username,this.state.password,this.state.firstname,this.state.lastname,this.state.email,this.state.mobile);
      else
      alert("User exists or Bad password ! Try again !");
    })
    .catch((error)=> {
      alert('Request Failed:' + error);
    });
  }
    render(){
      return (
               <View Scrollable style={{ backgroundColor: "#3498db" , flex: 1, padding: 20, justifyContent: 'center'}}>
                <TextInput value={this.state.firstname} onChangeText={text => this.setState({ firstname: text })} placeholder=" First Name (Optional)" placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, marginTop: -75, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <TextInput value={this.state.lastname} onChangeText={text => this.setState({ lastname: text })} placeholder=" Last Name (Optional)" placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, marginTop: 8, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <TextInput value={this.state.username} onChangeText={text => this.setState({ username: text })} placeholder=" Username (Required)" placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, marginTop: 8, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <TextInput value={this.state.password} onChangeText={text => this.setState({ password: text })} placeholder=" Password (8 or more characters Required)" secureTextEntry={true} placeholderTextColor="#000000" underlineColorAndroid='transparent' style={{height: 40, opacity: 0.5, borderColor: 'rgba(255,255,255,0.7)', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <TextInput value={this.state.email} onChangeText={text => this.setState({ email: text })} placeholder=" Email (Optional)" placeholderTextColor="#000000" underlineColorAndroid='transparent' keyboardType='email-address' style={{height: 40, opacity: 0.5, marginTop: 8, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <TextInput value={this.state.mobile} onChangeText={text => this.setState({ mobile: text })} placeholder=" Mobile No. (Optional)" placeholderTextColor="#000000" underlineColorAndroid='transparent' keyboardType='numeric' style={{height: 40, opacity: 0.5, marginTop: 8, borderColor: 'rgba(255,255,255,0.7)', backgroundColor: 'rgba(255,255,255,0.7)'}}/>
                <Button block style={{backgroundColor: 'violet', marginTop: 5}} onPress={() =>{(this.state.username && this.state.password)?this.register():alert('Username / Password missing')}}>
                <Text style={{color: 'white'}}>Register</Text>
                </Button>
                <Button block style={{backgroundColor: 'blue', marginTop: 5}} onPress={() => Actions.HomeScreen()}>
                <Text style={{color: 'white'}}>Cancel</Text>
                </Button>
               </View>
        );
     }
   };