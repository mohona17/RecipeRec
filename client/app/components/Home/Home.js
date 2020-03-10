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
    // this.logout = this.logout.bind(this);

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
      signinLoading: true,
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
            signinLoading: false,
            signInEmail: '',
            signInPassword: '',
            token: json.token
          });
        }
        else {
          this.setState({
            signInError: json.message,
            signinLoading: false,
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
        email: signUpEmail,
        password: signUpPassword,
      }),
    })
      .then(res => res.text())
      .then(res => {
        console.log(res)
        if (res == 'success') {
          this.setState({
            signuploading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
          });
          alert("Account created successfully")
        }
        else {
          this.setState({
            signUpError: res,
            signuploading: false,
          });
          alert(res);

        }
      });

    /*MongoDB is taking a long time to send a 
    response, so I commented out the correct 
    code for changing the loading status*/
    // this.setState({
    //   // isLoading: false,
    //   signUpEmail: '',
    //   signUpPassword: '',
    //   signUpFirstName: '',
    //   signUpLastName: '',
    // })

  }

  //Moved to Profile
  // logout() {
  //   this.setState({
  //     isLoading: true,
  //   })
  //   const obj = getFromStorage('the_main_app');
  //   if (obj && obj.token) {
  //     const token = obj.token;
  //     console.log(obj.token);

  //     fetch('/api/account/logout?token=' + token)
  //       .then(res => res.json())
  //       .then(json => {
  //         console.log("Logging out", json.success, { token });
  //         console.log('Message from logout request', json.message)
  //         if (json.success) {
  //           this.setState({
  //             token: '',
  //             isLoading: false,
  //           });
  //         } else {
  //           this.setState({
  //             isLoading: false,
  //           });
  //         }
  //       });
  //   }
  //   else {
  //     this.setState({
  //       isLoading: false,
  //     });
  //   }
  // }

  render() {
    const {
      token,
      signInEmail,
      signInPassword,
      signInError,
      signUpError,
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      signuploading,
      signinloading
    } = this.state;

    var signupLoadingMessage,signinLoadingMessage = (
      <div></div>
    )

    if (signuploading) {
      signupLoadingMessage = (<div>
        <p>Loading...</p>
      </div>);
    }

    if (signinloading) {
      signinLoadingMessage = (<div>
        <p>Loading...</p>
      </div>);
    }

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
              {/* {
                (signInError) ? (<p>{signInError}</p>) : (null)
              } */}
              <h3>Sign In</h3>
              <input
                class="form-control"
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={this.onTextboxChangeSignInEmail}
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
              ><b>Sign In</b></button>
              {signinLoadingMessage}
              <hr></hr>
              {/* {
                (signUpError) ? (<p>{signUpError}</p>) : (null)
              } */}
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
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={this.onTextboxChangeSignUpEmail}
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
              ><b>Sign Up</b></button>
              {signupLoadingMessage}

            </div>
          </div>

        </div>

      )
    }
    console.log("hi here", token)
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
