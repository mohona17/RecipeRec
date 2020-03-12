import React from 'react';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown
const color4 = "#D5D6D4" //lightgrey
const color5 = "#B7B7B7" //darkgrey

class RecipeList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            cards: [],
        }
    };

    componentDidMount() {
    }

    // getRecipeInstruction(id) {
    //     fetch('/api/spoonacular/getRecipeInfo?id=' + id)
    //         .then(res => res.json())
    //         .then(res => {
    //             return (res[0].instruction);
    //         })
    //         .catch(err => { throw (err) })
    // }

    render() {
        const recipeDisplay = this.props.recipes.map((recipe, index) => {
            return (
                <div style = {{backgroundColor:color5, borderRadius: '0.5rem', padding: '1rem', margin: '1rem'}}>
                    <h2>{recipe.title}</h2>
                    <div class = "row">
                    <div class="col col-sm-4"><img src={recipe.image} width="300px"></img></div>
                    <div class="col col-sm-8"><p>{recipe.summary}</p></div>
                    </div>
                </div>
            )
        });

        if (this.props.isLoading) {
            return(
                <h3 style={{textAlign:"center"}}>Generating your recipes...</h3>
            )
        }

        else {
            return (
                <div>
                    {recipeDisplay}
                </div>
            )
        }
    }

};
export default RecipeList;