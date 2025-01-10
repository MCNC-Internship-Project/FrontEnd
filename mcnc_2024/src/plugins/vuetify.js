/**
 * vuetify 설정
 *
 * @author 반명우
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