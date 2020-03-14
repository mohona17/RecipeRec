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
            viewExtraInformation: [],
        }
    };


    showInfo(index) {
        let temp = this.state.viewExtraInformation;
        if (temp[index] == false || temp[index] == undefined) temp[index] = true;
        else if (temp[index] == true) temp[index] = false;
        console.log(temp[index]);
        this.setState({ viewExtraInformation: temp })
    }

    render() {

        const recipeDisplay = this.props.recipes.map((recipe, index) => {
            let text = (<div></div>);
            let buttonText = "View steps and ingredients";
            var ingredients = recipe.ingredients;
            var instructions = recipe.instructions;
            if (this.state.viewExtraInformation[index] == true) {                
                text = (
                    <div>
                        <b>Instructions</b>
                        <br></br>
                        {ingredients.map(ing => <li>{ing}</li>)}
                        <hr></hr>
                        <b>Instructions</b>
                        <br></br>
                        {instructions.map(instr => <li>{instr}</li>)}
                    </div>);
                buttonText = "Go back";
            }
            else text = (
                <div>
                    <p>{recipe.summary}</p>
                    {/* //add ingredients */}
                </div>
            )
            return (
                <div style={{ backgroundColor: color5, borderRadius: '0.5rem', padding: '2rem', margin: '2rem' }}>
                    <h2>{recipe.title}</h2>
                    <div class="row" style={{padding: '1rem', margin: '1rem'}}>
                        <div class="col col-sm-4"><img src={recipe.image} width="300px"></img></div>
                        <div class="col col-sm-8"><p>{text}</p>
                            <button
                                style={{ backgroundColor: color3, color: color2, }}
                                class="btn btn-light"
                                onClick={(e) => this.showInfo(index)}
                            ><b>{buttonText}</b></button>
                        </div>
                    </div>

                </div>
            )
        });

        if (this.props.isLoading) {
            return (
                <h3 style={{ textAlign: "center" }}>Generating your recipes...</h3>
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