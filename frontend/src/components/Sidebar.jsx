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
          <a key={item.label} href={item.path} className="sidebar-link">
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
