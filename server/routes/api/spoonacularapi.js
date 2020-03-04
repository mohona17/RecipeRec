const config = require('../../../config/config');
const API_KEY = config.rapid_api_key;
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require("request");

module.exports = (spoonacular) => {

  //Uses price breakdown widget
  spoonacular.get('/api/spoonacular/getPrice', (req, res, next) => {
    const { query } = req;
    const { id } = query;
    console.log(id);
    var options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/' + id + '/priceBreakdownWidget.json',
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      // console.log(body.totalCostPerServing)
      var obj = JSON.parse(body)
      // console.log(obj);
      // console.log(obj.totalCostPerServing)
      res.send(JSON.stringify(obj.totalCostPerServing))
    });

  });

  //Get recipe based on ingredients
  spoonacular.get('/api/spoonacular/getRecipe', (req, res, next) => {
    const { query } = req;
    const { ingredients } = query;
    // console.log(query)
    var options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients',
      qs: {
        number: '50',
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

      // console.log(body);
      res.send(body)
    });

  });

  //Using above api call to validate ingredients based on if there is an recipe for the proposed ingredient
  spoonacular.get('/api/spoonacular/validateIngredient', (req, res, next) => {
    const { query } = req;
    const { ingredient } = query;
    // console.log(query)
    var options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients',
      qs: {
        number: '1',
        ranking: '1',
        ignorePantry: 'false',
        ingredients: ingredient,
      },
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      res.send(body)
    });

  });

  //Returns Summary and Instructions
  spoonacular.get('/api/spoonacular/getRecipeInfo', (req, res, next) => {
    const { query } = req;
    const { id } = query;
    var options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk',
      qs: {ids: id},
      headers: {
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      res.send(body)
    });
  });


};