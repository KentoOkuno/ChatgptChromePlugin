const lastSentence = '\n"""';

/** ショートカットキーから呼ばれる処理 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case "addTemplateToClipBoardForErrorLog":
      addTemplateToClipBoardForErrorLog();
      break;
    case "addTemplateToClipBoardForCodeAnalysis":
      addTemplateToClipBoardForCodeAnalysis();
      break;
    case "addTemplateToClipBoardForTextSummary":
      addTemplateToClipBoardForTextSummary();
      break;
    case "addTemplateForName":
      addTemplateForName();
      break;
  }
});

/** 名前案テンプレート */
function addTemplateForName() {
  const orderText = '### 指示\n あなたはJavaエンジニアです。以下情報から命名とその理由を5つ記載してください。キャメルケースでかつ日本人がわかりやすい名前でお願いします。\n###\n'
                  + 'text: """\n'
                  + '命名対象: 変数名  / メソッド名 / クラス名'
                  + '\nどういう役割か / どういう処理か: ';
  addTemplate(orderText);
}
/** テキスト要約テンプレート */
function addTemplateToClipBoardForTextSummary() {
  const orderText = '### 指示\n 以下のテキストを要約し、最も重要なポイントを箇条書きにまとめてください。\n###\ntext: """\n';
  addTemplateToClipBoard(orderText);
}
/** ソースの意味テンプレート */
function addTemplateToClipBoardForCodeAnalysis() {
  const orderText = '### 指示\n あなたはWebエンジニアです。下記のコードで行っている処理内容を教えてください。処理の要約とそれぞれの処理内容をコードにコメントで記述してください。\n###\ntext: """\n';
  addTemplateToClipBoard(orderText);
}
/** エラーログ検索テンプレート */
function addTemplateToClipBoardForErrorLog() {
  const orderText = '### 指示\n あなたはWebエンジニアです。下記のエラーログから原因を特定してください。日本語で回答してください。\n###\ntext: """\n';
  // 背景色変更
//  document.body.style.backgroundColor = document.body.style.backgroundColor === 'pink' ? '' : 'pink';
  addTemplateToClipBoard(orderText);
}

/** テンプレートを追加する */
function addTemplate(orderText) {
  var textField = document.getElementById('prompt-textarea');
  if (!textField) return;

  // テンプレート入力
  textField.value = orderText;
  textField.focus();
  textField.setSelectionRange(textField.value.length + 1, textField.value.length + 1);
  // テキストエリアの幅調整
  //// 20文字で1行として行数をカウントする
  const rowNum = textField.value.length / 20;
  textField.style.maxHeight = '2000px';
  textField.style.height = rowNum * 10 + 'px';

  textField.value += lastSentence;
}

/** クリップボードの文言を貼り付けてテンプレートを追加する */
function addTemplateToClipBoard(orderText) {
  var textField = document.getElementById('prompt-textarea');
  if (!textField) return;

  // テンプレート入力
  textField.value = orderText;
  textField.focus();

  // クリップボードの貼り付け
  navigator.clipboard.readText()
      .then(text => {
        // テキスト追加
        textField.value += text;
        // テキストエリアの幅調整
        //// 20文字で1行として行数をカウントする
        const rowNum = textField.value.length / 20;
        textField.style.maxHeight = '2000px';
        textField.style.height = rowNum * 10 + 'px';
          // 送信クリック
          const button = document.querySelector('[data-testid="send-button"]');
          if (button && button.click) {
            if (button.style) button.style.disable = '';
            if (button.disabled) button.disabled = false;
            // TODO 自動で送信がうまくいかない
            button.click();
          } else {
            console.log('buttonなしエラー', button);
            // カーソル位置を設定
            textField.setSelectionRange(textField.value.length + 1, textField.value.length + 1);
          }
      })
      .catch(err => {
        // クリップボード貼り付け失敗などの場合はカーソル位置だけ一番後ろに
        console.error('予期せぬエラー', err);
        textField.setSelectionRange(textField.value.length + 1, textField.value.length + 1);
      })
      .finally(() => {
        textField.value += lastSentence;
      });
}
