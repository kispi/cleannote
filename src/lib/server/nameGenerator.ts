export const adjectives = [
  '행복한', '즐거운', '멋진', '신나는', '따뜻한', '상쾌한', '부지런한', '깔끔한', '성실한', '유쾌한',
  '용감한', '지혜로운', '친절한', '활기찬', '포근한', '든든한', '말끔한', '반짝이는', '싱그러운', '건강한'
];

export const nouns = [
  '사장님', '매니저', '청소왕', '클리너', '파트너', '해결사', '대장님', '마스터', '지킴이', '도우미',
  '이웃', '전문가', '프로', '리더', '친구', '동료', '일꾼', '달인', '선수', '히어로'
];

export const generateRandomName = () => {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  // Format: 행복한사장님12
  return `${adj}${noun}${num}`;
};
