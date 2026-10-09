// index.html 인라인 스크립트를 DOM 스텁 위에서 돌려 선택 발음 로직만 검증
const fs = require("fs");
const path = require("path").join(__dirname, "..") + "/";
const html = fs.readFileSync(path + "index.html", "utf8");
const inline = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// ── 최소 DOM 스텁
let selection = { ranges: [], isCollapsed: true, text: "",
  removeAllRanges() { this.ranges = []; this.isCollapsed = true; this.text = ""; },
  addRange(r) { this.ranges = [r]; this.isCollapsed = false; this.text = r.text; },
  getRangeAt() { return this.ranges[0]; },
  toString() { return this.text; } };

const mkEl = (tag) => ({
  tagName: tag, id: "", className: "", textContent: "", innerHTML: "", dataset: {},
  style: {}, children: [], offsetWidth: 110, offsetHeight: 36,
  appendChild(c) { this.children.push(c); }, remove() {},
  addEventListener() {}, getBoundingClientRect: () => ({ left: 100, top: 200, width: 300, height: 50 }),
});
const ELS = {};
global.document = {
  body: mkEl("body"),
  documentElement: mkEl("html"),
  createElement: mkEl,
  getElementById: (id) => ELS[id] || null,
  querySelector: (sel) => (ELS[sel] ||= mkEl("div")), querySelectorAll: () => [],
  addEventListener(ev, fn) { (this._h ||= {})[ev] = fn; },
};
document.body.appendChild = function (c) { if (c.id) ELS[c.id] = c; this.children.push(c); };
global.window = {
  getSelection: () => selection, innerWidth: 900, scrollY: 0,
  addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), scrollTo() {},
  location: { protocol: "file:", hostname: "", hash: "" },
};
global.getSelection = () => selection;
global.location = window.location;
global.addEventListener = () => {};
global.matchMedia = window.matchMedia;
global.localStorage = { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
global.history = { replaceState() {}, pushState() {} };
let lastAudio = null;
global.Audio = function (src) { lastAudio = { src, play() {}, pause() {}, style: {} }; return lastAudio; };
global.navigator = { userAgent: "node" };
global.speechSynthesis = { speak() {}, cancel() {}, getVoices: () => [] };
window.speechSynthesis = global.speechSynthesis;
global.SpeechSynthesisUtterance = function (t) { this.text = t; };

// data.js / audio.js / images.js 를 실제로 읽어 전역에 올린다
for (const f of ["data.js", "images.js", "audio.js"]) {
  eval(fs.readFileSync(path + f, "utf8").replace(/^const /gm, "var ").replace(/^let /gm, "var "));
}
// 팝업 마크업은 index.html 본문에 있으므로 스텁에 미리 등록해 둔다
ELS.clModal = mkEl("div");
ELS.clBack = mkEl("div");
ELS.clBack.classList = { _c: new Set(), add(x){this._c.add(x)}, remove(x){this._c.delete(x)}, contains(x){return this._c.has(x)} };

// 인라인 스크립트: const/let → var (eval 스코프 문제 회피)
eval(inline.replace(/^const /gm, "var ").replace(/^let /gm, "var "));

// ── 검증
const ok = [], bad = [];
const t = (name, cond, extra = "") => (cond ? ok : bad).push(name + (extra ? " → " + extra : ""));
const mkRange = (text) => ({ text, getBoundingClientRect: () => ({ left: 100, top: 200, width: 300, height: 50 }) });
const pop = () => document.getElementById("selPop");
const sel = (txt) => { selection.addRange(mkRange(txt)); showSelSpeak(); };

// 1) 아랍어를 고르면 팝업이 뜬다
sel("هَلْ هَذَا بَيْتٌ كَبِيرٌ");
t("아랍어 선택 → 팝업 생성", !!pop());
t("아랍어 선택 → 팝업 표시", pop().style.display === "block", pop().style.display);
t("발음 버튼 있음", /sp-say/.test(pop().innerHTML));

// 2) 한국어만 고르면 숨는다
sel("한국어 문장입니다");
t("한국어 선택 → 숨김", pop().style.display === "none", pop().style.display);

// 3) 선택 해제 → 숨김
sel("رِجَالٌ"); selection.removeAllRanges(); showSelSpeak();
t("선택 해제 → 숨김", pop().style.display === "none");

// ── 사전
const meaning = (arabic) => { const h = lookupAr(arabic); return h ? h.w.ko + (h.kind ? "(" + h.kind + ")" : "") : null; };
t("기본형 조회 بَيْتٌ", meaning("بَيْتٌ") === "집", meaning("بَيْتٌ"));
t("하라카 없어도 조회 بيت", meaning("بيت") === "집", meaning("بيت"));
t("한정관사 붙은 형태 اَلْبَيْتُ", meaning("اَلْبَيْتُ") === "집", meaning("اَلْبَيْتُ"));
t("전치사 붙은 형태 فِي الْبَيْتِ 중 الْبَيْتِ", meaning("الْبَيْتِ") === "집", meaning("الْبَيْتِ"));
t("복수형 조회 بُيُوتٌ", (meaning("بُيُوتٌ") || "").startsWith("집"), meaning("بُيُوتٌ"));
t("복수형은 복수형이라 표시", (lookupAr("بُيُوتٌ") || {}).kind === "복수형", (lookupAr("بُيُوتٌ") || {}).kind);
t("여성형 조회", (lookupAr("مُعَلِّمَةٌ") || {}).kind === "여성형", JSON.stringify(lookupAr("مُعَلِّمَةٌ") && lookupAr("مُعَلِّمَةٌ").w.ko));
t("모르는 말은 null", meaning("زززز") === null, meaning("زززز"));

// 4) 단어 하나를 끌면 팝업에 뜻이 나온다
sel("اَلْبَيْتُ");
t("단어 드래그 → 뜻 표시", /sp-hit/.test(pop().innerHTML) && /집/.test(pop().innerHTML));
t("발음기호도 같이 표시", /bayt/i.test(pop().innerHTML), pop().innerHTML.slice(0, 200));

// 5) 문장을 통째로 끌면 아는 단어들을 모아 보여준다 (최대 4개)
sel("هَذَا بَيْتٌ كَبِيرٌ وَجَمِيلٌ");
const hitCount = (pop().innerHTML.match(/sp-hit/g) || []).length;
t("문장 드래그 → 아는 단어 여러 개", hitCount >= 2 && hitCount <= 4, "hits=" + hitCount);

// 6) 단어장에 없으면 안내 문구
sel("زززز ززز");
t("모르는 말 → 안내 문구", /sp-none/.test(pop().innerHTML));
t("모르는 말이어도 발음 버튼은 남음", /sp-say/.test(pop().innerHTML));

// 7) 발음 버튼을 누르면 고른 텍스트가 그대로 TTS로 간다
let spoken = null;
window.speechSynthesis.speak = global.speechSynthesis.speak = (u) => { spoken = u.text; };
sel("بَيْتٌ كَبِيرٌ");
pop().onclick({ stopPropagation() {}, target: { closest: () => null } });
t("발음 버튼 → 고른 조각만 읽음", spoken === "بَيْتٌ كَبِيرٌ", JSON.stringify(spoken));

// 8) 뜻 줄을 누르면 그 단어의 녹음을 재생한다
let played = null;
global.Audio = function (src) { played = src; return { play() {}, pause() {}, style: {} }; };
sel("اَلْبَيْتُ");
pop().onclick({ stopPropagation() {}, target: { closest: (s) => (s === ".sp-hit" ? { dataset: { id: "bayt" } } : null) } });
t("뜻 줄 클릭 → 그 단어 녹음 재생", played && /\/bayt\.mp3$/.test(played), String(played));

// 9) 화면 밖으로 안 나간다
selection.addRange({ text: "رِجَالٌ", getBoundingClientRect: () => ({ left: 880, top: 300, width: 40, height: 40 }) }); showSelSpeak();
t("오른쪽 끝에서도 화면 안", parseFloat(pop().style.left) + (pop().offsetWidth || 220) <= 900, pop().style.left);
selection.addRange({ text: "رِجَالٌ", getBoundingClientRect: () => ({ left: -20, top: 5, width: 30, height: 30 }) }); showSelSpeak();
t("위쪽이 좁으면 아래로 붙음", parseFloat(pop().style.top) >= 5, pop().style.top);

// 10) 드래그 중에는 카드가 안 뒤집힌다
ELS.cardBack = mkEl("div");
sel("بَيْتٌ");
const before = flipped; flipCard();
t("드래그 중 카드 안 뒤집힘", flipped === before, before + "→" + flipped);
selection.removeAllRanges(); flipCard();
t("선택 없으면 정상적으로 뒤집힘", flipped !== before, before + "→" + flipped);

// 11) 원문은 건드리지 않는다 (표시용만)
t("VOCAB 원문 그대로", VOCAB.find(w => w.id === "bayt").ar === "بَيْتٌ");

// ── 읽어주는 속도
let uttered = null;
// 앞의 "뜻 줄 클릭" 검증에서 Audio 스텁을 갈아끼웠으므로 다시 계측용으로 설치한다
global.Audio = function (src) { lastAudio = { src, play() {}, pause() {}, style: {} }; return lastAudio; };
window.speechSynthesis.speak = global.speechSynthesis.speak = (u) => { uttered = u; };

localStorage.setItem("arRate", "1");
t("기본 속도는 보통", getRate() === 1 && rateLabel() === "🔊 속도 보통", rateLabel());

cycleRate();
t("한 번 누르면 0.85배", getRate() === 0.85, String(getRate()));
t("라벨도 바뀜", /0\.85배/.test(rateLabel()), rateLabel());
cycleRate(); t("두 번 → 0.7배", getRate() === 0.7, String(getRate()));
cycleRate(); t("세 번 → 0.6배", getRate() === 0.6, String(getRate()));
cycleRate(); t("네 번 → 다시 보통", getRate() === 1, String(getRate()));

// 문장 읽기에 속도가 걸린다
localStorage.setItem("arRate", "0.6");
uttered = null; sayLine("هَذَا بَيْتٌ كَبِيرٌ");
t("문장: 느리게 설정하면 발화속도 내려감", uttered && Math.abs(uttered.rate - 0.85 * 0.6) < 1e-9, uttered && String(uttered.rate));
t("문장: 원문 그대로 읽음", uttered && uttered.text === "هَذَا بَيْتٌ كَبِيرٌ");
localStorage.setItem("arRate", "1");
uttered = null; sayLine("هَذَا بَيْتٌ");
t("문장: 보통이면 0.85", uttered && Math.abs(uttered.rate - 0.85) < 1e-9, uttered && String(uttered.rate));

// 녹음 재생에도 걸린다
localStorage.setItem("arRate", "0.7");
lastAudio = null; sayAr("bayt", "بَيْتٌ");
t("녹음: 느리게 설정하면 재생속도 내려감", lastAudio && Math.abs(lastAudio.playbackRate - 0.7) < 1e-9, lastAudio && String(lastAudio.playbackRate));
localStorage.setItem("arRate", "1");
lastAudio = null; sayAr("bayt", "بَيْتٌ");
t("녹음: 보통이면 등속", lastAudio && lastAudio.playbackRate === 1, lastAudio && String(lastAudio.playbackRate));

// 너무 느려 소리가 죽는 구간은 막는다
localStorage.setItem("arRate", "0.6");
lastAudio = null; sayAr("bayt", "بَيْتٌ", 0.5);
t("재생속도 0.5 아래로 안 내려감", lastAudio && lastAudio.playbackRate >= 0.5, lastAudio && String(lastAudio.playbackRate));

// 운전 모드는 자체 속도가 있어 전역 배속을 또 걸지 않는다
localStorage.setItem("arRate", "0.6");
lastAudio = null; sayAr("bayt", "بَيْتٌ", 0.85, null, null, true);
t("운전 모드는 전역 배속 제외", lastAudio && lastAudio.playbackRate === 1, lastAudio && String(lastAudio.playbackRate));
localStorage.setItem("arRate", "1");

// 범례 바에 속도 버튼이 있다
t("범례 바에 속도 버튼", /data-rate/.test(hlLegend()) && /속도/.test(hlLegend()));

// 드래그 팝업의 발음도 같은 속도를 따른다
localStorage.setItem("arRate", "0.6");
sel("بَيْتٌ كَبِيرٌ");
uttered = null;
pop().onclick({ stopPropagation() {}, target: { closest: () => null } });
t("드래그 발음도 속도 반영", uttered && Math.abs(uttered.rate - 0.85 * 0.6) < 1e-9, uttered && String(uttered.rate));
localStorage.setItem("arRate", "1");


// ── 화면에 떠 있는 속도 버튼
const fab = () => document.getElementById("rateFab");
localStorage.setItem("arRate", "1");

currentView = "lesson"; syncRateFab();
t("교재 복습에서 떠 있음", fab() && fab().style.display === "block", fab() && fab().style.display);
t("떠 있는 버튼도 속도 라벨", /속도/.test(fab().textContent), fab().textContent);
t("보통일 땐 강조 없음", fab().className === "", fab().className);

fab().onclick();
t("눌러서 느려짐", getRate() === 0.85, String(getRate()));
t("느릴 땐 강조 표시", fab().className === "slow", fab().className);
t("라벨도 따라 바뀜", /0\.85배/.test(fab().textContent), fab().textContent);

currentView = "home"; syncRateFab();
t("홈에서는 안 뜸", fab().style.display === "none", fab().style.display);
currentView = "drive"; syncRateFab();
t("운전 모드에서는 안 뜸 (자체 속도 있음)", fab().style.display === "none", fab().style.display);
currentView = "phrases"; syncRateFab();
t("회화에서도 뜸", fab().style.display === "block", fab().style.display);
t("화면을 옮겨도 설정은 유지", getRate() === 0.85 && fab().className === "slow", String(getRate()));
localStorage.setItem("arRate", "1");


// ── 형태별 보기 / 변경 내역 / 복수형 퀴즈
t("복수형 47개 전부 plPat 있음", VOCAB.filter(w=>w.pl).every(w=>w.plPat), String(VOCAB.filter(w=>w.pl&&!w.plPat).map(w=>w.id)));
const pats=new Set(VOCAB.filter(w=>w.pl).map(w=>w.plPat));
t("모든 plPat 이 화면 순서에 들어있음", [...pats].every(p=>PL_PAT_ORDER.includes(p)), [...pats].filter(p=>!PL_PAT_ORDER.includes(p)).join(","));
t("모든 plPat 에 설명 있음", [...pats].every(p=>PL_PAT_NOTE[p]), [...pats].filter(p=>!PL_PAT_NOTE[p]).join(","));

currentView="forms"; views.forms();
const fh=ELS["#main"].innerHTML;
t("형태별 보기: 단어 수 표시", new RegExp(VOCAB.filter(w=>w.pl).length+"개").test(fh), String(VOCAB.filter(w=>w.pl).length));
t("형태별 보기: مَفَاعِلُ 묶음 나옴", fh.indexOf("مَفَاعِلُ")>=0);
t("형태별 보기: 학교→학교들 한 줄", /مَدَارِسُ/.test(fh));
t("형태별 보기: 줄마다 복수형 녹음 재생", /sayAr\('madrasa_pl'/.test(fh));
t("형태별 보기: 퀴즈 버튼", /startQuiz\('pl'\)/.test(fh));

// 변경 내역
localStorage.removeItem("seenVer");
ELS.verBtn=mkEl("button"); ELS.verNum=mkEl("span"); ELS["#main"]=mkEl("div");
syncVerBadge();
t("처음엔 새 버전 표시", ELS.verBtn.className==="new", ELS.verBtn.className);
t("버전 숫자 표시", ELS.verNum.textContent===VERSION, ELS.verNum.textContent);
currentView="whatsnew"; views.whatsnew();
const ch=ELS["#main"].innerHTML;
t("변경 내역: 최신 항목에 NEW", /cl-new/.test(ch));
t("변경 내역: 항목 5개 전부", (ch.match(/cl-head/g)||[]).length===CHANGELOG.length, String((ch.match(/cl-head/g)||[]).length));
syncVerBadge();
t("보고 나면 점이 사라짐", ELS.verBtn.className==="", ELS.verBtn.className);
t("본 버전이 저장됨", localStorage.getItem("seenVer")===VERSION);

// 복수형 퀴즈
startQuiz("pl");
t("복수형 퀴즈 12문제", quizState.items.length===12, String(quizState.items.length));
t("복수형 퀴즈는 복수형 있는 단어만", quizState.items.every(w=>w.pl));
renderQuiz();
const qh=ELS["#main"].innerHTML;
t("복수형 퀴즈: 보기 4개", (qh.match(/class="choice"/g)||[]).length>=4, String((qh.match(/class="choice"/g)||[]).length));


// ── 제3과
const L3=LESSONS.find(l=>l.id==="L3");
t("제3과 있음", !!L3);
t("제3과 절 수", L3.sections.length===11, String(L3.sections.length));
t("절이 참조하는 단어가 전부 단어장에 있음",
  L3.sections.flatMap(s=>s.words||[]).every(w=>VOCAB.some(v=>v.id===w)),
  L3.sections.flatMap(s=>s.words||[]).filter(w=>!VOCAB.some(v=>v.id===w)).join(","));
t("절이 선언한 sec 마다 예문이 있음",
  L3.sections.filter(s=>s.sec).every(s=>EXAMPLES.some(e=>e.sec===s.sec)),
  L3.sections.filter(s=>s.sec&&!EXAMPLES.some(e=>e.sec===s.sec)).map(s=>s.id).join(","));
t("제3과 예문 109개", EXAMPLES.filter(e=>e.sec&&e.sec.startsWith("L3")).length===109,
  String(EXAMPLES.filter(e=>e.sec&&e.sec.startsWith("L3")).length));
currentView="lesson"; views.lesson("L3.5");
const lh=ELS["#main"].innerHTML;
t("연결형 절이 열림", /연결형/.test(lh));
t("연결형 규칙에 탄윈 설명", /탄윈/.test(lh));
t("연결형 예시 بَيْتُ الرَّجُلِ", lh.indexOf("بَيْتُ الرَّجُلِ")>=0);
views.lesson("L3.7");
t("특정화 절에 비한정 예시", ELS["#main"].innerHTML.indexOf("حِذَاءُ طِفْلٍ")>=0);
startQuiz("sent2ko","L3.6");
t("연결형 절별 퀴즈", quizState.items.every(e=>e.sec==="L3.6"), String(quizState.items.length));
// 새 단어 무결성
const n3=VOCAB.filter(w=>w.date==="2026-09-30");
t("9/30 신규 25개", n3.length===25, String(n3.length));
t("신규 단어 전부 ar·ko·roman·pos 있음", n3.every(w=>w.ar&&w.ko&&w.roman&&w.pos),
  n3.filter(w=>!(w.ar&&w.ko&&w.roman&&w.pos)).map(w=>w.id).join(","));
t("복수형 있으면 plPat 도 있음", VOCAB.filter(w=>w.pl).every(w=>w.plPat),
  VOCAB.filter(w=>w.pl&&!w.plPat).map(w=>w.id).join(","));


// ── 교재 표
const sec1=LESSONS.find(l=>l.id==="L3").sections.find(s=>s.id==="L3.1");
const sec2=LESSONS.find(l=>l.id==="L3").sections.find(s=>s.id==="L3.2");
t("독립 인칭대명사 표 있음", !!sec1.table);
t("접미 인칭대명사 표 있음", !!sec2.table);
t("두 표의 열 구성이 같음", JSON.stringify(sec1.table.cols)===JSON.stringify(sec2.table.cols));
[sec1,sec2].forEach((sx,n)=>{
  const T=sx.table;
  t(`표${n+1}: 3행(단수·쌍수·복수)`, T.rows.length===3, String(T.rows.length));
  t(`표${n+1}: 모든 행의 칸 수가 열 수와 같음`,
    T.rows.every(r=>r.cells.length===T.cols.length),
    T.rows.map(r=>r.cells.length).join(","));
  t(`표${n+1}: 빈 칸 없음`, T.rows.every(r=>r.cells.every(c=>c&&c.trim())));
});
t("독립형 표에 هُوَ 가 첫 칸", sec1.table.rows[0].cells[0]==="هُوَ", sec1.table.rows[0].cells[0]);
t("1인칭 쌍수 자리가 نَحْنُ", sec1.table.rows[1].cells[4]==="نَحْنُ", sec1.table.rows[1].cells[4]);
t("접미형 3인칭 쌍수가 양쪽 같음", sec2.table.rows[1].cells[0]===sec2.table.rows[1].cells[1]);

currentView="lesson"; views.lesson("L3.1");
const th=ELS["#main"].innerHTML;
t("표가 화면에 그려짐", /table class="gram"/.test(th));
t("표가 RTL", /dir="rtl"/.test(th));
t("표 칸을 누르면 발음", /<td onclick="sayLine\(/.test(th));
t("표에 가로 스크롤 래퍼", /tbl-wrap/.test(th));
t("열 머리글 اَلْغَائِبُ", th.indexOf("اَلْغَائِبُ")>=0);
t("행 머리글 اَلْمُثَنَّى", th.indexOf("اَلْمُثَنَّى")>=0);

// 비사실 연결형
views.lesson("L3.8");
const nh=ELS["#main"].innerHTML;
t("비사실 연결형 절 열림", /비사실 연결형/.test(nh));
t("حَسَنُ الْوَجْهِ 예시", nh.indexOf("حَسَنُ الْوَجْهِ")>=0);
t("수식/술어 대비 예시", nh.indexOf("اَلْوَلَدُ الْحَسَنُ الْوَجْهِ")>=0 && nh.indexOf("اَلْوَلَدُ حَسَنُ الْوَجْهِ")>=0);
t("유제7 10문장", EXAMPLES.filter(e=>e.sec==="L3.8").length===10, String(EXAMPLES.filter(e=>e.sec==="L3.8").length));
t("제3과 11절", LESSONS.find(l=>l.id==="L3").sections.length===11);


// ── 업데이트 팝업
const popOpen=()=>ELS.clBack.classList.contains("on");

localStorage.removeItem("seenVer"); localStorage.removeItem("clSnooze");
maybeShowWhatsNew();
t("새 버전이면 들어올 때 뜬다", popOpen());
t("팝업에 최신 항목 제목", ELS.clModal.innerHTML.indexOf(CHANGELOG[0].title)>=0);
t("팝업에 버전·날짜", new RegExp("v"+CHANGELOG[0].v).test(ELS.clModal.innerHTML));
t("항목 전부 들어감", CHANGELOG[0].items.every(i=>ELS.clModal.innerHTML.indexOf(i)>=0));
t("버튼 두 개", /m-snooze/.test(ELS.clModal.innerHTML) && /m-ok/.test(ELS.clModal.innerHTML));
t("지난 내역 링크", /go\('whatsnew'\)/.test(ELS.clModal.innerHTML));

// 오늘은 그만 보기
snoozeWhatsNew();
t("그만 보기 → 닫힘", !popOpen());
t("그만 보기 → 날짜 저장", localStorage.getItem("clSnooze")===new Date().toISOString().slice(0,10));
maybeShowWhatsNew();
t("같은 날 다시 들어오면 안 뜸", !popOpen());
t("그만 보기는 '확인'이 아니다 (배지는 그대로 새 버전)", seenVer()!==VERSION, seenVer());
localStorage.setItem("clSnooze","2000-01-01");
maybeShowWhatsNew();
t("날짜가 바뀌면 다시 뜸", popOpen());

// 확인했어요
readWhatsNew();
t("확인 → 닫힘", !popOpen());
t("확인 → 버전 저장", seenVer()===VERSION);
localStorage.removeItem("clSnooze");
maybeShowWhatsNew();
t("확인한 뒤엔 안 뜸", !popOpen());

// 닫기만 하면 다음에 또 뜬다
localStorage.removeItem("seenVer");
maybeShowWhatsNew(); t("미확인이면 다시 뜸", popOpen());
closeWhatsNew();
t("그냥 닫으면 상태 안 바뀜", !popOpen() && seenVer()!==VERSION);
maybeShowWhatsNew(); t("그냥 닫았으면 다음에 또 뜸", popOpen());
closeWhatsNew(); localStorage.setItem("seenVer",VERSION);


// ── 어근별 보기
const withRoot=VOCAB.filter(w=>w.root);
t("어근 233개 단어에 붙음", withRoot.length===233, String(withRoot.length));
t("어근 있으면 뜻풀이도 있음", withRoot.every(w=>w.rootKo), withRoot.filter(w=>!w.rootKo).map(w=>w.id).join(","));
t("어근은 자음 사이 공백 형식", withRoot.every(w=>/^[\u0600-\u06FF]( [\u0600-\u06FF]){2,3}$/.test(w.root)),
  withRoot.filter(w=>!/^[\u0600-\u06FF]( [\u0600-\u06FF]){2,3}$/.test(w.root)).map(w=>w.id+":"+w.root).join(","));
t("같은 어근은 뜻풀이도 같음",
  (()=>{const m={};return withRoot.every(w=>{if(m[w.root]&&m[w.root]!==w.rootKo)return false;m[w.root]=w.rootKo;return true;})})());
t("대명사·전치사에는 어근 없음",
  VOCAB.filter(w=>["대명사","전치사","의문사","답변","지시어"].includes(w.pos)).every(w=>!w.root));

const G=rootGroups();
t("어근 묶음이 큰 것부터", G[0].words.length>=G[G.length-1].words.length);
t("ك ت ب 에 6개", G.find(g=>g.root==="ك ت ب").words.length===6, String(G.find(g=>g.root==="ك ت ب").words.length));

currentView="roots"; localStorage.setItem("rootFilter","shared"); rootFilter="shared"; views.roots();
const rh=ELS["#main"].innerHTML;
t("어근 화면: 설명 문구", /어근/.test(rh));
t("어근 화면: ك ت ب 묶음", rh.indexOf("ك ت ب")>=0);
t("어근 화면: 도서관이 같이 나옴", /도서관/.test(rh));
t("어근 화면: 줄을 누르면 발음", /sayAr\('kitaab'/.test(rh));
t("어근 화면: 복수형도 같이", /مَكَاتِبُ/.test(rh));
t("같은 어근끼리 필터는 1개짜리 제외", !/>1개</.test(rh));

setRootFilter("all"); const rAll=ELS["#main"].innerHTML;
t("전체 필터는 1개짜리도 포함", /1개/.test(rAll));
t("필터가 저장됨", localStorage.getItem("rootFilter")==="all");

views.roots("ك ت ب");
const one=ELS["#main"].innerHTML;
t("어근 하나만 보기", (one.match(/cl-head/g)||[]).length===1, String((one.match(/cl-head/g)||[]).length));
t("어근 하나만 보기에 돌아가기 버튼", /go\('roots'\)/.test(one));

// 카드 뒷면·단어장의 어근 칩
deck=[VOCAB.find(w=>w.id==="kitaab")]; deckIdx=0; flipped=true;
ELS.cardBack=mkEl("div"); renderCard();
t("카드 뒷면에 어근 칩", /root-chip/.test(ELS["#main"].innerHTML));
t("어근 칩을 누르면 어근 화면", /go\('roots','ك ت ب'\)/.test(ELS["#main"].innerHTML));
setRootFilter("shared");


// ── 2.3~2.5
["L3.9","L3.10","L3.11"].forEach(id=>{
  const sx=LESSONS.find(l=>l.id==="L3").sections.find(s=>s.id===id);
  t(id+" 있음", !!sx);
  t(id+" 예문 10개", EXAMPLES.filter(e=>e.sec===id).length===10, String(EXAMPLES.filter(e=>e.sec===id).length));
});
currentView="lesson"; views.lesson("L3.9");
const h9=ELS["#main"].innerHTML;
t("2.3: 격만 다른 두 문장이 같이 나옴",
  h9.indexOf("بَيْتُ الْوَزِيرِ الْجَدِيدِ")>=0 && h9.indexOf("بَيْتُ الْوَزِيرِ الْجَدِيدُ")>=0);
views.lesson("L3.10");
const h10=ELS["#main"].innerHTML;
t("2.4: 여섯 용법 설명", /소유/.test(h10) && /재료/.test(h10) && /합성 형용사/.test(h10));
t("2.4 예문에 용법 표시", EXAMPLES.filter(e=>e.sec==="L3.10").every(e=>/\[.+\]/.test(e.ko)));
views.lesson("L3.11");
const h11=ELS["#main"].innerHTML;
t("2.5: ن 탈락 설명", /ن/.test(h11) && /떨어진다/.test(h11));
t("2.5: يَدَا الْوَلَدِ 예시", h11.indexOf("يَدَا الْوَلَدِ")>=0);
// 새 단어
const n10=VOCAB.filter(w=>w.date==="2026-10-09");
t("10/9 신규 40개", n10.length===40, String(n10.length));
t("신규 전부 어근 있음", n10.every(w=>w.root), n10.filter(w=>!w.root).map(w=>w.id).join(","));
t("كِتَابَةٌ 가 ك ت ب 에 합류", VOCAB.find(w=>w.id==="kitaaba").root==="ك ت ب");


console.log("PASS:"); ok.forEach(x => console.log("  \u2713 " + x));
if (bad.length) { console.log("\nFAIL:"); bad.forEach(x => console.log("  \u2717 " + x)); process.exit(1); }
console.log(`\n${ok.length}/${ok.length} \ud1b5\uacfc`);
