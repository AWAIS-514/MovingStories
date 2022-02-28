

import React ,{useState,useEffect} from 'react';
import  AppNavigation from './src/config/navigation' 
// import AnimatedSplash from "react-native-animated-splash-screen";

const App = (props) =>  {

  const [isLoaded, setIsLoaded] = useState(false);
  const [color,setColor]=useState('000')
 


  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);


    setTimeout(() => {
setColor('000')   
 }, 2500);

  }, []);






  return (

  //   <AnimatedSplash 
      
  //   isLoaded={isLoaded}
  //   backgroundColor={`#${color}`}
  //   logoImage={require("./src/logo.png")}
  //   logoHeight={170}
  //       logoWidth={170}
  // >
   <AppNavigation/>


   
//  </AnimatedSplash>
   
   
   );
};



export default App;
