/**
 * 설문조사 관련 전용 라우터
 */
const SurveyRoutes = [
    {
        path : "/create",
        name : "Create",
        component : () => import("@/components/create/CreateSurvey.vue"),
        meta: { requiresAuth: true },
    },
    {
        path : "/update/:id",
        name : "Update",
        component : () => import("@/components/update/UpdateSurvey.vue"),
        props : true,
        meta: { requiresAuth: true },
    },
    {
        path : "/my",
        name : "My",
        component : () => import("@/components/my/MySurveyList.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/my/search",
        name: "MySearch",
        component : () => import("@/components/my/MySurveySearch.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/respond",
        name: "Respond",
        component : () => import("@/components/respond/RespondList.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/respond/search",
        name: "RespondSearch",
        component : () => import("@/components/respond/RespondSearch.vue"),
        meta: { requiresAuth: true },
    },
    {
        path: "/result/:id",
        name: "Result",
        component : () => import("@/components/result/SurveyResult.vue"),
        props : true,
        meta: { requiresAuth: true },
    },
    {
        path: "/survey-participation/:id",
        name: "survey-participation",
        component: () => import("@/components/survey-participation/SurveyParticipation.vue"),
        props: true,
        meta: { requiresAuth: true },
      },      
    {
        path: "/survey-participation-detail/:id", 
        name: "SurveyParticipationDetail",
        component: () => import("@/components/respond/SurveyParticipationDetail.vue"),
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/survey-completion',  
        name: 'SurveyCompletion',
        component: () => import("@/components/survey-completion/SurveyCompletion.vue"),
        meta: { requiresAuth: true },
    },
]


export default SurveyRoutes;