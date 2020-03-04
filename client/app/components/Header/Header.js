//This header is only used for users who have signed in
import React from 'react';

// import { Link } from 'react-router-dom';

const Header = () => (
  <div>
    <header>
      <div class="jumbotron" style={{backgroundColor:'#7A6071',color:"#380024", marginTop:'2rem'}}>
        <h1>Recipe Recommender</h1>
      </div>
      
      <nav class="navbar navbar-light" style={{backgroundColor:'#939DBA', padding: '0.5rem'}}>
      <a class="navbar-brand" href="/profile" style={{color:'#380024'}}><b>Home</b></a>
      <a class="navbar-brand" href="/inventory" style={{color:'#380024'}}><b>My Ingredients</b></a>
      <a class="navbar-brand" href="/search" style={{color:'#380024'}}><b>Search for a Recipe</b></a>


        {/* <Link to="/inventory">My ingredients </Link>
        <Link to="/search">Search for a recipe</Link> */}
      </nav> 
    </header>
  </div>
);

export default Header;
