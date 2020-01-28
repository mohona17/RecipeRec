import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage.js';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      signUpError: '',
      signInError: '',
      token: '',
    };

  }

  componentDidMount() {
    const token = getFromStorage('the_main_app');
    if (token) {
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: token,
              isLoading: false,
            });
          }else {
            this.setState({
              isLoading: false,
            });
          }
        });
    }
    else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
    } = this.state;

    if (isLoading) {
      return (<div>
        <p>Loading...</p>
      </div>);
    }

    if(!token){
      return(
        <div><p>Sign In </p>
        <p>Sign Up </p></div>
      )
    }

    return (
      <div>Account</div>
    );
  }
}

export default Home;
