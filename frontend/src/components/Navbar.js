import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import './navbar.css'; // Import the CSS file

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleClick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        {/* <Link to="/">
          <img src="/bflogo_2.png" alt="BioSales Logo" />
        </Link> */}
        <nav>
          {user ? (
            <div>
              <span style={{fontSize:"10px"}}>{user.email}</span>
              <button className="navbar-button" onClick={handleClick}>
                Log out
              </button>
            </div>
          ) : 
          (
            <div>
              <Link to="/login" className="navbar-button login-button">Login</Link>
              <Link to="/signup" className="navbar-button login-button">Signup</Link>
            </div>
          )
          }
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
