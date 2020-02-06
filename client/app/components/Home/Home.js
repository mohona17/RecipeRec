import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';  
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage.js';
import Profile from '../Profile/Profile.js';

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
    this.logout = this.logout.bind(this);

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj.token;

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

  onSignIn() {
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          console.log("successful login", json.token);
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token
          });
        }
        else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignUp() {
    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
    } = this.state;

    this.setState({
      isLoading: true,
    })

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        email: signUpEmail,
        password: signUpPassword,
      }),
    })

    /*MongoDB is taking a long time to send a 
    response, so I commented out the correct 
    code for changing the loading status*/
    this.setState({
      isLoading: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
    })
    // .then(res => res.json())
    // .then(json => {
    // if (json.success) {
    //   this.setState({
    //     signUpError: json.message,
    //     isLoading: false,
    //     signUpEmail: '',
    //     signUpPassword: '',
    //     signUpFirstName: '',
    //     signUpLastName: '',
    //   });
    // }
    // else {
    //   this.setState({
    //     signUpError: json.message,
    //     isLoading: false,
    //   });
    // }
    // });
  }

  logout() {
    this.setState({
      isLoading: true,
    })
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const token = obj.token;
      console.log(obj.token);

      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          console.log("Logging out", json.success, { token });
          console.log('Message from logout request', json.message)
          if (json.success) {
            this.setState({
              token: '',
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
    // console.log('token',token);
    if (!token) {
      return (
        <div>
          <h1>Recipe Recommender</h1>
          <h3>Login to your existing account or sign up to make one!</h3>

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
            <button onClick={this.onSignIn}>Sign In</button>
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
    console.log("hi here", token)

    //Go to profile page
    //https://stackoverflow.com/questions/57524053/how-to-pass-props-one-page-to-another-page-via-react-router
    //https://medium.com/javascript-in-plain-english/routing-and-navigation-in-react-cffc26e8a389
    return (
      <div>
        {/* <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button> */}
        <Redirect to= {{
          pathname:"/profile",
          state: { token: this.state.token }
        }}
        //  <Redirect to="/profile" */
        />
      </div>
    );

    // return (

    //   //NEED TO PUT BACK LOGIN BUTTON
    //   // <div>
    //   //   <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button>
    //   //   <Profile token = {token} ></Profile>
    //   // </div>
    // );
  }
}

export default Home;
