import Dashboard from '../components/Dashboard';
import StockPanel from '../components/StockPanel';
import OrderList from '../components/OrderList';

function AdminPage({ orders, stock, onStatusChange, onStockChange }) {
  return (
    <div className="page admin-page">
      <Dashboard orders={orders} />
      <StockPanel stock={stock} onStockChange={onStockChange} />
      <OrderList orders={orders} onStatusChange={onStatusChange} />
    </div>
  );
}

export default AdminPage;
