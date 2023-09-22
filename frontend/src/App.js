import React, { useEffect, useState } from 'react'

import ProcessOrder from './components/seller/ProcessOrder';
import { useSelector } from 'react-redux';
import OrdersList from './components/seller/OrdersList';
import UpdateProduct from './components/seller/UpdateProduct';
import NewProduct from './components/seller/NewProduct';
import ProductsList from './components/seller/ProductsList';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { BrowserRouter as Router, Routes, Route , Redirect } from 'react-router-dom';
import Login from "./components/sellerProfile/Login";
import Register from "./components/sellerProfile/Register";
import Profile from './components/sellerProfile/Profile';
import UpdateProfile from './components/sellerProfile/UpdateProfile';
import UpdatePassword from './components/sellerProfile/UpdatePassword';
import ForgotPassword from './components/sellerProfile/ForgotPassword';
import NewPassword from './components/sellerProfile/NewPassword';

import Dashboard from './components/seller/Dashboard'



import ProtectedRoute from './components/route/ProtectedRouteSeller';
import { loadUser } from "./actionsSeller/userActions";
import store  from './store';

function App() {


  useEffect(() =>{
    store.dispatch(loadUser()) //to load loggged in user
  },[])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
    <div className="App">
      <Header/>
      
      <Route path="/seller/login" component={Login} />
      <Route path="/register" component={Register}></Route>
      <Route path="/password/reset/:token" component={NewPassword} exact />
      <Route path="/password/forgot" component={ForgotPassword} exact />
      <ProtectedRoute path="/me" component={Profile} exact></ProtectedRoute>
      <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
      <ProtectedRoute path="/password/update" component={UpdatePassword} exact />
      <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
      <ProtectedRoute path="/seller/products" isAdmin={true} component={ProductsList} exact />
      <ProtectedRoute path="/seller/product" isAdmin={true} component={NewProduct} exact />
      <ProtectedRoute path="/seller/product/:id" isAdmin={true} component={UpdateProduct} exact />
      <ProtectedRoute path="/seller/orders" isAdmin={true} component={OrdersList} exact />
      <ProtectedRoute path="/seller/order/:id" isAdmin={true} component={ProcessOrder} exact />
      {/* { <Redirect from="/" to="/seller/login" /> } */}

      {!loading && (!isAuthenticated || user.role !== 'seller') && (
          <Footer />
        )}

    </div>
    </Router>
  );
}

export default App;
