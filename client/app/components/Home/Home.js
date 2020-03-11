import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import 'whatwg-fetch';
import {
  getFromStorage,
  setInStorage
} from '../../utils/storage.js';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      signinloading: false,
      signuploading: false,
      token: '',
      signInUsername: '',
      signInPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpUsername: '',
      signUpPassword: '',
      isAuthenticating: true,
    };

    this.onTextboxChangeSignInUsername = this.onTextboxChangeSignInUsername.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    // this.logout = this.logout.bind(this);

  }

  componentDidMount() {
    this.verifyLogin();
  }

  verifyLogin(){
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj.token;

      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: token,
              signuploading: false,
              signinloading: false
            });
          } else {
            this.setState({
              signuploading: false,
              signinloading: false
            });
          }
        });
    }
    else {
      this.setState({
        signuploading: false,
        signinloading: false
      });
    }
  }

  onTextboxChangeSignInUsername(event) {
    this.setState({
      signInUsername: event.target.value,
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
  onTextboxChangeSignUpUsername(event) {
    this.setState({
      signUpUsername: event.target.value,
    });
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignIn() {
    const {
      signInUsername,
      signInPassword,
    } = this.state;

    this.setState({
      signinLoading: true,
    })

    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.message == "success") {
          console.log("successful login", json.token);
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signinLoading: false,
            signInUsername: '',
            signInPassword: '',
            token: json.token
          });
        }
        else {
          this.setState({
            signinLoading: false,
          });
          alert(json.message);
        }
      });
  }

  onSignUp() {
    const {
      signUpUsername,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
    } = this.state;

    this.setState({
      signuploading: true,
    })

    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: signUpFirstName,
        lastName: signUpLastName,
        username: signUpUsername,
        password: signUpPassword,
      }),
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.message == 'success') {
          this.setState({
            signuploading: false,
            signUpUsername: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
          });
          alert("Account created successfully")
        }
        else {
          this.setState({
            signuploading: false,
          });
          alert(json.message);
        }
      });

  }

  render() {
    const {
      token,
      signInUsername,
      signInPassword,
      signUpUsername,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      signuploading,
      signinloading
    } = this.state;

    var signuplabel,signinlabel = (
      <div></div>
    )

    if (signuploading) signuplabel = (<div>Loading...</div>);
    else signuplabel = (<div>Sign up</div>)

    if (signinloading) signinlabel = (<div>Loading...</div>);
    else signinlabel = (<div>Sign in</div>);

    if (!token) {

      return (
        <div class="container">
          <div class="jumbotron" style={{ backgroundColor: color1, color: color2, marginTop: '2rem' }}>
            <h1>Recipe Recommender</h1>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2>Welcome to Recipe Recommender!</h2>
            <h4>This tool can help you save money and give you inspiration
                  for your next at-home meal.
              </h4>
            <hr></hr>
          </div>
          <div class="row justify-content-md-center" style={{ alignContent: 'center' }}>
            <div class="col col-sm-1 text-center"></div>
            <div class="col col-sm-7 text-center" style={{ overflow: "hidden", borderRadius: "0.5rem" }} >
              <img style={{ flex: 1, height: undefined, width: undefined, resizeMode: 'cover', borderRadius: "0.5rem" }} src="https://www.elizabethrider.com/wp-content/uploads/2014/12/homemade-chicken-stock-recipe-bone-broth-elizabeth-rider.jpeg"></img>
            </div>
            <div class="col col-sm-3 text-center" style={{ backgroundColor: color4, padding: '1rem', borderRadius: '0.5rem' }}>

              <h3>Sign In</h3>
              <input
                class="form-control"
                type="username"
                placeholder="Username"
                value={signInUsername}
                onChange={this.onTextboxChangeSignInUsername}
              ></input><br />
              <input
                class="form-control"
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={this.onTextboxChangeSignInPassword}
              ></input><br />
              <button
                style={{ backgroundColor: color3, color: color2, }}
                class="btn btn-light"
                onClick={this.onSignIn}
              ><b>{signinlabel}</b></button>
              <hr></hr>

              <h3>Sign Up</h3>
              <input
                class="form-control"
                type="text"
                placeholder="First Name"
                value={signUpFirstName}
                onChange={this.onTextboxChangeSignUpFirstName}
              ></input><br />
              <input
                class="form-control"
                type="text"
                placeholder="Last Name"
                value={signUpLastName}
                onChange={this.onTextboxChangeSignUpLastName}
              ></input><br />
              <input
                class="form-control"
                type="Username"
                placeholder="Username"
                value={signUpUsername}
                onChange={this.onTextboxChangeSignUpUsername}
              ></input><br />
              <input
                class="form-control"
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={this.onTextboxChangeSignUpPassword}
              ></input><br />
              <button
                style={{ backgroundColor: color3, color: color2, }}
                class="btn btn-light"
                onClick={this.onSignUp}
              ><b>{signuplabel}</b></button>

            </div>
          </div>

        </div>

      )
    }
    // console.log(this.logout)

    //Go to profile page
    //https://stackoverflow.com/questions/57524053/how-to-pass-props-one-page-to-another-page-via-react-router
    //https://medium.com/javascript-in-plain-english/routing-and-navigation-in-react-cffc26e8a389
    return (
      <div>
        {/* Could change below code */}
        <Redirect to={{
          pathname: "/profile",
          //state: { token: this.state.token},
        }}
        //  <Redirect to="/profile" */
        />
      </div>
    );
  }
}
export default Home;
