export const mockUserSurveyData = {
    id: 1,
    title: "사용자 만족도 조사",
    description: "서비스에 대한 만족도를 조사하기 위한 설문입니다.",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    questions: [
      {
        id: 1,
        title: "서비스에 얼마나 만족하시나요?",
        type: "obj_radio",
        options: ["매우 만족", "만족", "보통", "불만족", "매우 불만족"],
      },
      {
        id: 2,
        title: "서비스 개선을 위해 추가 의견을 남겨주세요.",
        type: "subj",
      },
      {
        id: 3,
        title: "서비스에서 가장 만족한 부분을 선택해주세요.",
        type: "obj_check",
        options: ["디자인", "사용성", "기능", "고객 지원"],
      },
    ],
    responses: {
      1: "매우 만족", // 첫 번째 질문 응답
      2: "더 많은 기능이 있었으면 좋겠어요.", // 두 번째 질문 응답
      3: ["디자인", "기능"], // 세 번째 질문 응답
    },
  };
  