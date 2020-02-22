const config = require('../../../config/config');
const API_KEY = config.rapid_api_key;
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require("request");

module.exports = (spoonacular) => {
    // console.log(API_KEY)
    spoonacular.get('/api/spoonacular/getRecipe', (req, res, next) => {
        const { query } = req;
        const { ingredients } = query;
        console.log(query)
        var options = {
            method: 'GET',
            url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients',
            qs: {
              number: '5',
              ranking: '1',
              ignorePantry: 'false',
              ingredients: ingredients,
            },
            headers: {
              'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
              'x-rapidapi-key': API_KEY
            }
          };
          
          request(options, function (error, response, body) {
              if (error) throw new Error(error);
          
              console.log(body);
          });

    });
};