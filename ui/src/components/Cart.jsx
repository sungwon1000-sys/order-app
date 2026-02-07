import { formatPrice } from '../utils/formatPrice';

function Cart({ cartItems, onOrder, onRemoveItem }) {
  const getCartItemKey = (item) => {
    const optionIds = item.selectedOptions
      .map((o) => o.id)
      .sort()
      .join(',');
    return `${item.menuId}-${optionIds}`;
  };

  const getItemLabel = (item) => {
    const optionNames = item.selectedOptions.map((o) => o.name).join(', ');
    const optionPart = optionNames ? ` (${optionNames})` : '';
    return `${item.menuName}${optionPart} X ${item.quantity}`;
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="cart">
      <div className="cart__items">
        <div className="cart__title">장바구니</div>
        {cartItems.length === 0 ? (
          <div className="cart__empty">장바구니가 비어 있습니다.</div>
        ) : (
          cartItems.map((item) => (
            <div key={getCartItemKey(item)} className="cart__item">
              <span className="cart__item-name">{getItemLabel(item)}</span>
              <span className="cart__item-price">
                {formatPrice(item.totalPrice)}
              </span>
              <button
                className="cart__remove-btn"
                onClick={() => onRemoveItem(item.menuId, item.selectedOptions)}
                title="삭제"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      <div className="cart__summary">
        <div className="cart__total">
          총 금액
          <span className="cart__total-amount">{formatPrice(totalPrice)}</span>
        </div>
        <button
          className="cart__order-btn"
          disabled={cartItems.length === 0}
          onClick={onOrder}
        >
          주문하기
        </button>
      </div>
    </div>
  );
}

export default Cart;
