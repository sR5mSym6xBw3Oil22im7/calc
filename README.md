# NEON BURST CALCULATOR

NEON BURST CALCULATOR は、ネオン調のUIと花火・コンフェッティ演出、日本語音声入力を備えた静的Web電卓です。HTML / CSS / JavaScriptだけで構成され、ビルド処理やアプリ独自のバックエンドは不要です。

## 主な機能

- 四則演算（加算・減算・乗算・除算）
- 小数入力、パーセント、AC、DEL
- 画面ボタンとキーボードの両操作
- Google Chromeでの日本語音声入力
- 音声認識状態の表示（READY / LISTENING / LOCKED / ERROR など）
- `=` 実行時の花火5発・コンフェッティ演出
- 10種類のランダムテーマ
- 画面幅540px以下を考慮したレスポンシブ表示
- `prefers-reduced-motion` への対応

## 対応環境

正式対応ブラウザは、以下です。

- Google Chrome for Windows 11
- Google Chrome for Linux

音声入力は Web Speech API（`SpeechRecognition` / `webkitSpeechRecognition`）を利用します。Chrome以外のブラウザは正式な動作対象外で、実装上は音声入力パネルを非表示にします。

## ファイル構成

```text
calc-main/
├─ index.html              # 電卓画面
├─ style.css               # UI、テーマ、アニメーション、レスポンシブ
├─ script.js               # 計算、音声入力、キーボード操作、花火演出
├─ README.md               # 本ファイル
└─ doc/
   ├─ index.html           # 開発ドキュメント目次
   ├─ 01_project_overview.html
   ├─ 02_requirements_definition.html
   ├─ 03_calculator_voice_specification.html
   ├─ 04_basic_design.html
   ├─ 05_screen_ui_design.html
   ├─ 06_detailed_design.html
   ├─ 07_coding_and_development_guide.html
   ├─ 08_test_plan_and_specification.html
   ├─ 09_release_guide_and_notes.html
   ├─ 10_user_and_operations_manual.html
   └─ css/style.css
```

## 起動方法

### 通常表示

`index.html` をGoogle Chromeで開くと利用できます。

### ローカルWebサーバーで起動

音声入力を含めて確認する場合は、localhost上での起動を推奨します。

```bash
cd calc-main
python -m http.server 8000
```

その後、Google Chromeで `http://localhost:8000/` を開きます。

## 画面操作

| 操作 | 内容 |
|---|---|
| `0` ～ `9` | 数値入力 |
| `+` / `−` / `×` / `÷` | 四則演算 |
| `.` | 小数点 |
| `%` | 現在値を100で割る |
| `DEL` | 末尾1文字を削除 |
| `AC` | 入力状態を初期化し、テーマを切り替える |
| `=` | 計算を実行し、花火・コンフェッティを再生 |

数字は最大14桁まで入力できます。0除算時は `Error` を表示し、「0では割れません」と通知します。

## キーボード操作

| キー | 操作 |
|---|---|
| `0` ～ `9` | 数値入力 |
| `+` `-` `*` `/` | 四則演算 |
| `.` または `,` | 小数点 |
| `%` | パーセント |
| `Enter` または `=` | 計算実行 |
| `Esc` | AC |
| `Backspace` | DEL |

## 音声入力

1. Google Chromeでページを開きます。
2. 「音声入力」ボタンを押します。
3. 初回はブラウザのマイク使用を許可します。
4. 状態が `LISTENING` になったら話します。

### 発話例

- 「12たす3イコール」
- 「10かける5イコール」
- 「20ひく8イコール」
- 「9わる3イコール」
- 「たす5イコール」
- 「クリア」
- 「削除」
- 「パーセント」

### 対応する主な言葉

| 種類 | 対応例 |
|---|---|
| 加算 | プラス、足す、たす |
| 減算 | マイナス、引く、ひく |
| 乗算 | かける、掛ける、乗算 |
| 除算 | わる、割る、除算 |
| 実行 | イコール、計算して、計算、結果 |
| 初期化 | AC、オールクリア、クリア、リセット |
| 削除 | DEL、一文字削除、削除 |
| 小数 | 「てん」「点」「ドット」 |

音声で実行語（「イコール」など）を認識すると、花火演出が終了するまで `LOCKED` となり、画面ボタンとキーボード入力を受け付けません。演出終了後、音声入力を停止していなければ `LISTENING` に戻ります。

音声入力でエラーが発生した場合は計算画面を初期化し、「音声入力でエラーが発生しました」と3秒間表示します。

## 音声入力の利用条件

- ブラウザのマイク使用許可が必要です。
- 公開環境ではHTTPSを使用してください。
- ローカル開発ではChromeが許可するlocalhost環境を利用してください。
- Web Speech APIの利用可否、認識精度、通信要件はGoogle Chrome側の実装や環境に依存します。
- アプリは音声や認識結果を独自に保存しません。

## 外部リソース

画面フォントとしてGoogle Fontsの `Orbitron` と `Noto Sans JP` を読み込みます。取得できない場合は、ブラウザの代替フォントで表示されます。

## 開発ドキュメント

`doc/index.html` を開くと、以下の工程別HTML文書を参照できます。

1. プロジェクト概要書
2. 要件定義書
3. 計算・音声入力仕様書
4. 基本設計書
5. 画面・UI設計書
6. 詳細設計書
7. コーディング規約・開発手順書
8. テスト計画・テスト仕様書
9. リリース手順書・リリースノート
10. 操作マニュアル・運用保守手順書

## データ保存とプライバシー

このアプリは、計算履歴、設定、認識結果をLocalStorage、Cookie、IndexedDB等へ永続保存しません。マイク音声と音声認識の処理はブラウザ提供機能に依存します。

## 補足

本プロジェクトは静的Webアプリです。サーバーサイド処理、データベース、APIキーは使用しません。
