const API_BASE = '/api';

// 메뉴 목록 조회 (옵션 포함)
export async function fetchMenus() {
  const res = await fetch(`${API_BASE}/menus`);
  if (!res.ok) throw new Error('메뉴를 불러오는 데 실패했습니다.');
  return res.json();
}

// 주문 생성 + 재고 차감
export async function createOrder(cartItems) {
  const body = {
    items: cartItems.map((item) => ({
      menuId: item.menuId,
      menuName: item.menuName,
      quantity: item.quantity,
      options: item.selectedOptions.map((o) => o.name),
      price: item.totalPrice,
    })),
    totalPrice: cartItems.reduce((sum, item) => sum + item.totalPrice, 0),
  };

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '주문 생성에 실패했습니다.');
  }
  return res.json();
}

// 주문 목록 조회
export async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('주문 목록을 불러오는 데 실패했습니다.');
  return res.json();
}

// 주문 상태 변경
export async function updateOrderStatus(orderId, newStatus) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '주문 상태 변경에 실패했습니다.');
  }
  return res.json();
}

// 재고 수량 변경
export async function updateStock(menuId, delta) {
  const res = await fetch(`${API_BASE}/menus/${menuId}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delta }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '재고 변경에 실패했습니다.');
  }
  return res.json();
}
