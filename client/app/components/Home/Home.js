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
      signInEmail: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpEmail: '',
      signUpPassword: '',
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);

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
          } else {
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

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }
  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }
  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignIn(){
    const {
      signInEmail, 
      signInPassword,
    } = this.state;
  }

  onSignUp(){
    const {
      signUpEmail, 
      signUpPassword,
      signUpFirstName,
      signUpLastName,
    } = this.state;

    this.setState({
      isLoading: true, 
    })

    fetch('/api/account/signup',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName, 
        lastName: signUpLastName, 
        email: signUpEmail, 
        password: signUpPassword,
      }), 
    }).then(res => res.json()
    .then(json => {
      console.log('json',json);
      if(json.success){
        this.setState({
          signUpError: json.message,
          isLoading: false, 
          signUpEmail:'', 
          signUpPassword:'', 
          signUpFirstName:'', 
          signUpLastName:'',
        });
      }
      else{
        this.setState({
          signUpError: json.message,
          isLoading: false, 
        });
      }
    }));
  }

  render() {
    const {
      isLoading,
      token,
      signInEmail,
      signInPassword,
      signInError,
      signUpError, 
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
    } = this.state;

    console.log('Loading?', isLoading)
    if (isLoading) {
      return (<div>
        <p>Loading...</p>
      </div>);
    }

    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (<p>{signInError}</p>) : (null)
            }
            <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            ></input><br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            ></input><br />
            <button onClick={this.onSignIn}>Sign Up</button>
          </div>
          <div>
            {
              (signUpError) ? (<p>{signUpError}</p>) : (null)
            }
            <p>Sign Up</p>
            <input
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            ></input><br />
            <input
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            ></input><br />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            ></input><br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            ></input><br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>
        </div>

      )
    }

    return (
      <div>Account</div>
    );
  }
}

export default Home;
