import React from 'react';
import Header from '../Header/Header';
//https://stackoverflow.com/questions/43262599/call-js-function-from-another-file-in-react
import {logout} from '../Home/Home'
import {
  getFromStorage,
} from '../../utils/storage.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      logout: Object,
    }

    this.logout = this.logout.bind(this);

  };
  componentDidMount() {
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
        });
    }
  }
  render() {

    // console.log(this.props.location.state.logout, "props");

    //prints token from sign in
    // console.log(this.props.location.state.token);
    console.log(this.state.token)

    if (this.state.token != '') {
      return (
        <div>
          <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout}>Logout</button>
          <Header />
          <h2>Welcome!</h2>
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