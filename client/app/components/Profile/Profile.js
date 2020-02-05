import React from 'react';
import Header from '../Header/Header';


  const Profile = () => (
    <div>
      <Header />
      <h2>Profile!</h2>

      <p>Use the nav bar!</p>

    </div>
  );

export default Profile;

// class Profile extends React.Component {
//   render() {
//     const { token } = this.props;
//     if (token != null) {
//       return (
//         <div>
//           <Header />
//           <h2>Welcome!</h2>

//           <p>Use the nav bar!</p>

//         </div>
//       );
//     }
//     else {
//       return (
//         <div>
//           <h2>Error you are not logged in</h2>

//         </div>
//       );
//     }

//   }

// }

// export default Profile;