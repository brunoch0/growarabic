// GrowArabic — photo OCR word extraction (Claude vision)
// Auth: simple app token header (public personal app, no user accounts).
import Anthropic from "npm:@anthropic-ai/sdk";

const APP_TOKEN = "growarabic"; // matches x-app-token sent by the app; blocks random scanners

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-app-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["words"],
  properties: {
    words: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["ar", "roman", "ko", "en", "pos", "gender", "note"],
        properties: {
          ar: { type: "string", description: "Arabic with FULL harakat including tanwin, e.g. جَامِعَةٌ" },
          roman: { type: "string", description: "Latin transliteration reading the full tanwin, e.g. jaami'atun" },
          ko: { type: "string", description: "Korean meaning" },
          en: { type: "string", description: "English meaning" },
          pos: { type: "string", enum: ["명사", "형용사", "동사", "부사", "전치사", "구", "표현"] },
          gender: { type: "string", enum: ["m", "f", ""] },
          note: { type: "string", description: "usage/context note from the photo, e.g. (남자에게); empty if none" },
        },
      },
    },
  },
};

const PROMPT = `이 사진에 보이는 아랍어 단어·표현을 전부 추출하라. 아랍어 기초 학습자의 단어장에 들어갈 데이터다.
규칙:
1. ar: 모음부호(하라카트)를 전부 표기한다. 명사·형용사는 탄윈(ـٌ 등)까지 포함한다. 사진에 하라카트가 없으면 표준 표기를 붙여라. 예: جَامِعَةٌ, سَيَّارَةٌ
2. roman: 탄윈까지 전부 읽는 라틴 발음 표기. 예: jaami'atun, sayyaaratun. 와크프(끝음 생략) 금지.
3. ko: 자연스러운 한국어 뜻. en: 영어 뜻.
4. pos: 품사. gender: 명사·형용사의 문법 성별(m/f), 모르거나 해당 없으면 빈 문자열.
5. note: 사진에 상황·용법 메모가 있으면 한국어로 짧게, 예: (남자에게). 없으면 빈 문자열.
6. 손글씨·인쇄물·화면 캡처 모두 인식하라. 같은 단어가 여러 번 나오면 한 번만.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json" } });
  try {
    if (req.headers.get("x-app-token") !== APP_TOKEN) return json({ error: "unauthorized" }, 401);
    const { image, media_type } = await req.json();
    if (!image) return json({ error: "image (base64) required" }, 400);

    const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      output_config: { format: { type: "json_schema", schema: SCHEMA } },
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: media_type || "image/jpeg", data: image } },
          { type: "text", text: PROMPT },
        ],
      }],
    } as never);

    if (response.stop_reason === "refusal") return json({ error: "모델이 이 이미지 처리를 거부했습니다" }, 422);
    const text = response.content.find((b: { type: string }) => b.type === "text");
    if (!text) return json({ error: "empty model response" }, 502);
    return new Response((text as { text: string }).text, { headers: { ...CORS, "content-type": "application/json" } });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
