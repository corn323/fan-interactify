<template>
    <div>
        <h1>說明頁面</h1>
        <ul>
            <li>出現此畫面代表此程式已正常開啟</li>
            <li>觀眾們的頁面只支援手機或平板，電腦進入無法正常體驗</li>
            <li>請提醒觀眾如果為：蘋果手機、平板請點選畫面中的允許方向訪問權限，不然會無法使用</li>
            <li>QRcode為Ngrok所產生的網址，請放心使用</li>
            <li>若OBS無畫面請重新擷取</li>
            <li>OBS擷取此工具時，請選擇瀏覽器，並填入以下參數</li>
            <li>網址：http://localhost:3001/interactionPage <v-btn
                    @click="copyText('http://localhost:3001/interactionPage')">點我複製此連結</v-btn></li>
            <li>預設寬度：1920</li>
            <li>預設高度：1000</li>
            <li>自訂CSS：無須調整，使用OBS預設即可 <v-btn
                    @click="copyText(`body { background-color: rgba(0, 0, 0, 0); margin: 0px auto; overflow: hidden; }`)">若無預設值，點我複製</v-btn>
            </li>
        </ul>
    </div>
</template>

<script setup>

function copyText(text) {
    if (navigator.clipboard) {
        copyText = (text) => {
            navigator.clipboard.writeText(text);
        }
    } else {
        copyText = (text) => {
            const input = document.createElement('input');
            input.setAttribute('value', text);
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        }
    }
    copyText(text);
};

</script>
<style scoped>
li {
    height: 7vh;
}
</style>