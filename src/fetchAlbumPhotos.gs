var CLIENT_ID = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXx.apps.googleusercontent.com';
var CLIENT_SECRET = 'XXXXXXXXXXXXXXXXXXx';

/*
 * list albums and get aubumid
 */
function listingAlbums() {
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://photoslibrary.googleapis.com/v1/albums';
    var response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      contentType: "application/json",
      muteHttpExceptions: true
    });
    var result = JSON.parse(response.getContentText());
    var jsondata = JSON.stringify(result, null, 2);
    Logger.log(jsondata);
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}

/*
 * list albums and get aubumid
 */
function getAlbumContents() {
  var service = getService();
  
  //listingAlbumsで取得したalbumidを記入する
  var payload = {
      "pageSize":"100",
      "albumId": "XXXXXXXXXXXXXXXXXXXXXXXXxx"
    };
  
  if (service.hasAccess()) {
    var url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
    var response = UrlFetchApp.fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      },
      contentType: "application/json",
      payload : JSON.stringify(payload),
      muteHttpExceptions: true
    });
    var result = JSON.parse(response.getContentText());
    var num = Math.floor(Math.random() * (100));
    var imageinfo = result["mediaItems"][num];
    var downloadurl = imageinfo['baseUrl']+'=w'+imageinfo['mediaMetadata']['width']+'-h'+imageinfo['mediaMetadata']['height']
    return downloadurl;
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
  }
}

/*
 * Reset the authorization state, so that it can be re-tested.　ログアウト
 */
function reset() {
  getService().reset();
}

/*
 * Configures the service.　認証チェック
 */
function getService() {
  return OAuth2.createService("PhotosAPI")
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/v2/auth')
      .setTokenUrl('https://oauth2.googleapis.com/token')

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to
      // complete the OAuth flow.
  　　 //認証を受けたら受け取る関数を指定する
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      //認証をうけたトークンが保管される場所
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scope and additional Google-specific parameters.
      .setScope('https://www.googleapis.com/auth/photoslibrary.readonly')
        .setParam('access_type', 'offline')/
        .setParam('approval_prompt', 'force')
        .setParam('login_hint', Session.getActiveUser().getEmail());
}

/*
 * Handles the OAuth callback.　認証コールバック
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/**
 * Logs the redict URI to register in the Google Developers Console.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}
