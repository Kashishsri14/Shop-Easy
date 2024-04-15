// import React from "react";
// import './App.css';
// import Header from './Header';
// import Home from "./Home";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// function App() {
//   return (
//     // BEM
//     <Router>
//           <div className="App">
//       <Switch>
//         <Route path ="/checkout">
//         <Header />
//         <h1>I AM A CHECKOUT PAGE</h1>
//         </Route>
//         <Route path="/">
//         <Header />
//          <Home />
//         </Route>
//       </Switch>
//        </div>
//     </Router>
//      );
// }

// export default App;


import React, { useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./Checkout";
import Login from './Login';
import { auth } from "./firebase";
import { useStateValue } from "./StateProvider";
import Payment from "./Payment";


function App() {
 const [{}, dispatch] = useStateValue();
  useEffect(() =>{
    // will only run once when the app component loads
    auth.onAuthStateChanged(authUser =>{
      if(authUser){
        // the user has just logged in/ was logged in

        dispatch({
          type: 'SET_USER',
          user: authUser
        })
      }
      else{
        // the user is logged out
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    })

  }, [])
  return (
    // BEM
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/checkout" element={[<Header />, <Checkout />]}/>
          <Route path="/" element={[<Header />, <Home />]}/>
          <Route path="/payment" element={[<Header />, <Payment /> ]}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;