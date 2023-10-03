import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearErrors, googleLogin } from '../../actionsSeller/userActions';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import axios from 'axios';


const Login = ({ history, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (isAuthenticated) {
      history.push(redirect);
      toast.success('Logged in successfully.');
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password))
    history.push('/dashboard');
  };
  const handleGoogleLogin = (credentialResponse) => {
    const dataToSend = JSON.stringify(credentialResponse);
  
    axios
      .post('http://localhost:4000/api/v1/google-login', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response);
  
        // Dispatch a Redux action to handle the response
        dispatch(googleLogin(response.data));
  
        // Check if the response contains a 'redirect' field
        if (response.data.redirect) {
          history.push(response.data.redirect); // Redirect to the specified URL
        } else {
          history.push('/me'); // 
        }
      })
      .catch((error) => {
        // Handle errors if the request fails
        console.error(error);
      });
  };
  
  

  return (
    <Fragment>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={'Login'} />
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mb-3">Login</h1>
                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password_field">Password</label>
                  <input
                    type="password"
                    id="password_field"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot" className="float-right mb-4">
                  Forgot Password?
                </Link>
                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                >
                  LOGIN
                </button>
                <Link to="/register" className="float-right mt-3">
                  New User?
                </Link>
                <div className="mt-3">
                  {/* Include your Google OAuth button component here */}
                  <GoogleLogin
                    onSuccess={handleGoogleLogin} // Call the function to handle Google login
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </div>
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
