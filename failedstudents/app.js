"use strict";

const WORKER_READY = (async () => {
  const candidates = [
    "pdf.worker.min.js",
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js",
  ];
  for (const src of candidates) {
    try {
      const blob = await (await fetch(src)).blob();
      if (blob.size < 500000) continue;
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
      return;
    } catch (e) { /* try next */ }
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = candidates[candidates.length - 1];
})();

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const DIGIT_MAP = {};
[...AR_DIGITS].forEach((ch, i) => DIGIT_MAP[ch] = String(i));
[...FA_DIGITS].forEach((ch, i) => DIGIT_MAP[ch] = String(i));
const CHAR_MAP = {
  "ي": "ی", "ى": "ی", "ك": "ک",
  "ۀ": "ه", "ة": "ه", "أ": "ا", "إ": "ا", "آ": "آ",
  "\u064B": "", "\u064C": "", "\u064E": "", "\u064F": "",
  "\u0650": "", "\u0651": "", "\u0652": "", "\u0653": "",
  "\u0654": "", "\u0655": "", "\u200D": "",
};
const NORM_MAP = Object.assign({}, CHAR_MAP, DIGIT_MAP);

function translateChars(s, map) {
  let out = "";
  for (const ch of s) out += (map[ch] !== undefined ? map[ch] : ch);
  return out;
}

function normalize(text) {
  if (!text) return "";
  let s = text.normalize("NFKC");
  s = translateChars(s, NORM_MAP);
  return s.replace(/\s+/g, " ").trim();
}

function faDigitsToAscii(text) {
  if (!text) return "";
  return translateChars(text, DIGIT_MAP);
}

function toFloat(raw) {
  if (raw === null || raw === undefined) return null;
  let s = normalize(raw).replace(/\//g, ".").replace(/٫/g, ".");
  s = s.replace(/[^0-9.]/g, "");
  if (!s || s === ".") return null;
  const v = parseFloat(s);
  if (isNaN(v)) return null;
  return Math.round(v * 100) / 100;
}

const X_RADIF = [574, 600];
const X_CODE = [546, 574];
const X_NAME = [444, 546];
const X_VAHED = [408, 444];
const X_GHABOULI = [380, 408];
const X_TATBIGH = [346, 380];
const X_NAHAYI = [310, 346];
const ROW_TOL = 4.6;

const KOLI_YEAR_ZONES = [[262, 294], [296, 328], [330, 352]];

function pickKoliNahayi(rw) {
  const scoreRe = /^[\u06F0-\u06F90-9]{1,2}(?:\/[\u06F0-\u06F90-9]{1,2})?$/;
  let fz = -1;
  outer:
  for (const w of rw) {
    if (w.t !== "مردود") continue;
    for (let gi = 0; gi < KOLI_YEAR_ZONES.length; gi++) {
      const z = KOLI_YEAR_ZONES[gi];
      if (w.x >= z[0] && w.x < z[1]) { fz = gi; break outer; }
    }
  }
  const grab = gi => {
    const z = KOLI_YEAR_ZONES[gi];
    const c = rw.filter(w => w.x >= z[0] && w.x < z[1] && scoreRe.test(w.t));
    return c.length ? c[0].t : "";
  };
  if (fz >= 0) { const t = grab(fz); if (t) return t; }
  for (let gi = 0; gi < KOLI_YEAR_ZONES.length; gi++) { const t = grab(gi); if (t) return t; }
  return "";
}

const PX_RADIF = [566, 600];
const PX_CODE = [540, 566];
const PX_VAHED = [338, 362];
const PX_NAHAYI = [306, 334];
const PX_NATIJE = [70, 112];
const PX_MOLAHEZA = [10, 76];

const RE_CODE = /^\d{4,6}$/;

const PAYE_BY_PREFIX = { "1": "دهم", "2": "یازدهم", "3": "دوازدهم" };
const PAYE_BY_CODE = { "10": "دهم", "11": "یازدهم", "12": "دوازدهم" };

function cleanName(name) {
  let s = normalize(name);
  s = s.split("****").join("").split("----").join("");
  s = s.replace(/\s*\d{4,6}\s*$/, "");
  s = s.replace(/^\s*[123]\s+/, "");
  s = s.replace(/^\s*[123](?=[\u0600-\u06FF(])/, "");
  s = s.replace(/^\s*\d{2,6}\s+(?=[\u0600-\u06FF])/, "");
  s = s.replace(/\(/g, " (").replace(/\)/g, ") ");
  return s.replace(/\s+/g, " ").trim();
}

function payeOf(code, prefixDigit) {
  const p = PAYE_BY_CODE[String(code).slice(0, 2)];
  if (p) return p;
  if (prefixDigit) return PAYE_BY_PREFIX[prefixDigit] || "";
  return "";
}

function tenDigitNums(ln) {
  const out = [];
  const re = /(?<![\p{L}\p{N}_])\d{10}(?![\p{L}\p{N}_])/gu;
  let m;
  while ((m = re.exec(ln))) out.push(m[0]);
  return out;
}

function extractHeader(textNorm) {
  const h = { first_name: "", family_name: "", father_name: "",
              national_id: "", student_code: "", reshte: "" };
  const lines = textNorm.split("\n").map(l => l.trim()).filter(Boolean);

  const JUNK = new Set(["بسمه", "تعالی", "استان", "جمهوری", "اسلامی", "ایران",
                        "وزارت", "آموزش", "پرورش", "منطقه", "ه", "و"]);

  function val(left) {
    const words = left.split(/\s+/).filter(Boolean);
    while (words.length && (JUNK.has(words[0]) || /^[\d/%:-]+$/.test(words[0])))
      words.shift();
    return words.join(" ");
  }

  const NOISE = ["نام خانوادگی", "جمهوری اسلامی ایران", "بسمه تعالی",
                 "وزارت آموزش و پرورش", "آموزش و پرورش", "ریز نمرات",
                 "دوره متوسطه دوم", "متوسطه دوم", "منطقه", "محل صدور",
                 "محل تولد", "متولد", "ش شناسنامه", "شناسنامه", "کد ملی",
                 "کد دانش آموز", "سال تحصیلی", "دوره تابستان", "تابستان",
                 "نوع مدرسه", "شاخه", "استان", "آموزشگاه"];

  function deepClean(s) {
    s = normalize(s);
    for (const t of NOISE) s = s.split(t).join(" ");
    const toks = s.split(/\s+/).filter(Boolean);
    const merged = [];
    for (const tok of toks) {
      const prevTok = merged[merged.length - 1];
      if (prevTok &&
          ((/[\u0600-\u06FF]$/.test(prevTok) && /^\d/.test(tok)) ||
           (/\d$/.test(prevTok) && /^[\u0600-\u06FF]/.test(tok))))
        merged[merged.length - 1] = prevTok + tok;
      else
        merged.push(tok);
    }
    return merged.filter(w => w && !/\d/.test(w) && !JUNK.has(w)).join(" ");
  }

  function find(labelRe) {
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(
        new RegExp("([^:\\n]{1,60}?)\\s*:\\s*(?:" + labelRe + ")\\s*(?![\\u0600-\\u06FF])"));
      if (m) return [i, m[1]];
    }
    return [null, null];
  }

  let v = find("نام\\s+خانوادگی")[1];
  if (v) h.family_name = val(v);
  v = find("نام\\s+پدر")[1];
  if (v) h.father_name = deepClean(v);
  v = find("نام(?!\\s+(?:خانوادگی|پدر|مدرسه|درس))")[1];
  if (v) h.first_name = val(v);

  for (const ln of lines) {
    const m = ln.match(/(\d{6,12})\s*:\s*کد\s+ملی/);
    if (m) { h.national_id = m[1]; break; }
  }
  if (!h.national_id) {
    (function () {
      for (const ln of lines) {
        const nums = tenDigitNums(ln);
        if (nums.length >= 2 && ln.includes("ملی")) { h.national_id = nums[0]; return; }
      }
      for (const ln of lines) {
        const nums = tenDigitNums(ln);
        if (nums.length) { h.national_id = nums[0]; return; }
      }
    })();
  }

  for (const ln of lines) {
    const m = ln.match(/کد\s+دانش\s+آموز\s*:?\s*(\d{5,12})/);
    if (m) { h.student_code = m[1]; break; }
  }

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    if (/^:?\s*رشته\s*$/.test(ln) && i > 0) {
      h.reshte = deepClean(lines[i - 1].replace(/\s*\d{3,6}\s*$/, ""));
      break;
    }
    let m = ln.match(/([\u0600-\u06FF][\u0600-\u06FF\s]{1,40}?)\s*\d{3,6}\s*:\s*رشته/);
    if (!m)
      m = ln.match(/([\u0600-\u06FF][\u0600-\u06FF\s]{1,40}?)[\s\u200c]*(?:\d{3,6}\s*)?:\s*رشته/);
    if (m) { h.reshte = deepClean(m[1]); break; }
  }
  return h;
}

function zoneJoin(rowWords, zone) {
  const xs = rowWords.filter(w => w.x >= zone[0] && w.x < zone[1]);
  if (!xs.length) return "";
  xs.sort((a, b) => a.x - b.x);
  return xs.map(t => t.t).join("").trim();
}

function nameFromSpans(spans, yCenter) {
  let best = "", bestLen = 0;
  for (const sp of spans) {
    if (Math.abs(sp.y - yCenter) > ROW_TOL) continue;
    if (sp.x >= X_NAME[0] - 14 && sp.x < X_NAME[1]) {
      const t = sp.txt.trim();
      const nl = normalize(t).length;
      if (nl > bestLen) { best = t; bestLen = nl; }
    }
  }
  return best;
}

const HDR_STOP_LABELS = new Set(["استان", "منطقه", "آموزشگاه", "شاخه", "رشته", "دوره",
  "سال تحصیلی", "نوع مدرسه", "متولد", "محل صدور", "محل تولد", "پایه",
  "نام", "نام خانوادگی", "نام پدر", "ش شناسنامه", "شناسنامه",
  "کد ملی", "کد دانش آموز", "کد دانش آموزی", "جنسیت", "ردیف"]);

function extractSpanHeader(linesArr) {
  const CAPTURE = ["استان", "منطقه", "آموزشگاه", "شاخه", "رشته", "دوره",
                   "سال تحصیلی", "نوع مدرسه", "متولد", "محل صدور", "محل تولد", "پایه"];
  const out = {};
  const yearCands = [];
  const cleanTok = t => normalize(t).replace(/:/g, " ").replace(/\s+/g, " ").trim();
  const isStop = n => {
    if (HDR_STOP_LABELS.has(n)) return true;
    for (const l of HDR_STOP_LABELS) if (n.startsWith(l + " ")) return true;
    return false;
  };
  for (const line of linesArr) {
    const toks = line.map(p => ({ x: p.x, n: cleanTok(p.s !== undefined ? p.s : p.str) }))
                     .filter(t => t.n && t.n !== ":");
    if (!toks.length) continue;
    const joined = toks.map(t => t.n).join("");
    if (toks.some(t => t.n === "ردیف") ||
        joined.includes("نام درس") || joined.includes("کد درس")) break;
    toks.sort((a, b) => b.x - a.x);
    for (let i = 0; i < toks.length; i++) {
      const n = toks[i].n;
      if (/^[\u06F0-\u06F90-9]{3,4}-?$/.test(n) && toks[i].x >= 495 && toks[i].x <= 570)
        yearCands.push(n);
      for (const lbl of CAPTURE) {
        if (out[lbl]) continue;
        if (n === lbl || n.startsWith(lbl + " ")) {
          const parts = [];
          if (n.length > lbl.length) parts.push(n.slice(lbl.length).trim());
          for (let j = i + 1; j < toks.length; j++) {
            if (isStop(toks[j].n)) break;
            parts.push(toks[j].n);
          }
          out[lbl] = parts.join(" ");
        }
      }
    }
  }
  const map = { "استان": "province", "منطقه": "district", "آموزشگاه": "school",
                "شاخه": "branch", "رشته": "reshte", "دوره": "period",
                "سال تحصیلی": "edu_year", "نوع مدرسه": "school_type",
                "متولد": "birth_date", "محل صدور": "issue_place", "محل تولد": "birth_place",
                "پایه": "paye_name" };
  const rec = {};
  for (const [fa, en] of Object.entries(map))
    if (out[fa]) rec[en] = faDigitsToAscii(normalize(out[fa])).replace(/\s+/g, " ").trim();
  const stripCode = v => v.replace(/^\d{1,6}\s+/, "").trim();
  if (rec.school) {
    const m = rec.school.match(/^(\d{4,10})\s+(.+)$/);
    if (m) { rec.school_code = m[1]; rec.school = m[2]; }
  }
  if (rec.reshte) rec.reshte = stripCode(rec.reshte);
  if (rec.province) rec.province = stripCode(rec.province);
  if (rec.district) rec.district = stripCode(rec.district);
  const nums = [];
  const grab = t => { const m = String(t).match(/\d{2,4}/g); if (m) nums.push(...m.map(Number)); };
  if (rec.edu_year) grab(rec.edu_year);
  yearCands.forEach(grab);
  if (nums.length) {
    let uniq = [...new Set(nums)].sort((a, b) => a - b);
    if (uniq.length > 2) uniq = uniq.slice(-2);
    rec.edu_year = uniq
      .map(n => { let s = String(n); if (s.length === 3) s = "1" + s; if (s.length === 2) s = "14" + s; return s; })
      .join("-");
  }
  for (const k of Object.keys(rec)) if (!rec[k]) delete rec[k];
  return rec;
}

function parsePage(tc, sourceFile, pageIndex, isPish) {
  const allItems = tc.items.filter(it => typeof it.str === "string" && it.str.trim());
  if (!allItems.length) return [];

  function tryParse(items) {
  const pts = items.map(it => ({
    x: it.transform[4], y: it.transform[5], str: it.str,
    w: it.width || 0, fs: Math.abs(it.transform[3]) || Math.abs(it.transform[0]) || 10,
  }));
  pts.sort((a, b) => (b.y - a.y) || (a.x - b.x));
  const linesArr = [];
  let curY = null, curLine = null;
  for (const p of pts) {
    if (curLine === null || Math.abs(p.y - curY) > 2.5) {
      curLine = [];
      linesArr.push(curLine);
      curY = p.y;
    }
    curLine.push(p);
  }
  const rawText = linesArr
    .map(l => {
      l.sort((a, b) => a.x - b.x);
      const parts = [];
      l.forEach(p => {
        const orig = p.str.trim();
        if (!orig) return;
        let s = orig, colon = false;
        const nrm = normalize(orig);
        if (orig.endsWith(":") && /[\u0600-\u06FF]/.test(nrm) && !/\d/.test(nrm)) {
          s = orig.slice(0, -1).trim();
          colon = true;
        }
        if (colon) {
          parts.push({ x: p.x, w: 0, fs: p.fs, s: ":" });
          if (s) parts.push({ x: p.x, w: p.w, fs: p.fs, s: s });
        } else {
          parts.push({ x: p.x, w: p.w, fs: p.fs, s: s });
        }
      });
      let out = "", prevEnd = null, prevFs = 10;
      for (const q of parts) {
        const sep = prevEnd !== null && (q.x - prevEnd) > 0.15 * prevFs ? " " : "";
        out += sep + q.s;
        prevEnd = q.x + q.w;
        prevFs = q.fs;
      }
      return out;
    })
    .join("\n");
  const textNorm = normalize(rawText);
  const header = Object.assign(extractHeader(textNorm), extractSpanHeader(linesArr));

  if (!(header.family_name || header.national_id)) return null;

  const words = [];
  const spans = [];
  const reCodeTok = /^\d{4,6}$/;
  for (const it of items) {
    const x0 = it.transform[4], y = it.transform[5], w = it.width || 0;
    spans.push({ x: x0, y: y, txt: it.str });
    const s = it.str, total = Math.max(s.length, 1);
    const re = /\S+/g;
    let m;
    while ((m = re.exec(s))) {
      const nw = normalize(m[0]);
      if (!nw) continue;
      words.push({ x: x0 + w * (m.index / total), y: y, t: nw });
      const rest = s.slice(m.index + m[0].length).replace(/\s+/g, "");
      if (reCodeTok.test(nw) && (m.index > 0 || rest)) {
        const xe = (x0 + w) - w * ((m.index + m[0].length) / total);
        words.push({ x: xe, y: y, t: nw });
      }
    }
  }

  const codeWords = words
    .filter(w => w.x >= X_CODE[0] && w.x < X_CODE[1] && RE_CODE.test(w.t))
    .map(w => ({ y: w.y, code: w.t }));
  codeWords.sort((a, b) => a.y - b.y);

  const rowPts = [];
  let lastY = null;
  for (const cw of codeWords) {
    if (lastY !== null && Math.abs(cw.y - lastY) <= ROW_TOL) continue;
    lastY = cw.y;
    rowPts.push(cw);
  }

  const courses = [];
  const payeHdr = normalize(header.paye_name || "");
  for (const pt of rowPts) {
    const yCenter = pt.y, code = pt.code;
    const rw = words.filter(w => Math.abs(w.y - yCenter) <= ROW_TOL);
    let radifW, vahedRaw, ghabooliRaw, tatbighRaw, nahayiRaw, mardod;
    if (isPish) {
      radifW = rw.filter(w => w.x >= PX_RADIF[0]);
      vahedRaw = zoneJoin(rw, PX_VAHED);
      ghabooliRaw = "";
      tatbighRaw = "";
      nahayiRaw = zoneJoin(rw, PX_NAHAYI);
      mardod = normalize(zoneJoin(rw, PX_NATIJE)).includes("مردود");
    } else {
      radifW = rw.filter(w => w.x >= X_RADIF[0]);
      vahedRaw = zoneJoin(rw, X_VAHED);
      ghabooliRaw = zoneJoin(rw, X_GHABOULI);
      tatbighRaw = zoneJoin(rw, X_TATBIGH);
      nahayiRaw = pickKoliNahayi(rw);
      mardod = rw.some(w => w.t === "مردود");
    }

    const nameZoneWs = rw.filter(w => w.x >= X_NAME[0] && w.x < X_NAME[1])
                         .sort((a, b) => a.x - b.x);
    let prefixDigit = null;
    if (!isPish && nameZoneWs.length) {
      const lm = nameZoneWs[0];
      if ((lm.t === "1" || lm.t === "2" || lm.t === "3") && lm.x < X_NAME[0] + 26)
        prefixDigit = lm.t;
    }

    let name = cleanName(nameFromSpans(spans, yCenter));
    if (!name)
      name = cleanName(nameZoneWs.slice().sort((a, b) => b.x - a.x)
                              .map(t => t.t).join(" "));
    if (!name) continue;

    const nahayi = toFloat(nahayiRaw) !== null ? toFloat(nahayiRaw) : toFloat(ghabooliRaw);

    let status = "";
    if (mardod) status = "مردود";
    else if (nahayi !== null || toFloat(tatbighRaw) !== null) status = "قبول";

    courses.push({
      radif: radifW.length ? radifW[0].t : "",
      code: code,
      name: name,
      paye: isPish ? (payeHdr || payeOf(code, null)) : payeOf(code, prefixDigit),
      vahed: toFloat(vahedRaw),
      vahed_raw: faDigitsToAscii(vahedRaw),
      nahayi: nahayi,
      nahayi_raw: faDigitsToAscii(nahayiRaw || ghabooliRaw),
      status: status,
      source_file: sourceFile,
      page: pageIndex + 1,
    });
  }
  return Object.assign({}, header, { courses: courses });
  }

  const ys = allItems.map(it => it.transform[5]);
  const midY = (Math.max(...ys) + Math.min(...ys)) / 2;
  const top = allItems.filter(it => it.transform[5] >= midY);
  const bot = allItems.filter(it => it.transform[5] < midY);
  const out = [];
  const a = top.length ? tryParse(top) : null;
  const b = bot.length ? tryParse(bot) : null;
  if (a) out.push(a);
  if (b) out.push(b);
  if (!out.length) { const w = tryParse(allItems); if (w) out.push(w); }
  return out;
}

async function parsePdfBuffer(data, name) {
  await WORKER_READY;
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  let fmt = "koli";
  try {
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const tc = await page.getTextContent();
      if (i === 1) {
        let probe = "";
        for (const it of tc.items) {
          if (typeof it.str === "string") {
            probe += it.str + " ";
            if (probe.length > 500) break;
          }
        }
        const np = normalize(probe).replace(/\u200C/g, " ");
        fmt = np.includes("پیش نویس") ? "pish" : "koli";
      }
      const st = parsePage(tc, name, i - 1, fmt === "pish");
      for (const rec of st) {
        rec.source_file = name;
        rec.page_index = i;
        rec.fmt = fmt;
        pages.push(rec);
      }
    }
  } finally {
    doc.destroy();
  }
  return pages;
}

