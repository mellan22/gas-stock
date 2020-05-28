var ACCESS_TOKEN = 'XXXXXXXXXXXXXXXXXXXXXXXXXXxx';
var url = 'https://api.line.me/v2/bot/message/reply'; // 応答メッセージ用のAPI URL
 
/**
 * doPost
 * ユーザーがLINEにメッセージ送信した時の処理
 **/
function doPost(e) {
  
    // ユーザーのメッセージを取得
    var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  　// WebHookで受信した応答用Token
    var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
    
    //userMessageの内容に応じて応答　＊＊＊＊＊にマッチさせたい正規表現を入れる
    if (userMessage.match(/＊＊＊＊＊＊＊＊＊/) != null){
    
    //fetchAlbumPhotosから写真のダウンロードURLを取得
    var pic = getAlbumContent();
    
    UrlFetchApp.fetch(url, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: 'Bearer ' + ACCESS_TOKEN
        },
        method: 'post',
        payload: JSON.stringify({
        replyToken: replyToken,
        messages: [
            {
               type: 'image',
               originalContentUrl: pic,
               previewImageUrl: pic,     
            }
          ]
        })
     });
     return ContentService.createTextOutput(JSON.stringify({ content: 'post ok' })).setMimeType(ContentService.MimeType.JSON);
   }
};
