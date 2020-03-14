//This header is only used for users who have signed in
import React from 'react';
const color1 = "#E8B866" //yellow
const color2 = "#040A0F"//black
const color3 = "#BD632F" //brown

class Header extends React.Component {


  render() {
    var nav = (<div></div>);
    if (window.outerWidth > 400) {
      nav = (
        <nav class="navbar navbar-light" style={{ backgroundColor: color3, textAlign: "center" }}>
          <a class="navbar-brand" href="/profile" style={{ color: color2, width: "33%" }}><b>Home</b></a>
          <a class="navbar-brand" href="/inventory" style={{ color: color2, width: "33%" }}><b>My Ingredients</b></a>
          <a class="navbar-brand" href="/search" style={{ color: color2, width: "33%" }}><b>Search for Recipe</b></a>
        </nav>
      )
    }
    else {
      nav = (
        <nav class="navbar navbar-light" style={{ backgroundColor: color3, textAlign: "center" }}>
          <a class="navbar-brand" href="/profile" style={{ color: color2, width: "33%" }}><b>Home</b></a>
          <a class="navbar-brand" href="/inventory" style={{ color: color2, width: "33%" }}><b>Ingredients</b></a>
          <a class="navbar-brand" href="/search" style={{ color: color2, width: "33%" }}><b>Search</b></a>
        </nav>
      )
    }

    return (<div>
      <header>
        <div class="jumbotron" style={{ backgroundColor: color1, marginTop: '2rem' }}>
          <h1>Recipe Recommender</h1>
        </div>
        {nav}
      </header>
    </div>
    );
  }
}
export default Header;
