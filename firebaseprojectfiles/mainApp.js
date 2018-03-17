import React, { Component } from 'react';
import { View, TextInput, Image, AsyncStorage, status, Picker,PickerItem } from 'react-native';
import { Container, Header, Title, Content, Form, Input, Item, Button, Text } from 'native-base';
import {Actions} from 'react-native-router-flux';
import firebase from 'react-native-firebase';

let url = "https://auth.astigmatic44.hasura-app.io/v1/user/info";
let authToken = AsyncStorage.getItem('HASURA_AUTH_TOKEN');
let headers = { "Authorization" : "Bearer " + authToken }
let requestOptions = {
    "method": "GET",
    "headers": headers,};

export default class Main extends Component {

    state = {userID: "", ntitle:"Recent Notifications : ",  nmessage: "No Recent Notifications !!", title:"",  message: "", senderID: "", Data:[]};

    getUserInfo() {

     url = "https://auth.astigmatic44.hasura-app.io/v1/user/info";
    authToken = AsyncStorage.getItem('HASURA_AUTH_TOKEN');
    headers = { "Authorization" : "Bearer " + authToken }
     requestOptions = {
                        "method": "GET",
                       "headers": headers,};

        fetch(url,requestOptions)
        .then((response) => {
          return response.json();
        })
        .then((result) => { 
          if(result.username) {
         alert("Logged In Successfully to Notify!");  
          this.generateToken(result.username);
          this.setState({senderID: result.username});}
          else  return Actions.HomeScreen();
         })
        .catch((error) => {
        console.log('User info retrieval:' + error);
      });}

    _onSendButtonPress = () => {    //send notification to FCM server
 var url = "https://api.astigmatic44.hasura-app.io/auth/Send_Notification";

var requestOptions = {
    "method": "POST",
    "headers": { "Content-Type": "application/json" }
};

var body = {
    "User_Name_Reciever": this.state.userID,
    "User_Name_Sender": this.state.senderID,
    "Title": this.state.title,
    "Notification_Message": this.state.message
};

requestOptions.body = JSON.stringify(body);
fetch(url, requestOptions)
.then(function(response) {
    var responseC = response.json();
    return responseC;
})
.then(function(result) {
	alert(result.message);
})
.catch(function(error) {
	console.log('Request Failed  :' + error);
});}

        componentDidMount() {
          this.getUserInfo();
          this.setUsers();     
        }

        generateToken = (user) =>{
            let msg = firebase.messaging();
            msg.requestPermissions();         
              msg.getToken()   //get user device token
              .then((token) => {
              this.sendToken(token,user);
              })
            .catch((error) => {
             console.log('Token Updation:' + error);
            });
            msg.onMessage(payload => {
                console.log(payload);
                this.setState({ntitle: payload.fcm.title,  nmessage: payload.fcm.body});
                alert(payload.fcm.title+'\n'+'\n'+payload.fcm.body);
                });  }

          sendToken = (currentToken,user) => {
            const urq = "https://data.astigmatic44.hasura-app.io/v1/query";
            let requestOptionsQ = {  "method": "POST",
                "headers": {"Content-Type": "application/json",
                            "Authorization": "Bearer " + authToken}};
                  let body = {
                      "type": "update",
                      "args": {  "table": "User_Details",
                    "where": { "User_Name": { "$eq": user }},
                    "$set": { "Device_Id": currentToken }}};
            
                  requestOptionsQ.body = JSON.stringify(body);
    
                  fetch(urq, requestOptionsQ)
                  .then(function(response) {
                    return response.json();
                  })
                  .then(function(result) {
                  console.log(result);
                  })
                  .catch(function(error) {
                    console.log('Request Failed:' + error);
                  });
                }

        setUsers() {
           const urlx = "https://data.astigmatic44.hasura-app.io/v1/query";
           let requestOptions = {
               "method": "POST",
               "headers": {
                   "Content-Type": "application/json"
               }
           };
           const body = {
               "type": "select",
               "args": {
                   "table": "User_Details",
                   "columns": ["*"],
                   "where": { "Device_Id": { "$ne": null}}}};
           requestOptions.body = JSON.stringify(body);
         
          fetch(urlx, requestOptions)
          .then((response) => {
            return response.json();
          })
          .then((adata) => {
           this.setState({Data : adata.map((data)=>{return data.User_Name})});
           }).catch((error) => {
             console.log("FAILED",error);
                         })
                }

