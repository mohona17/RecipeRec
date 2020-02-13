import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';
import InventoryList from './InventoryList';
import {
  addIngredient,
} from './InventoryList';

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      ingredients: [],
    }
    this.logout = this.logout.bind(this);
    // this.addIngredient = this.addIngredient.bind(this);
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
        this.getIngredients()
      })
      .catch(err => { throw (err) })
  }

  getIngredients() {
    // console.log("Getting ingredients for " + this.state.userId)
    fetch('/api/ingredients?user=' + this.state.userId)
      .then(res => res.json())
      .then(res => {
        var obj = JSON.parse(JSON.stringify(res));
        this.setState({
          ingredients: obj
        })
        // console.log("ingredients " + this.state.ingredients)
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
  // //Button action to add ingredient
  // addIngredient(name){
  //   const ingredient = {
  //     "name": name,
  //     "userId": this.state.userId
  //   }

  //   return (
  //     fetch('/api/ingredient/add', {
  //       method: 'POST',
  //       body: JSON.stringify(ingredient),
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //     })
  //   )
  // };

  render() {
    //Layout of Ingredients
    //Moved to InventoryList
    // var cards = this.state.ingredients.map((ingredient, index) => {
    //   // console.log(ingredient.name);
    //   return (
    //     <div key={index} class="card">
    //       <div class="wrapper">
    //         <h4><b>{ingredient.name}</b></h4>
    //         <button class="btn btn-secondary right">Delete</button>
    //       </div>
    //     </div>
    //   );
    // });

    const addIngredientForm =
      (<div class="form">
        <h3>Add an ingredient</h3>
        <form>
          <input type="text" placeholder="Name of ingredient" ref="ingredientname"></input>
        </form>
        <button className="myButton"
          onClick={() => {
            if (this.refs.ingredientname.value) {
              addIngredient(this.refs.ingredientname.value, this.state.userId)
              //This updates the state of ingredients that is sent to Inventory list, causing an update :)
              this.getIngredients();
              //Resetting form text
              this.refs.ingredientname.value = ''
              alert("Added ingredient")
            }
            else {
              alert("Make sure all entries are completed.");
            }
          }}
        >add</button>
      </div>
      );


    if (this.state.token != '') {
      //Calling this function continuously so inventory list can update if needed.
      this.getIngredients();
      return (
        <div>
          <button class="btn btn-secondary ml-auto pull-right" onClick={this.logout} >Logout</button>
          <Header />
          <h2>The ingredients you currently have:</h2>
          <div className="wrapper">
            {/* {cards} */}
            <InventoryList token={this.state.token} ingredients={this.state.ingredients} ></InventoryList>
          </div>
          {addIngredientForm}
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
