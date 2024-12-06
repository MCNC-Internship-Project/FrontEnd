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
        path: "/survey-participation/:id", // surveyId를 URL 파라미터로 추가
        name: "survey-participation",
        component: () => import("../../components/survey-participation/SurveyParticipation.vue"),
        props: true,  // URL 파라미터를 props로 전달
        meta: { requiresAuth: true },
      },      
    {
        path: "/survey-participation-detail/:id", 
        name: "SurveyParticipationDetail",
        component: () => import("../../components/joined-survey/SurveyParticipationDetail.vue"),
        props: true,
        meta: { requiresAuth: true }, // 필요하다면 인증 required 추가
    },
    {
        path: '/survey-completion',  
        name: 'SurveyCompletion',
        component: () => import("../../components/survey-completion/SurveyCompletion.vue"),
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
    },
    {
        path: "/survey-result/:id",
        name: "SurveyResult",
        component : () => import("../../components/survey-detail/SurveyResult.vue"),
        props : true,
        meta: { requiresAuth: true },
    },
    {
        path : "/survey-result/:id/update-survey",
        name : "update-survey",
        component : () => import("../../components/update-survey/UpdateSurvey.vue"),
        props : true,
        meta: { requiresAuth: true },
    },
]


export default SurveyRoutes;