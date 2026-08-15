function PopularRoutes({ routes = [] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Most Popular Routes</h3>
      </div>

      <div className="chart-list">
        {routes.length > 0 ? (
          routes.map((route) => (
            <div key={route.label} className="chart-row">
              <span>{route.label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${Math.max(route.count * 20, 30)}%` }} />
              </div>
            </div>
          ))
        ) : (
          <p>No route frequency data available yet.</p>
        )}
      </div>
    </section>
  );
}

export default PopularRoutes;