function identityKey(ps) {
  const nid = ps.national_id || "";
  if (nid) return "nid\u0000" + nid;
  return ["name", ps.family_name || "", ps.first_name || "",
          ps.father_name || ""].join("\u0000");
}

const STUDENT_FIELDS = ["first_name", "family_name", "father_name",
                        "national_id", "student_code", "reshte",
                        "province", "district", "school", "school_code",
                        "branch", "period", "edu_year", "school_type",
                        "birth_date", "issue_place", "birth_place", "paye_name"];

function aggregate(pageStudents) {
  const studentsMap = new Map();
  for (const ps of pageStudents) {
    const key = identityKey(ps);
    let st = studentsMap.get(key);
    if (!st) {
      st = { first_name: "", family_name: "", father_name: "",
             national_id: "", student_code: "", reshte: "",
             coursesMap: new Map(), sources: [] };
      studentsMap.set(key, st);
    }
    for (const f of STUDENT_FIELDS)
      if (!st[f] && ps[f]) st[f] = ps[f];
    const src = (ps.source_file || "") + " صفحه " + (ps.page_index ?? "");
    if (!st.sources.includes(src)) st.sources.push(src);
    for (const c of ps.courses || []) {
      const cur = st.coursesMap.get(c.code);
      const EMPTY = v => v === null || v === undefined || v === "";
      if (cur === undefined) {
        st.coursesMap.set(c.code, Object.assign({}, c));
      } else if (cur.status === "مردود" && c.status !== "مردود") {
        const m = Object.assign({}, cur);
        for (const k of ["nahayi", "nahayi_raw", "vahed", "vahed_raw"])
          if (EMPTY(m[k]) && !EMPTY(c[k])) m[k] = c[k];
        st.coursesMap.set(c.code, m);
      } else if (cur.status !== "مردود" && c.status === "مردود") {
        const m = Object.assign({}, c);
        for (const k of ["nahayi", "nahayi_raw", "vahed", "vahed_raw"])
          if (EMPTY(m[k]) && !EMPTY(cur[k])) m[k] = cur[k];
        st.coursesMap.set(c.code, m);
      } else if (!cur.ghabooli_raw && c.ghabooli_raw) {
        st.coursesMap.set(c.code, Object.assign({}, c));
      }
    }
  }

  const cmp = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
  const out = [];
  for (const st of studentsMap.values()) {
    const clist = [...st.coursesMap.values()].sort((a, b) => cmp(a.code, b.code));
    const failed = clist.filter(c => c.status === "مردود");
    const rec = {};
    for (const f of STUDENT_FIELDS) rec[f] = st[f];
    rec.sources = st.sources;
    rec.course_count = clist.length;
    rec.failed_count = failed.length;
    rec.has_failed = failed.length > 0;
    rec.failed = failed;
    rec.courses = clist;
    out.push(rec);
  }
  out.sort((a, b) => b.failed_count - a.failed_count ||
                     cmp(a.family_name, b.family_name) ||
                     cmp(a.first_name, b.first_name));
  return out;
}

