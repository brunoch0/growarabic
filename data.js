// 아랍어 기초 학습 데이터
// 매주 새 수업 자료가 오면 이 파일 맨 아래 배열에 항목을 append 한다.
// gender: 'm' | 'f' | null(성별 퀴즈 제외: 대명사/전치사/지명 등)
// fem/femRoman: 형용사 남/여 쌍이 있을 때 여성형

const VOCAB = [
  // ── 1. 기본 명사 (문법1 / 7월 수업)
  { id: "rajul", ar: "رَجُلٌ", roman: "rajulun", ko: "남자", en: "man", pos: "명사", gender: "m", cat: "사람", date: "2026-07-03" },
  { id: "bayt", ar: "بَيْتٌ", roman: "baytun", ko: "집", en: "house", pos: "명사", gender: "m", cat: "장소", date: "2026-07-03" },
  { id: "baab", ar: "بَابٌ", roman: "baabun", ko: "문", en: "door", pos: "명사", gender: "m", cat: "사물", date: "2026-07-03" },
  { id: "kitaab", ar: "كِتَابٌ", roman: "kitaabun", ko: "책", en: "book", pos: "명사", gender: "m", cat: "사물", date: "2026-07-03" },
  { id: "taalib", ar: "طَالِبٌ", roman: "taalibun", ko: "남학생", en: "male student", pos: "명사", gender: "m", cat: "사람", ex: "أَنَا طَالِبٌ", date: "2026-07-03" },
  { id: "taaliba", ar: "طَالِبَةٌ", roman: "taalibatun", ko: "여학생", en: "female student", pos: "명사", gender: "f", note: "타마르부타 ة 로 끝나는 여성명사", ex: "أَنَا طَالِبَةٌ", date: "2026-07-03" },
  { id: "ustaadh", ar: "أُسْتَاذٌ", roman: "ustaadhun", fem: "أُسْتَاذَةٌ", femRoman: "ustaadhatun", ko: "교수, 선생님", en: "professor", pos: "명사", gender: "pair", cat: "사람", date: "2026-07-03" },
  { id: "jaamia", ar: "جَامِعَةٌ", roman: "jaami'atun", ko: "대학교", en: "university", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "장소", date: "2026-07-03" },
  { id: "madrasa", ar: "مَدْرَسَةٌ", roman: "madrasatun", ko: "학교", en: "school", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "장소", date: "2026-07-03" },
  { id: "ghurfa", ar: "غُرْفَةٌ", roman: "ghurfatun", ko: "방", en: "room", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "장소", date: "2026-07-03" },
  { id: "daar", ar: "دَارٌ", roman: "daarun", ko: "집", en: "house", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", cat: "장소", date: "2026-07-03" },
  { id: "haqiiba", ar: "حَقِيبَةٌ", roman: "haqiibatun", ko: "가방", en: "bag", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "사물", date: "2026-07-03" },

  // ── 2. 사람 / 관계
  { id: "umm", ar: "أُمٌّ", roman: "ummun", ko: "어머니", en: "mother", pos: "명사", gender: "f", note: "의미상 여성", cat: "사람", date: "2026-07-03" },
  { id: "bint", ar: "بِنْتٌ", roman: "bintun", ko: "딸, 소녀", en: "girl / daughter", pos: "명사", gender: "f", note: "의미상 여성", cat: "사람", date: "2026-07-03" },
  { id: "ukht", ar: "أُخْتٌ", roman: "ukhtun", ko: "자매", en: "sister", pos: "명사", gender: "f", note: "의미상 여성", cat: "사람", date: "2026-07-03" },
  { id: "aruus", ar: "عَرُوسٌ", roman: "aruusun", ko: "신부", en: "bride", pos: "명사", gender: "f", note: "의미상 여성", cat: "사람", date: "2026-07-03" },
  { id: "ariis", ar: "عَرِيسٌ", roman: "ariisun", ko: "신랑", en: "groom", pos: "명사", gender: "m", cat: "사람", date: "2026-07-03" },
  { id: "imraa", ar: "اِمْرَأَةٌ", roman: "imra'atun", ko: "여자", en: "woman", pos: "명사", gender: "f", note: "의미상 여성", cat: "사람", date: "2026-07-03" },
  { id: "muhammad", ar: "مُحَمَّدٌ", roman: "muhammadun", ko: "무함마드", en: "Muhammad", pos: "이름", gender: "m", cat: "사람", date: "2026-07-03" },
  { id: "haamid", ar: "حَامِدٌ", roman: "haamidun", ko: "하미드", en: "Hamid", pos: "이름", gender: "m", cat: "사람", date: "2026-07-03" },

  // ── 3~4. 형용사 (남/여 쌍)
  { id: "jamiil", ar: "جَمِيلٌ", roman: "jamiilun", fem: "جَمِيلَةٌ", femRoman: "jamiilatun", ko: "아름다운, 예쁜", en: "beautiful", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "kabiir", ar: "كَبِيرٌ", roman: "kabiirun", fem: "كَبِيرَةٌ", femRoman: "kabiiratun", ko: "큰", en: "big", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "saghiir", ar: "صَغِيرٌ", roman: "saghiirun", fem: "صَغِيرَةٌ", femRoman: "saghiiratun", ko: "작은, 어린", en: "small", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "tawiil", ar: "طَوِيلٌ", roman: "tawiilun", fem: "طَوِيلَةٌ", femRoman: "tawiilatun", ko: "긴, 키 큰", en: "long / tall", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "waasi", ar: "وَاسِعٌ", roman: "waasi'un", fem: "وَاسِعَةٌ", femRoman: "waasi'atun", ko: "넓은", en: "wide", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "sarii", ar: "سَرِيعٌ", roman: "sarii'un", fem: "سَرِيعَةٌ", femRoman: "sarii'atun", ko: "빠른", en: "fast", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "naziif", ar: "نَظِيفٌ", roman: "naziifun", fem: "نَظِيفَةٌ", femRoman: "naziifatun", ko: "깨끗한", en: "clean", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "arabiyy", ar: "عَرَبِيٌّ", roman: "arabiyyun", fem: "عَرَبِيَّةٌ", femRoman: "arabiyyatun", ko: "아랍의, 아랍인", en: "Arab / Arabic", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "qasiir", ar: "قَصِيرٌ", roman: "qasiirun", fem: "قَصِيرَةٌ", femRoman: "qasiiratun", ko: "짧은, 키 작은", en: "short", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "faqiir", ar: "فَقِيرٌ", roman: "faqiirun", fem: "فَقِيرَةٌ", femRoman: "faqiiratun", ko: "가난한", en: "poor", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "jadiid", ar: "جَدِيدٌ", roman: "jadiidun", fem: "جَدِيدَةٌ", femRoman: "jadiidatun", ko: "새로운", en: "new", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "qadiim", ar: "قَدِيمٌ", roman: "qadiimun", fem: "قَدِيمَةٌ", femRoman: "qadiimatun", ko: "낡은, 오래된", en: "old", pos: "형용사", gender: "pair", date: "2026-07-10" },
  { id: "shadiid", ar: "شَدِيدٌ", roman: "shadiidun", fem: "شَدِيدَةٌ", femRoman: "shadiidatun", ko: "강한, 질긴", en: "strong", pos: "형용사", gender: "pair", date: "2026-07-17" },
  { id: "khafiif", ar: "خَفِيفٌ", roman: "khafiifun", fem: "خَفِيفَةٌ", femRoman: "khafiifatun", ko: "가벼운", en: "light", pos: "형용사", gender: "pair", date: "2026-07-17" },
  { id: "samiin", ar: "سَمِينٌ", roman: "samiinun", fem: "سَمِينَةٌ", femRoman: "samiinatun", ko: "살찐", en: "fat", pos: "형용사", gender: "pair", date: "2026-07-17" },
  { id: "nahiif", ar: "نَحِيفٌ", roman: "nahiifun", fem: "نَحِيفَةٌ", femRoman: "nahiifatun", ko: "마른, 날씬한", en: "thin", pos: "형용사", gender: "pair", date: "2026-07-17" },
  { id: "mariid", ar: "مَرِيضٌ", roman: "mariidun", fem: "مَرِيضَةٌ", femRoman: "mariidatun", ko: "아픈", en: "sick", pos: "형용사", gender: "pair", date: "2026-07-17" },
  { id: "shaatir", ar: "شَاطِرٌ", roman: "shaatirun", ko: "영리한", en: "clever", pos: "형용사", gender: "m", date: "2026-07-17" },
  { id: "ladhiidh", ar: "لَذِيذٌ", roman: "ladhiidhun", fem: "لَذِيذَةٌ", femRoman: "ladhiidhatun", ko: "맛있는", en: "delicious", pos: "형용사", gender: "pair", note: "موزٌ لذيذٌ / موزةٌ لذيذةٌ 처럼 성을 맞춘다", date: "2026-08-02" },

  // ── 5. 음식 / 사물 / 자연
  { id: "qahwa", ar: "قَهْوَةٌ", roman: "qahwatun", ko: "커피", en: "coffee", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "음식", date: "2026-07-17" },
  { id: "haliib", ar: "حَلِيبٌ", roman: "haliibun", ko: "우유", en: "milk", pos: "명사", gender: "m", cat: "음식", date: "2026-07-17" },
  { id: "shaay", ar: "شَايٌ", roman: "shaayun", ko: "차", en: "tea", pos: "명사", gender: "m", cat: "음식", date: "2026-07-17" },
  { id: "sayyaara", ar: "سَيَّارَةٌ", roman: "sayyaaratun", ko: "자동차", en: "car", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "사물", date: "2026-07-17" },
  { id: "kursiyy", ar: "كُرْسِيٌّ", roman: "kursiyyun", ko: "의자", en: "chair", pos: "명사", gender: "m", cat: "사물", date: "2026-07-17" },
  { id: "naafidha", ar: "نَافِذَةٌ", roman: "naafidhatun", ko: "창문", en: "window", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "사물", date: "2026-07-17" },
  { id: "mustashfaa", ar: "مُسْتَشْفًى", roman: "mustashfan", ko: "병원", en: "hospital", pos: "명사", gender: "m", cat: "장소", date: "2026-07-17" },
  { id: "mataar", ar: "مَطَارٌ", roman: "mataarun", ko: "공항", en: "airport", pos: "명사", gender: "m", cat: "장소", date: "2026-07-17" },
  { id: "shaari", ar: "شَارِعٌ", roman: "shaari'un", ko: "거리", en: "street", pos: "명사", gender: "m", cat: "장소", date: "2026-07-17" },
  { id: "hadiiqa", ar: "حَدِيقَةٌ", roman: "hadiiqatun", ko: "정원, 공원", en: "garden", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "장소", date: "2026-07-17" },
  { id: "shajara", ar: "شَجَرَةٌ", roman: "shajaratun", ko: "나무 한 그루", en: "a tree", pos: "명사", gender: "f", note: "타마르부타 ة (단수 개체)", cat: "자연", date: "2026-07-17" },
  { id: "shajar", ar: "شَجَرٌ", roman: "shajarun", ko: "나무들", en: "trees", pos: "집합명사", gender: "m", cat: "자연", date: "2026-07-17" },
  { id: "tuffaaha", ar: "تُفَّاحَةٌ", roman: "tuffaahatun", ko: "사과 한 개", en: "an apple", pos: "명사", gender: "f", note: "타마르부타 ة (단수 개체)", cat: "음식", date: "2026-07-17" },
  { id: "tuffaah", ar: "تُفَّاحٌ", roman: "tuffaahun", ko: "사과들", en: "apples", pos: "집합명사", gender: "m", cat: "음식", date: "2026-07-17" },
  { id: "mawza", ar: "مَوْزَةٌ", roman: "mawzatun", ko: "바나나 한 개", en: "a banana", pos: "명사", gender: "f", note: "타마르부타 ة (단수 개체)", cat: "음식", date: "2026-07-17" },
  { id: "mawz", ar: "مَوْزٌ", roman: "mawzun", ko: "바나나들", en: "bananas", pos: "집합명사", gender: "m", cat: "음식", date: "2026-07-17" },

  // ── 6. 신체 / 자연물
  { id: "saaa", ar: "سَاعَةٌ", roman: "saa'atun", ko: "시계, 시간", en: "watch / time", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "사물", date: "2026-07-24" },
  { id: "yad", ar: "يَدٌ", roman: "yadun", ko: "손", en: "hand", pos: "명사", gender: "f", note: "몸에서 쌍으로 있는 부위 → 여성", cat: "신체", date: "2026-07-24" },
  { id: "ayn", ar: "عَيْنٌ", roman: "aynun", ko: "눈", en: "eye", pos: "명사", gender: "f", note: "몸에서 쌍으로 있는 부위 → 여성", cat: "신체", date: "2026-07-24" },
  { id: "rijl", ar: "رِجْلٌ", roman: "rijlun", ko: "다리", en: "leg", pos: "명사", gender: "f", note: "몸에서 쌍으로 있는 부위 → 여성", cat: "신체", date: "2026-07-24" },
  { id: "qadam", ar: "قَدَمٌ", roman: "qadamun", ko: "발", en: "foot", pos: "명사", gender: "f", note: "몸에서 쌍으로 있는 부위 → 여성", cat: "신체", date: "2026-07-24" },
  { id: "udhun", ar: "أُذُنٌ", roman: "udhunun", ko: "귀", en: "ear", pos: "명사", gender: "f", note: "몸에서 쌍으로 있는 부위 → 여성", cat: "신체", date: "2026-07-24" },
  { id: "shams", ar: "شَمْسٌ", roman: "shamsun", ko: "태양", en: "sun", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", cat: "자연", date: "2026-07-24" },
  { id: "riih", ar: "رِيحٌ", roman: "riihun", ko: "바람", en: "wind", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", cat: "자연", date: "2026-07-24" },
  { id: "ard", ar: "أَرْضٌ", roman: "ardun", ko: "토지, 지구", en: "land / earth", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", cat: "자연", date: "2026-07-24" },
  { id: "samaa", ar: "سَمَاءٌ", roman: "samaa'un", ko: "하늘", en: "sky", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", cat: "자연", date: "2026-07-24" },

  // ── 7. 국가 / 국적 (지명은 성별 퀴즈 제외)
  { id: "misr", ar: "مِصْرُ", roman: "misru", ko: "이집트", en: "Egypt", pos: "지명", gender: null, note: "지명/국명은 대부분 여성으로 취급", date: "2026-07-24" },
  { id: "assiin", ar: "الصِّينُ", roman: "as-siinu", ko: "중국", en: "China", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "siiniyy", ar: "صِينِيٌّ", roman: "siiniyyun", ko: "중국의, 중국인", en: "Chinese", pos: "형용사", gender: "m", date: "2026-07-24" },
  { id: "faransaa", ar: "فَرَنْسَا", roman: "faransaa", ko: "프랑스", en: "France", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "landan", ar: "لَنْدَنُ", roman: "landanu", ko: "런던", en: "London", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "aljazaair", ar: "الجَزَائِرُ", roman: "al-jazaa'iru", ko: "알제리", en: "Algeria", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "almaghrib", ar: "المَغْرِبُ", roman: "al-maghribu", ko: "모로코", en: "Morocco", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "alurdunn", ar: "الأُرْدُنُّ", roman: "al-urdunnu", ko: "요르단", en: "Jordan", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "assuudaan", ar: "السُّودَانُ", roman: "as-suudaanu", ko: "수단", en: "Sudan", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "lubnaan", ar: "لُبْنَانُ", roman: "lubnaanu", ko: "레바논", en: "Lebanon", pos: "지명", gender: null, date: "2026-07-24" },
  { id: "aliraaq", ar: "العِرَاقُ", roman: "al-iraaqu", ko: "이라크", en: "Iraq", pos: "지명", gender: null, date: "2026-07-24" },

  // ── 8. 대명사 / 지시어 / 기타 (성별 퀴즈 제외)
  { id: "huwa", ar: "هُوَ", roman: "huwa", ko: "그는, 그것은", en: "he / it", pos: "대명사", gender: null, date: "2026-07-03" },
  { id: "hiya", ar: "هِيَ", roman: "hiya", ko: "그녀는, 그것은", en: "she / it", pos: "대명사", gender: null, date: "2026-07-03" },
  { id: "anta", ar: "أَنْتَ", roman: "anta", ko: "너는 (남자에게)", en: "you (male)", pos: "대명사", gender: null, date: "2026-07-03" },
  { id: "anti", ar: "أَنْتِ", roman: "anti", ko: "너는 (여자에게)", en: "you (female)", pos: "대명사", gender: null, date: "2026-07-03" },
  { id: "haadhaa", ar: "هَذَا", roman: "haadhaa", ko: "이것 (남성)", en: "this (masc.)", pos: "지시어", gender: null, date: "2026-07-24" },
  { id: "dhaalika", ar: "ذَلِكَ", roman: "dhaalika", ko: "저것 (남성)", en: "that (masc.)", pos: "지시어", gender: null, date: "2026-07-24" },
  { id: "hunaa", ar: "هُنَا", roman: "hunaa", ko: "여기", en: "here", pos: "부사", gender: null, date: "2026-07-24" },
  { id: "hunaaka", ar: "هُنَاكَ", roman: "hunaaka", ko: "저기", en: "there", pos: "부사", gender: null, date: "2026-07-24" },
  { id: "fii", ar: "فِي", roman: "fii", ko: "안에, 에서", en: "in / at", pos: "전치사", gender: null, note: "فِي 뒤에는 소유격이 온다", date: "2026-07-24" },
  { id: "amaama", ar: "أَمَامَ", roman: "amaama", ko: "앞에", en: "in front of", pos: "전치사", gender: null, date: "2026-07-24" },
  { id: "alaa", ar: "عَلَى", roman: "alaa", ko: "위에", en: "on", pos: "전치사", gender: null, date: "2026-07-24" },
  { id: "qariibmin", ar: "قَرِيبٌ مِنْ", roman: "qariibun min", ko: "에서 가까운", en: "near from", pos: "구", gender: null, date: "2026-07-24" },
  { id: "aydan", ar: "أَيْضًا", roman: "aydan", ko: "역시, 또한", en: "also", pos: "부사", gender: null, date: "2026-07-24" },
  { id: "alyawma", ar: "اليَوْمَ", roman: "al-yawma", ko: "오늘", en: "today", pos: "부사", gender: null, date: "2026-07-24" },
  { id: "hal", ar: "هَلْ", roman: "hal", ko: "~입니까? (의문 표지)", en: "question marker", pos: "의문사", gender: null, note: "هَلْ + 평서문 = 의문문", date: "2026-07-24" },
  { id: "naam", ar: "نَعَمْ", roman: "na'am", ko: "예", en: "yes", pos: "답변", gender: null, date: "2026-07-24" },
  { id: "laa", ar: "لَا", roman: "laa", ko: "아니오", en: "no", pos: "답변", gender: null, date: "2026-07-24" },
  { id: "shariba", ar: "شَرِبَ", roman: "shariba", ko: "그는 마셨다", en: "he drank", pos: "동사", gender: null, note: "3인칭 남성 단수 과거가 기본형. 여성 주어면 동사가 변한다: شَرِبَتْ (샤리바트)", date: "2026-07-24" },
  { id: "kataba", ar: "كَتَبَ", roman: "kataba", ko: "그는 썼다", en: "he wrote", pos: "동사", gender: null, date: "2026-07-24" },

  // ── 8/2 새 단어
  { id: "saakin", ar: "سَاكِنٌ", roman: "saakinun", fem: "سَاكِنَةٌ", femRoman: "saakinatun", ko: "거주자", en: "resident", pos: "명사", gender: "pair", date: "2026-08-02" },
  { id: "khabbaaz", ar: "خَبَّازٌ", roman: "khabbaazun", fem: "خَبَّازَةٌ", femRoman: "khabbaazatun", ko: "제빵사", en: "baker", pos: "명사", gender: "pair", date: "2026-08-02" },
  { id: "shaqqa", ar: "شَقَّةٌ", roman: "shaqqatun", ko: "아파트", en: "apartment", pos: "명사", gender: "f", note: "타마르부타 ة", cat: "장소", date: "2026-08-02" },
  { id: "dawla", ar: "دَوْلَةٌ", roman: "dawlatun", ko: "국가", en: "country / state", pos: "명사", gender: "f", note: "타마르부타 ة. 나라/도시를 여성으로 보는 이유와 연결", date: "2026-08-02" },
  { id: "walad", ar: "وَلَدٌ", roman: "waladun", ko: "소년", en: "boy", pos: "명사", gender: "m", cat: "사람", date: "2026-08-02" },
  { id: "fasl", ar: "فَصْلٌ", roman: "faslun", ko: "교실, 학기/계절", en: "classroom / season", pos: "명사", gender: "m", note: "في الفصلِ 에서 전치사 뒤라 소유격 ـِ", cat: "장소", date: "2026-08-02" },
  { id: "katif", ar: "كَتِفٌ", roman: "katifun", ko: "어깨", en: "shoulder", pos: "명사", gender: "f", note: "쌍으로 있는 신체 부위 → 여성", cat: "신체", date: "2026-08-02" },
  { id: "fakhidh", ar: "فَخِذٌ", roman: "fakhidhun", ko: "허벅지", en: "thigh", pos: "명사", gender: "f", note: "쌍으로 있는 신체 부위 → 여성", cat: "신체", date: "2026-08-02" },
  { id: "saaq", ar: "سَاقٌ", roman: "saaqun", ko: "정강이, 다리", en: "shin / leg", pos: "명사", gender: "f", note: "쌍으로 있는 신체 부위 → 여성", cat: "신체", date: "2026-08-02" },
  { id: "ras", ar: "رَأْسٌ", roman: "ra'sun", ko: "머리", en: "head", pos: "명사", gender: "m", note: "하나만 있는 신체 부위 → 보통 남성", cat: "신체", date: "2026-08-02" },
  { id: "fam", ar: "فَمٌ", roman: "famun", ko: "입", en: "mouth", pos: "명사", gender: "m", note: "하나만 있는 신체 부위 → 보통 남성", cat: "신체", date: "2026-08-02" },
  { id: "batn", ar: "بَطْنٌ", roman: "batnun", ko: "배", en: "belly", pos: "명사", gender: "m", note: "하나만 있는 신체 부위 → 보통 남성", cat: "신체", date: "2026-08-02" },
  { id: "harb", ar: "حَرْبٌ", roman: "harbun", ko: "전쟁", en: "war", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", date: "2026-08-02" },
  { id: "bir", ar: "بِئْرٌ", roman: "bi'run", ko: "우물", en: "well", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", date: "2026-08-02" },
  { id: "nafs", ar: "نَفْسٌ", roman: "nafsun", ko: "영혼, 자기 자신", en: "soul / self", pos: "명사", gender: "f", note: "관용적으로 여성인 명사", date: "2026-08-02" },
  { id: "ism", ar: "اِسْمٌ", roman: "ismun", ko: "명사, 이름", en: "noun / name", pos: "문법용어", gender: "m", note: "아랍어 3품사 중 하나", date: "2026-08-02" },
  { id: "fil", ar: "فِعْلٌ", roman: "fi'lun", ko: "동사", en: "verb", pos: "문법용어", gender: "m", note: "아랍어 3품사 중 하나", date: "2026-08-02" },
  { id: "harf", ar: "حَرْفٌ", roman: "harfun", ko: "불변사", en: "particle", pos: "문법용어", gender: "m", note: "전치사·접속사·의문사처럼 변하지 않는 말", date: "2026-08-02" },
  { id: "mubtada", ar: "مُبْتَدَأٌ", roman: "mubtada'un", ko: "주부", en: "subject (nominal sentence)", pos: "문법용어", gender: "m", note: "명사문 = 주부 + 술부", date: "2026-08-02" },
  { id: "khabar", ar: "خَبَرٌ", roman: "khabarun", ko: "술부", en: "predicate", pos: "문법용어", gender: "m", note: "기본 규칙: 주부는 한정, 술부는 비한정", date: "2026-08-02" },

  // ── 8/9 수업 (형용사·전치사·동사 과거형)
  { id: "maktab", ar: "مَكْتَبٌ", roman: "maktabun", ko: "사무실, 책상", en: "office / desk", pos: "명사", gender: "m", cat: "장소", date: "2026-08-09" },
  { id: "balad", ar: "بَلَدٌ", roman: "baladun", ko: "나라, 고장", en: "country / town", pos: "명사", gender: "m", note: "복수: بِلَادٌ (빌라드). 정치적 국가 개념은 دَوْلَةٌ", date: "2026-08-09" },
  { id: "naafi", ar: "نَافِعٌ", roman: "naafi'un", fem: "نَافِعَةٌ", femRoman: "naafi'atun", ko: "유익한", en: "useful", pos: "형용사", gender: "pair", date: "2026-08-09" },
  { id: "qariib", ar: "قَرِيبٌ", roman: "qariibun", fem: "قَرِيبَةٌ", femRoman: "qariibatun", ko: "가까운", en: "near", pos: "형용사", gender: "pair", note: "قَرِيبٌ مِنْ = ~에서 가까운", date: "2026-08-09" },
  { id: "mutadil", ar: "مُعْتَدِلٌ", roman: "mu'tadilun", fem: "مُعْتَدِلَةٌ", femRoman: "mu'tadilatun", ko: "온화한, 적당한", en: "moderate / mild", pos: "형용사", gender: "pair", date: "2026-08-09" },
  { id: "jalasa", ar: "جَلَسَ", roman: "jalasa", ko: "그는 앉았다", en: "he sat", pos: "동사", gender: null, note: "여성 주어면 جَلَسَتْ (잘라사트)", date: "2026-08-09" },
  { id: "jaalis", ar: "جَالِسٌ", roman: "jaalisun", fem: "جَالِسَةٌ", femRoman: "jaalisatun", ko: "앉아 있는", en: "sitting", pos: "분사", gender: "pair", note: "능동분사: جَلَسَ(앉았다) → جَالِسٌ(앉아 있는 상태)", date: "2026-08-09" },
  { id: "min", ar: "مِنْ", roman: "min", ko: "~에서, ~로부터", en: "from", pos: "전치사", gender: null, note: "전치사 뒤에는 소유격", date: "2026-08-09" },
];

// 초창기 회화 표현 (운전 모드 루프에 사용)
const PHRASES = [
  { id: "salaam", ar: "السَّلَامُ عَلَيْكُمْ", koPron: "앗살라무 알라이쿰", roman: "as-salaamu alaykum", ko: "안녕하세요", note: "직역: 당신에게 평화가 있기를. 가장 기본적이고 정중한 인사" },
  { id: "wasalaam", ar: "وَعَلَيْكُمُ السَّلَامُ", koPron: "와 알라이쿰 앗살람", roman: "wa alaykumu as-salaam", ko: "당신에게도 평화가 있기를", note: "السَّلَامُ عَلَيْكُمْ 에 대한 답" },
  { id: "marhaban", ar: "مَرْحَبًا", koPron: "마르하반", roman: "marhaban", ko: "반갑습니다", note: "가볍고 친근한 인사" },
  { id: "sabaah", ar: "صَبَاحُ الْخَيْرِ", koPron: "사바 알 카이르", roman: "sabaah al-khayr", ko: "좋은 아침입니다", note: "아침 인사" },
  { id: "sabaahnuur", ar: "صَبَاحُ النُّورِ", koPron: "사바 안 누르", roman: "sabaah an-nuur", ko: "좋은 아침입니다 (답)", note: "صَبَاحُ الْخَيْرِ 에 대한 답" },
  { id: "masaa", ar: "مَسَاءُ الْخَيْرِ", koPron: "마싸 알 카이르", roman: "masaa al-khayr", ko: "좋은 저녁입니다", note: "오후/저녁 인사" },
  { id: "masaanuur", ar: "مَسَاءُ النُّورِ", koPron: "마싸 안 누르", roman: "masaa an-nuur", ko: "좋은 저녁입니다 (답)", note: "مَسَاءُ الْخَيْرِ 에 대한 답" },
  { id: "kayfahaal", ar: "كَيْفَ حَالُكَ؟", koPron: "케이파 할루카?", roman: "kayfa haaluka?", ko: "어떻게 지내세요? (남자에게)", note: "여자에게는 كَيْفَ حَالُكِ (케이파 할루키)" },
  { id: "hamdulillah", ar: "الْحَمْدُ لِلّٰهِ", koPron: "알 함두릴라", roman: "al-hamdu lillaah", ko: "덕분에 좋습니다 / 하나님께 감사", note: "잘 지내냐는 물음에 자주 답하는 표현" },
  { id: "tafaddal", ar: "تَفَضَّلْ", koPron: "타파달", roman: "tafaddal", ko: "자, 여기요 / 먼저 하세요", note: "상대에게 권할 때" },
  { id: "mashallah", ar: "مَا شَاءَ اللهُ", koPron: "마샤알라", roman: "maa shaa Allaah", ko: "멋지다 / 대단하다", note: "좋은 것을 봤을 때 감탄·칭찬" },
  { id: "bismillah", ar: "بِسْمِ اللهِ", koPron: "비스밀라", roman: "bismi llaah", ko: "하나님의 이름으로", note: "식사 전, 일 시작 전, 운전 시작할 때" },
  { id: "shukran", ar: "شُكْرًا", koPron: "슈크란", roman: "shukran", ko: "감사합니다", note: "가장 기본적인 감사 표현" },
  { id: "afwan", ar: "عَفْوًا", koPron: "아프완", roman: "afwan", ko: "천만에요 / 괜찮습니다", note: "شُكْرًا 에 대한 답으로도 쓴다" },
  { id: "bukra", ar: "بُكْرَة إِنْ شَاءَ اللهُ", koPron: "부크라 인샤알라", roman: "bukra in shaa Allaah", ko: "내일, 신의 뜻이라면", note: "걸프식 회화. 표준 아랍어 '내일'은 غَدًا" },
  { id: "yalla", ar: "يَلَّا يَلَّا", koPron: "얄라 얄라", roman: "yalla yalla", ko: "가자 / 빨리", note: "아주 많이 쓰는 회화 표현" },
  { id: "maasalaama", ar: "مَعَ السَّلَامَةِ", koPron: "마쌀라마", roman: "maa as-salaamah", ko: "안녕히 가세요", note: "헤어질 때" },
];

// 예문 (카드 뒷면·복습용)
const EXAMPLES = [
  { ar: "أَنَا طَالِبٌ", roman: "ana taalibun", ko: "나는 학생입니다. (남성 화자)" },
  { ar: "أَنَا طَالِبَةٌ", roman: "ana taalibatun", ko: "나는 여학생입니다. (여성 화자)" },
  { ar: "أَنْتَ طَالِبٌ", roman: "anta taalibun", ko: "너는 학생입니다. (남자에게)" },
  { ar: "أَنْتِ طَالِبَةٌ", roman: "anti taalibatun", ko: "너는 여학생입니다. (여자에게)" },
  { ar: "أَنَا كُورِيٌّ", roman: "ana kuuriyyun", ko: "나는 한국인입니다. (남성 화자)" },
  { ar: "أَنَا كُورِيَّةٌ", roman: "ana kuuriyyatun", ko: "나는 한국인입니다. (여성 화자)" },
  { ar: "هُوَ رَجُلٌ", roman: "huwa rajulun", ko: "그는 남자입니다." },
  { ar: "هِيَ طَالِبَةٌ", roman: "hiya taalibatun", ko: "그녀는 여학생입니다." },
  { ar: "اَلرَّجُلُ فَقِيرٌ", roman: "ar-rajulu faqiirun", ko: "그 남자는 가난하다." },
  { ar: "اَلرَّجُلُ صَغِيرٌ", roman: "ar-rajulu saghiirun", ko: "그 남자는 작다." },
  { ar: "اَلْبَيْتُ كَبِيرٌ", roman: "al-baytu kabiirun", ko: "그 집은 크다." },
  { ar: "اَلْغُرْفَةُ نَظِيفَةٌ", roman: "al-ghurfatu naziifatun", ko: "그 방은 깨끗하다." },
  { ar: "اَلْمَرْأَةُ جَمِيلَةٌ", roman: "al-mar'atu jamiilatun", ko: "그 여자는 아름답다." },
  { ar: "اَلْمَرْأَةُ الْجَمِيلَةُ صَغِيرَةٌ", roman: "al-mar'atu al-jamiilatu saghiiratun", ko: "그 예쁜 여자는 작다." },
  { ar: "اَلْمَرْأَةُ جَمِيلَةٌ وَصَغِيرَةٌ", roman: "al-mar'atu jamiilatun wa-saghiiratun", ko: "그 여자는 예쁘고 작다." },
  { ar: "اَلطَّالِبُ فِي الْفَصْلِ", roman: "at-taalibu fii al-fasli", ko: "그 학생은 교실에 있습니다." },
  { ar: "اَلْكِتَابُ هُنَا", roman: "al-kitaabu hunaa", ko: "그 책은 여기에 있습니다." },
  { ar: "هَلِ الْبِنْتُ جَمِيلَةٌ؟", roman: "hali al-bintu jamiilatun?", ko: "그 소녀는 예쁩니까?" },
  { ar: "نَعَمْ، هِيَ جَمِيلَةٌ", roman: "na'am, hiya jamiilatun", ko: "네, 그녀는 예쁩니다." },
  { ar: "هَلِ الرَّجُلُ عَرَبِيٌّ؟", roman: "hali ar-rajulu arabiyyun?", ko: "그 남자는 아랍인입니까?" },
  { ar: "لَا، هُوَ كُورِيٌّ", roman: "laa, huwa kuuriyyun", ko: "아니요, 그는 한국인입니다." },
  { ar: "هَلْ هُوَ أُسْتَاذٌ؟", roman: "hal huwa ustaadhun?", ko: "그는 교수입니까?" },
  { ar: "نَعَمْ، هُوَ أُسْتَاذٌ", roman: "na'am, huwa ustaadhun", ko: "예, 그는 교수입니다." },
  { ar: "لَا، هُوَ طَالِبٌ", roman: "laa, huwa taalibun", ko: "아니오, 그는 학생입니다." },
  { ar: "شَرِبَ مُحَمَّدٌ القَهْوَةَ", roman: "shariba muhammadun al-qahwata", ko: "무함마드는 커피를 마셨다." },
];

// 형용사 3패턴 세트: [비한정 명사+형용사, 한정 명사+형용사, 한정 주부+비한정 술부]
const PATTERNS = [
  {
    noun: "집", adj: "큰",
    forms: [
      { ar: "بَيْتٌ كَبِيرٌ", roman: "baytun kabiirun", ko: "한 큰 집", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلْبَيْتُ الْكَبِيرُ", roman: "al-baytu al-kabiiru", ko: "그 큰 집", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلْبَيْتُ كَبِيرٌ", roman: "al-baytu kabiirun", ko: "그 집은 크다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
  {
    noun: "방", adj: "깨끗한", femNote: "여성명사라 형용사도 여성형",
    forms: [
      { ar: "غُرْفَةٌ نَظِيفَةٌ", roman: "ghurfatun naziifatun", ko: "한 깨끗한 방", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلْغُرْفَةُ النَّظِيفَةُ", roman: "al-ghurfatu an-naziifatu", ko: "그 깨끗한 방", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلْغُرْفَةُ نَظِيفَةٌ", roman: "al-ghurfatu naziifatun", ko: "그 방은 깨끗하다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
  {
    noun: "남자", adj: "키 큰",
    forms: [
      { ar: "رَجُلٌ طَوِيلٌ", roman: "rajulun tawiilun", ko: "한 키 큰 남자", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلرَّجُلُ الطَّوِيلُ", roman: "ar-rajulu at-tawiilu", ko: "그 키 큰 남자", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلرَّجُلُ طَوِيلٌ", roman: "ar-rajulu tawiilun", ko: "그 남자는 키가 크다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
  {
    noun: "책", adj: "새로운",
    forms: [
      { ar: "كِتَابٌ جَدِيدٌ", roman: "kitaabun jadiidun", ko: "한 새 책", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلْكِتَابُ الْجَدِيدُ", roman: "al-kitaabu al-jadiidu", ko: "그 새 책", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلْكِتَابُ جَدِيدٌ", roman: "al-kitaabu jadiidun", ko: "그 책은 새것이다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
  {
    noun: "자동차", adj: "빠른", femNote: "여성명사라 형용사도 여성형",
    forms: [
      { ar: "سَيَّارَةٌ سَرِيعَةٌ", roman: "sayyaaratun sarii'atun", ko: "한 빠른 자동차", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلسَّيَّارَةُ السَّرِيعَةُ", roman: "as-sayyaaratu as-sarii'atu", ko: "그 빠른 자동차", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلسَّيَّارَةُ سَرِيعَةٌ", roman: "as-sayyaaratu sarii'atun", ko: "그 자동차는 빠르다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
  {
    noun: "학교", adj: "예쁜", femNote: "여성명사라 형용사도 여성형",
    forms: [
      { ar: "مَدْرَسَةٌ جَمِيلَةٌ", roman: "madrasatun jamiilatun", ko: "한 예쁜 학교", type: "비한정 명사 + 비한정 형용사" },
      { ar: "اَلْمَدْرَسَةُ الْجَمِيلَةُ", roman: "al-madrasatu al-jamiilatu", ko: "그 예쁜 학교", type: "한정 명사 + 한정 형용사" },
      { ar: "اَلْمَدْرَسَةُ جَمِيلَةٌ", roman: "al-madrasatu jamiilatun", ko: "그 학교는 예쁘다", type: "한정 주부 + 비한정 술부 (문장)" },
    ],
  },
];

// هَلْ 의문문 연습: 평서문 → 의문문 → 답변
const HAL_ITEMS = [
  { plain: "اَلْبِنْتُ جَمِيلَةٌ", plainKo: "그 소녀는 예쁘다", q: "هَلِ الْبِنْتُ جَمِيلَةٌ؟", qRoman: "hali al-bintu jamiilatun?", qKo: "그 소녀는 예쁩니까?", yes: "نَعَمْ، هِيَ جَمِيلَةٌ", yesRoman: "na'am, hiya jamiilatun" },
  { plain: "اَلرَّجُلُ عَرَبِيٌّ", plainKo: "그 남자는 아랍인이다", q: "هَلِ الرَّجُلُ عَرَبِيٌّ؟", qRoman: "hali ar-rajulu arabiyyun?", qKo: "그 남자는 아랍인입니까?", no: "لَا، هُوَ كُورِيٌّ", noRoman: "laa, huwa kuuriyyun", noKo: "아니요, 그는 한국인입니다" },
  { plain: "هُوَ أُسْتَاذٌ", plainKo: "그는 교수이다", q: "هَلْ هُوَ أُسْتَاذٌ؟", qRoman: "hal huwa ustaadhun?", qKo: "그는 교수입니까?", yes: "نَعَمْ، هُوَ أُسْتَاذٌ", yesRoman: "na'am, huwa ustaadhun", no: "لَا، هُوَ طَالِبٌ", noRoman: "laa, huwa taalibun", noKo: "아니오, 그는 학생입니다" },
  { plain: "اَلْبَيْتُ كَبِيرٌ", plainKo: "그 집은 크다", q: "هَلِ الْبَيْتُ كَبِيرٌ؟", qRoman: "hali al-baytu kabiirun?", qKo: "그 집은 큽니까?", yes: "نَعَمْ، هُوَ كَبِيرٌ", yesRoman: "na'am, huwa kabiirun" },
  { plain: "اَلْغُرْفَةُ نَظِيفَةٌ", plainKo: "그 방은 깨끗하다", q: "هَلِ الْغُرْفَةُ نَظِيفَةٌ؟", qRoman: "hali al-ghurfatu naziifatun?", qKo: "그 방은 깨끗합니까?", yes: "نَعَمْ، هِيَ نَظِيفَةٌ", yesRoman: "na'am, hiya naziifatun" },
];

// 단어별 이미지(이모지). 매핑이 어색한 추상어·문법용어는 생략 가능.
const EMOJI = {
  rajul: "👨", bayt: "🏠", baab: "🚪", kitaab: "📕", taalib: "👨‍🎓", taaliba: "👩‍🎓",
  ustaadh: "👨‍🏫", jaamia: "🏛️", madrasa: "🏫", ghurfa: "🛋️", daar: "🏡", haqiiba: "👜",
  umm: "👩‍👦", bint: "👧", ukht: "👭", aruus: "👰", ariis: "🤵", imraa: "👩",
  jamiil: "🌸", kabiir: "🐘", saghiir: "🐜", tawiil: "🦒", waasi: "🏞️", sarii: "🐆",
  naziif: "✨", arabiyy: "🕌", qasiir: "📏", jadiid: "🆕", qadiim: "🏚️", shadiid: "💪",
  khafiif: "🪶", samiin: "🐷", mariid: "🤒", shaatir: "🧠", ladhiidh: "😋",
  qahwa: "☕", haliib: "🥛", shaay: "🍵", sayyaara: "🚗", kursiyy: "🪑", naafidha: "🪟",
  mustashfaa: "🏥", mataar: "✈️", shaari: "🛣️", hadiiqa: "🏞️", shajara: "🌳", shajar: "🌲",
  tuffaaha: "🍎", tuffaah: "🍎", mawza: "🍌", mawz: "🍌",
  saaa: "⌚", yad: "✋", ayn: "👁️", rijl: "🦵", qadam: "🦶", udhun: "👂",
  shams: "☀️", riih: "💨", ard: "🌍", samaa: "🌌",
  misr: "🇪🇬", assiin: "🇨🇳", siiniyy: "🇨🇳", faransaa: "🇫🇷", landan: "🇬🇧",
  aljazaair: "🇩🇿", almaghrib: "🇲🇦", alurdunn: "🇯🇴", assuudaan: "🇸🇩", lubnaan: "🇱🇧", aliraaq: "🇮🇶",
  huwa: "👨", hiya: "👩", anta: "🫵", anti: "🫵", haadhaa: "👇", dhaalika: "👉",
  hunaa: "📍", hunaaka: "🧭", fii: "📦", alaa: "⬆️", aydan: "➕", alyawma: "📅",
  hal: "❓", naam: "👍", laa: "👎", shariba: "🥤", kataba: "✍️",
  saakin: "🏘️", khabbaaz: "🧑‍🍳", shaqqa: "🏢", dawla: "🗺️", walad: "👦", fasl: "📚",
  katif: "🙆", fakhidh: "🦵", saaq: "🦵", ras: "👤", fam: "👄", harb: "⚔️", bir: "⛲",
  ism: "📛", fil: "🏃", harf: "🔤",
  maktab: "💼", balad: "🏙️", naafi: "🌟", qariib: "🤏", mutadil: "🌤️",
  jalasa: "💺", jaalis: "🧘", min: "⬅️",
};
VOCAB.forEach(w => { if (EMOJI[w.id]) w.img = EMOJI[w.id]; });
