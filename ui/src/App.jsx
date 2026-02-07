import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import menuData from './data/menuData';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [stock, setStock] = useState(
    menuData.map((menu) => ({
      menuId: menu.id,
      menuName: menu.name,
      quantity: 10,
    }))
  );

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

  const handleRemoveItem = (menuId, selectedOptions) => {
    setCartItems((prev) => {
      const optionKey = selectedOptions
        .map((o) => o.id)
        .sort()
        .join(',');
      return prev.filter(
        (item) =>
          !(
            item.menuId === menuId &&
            item.selectedOptions
              .map((o) => o.id)
              .sort()
              .join(',') === optionKey
          )
      );
    });
  };

  const handleNewOrder = () => {
    if (cartItems.length === 0) return;
    const now = new Date();
    const newOrder = {
      id: Date.now(),
      orderTime: now.toISOString(),
      items: cartItems.map((item) => ({
        menuName: item.menuName,
        quantity: item.quantity,
        options: item.selectedOptions.map((o) => o.name),
        price: item.totalPrice,
      })),
      totalPrice: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
      status: '주문 접수',
    };
    setOrders((prev) => [newOrder, ...prev]);
    alert('주문이 완료되었습니다!');
    setCartItems([]);
  };

  const handleStatusChange = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus = {
          '주문 접수': '제조 중',
          '제조 중': '제조 완료',
        };
        const newStatus = nextStatus[order.status];
        if (!newStatus) return order;
        return { ...order, status: newStatus };
      })
    );
  };

  const handleStockChange = (menuId, delta) => {
    setStock((prev) =>
      prev.map((s) => {
        if (s.menuId !== menuId) return s;
        const newQty = s.quantity + delta;
        if (newQty < 0) return s;
        return { ...s, quantity: newQty };
      })
    );
  };

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'order' && (
        <OrderPage
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onRemoveItem={handleRemoveItem}
          onOrder={handleNewOrder}
        />
      )}
      {currentPage === 'admin' && (
        <AdminPage
          orders={orders}
          stock={stock}
          onStatusChange={handleStatusChange}
          onStockChange={handleStockChange}
        />
      )}
    </>
  );
}

export default App;
