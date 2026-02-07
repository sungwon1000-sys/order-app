import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import menuData from './data/menuData';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [orders, setOrders] = useState([]);
  const [stock, setStock] = useState(
    menuData.map((menu) => ({
      menuId: menu.id,
      menuName: menu.name,
      quantity: 10,
    }))
  );

  const handleNewOrder = (cartItems) => {
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
      {currentPage === 'order' && <OrderPage onNewOrder={handleNewOrder} />}
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
