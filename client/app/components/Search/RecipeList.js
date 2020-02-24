import React from 'react';

class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            // ingredients: [],
            // token: '',
            // userId: '',
            // selected: [],
        }
        // this.getIngredients = this.getIngredients.bind(this);
    };

    componentDidMount() {
        //   this.getUserID();
        // console.log("Recipes from list", this.props.recipes)
    }

    // getUserID() {
    //   fetch('/api/usersession?usersession=' + this.props.token)
    //     .then(res => res.json())
    //     .then(res => {
    //       this.setState({
    //         userId: res.userId
    //       })
    //       console.log("UserID" + this.state.userId)
    //     })
    //     .catch(err => { throw (err) })
    // }


    render() {

        const recipeDisplay = this.props.recipes.map((recipe, index) => {
            return (
                <div><h6>{recipe.title}</h6>
                    <img src={recipe.image}></img>
                </div>
            )
        });

        return (
            <div>
                <p>hi</p>
                {recipeDisplay}
            </div>
        )
    }

};
export default RecipeList;