async function processPdfs(files, onProgress) {
  const allPages = [];
  const errors = [];
  let done = 0, filesKoli = 0, filesPish = 0, pagesKoli = 0, pagesPish = 0;
  for (const f of files) {
    try {
      const buf = new Uint8Array(await f.arrayBuffer());
      const pages = await parsePdfBuffer(buf, f.name);
      if (pages.length) {
        if (pages[0].fmt === "pish") { filesPish++; pagesPish += pages.length; }
        else { filesKoli++; pagesKoli += pages.length; }
      }
      allPages.push(...pages);
    } catch (e) {
      errors.push({ file: f.name, error: String(e && e.message || e) });
    }
    done++;
    if (onProgress) onProgress(done, files.length);
  }
  const students = aggregate(allPages);
  return {
    students: students,
    stats: {
      files_processed: files.length,
      pages_parsed: allPages.length,
      files_koli: filesKoli,
      files_pish: filesPish,
      pages_koli: pagesKoli,
      pages_pish: pagesPish,
      students_total: students.length,
      students_failed: students.filter(s => s.has_failed).length,
      errors: errors,
    },
  };
}

function payload(students) {
  const payes = [...new Set(students.flatMap(s => s.courses)
                    .map(c => c.paye).filter(Boolean))].sort();
  const courses = [...new Set(students.flatMap(s => s.courses)
                      .map(c => c.name).filter(Boolean))].sort();
  return { students, payes, courses };
}

