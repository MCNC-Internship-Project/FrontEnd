/**
 * v-focus를 사용하기 위한 커스텀 focus 디렉티브
 *
 * @author 반명우
 */

export default {
    mounted(el) {
        el.focus();
    }
}