import React from 'react';
import {
  getFromStorage,
} from '../../utils/storage.js';

class InventoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // ingredients: [],
      token: '',
      userId: '',
      selected: [],
    }
    // this.getIngredients = this.getIngredients.bind(this);
  };

  componentDidMount() {
    this.getUserID();
    console.log(this.props.token + "token from inventorylist")
  }

  getUserID() {
    console.log("User Session from InventoryList" + this.props.token)
    fetch('/api/usersession?usersession=' + this.props.token)
      .then(res => res.json())
      .then(res => {
        this.setState({
          userId: res.userId
        })
        console.log("UserID" + this.state.userId)
        // this.getIngredients();
      })
      .catch(err => { throw (err) })
  }

  deleteIngredient(name) {
    const ingredient = {
      "name": name,
      "userId": this.state.userId
    }

    fetch('/api/ingredient/delete', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      },
    })
    alert("Deleted ingredient")

  }

  // getIngredients() {
  //   console.log("InventoryList:Getting ingredients for " + this.state.userId)
  //   fetch('/api/ingredients?user=' + this.state.userId)
  //     .then(res => res.json())
  //     .then(res => {
  //       var obj = JSON.parse(JSON.stringify(res));
  //       this.setState({
  //         ingredients: obj
  //       })
  //       console.log("ingredients " + this.state.ingredients)
  //     })
  //     .catch(err => { throw (err) })
  // }

  selectIngredient(name) {
    // console.log("Ingredients selected before" , this.state.selected)
    if (this.state.selected.includes(name)) {
      console.log("Contains" + name + "at" + this.state.selected.indexOf(name))
      this.setState({
        selected: this.state.selected.splice(this.state.selected.indexOf(name),1)
      });
    }
    else {
      this.setState({
        selected: this.state.selected.concat(name),
      });
    }
    // console.log("I have selected", this.state.selected)
    this.props.getSelected(this.state.selected);
    console.log(this.props.getSelected)
  }

  render() {
    //Displaying cards
    var cards = this.props.ingredients.map((ingredient, index) => {
      // console.log(ingredient.name);
      //The search page passes in a boolean called editable that tells us if the delete button should appears
      if (this.props.editable == false) {
        //Search Page
        return (
          <div key={index} class="card">
            <div class="wrapper" onClick={(e) => this.selectIngredient(ingredient.name)} >
              <h4><b>{ingredient.name}</b></h4>
            </div>
          </div>
        );
      }
      else {
        return (
          <div key={index} class="card">
            <div class="wrapper">
              <h4><b>{ingredient.name}</b></h4>
              <button onClick={(e) => this.deleteIngredient(ingredient.name)}
                type="button"
                class="btn btn-secondary right">Delete</button>
            </div>
          </div>
        );
      }
    });

    if (this.props.ingredients.length == 0) {
      return (
        <p>There are no ingredients on your list</p>
      )
    }
    else {

      return (
        <div>
          {cards}</div>
      )
    }
  }
};
export default InventoryList;

export function addIngredient(name, userId) {
  const ingredient = {
    "name": name,
    "userId": userId
  }

  return (
    fetch('/api/ingredient/add', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        "Content-Type": "application/json"
      },
    })
    // .then(json => {
    //   if (json.success) {
    //     this.setState({
    //       indredients: this.state.ingredients.concat(ingredient),
    //     });
    //   }
    // })
  )
};