/* ---------- UI ---------- */

let DATA = null;
let STATS = null;
let PROCESSING = false;
const expanded = new Set();
const selected = new Set();

const $ = (sel) => document.querySelector(sel);

function stuKey(s) {
  return s.national_id || `${s.family_name}\u0000${s.first_name}`;
}

function setLoader(on) {
  $("#loader").classList.toggle("hidden", !on);
  document.querySelectorAll("button").forEach(b => b.disabled = on);
}

function showMsg(text, ok) {
  const el = $("#msg");
  el.textContent = text || "";
  el.className = ok ? "ok" : (text ? "err" : "");
}

function renderStats() {
  if (!STATS) return;
  $("#st-files").textContent = STATS.files_processed ?? 0;
  $("#st-pages").textContent = STATS.pages_parsed ?? 0;
  $("#st-total").textContent = STATS.students_total ?? 0;
  $("#st-failed").textContent = STATS.students_failed ?? 0;
  $("#stats").classList.remove("hidden");
  $("#filters").classList.remove("hidden");
  fillFilterOptions();
}

function fillFilterOptions() {
  const payeSel = $("#f-paye"), courseSel = $("#f-course");
  const pv = payeSel.value, cv = courseSel.value;
  payeSel.innerHTML = '<option value="">همه</option>';
  courseSel.innerHTML = '<option value="">همه</option>';
  (DATA.payes || []).forEach(p => {
    const o = document.createElement("option");
    o.value = p; o.textContent = p; payeSel.appendChild(o);
  });
  (DATA.courses || []).forEach(c => {
    const o = document.createElement("option");
    o.value = c; o.textContent = c; courseSel.appendChild(o);
  });
  if ([...payeSel.options].some(o => o.value === pv)) payeSel.value = pv;
  if ([...courseSel.options].some(o => o.value === cv)) courseSel.value = cv;
}

function currentFilters() {
  return {
    only_failed: $("#f-status").value === "1",
    paye: $("#f-paye").value,
    course: $("#f-course").value,
    q: $("#f-q").value.trim(),
  };
}

