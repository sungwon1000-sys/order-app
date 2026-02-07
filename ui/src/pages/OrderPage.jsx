import { useState } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import menuData from '../data/menuData';

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (menu, selectedOptions) => {
    setCartItems((prev) => {
      const optionKey = selectedOptions
        .map((o) => o.id)
        .sort()
        .join(',');

      const existingIndex = prev.findIndex(
        (item) =>
          item.menuId === menu.id &&
          item.selectedOptions
            .map((o) => o.id)
            .sort()
            .join(',') === optionKey
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const unitPrice =
          existing.basePrice +
          existing.selectedOptions.reduce((sum, o) => sum + o.price, 0);
        updated[existingIndex] = {
          ...existing,
          quantity: existing.quantity + 1,
          totalPrice: unitPrice * (existing.quantity + 1),
        };
        return updated;
      }

      const optionsTotal = selectedOptions.reduce(
        (sum, o) => sum + o.price,
        0
      );
      const newItem = {
        menuId: menu.id,
        menuName: menu.name,
        basePrice: menu.price,
        selectedOptions,
        quantity: 1,
        totalPrice: menu.price + optionsTotal,
      };
      return [...prev, newItem];
    });
  };

  const handleOrder = () => {
    if (cartItems.length === 0) return;
    alert('주문이 완료되었습니다!');
    setCartItems([]);
  };

  return (
    <div className="page">
      <div className="menu-list">
        {menuData.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={handleAddToCart} />
        ))}
      </div>
      <Cart cartItems={cartItems} onOrder={handleOrder} />
    </div>
  );
}

export default OrderPage;
