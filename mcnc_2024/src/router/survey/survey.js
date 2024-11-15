/**
 * 설문조사 관련 전용 라우터
 */
const SurveyRoutes = [
    {
        path : "/create-survey",
        name : "create-survey",
        component : () => import("../../components/create-survey/CreateSurvey.vue")
    },
    {
        path : "/my-survey",
        name : "my-survey",
        component : () => import("../../components/my-survey/MySurveyList.vue")
    },
    {
        path: "/my-survey-search",
        name: "my-survey-search",
        component : () => import("../../components/my-survey/MySurveySearch.vue")
    }
]


export default SurveyRoutes;