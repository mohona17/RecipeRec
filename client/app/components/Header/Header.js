import React from 'react';

import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    {/* <Link to="/">Home</Link>

    <nav>
      <Link to="/helloworld">Hello World</Link>
    </nav>

    
    <hr /> */}
    <p>This is the header</p>
    <nav>
      <Link to="/inventory">My ingredients </Link>
      <Link to="/search">Search for a recipe</Link>
    </nav>
  </header>
);

export default Header;
