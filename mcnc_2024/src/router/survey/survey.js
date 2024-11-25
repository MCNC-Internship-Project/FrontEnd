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
        path: "/survey-detail", 
        name: "SurveyDetail",
        component: () => import("../../components/survey-detail/SurveyDetail.vue"),
        props: true,
    },
    {
        path: '/survey-completion',  
        name: 'SurveyCompletion',
        component: () => import("../../components/survey-completion/SurveyCompletion.vue")
        
    },
    {
        path: '/survey-expired',
        name: 'SurveyExpired',
        component: () => import('@/components/survey-participation/SurveyExpired.vue')
      },      
    {
        path : "/my-survey",
        name : "MySurvey",
        component : () => import("../../components/my-survey/MySurveyList.vue")
    },
    {
        path: "/my-survey/search",
        name: "MySurveySearch",
        component : () => import("../../components/my-survey/MySurveySearch.vue")
    },
    {
        path: "/joined-survey",
        name: "JoinedSurvey",
        component : () => import("../../components/joined-survey/JoinedSurveyList.vue")
    },
    {
        path: "/joined-survey/search",
        name: "JoinedSurveySearch",
        component : () => import("../../components/joined-survey/JoinedSurveySearch.vue")
    }
]


export default SurveyRoutes;