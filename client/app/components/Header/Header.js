//This header is only used for users who have signed in
import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
   {/* <Link to="/">Home</Link>

    <nav>
      <Link to="/helloworld">Hello World</Link>
    </nav> */}

    
    
    <h1>Recipe Recommender</h1>
    <nav>
      <Link to="/inventory">My ingredients </Link>
      <Link to="/search">Search for a recipe</Link>
    </nav>
  </header>
);

export default Header;
