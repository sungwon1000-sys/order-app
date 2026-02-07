function Dashboard({ orders }) {
  const totalOrders = orders.length;
  const accepted = orders.filter((o) => o.status === '주문 접수').length;
  const preparing = orders.filter((o) => o.status === '제조 중').length;
  const completed = orders.filter((o) => o.status === '제조 완료').length;

  const stats = [
    { label: '총 주문', value: totalOrders, color: '#3b82f6' },
    { label: '주문 접수', value: accepted, color: '#f59e0b' },
    { label: '제조 중', value: preparing, color: '#8b5cf6' },
    { label: '제조 완료', value: completed, color: '#10b981' },
  ];

  return (
    <div className="admin-section">
      <div className="admin-section__title">관리자 대시보드</div>
      <div className="dashboard">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard__item">
            <div className="dashboard__label">{stat.label}</div>
            <div
              className="dashboard__value"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
