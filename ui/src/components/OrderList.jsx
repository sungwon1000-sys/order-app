import { formatPrice } from '../utils/formatPrice';

function OrderList({ orders, onStatusChange }) {
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
              <div key={order.id} className="order-card">
                <div className="order-card__header">
                  <span className="order-card__time">
                    {formatTime(order.orderTime)}
                  </span>
                  <span className="order-card__total">
                    총 {formatPrice(order.totalPrice)}
                  </span>
                  <button
                    className={`order-row__btn ${btnConfig.className}`}
                    disabled={order.status === '제조 완료'}
                    onClick={() => onStatusChange(order.id)}
                  >
                    {btnConfig.text}
                  </button>
                </div>
                <div className="order-card__items">
                  {order.items.map((item, idx) => {
                    const optionPart =
                      item.options.length > 0
                        ? ` (${item.options.join(', ')})`
                        : '';
                    return (
                      <div key={idx} className="order-card__item">
                        <span className="order-card__item-name">
                          {item.menuName}{optionPart} x {item.quantity}
                        </span>
                        <span className="order-card__item-price">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default OrderList;
