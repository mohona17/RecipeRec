import React from 'react';
import Header from '../Header/Header';
//https://stackoverflow.com/questions/43262599/call-js-function-from-another-file-in-react
import { logout } from '../Home/Home'
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
        });
    }
  }
  render() {
    console.log(this.state.token)

    if (this.state.token != '') {
      return (
        <div class="container">
          <button class="btn btn-secondary ml-auto pull-right" style={{ color: '#4F1A1A', margin:'1rem'}} onClick={this.logout}>Logout</button>
          <Header />
          <div style={{ backgroundColor: '#D5D6D4', padding:'1rem', borderRadius:'0.5rem'}}>
            <div style={{ margin: '5rem' , alignContent:'center', alignSelf:'center'}}>
              <h2>Congratulations, you have successfully logged in!</h2>
              <hr></hr>
              <h3>This is the home page for Recipe Recommender. To navigate through this application, use the navigation bar above.</h3>
              <h3>"Home" Tab</h3>
              <h4>This tab leads to the page that you are currently on.</h4>
              <h3>"My Ingredients" Tab</h3>
              <h4>This tab opens up an inventory page where you can view your ingredients and edit this list.</h4>
              <h3>"Search for Recipe" Tab</h3>
              <h4>This tab allows you to chose ingredients from your inventory, set a budget, and search for recipes.
                Your matching recipes will show up once you click search, and you will be able to retrieve the instructions
                for each recipe.
          </h4>
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