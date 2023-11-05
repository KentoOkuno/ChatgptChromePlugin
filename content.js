chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "addTemplateForErrorLog") {
    // 特定の機能をトグルする関数を呼び出す
    addTemplate();
  }
});
function addTemplate() {
  // 背景色変更
  document.body.style.backgroundColor = document.body.style.backgroundColor === 'pink' ? '' : 'pink';
  var textField = document.getElementById('prompt-textarea');

  // テンプレート入力
  const template = 'あなたはWebエンジニアです。下記のエラーログから原因を特定してください。日本語で回答してください。\n';
  textField.value = template;
  textField.focus();

  // クリップボードの貼り付け
  navigator.clipboard.readText()
      .then(text => {
        // テキスト追加
        textField.value += text;
        // style="max-height: 200px; height: 176px; overflow-y: hidden;"
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
          console.log('buttonなしエラー', button)
            // カーソル位置を設定
            textField.setSelectionRange(textField.value.length + 1, template.length.length + 1);
          }
      })
      .catch(err => {
        console.error('予期せぬエラー', err);
        // カーソル位置を設定
        textField.setSelectionRange(textField.value.length + 1, template.length.length + 1);
      });

}
