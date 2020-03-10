//This header is only used for users who have signed in
import React from 'react';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown

// import { Link } from 'react-router-dom';

const Header = () => (
  <div>
    <header>
      <div class="jumbotron" style={{backgroundColor: color1, marginTop:'2rem'}}>
        <h1>Recipe Recommender</h1>
      </div>
      
      <nav class="navbar navbar-light" style={{backgroundColor:color3, padding: '0.5rem'}}>
      <a class="navbar-brand" href="/profile" style={{color:color2}}><b>Home</b></a>
      <a class="navbar-brand" href="/inventory" style={{color:color2}}><b>My Ingredients</b></a>
      <a class="navbar-brand" href="/search" style={{color:color2}}><b>Search for a Recipe</b></a>


        {/* <Link to="/inventory">My ingredients </Link>
        <Link to="/search">Search for a recipe</Link> */}
      </nav> 
    </header>
  </div>
);

export default Header;
