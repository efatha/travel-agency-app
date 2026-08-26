import { Link } from "react-router-dom";
function Navbar(){

return (
<nav className="navbar">
  <h2>East Africa Travel</h2>
  <div className="links">
    <a href="/">Home</a>
    <a href="/routes">Routes</a>
    <a href="/bookings">Bookings</a>
    <a href="/Dashboard">Dashboard</a>
  </div>
</nav>
);

}

export default Navbar;