function applyFilters() {
  const f = currentFilters();
  let list = DATA.students.slice();
  if (f.only_failed) list = list.filter(s => s.has_failed);
  if (f.paye)
    list = list.filter(s => s.courses.some(c => c.paye === f.paye));
  if (f.course)
    list = list.filter(s => s.courses.some(c => c.name === f.course));
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter(s =>
      [s.first_name, s.family_name, s.father_name,
       s.national_id, s.student_code]
        .join(" ").toLowerCase().includes(q));
  }
  $("#count-view").textContent =
    `نمایش ${list.length} نفر از ${DATA.students.length} دانش‌آموز`;
  return list;
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g,
    m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

function detailHtml(s, onlyFailed) {
  const list = onlyFailed ? s.failed : s.courses;
  const rows = list.map(c => `
    <tr>
      <td>${esc(c.name)}</td>
      <td class="nid" dir="ltr">${esc(c.code)}</td>
      <td>${esc(c.paye)}</td>
      <td>${esc(c.vahed_raw)}</td>
      <td class="nid" dir="ltr">${c.nahayi != null ? esc(pfa(c.nahayi)) : "—"}</td>
      <td class="${c.status === "مردود" ? "st-mardod" : "st-ghabul"}">${esc(c.status || "—")}</td>
    </tr>`).join("");
  const emptyRow = !list.length ? `
    <tr><td colspan="6" class="empty">موردی ثبت نشده است</td></tr>` : "";
  const head = onlyFailed ? "فهرست دروس مردود" : "همه دروس سه سال";
  return `
    <div class="detail-title">${head}</div>
    <div class="table-scroll">
    <table class="tbl-inner">
      <thead><tr>
        <th>نام درس</th><th>کد درس</th><th>پایه</th><th>واحد</th>
        <th>نمره نهایی</th><th>وضعیت</th>
      </tr></thead>
      <tbody>${rows}${emptyRow}</tbody>
    </table>
    </div>`;
}

function rowHtml(s, idx, onlyFailed) {
  const key = stuKey(s);
  const open = expanded.has(key);
  const shown = onlyFailed ? s.failed : s.courses;
  const badge = `<span class="badge ${s.failed_count ? "" : "zero"}">${s.failed_count}</span>`;
  return `
  <tr data-key="${esc(key)}">
    <td class="col-sel"><input type="checkbox" class="sel-stu" data-key="${esc(key)}"${selected.has(key) ? " checked" : ""}></td>
    <td>${idx + 1}</td>
    <td class="name-cell"><b>${esc(s.first_name)} ${esc(s.family_name)}</b>
      <small>پدر: ${esc(s.father_name || "—")} | رشته: ${esc(s.reshte || "—")}</small></td>
    <td class="nid" dir="ltr">${esc(s.national_id || "—")}</td>
    <td>${badge}</td>
    <td>${shown.length ? `
      <button class="secondary btn-detail" data-key="${esc(key)}">
        ${open ? "بستن" : "مشاهده"} (${shown.length})
      </button>` : "—"}</td>
    <td class="src">${(s.sources || []).join("<br>")}</td>
  </tr>
  ${open ? `<tr class="detail-row"><td colspan="7">${detailHtml(s, onlyFailed)}</td></tr>` : ""}`;
}

function render() {
  if (!DATA) return;
  const list = applyFilters();
  const onlyFailed = currentFilters().only_failed;
  const html = list.length ? `
    <div class="table-scroll">
    <table>
      <thead><tr>
        <th class="col-sel"><input type="checkbox" id="sel-all" title="انتخاب/حذف همه"></th>
        <th>#</th><th>دانش‌آموز</th><th>کد ملی</th>
        <th>تعداد مردودی</th><th>دروس</th><th>منبع</th>
      </tr></thead>
      <tbody>${list.map((s, i) => rowHtml(s, i, onlyFailed)).join("")}</tbody>
    </table>
    </div>` :
    `<div class="panel empty">موردی مطابق فیلترها یافت نشد.</div>`;
  $("#result").innerHTML = html;

  document.querySelectorAll(".btn-detail").forEach(btn => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.key;
      expanded.has(k) ? expanded.delete(k) : expanded.add(k);
      render();
    });
  });

  const selAll = $("#sel-all");
  if (selAll) {
    selAll.checked = list.length > 0 && list.every(s => selected.has(stuKey(s)));
    selAll.addEventListener("change", () => {
      list.forEach(s => {
        const k = stuKey(s);
        selAll.checked ? selected.add(k) : selected.delete(k);
      });
      render();
    });
  }
  document.querySelectorAll(".sel-stu").forEach(cb => {
    cb.addEventListener("change", () => {
      cb.checked ? selected.add(cb.dataset.key) : selected.delete(cb.dataset.key);
      if (selAll)
        selAll.checked = list.length > 0 && list.every(s => selected.has(stuKey(s)));
    });
  });
}

async function handleFiles(fileList) {
  if (PROCESSING) return;
  const pdfs = [...fileList].filter(f => f.name.toLowerCase().endsWith(".pdf"));
  if (!pdfs.length) { showMsg("فایلی ارسال نشده است. تنها فایل PDF پذیرفته می‌شود.", false); return; }
  PROCESSING = true;
  setLoader(true);
  showMsg("");
  const loaderEl = $("#loader"), loaderText = $("#loader-text").textContent;
  try {
    const result = await processPdfs(pdfs, (d, t) => {
      $("#loader-text").textContent = `در حال پردازش… فایل ${d} از ${t}`;
    });
    DATA = payload(result.students);
    STATS = result.stats;
    expanded.clear();
    selected.clear();
    renderStats();
    render();
    let guide = "";
    if (STATS.files_koli && !STATS.files_pish)
      guide = " توجه: فقط «کارنامه کلی» بارگذاری شد؛ دروس سال جاری دانش‌آموزان در فایل «پیش‌نویس کارنامه» است. آن را هم انتخاب کنید.";
    else if (STATS.files_pish && !STATS.files_koli)
      guide = " توجه: فقط «پیش‌نویس کارنامه» بارگذاری شد؛ نمرات نهایی سال‌های قبل در فایل «کارنامه کلی» است. آن را هم انتخاب کنید.";
    showMsg(`پردازش کامل شد: ${STATS.pages_koli} صفحه کارنامه کلی، ` +
            `${STATS.pages_pish} صفحه پیش‌نویس، ` +
            `${STATS.students_failed} دانش‌آموز دارای درس مردود.` +
            (STATS.errors.length ? ` (${STATS.errors.length} فایل خطا داشت)` : "") + guide, true);
  } catch (e) {
    showMsg("خطا در پردازش: " + e.message, false);
  } finally {
    $("#loader-text").textContent = loaderText;
    setLoader(false);
    PROCESSING = false;
  }
}

