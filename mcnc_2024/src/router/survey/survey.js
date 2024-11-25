/**
 * 설문조사 관련 전용 라우터
 */
const SurveyRoutes = [
    {
        path : "/create-survey",
        name : "create-survey",
        component : () => import("../../components/create-survey/CreateSurvey.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/update-survey",
        name : "update-survey",
        component : () => import("../../components/update-survey/UpdateSurvey.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/survey-participation",
        name: "survey-participation",
        component: () => import("../../components/survey-participation/SurveyParticipation.vue"),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: "/survey-detail", 
        name: "SurveyDetail",
        component: () => import("../../components/survey-detail/SurveyDetail.vue"),
        props: true,
    },
    {
        path: '/survey-completion',  
        name: 'SurveyCompletion',
        component: () => import("../../components/survey-completion/SurveyCompletion.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: '/survey-expired',
        name: 'SurveyExpired',
        component: () => import('@/components/survey-participation/SurveyExpired.vue'),
        meta: { requiresAuth: true },
      },      
    {
        path : "/my-survey",
        name : "MySurvey",
        component : () => import("../../components/my-survey/MySurveyList.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/my-survey/search",
        name: "MySurveySearch",
        component : () => import("../../components/my-survey/MySurveySearch.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/joined-survey",
        name: "JoinedSurvey",
        component : () => import("../../components/joined-survey/JoinedSurveyList.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/joined-survey/search",
        name: "JoinedSurveySearch",
        component : () => import("../../components/joined-survey/JoinedSurveySearch.vue"),
        meta: { requiresAuth: true },
    }
]


export default SurveyRoutes;