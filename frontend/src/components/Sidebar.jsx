import {Link} from "react-router-dom";

function Sidebar() {
  const items = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Routes", path: "/routes" },
    { label: "Bookings", path: "/bookings" },
    { label: "Customers", path: "/customers" },
    { label: "Payments", path: "/payments" },
    { label: "Logout", path: "/" },
  ];

  return (
    <aside className="sidebar">
      <h3>Admin Menu</h3>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <Link key={item.label} to={item.path} className="sidebar-link">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
