# レクチャー: よく使うアサーション

> 解説: [docs/03_basic.md](../../../docs/03_basic.md)

## このレクチャーのゴール

`equal` / `deepEqual` / `ok` / `throws` を、**検証したい「形」に応じて使い分けられる**ようにする。

## 前提

[../02-aaa-pattern](../02-aaa-pattern) を済ませていること（AAA でテストを書ける）。

## 題材

- [src/sales.js](./src/sales.js) … 注文を課税/非課税に振り分けて集計する `sumSalesByTaxability`
- [test/sales.test.js](./test/sales.test.js) … 4種のアサーションを使い分けたテスト

## 手順

### 1. equal — 単一の値を検証する

プリミティブ（数値・文字列）の一致に使う。例: 課税売上の合計額 `sales.taxable === 330`。

### 2. deepEqual — 構造の中身を検証する

オブジェクト・配列を**まるごと**比較する。例: `{ taxable: 220, exempt: 5000 }`。

### 3. ok — 真（truthy）であるか

条件式が真であることだけを確かめたいときに使う。

### 4. throws — 例外を検証する（異常系）

不正な入力で関数が**例外を投げる**ことを確認する。`assert.throws(() => fn(), TypeError)`。

### 5. 実行する

```sh
node --test
```

## 使い分けの判断軸

| 検証したいもの | 使うアサーション |
|---|---|
| 数値・文字列が等しい | `equal` |
| オブジェクト・配列の中身が等しい | `deepEqual` |
| とにかく真である | `ok` |
| 例外が投げられる | `throws` |

## 練習

[test/sales.test.js](./test/sales.test.js) のどれかを、別のアサーションで書けないか試す
（例: `equal` で書いた検証を `deepEqual` でまとめる）。
