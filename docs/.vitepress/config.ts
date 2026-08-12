import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'bury2',
  description: 'Ruby-like method chains for JavaScript & TypeScript without prototype pollution',
  base: '/bury2/',
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/bury2/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Zen+Maru+Gothic:wght@400;500;700&display=swap',
      },
    ],
  ],

  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API Reference', link: '/api/' },
          { text: 'Cookbook', link: '/guide/cookbook' },
        ],
        sidebar: {
          '/guide/': [
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Callable Getters', link: '/guide/callable-getters' },
                { text: 'Migration from v1', link: '/guide/migration' },
                { text: 'Architecture & Philosophy', link: '/guide/architecture' },
                { text: 'Cookbook & Recipes', link: '/guide/cookbook' },
              ],
            },
            {
              text: 'API Reference',
              items: [
                { text: 'Overview', link: '/api/' },
                { text: 'BuryArray', link: '/api/array' },
                { text: 'BuryString', link: '/api/string' },
                { text: 'BuryNumber', link: '/api/number' },
                { text: 'BuryObject', link: '/api/object' },
              ],
            },
          ],
          '/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'Overview', link: '/api/' },
                { text: 'BuryArray', link: '/api/array' },
                { text: 'BuryString', link: '/api/string' },
                { text: 'BuryNumber', link: '/api/number' },
                { text: 'BuryObject', link: '/api/object' },
              ],
            },
            {
              text: 'Guide',
              items: [
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Callable Getters', link: '/guide/callable-getters' },
                { text: 'Migration from v1', link: '/guide/migration' },
                { text: 'Cookbook', link: '/guide/cookbook' },
              ],
            },
          ],
        },
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ガイド', link: '/ja/guide/getting-started' },
          { text: 'APIリファレンス', link: '/ja/api/' },
          { text: 'クックブック', link: '/ja/guide/cookbook' },
        ],
        sidebar: {
          '/ja/guide/': [
            {
              text: 'ガイド',
              items: [
                { text: 'はじめに', link: '/ja/guide/getting-started' },
                { text: 'Callable Getter 解説', link: '/ja/guide/callable-getters' },
                { text: 'v1 からの移行', link: '/ja/guide/migration' },
                { text: '設計思想とアーキテクチャ', link: '/ja/guide/architecture' },
                { text: 'クックブック・実践例', link: '/ja/guide/cookbook' },
              ],
            },
            {
              text: 'APIリファレンス',
              items: [
                { text: 'API 概要', link: '/ja/api/' },
                { text: 'BuryArray (配列)', link: '/ja/api/array' },
                { text: 'BuryString (文字列)', link: '/ja/api/string' },
                { text: 'BuryNumber (数値)', link: '/ja/api/number' },
                { text: 'BuryObject (オブジェクト)', link: '/ja/api/object' },
              ],
            },
          ],
          '/ja/api/': [
            {
              text: 'APIリファレンス',
              items: [
                { text: 'API 概要', link: '/ja/api/' },
                { text: 'BuryArray (配列)', link: '/ja/api/array' },
                { text: 'BuryString (文字列)', link: '/ja/api/string' },
                { text: 'BuryNumber (数値)', link: '/ja/api/number' },
                { text: 'BuryObject (オブジェクト)', link: '/ja/api/object' },
              ],
            },
            {
              text: 'ガイド',
              items: [
                { text: 'はじめに', link: '/ja/guide/getting-started' },
                { text: 'Callable Getter 解説', link: '/ja/guide/callable-getters' },
                { text: 'v1 からの移行', link: '/ja/guide/migration' },
                { text: 'クックブック', link: '/ja/guide/cookbook' },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mtsgi/bury2' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 mtsgi',
    },
  },
});
