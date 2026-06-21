-- 初期データ。db.js は items が空のときだけこれを実行する。

-- 税率マスタ（区分ごとに1行）
INSERT INTO taxes (id, category, rate) VALUES
  (1, 'STANDARD', 0.1),
  (2, 'REDUCED', 0.08),
  (3, 'EXEMPT', 0);

-- 商品（tax_id で taxes を参照）
INSERT INTO items (id, name, category, price, tax_id) VALUES
  (1, '小麦粉（薄力粉）750g', '食品',     200,    2),
  (2, 'ノートPC',            '電化製品', 100000, 1),
  (3, '文庫本',              '書籍',     800,    1),
  (4, '緑茶 500ml',          '食品',     150,    2),
  (5, '商品券 5000円分',     'ギフト',   5000,   3),
  (6, '切符（乗車券）',      'チケット', 190,    3);
