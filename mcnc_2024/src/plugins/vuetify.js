/**
 * @fileoverview Vuetify 설정 파일
 * @author 김원재 (kimwonjae@mcnc.co.kr)
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-11-06
 * @lastModified 2024-11-13
 * @description Vuetify 설정 (언어, 컴포넌트 등)
 */


import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VTimePicker } from 'vuetify/labs/VTimePicker'


export default createVuetify({
  components : {
    ...components,
    VTimePicker,
  },
  directives,
  locale: {
    locale: 'ko',
    fallback: 'en'
  },
})