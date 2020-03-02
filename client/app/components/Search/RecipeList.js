import React from 'react';

class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            cards:[],
        }
    };

    componentDidMount() {
    }

    getRecipeInstruction(id) {
        fetch('/api/spoonacular/getRecipeInfo?id=' + id)
            .then(res => res.json())
            .then(res => {
                return (res[0].instruction);
            })
            .catch(err => { throw (err) })
    }
    // getRecipeSummary(id) {
    //     fetch('/api/spoonacular/getRecipeInfo?id=' + id)
    //         .then(res => res.json())
    //         .then(res => {
    //             return(res[0].summary);
    //         })
    //         .catch(err => { throw (err) })
    // }
    render() {
        const recipeDisplay = this.props.recipes.map((recipe, index) => {
            // console.log(recipe)
            // console.log(recipe.summary);
            return (
                <div><h6>{recipe.title}</h6>
                    <img src={recipe.image}></img>
                    <p>{recipe.summary}</p>
                </div>
            )
        });

        return (
            <div>
                {recipeDisplay}
            </div>
        )
    }

};
export default RecipeList;
