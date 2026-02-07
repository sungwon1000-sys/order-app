import { useState } from 'react';
import { formatPrice } from '../utils/formatPrice';

function MenuCard({ menu, onAddToCart }) {
  const [checkedOptions, setCheckedOptions] = useState({});

  const handleOptionChange = (optionId) => {
    setCheckedOptions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  const handleAdd = () => {
    const selectedOptions = menu.options.filter(
      (opt) => checkedOptions[opt.id]
    );
    onAddToCart(menu, selectedOptions);
    setCheckedOptions({});
  };

  return (
    <div className="menu-card">
      <div className="menu-card__image">
        {menu.imageUrl ? (
          <img src={menu.imageUrl} alt={menu.name} />
        ) : (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="8" fill="#d1d5db" />
            <path d="M20 44L28 34L34 40L40 32L44 44H20Z" fill="#9ca3af" />
            <circle cx="38" cy="24" r="4" fill="#9ca3af" />
          </svg>
        )}
      </div>
      <div className="menu-card__body">
        <div className="menu-card__name">{menu.name}</div>
        <div className="menu-card__price">{formatPrice(menu.price)}</div>
        <div className="menu-card__desc">{menu.description}</div>
        <div className="menu-card__options">
          {menu.options.map((option) => (
            <label key={option.id} className="menu-card__option">
              <input
                type="checkbox"
                checked={!!checkedOptions[option.id]}
                onChange={() => handleOptionChange(option.id)}
              />
              {option.name} (+{formatPrice(option.price)})
            </label>
          ))}
        </div>
      </div>
      <div className="menu-card__footer">
        <button className="menu-card__add-btn" onClick={handleAdd}>
          담기
        </button>
      </div>
    </div>
  );
}

export default MenuCard;
