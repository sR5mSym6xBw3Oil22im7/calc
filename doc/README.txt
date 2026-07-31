NEON BURST CALCULATOR 開発ドキュメント

1. 目的
要件定義、設計、実装、テスト、リリース、運用保守を追跡可能な静的ドキュメントサイトとして提供する。

2. フォルダ構成
calc-main-documents/
  index.html
  css/style.css
  css/print.css
  js/document.js
  documents/01_プロジェクト概要書.html ～ 10_運用保守手順書.html
  README.txt

3. 閲覧方法
index.htmlをGoogle Chrome等のモダンブラウザで開く。ローカルWebサーバーを使用する場合は、このフォルダで「python -m http.server 8000」を実行し、http://localhost:8000/ を開く。

4. JavaScriptが無効な場合
本文、ページ内目次およびリンクは閲覧できるが、モバイルメニュー、印刷ボタン、上部へ戻るボタンは利用できない。

5. 外部リソース
ドキュメントサイト自体は外部CSS・JavaScript・フォントを使用しない。電卓本体はGoogle FontsのOrbitronとNoto Sans JPを使用する。

6. 表示方式
表示はライトモード固定であり、ダークモード機能、テーマ切り替え、localStorageによるテーマ保存は提供しない。

7. 更新方法
実装変更時は要件ID、設計ID、関数・要素、テストID、結果の対応を同時に更新する。すべてのHTML、CSS、JavaScriptおよびファイル名はUTF-8で管理する。

8. 確定情報
開発担当者：テスト開発者
文書作成者：テスト文章作成者
承認者：テスト承認者
利用組織：テスト利用組織
本番環境：GitHub Pages
公開先URL：https://sr5msym6xbw3oil22im7.github.io/calc/
リリース日時：2026年7月17日
保守担当者：テスト保守担当者
対応期限：随時対応
リポジトリ：calc
公開元：mainブランチ、ルート（/）
デプロイ方法：mainブランチへのpushで公開
GitHubアカウント名：テストGitHubアカウント
テスト実施者：テスト実施者
テスト実施日：2026年7月16日
テスト対象バージョン：1.0
リリース判定：リリース可

9. ZIPファイル名
calc-main-documents-Rev02.zip

10. ZIP内ファイル名の文字コード
日本語ファイル名はUTF-8で格納し、ZIPのUTF-8言語エンコーディングフラグ（EFS）を設定する。LinuxおよびWindows 11標準の展開機能で日本語ファイル名を扱える形式である。
