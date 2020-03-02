//This header is only used for users who have signed in
import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <div class="container">
    <header>
      <div class="jumbotron">
        <h1>Recipe Recommender</h1>
      </div>

      <nav class="navbar navbar-light" style={{backgroundColor:'#B9BAA3'}}>
      <a class="navbar-brand" href="/inventory"style={{color:'#902923'}}>My Ingredients</a>
      <a class="navbar-brand" href="/search" style={{color:'#902923'}}>Search for a Recipe</a>


        {/* <Link to="/inventory">My ingredients </Link>
        <Link to="/search">Search for a recipe</Link> */}
      </nav> 
    </header>
  </div>
);

export default Header;