$("#btn-upload").addEventListener("click", () => handleFiles($("#file-input").files));
$("#folder-input").addEventListener("change", e => handleFiles(e.target.files));

["f-status", "f-paye", "f-course"].forEach(id =>
  document.getElementById(id).addEventListener("change", render));
$("#f-q").addEventListener("input", render);

function buildRows(students) {
  const rows = [["نام", "نام خانوادگی", "نام پدر", "کد ملی", "کد دانش آموز",
                 "رشته", "تعداد مردودی", "درس مردود", "کد درس", "پایه",
                 "واحد", "نمره نهایی", "وضعیت"].map(String)];
  for (const s of students) {
    const base = [s.first_name, s.family_name, s.father_name,
                  s.national_id, s.student_code, s.reshte, s.failed_count];
    if (!s.failed.length)
      rows.push([...base, "", "", "", "", ""].map(String));
    for (const c of s.failed)
      rows.push([...base, c.name, c.code, c.paye, c.vahed_raw,
                 c.nahayi ?? "", c.status].map(String));
  }
  return rows;
}

function csvField(v) {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })());
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeZip(entries) {
  const enc = new TextEncoder();
  const parts = [], central = [];
  let offset = 0;
  for (const e of entries) {
    const nb = enc.encode(e.name);
    const crc = crc32(e.data);
    const sz = e.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true);
    lh.setUint16(8, 0, true); lh.setUint32(14, crc, true);
    lh.setUint32(18, sz, true); lh.setUint32(22, sz, true);
    lh.setUint16(26, nb.length, true);
    parts.push(new Uint8Array(lh.buffer), nb, e.data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, sz, true); ch.setUint32(24, sz, true);
    ch.setUint16(28, nb.length, true); ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), nb);
    offset += 30 + nb.length + sz;
  }
  const cdStart = offset;
  let cdLen = 0;
  central.forEach(p => cdLen += p.length);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true);
  end.setUint32(12, cdLen, true); end.setUint32(16, cdStart, true);
  const out = new Uint8Array(offset + cdLen + 22);
  let o = 0;
  for (const p of [...parts, ...central, new Uint8Array(end.buffer)]) { out.set(p, o); o += p.length; }
  return out;
}

function sheetXml(rows) {
  const enc = s => String(s).replace(/[&<>]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m]));
  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';
  rows.forEach((r, ri) => {
    xml += `<row r="${ri + 1}">`;
    r.forEach((c, ci) => {
      let col = "";
      let n = ci;
      do { col = String.fromCharCode(65 + n % 26) + col; n = Math.floor(n / 26) - 1; } while (n >= 0);
      xml += `<c r="${col}${ri + 1}" t="inlineStr"><is><t xml:space="preserve">${enc(c)}</t></is></c>`;
    });
    xml += "</row>";
  });
  return xml + "</sheetData></worksheet>";
}

function makeXlsx(rows) {
  const enc = new TextEncoder();
  const files = {
    "[Content_Types].xml":
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
    "_rels/.rels":
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    "xl/workbook.xml":
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets><sheet name="Failed" sheetId="1" r:id="rId1"/></sheets></workbook>',
    "xl/_rels/workbook.xml.rels":
      '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
    "xl/worksheets/sheet1.xml": sheetXml(rows),
  };
  return makeZip(Object.entries(files).map(([n, t]) => ({ name: n, data: enc.encode(t) })));
}

