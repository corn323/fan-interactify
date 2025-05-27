# Fan-Interactify (粉絲直播歌回互動工具)
 ## 專案介紹
 FanInteractify 是一款用於直播互動的應援工具，讓觀眾們可以透過掃描QRcode來與直播主互動。
 此工具讓直播主能夠輕鬆地在直播中添加觀眾應援道具，並且無需額外的網路設置。
 觀眾們掃描完QRcode後，將會在直播畫面上(非工具介紹頁面)顯示一個應援道具，並且這些道具會根據觀眾手機的搖晃即時更新狀態。
 
 ## 使用流程
 - 打開本工具後，需輸入Ngrok的Token(獲取方法請見說明頁面or私訊DCor寄信向我詢問)
 - 成功啟用本工具後根據說明頁面中的描述，擷取所需畫面將QRcode顯示給觀眾
 - 觀眾們掃描QRcode後，手機就可以與主播的工具直接建立連線。
 - 根據觀眾們的手機搖晃程度，將會即時反饋狀態給本工具的應援道具。

 ## 主要功能
 - QR碼生成：生成QRcode，供觀眾掃描。
 - 應援道具互動：應援道具會根據觀眾們手機的搖晃的程度來即時更新狀態。
 - 端對端連線：主播與觀眾們之間的互動透過端對端連線實現，無需任何他方伺服器。
 - 上傳圖片(目前無此功能，以後會更新)：主播可自定義應援道具的圖片。
  
  ## 技術棧
 - Electron：用於構建桌面應用。
 - Nuxt.js：用於構建前端應用。
 - TypeScript：提供靜態類型檢查，提升開發體驗。
 - Vuetify：提供現代化的 UI 組件。
 - Express：伺服器架設(API接收與網頁架設)
 - Ngrok：獲取免費公開網址
 
 ## 關於Ngrok
 - 此工具可讓使用者實現內網穿透，目的是方便使用者在網路複雜等狀況下簡單且快速的取得公開網址
 - 本軟體的使用上限與Ngrok的時間有關係，如果您是Ngrok的高級用戶亦可以使用的高級功能，且軟體維持的時間比較長，網址也可以比較好看

 ## 自行編譯與運行
 1. 安裝依賴
 在專案根目錄下，運行以下命令來安裝所需的依賴：
 ```
 npm install
 ```
 1. 使用mklink /j 的方式將liveStickInteractionPage與專案目錄底下的interactionPage/.output/public綁定
 2. 使用以下命令來初始化userData資料
 ```prisma migrate dev --name userData.db init```  
 1. 運行開發環境
 運行來啟動開發模式，並在瀏覽器中預覽專案：
 ``` npm run dev ```
 1. 專案打包
 完成開發後，運行以下命令來打包專案，生成可部署的生產版本：
 ``` npm run build ```

 ## 聯繫方式
 如有任何問題或建議，請聯繫我：
 - Email: contact@corn323.com
 - Discord: corn323

 ## 協助者
 - [R靈](https://github.com/necro-wbj)：打包等技術支援
 - [嗡嗡](http://github.com/tony2265)：fanInteraction頁面設計與製作支援
 - 夜緋羽：螢光棒美術與測試支援
 - CClemon：測試支援
 - [夜花櫻](https://github.com/tinyYana)：測試支援
 #### 感謝您使用　FanInteractify，讓我們一起為直播帶來更多互動與樂趣！
