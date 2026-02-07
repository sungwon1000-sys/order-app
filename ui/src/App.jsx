import { useState } from 'react';
import Header from './components/Header';
import OrderPage from './pages/OrderPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {currentPage === 'order' && <OrderPage />}
      {currentPage === 'admin' && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          관리자 화면은 준비 중입니다.
        </div>
      )}
    </>
  );
}

export default App;
