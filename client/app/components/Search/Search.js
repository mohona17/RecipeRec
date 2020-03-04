import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';
import InventoryList from '../Inventory/InventoryList';
import RecipeList from './RecipeList'

function getPrice(id) {
  console.log("Getting price")
  fetch('/api/spoonacular/getPrice?id=' + id)
    .then(res => res.text())
    .then(res => {
      //if too expensive
      console.log("Price of recipe", res)
      var price = parseFloat(res);
      return price;
    })
}

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
      price: '',
      isLoading: false,
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

  getRecipeSummaries() {
    let recipesWithSummaries = this.state.recipes;
    recipesWithSummaries.forEach(recipe => {
      fetch('/api/spoonacular/getRecipeInfo?id=' + recipe.id)
        .then(res => res.json())
        .then(res => {
          recipe["summary"] = res[0].summary;
          // return(res[0].summary);
        })
        .catch(err => { throw (err) })
    });
    // console.log(recipesWithSummaries)
    this.setState({ recipes: recipesWithSummaries })
  }

  sortByPrice() {
    console.log("going to sort by price")
    var budg = parseFloat(this.state.budget);
    var filteredRecipes = []
    this.state.recipes.forEach(recipe => {
      // const price = getPrice(recipe.id);
      var price = 0;
      fetch('/api/spoonacular/getPrice?id=' + recipe.id)
        .then(res => res.text())
        .then(res => {
          //if too expensive
          console.log("Price of recipe", res)
          price = parseFloat(res) / 10.0;
          return price;
        })
        .then(res => {
          console.log("Price of item", price, "budget", budg)
          if (price <= budg) {
            console.log("Good price", price, recipe.title)
            filteredRecipes.push(recipe)
          }
          else console.log("Bad price", price, recipe.title)
          this.setState({ recipes: filteredRecipes })
          console.log("filteredRecipes", this.state.recipes)
        });
    });
  }


  getRecipe() {
    // console.log(this.state.selected)
    this.setState({isLoading: true});
    if (this.state.selected.length != 0) {
      fetch('/api/spoonacular/getRecipe?ingredients=' + this.state.selected)
        .then(res => res.json())
        .then(res => {
          this.setState({ recipes: res }, () => {
            console.log("Got recipes")
            // console.log(this.state.recipes)
            console.log("budget", this.state.budget)
            if (this.state.budget != '') this.sortByPrice()
            this.getRecipeSummaries();
            this.setState({isLoading: false});
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
      const selectedDisplay = this.state.selected.map((ingredient, index) => {
        // console.log(this.state.selected)
        return (
          <div class="wrapper" >
            <h5>{ingredient}</h5>
          </div>
        );
      });

      return (
        <div class="container">
          <button class="btn btn-secondary ml-auto pull-right" style={{ margin: '3rem' }} onClick={this.logout} >Logout</button>
          <Header />
          <div style={{ backgroundColor: '#D5D6D4', padding: '1rem', borderRadius: '0.5rem' }}>
          <div style={{ margin: '5rem',marginBottom:"1rem", alignContent: 'center', alignSelf: 'center' }}>
              <div style={{ backgroundColor: "#B4B5B3", padding: '1.5rem', borderRadius: '0.5rem' }}>
                <h2 style={{ textAlign: "center" }}>Find a recipe! It only takes 3 easy steps.</h2>
              </div>
            </div>
            <div class="row" style={{margin:"1rem"}} >
              <div class="col col-sm-5">
                <h3><b>1) My kitchen:</b></h3>
                <hr></hr>
                <h4>Below are ingredients in your kitchen. Click on ingredients you would like to include in your meal.</h4>
                <div className="wrapper" style={{ width: "70%", marginLeft: "4rem", marginRight: "4rem" }}>
                  <InventoryList token={this.state.token}
                    ingredients={this.state.ingredients}
                    editable={false}
                    getSelected={this.getSelected}></InventoryList>
                </div>
              </div>
              {/* User Input  */}
              <div class="col col-sm-4">
                <h3><b>2) Specify Budget</b></h3>
                <hr></hr>
                <h4> If you would like to set a budget for any ingredients you would like to buy, please do so below before
                  beginning your search. This step is optional!
              </h4>
                <div style={{ backgroundColor: "#E9EAE8", padding: "2rem", borderRadius: "0.5rem" }}>
                  {/* <h4>I want to make a meal with the following ingredients:</h4>
                {selectedDisplay} */}
                  <input
                    type="number"
                    min="0.01" step="0.01" max="2500"
                    placeholder="$0.00"
                    value={this.state.budget}
                    onChange={this.onTextboxChangeBudget}
                    class="form-control"
                  ></input>
                </div>
              </div>
              <div class="col col-sm-3">
                <h3><b>3) Search!</b></h3>
                <hr></hr>
                <button onClick={(e) => this.getRecipe()}
                  style={{ backgroundColor: '#7A6071', color: "#380024", width: "100%" }}
                  type="button"
                  class="btn btn-dark"
                ><h4>Search for Recipe</h4>
                </button>
              </div>
            </div >
            {/* Response from API */}
            <hr></hr>
            <RecipeList recipes={this.state.recipes} isLoading={this.state.isLoading} ></RecipeList >
          </div >
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
