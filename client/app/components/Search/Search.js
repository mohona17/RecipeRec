import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      logout: Object,
    }

    this.logout = this.logout.bind(this);

  };

  //Idk if this works
  componentDidMount() {
    this.verifyLogin()
    // const obj = getFromStorage('the_main_app');
    // if (obj && obj.token) {
    //   const { token } = obj.token;

    //   fetch('/api/account/verify?token=' + token)
    //     .then(res => res.json())
    //     .then(json => {
    //       if (json.success) {
    //         this.setState({
    //           token: token,
    //         });
    //       }
    //     });
    // }
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
    console.log("from search page " + this.state.token)
    if (this.state.token != '') {
      return (
        <div>
          <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button>
          <Header />
          <h2>Search!</h2>
        </div>
      );
    }

    return (
      <div>
        <h2>Error are not logged in! {this.state.token}</h2>
      </div>

    );

  }

}

export default Search;