                pickerItems() {
                    return this.state.Data.map((name) => (
                      <Picker.Item
                        key={name}
                        value={name}
                        label={name}
                      />
                    ));
                  }

            deleteSessionID = (username) => {
             const urlq = "https://data.astigmatic44.hasura-app.io/v1/query";
              var requestOptions = {
                        "method": "POST",
                       "headers": {"Content-Type": "application/json"}};
                         var body= {"type": "update",
                            "args": {
                           "table": "User_Details",
                           "where": {"User_Name": { "$eq": username } },
                           "$set": {"Session_Id": null}}};
                         requestOptions.body = JSON.stringify(body);
                         fetch(urlq, requestOptions)
                         .then((response)=> {
                           return response.json();
                         })
                         .then((result)=> {
                          console.log("Session Deleted",result);
                         })
                         .catch((error)=> {
                           console.log('Request Failed:' + error);
                         });
                       }
                  
                  
                    logout=()=>{
                        url = "https://auth.astigmatic44.hasura-app.io/v1/user/logout";
                        headers = { "Authorization" : "Bearer " + authToken }
                        requestOptions = {
                            "method": "POST",
                            "headers": headers  };
                     
                      if(authToken!=null){
                      this.deleteSessionID(this.state.senderID);
                      fetch(url, requestOptions)
                      .then(function(response) {
                          return response.json();
                      })
                      .then(function(result) {
                        if(result.message==="logged out")
                        { authToken=null;
                          AsyncStorage.setItem('HASURA_AUTH_TOKEN', authToken);
                          console.log("Logged out successfully !!"); }
                        else
                        console.log("Not logged in !");
                        return Actions.HomeScreen();
                      })
                      .catch(function(error) {
                          console.log('Request Failed:' + error);
                      });}
                    }
                  

    render() {
        
        return(
            <View style={{flex: 1, backgroundColor: '#3498db', padding: 20}}>
            <Text style={{color: 'white', textAlign: 'center', fontSize: 20, fontWeight: 'bold'}} >Welcome to Notify App !!</Text>
            <Image source={require('.././firebaseprojectfiles/notify_logo.png')} style={{height: 90, width: 90, padding: 0, marginLeft: 100}}/>
            <Text style={{color: 'white', textAlign:'center'}} >{this.state.senderID} has Logged in </Text>
            <View style={{flex: 1, backgroundColor: 'lightgreen', padding: 10}}>
            <Text style={{color: 'white'}}>{this.state.ntitle}</Text>
            <Text>{this.state.nmessage}</Text>
            </View>
            <Text>Pick a user to notify</Text>
            <Picker
               style={{backgroundColor: 'lightyellow'}}
               selectedValue={this.state.userID}
               onValueChange={(itemValue, itemIndex) => this.setState({userID: itemValue})}>
                  {this.pickerItems()}
                </Picker>
           
               
                <Item textinput style={{marginTop: 20}}><Input placeholder="Notification Title" placeholderTextColor="#000000" value={this.state.title} onChangeText={text => this.setState({ title: text })} style={{backgroundColor: '#80D8FF'}} /></Item>
                   <Item><Input underlineColorAndroid='transparent' multiline={true} numberOfLines={2} placeholder="Notification Message" value={this.state.message} onChangeText={text => this.setState({ message: text })} placeholderPosition='top' style={{ marginTop: 15, backgroundColor: 'white'}}/></Item>
                <Button block style={{backgroundColor: '#3F51B5', marginTop: 5}} onPress={this._onSendButtonPress.bind(this)} >
                <Text style={{color: 'white'}}>Send</Text>
                </Button>
                <Button block style={{backgroundColor: 'red', marginTop: 5}} onPress={() => this.logout()} >
                <Text style={{color: 'white'}}>Logout</Text>
                </Button>
                
                </View>
        );
    
}
}
