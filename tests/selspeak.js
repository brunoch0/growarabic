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
  tagName: tag, id: "", className: "", textContent: "", innerHTML: "",
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


console.log("PASS:"); ok.forEach(x => console.log("  \u2713 " + x));
if (bad.length) { console.log("\nFAIL:"); bad.forEach(x => console.log("  \u2717 " + x)); process.exit(1); }
console.log(`\n${ok.length}/${ok.length} \ud1b5\uacfc`);
