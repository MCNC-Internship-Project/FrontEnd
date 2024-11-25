export const mockSurveyData = {
    title: '설문조사 제목',
    description: '설문지 설명',
    questions: [
      {
        id: 1,
        title: '질문 1',
        type: 'obj_radio',
        options: [
          { id: 1, label: '옵션 1', value: 'option1' },
          { id: 2, label: '옵션 2', value: 'option2' },
          { id: 3, label: '옵션 3', value: 'option3' },
          { id: 4, label: '옵션 4', value: 'option4' },
        ],
      },
      {
        id: 2,
        title: '질문 2',
        type: 'subj',
        options: [],
      },
      {
        id: 3,
        title: '질문 3',
        type: 'obj_check',
        options: [
          { id: 1, label: '옵션1', value: 'option_1' },
          { id: 2, label: '옵션2', value: 'option_2' },
          { id: 3, label: '옵션3', value: 'option_3' },
          { id: 4, label: '옵션4', value: 'option_4' },
        ],
      },
    ],
  };
  
  export const mockEndDate = '2024-11-27';
  