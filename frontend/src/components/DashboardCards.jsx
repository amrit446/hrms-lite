export default function DashboardCards({ summary, loading }) {
  const cards = [
    {
      label: 'Total Employees',
      value: summary?.total_employees ?? '–',
      icon: '👥',
      color: 'card-blue',
    },
    {
      label: 'Attendance Records',
      value: summary?.total_attendance ?? '–',
      icon: '📋',
      color: 'card-purple',
    },
    {
      label: 'Present Today',
      value: summary?.total_present ?? '–',
      icon: '✅',
      color: 'card-green',
    },
    {
      label: 'Absent Today',
      value: summary?.total_absent ?? '–',
      icon: '❌',
      color: 'card-red',
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.color}`}>
          <div className="summary-card-icon">{card.icon}</div>
          <div className="summary-card-body">
            <p className="summary-card-label">{card.label}</p>
            {loading ? (
              <div className="card-skeleton" />
            ) : (
              <h3 className="summary-card-value">{card.value}</h3>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
