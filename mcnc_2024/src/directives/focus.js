/**
 * @fileoverview focus 디렉티브
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-12-03
 * @lastModified 2024-12-03
 * @description v-focus를 사용하기 위한 커스텀 focus 디렉티브
 */


export default {
    mounted(el) {
        el.focus();
    }
}