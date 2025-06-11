/*
  # Seed Sample Data for Restaurant App

  This migration adds sample categories and menu items to demonstrate the app functionality.
*/

-- Insert sample categories
INSERT INTO categories (name_en, name_zh, description_en, description_zh, image_url, sort_order) VALUES
('Appetizers', '开胃菜', 'Start your meal with our delicious appetizers', '用我们美味的开胃菜开始您的用餐', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 1),
('Main Courses', '主菜', 'Hearty and satisfying main dishes', '丰盛满足的主菜', 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg', 2),
('Soups', '汤类', 'Warm and comforting soups', '温暖舒适的汤品', 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg', 3),
('Desserts', '甜品', 'Sweet treats to end your meal', '甜蜜的餐后甜品', 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', 4),
('Beverages', '饮品', 'Refreshing drinks and teas', '清爽的饮品和茶类', 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg', 5);

-- Insert sample menu items
INSERT INTO menu_items (category_id, name_en, name_zh, description_en, description_zh, price, image_url, is_featured, preparation_time, calories, ingredients_en, ingredients_zh, sort_order) VALUES
-- Appetizers
((SELECT id FROM categories WHERE name_en = 'Appetizers'), 'Spring Rolls', '春卷', 'Crispy spring rolls with fresh vegetables', '新鲜蔬菜制作的酥脆春卷', 8.50, 'https://images.pexels.com/photos/725997/pexels-photo-725997.jpeg', true, 10, 180, ARRAY['Cabbage', 'Carrots', 'Bean sprouts', 'Rice paper'], ARRAY['卷心菜', '胡萝卜', '豆芽', '米纸'], 1),
((SELECT id FROM categories WHERE name_en = 'Appetizers'), 'Dumplings', '饺子', 'Hand-made pork and chive dumplings', '手工制作的猪肉韭菜饺子', 12.00, 'https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg', true, 15, 220, ARRAY['Pork', 'Chives', 'Flour', 'Ginger'], ARRAY['猪肉', '韭菜', '面粉', '生姜'], 2),
((SELECT id FROM categories WHERE name_en = 'Appetizers'), 'Chicken Wings', '鸡翅', 'Spicy glazed chicken wings', '香辣蜜汁鸡翅', 10.50, 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg', false, 20, 280, ARRAY['Chicken wings', 'Soy sauce', 'Honey', 'Chili'], ARRAY['鸡翅', '生抽', '蜂蜜', '辣椒'], 3),

-- Main Courses
((SELECT id FROM categories WHERE name_en = 'Main Courses'), 'Kung Pao Chicken', '宫保鸡丁', 'Spicy stir-fried chicken with peanuts', '香辣花生炒鸡丁', 18.50, 'https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg', true, 25, 450, ARRAY['Chicken', 'Peanuts', 'Chili peppers', 'Soy sauce'], ARRAY['鸡肉', '花生', '干辣椒', '生抽'], 1),
((SELECT id FROM categories WHERE name_en = 'Main Courses'), 'Sweet and Sour Pork', '糖醋里脊', 'Crispy pork with sweet and sour sauce', '酥脆的糖醋里脊肉', 16.50, 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg', true, 30, 520, ARRAY['Pork', 'Pineapple', 'Bell peppers', 'Vinegar'], ARRAY['猪肉', '菠萝', '彩椒', '醋'], 2),
((SELECT id FROM categories WHERE name_en = 'Main Courses'), 'Beef with Broccoli', '西兰花炒牛肉', 'Tender beef stir-fried with fresh broccoli', '嫩滑牛肉炒新鲜西兰花', 20.00, 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg', false, 20, 380, ARRAY['Beef', 'Broccoli', 'Oyster sauce', 'Garlic'], ARRAY['牛肉', '西兰花', '蚝油', '大蒜'], 3),
((SELECT id FROM categories WHERE name_en = 'Main Courses'), 'Fried Rice', '炒饭', 'Classic fried rice with eggs and vegetables', '经典蛋炒饭配蔬菜', 14.00, 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg', false, 15, 420, ARRAY['Rice', 'Eggs', 'Scallions', 'Soy sauce'], ARRAY['米饭', '鸡蛋', '葱花', '生抽'], 4),

-- Soups
((SELECT id FROM categories WHERE name_en = 'Soups'), 'Hot and Sour Soup', '酸辣汤', 'Traditional hot and sour soup with tofu', '传统豆腐酸辣汤', 9.50, 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg', false, 15, 120, ARRAY['Tofu', 'Mushrooms', 'Vinegar', 'White pepper'], ARRAY['豆腐', '蘑菇', '醋', '白胡椒'], 1),
((SELECT id FROM categories WHERE name_en = 'Soups'), 'Wonton Soup', '馄饨汤', 'Delicate wontons in clear broth', '清汤馄饨', 11.50, 'https://images.pexels.com/photos/6210959/pexels-photo-6210959.jpeg', true, 20, 180, ARRAY['Pork', 'Shrimp', 'Wonton wrappers', 'Bok choy'], ARRAY['猪肉', '虾仁', '馄饨皮', '小白菜'], 2),

-- Desserts
((SELECT id FROM categories WHERE name_en = 'Desserts'), 'Mango Pudding', '芒果布丁', 'Silky smooth mango pudding', '丝滑芒果布丁', 6.50, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg', true, 5, 150, ARRAY['Mango', 'Gelatin', 'Coconut milk', 'Sugar'], ARRAY['芒果', '明膠', '椰浆', '糖'], 1),
((SELECT id FROM categories WHERE name_en = 'Desserts'), 'Red Bean Ice Cream', '红豆冰淇淋', 'Creamy red bean flavored ice cream', '奶香红豆冰淇淋', 5.50, 'https://images.pexels.com/photos/1359327/pexels-photo-1359327.jpeg', false, 2, 200, ARRAY['Red beans', 'Cream', 'Sugar', 'Vanilla'], ARRAY['红豆', '奶油', '糖', '香草'], 2),

-- Beverages
((SELECT id FROM categories WHERE name_en = 'Beverages'), 'Jasmine Tea', '茉莉花茶', 'Fragrant jasmine tea', '香浓茉莉花茶', 4.50, 'https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg', false, 5, 0, ARRAY['Jasmine tea leaves'], ARRAY['茉莉花茶叶'], 1),
((SELECT id FROM categories WHERE name_en = 'Beverages'), 'Fresh Orange Juice', '鲜橙汁', 'Freshly squeezed orange juice', '新鲜现榨橙汁', 6.00, 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg', true, 3, 110, ARRAY['Fresh oranges'], ARRAY['新鲜橙子'], 2),
((SELECT id FROM categories WHERE name_en = 'Beverages'), 'Coconut Water', '椰汁', 'Natural coconut water', '天然椰汁', 5.50, 'https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg', false, 2, 45, ARRAY['Coconut water'], ARRAY['椰汁'], 3);