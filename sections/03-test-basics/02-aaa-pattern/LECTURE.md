# レクチャー: AAA で読みやすく書く

> 解説: [docs/03_basic.md](../../../docs/03_basic.md)

## このレクチャーのゴール

テストを **Arrange（準備）/ Act（実行）/ Assert（検証）** の3段で書き、
「何を・どうしたら・どうなるべきか」が一目で読める状態にする。

## 前提

[../01-first-test](../01-first-test) を済ませていること（最小例・実行方法）。

## 題材

- [src/cart.js](./src/cart.js) … 02章と同じ EC の題材を小さくした `toCartLine`
- [test/cart.test.js](./test/cart.test.js) … AAA で書いたテスト

## 手順

### 1. AAA の3段を読む

[test/cart.test.js](./test/cart.test.js) の各テストは、コメントで3段に分かれている。

- **Arrange** … 入力データ・前提を用意する
- **Act** … テスト対象を**1回だけ**呼ぶ（`const line = toCartLine(product)`）
- **Assert** … 戻り値が期待どおりか確かめる

### 2. 実行する

```sh
node --test
```

### 3. なぜ読みやすいか

Act が1行に絞られることで「何をテストしているか」が明確になり、
準備と検証が視覚的に分離される。落ちたときも、どの段の問題かを切り分けやすい。

## 練習

[src/cart.js](./src/cart.js) の別パターン（軽減課税の別商品など）を AAA の3段で1件追加する。
