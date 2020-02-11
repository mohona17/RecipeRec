import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      ingredients: [],
    }
    this.logout = this.logout.bind(this);

  };

  componentDidMount() {
    this.verifyLogin()
    //console.log("User Id " + this.state.userId)
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

  getUserID() {
    console.log("User Session" + this.state.token)
    fetch('/api/usersession?usersession=' + this.state.token)
    .then(res => res.json())
    .then(res => {
        this.setState({
          userId: res.userId
        })
        console.log("UserID" + this.state.userId)
        this.getIngredients(); 
      })
    .catch(err => { throw (err) })
  }

  getIngredients() {
    console.log("Getting ingredients for " + this.state.userId)
    fetch('/api/ingredients?user=' + this.state.userId)
    .then(res => res.json())
    .then(res => {
      var obj = JSON.parse(JSON.stringify(res));
        this.setState({
          ingredients: obj
        })
        console.log("ingredients " + this.state.ingredients)
      })
    .catch(err => { throw (err) })
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
            this.getUserID();
          }
        });
    }
  }

  render() {
    const cards = this.state.ingredients.map((ingredient,index) => {
      // console.log(ingredient.name);
      return (
          <div key={index} class="card">
              <div class="container">
                  <h4><b>{ingredient.name}</b></h4>
              </div>
          </div>
      );
  });
    console.log("from inventory page " + this.state.token)
    if (this.state.token != '') {
      return (
        <div>
          <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button>
          <Header />
          <h2>inventory!</h2>
          <div className="wrapper">     
                {cards}
            </div>
        </div>
      );
    }

    return (
      <div>
        <h2>Error you are not logged in to Inventory page!</h2>
      </div>

    );

  }

}

export default Inventory;
