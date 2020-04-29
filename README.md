# Recipe Recommender
This tool was created in hopes of motivating users to make more meals at home to reduce food waste and cost. The application allows users to store ingredients they have at home and generate recipes based off selected ingredients. 

The project was built using the MERN Stack, which consists of MongoDB, Express, React, and Node.js. The API used was Spoonacular API which holds information regarding ingredients and recipes. 

### Viewing the tool 
To use this project, make a config.js file in /config with the following keys:db_dev, db, rapid_api_key. The first two are from your MongoDB cluster and the last is from RapidAPI. 
The formating of the config.js file is as follows: 
```
module.exports = {
  db: 'mongodb+srv://[...]',
  db_dev: 'mongodb+srv://[...]',
  rapid_api_key: '[...]',
};
```
### Current status
Although the project is not complete to my liking, it is a good proof-of-concept. Some additional features I could add are allowing the users to scan receipts, input measurements, and take serving size into account. 

The Login Page is shown below. It uses tokens to keep track of user sessions and the users are stored in MongoDB. A tutorial I followed to help me with this is https://www.youtube.com/watch?v=s1swJLYxLAA. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/loginPage.png" alt="login" width="400">

Once logged in, the user is taken to the Home Page which gives information about how to use the site. All of the text is static. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/homePage.png" alt="home" width="400">

The user can use the navigation bar to go to the Inventory and Search Pages. 
The Inventory Page allows users to keep track of ingredients by allowing them to add or delete ingredients. The ingredients are stored in MongoDB and are associated with user IDs. The ingredient names are checked for validity using the Spoonacular API. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/inventoryPage.png" alt="inventory" width="400">

Users can search for recipes using the Search Page which allows users to click on ingredients and optionally set a budget. The form also offered error handling for faulty input. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/searchPage.png" alt="search" width="400">

Once recipes are generated the user would view recipe cards on the search page just like the ones below. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/recipeCards.png" alt="cards" width="400">

If the user wants more than just a summary of the recipe, they can view an extended view of the cards. 

<img src="https://github.com/mohona17/RecipeRec/blob/master/Screenshots/extendedCardView.png" alt="extended" width="400">

The tool was also made responsive by modifying the navigation bar wording and tweaking the CSS for the user interface. 

#### Important note 
Since I had a time constraint for this project, it is not a final product. Also, an important note is that I had some difficulty utilizing cascading style sheets for this project due to configuration problems with the webpack. This was the first time I was using webpack and it was not feasible to debug this issue for more than a few days. As a result, the styling for the project was done by using inline CSS. Although this was time consuming, it was the best route I could take at the time. 

## Template from https://github.com/keithweaver/MERN-boilerplate
### The following text is from the readme
This is a boilerplate project using the following technologies:
- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation


### Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```


### Running

Make sure to add a `config.js` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
