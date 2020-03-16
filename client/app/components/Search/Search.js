import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';
import InventoryList from '../Inventory/InventoryList';
import RecipeList from './RecipeList'
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey
const color5 = "#B7B7B7" //darkgrey

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
      isAuthenticating: true,
    }
    this.logout = this.logout.bind(this);
    this.getSelected = this.getSelected.bind(this);
    this.onTextboxChangeBudget = this.onTextboxChangeBudget.bind(this);
  };

  componentWillMount() {
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
        /*This is where everything needed for the page is loaded when a user 
        session is found, so this is the time to render something*/
        this.setState({ isAuthenticating: false })
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
          else {
            //if the user is not logged in, this is when a page should render
            this.setState({ isAuthenticating: false })
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

  getRecipeInfo() {
    let recipesWithInfo = this.state.recipes;
    recipesWithInfo.forEach(recipe => {
      fetch('/api/spoonacular/getRecipeInfo?id=' + recipe.id)
        .then(res => res.json())
        .then(res => {
          //Used res[0] since multiple recipes show
          if(res == null) return;
          //SUMMARY 
          //the replace part removes tags. if no tags: recipe["summary"] = res[0].summary
          recipe["summary"] = res[0].summary.replace(/(<([^>]+)>)/ig, "");

          //INSTRUCTIONS
          //Get broken down instructions
          if (res[0].analyzedInstructions.length != 0) {
            let instructions = []
            res[0].analyzedInstructions.forEach(element => {
              element.steps.forEach(s => {
                instructions.push(s.step)
              });
            });
            recipe["instructions"] = instructions;
          }
          else{
          recipe["instructions"] = res[0].instructions;
          }
          //if recipe does not have instructions 
          if(recipe.instructions == null) recipe["instructions"] = ["Sorry, no instructions available"]

          //INGREDIENTS
          if (res[0].extendedIngredients.length != 0) {
            let ingredients = []
            res[0].extendedIngredients.forEach(element => {
                ingredients.push(element.original)
            });
            recipe["ingredients"] = ingredients;
          }
          else{
            recipe["ingredients"] = ["Sorry, no ingredients list available"];
          }
        })
        .catch(err => { throw (err) })
    });
    this.setState({ recipes: recipesWithInfo })
    console.log(this.state.recipes)
  }

  //   getRecipeInstruction() {
  //     let recipesWithInstructions = this.state.recipes;
  //     recipesWithInstructions.forEach(recipe => {
  //       fetch('/api/spoonacular/getRecipeInfo?id=' + recipe.id)
  //         .then(res => res.json())
  //         .then(res => {
  //           recipe["instruction"] = res[0].instruction;
  //         })
  //         .catch(err => { throw (err) })
  //     });
  //     this.setState({ recipes: recipesWithInstructions })
  //     this.setState({ isLoading: false });
  //     console.log(this.state.recipes)
  // }

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

  removeDuplicates(array) {
    let recipes = [];
    let titles = [];
    //array is the raw array of recipe objects 
    array.forEach(element => {
      if (!titles.includes(element.title)) {
        //Add to recipes
        recipes.push(element);
        titles.push(element.title);
      }
    });
    return recipes;
  };

  getRecipe() {
    console.log(this.state.budget)
    if(this.state.budget == 0 && this.state.budget != ''){
      alert("Cannot have budget equal to 0."); 
      return;
    }
    if (this.state.selected.length != 0) {
      this.setState({ isLoading: true });
      fetch('/api/spoonacular/getRecipe?ingredients=' + this.state.selected)
        .then(res => res.json())
        .then(res => {
          res = this.removeDuplicates(res);
          this.setState({ recipes: res }, () => {
            console.log("Got recipes")
            // console.log(this.state.recipes)
            console.log("budget", this.state.budget)
            if (this.state.budget != '') {
              this.sortByPrice()
            }
            this.getRecipeInfo();
          });
        })
        .then(() => {
          this.setState({ isLoading: false })
        }
        )
        .catch(err => { throw (err) })
    }
    else {
      alert("You did not select any ingredients")
    }

  }

  render() {
    // console.log("from search page " + this.state.token)
    if (this.state.isAuthenticating) return (<p>Loading...</p>)

    if (this.state.token != '') {
      //Calling this function continuously so inventory list can update if needed.
      this.getIngredients();

      //display selected cards (ingredients)
      // const selectedDisplay = this.state.selected.map((ingredient, index) => {
      //   // console.log(this.state.selected)
      //   return (
      //     <div class="wrapper" >
      //       <h5>{ingredient}</h5>
      //     </div>
      //   );
      // });

      return (
        <div class="container">
          <button class="btn btn-secondary ml-auto pull-right" style={{ marginTop: '3rem', marginRight:"1.5rem"}}onClick={this.logout} >Logout</button>
          <Header />
          <div style={{ backgroundColor: color4, padding: '3rem', borderRadius: '0.5rem' }}>
            <div style={{ backgroundColor: color1, padding: '1rem', borderRadius: '0.5rem' }}>
                <h2 style={{ textAlign: "center" }}>Find a recipe!</h2>
                <h4 style={{ textAlign: "center" }}> It only takes 3 easy steps.</h4>
              </div>
              <div class="row justify-content-md-center" style={{ alignContent: 'center', backgroundColor: color4, padding: "1rem", borderRadius: "0.5rem" }}>
              <div class="col col-sm-5">
                <h3><b>1) My kitchen:</b></h3>
                <hr></hr>
                <h4>Click on ingredients you would like to include in your meal</h4>
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
                <h4> This step is optional</h4>
                <div style={{ backgroundColor: color4, padding: "2rem", borderRadius: "0.5rem" }}>
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
                <h4>Click the button and view results below</h4>
                <button onClick={(e) => this.getRecipe()}
                  style={{ backgroundColor: color5, width: "100%"}}
                  type="button"
                  class="btn btn-dark"
                ><h4><b style={{whiteSpace: "normal"}}>Search for Recipe</b></h4>
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
        <h2 style = {{textAlign:"center"}}>Error you are not logged into search page</h2>
      </div>

    );

  }

}

export default Search;
