import React from 'react';
import Header from '../Header/Header';
//https://stackoverflow.com/questions/43262599/call-js-function-from-another-file-in-react
import { logout } from '../Home/Home'
import {
  getFromStorage,
} from '../../utils/storage.js';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey
const color5 = "#B7B7B7" //darkgrey

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      logout: Object,
      isAuthenticating: true,

    }

    this.logout = this.logout.bind(this);

  };
  componentDidMount() {
    //Below had bugs
    // if (this.props.location.state != undefined) {
    //   this.setState({
    //     token: this.props.location.state.token,
    //     logout: this.props.location.state.Object,
    //   });
    // }
    this.verifyLogin()
  }

  //Contains possible fixes if time (see comments)
  logout() {
    // this.setState({
    //   isLoading: true,
    // })
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
            // this.setState({
            //   isLoading: false,
            // });
          }
        });
    }
    // else {
    //   this.setState({
    //     isLoading: false,
    //   });
    // }
  }

  // pull from storage to verify that a user is logged in. 
  verifyLogin() {
    const obj = getFromStorage('the_main_app');
    console.log("Obj.token from storage " + obj.token)
    if (obj && obj.token) {
      fetch('/api/account/verify?token=' + obj.token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: obj.token,
            });
          }
          /*This is where everything needed for the page is loaded when a user 
        session is found or not found, so this is the time to render something*/
          this.setState({ isAuthenticating: false })
        });
    }
  }
  render() {
    console.log(this.state.token)

    if (this.state.isAuthenticating) return (<p>Loading...</p>)


    if (this.state.token != '') {
      return (
        <div class="container">
          <button class="btn btn-secondary ml-auto pull-right" style={{ margin: '3rem' }} onClick={this.logout}>Logout</button>
          <Header />
          <div style={{ backgroundColor: color4, padding: '1rem', borderRadius: '0.5rem' }}>
            <div style={{ margin: '2rem', alignContent: 'center', alignSelf: 'center' }}>
              <div style={{ backgroundColor: color1, padding: '1rem', borderRadius: '0.5rem' }}>
                <h2 style={{ textAlign: "center" }}>Congratulations, you have successfully logged in!</h2>
              </div>
              <h3 style={{textAlign:"center"}}> To navigate through this application, use the navigation bar above.</h3>
              <br></br>
              <div class="row justify-content-md-center" style={{ alignContent: 'center', backgroundColor: color4, padding: "2rem", borderRadius: "0.5rem" }}>
                <div class="col col col-sm-4 text-center">
                  <h3><b>"Home" Tab</b></h3>
                  <hr></hr>
                  <h4><ul style={{ textAlign: 'left', listStyleType: "circle"}}>
                    <li style={{margin: "10px 0"}}>current tab</li>
                    <li style={{margin: "10px 0"}}>beginner's guide to site</li>
                  </ul></h4></div>
                <div class="col col col-sm-4 text-center">
                  <h3><b>"My Ingredients" Tab</b></h3>
                  <hr></hr>
                  <h4><ul style={{ textAlign: 'left', listStyleType: "circle"}}>
                    <li style={{margin: "10px 0"}}>lists ingredients you have</li>
                    <li style={{margin: "10px 0"}}>delete ingredients </li>
                    <li style={{margin: "10px 0"}}>add new ingredients you just bought</li>
                  </ul></h4></div>                <div class="col col col-sm-4 text-center">
                  <h3><b>"Search for Recipe" Tab</b></h3>
                  <hr></hr>
                  <h4><ul style={{ textAlign: 'left',listStyleType: "circle" }}>
                    <li style={{margin: "10px 0"}}>search for recipes</li>
                    <li style={{margin: "10px 0"}}>set a budget</li>
                  </ul>
                  </h4>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2>Error you are not logged in!</h2>
      </div>

    );


  }

}

export default Profile;