export default {
  app: {
    name: '클린노트'
  },
  intro: {
    slogan: '건물 청소 매출 관리의 정석',
    title: '매출이 한눈에',
    desc: '번거로운 장부 정리 없이<br />오늘 청소와 이번 달 매출을<br />가장 직관적으로 관리하세요.'
  },
  login: {
    kakao: '카카오로 3초만에 시작하기'
  },
  home: {
    greeting: '{name}님, 안녕하세요!',
    earned_amount: '수령액',
    monthly_revenue: '이번 달 매출',
    today_quests: '오늘의 청소',
    other_quests: '그 외 건물',
    no_quests: '오늘 예정된 청소가 없습니다.',
    completed: '완료',
    pending: '대기',
    no_logs_title: '아직 기록이 없어요',
    no_logs_message: '청소 기록을 추가하여 매출을 관리해보세요!',
    no_buildings_title: '건물을 등록해주세요',
    no_buildings_message: '매출 관리를 시작하려면 건물이 필요합니다.',
    add_first_building: '첫 건물 추가하기'
  },
  cleaning: {
    add_record: '청소 기록 추가',
    edit_record: '청소 기록 수정',
    delete_confirm: {
      title: '기록 삭제',
      message: '이 청소 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
    }
  },
  nav: {
    home: '청소 기록',
    buildings: '건물',
    settings: '설정'
  },
  building: {
    manage: '내 건물 관리',
    empty: '아직 등록된 건물이 없습니다.',
    add: '새 건물 추가',
    edit: '건물 수정',
    name: '건물 이름',
    address: '주소 (선택)',
    price: '1회 청소 단가',
    days: '청소 요일',
    memo: '비고',
    placeholder: {
      name: '예: 강남 빌라 101호',
      address: '상세 주소 입력',
      memo: '건물에 대한 참고사항을 입력하세요'
    },
    days_option: {
      0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토'
    },
    delete_confirm: {
      title: '건물 삭제',
      message: '정말 이 건물을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.'
    },
    registration_complete: '건물 등록 완료!',
    check_in_tab_message: '하단 메뉴의 [건물] 탭에서\n등록된 건물을 확인해보세요.',
    go_to_list: '내 건물 보러가기'
  },
  settings: {
    title: '설정',
    profile: '프로필',
    edit_profile: '프로필 수정',
    name: '이름',
    placeholder: {
      name: '이름을 입력하세요'
    },
    language: '언어',
    theme: '테마',
    backup: '데이터 백업 (준비중)',
    terms: '이용약관',
    logout: '로그아웃',
    theme_options: {
      light: '라이트',
      dark: '다크'
    },
    language_options: {
      ko: '한국어',
      en: '영어'
    },
    privacy: '개인정보 처리방침',
    logout_confirm: {
      title: '로그아웃',
      message: '정말 로그아웃 하시겠습니까?',
      confirm: '로그아웃'
    }
  },
  navigation: {
    title: '지도 앱 선택'
  },
  common: {
    save: '저장하기',
    add: '추가하기',
    edit: '수정하기',
    delete: '삭제',
    cancel: '취소',
    confirm: '확인',
    unit_won: '₩',
    toast: {
      saved: '저장되었습니다.',
      added: '추가되었습니다.',
      deleted: '삭제되었습니다.',
      error: '오류가 발생했습니다.'
    },
    date: '날짜',
    time: '시간'
  }
} as const
