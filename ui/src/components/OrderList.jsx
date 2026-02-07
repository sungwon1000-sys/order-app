function OrderList({ orders, onStatusChange }) {
  const formatPrice = (price) => {
    return price.toLocaleString() + '원';
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}월 ${day}일 ${hours}:${minutes}`;
  };

  const getButtonConfig = (status) => {
    switch (status) {
      case '주문 접수':
        return { text: '제조 시작', className: 'order-row__btn--accepted' };
      case '제조 중':
        return { text: '제조 완료', className: 'order-row__btn--preparing' };
      case '제조 완료':
        return { text: '완료됨', className: 'order-row__btn--completed' };
      default:
        return { text: status, className: '' };
    }
  };

  const getItemsSummary = (items) => {
    return items
      .map((item) => {
        const optionPart =
          item.options.length > 0 ? ` (${item.options.join(', ')})` : '';
        return `${item.menuName}${optionPart} x ${item.quantity}`;
      })
      .join(', ');
  };

  return (
    <div className="admin-section">
      <div className="admin-section__title">주문 현황</div>
      <div className="order-list">
        {orders.length === 0 ? (
          <div className="order-list__empty">접수된 주문이 없습니다.</div>
        ) : (
          orders.map((order) => {
            const btnConfig = getButtonConfig(order.status);
            return (
              <div key={order.id} className="order-row">
                <div className="order-row__time">{formatTime(order.orderTime)}</div>
                <div className="order-row__items">{getItemsSummary(order.items)}</div>
                <div className="order-row__price">{formatPrice(order.totalPrice)}</div>
                <button
                  className={`order-row__btn ${btnConfig.className}`}
                  disabled={order.status === '제조 완료'}
                  onClick={() => onStatusChange(order.id)}
                >
                  {btnConfig.text}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderList;
