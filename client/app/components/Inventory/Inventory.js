import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';
import Header from '../Header/Header';
import InventoryList from './InventoryList';
import {
  addIngredient,
} from './InventoryList';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey
const color5 = "#B7B7B7" //darkgrey

class Inventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      userId: '',
      ingredients: [],
      isAuthenticating: true,
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
        /*This is where everything needed for the page is loaded when a user 
        session is found, so this is the time to render something*/
        this.setState({ isAuthenticating: false })
      })
      .catch(err => {
        throw (err)
      })
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
          else {
            //if the user is not logged in, this is when a page should render
            this.setState({ isAuthenticating: false })
          }
        });
    }
  }

  validateIngredient(name) {
    //validate ingredient: if empty, not ingredient
    if (name == '') return;

    fetch('/api/spoonacular/validateIngredient?ingredient=' + name.value)
      .then(res => res.json())
      .then(res => {
        if (res.length == 0) {
          alert("Invalid ingredient name. Cannot add.")
        }
        else {
          addIngredient(this.refs.ingredientname.value, this.state.userId)
          //This updates the state of ingredients that is sent to Inventory list, causing an update :)
          this.getIngredients();
          //Resetting form text
          this.refs.ingredientname.value = ''
          // alert("Added ingredient")
        }
      })
      .catch(err => { throw (err) })
  }

  render() {

    const addIngredientForm =
      (<div class="form">
        <h1><b>Just bought</b></h1>
        <hr></hr>
        <div className="wrapper" style={{ backgroundColor: color4, padding: "1.5rem", margin: "2rem", borderRadius: "0.5rem" }}>
          <br></br>
          <form >
            <input class="form-control" type="text" placeholder="Name of ingredient" ref="ingredientname"></input>
          </form>
          <br></br>
          <button
            style={{ backgroundColor: color5 }}
            type="button"
            class="btn btn-dark"
            onClick={() => {
              if (this.refs.ingredientname.value) {
                this.validateIngredient(this.refs.ingredientname)
                // if (this.validateIngredient(this.refs.ingredientname)) {
                //   addIngredient(this.refs.ingredientname.value, this.state.userId)
                //   //This updates the state of ingredients that is sent to Inventory list, causing an update :)
                //   this.getIngredients();
                //   //Resetting form text
                //   this.refs.ingredientname.value = ''
                //   alert("Added ingredient")
                // }
                // else {
                //   alert("Invalid ingredient name. Cannot add.")
                // }
              }
              else {
                alert("Make sure all entries are completed.");
              }
            }}
          ><b>Add ingredient</b></button>
        </div>
      </div>
      );

    if (this.state.isAuthenticating) return (<p>Loading...</p>)


    if (this.state.token != '') {
      //Calling this function continuously so inventory list can update if needed.
      this.getIngredients();
      return (
        <div class="container">
          <button class="btn btn-secondary ml-auto pull-right" style={{ margin: '3rem' }} onClick={this.logout} >Logout</button>
          <Header />
          <div style={{ backgroundColor: color4, padding: '3rem', borderRadius: '0.5rem' }}>
            <div style={{ backgroundColor: color1, padding: '1rem', borderRadius: '0.5rem' }}>
              <h2 style={{ textAlign: "center" }}>What's in your kitchen?</h2>
              <h4 style={{ textAlign: "center" }}>Add or delete ingredients here.</h4>
            </div>
            <div class="row justify-content-md-center" style={{ alignContent: 'center', backgroundColor: color4, padding: "1rem", borderRadius: "0.5rem" }}>
              <div class="col col-sm-6" style={{ textAlign: "center" }}>
                <h1><b>In my kitchen</b></h1>
                <hr></hr>
                <div className="wrapper" style={{ paddingLeft: "4rem", paddingRight: "4rem" }}>
                  <InventoryList token={this.state.token} ingredients={this.state.ingredients} ></InventoryList>
                </div>
              </div>
              <div class="col col-sm-6 text-center">
                {addIngredientForm}

              </div>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div class="container">
        <h2>Error you are not logged in to Inventory page!</h2>
      </div>
    );

  }

}

export default Inventory;
