
import React ,{useEffect, useState}from "react";
import {connect} from "react-redux";
import { View,StyleSheet,Text,ScrollView, TouchableOpacity,ActivityIndicator,scrollTo, Image} from 'react-native';
import {get_data} from '../store/acion/index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TrackPlayer ,{State} from 'react-native-track-player';
import FilePickerManager from 'react-native-file-picker';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import { startCounter, stopCounter } from 'react-native-accurate-step-counter';
import { LogBox } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { useRef } from 'react';

function Home(Props) {

 





let [sounds,setSound]=useState([])
let [animate,setAnimate]=useState(true)
  let [play,setPlay]=useState(false)
let [error,setError]=useState('')

let [current,setCurret]=useState('')
useEffect(()=>{
RegisterEvent()
},[])


let [step,setStep]=useState(0)

useEffect(() => {
  const config = {
    default_threshold: 15.0,
    default_delay: 150000,
    cheatInterval: 3000,
    onStepCountChange:async (stepCount) => {

      setStep(stepCount)
      
      await TrackPlayer.play();
setPlay(true)


        setTimeout(async() => {
          await TrackPlayer.pause();
          setPlay(false)

        }, 2000)

       BackgroundTimer.setTimeout(async() => {
          await TrackPlayer.pause();
          setPlay(false)

        }, 2000)

        

    },
    onCheat: () => { console.log("User is Cheating") }
  }
  startCounter(config);

  return () => { stopCounter() }




}, []);






let RegisterEvent=async()=>{



  await TrackPlayer.setupPlayer();




database().ref('/').child('audio').on('value',async(v)=>{
let arr=[]
v.forEach(v => {
arr.push(v.val())
});




var currentIndex = arr.length, temporaryValue, randomIndex;
while (0 !== currentIndex) {
  randomIndex = Math.floor(Math.random() * currentIndex);
  currentIndex -= 1;
  temporaryValue = arr[currentIndex];
  arr[currentIndex] = arr[randomIndex];
  arr[randomIndex] = temporaryValue;
}


 // Add a track to the queue
 await TrackPlayer.add(arr);

 setCurret(arr[0].title)

 setSound(arr)

 setTimeout(() => {
  setAnimate(false)
 }, 1000);

})
}


let StartMusic=async()=>{
 
  // Start playing it
  await TrackPlayer.play();

  setPlay(true)


 

}





let uploadMusic=async()=>{
  

    return new Promise(function(myResolve, myReject) {
    FilePickerManager.showFilePicker(null, (response) => {
      if (response.didCancel) {
console.log("cancel by user");
      }
      else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
        
      }
      else 
      {


if(response.type.search('audio')>=0){
  console.log(response.type);

setError('')


  const reference = storage().ref(`/Sender/${response.fileName}`);
          const task = reference.putFile(response.path);
        task.on('state_changed', taskSnapshot => {
           
           let perc=(taskSnapshot.bytesTransferred/taskSnapshot.totalBytes)*100;

           setError(`Upload Percentage : ${Math.floor(perc)} % `)
          });
          task.then(async() => {



      setError('Done')
      myResolve();
  
      let url=await storage()
      .ref(`/Sender/${response.fileName}`)
      .getDownloadURL();




    
      database().ref('/').child(`audio/`).push({
        url:url,      
        title:response.fileName});
         




          }); 
}


else{
  

setError('Invalid File, Just use audio file  ')
}
       
 
      
      
      }
  });
});


  

}




let stopMusic=async()=>{

  await TrackPlayer.stop();

  setPlay(false) 
setAnimate(true)



setTimeout(() => {
  setAnimate(false)
}, 2000);

}




let startME=async(v)=>{


  setCurret(v.title)

  await TrackPlayer.reset();

  await TrackPlayer.add(v);


setAnimate(true)
setPlay(true)


setTimeout(async() => {
  setAnimate(false)
  await TrackPlayer.play()

}, 2000);

}

  return(
    
    
    
  
      <View  style={{flex:1,backgroundColor:'#000',display:'flex',alignItems:'center'}}>

<Image source={require('../logo.png')} style={{width:250,height:250}}>

</Image>


<Text style={{fontSize:21,fontWeight:'700',color:'#921616',marginTop:-20}}>
  Welcome to Moving Stories 
</Text>

<Text style={{fontSize:10,color:'#E3B800',width:'70%',textAlign:'center',marginTop:0}}>
       Amazing platform where you can Hear Random music & Contribute with Us by uploading music.
</Text> 


<ScrollView  style={{width:'100%'}} >




{animate?

<ActivityIndicator animating={animate} size="large" style={{marginTop:80}} color="#E3B800" />

:


play ?  
  

  <TouchableOpacity style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:50}} onPress={()=>{stopMusic()}}>
  
  <Icon name="pause" size={80} color="#fff"  />
  
  
  
  </TouchableOpacity>
  
  :
  
  
  <TouchableOpacity style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',marginTop:50}} onPress={()=>{StartMusic()}}>
  
  <Icon name="play" size={60} color="#fff"  />
  
  
  
  </TouchableOpacity>
  

}
     

<Text style={{fontSize:13,fontWeight:'bold',color:'#fff',width:'100%',textAlign:'center',marginTop:20}}>
  {current}
</Text>



<View style={{width:'100%',marginTop:30,display:'flex',alignItems:'center',justifyContent:'center'}}>



{sounds.map((v,i)=>{
  return(
    <TouchableOpacity onPress={()=>{startME(v)}} key={i} activeOpacity={0.6} style={{width:'100%',height:100,backgroundColor:'#000',marginHorizontal:20,borderRadius:20,marginTop:10,backgroundColor:'#FFCF00',display:'flex',alignItems:'center',justifyContent:'flex-start',flexDirection:'row'}}> 
  
  <Icon name="play" size={30} style={{marginLeft:40}} color="#fff"  />
  
  
  <Text style={{fontSize:17,fontWeight:'bold',color:'#000',marginLeft:20,width:'75%',maxHeight:100,textAlign:'center'}}>
{v.title}
  </Text>


</TouchableOpacity>
  )
})}




</View>


</ScrollView>










<TouchableOpacity style={{width:60,height:60,display:'flex',alignItems:'center',justifyContent:'center',position:'absolute',bottom:30,right:10,backgroundColor:'#fff',borderRadius:100}} activeOpacity={0.7} onPress={()=>{uploadMusic()}}>

<Icon name="upload" size={20} color="#000"  />



</TouchableOpacity>


<Text style={{color:'red',position:'absolute',bottom:10,right:10,fontSize:10}}>{error}</Text>



      </View>


    )
}



const styles = StyleSheet.create({

  });
  

  const mapStateToProps = (state) => {
    return {
    name1:state.name
    }
  }
  
  
  const mapDispatchToProps = dispatch => {
    return {
      // dispatching plain actions
      get_data: () => dispatch(get_data)  
    
    }}

    export default connect(mapStateToProps,mapDispatchToProps)(Home)