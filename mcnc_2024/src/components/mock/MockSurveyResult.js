export const MockSurveyResult = {
  surveyId: 1,
  title: "고객 만족도 조사",
  description: "고객의 만족도를 측정하기 위한 설문조사입니다.",
  createDate: "2024-11-27T05:14:21.743Z",
  expireDate: "2024-12-01T05:14:21.744Z",
  creatorId: "creator123",
  responseCount: 270,
  genderCountList: [
    {
      gender: "MALE",
      count: 120
    },
    {
      gender: "FEMALE",
      count: 150
    }
  ],
  ageCountList: [
    {
      age: "20대",
      count: 80
    },
    {
      age: "30대",
      count: 110
    },
    {
      age: "40대",
      count: 80
    }
  ],
  questionList: [
    {
      quesId: 1,
      body: "서비스에 얼마나 만족하시나요?",
      questionType: "OBJ_SINGLE",
      selectionList: [
        {
          sequence: 1,
          body: "매우 만족",
          responseCount: 100,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 2,
          body: "만족",
          responseCount: 80,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 3,
          body: "보통",
          responseCount: 60,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 2,
          body: "만족",
          responseCount: 80,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 3,
          body: "보통",
          responseCount: 60,
          etcAnswer: [],
          etc: false
        }
      ],
      subjAnswerList: []
    },
    {
      quesId: 2,
      body: "서비스 개선을 위해 필요한 점은 무엇인가요?",
      questionType: "SUBJECTIVE",
      selectionList: [],
      subjAnswerList: [
        "고객센터 운영시간 연장",
        "더 다양한 결제 옵션 제공"
      ]
    },
    {
      quesId: 3,
      body: "가장 선호하는 서비스 기능을 선택하세요. (중복 가능)",
      questionType: "OBJ_MULTI",
      selectionList: [
        {
          sequence: 1,
          body: "빠른 처리 속도",
          responseCount: 12,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 2,
          body: "친절한 직원",
          responseCount: 17,
          etcAnswer: [],
          etc: false
        },
        {
          sequence: 3,
          body: "편리한 사용자 인터페이스",
          responseCount: 0,
          etcAnswer: [],
          etc: false
        }
      ],
      subjAnswerList: []
    }
  ],
  expireDateValid: true
}

  