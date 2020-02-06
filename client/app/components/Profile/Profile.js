import React from 'react';
import Header from '../Header/Header';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    }
  };
  componentDidMount() {
    if (this.props.location.state != undefined) {
      this.setState({
        token: this.props.location.state.token,
      });
    }
  }

  render() {


    //prints token from sign in
    // console.log(this.props.location.state.token);
    console.log(this.state.token)

    if (this.state.token != '') {
      return (
        <div>
          <Header />
          <h2>Welcome!</h2>

          {/* <p>{token}</p> */}

        </div>
      );
    }

    return (
      <div>
        <h2>Error you are not logged in!</h2>
      </div>

    );


  }

}

export default Profile;