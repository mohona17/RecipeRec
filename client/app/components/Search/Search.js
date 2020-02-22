import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';
import InventoryList from '../Inventory/InventoryList';


class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      ingredients: [],
      selected: [],
    }
    this.logout = this.logout.bind(this);
    this.getSelected = this.getSelected.bind(this);
  };

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

  getIngredients() {
    // console.log("Getting ingredients for " + this.state.userId)
    fetch('/api/ingredients?user=' + this.state.userId)
      .then(res => res.text())
      .then(res => {
        // console.log(res);
        if (res == "No ingredients") {
          this.setState({
            ingredients: []
          })
        }
        else {
          var obj = JSON.parse(res);
          this.setState({
            ingredients: obj
          })
          // console.log("ingredients " + this.state.ingredients)
        }
      })
      .catch(err => {
        throw (err)
      })
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
        this.getIngredients()
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
            this.getUserID()
          }

        });
    }
  }
  getSelected(ingredients) {
    console.log('Selected ingredients in Search Component: ', ingredients[0]);
    this.setState({
      selected: ingredients
    });
  }
  // getSelected() {
  //   this.setState({
  //     selected: this.state.ingredients,
  //   });
  // }

  getRecipe() {
    console.log("Selected in Get Recipe Call " + this.state.selected)
    fetch('/api/spoonacular/getRecipe?ingredients=' + this.state.selected)
      .then(res => res.json())
      .then(res => {
        console.log(res)
      })
      .catch(err => { throw (err) })
  }

  render() {
    console.log("from search page " + this.state.token)
    if (this.state.token != '') {
      //Calling this function continuously so inventory list can update if needed.
      this.getIngredients();

      //display selected cards 
      const cardDisplay = this.state.selected.map((ingredient, index) => {
        return (
            <div class="wrapper" >
              <h5>{ingredient}</h5>
            </div>
        );
      });

      return (
        <div>
          {/* <div class="row">
            <div class="col"> */}
          <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button>
          <Header />
          <div>
            <h2>The ingredients you currently have:</h2>
            <div className="wrapper">
              <InventoryList token={this.state.token}
                ingredients={this.state.ingredients}
                editable={false}
                getSelected={this.getSelected}></InventoryList>
            </div>
            <div class="col">
              <button onClick={(e) => this.getRecipe()}
                type="button"
                class="btn btn-secondary right">SearchTest</button>
            </div>
          </div>
          <h2>You have chosen the following ingredients:</h2>
          <div>{cardDisplay}</div>
          {/* </div>
          </div> */}
        </div>
      );
    }

    return (
      <div>
        <h2>Error you are not logged into search page</h2>
      </div>

    );

  }

}

export default Search;
