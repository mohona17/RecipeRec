//This header is only used for users who have signed in
import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <div class="container">
    <header>
      <div class="jumbotron" style={{backgroundColor:'#BC6E60'}}>
        <h1 style={{color: '#3A1313'}}>Recipe Recommender</h1>
      </div>
      
      <nav class="navbar navbar-light" style={{backgroundColor:'#D6D5C9'}}>
      <a class="navbar-brand" href="/profile" style={{color:'#4F1A1A'}}>Home</a>
      <a class="navbar-brand" href="/inventory" style={{color:'#4F1A1A'}}>My Ingredients</a>
      <a class="navbar-brand" href="/search" style={{color:'#4F1A1A'}}>Search for a Recipe</a>


        {/* <Link to="/inventory">My ingredients </Link>
        <Link to="/search">Search for a recipe</Link> */}
      </nav> 
    </header>
  </div>
);

export default Header;
