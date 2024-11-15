/**
 * 설문조사 관련 전용 라우터
 */
const SurveyRoutes = [
    {
        path : "/create-survey",
        name : "create-survey",
        component : () => import("../../components/create-survey/CreateSurvey.vue"),
    },
    {
        path: "/survey-participation",
        name: "survey-participation",
        component: () => import("../../components/survey-participation/SurveyParticipation.vue"),
        props: true,
    },
    {
        path: '/survey-completion',  // 참여 완료 페이지 경로
        name: 'SurveyCompletion',
        component: () => import("../../components/survey-completion/SurveyCompletion.vue")
        
    },
    {
        path: '/survey-expired',
        name: 'SurveyExpired',
        component: () => import('@/components/survey-participation/SurveyExpired.vue')
      },      
]

export default SurveyRoutes;