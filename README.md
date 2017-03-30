# jQuery BurstWarning Plugin
ダライアスバースト風のWARNING画面を表示するjQueryプラグインです。  
文字をそれっぽくアニメーションさせて、音を鳴らすことができます。  
お手持ちのウェブサイトでボス戦艦を登場させる際などに使うと非常に効果的です。  
当然ながら公式とは一切関係ありませんので、ご注意ください。

## デモ
実際に使用してみたデモとしてWARNING画面のジェネレータを作成してみました。  
http://uncop4500.github.io/jQuery.BurstWarning/sample.html  
スマホでの動作が微妙な感じですがご了承ください。

## 使い方
1: HTML内で、jQueryとjquery.burstWarning.jsとjquery.burstWarning.cssを読み込みます。  
```
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="jquery.burstWarning.js"></script>
<link rel="stylesheet" type="text/css" href="jquery.burstWarning.css" />
```
2: JavaScript内で、$.burstWarning()を実行します。
```
$.burstWarning(
  "WARNING!!",
  "A HUGE BATTLE SHIP",
  "UNAGI FOSSIL",
  "IS APPROACHING FAST",
  {
    mode: "CS",
    sound: "warning.mp3",
    callback: function () { alert("わーにん完了");}
  }
);
```
3: ページ全体にWARNINGが表示されます。


## パラメータ説明：$.burstWarning(caption, message1, message2, message3[, options])
### caption（必須）
見出しの文字列です。（例：`"WARNING!!"`）

### message1（必須）
メッセージ1行目の文字列です。（例：`"A HUGE BATTLE SHIP"`）

### message2（必須）
メッセージ2行目の文字列です。（例：`"UNAGI FOSSIL"`）

### message3（必須）
メッセージ3行目の文字列です。（例：`"IS APPROACHING FAST"`）

### options（任意）
オプション設定項目のオブジェクトです。  
必要な項目のみ設定してください。

#### mode
演出パターンを指定します。
'"AC"'だとACモード、'"CS"'だとCSモードの演出になります。
指定しない場合はACモードになります。（例：`"CS"`）

#### sound
WARNING表示時に再生するサウンドファイルのパスを指定します。（例：`"warning.mp3"`）

#### callback
WARNING表示完了後に呼び出すコールバック関数を指定します。（例：`function () { alert("わーにん完了");}`）

## ライセンス
MIT Licenseで配布します。

## その他
気になる点などあるかと思いますが、適当に直しながら使ってもらえればと思います。  
何かありましたら[Twitter:@uncop4500](https://twitter.com/uncop4500)までご連絡ください。
