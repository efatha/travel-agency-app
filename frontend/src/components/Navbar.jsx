import { Link } from "react-router-dom";
function Navbar(){

return (
<nav className="navbar">
  <h2>East Africa Travel</h2>
  <div className="links">
    <Link to="/">Home</Link>
    <Link to="/routes">Routes</Link>
    <Link to="/bookings">Bookings</Link>
    <Link to="/Dashboard">Dashboard</Link>
  </div>
</nav>
);

}

export default Navbar;