---
layout: home

hero:
  name: "bury2"
  text: "JavaScript/TypeScriptのためのRuby風メソッドチェーン"
  tagline: "ネイティブプロトタイプを一切汚染しない、表現力豊かなEnumerable & コアユーティリティ。"
  image:
    src: /logo.svg
    alt: bury2 ロゴ
  actions:
    - theme: brand
      text: はじめに
      link: /ja/guide/getting-started
    - theme: alt
      text: APIリファレンス
      link: /ja/api/
    - theme: alt
      text: GitHub
      link: https://github.com/mtsgi/bury2

features:
  - title: 🛡️ プロトタイプ汚染ゼロ
    details: Array.prototype や String.prototype などを一切変更しません。ライブラリ開発やエンタープライズ規模のアプリでも安全に使用できます。
  - title: ⚡ Callable Getter
    details: JavaScript Proxy により、.uniq でも .uniq() でもシームレスに記述でき、完全な TypeScript 型推論が機能します。
  - title: 🔒 完全なイミュータビリティ
    details: すべての変換メソッドは新しいラッパーを返します。元の入力データが破壊的に変更されることはありません。
  - title: 🎯 高度な TypeScript 型推論
    details: ジェネリクスがメソッドチェーン全体を通じて正確に型を追跡・絞り込みます。
  - title: 🪶 ゼロ依存 & 軽量
    details: 実行時外部依存関係ゼロ。ESM / CommonJS のデュアルパッケージ対応です。
  - title: 💎 Ruby の表現力
    details: compact, tally, uniq, clamp, where, pluck, min_by などの Ruby 由来の便利なメソッド群を JS/TS で手軽に活用できます。
---
