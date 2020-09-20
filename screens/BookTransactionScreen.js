import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet,TextInput,Image,KeyboardAvoidingView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as firebase from 'firebase';
import db from '../config';
//console.log(doc.data())
export default class TransactionScreen extends React.Component {
    constructor(){
      super();
      this.state = {
        hasCameraPermissions: null,
        scanned: false,
        scannedBookId: '',
        scannedStudentId:'',
        buttonState: 'normal'
      }
    }

    getCameraPermissions = async () =>{
      const {status} = await Permissions.askAsync(Permissions.CAMERA);
      
      this.setState({
        /*status === "granted" is true when user has granted permission
          status === "granted" is false when user has not granted the permission
        */
        hasCameraPermissions: status === "granted",
        buttonState: id,
        scanned: false
      });
    }

    handleBarCodeScanned = async({type, data})=>{
      const {buttonState} = this.state

      if(buttonState==="BookId"){
        this.setState({
          scanned: true,
          scannedBookId: data,
          buttonState: 'normal'
        });
      }
      else if(buttonState==="StudentId"){
        this.setState({
          scanned: true,
          scannedStudentId: data,
          buttonState: 'normal'
        });
      }
      
    }

initiateBookIssue = async()=>{
  db.collection("transaction").add({
    "studentId":this.state.scannedStudentId,
    "bookId":this.state.scannedBookId,
    "date":firebase.firestore.Timestamp.now().toDate(),
    "transactionType":"Issue"
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    "bookAvailability":false,
    
  })
  db.collection("students").doc(this.state.scannedStudentId).update({
    "numberOfBookIssued":firebase.firestore.FieldValue.increment(1)
  })
  alert("BookIssued");
  this.setState({
    scannedBookId:"",
    scannedStudentId:""
  })
}

initiateBookReturn = async()=>{
  db.collection("transaction").add({
    "studentId":this.state.scannedStudentId,
    "bookId":this.state.scannedBookId,
    "date":firebase.firestore.Timestamp.now().toDate(),
    "transactionType":"Return"
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    "bookAvailability":true
    
  })
  db.collection("students").doc(this.state.scannedStudentId).update({
    "numberOfBookIssued":firebase.firestore.FieldValue.increment(-1)
  })
  alert("BookReturned");
  this.setState({
    scannedBookId:"",
    scannedStudentId:""
  })
}


    handleTransaction = async()=>{
       var TransactionMessage
       db.collection("books").doc(this.state.scannedBookId).get()
       .then((doc)=>{
         var book = doc.data()
         if(book.bookAvailability){
           this.initiateBookIssue()
           TransactionMessage = "bookIssued"
         }
         else {
           this.initiateBookReturn();
           TransactionMessage = "bookReturned"
         }
         console.log(doc.data())
       })
this.setState({TransactionMessage:TransactionMessage})
    }
    render() {
      const hasCameraPermissions = this.state.hasCameraPermissions;
      const scanned = this.state.scanned;
      const buttonState = this.state.buttonState;

      if (buttonState !== "normal" && hasCameraPermissions){
        return(
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        );
      }



      else if (buttonState === "normal"){
       <KeyboardAvoidingView style = {styles.container} behavior = "padding" enabled>
        return(
          <View style={styles.container}>
            <Image source = {require("../assets/booklogo.jpg")} 
            style = {{width:200,height:200}}/>
              <TextInput style = {styles.inputBox}
              value = {this.state.scannedBookId}
              placeholder = "BookId"/> 
<TouchableOpacity style = {styles.scanButton}
onPress={()=>{this.getCameraPermissions("BookId")}}>
 < Text style = {styles.buttonText}>SCAN</Text>
</TouchableOpacity>

<TextInput style = {styles.inputBox}
value = {this.state.scannedStudentId}
              placeholder = "StudentId"/> 
<TouchableOpacity style = {styles.scanButton}
onPress={()=>{this.getCameraPermissions("StudentId")}}>
 < Text style = {styles.buttonText}>SCAN</Text>
</TouchableOpacity>
              
          <Text style={styles.displayText}>{
            hasCameraPermissions===true ? this.state.scannedData: "Request Camera Permission"
          }</Text>     

          <TouchableOpacity
            onPress={this.handleTransactions}
            style={styles.scanButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          
        </View>
        </KeyboardAvoidingView>
        );
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
      margin: 10
    },
    buttonText:{
      fontSize: 20,
    },
    inputBox:{
      width:200,
      height:50,
      borderWidth:2,
      fontSize:20
    },
    buttonText:{
      fontSize:15,
      textAlign:"center",
      marginTop:10
    }
  });