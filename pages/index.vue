<template>
    <div class="d-flex flex-column justify-center align-center" style=" height: 100vh; background-color: #f3e8e8;">
        <h1>說明頁面</h1>
        <sakura />
        <ul>
            <li>出現此畫面代表此程式已正常開啟</li>
            <li>觀眾們的頁面只支援手機或平板，電腦進入無法正常體驗</li>
            <li>請提醒觀眾如果為：蘋果手機、平板請點選畫面中的允許方向訪問權限，不然會無法使用</li>
            <li>
                <v-tooltip location="top">
                    <template #activator="{ props }">
                        <span v-bind="props">請提醒觀眾首次開啟網站時需點一下「Visit Site」(滑鼠靠近獲取更詳細說明)</span>
                    </template>
                    <span>
                        這是 Ngrok 的防濫用設計，不過主播可以花錢訂閱 Ngrok ，這樣就能夠可移除這個步驟。<br>或者等我(作者本人)有空升級此軟體後就不會有這問題。
                    </span>
                </v-tooltip>
            </li>
            <li>
                <v-tooltip location="top">
                    <template #activator="{ props }">
                        <span v-bind="props">
                            QR Code 是根據 Ngrok 網址產生的。(滑鼠靠近獲取更詳細說明)
                        </span>
                    </template>
                    <span>如果有觀眾不能掃描的話，歡迎使用我(作者本人)的短網址功能(右方按鈕1)來縮短網址(右方按鈕2)後放在直播間釘選</span>
                </v-tooltip>
                <v-btn @click="copyText('https://shorten.corn323.com')">
                    複製短網址網站連結
                </v-btn>
                &nbsp;
                <v-btn @click="getUrlandCopy()">複製超醜連結</v-btn>
            </li>
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
// @ts-ignore
import Sakura from '~/components/Sakura.vue';
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
async function getUrlandCopy() {
    try {
        const response = await fetch("http://localhost:3001/getUrl");
        const url = await response.text();
        copyText(url);
    } catch (error) {
        console.log(error);
    }
}
</script>
<style scoped>
li {
    height: 7vh;
}
</style>