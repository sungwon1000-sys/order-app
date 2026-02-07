import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import menuData from '../data/menuData';

function OrderPage({ cartItems, onAddToCart, onRemoveItem, onOrder }) {
  return (
    <div className="page">
      <div className="menu-list">
        {menuData.map((menu) => (
          <MenuCard key={menu.id} menu={menu} onAddToCart={onAddToCart} />
        ))}
      </div>
      <Cart
        cartItems={cartItems}
        onOrder={onOrder}
        onRemoveItem={onRemoveItem}
      />
    </div>
  );
}

export default OrderPage;