$("#btn-export").addEventListener("click", () => {
  if (!DATA) { showMsg("ابتدا فایل‌ها را پردازش کنید.", false); return; }
  const csv = "\ufeff" + buildRows(applyFilters()).map(r => r.map(csvField).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "failed_students.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});

$("#btn-export-xlsx").addEventListener("click", () => {
  if (!DATA) { showMsg("ابتدا فایل‌ها را پردازش کنید.", false); return; }
  try {
    const data = makeXlsx(buildRows(applyFilters()));
    const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "failed_students.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (e) {
    console.error(e);
    showMsg("خطا در ساخت فایل Excel: " + e.message, false);
  }
});
/* ---------- گزارش چاپی دروس مردود ---------- */

function pfa(v) {
  return String(v).replace(/\d/g, d => FA_DIGITS[+d]);
}

function pf(v) {
  return v === null || v === undefined || v === "" ? "—" : pfa(v);
}

function pdot(val) {
  const s = String(val ?? "").trim();
  return s ? esc(pfa(s)) : "............";
}

const PRINT_CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg: #0a0c15;
  --card: rgba(18, 22, 35, .85);
  --line: rgba(255, 255, 255, .09);
  --acc1: #6366f1;
  --acc2: #8b5cf6;
  --txt: #e2e8f0;
  --mut: #94a3b8;
}
[data-theme="light"] {
  --bg: #eef1f7;
  --card: rgba(255, 255, 255, .92);
  --line: #cbd5e1;
  --txt: #111827;
  --mut: #64748b;
}
body {
  font-family: 'Vazirmatn', 'Segoe UI', Tahoma, sans-serif;
  background: var(--bg);
  color: var(--txt);
  direction: rtl;
  padding: 22px 16px 80px;
  line-height: 1.6;
}
.container { max-width: 1050px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.rpt-header { display: flex; align-items: center; gap: 13px; background: linear-gradient(135deg, var(--acc1), var(--acc2)); color: #fff; padding: 16px 20px; border-radius: 20px; box-shadow: 0 8px 24px rgba(99, 102, 241, .35); }
.rpt-header .ic { width: 44px; height: 44px; flex-shrink: 0; background: rgba(255,255,255,.18); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
.rpt-header h1 { font-size: 1.05rem; font-weight: 800; }
.rpt-header p { font-size: .72rem; opacity: .92; margin-top: 2px; }
.summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; background: var(--card); border: 1px solid var(--line); border-radius: 18px; padding: 14px 16px; backdrop-filter: blur(10px); }
.sitem b { display: block; font-size: 1.25rem; font-weight: 800; background: linear-gradient(135deg, #ffffff, var(--acc1)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.sitem span { font-size: .68rem; color: var(--mut); }
[data-theme="light"] .sitem b { background: linear-gradient(135deg, #111827, var(--acc1)); -webkit-background-clip: text; background-clip: text; }
.sheet { width: 194mm; max-width: 100%; margin: 0 auto; background: #ffffff; color: #111111; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, .45); overflow: hidden; }
.stu-half { min-height: 139mm; padding: 4mm 4.5mm; display: flex; flex-direction: column; gap: 1.4mm; color: #111111; }
.stu-half + .stu-half { border-top: .4mm dashed #333333; }
.f-top { display: flex; gap: 1.6mm; }
.f-ministry { width: 11.5%; text-align: center; font-size: 6.3pt; line-height: 1.95; font-weight: 700; padding-top: 1mm; }
.f-ministry p { white-space: nowrap; margin: 0; }
.f-box { flex: 1; background: #fff; border: .3mm solid #333; border-radius: 1mm; padding: 1mm 1.2mm; }
.f-box table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 6.6pt; }
.f-box td { border: .2mm solid #777; padding: .9mm .8mm; line-height: 1.5; word-break: break-word; overflow-wrap: anywhere; text-align: right; }
.f-box td.lb { font-weight: 800; background: #ececec; width: 27%; white-space: nowrap; }
.f-photo { width: 7%; min-height: 20mm; border: .3mm dashed #555; border-radius: 1mm; display: flex; align-items: center; justify-content: center; font-size: 5.8pt; color: #444; }
.f-title { text-align: center; font-size: 8.6pt; font-weight: 800; border: .35mm solid #111; border-radius: 1mm; padding: 1mm; background: #fff; }
table.f-table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 6.6pt; }
.f-table th { background: #e5e5e5; border: .25mm solid #111; padding: .9mm .3mm; text-align: center; font-weight: 800; }
.f-table td { border: .2mm solid #333; padding: .85mm .7mm; text-align: center; line-height: 1.45; }
.f-table td.name { text-align: right; font-weight: 600; white-space: normal; }
.f-table td.empty-row { text-align: center; color: #555; padding: 2.4mm; white-space: normal; }
.tickbox { display: inline-block; width: 3.4mm; height: 3.4mm; border: .35mm solid #111; border-radius: .4mm; background: #fff; }
td.st-fail { font-weight: 800; }
.f-total { display: flex; gap: 6mm; font-size: 7pt; font-weight: 800; border: .25mm solid #333; background: #f3f3f3; border-radius: 1mm; padding: .9mm 2mm; }
.f-note { font-size: 5.7pt; font-weight: 600; line-height: 1.75; border: .2mm dashed #777; border-radius: 1mm; padding: .8mm 2mm; text-align: justify; }
.f-sign { display: flex; gap: 1.6mm; margin-top: auto; }
.f-sign > div { flex: 1; border: .25mm solid #333; border-radius: 1mm; height: 10.5mm; font-size: 6.2pt; font-weight: 700; padding: .8mm 1.4mm; }
.toolbar { position: fixed; bottom: 18px; left: 18px; display: flex; gap: 8px; z-index: 50; direction: ltr; }
.tbtn { border: none; cursor: pointer; font-family: inherit; font-size: .83rem; font-weight: 700; border-radius: 12px; padding: 11px 20px; background: linear-gradient(105deg, var(--acc1), var(--acc2)); color: #fff; box-shadow: 0 8px 24px rgba(99, 102, 241, .4); transition: all .25s ease; }
.tbtn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(99, 102, 241, .5); }
.tbtn.alt { background: var(--card); color: var(--txt); border: 1px solid var(--line); box-shadow: none; width: 42px; height: 42px; padding: 0; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
@media print {
  @page { size: A4 portrait; margin: 6mm; }
  body { background: #fff; padding: 0; }
  .toolbar, .rpt-header, .summary { display: none !important; }
  .container { gap: 0; max-width: none; }
  .sheet { width: auto; box-shadow: none; border-radius: 0; margin: 0; page-break-after: always; break-after: page; }
  .sheet:last-child { page-break-after: auto; break-after: auto; }
  .stu-half { break-inside: avoid; page-break-inside: avoid; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
.pv-measure { position: fixed; top: 0; left: -4000px; z-index: -1; background: #fff; visibility: hidden; }
.pv-measure .stu-half { min-height: 0 !important; }
`;

function printInner(s) {
  const units = s.failed.reduce((t, c) => t + (c.vahed || 0), 0);
  const payeAll = [...new Set((s.courses || []).map(c => c.paye).filter(Boolean))].join("، ");
  const rows = s.failed.length ? s.failed.map((c, i) => `
        <tr>
            <td>${pfa(i + 1)}</td>
            <td><span class="tickbox"></span></td>
            <td>${pdot(c.code)}</td>
            <td class="name">${pdot(c.name)}</td>
            <td>${pdot(c.paye)}</td>
            <td>${c.vahed_raw ? esc(pfa(c.vahed_raw)) : pf(c.vahed)}</td>
            <td>${pf(c.nahayi)}</td>
            <td class="st-fail">${pdot(c.status)}</td>
            <td></td>
        </tr>`).join("") :
    `<tr><td colspan="9" class="empty-row">درسی با وضعیت مردود ثبت نشده است</td></tr>`;
  const school = s.school ?
    (s.school_code ? `${s.school} (${pfa(s.school_code)})` : s.school) : "";
  return `
        <div class="f-top">
            <div class="f-ministry">
                <p>جمهوری اسلامی ایران</p>
                <p>وزارت آموزش و پرورش</p>
                <p>دوره متوسطه دوم</p>
                ${s.edu_year ? `<p>سال تحصیلی ${pfa(s.edu_year)}</p>` : ""}
                <p>فرم انتخاب واحد تابستان</p>
                <p>فرم (۲۰۴)</p>
            </div>
            <div class="f-box"><table>
                <tr><td class="lb">استان:</td><td colspan="3">${pdot(s.province)}</td></tr>
                <tr><td class="lb">منطقه:</td><td colspan="3">${pdot(s.district)}</td></tr>
                <tr><td class="lb">آموزشگاه:</td><td colspan="3">${pdot(school)}</td></tr>
                <tr><td class="lb">شاخه:</td><td>${pdot(s.branch)}</td><td class="lb">دوره:</td><td>تابستان</td></tr>
                <tr><td class="lb">رشته:</td><td colspan="3">${pdot(s.reshte)}</td></tr>
            </table></div>
            <div class="f-box"><table>
                <tr><td class="lb">نام و نام خانوادگی:</td><td colspan="3">${pdot([s.first_name, s.family_name].filter(Boolean).join(" "))}</td></tr>
                <tr><td class="lb">نام پدر:</td><td colspan="3">${pdot(s.father_name)}</td></tr>
                <tr><td class="lb">کد ملی:</td><td>${pdot(s.national_id)}</td><td class="lb">کد دانش‌آموزی:</td><td>${pdot(s.student_code)}</td></tr>
                <tr><td class="lb">تاریخ تولد:</td><td>${pdot(s.birth_date)}</td><td class="lb">محل تولد:</td><td>${pdot(s.birth_place)}</td></tr>
                <tr><td class="lb">پایه تحصیلی:</td><td colspan="3">${pdot(s.paye_name || payeAll)}</td></tr>
            </table></div>
            <div class="f-photo">عکس دانش‌آموز</div>
        </div>
        <div class="f-title">برگ گزارش دروس مردود دانش‌آموز</div>
        <table class="f-table">
            <thead><tr>
                <th style="width:5%">ردیف</th>
                <th style="width:7%">انتخاب</th>
                <th style="width:11%">کد درس</th>
                <th style="width:24%">نام درس</th>
                <th style="width:8%">پایه</th>
                <th style="width:6%">واحد</th>
                <th style="width:12%">نمره نهایی</th>
                <th style="width:10%">وضعیت</th>
                <th style="width:17%">توضیحات</th>
            </tr></thead>
            <tbody>${rows}</tbody>
        </table>
        <div class="f-total"><span>جمع واحد کل دروس مردودی: ${pfa(Math.round(units * 100) / 100)}</span><span>تعداد دروس مردود: ${pfa(s.failed_count)}</span></div>
        <p class="f-note">توجه: دروس انتخابی، اختیاری، غیرحضوری، تعیین رشته، تغییر رشته، سهم واحد مهارتی کاردانش، مهمان و مهارت خارج از مدرسه را در ستون توضیحات جدول فوق مشخص نمایید.</p>
        <div class="f-sign">
            <div>امضاء و اثر انگشت دانش‌آموز</div>
            <div>تلفن دانش‌آموز: ......................</div>
            <div>امضاء معاون آموزشی</div>
        </div>`;
}

async function planSheets(list) {
  if (document.fonts && document.fonts.ready) await document.fonts.ready;
  const holder = document.createElement("div");
  holder.className = "pv-measure";
  holder.innerHTML = `<style>${PRINT_CSS}</style>`;
  const ruler = document.createElement("div");
  ruler.style.cssText = "position:absolute;width:100mm;height:1mm;";
  holder.appendChild(ruler);
  document.body.appendChild(holder);
  const pxPerMm = ruler.getBoundingClientRect().width / 100;
  const HALF_MM = 141, MIN_ZOOM = 0.5;
  const blocks = list.map(s => {
    const el = document.createElement("div");
    el.className = "stu-half";
    el.innerHTML = printInner(s);
    holder.appendChild(el);
    return el;
  });
  const heights = blocks.map(el => Math.max(el.getBoundingClientRect().height, 1) / pxPerMm);
  blocks.forEach(el => el.remove());
  holder.remove();
  const sheets = [];
  for (let i = 0; i < list.length; i += 2) {
    const items = [];
    for (let j = i; j < Math.min(i + 2, list.length); j++) {
      const zoom = Math.min(1, Math.max(MIN_ZOOM, HALF_MM / heights[j]));
      items.push({ s: list[j], zoom: +zoom.toFixed(3) });
    }
    sheets.push({ items });
  }
  return sheets;
}

function buildPrintHtml(sheets) {
  const students = sheets.reduce((n, sh) => n + sh.items.length, 0);
  const failedStudents = sheets.flatMap(x => x.items).filter(it => it.s.has_failed).length;
  const failedCourses = sheets.flatMap(x => x.items).reduce((n, it) => n + it.s.failed_count, 0);
  const today = new Date().toLocaleDateString("fa-IR");
  let html = `<!DOCTYPE html>
<html dir="rtl" lang="fa" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>گزارش دروس مردود</title>
<link rel="stylesheet" href="Vazirmatn-font-face.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css">
<style>${PRINT_CSS}</style>
</head>
<body>
<div class="container">
    <div class="rpt-header">
        <div class="ic">&#128203;</div>
        <div>
            <h1>گزارش دانش‌آموزان دارای درس مردود</h1>
            <p>سامانه تحلیل کارنامه‌های متوسطه دوم | تاریخ گزارش: ${today}</p>
        </div>
    </div>
    <div class="summary">
        <div class="sitem"><b>${pfa(students)}</b><span>دانش‌آموز انتخابی</span></div>
        <div class="sitem"><b>${pfa(failedStudents)}</b><span>دارای درس مردود</span></div>
        <div class="sitem"><b>${pfa(failedCourses)}</b><span>مجموع دروس مردود</span></div>
        <div class="sitem"><b>${pfa(sheets.length)}</b><span>برگ A4</span></div>
    </div>
`;
  for (const sheet of sheets) {
    html += `<div class="sheet">`;
    for (const it of sheet.items)
      html += `<div class="stu-half"${it.zoom !== 1 ? ` style="zoom:${it.zoom}"` : ""}>${printInner(it.s)}</div>`;
    html += `</div>`;
  }
  html += `
</div>
<div class="toolbar">
    <button class="tbtn alt" id="themeBtn" title="تغییر تم"></button>
    <button class="tbtn" onclick="window.print()">&#128424; چاپ / ذخیره به PDF</button>
</div>
<script>
(function() {
    var btn = document.getElementById('themeBtn');
    var root = document.documentElement;
    var setIcon = function() {
        btn.textContent = root.getAttribute('data-theme') === 'dark' ? '\\u2600\\uFE0F' : '\\uD83C\\uDF19';
    };
    btn.addEventListener('click', function() {
        root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        setIcon();
    });
    setIcon();
})();
<\/script>
</body>
</html>`;
  return html;
}

function downloadReportHtml(html) {
  const blob = new Blob(["\ufeff", html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `failed-report-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function sortForPrint(list, mode) {
  const fa = (a, b) => String(a ?? "").localeCompare(String(b ?? ""), "fa");
  const po = v => ({ "دهم": 1, "یازدهم": 2, "دوازدهم": 3 }[v] || 9);
  const payeOfStu = s => s.paye_name ||
    [...new Set((s.courses || []).map(c => c.paye).filter(Boolean))]
      .sort((x, y) => po(x) - po(y))[0] || "";
  const L = list.slice();
  if (mode === "name")
    L.sort((a, b) => fa(a.family_name, b.family_name) || fa(a.first_name, b.first_name));
  else if (mode === "reshte-paye")
    L.sort((a, b) => fa(a.reshte, b.reshte) ||
                     po(payeOfStu(a)) - po(payeOfStu(b)) ||
                     fa(a.family_name, b.family_name) || fa(a.first_name, b.first_name));
  else
    L.sort((a, b) => b.failed_count - a.failed_count ||
                     fa(a.family_name, b.family_name) || fa(a.first_name, b.first_name));
  return L;
}

$("#btn-print").addEventListener("click", async () => {
  try {
    if (!DATA) { showMsg("ابتدا فایل‌ها را پردازش کنید.", false); return; }
    const list = sortForPrint(applyFilters().filter(s => selected.has(stuKey(s))),
                              $("#f-print-sort").value);
    if (!list.length) {
      showMsg("حداقل یک دانش‌آموز را با چک‌باکس ستون انتخاب انتخاب کنید.", false);
      return;
    }
    showMsg("در حال آماده‌سازی گزارش چاپی…", true);
    const sheets = await planSheets(list);
    const html = buildPrintHtml(sheets);
    const win = window.open("", "_blank");
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
      try { win.focus(); } catch (_) {}
      showMsg(`گزارش ${list.length} دانش‌آموز در ${sheets.length} برگ A4 آماده شد.`, true);
    } else {
      downloadReportHtml(html);
      showMsg("پنجره مسدود شد؛ فایل گزارش دانلود شد.", true);
    }
  } catch (e) {
    console.error(e);
    alert("خطا در ساخت گزارش چاپی: " + e.message);
  }
});
