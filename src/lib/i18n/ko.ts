export default {
  app: {
    name: '클린퀘스트'
  },
  intro: {
    slogan: '계단 청소 수익 관리의 정석',
    title: '수익이 한눈에',
    desc: '복잡한 장부 정리 없이<br />오늘 청소와 이번 달 수익을<br />가장 직관적으로 관리하세요.'
  },
  login: {
    kakao: '카카오로 3초만에 시작하기'
  },
  home: {
    greeting: '{name}님, 안녕하세요!',
    revenue: '이번 달 수익',
    today_quests: '오늘의 청소',
    other_quests: '그 외 건물',
    no_quests: '오늘 예정된 청소가 없습니다.',
    completed: '완료',
    pending: '대기'
  },
  cleaning: {
    add_record: '청소 기록 추가'
  },
  nav: {
    home: '홈',
    buildings: '건물',
    settings: '설정'
  },
  building: {
    manage: '내 건물 관리',
    total: '총 {count}개 건물을 관리하고 있어요.',
    add: '새 건물 추가',
    edit: '건물 수정',
    name: '건물 이름',
    address: '주소 (선택)',
    price: '1회 청소 단가',
    days: '청소 요일',
    placeholder: {
        name: '예: 강남 빌라 101호',
        address: '상세 주소 입력'
    },
    days_option: {
        0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토'
    },
    confirm_delete: {
        title: '건물 삭제',
        message: '정말 이 건물을 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.'
    }
  },
  settings: {
    title: '설정',
    profile: '프로필',
    language: '언어',
    theme: '테마',
    backup: '데이터 백업 / 내보내기',
    terms: '이용약관',
    logout: '로그아웃',
    theme_options: {
        light: '라이트 모드',
        dark: '다크 모드'
    },
    language_options: {
        ko: '한국어',
        en: 'English'
    }
  },
  common: {
    save: '저장하기',
    add: '추가하기',
    edit: '수정하기',
    delete: '삭제',
    cancel: '취소',
    confirm: '확인',
    unit_won: '원',
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
