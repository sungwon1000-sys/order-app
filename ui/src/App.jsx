import { useState, useEffect } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import {
  fetchMenus,
  fetchOrders,
  createOrder,
  updateOrderStatus,
  updateStock,
} from './api';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 메뉴 데이터 로드
  useEffect(() => {
    loadMenus();
  }, []);

  // 관리자 페이지 진입 시 주문 데이터 로드
  useEffect(() => {
    if (currentPage === 'admin') {
      loadOrders();
    }
  }, [currentPage]);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = await fetchMenus();
      setMenus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      console.error('주문 로드 실패:', err.message);
    }
  };

  // 장바구니에 담기
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

  // 장바구니 항목 삭제
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

  // 주문 생성 (API)
  const handleNewOrder = async () => {
    if (cartItems.length === 0) return;
    try {
      await createOrder(cartItems);
      alert('주문이 완료되었습니다!');
      setCartItems([]);
      await loadMenus(); // 재고 갱신
    } catch (err) {
      alert(err.message);
    }
  };

  // 주문 상태 변경 (API)
  const handleStatusChange = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const nextStatus = {
      '주문 접수': '제조 중',
      '제조 중': '제조 완료',
    };
    const newStatus = nextStatus[order.status];
    if (!newStatus) return;

    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders(); // 주문 목록 갱신
    } catch (err) {
      alert(err.message);
    }
  };

  // 재고 변경 (API)
  const handleStockChange = async (menuId, delta) => {
    try {
      await updateStock(menuId, delta);
      await loadMenus(); // 메뉴 데이터 갱신 (재고 포함)
    } catch (err) {
      alert(err.message);
    }
  };

  // 메뉴에서 재고 정보 추출
  const stock = menus.map((menu) => ({
    menuId: menu.id,
    menuName: menu.name,
    quantity: menu.stock,
  }));

  if (loading) {
    return (
      <>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          메뉴를 불러오는 중...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
          {error}
        </div>
      </>
    );
  }

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'order' && (
        <OrderPage
          menus={menus}
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
