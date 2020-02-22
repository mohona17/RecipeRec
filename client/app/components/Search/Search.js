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
      budget: '',
      recipes: [],
    }
    this.logout = this.logout.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.onTextboxChangeBudget = this.onTextboxChangeBudget.bind(this);
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
          // console.log("Logging out", json.success, { token });
          // console.log('Message from logout request', json.message)
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
        // console.log("UserID" + this.state.userId)
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
  onTextboxChangeBudget(event) {
    this.setState({
      budget: event.target.value,
    });
  }
  getSelected(ingredients) {
    // console.log('Selected ingredients in Search Component: ', ingredients[0]);
    this.setState({
      selected: ingredients
    });
  }
  // getSelected() {
  //   this.setState({
  //     selected: this.state.ingredients,
  //   });
  // }
  sortByPrice() {
    console.log("going to sort by price")
    console.log(this.state.recipes[0].id)
    //Budget
    //COME BACK LATER
    // this.state.recipes.foreach(recipe =>
    fetch('/api/spoonacular/getPrice?id=' + this.state.recipes[0].id)
      .then(res => res.text())
      .then(res => {
        //if too expensive
        console.log(res)
        console.log(this.state.budget)
        var price = parseFloat(res);
        var budg = parseFloat(this.state.budget)
        if (price > budg) {
          // this.setState({ selected: this.state.selected.filter(function (item) { return item != name }) }, () => {
          //   this.props.getSelected(this.state.selected);
          //   // console.log(this.state.selected)
          // });
          console.log("Too much")
        }
        else {
          console.log("Within Budget")
        }
        //Reset Budget
        this.setState({ budget: '' }, () => {
          console.log("Reset budget", this.state.budget)
        });
      })
      .catch(err => { throw (err) })
    // //No budget
    // else {

    // }
  }

  getRecipe() {
    // console.log(this.state.selected)
    if (this.state.selected.length != 0) {
      fetch('/api/spoonacular/getRecipe?ingredients=' + this.state.selected)
        .then(res => res.json())
        .then(res => {
          // console.log("hi")
          // // console.log(res)
          console.log(res[0].title) //if res.json, returns properly
          this.setState({ recipes: res }, () => {
            console.log("Got recipes")
            //CHANGE LATER
            if (this.state.budget != '') this.sortByPrice()
          });
        })
        .catch(err => { throw (err) })
    }
    else {
      alert("You did not select any ingredients")
    }

  }

  render() {
    // console.log("from search page " + this.state.token)
    if (this.state.token != '') {
      //Calling this function continuously so inventory list can update if needed.
      this.getIngredients();

      //display selected cards (ingredients)
      const cardDisplay = this.state.selected.map((ingredient, index) => {
        return (
          <div class="wrapper" >
            <h5>{ingredient}</h5>
          </div>
        );
      });

      return (
        <div>
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

          </div>

          {/* User Input  */}
          <h2>You have chosen the following ingredients:</h2>
          <div>{cardDisplay}</div>
          <h4>Specify a budget</h4>
          <input
            type="number"
            min="0.01" step="0.01" max="2500"
            placeholder="$0.00"
            value={this.state.budget}
            onChange={this.onTextboxChangeBudget}
          ></input><br />
          <button onClick={(e) => this.getRecipe()}
            type="button"
            class="btn btn-secondary right">Search for Recipe</button>

          {/* Response from API */}
          {/* <h2>{this.state.recipes}</h2> */}
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
