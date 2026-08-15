function SummaryCard({ title, value, accent = "#1e88e5" }) {
  return (
    <div className="summary-card" style={{ borderTop: `4px solid ${accent}` }}>
      <p className="summary-label">{title}</p>
      <h3 className="summary-value">{value}</h3>
    </div>
  );
}

export default SummaryCard;
