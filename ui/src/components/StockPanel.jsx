function StockPanel({ stock, onStockChange }) {
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: '품절', className: 'stock-card__badge--danger' };
    if (quantity < 5) return { text: '주의', className: 'stock-card__badge--warning' };
    return { text: '정상', className: 'stock-card__badge--normal' };
  };

  return (
    <div className="admin-section">
      <div className="admin-section__title">재고 현황</div>
      <div className="stock-grid">
        {stock.map((item) => {
          const status = getStockStatus(item.quantity);
          return (
            <div key={item.menuId} className="stock-card">
              <div className="stock-card__header">
                <span className="stock-card__name">{item.menuName}</span>
                <span className={`stock-card__badge ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <div className="stock-card__quantity">{item.quantity}개</div>
              <div className="stock-card__controls">
                <button
                  className="stock-card__btn"
                  onClick={() => onStockChange(item.menuId, 1)}
                >
                  +
                </button>
                <button
                  className="stock-card__btn"
                  disabled={item.quantity === 0}
                  onClick={() => onStockChange(item.menuId, -1)}
                >
                  -
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StockPanel;
