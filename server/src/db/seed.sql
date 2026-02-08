-- COZY 커피 주문 앱 초기 데이터

-- 메뉴 데이터
INSERT INTO menus (name, description, price, image_url, stock) VALUES
  ('아메리카노(ICE)', '깔끔하고 시원한 아이스 아메리카노', 4000, '/images/americano-ice.png', 10),
  ('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, '/images/americano-hot.png', 10),
  ('카페라떼', '부드러운 우유와 에스프레소의 조화', 5000, '/images/caffe-latte.png', 10),
  ('바닐라라떼', '달콤한 바닐라 향이 가득한 라떼', 5500, '/images/vanilla-latte.png', 10),
  ('카푸치노', '풍성한 우유 거품이 올라간 커피', 5000, '/images/cappuccino.png', 10),
  ('카라멜 마키아또', '달콤한 카라멜 드리즐이 올라간 커피', 5500, '/images/caramel-macchiato.png', 10);

-- 옵션 데이터 (각 메뉴에 샷 추가, 시럽 추가 옵션)
INSERT INTO options (name, price, menu_id) VALUES
  ('샷 추가', 500, 1),
  ('시럽 추가', 0, 1),
  ('샷 추가', 500, 2),
  ('시럽 추가', 0, 2),
  ('샷 추가', 500, 3),
  ('시럽 추가', 0, 3),
  ('샷 추가', 500, 4),
  ('시럽 추가', 0, 4),
  ('샷 추가', 500, 5),
  ('시럽 추가', 0, 5),
  ('샷 추가', 500, 6),
  ('시럽 추가', 0, 6);
