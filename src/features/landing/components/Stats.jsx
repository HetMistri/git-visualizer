/**
 * Stats Component
 *
 * Displays key statistics with animated counters.
 * Numbers animate when scrolled into view via GSAP.
 */

const Stats = () => {
  const stats = [
    { number: 10, label: "Git Operations" },
    { number: 100, label: "% Visual" },
    { number: 0, label: "Setup Required" },
  ];

  return (
    <section className="stats-section">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
