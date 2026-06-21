# レクチャー: はじめてのテスト

> 解説: [docs/03_basic.md](../../../docs/03_basic.md)

## このレクチャーのゴール

`node:test` で最小のテストを書いて動かし、**緑（成功）と赤（失敗）を自分の目で見る**。

## 題材

- [src/math.js](./src/math.js) … 練習用の小さな純粋関数（`add` / `discounted`）
- [test/first.test.js](./test/first.test.js) … 最初のテスト

## 手順

### 1. はじめてのテストを書く

`test()` でテストを1件定義し、`assert.equal` で「こうなるはず」を表明する。
[test/first.test.js](./test/first.test.js) の `'1 + 1 は 2 になる'` がそれ。

### 2. 実行する

```sh
node --test        # ディレクトリ内のテストを全部実行（npm test でも可）
```

`pass 3 / fail 0` と出れば緑。

### 3. わざと壊して赤を見る

`'割引後の金額'` テストの期待値を `800` → `300` などに書き換えて再実行すると、
「期待値と実際の値」が並んだ失敗メッセージが出る。**この読み方に慣れる**のが目的。直したら戻す。

### 4. watch で回す

```sh
node --test --watch   # 保存のたびに自動実行（npm run test:watch でも可）
```

## 練習

[src/math.js](./src/math.js) に関数を1つ足し、その振る舞いを表すテストを書いて緑にする。

> AAA（準備・実行・検証）は次の [../02-aaa-pattern](../02-aaa-pattern) で扱います。
