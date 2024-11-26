export const surveyData = {
  surveyId: 46,
  title: '이건희의 데모 설문',
  description: '매일 연차쓰고 싶다',
  createDate: '2024-11-26T13:22:21',
  expireDate: '2024-12-20T21:00:00',
  creatorId: 'ghlee000125',
  questionList: [
    {
      quesId: 84,
      body: '집에 얼마나 가고 싶나요?',
      questionType: 'OBJ_MULTI',
      selectionList: [
        { selectionId: { quesId: 84, sequence: 0 }, body: '진짜 가고 싶음', isEtc: false },
        { selectionId: { quesId: 84, sequence: 1 }, body: '정말 가고 싶음요', isEtc: false },
        { selectionId: { quesId: 84, sequence: 2 }, body: '매우 가고 싶음', isEtc: false },
        { selectionId: { quesId: 84, sequence: 3 }, body: '찐으로 가고 싶음', isEtc: false },
        { selectionId: { quesId: 84, sequence: 4 }, body: '미치도록 가고 싶음', isEtc: false },
      ],
    },
    {
      quesId: 85,
      body: '이건희의 집은 과연 어디일까요?',
      questionType: 'OBJ_SINGLE',
      selectionList: [
        { selectionId: { quesId: 85, sequence: 0 }, body: '홈플러스 익스프레스 앞', isEtc: false },
        { selectionId: { quesId: 85, sequence: 1 }, body: '학동역 앞', isEtc: false },
        { selectionId: { quesId: 85, sequence: 2 }, body: '모빌씨앤씨 지하2층', isEtc: false },
        { selectionId: { quesId: 85, sequence: 3 }, body: '율암빌딩 7층', isEtc: false },
        { selectionId: { quesId: 85, sequence: 4 }, body: '자유롭게 맞춰보세요', isEtc: true },
      ],
    },
    { quesId: 86, body: '집에 가고 싶은 만큼 소리 질러 ~~', questionType: 'SUBJECTIVE', selectionList: [] },
    { quesId: 87, body: '자유롭게 집 가고 싶은 마음을 표현하세요', questionType: 'SUBJECTIVE', selectionList: [] },
  ],
};