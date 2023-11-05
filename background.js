chrome.commands.onCommand.addListener((command) => {
  if (command === "addTemplateForErrorLog") {
    // アクティブなタブを取得する
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      var activeTabUrl = activeTab.url;

      // 特定のURLかどうかをチェックする
      console.log("url:", activeTabUrl);
      if (activeTabUrl && activeTabUrl.startsWith("https://chat.openai.com/")) {
        // コマンドを実行する
        // 例えば、content scriptにメッセージを送信する
        chrome.tabs.sendMessage(activeTab.id, { action: "addTemplateForErrorLog" });
      } else {
        console.log("このコマンドはchatGPTでのみ動作します。");
      }
    });
  }
});
