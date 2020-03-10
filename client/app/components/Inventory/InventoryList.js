import React from 'react';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey
const color5 = "#B7B7B7" //darkgrey

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
    this.selectIngredient = this.selectIngredient.bind(this);
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
    .then(res => {
      console.log(res)
      res.json();
      console.log(res.status)
      if(res.status == '200') alert("Successfully deleted ingredient")
    }

    )
    
    // alert("Deleted ingredient")

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


  selectIngredient(ingredient) {
    var name = ingredient.name;
    //Only for search page
    // console.log("State of selected in inv list before selecting " + this.state.selected);
    if (this.state.selected.includes(name)) {
      //Remove name from selected
      // console.log("Contains" + name + "at" + this.state.selected.indexOf(name))
      // this.setState({ selected: this.state.selected.splice(this.state.selected.indexOf(name), 1) }, () => {
      this.setState({ selected: this.state.selected.filter(function (item) { return item != name }) }, () => {
        this.props.getSelected(this.state.selected);
        // console.log(this.state.selected)
      });
    }
    else {
      this.setState({ selected: this.state.selected.concat(name) }, () => {
        this.props.getSelected(this.state.selected);
        // console.log(this.state.selected)
      });

    }
    // console.log("State of selected in inventory list after select" + this.state.selected)
  }

  render() {
    //Displaying cards
    var cards = this.props.ingredients.map((ingredient, index) => {
      // console.log(ingredient.name);
      //The search page passes in a boolean called editable that tells us if the delete button should appears

      if (this.props.editable == false) {
        //Search Page
        if (this.state.selected.includes(ingredient.name)) {
          //highlight ingredient
          return (
            <div key={index} class="card">
              <div class="wrapper" onClick={() => this.selectIngredient(ingredient)} >
                <h3 style={{color:color3}}><b>{ingredient.name}</b></h3>
              </div>
            </div>
          );
        }
        else{
          return (
            <div key={index} class="card">
              <div class="wrapper" onClick={() => this.selectIngredient(ingredient)} >
                <h3><b>{ingredient.name}</b></h3>
              </div>
            </div>
          );
        }
      }
      //editable, on inventory page 
      else {
        return (
          <div key={index} style={{ display: "inline-block", width: "100%" }}>
            <h3 style={{ float: "left", flexWrap: "wrap" }}>{ingredient.name} </h3>
            <button onClick={(e) => this.deleteIngredient(ingredient.name)}
              type="button"
              style={{ float: "right", backgroundColor: color4 }}
              class="btn btn-secondary">
              <img src="https://storage.needpix.com/rsynced_images/garbage-1295900_1280.png" style={{ height: "3rem", verticalAlign: "center" }}>
              </img>
            </button>
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
        <div style={{ backgroundColor: color4, padding: "1.5rem", borderRadius: "0.5rem"}}>
          {cards}
          {/* <p>{this.state.selected}</p> */}
        </div>
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