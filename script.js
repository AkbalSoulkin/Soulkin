// ===== COMPLETE CYCLUS =====
const cycle = [];

let p = 0;
let r = 0;

for(let k=0;k<260;k++){

  let tone = (k % 13) + 1;

  cycle.push({
    pos: p,
    rot: r
  });

  if(tone === 13){

    r = (r + 72) % 360;

  } else {

    p = (p + 1) % 5;
  }
}

// ===== STATE =====
let language = "en";
let lang = lang_en;
let kin = 0;
let dayOffset = 0;
let tone = 1;
let seal = 0;
let night = 1;
let pos = 0;
let rot = 0;
let guideSeal = 0;
let animating = false;
let activePage = "intro";
let activeHistoryCell = null;
let sourcesActive = false;
let mechanismKin = 0;
let ringKin = 0;
let beforeOrAtRoot = false;
let dotVisible = true;

const revealOrder = [
  4,   // 11/11 Chicchan
  9,   // 12/11 Oc
  14,  // 13/11 Men
  19,  // 14/11 Ahau
  0,   // 15/11 Imix
  1,   // 16/11 Ik
  2,   // 17/11 Akbal
  3,   // 18/11 Kan
  5,   // 20/11 Cimi
  6,   // 21/11 Manik
  7,   // 22/11 Lamat
  8,   // 23/11 Muluc
  10,  // 25/11 Chuen
  11,  // 26/11 Eb
  12,  // 27/11 Ben
  13,  // 28/11 Ix
  15,  // 30/11 Cib
  16,  // 1/12 Caban
  17,  // 2/12 Etznab
  18   // 3/12 Cauac
];

const PLANET_DISPLAY_START_DAY = Number(
  daysFromCivil(-863216567, 7, 12) -
  daysFromCivil(1982, 8, 22)
);

const WAVESPELL_FRACTAL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const WORKFIELD_REVEAL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 15) -
  daysFromCivil(1982, 8, 22)
);

const PENTAGRAM_FRACTAL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const TZOLKIN_OPERATOR_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const WORKFIELD_UNFOLD_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const ICHING_UNFOLD_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const PLANET_ANCHOR_DAY = Number(
  daysFromCivil(-3113, 8, 8) -
  daysFromCivil(1982, 8, 22)
);

let wavespellActive = false;
let operatorActive = false;

const planetMercury = document.getElementById("planetMercury");
const planetVenus   = document.getElementById("planetVenus");
const planetSaturn  = document.getElementById("planetSaturn");
const planetJupiter = document.getElementById("planetJupiter");
const planetMars    = document.getElementById("planetMars");
const planetWorkfield =
  document.getElementById("planetWorkfield");

const letterO  = document.getElementById("letterO");
const letterOQ = document.getElementById("letterOQ");
const letterOD = document.getElementById("letterOD");
const letterOB = document.getElementById("letterOB");
const letterOP = document.getElementById("letterOP");

const O_UNFOLD_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const HEART_CHAKRA_DAY = Number(
  daysFromCivil(-2, 9, 11) -
  daysFromCivil(1982, 8, 22)
);

const wavespellOperatorLanguages = {
  en: wavespell_operators_en,
  nl: wavespell_operators_nl,
  ru: wavespell_operators_ru,
  tr: wavespell_operators_tr,
  jp: wavespell_operators_jp
};

const wavespellWorkfieldLanguages = {
  en: wavespell_workfields_en,
  nl: wavespell_workfields_nl,
  ru: wavespell_workfields_ru,
  tr: wavespell_workfields_tr,
  jp: wavespell_workfields_jp
};

const languages = {

  en: lang_en,
  nl: lang_nl,
  jp: lang_jp,
  ru: lang_ru,
  tr: lang_tr

};

const sourceLanguages = {
  en: sources_en,
  nl: sources_nl,
  ru: sources_ru,
  tr: sources_tr,
  jp: sources_jp
};

const sourcesButtonLabels = {
  en: "Sources",
  nl: "Bronnen",
  jp: "出典",
  ru: "Источники",
  tr: "Kaynaklar"
};


const languageSelect =
  document.getElementById(
    "languageSelect"
  );



languageSelect.onchange = () => {

  language = languageSelect.value;

  localStorage.setItem(
    "language",
    language
  );

  lang = languages[language];

  pages = pageSets[language];

  updateLanguage();

  // Sources opnieuw laden in de gekozen taal
  if(sourcesActive){
    showSources();
  }

if(wavespellActive){
  showWavespellText();
}

if(operatorActive){
  showOperatorText();
}

sourcesButton.textContent =
  sourcesButtonLabels[language];
};


const pageSets = {
  en: {
    muladhara: muladharaPages_en,
    muladharaKin: muladharaKinPages_en,
    svadhisthana: svadhisthanaPages_en,
    manipura: manipuraPages_en,
    anahata: anahataPages_en,
    vishuddha: vishuddhaPages_en,
    ajna: ajnaPages_en,
    sahasrara: sahasraraPages_en,
    sahasrara64: sahasrara64Pages_en
  },

  nl: {
    muladhara: muladharaPages_nl,
    muladharaKin: muladharaKinPages_nl,
    special: specialPages,
    svadhisthana: svadhisthanaPages_nl,
    manipura: manipuraPages_nl,
    anahata: anahataPages_nl,
    vishuddha: vishuddhaPages_nl,
    ajna: ajnaPages_nl,
    sahasrara: sahasraraPages_nl,
    sahasrara64: sahasrara64Pages_nl
  },

  jp: {
    muladhara: muladharaPages_jp,
    muladharaKin: muladharaKinPages_jp,
    svadhisthana: svadhisthanaPages_jp,
    manipura: manipuraPages_jp,
    anahata: anahataPages_jp,
    vishuddha: vishuddhaPages_jp,
    ajna: ajnaPages_jp,
    sahasrara: sahasraraPages_jp,
    sahasrara64: sahasrara64Pages_jp
  },

  ru: {
    muladhara: muladharaPages_ru,
    muladharaKin: muladharaKinPages_ru,
    svadhisthana: svadhisthanaPages_ru,
    manipura: manipuraPages_ru,
    anahata: anahataPages_ru,
    vishuddha: vishuddhaPages_ru,
    ajna: ajnaPages_ru,
    sahasrara: sahasraraPages_ru,
    sahasrara64: sahasrara64Pages_ru
  },

  tr: {
    muladhara: muladharaPages_tr,
    muladharaKin: muladharaKinPages_tr,
    svadhisthana: svadhisthanaPages_tr,
    manipura: manipuraPages_tr,
    anahata: anahataPages_tr,
    vishuddha: vishuddhaPages_tr,
    ajna: ajnaPages_tr,
    sahasrara: sahasraraPages_tr,
    sahasrara64: sahasrara64Pages_tr
  }
};

let pages = pageSets.en;

const savedLanguage =
  localStorage.getItem(
    "soulkinLanguage"
  );

if(
  savedLanguage &&
  languages[savedLanguage] &&
  pageSets[savedLanguage]
){

  language = savedLanguage;
  lang = languages[language];
  pages = pageSets[language];

  languageSelect.value =
    language;
}


function updateFromKin(){

  tone = (kin % 13) + 1;
  seal = kin % 20;

const ANAHATA_TEXT_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

  night =
    (((dayOffset % 9) + 9) % 9 + 8) % 9 + 1;

  mechanismKin = kin;
  ringKin = kin;

  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

const ROOT_ROT =
  cycle[159].rot; // 4 Ahau / 5 Imix wavespell-rotatie

  beforeOrAtRoot =
    dayOffset <= ROOT_OFFSET;

if(dayOffset < ROOT_OFFSET - 4){

  tone = 13;
  seal = 19;
  night = 0;

  mechanismKin = 259;
  ringKin = 156;
  pos = 0;
  rot = ROOT_ROT;
  dotVisible = false;

  return;
}

  const specialIndex =
    dayOffset - ROOT_OFFSET + 4;

  if(specialIndex >= 0 && specialIndex <= 4){

    const special = [
      // De 20-ring blijft t/m 11/11 op Caban en loopt daarna
      // iedere dag één normaal werkveld door naar Ahau.
      {tone:13, seal:19, night:3, mechanismKin:259, ringKin:156, dot:false}, // 10/11: Caban onder
      {tone:1,  seal:4,  night:7, mechanismKin:156, ringKin:156, dot:true},  // 11/11: Caban onder
      {tone:2,  seal:9,  night:1, mechanismKin:157, ringKin:157, dot:true},  // 12/11: Etznab onder
      {tone:3,  seal:14, night:5, mechanismKin:158, ringKin:158, dot:true},  // 13/11: Cauac onder
      {tone:4,  seal:19, night:9, mechanismKin:159, ringKin:159, dot:true}   // 14/11: Ahau onder
    ][specialIndex];

    tone = special.tone;
    seal = special.seal;
    night = special.night;
    mechanismKin = special.mechanismKin;
    ringKin = special.ringKin;
    pos = cycle[mechanismKin].pos;
    rot = ROOT_ROT;
    dotVisible = special.dot;

    return;
  }
  dotVisible = true;
  pos = cycle[mechanismKin].pos;
  rot = cycle[mechanismKin].rot;
}

// ===== UPDATE =====
function civilFromDays(z){

  z = BigInt(z);

  z += 719468n;

  const era = floorDiv(z, 146097n);
  const doe = z - era * 146097n;

  const yoe =
    floorDiv(
      doe -
      floorDiv(doe, 1460n) +
      floorDiv(doe, 36524n) -
      floorDiv(doe, 146096n),
      365n
    );

  let y = yoe + era * 400n;

  const doy =
    doe -
    (
      365n * yoe +
      floorDiv(yoe, 4n) -
      floorDiv(yoe, 100n)
    );

  const mp =
    floorDiv(5n * doy + 2n, 153n);

  const d =
    doy -
    floorDiv(153n * mp + 2n, 5n) +
    1n;

  const m =
    mp + (mp < 10n ? 3n : -9n);

  y += m <= 2n ? 1n : 0n;

  return {
    year: Number(y),
    month: Number(m),
    day: Number(d)
  };
}


// ===== DATUM UPDATE =====
function updateDateFromKin(){

  const baseDays =
    daysFromCivil(1982, 8, 22);

  const currentDays =
    baseDays + BigInt(dayOffset);

  const d =
    civilFromDays(currentDays);

  document.getElementById("dayInput").value =
    d.day;

  document.getElementById("monthInput").value =
    d.month;

  document.getElementById("yearInput").value =
    d.year;
}

function getHeartType(currentSeal){

  // Manik en Caban
  if([6, 16].includes(currentSeal)){
    return "super";
  }

  // Kan, Oc, Ix en Ahau
  if([3, 9, 13, 19].includes(currentSeal)){
    return "special";
  }

  return "normal";
}

function closeOperator(){

  if(!operatorActive){
    return;
  }

  operatorActive = false;
}

// ===== DATE PICKER =====
function goToDate(){

const refreshGo = () => {

  // Eventuele oude hover mag niet als tweede kin blijven staan
  hoverPath.setAttribute("opacity","0");

  render();

  if(sourcesActive){
    showSources();
  }

  if(wavespellActive){
    showWavespellText();
  }

  if(operatorActive){
    showOperatorText();
  }
};

  const day =
    Number(document.getElementById("dayInput").value);

  const month =
    Number(document.getElementById("monthInput").value);

  const year =
    Number(document.getElementById("yearInput").value);

  if(!day || !month || !year){
    return;
  }

const targetDays =
  daysFromCivil(year, month, day);

const baseDays =
  daysFromCivil(1982, 8, 22);

const diff =
  targetDays - baseDays;

  dayOffset = Number(diff);

  kin =
    ((dayOffset % 260) + 260) % 260;

  updateFromKin();

if(dayOffset < TZOLKIN_OPERATOR_START_DAY){
  operatorActive = false;
}

  refreshGo();
}

// ===== LONG COUNT 260 FIELD =====

const HABLATUN_OPERATOR_DAYS = 460800000000n;
const HABLATUN_WORKFIELD_DAYS = 23040000000n;
const ALAUTUN_OPERATOR_DAYS = 23040000000n;
const ALAUTUN_WORKFIELD_DAYS = 1152000000n;
const KINCHILTUN_OPERATOR_DAYS = 1152000000n;
const KINCHILTUN_WORKFIELD_DAYS = 57600000n;
const KALABTUN_OPERATOR_DAYS = 57600000n;
const KALABTUN_WORKFIELD_DAYS = 2880000n;
const PIKTUN_OPERATOR_DAYS = 2880000n;
const PIKTUN_WORKFIELD_DAYS = 144000n;
const BAKTUN_OPERATOR_DAYS = 144000n;
const BAKTUN_WORKFIELD_DAYS = 7200n;
const KATUN_OPERATOR_DAYS = 7200n;
const KATUN_WORKFIELD_DAYS = 360n;
const TUN_OPERATOR_DAYS = 360n;
const TUN_WORKFIELD_DAYS = 18n;

const longCountField =
  document.getElementById("longCountField");

longCountField.addEventListener(
  "click",
  () => {
    closeSources();
  },
  true
);

function buildLongCountField(){

  longCountField.innerHTML = "";

  const workfieldColors = [
    "#e53935",
    "#ffffff",
    "#1e88e5",
    "#fdd835"
  ];

  for(let row = 0; row < 20; row++){

    const workfield =
      document.createElement("div");

    workfield.className =
      "longCountWorkfield";

    workfield.style.background =
      workfieldColors[row % 4];

    const animal =
      document.createElement("img");

    animal.src =
      "animals/" + animalFiles[row];

    workfield.appendChild(animal);
    longCountField.appendChild(workfield);


    for(let col = 0; col < 13; col++){

      const cell =
        document.createElement("div");

      cell.className =
        "longCountCell";

if(openLongCountLevel === "hablatun"){

  cell.classList.add("clickableLongCountCell");

const isBigBangCell =
  row === 14 &&
  col === 2;

if(isBigBangCell){
  cell.classList.add("historyCell");
}

const isHablatunHubbleCell =
  row === 1 &&
  col === 12;

if(isHablatunHubbleCell){
  cell.classList.add("historyCell");
}

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * HABLATUN_OPERATOR_DAYS
      + BigInt(row) * HABLATUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

if(isBigBangCell){

  toggleHistoryCell(
    "hablatun",
    "onderscheiden_perspectief",
    cell
  );

}

if(isHablatunHubbleCell){

  toggleHistoryCell(
    "hablatun",
    "transformeren_informatie",
    cell
  );

}
  });
}

if(openLongCountLevel === "alautun"){

  cell.classList.add("clickableLongCountCell");

  // Cambrian Explosion:
  // Vrijmaken + Potentieel
  const isAlautunCambrianCell =
    row === 3 &&
    col === 5;

  if(isAlautunCambrianCell){
    cell.classList.add("historyCell");
  }

const isAlautunKPgCell =
  row === 12 &&
  col === 12;

if(isAlautunKPgCell){
  cell.classList.add("historyCell");
}

const isAlautunPermianExtinctionCell =
  row === 13 &&
  col === 9;

if(isAlautunPermianExtinctionCell){
  cell.classList.add("historyCell");
}

const isAlautunLandPlantsCell =
  row === 19 &&
  col === 6;

if(isAlautunLandPlantsCell){
  cell.classList.add("historyCell");
}

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * ALAUTUN_OPERATOR_DAYS
      + BigInt(row) * ALAUTUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

    if(isAlautunCambrianCell){

      toggleHistoryCell(
        "alautun",
        "vrijmaken_potentieel",
        cell
      );

    }

if(isAlautunKPgCell){

  toggleHistoryCell(
    "alautun",
    "afstemmen_structuur",
    cell
  );

}

if(isAlautunPermianExtinctionCell){

  toggleHistoryCell(
    "alautun",
    "ontsluiten_bewustzijn",
    cell
  );

}

if(isAlautunLandPlantsCell){

  toggleHistoryCell(
    "alautun",
    "doorgronden_essentie",
    cell
  );

}

  });
}

if(openLongCountLevel === "kinchiltun"){

  cell.classList.add("clickableLongCountCell");

  // Eocene–Oligocene transition:
  // Attune + Coherence
  const isKinchiltunEoceneOligoceneCell =
    row === 18 &&
    col === 2;

  if(isKinchiltunEoceneOligoceneCell){
    cell.classList.add("historyCell");
  }

const isKinchiltunLomekwiCell =
  row === 12 &&
  col === 12;

if(isKinchiltunLomekwiCell){
  cell.classList.add("historyCell");
}

const isKinchiltunSahelanthropusCell =
  row === 9 &&
  col === 11;

if(isKinchiltunSahelanthropusCell){
  cell.classList.add("historyCell");
}

const isKinchiltunMioceneCell =
  row === 7 &&
  col === 6;

if(isKinchiltunMioceneCell){
  cell.classList.add("historyCell");
}

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * KINCHILTUN_OPERATOR_DAYS
      + BigInt(row) * KINCHILTUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

    if(isKinchiltunEoceneOligoceneCell){

      toggleHistoryCell(
        "kinchiltun",
        "afstemmen_samenhang",
        cell
      );

    }

if(isKinchiltunLomekwiCell){

  toggleHistoryCell(
    "kinchiltun",
    "verfijnen_structuur",
    cell
  );

}

if(isKinchiltunSahelanthropusCell){

  toggleHistoryCell(
    "kinchiltun",
    "integreren_relatie",
    cell
  );

}

if(isKinchiltunMioceneCell){

  toggleHistoryCell(
    "kinchiltun",
    "verankeren_waarde",
    cell
  );

}

  });
}

if(openLongCountLevel === "kalabtun"){

const isKalabtunHomoSapiensCell =
  row === 15 &&
  col === 11;

if(isKalabtunHomoSapiensCell){
  cell.classList.add("historyCell");
}

const isKalabtunHomoErectusCell =
  row === 12 &&
  col === 1;

if(isKalabtunHomoErectusCell){
  cell.classList.add("historyCell");
}

const isKalabtunAcheuleanCell =
  row === 10 &&
  col === 2;

if(isKalabtunAcheuleanCell){
  cell.classList.add("historyCell");
}

const isKalabtunFireCell =
  row === 13 &&
  col === 8;

if(isKalabtunFireCell){
  cell.classList.add("historyCell");
}

const isKalabtunNeanderthalCell =
  row === 18 &&
  col === 10;

if(isKalabtunNeanderthalCell){
  cell.classList.add("historyCell");
}

  cell.classList.add("clickableLongCountCell");

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * KALABTUN_OPERATOR_DAYS
      + BigInt(row) * KALABTUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

if(isKalabtunHomoSapiensCell){

  toggleHistoryCell(
    "kalabtun",
    "erkennen_spoor",
    cell
  );

}

if(isKalabtunHomoErectusCell){

  toggleHistoryCell(
    "kalabtun",
    "afstemmen_structuur",
    cell
  );

}

if(isKalabtunAcheuleanCell){

  toggleHistoryCell(
    "kalabtun",
    "ontsluiten_expressie",
    cell
  );

}

if(isKalabtunFireCell){

  toggleHistoryCell(
    "kalabtun",
    "selecteren_bewustzijn",
    cell
  );

}

if(isKalabtunNeanderthalCell){

  toggleHistoryCell(
    "kalabtun",
    "verankeren_samenhang",
    cell
  );

}

  });
}

if(openLongCountLevel === "piktun"){

  cell.classList.add("clickableLongCountCell");

const isPiktunGobekliCell =
  row === 2 &&
  col === 12;

if(isPiktunGobekliCell){
  cell.classList.add("historyCell");
}

const isPiktunBlombosCell =
  row === 15 &&
  col === 3;

if(isPiktunBlombosCell){
  cell.classList.add("historyCell");
}

const isPiktunQafzehCell =
  row === 14 &&
  col === 0;

if(isPiktunQafzehCell){
  cell.classList.add("historyCell");
}

const isPiktunRedBalloonCell =
  row === 6 &&
  col === 1;

if(isPiktunRedBalloonCell){
  cell.classList.add("historyCell");
}

const isPiktunAlWustaCell =
  row === 12 &&
  col === 2;

if(isPiktunAlWustaCell){
  cell.classList.add("historyCell");
}

const isPiktunSibuduAdhesiveCell =
  row === 7 &&
  col === 4;

if(isPiktunSibuduAdhesiveCell){
  cell.classList.add("historyCell");
}

const isPiktunBowArrowCell =
  row === 5 &&
  col === 5;

if(isPiktunBowArrowCell){
  cell.classList.add("historyCell");
}

const isPiktunMandrinCell =
  row === 11 &&
  col === 6;

if(isPiktunMandrinCell){
  cell.classList.add("historyCell");
}

const isPiktunSulawesiArtCell =
  row === 12 &&
  col === 7;

if(isPiktunSulawesiArtCell){
  cell.classList.add("historyCell");
}

const isPiktunEarlyMusicCell =
  row === 6 &&
  col === 8;

if(isPiktunEarlyMusicCell){
  cell.classList.add("historyCell");
}

const isPiktunDolniVestoniceCell =
  row === 9 &&
  col === 9;

if(isPiktunDolniVestoniceCell){
  cell.classList.add("historyCell");
}

const isPiktunOhaloCell =
  row === 9 &&
  col === 10;

if(isPiktunOhaloCell){
  cell.classList.add("historyCell");
}

const isPiktunShubayqaBreadCell =
  row === 11 &&
  col === 11;

if(isPiktunShubayqaBreadCell){
  cell.classList.add("historyCell");
}

const isPiktunCatalhoyukCell =
  row === 10 &&
  col === 12;

if(isPiktunCatalhoyukCell){
  cell.classList.add("historyCell");
}

const isPiktunUrukCell =
  row === 17 &&
  col === 12;

if(isPiktunUrukCell){
  cell.classList.add("historyCell");
}

const isPiktunEarlySapiensCell =
  row === 16 &&
  col === 7;

if(isPiktunEarlySapiensCell){
  cell.classList.add("historyCell");
}

const isPiktunSapiensNeanderthalCell =
  row === 17 &&
  col === 7;

if(isPiktunSapiensNeanderthalCell){
  cell.classList.add("historyCell");
}

const isPiktunUstIshimCell =
  row === 18 &&
  col === 7;

if(isPiktunUstIshimCell){
  cell.classList.add("historyCell");
}

const isPiktunSapiensExpansionCell =
  row === 19 &&
  col === 7;

if(isPiktunSapiensExpansionCell){
  cell.classList.add("historyCell");
}

const isPiktunSapiensIntegrationCell =
  row === 0 &&
  col === 8;

if(isPiktunSapiensIntegrationCell){
  cell.classList.add("historyCell");
}

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * PIKTUN_OPERATOR_DAYS
      + BigInt(row) * PIKTUN_WORKFIELD_DAYS;

    const targetDate = civilFromDays(targetDays);

    document.getElementById("dayInput").value = targetDate.day;
    document.getElementById("monthInput").value = targetDate.month;
    document.getElementById("yearInput").value = targetDate.year;

    goToDate();

if(isPiktunGobekliCell){

  toggleHistoryCell(
    "piktun",
    "integreren_verbeelding",
    cell
  );

}

if(isPiktunBlombosCell){

  toggleHistoryCell(
    "piktun",
    "verankeren_spoor",
    cell
  );

}

if(isPiktunQafzehCell){

  toggleHistoryCell(
    "piktun",
    "erkennen_perspectief",
    cell
  );

}

if(isPiktunRedBalloonCell){

  toggleHistoryCell(
    "piktun",
    "actualiseren_interactie",
    cell
  );

}

if(isPiktunAlWustaCell){

  toggleHistoryCell(
    "piktun",
    "actualiseren_structuur",
    cell
  );

}

if(isPiktunSibuduAdhesiveCell){

  toggleHistoryCell(
    "piktun",
    "doorgronden_waarde",
    cell
  );

}

if(isPiktunBowArrowCell){

  toggleHistoryCell(
    "piktun",
    "erkennen_grenzen",
    cell
  );

}

if(isPiktunMandrinCell){

  toggleHistoryCell(
    "piktun",
    "erkennen_levenspad",
    cell
  );

}

if(isPiktunSulawesiArtCell){

  toggleHistoryCell(
    "piktun",
    "doorgronden_structuur",
    cell
  );

}

if(isPiktunEarlyMusicCell){

  toggleHistoryCell(
    "piktun",
    "verankeren_interactie",
    cell
  );

}

if(isPiktunDolniVestoniceCell){

  toggleHistoryCell(
    "piktun",
    "transformeren_relatie",
    cell
  );

}

if(isPiktunOhaloCell){

  toggleHistoryCell(
    "piktun",
    "erkennen_relatie",
    cell
  );

}

if(isPiktunShubayqaBreadCell){

  toggleHistoryCell(
    "piktun",
    "verankeren_levenspad",
    cell
  );

}

if(isPiktunCatalhoyukCell){

  toggleHistoryCell(
    "piktun",
    "plaatsen_expressie",
    cell
  );

}

if(isPiktunUrukCell){

  toggleHistoryCell(
    "piktun",
    "verankeren_waarheid",
    cell
  );

}

if(isPiktunEarlySapiensCell){

  toggleHistoryCell(
    "piktun",
    "actualiseren_manifestatie",
    cell
  );

}

if(isPiktunSapiensNeanderthalCell){

  toggleHistoryCell(
    "piktun",
    "erkennen_waarheid",
    cell
  );

}

if(isPiktunUstIshimCell){

  toggleHistoryCell(
    "piktun",
    "onderscheiden_samenhang",
    cell
  );

}

if(isPiktunSapiensExpansionCell){

  toggleHistoryCell(
    "piktun",
    "plaatsen_essentie",
    cell
  );

}

if(isPiktunSapiensIntegrationCell){

  toggleHistoryCell(
    "piktun",
    "selecteren_oorsprong",
    cell
  );

}

  });
}

if(openLongCountLevel === "baktun"){

  cell.classList.add("clickableLongCountCell");

  // Eerste Baktun-vak:
  // Actualize + Origin
  // Writing / early cuneiform
  const isBaktunWritingCell =
    row === 0 &&
    col === 0;

  if(isBaktunWritingCell){
    cell.classList.add("historyCell");
  }

const isBaktunPyramidCell =
  row === 8 &&
  col === 1;

if(isBaktunPyramidCell){
  cell.classList.add("historyCell");
}

const isBaktunIndusCell =
  row === 6 &&
  col === 2;

if(isBaktunIndusCell){
  cell.classList.add("historyCell");
}

const isBaktunHammurabiCell =
  row === 9 &&
  col === 3;

if(isBaktunHammurabiCell){
  cell.classList.add("historyCell");
}

const isBaktunBronzeAgeCollapseCell =
  row === 17 &&
  col === 4;

if(isBaktunBronzeAgeCollapseCell){
  cell.classList.add("historyCell");
}

const isBaktunPhoenicianCell =
  row === 2 &&
  col === 5;

if(isBaktunPhoenicianCell){
  cell.classList.add("historyCell");
}

const isBaktunDemocracyCell =
  row === 12 &&
  col === 6;

if(isBaktunDemocracyCell){
  cell.classList.add("historyCell");
}

const isBaktunRomanEmpireCell =
  row === 16 &&
  col === 7;

if(isBaktunRomanEmpireCell){
  cell.classList.add("historyCell");
}

const isBaktunChristianityCell =
  row === 13 &&
  col === 8;

if(isBaktunChristianityCell){
  cell.classList.add("historyCell");
}

const isBaktunHijraCell =
  row === 9 &&
  col === 9;

if(isBaktunHijraCell){
  cell.classList.add("historyCell");
}

const isBaktunMovableTypeCell =
  row === 10 &&
  col === 10;

if(isBaktunMovableTypeCell){
  cell.classList.add("historyCell");
}

const isBaktunColumbusCell =
  row === 13 &&
  col === 11;

if(isBaktunColumbusCell){
  cell.classList.add("historyCell");
}

const isBaktunArpanetCell =
  row === 17 &&
  col === 12;

if(isBaktunArpanetCell){
  cell.classList.add("historyCell");
}

const isBaktunEarlyEgyptCell =
  row === 1 &&
  col === 0;

if(isBaktunEarlyEgyptCell){
  cell.classList.add("historyCell");
}

const isBaktunAkkadianEmpireCell =
  row === 19 &&
  col === 1;

if(isBaktunAkkadianEmpireCell){
  cell.classList.add("historyCell");
}

const isBaktunUrNammuCell =
  row === 11 &&
  col === 2;

if(isBaktunUrNammuCell){
  cell.classList.add("historyCell");
}

const isBaktunEarlyAlphabetCell =
  row === 6 &&
  col === 3;

if(isBaktunEarlyAlphabetCell){
  cell.classList.add("historyCell");
}

const isBaktunKadeshCell =
  row === 13 &&
  col === 4;

if(isBaktunKadeshCell){
  cell.classList.add("historyCell");
}

const isBaktunOlympicsCell =
  row === 18 &&
  col === 5;

if(isBaktunOlympicsCell){
  cell.classList.add("historyCell");
}

const isBaktunSocratesCell =
  row === 17 &&
  col === 6;

if(isBaktunSocratesCell){
  cell.classList.add("historyCell");
}

const isBaktunArchimedesCell =
  row === 5 &&
  col === 7;

if(isBaktunArchimedesCell){
  cell.classList.add("historyCell");
}

const isBaktunPaperCell =
  row === 3 &&
  col === 8;

if(isBaktunPaperCell){
  cell.classList.add("historyCell");
}

const isBaktunBrahmaguptaCell =
  row === 10 &&
  col === 9;

if(isBaktunBrahmaguptaCell){
  cell.classList.add("historyCell");
}

const isBaktunIbnAlHaythamCell =
  row === 9 &&
  col === 10;

if(isBaktunIbnAlHaythamCell){
  cell.classList.add("historyCell");
}

const isBaktunCopernicusCell =
  row === 16 &&
  col === 11;

if(isBaktunCopernicusCell){
  cell.classList.add("historyCell");
}

const isBaktunTypewriterCell =
  row === 12 &&
  col === 12;

if(isBaktunTypewriterCell){
  cell.classList.add("historyCell");
}

const isBaktunHarveyCell =
  row === 0 &&
  col === 12;

if(isBaktunHarveyCell){
  cell.classList.add("historyCell");
}

const isBaktunPascalineCell =
  row === 1 &&
  col === 12;

if(isBaktunPascalineCell){
  cell.classList.add("historyCell");
}

const isBaktunMicrographiaCell =
  row === 2 &&
  col === 12;

if(isBaktunMicrographiaCell){
  cell.classList.add("historyCell");
}

const isBaktunNewtonCell =
  row === 3 &&
  col === 12;

if(isBaktunNewtonCell){
  cell.classList.add("historyCell");
}

const isBaktunNewcomenCell =
  row === 4 &&
  col === 12;

if(isBaktunNewcomenCell){
  cell.classList.add("historyCell");
}

const isBaktunBradleyCell =
  row === 5 &&
  col === 12;

if(isBaktunBradleyCell){
  cell.classList.add("historyCell");
}

const isBaktunFranklinCell =
  row === 6 &&
  col === 12;

if(isBaktunFranklinCell){
  cell.classList.add("historyCell");
}

const isBaktunAdamSmithCell =
  row === 7 &&
  col === 12;

if(isBaktunAdamSmithCell){
  cell.classList.add("historyCell");
}

const isBaktunHuttonCell =
  row === 8 &&
  col === 12;

if(isBaktunHuttonCell){
  cell.classList.add("historyCell");
}

const isBaktunDaltonCell =
  row === 9 &&
  col === 12;

if(isBaktunDaltonCell){
  cell.classList.add("historyCell");
}

const isBaktunNiepceCell =
  row === 10 &&
  col === 12;

if(isBaktunNiepceCell){
  cell.classList.add("historyCell");
}

const isBaktunRailwayCell =
  row === 11 &&
  col === 12;

if(isBaktunRailwayCell){
  cell.classList.add("historyCell");
}

const isBaktunWundtCell =
  row === 13 &&
  col === 12;

if(isBaktunWundtCell){
  cell.classList.add("historyCell");
}

const isBaktunEinsteinCell =
  row === 14 &&
  col === 12;

if(isBaktunEinsteinCell){
  cell.classList.add("historyCell");
}

const isBaktunHubbleCell =
  row === 15 &&
  col === 12;

if(isBaktunHubbleCell){
  cell.classList.add("historyCell");
}

const isBaktunDNACell =
  row === 16 &&
  col === 12;

if(isBaktunDNACell){
  cell.classList.add("historyCell");
}

const isBaktunWebCell =
  row === 18 &&
  col === 12;

if(isBaktunWebCell){
  cell.classList.add("historyCell");
}

const isBaktunGenomeCell =
  row === 19 &&
  col === 12;

if(isBaktunGenomeCell){
  cell.classList.add("historyCell");
}

const isBaktunJesusBirthCell =
  row === 17 &&
  col === 7;

if(isBaktunJesusBirthCell){
  cell.classList.add("historyCell");
}

const isBaktunJesusMovementCell =
  row === 18 &&
  col === 7;

if(isBaktunJesusMovementCell){
  cell.classList.add("historyCell");
}

const isBaktunJesusCrucifixionCell =
  row === 19 &&
  col === 7;

if(isBaktunJesusCrucifixionCell){
  cell.classList.add("historyCell");
}

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * BAKTUN_OPERATOR_DAYS
      + BigInt(row) * BAKTUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

    if(isBaktunWritingCell){

      toggleHistoryCell(
        "baktun",
        "actualiseren_oorsprong",
        cell
      );

    }

if(isBaktunPyramidCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_stroming",
    cell
  );

}

if(isBaktunIndusCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_interactie",
    cell
  );

}

if(isBaktunHammurabiCell){

  toggleHistoryCell(
    "baktun",
    "selecteren_relatie",
    cell
  );

}

if(isBaktunBronzeAgeCollapseCell){

  toggleHistoryCell(
    "baktun",
    "afstemmen_waarheid",
    cell
  );

}

if(isBaktunPhoenicianCell){

  toggleHistoryCell(
    "baktun",
    "ontvouwen_verbeelding",
    cell
  );

}

if(isBaktunDemocracyCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_structuur_athene",
    cell
  );

}

if(isBaktunRomanEmpireCell){

  toggleHistoryCell(
    "baktun",
    "actualiseren_manifestatie_rome",
    cell
  );

}

if(isBaktunChristianityCell){

  toggleHistoryCell(
    "baktun",
    "selecteren_bewustzijn",
    cell
  );

}

if(isBaktunHijraCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_relatie",
    cell
  );

}

if(isBaktunMovableTypeCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_expressie",
    cell
  );

}

if(isBaktunColumbusCell){

  toggleHistoryCell(
    "baktun",
    "vrijmaken_bewustzijn",
    cell
  );

}

if(isBaktunArpanetCell){

  toggleHistoryCell(
    "baktun",
    "verankeren_waarheid",
    cell
  );

}

if(isBaktunEarlyEgyptCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_informatie",
    cell
  );

}

if(isBaktunAkkadianEmpireCell){

  toggleHistoryCell(
    "baktun",
    "actualiseren_essentie",
    cell
  );

}

if(isBaktunUrNammuCell){

  toggleHistoryCell(
    "baktun",
    "vrijmaken_levenspad",
    cell
  );

}

if(isBaktunEarlyAlphabetCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_interactie",
    cell
  );

}

if(isBaktunKadeshCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_bewustzijn",
    cell
  );

}

if(isBaktunOlympicsCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_samenhang",
    cell
  );

}

if(isBaktunSocratesCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_waarheid",
    cell
  );

}

if(isBaktunArchimedesCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_grenzen",
    cell
  );

}

if(isBaktunPaperCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_potentieel",
    cell
  );

}

if(isBaktunBrahmaguptaCell){

  toggleHistoryCell(
    "baktun",
    "integreren_expressie",
    cell
  );

}

if(isBaktunIbnAlHaythamCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_relatie",
    cell
  );

}

if(isBaktunCopernicusCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_manifestatie",
    cell
  );

}

if(isBaktunTypewriterCell){

  toggleHistoryCell(
    "baktun",
    "verfijnen_structuur",
    cell
  );

}

if(isBaktunHarveyCell){

  toggleHistoryCell(
    "baktun",
    "afstemmen_oorsprong",
    cell
  );

}

if(isBaktunPascalineCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_informatie",
    cell
  );

}

if(isBaktunMicrographiaCell){

  toggleHistoryCell(
    "baktun",
    "integreren_verbeelding",
    cell
  );

}

if(isBaktunNewtonCell){

  toggleHistoryCell(
    "baktun",
    "doorgronden_potentieel",
    cell
  );

}

if(isBaktunNewcomenCell){

  toggleHistoryCell(
    "baktun",
    "verankeren_energie",
    cell
  );

}

if(isBaktunBradleyCell){

  toggleHistoryCell(
    "baktun",
    "ontsluiten_grenzen",
    cell
  );

}

if(isBaktunFranklinCell){

  toggleHistoryCell(
    "baktun",
    "vrijmaken_interactie",
    cell
  );

}

if(isBaktunAdamSmithCell){

  toggleHistoryCell(
    "baktun",
    "actualiseren_waarde",
    cell
  );

}

if(isBaktunHuttonCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_stroming",
    cell
  );

}

if(isBaktunDaltonCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_relatie",
    cell
  );

}

if(isBaktunNiepceCell){

  toggleHistoryCell(
    "baktun",
    "plaatsen_expressie",
    cell
  );

}

if(isBaktunRailwayCell){

  toggleHistoryCell(
    "baktun",
    "selecteren_levenspad",
    cell
  );

}

if(isBaktunWundtCell){

  toggleHistoryCell(
    "baktun",
    "afstemmen_bewustzijn",
    cell
  );

}

if(isBaktunEinsteinCell){

  toggleHistoryCell(
    "baktun",
    "transformeren_perspectief",
    cell
  );

}

if(isBaktunHubbleCell){

  toggleHistoryCell(
    "baktun",
    "integreren_spoor",
    cell
  );

}

if(isBaktunDNACell){

  toggleHistoryCell(
    "baktun",
    "doorgronden_manifestatie",
    cell
  );

}

if(isBaktunWebCell){

  toggleHistoryCell(
    "baktun",
    "ontsluiten_samenhang",
    cell
  );

}

if(isBaktunGenomeCell){

  toggleHistoryCell(
    "baktun",
    "vrijmaken_essentie",
    cell
  );

}

if(isBaktunJesusBirthCell){

  toggleHistoryCell(
    "baktun",
    "erkennen_waarheid",
    cell
  );

}

if(isBaktunJesusMovementCell){

  toggleHistoryCell(
    "baktun",
    "onderscheiden_samenhang",
    cell
  );

}

if(isBaktunJesusCrucifixionCell){

  toggleHistoryCell(
    "baktun",
    "plaatsen_essentie",
    cell
  );

}

  });
}


if(openLongCountLevel === "katun"){

  cell.classList.add("clickableLongCountCell");

  // 3 Akbal:
  // Onderscheiden + Verbeelding
  const isKatunAkbalCell =
    row === 2 &&
    col === 0;

  if(isKatunAkbalCell){
    cell.classList.add("historyCell");
  }

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * KATUN_OPERATOR_DAYS
      + BigInt(row) * KATUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();

    if(isKatunAkbalCell){

      toggleHistoryCell(
        "katun",
        "onderscheiden_verbeelding",
        cell
      );

    }
  });
}

if(openLongCountLevel === "tun"){

  cell.classList.add("clickableLongCountCell");

  cell.addEventListener("click", () => {

    const startDays =
      daysFromCivil(
        currentLongCountStart.year,
        currentLongCountStart.month,
        currentLongCountStart.day
      );

    const targetDays =
      startDays
      + BigInt(col) * TUN_OPERATOR_DAYS
      + BigInt(row) * TUN_WORKFIELD_DAYS;

    const targetDate =
      civilFromDays(targetDays);

    document.getElementById("dayInput").value =
      targetDate.day;

    document.getElementById("monthInput").value =
      targetDate.month;

    document.getElementById("yearInput").value =
      targetDate.year;

    goToDate();
  });
}
      const index =
        col * 20 + row;

      const cellTone =
        (index % 13) + 1;

      const toneImg =
        document.createElement("img");

      toneImg.src =
        `tones/tone${cellTone}.svg`;

      cell.appendChild(toneImg);
      longCountField.appendChild(cell);
    }
  }
}

let currentLongCountStart = null;
let openLongCountLevel = null;


const longCountTrigram =
  document.getElementById("longCountTrigram");

const longCountTrigrams = {

  alautun: "thunder",
  kinchiltun: "fire",
  kalabtun: "wind",
  piktun: "heaven",
  baktun: "lake",
  katun: "water",
  tun: "mountain",
  uinal: "earth"

};


function goToLongCountLevel(day, month, year, level){

if(openLongCountLevel === level){

  longCountField.style.display = "none";
  openLongCountLevel = null;
  currentLongCountStart = null;

  setActiveLongCountLevel(null);

  // Eventuele historische cel ook echt afsluiten
  if(activeHistoryCell){

    activeHistoryCell = null;
    activePage = "intro";

    document
      .querySelectorAll(".activeHistoryCell")
      .forEach(cell => {
        cell.classList.remove("activeHistoryCell");
      });

    document
      .querySelectorAll(".infoTab")
      .forEach(tab => {
        tab.classList.remove("activeTab");
      });

    updateActivePage();
  }

updateLongCountTrigram(null);

  return;
}

  currentLongCountStart = {
    day: day,
    month: month,
    year: year
  };

  document.getElementById("dayInput").value = day;
  document.getElementById("monthInput").value = month;
  document.getElementById("yearInput").value = year;

  goToDate();

// Historische cel van een andere laag sluiten
if(
  activeHistoryCell &&
  activeHistoryCell.level !== level
){
  activeHistoryCell = null;
  activePage = "intro";

  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(cell => {
      cell.classList.remove("activeHistoryCell");
    });

  updateActivePage();
}

  openLongCountLevel = level;

uinalActive = false;

setActiveLongCountLevel(level);

updateLongCountTrigram(level);

  buildLongCountField();

  longCountField.style.display = "grid";
}

let uinalActive = false;

function goToUinal(){

if(uinalActive){

  setActiveLongCountLevel(null);
  uinalActive = false;

  updateLongCountTrigram(null);

  return;
}

  // Eventueel open 13×20 veld sluiten
  longCountField.style.display = "none";
  openLongCountLevel = null;
  currentLongCountStart = null;

  // Eventuele actieve historische cel sluiten
  if(activeHistoryCell){

    activeHistoryCell = null;
    activePage = "intro";

    document
      .querySelectorAll(".activeHistoryCell")
      .forEach(cell => {
        cell.classList.remove("activeHistoryCell");
      });

    updateActivePage();
  }

  setActiveLongCountLevel("uinal");
  uinalActive = true;

updateLongCountTrigram("uinal");

  document.getElementById("dayInput").value = 20;
  document.getElementById("monthInput").value = 1;
  document.getElementById("yearInput").value = 2282;

  goToDate();
}

function updateLongCountTrigram(level){

  if(level === "hablatun"){

    longCountTrigram.src =
      "other/yin.svg";

    longCountTrigram.style.display = "block";

    return;
  }

  const trigram =
    longCountTrigrams[level];

  if(!trigram){

    longCountTrigram.style.display = "none";
    longCountTrigram.removeAttribute("src");

    return;
  }

  longCountTrigram.src =
    `trigrams/${trigram}.svg`;

  longCountTrigram.style.display = "block";
}

function setActiveLongCountLevel(level){

  document
    .querySelectorAll(".longCountLevel")
    .forEach(item => {
      item.classList.remove("active");
    });

  if(level){

    const activeItem =
      document.querySelector(
        `.longCountLevel[data-level="${level}"]`
      );

    if(activeItem){
      activeItem.classList.add("active");
    }
  }
}

// ===== RING =====

const hoverLayer =
  document.getElementById("hoverLayer");

const ringSegments =
  document.getElementById("ringSegments");

const ringAnimals =
  document.getElementById("ringAnimals");

const rootRing1 =
  document.getElementById("rootRing1");

const rootRing2 =
  document.getElementById("rootRing2");

const rootRing3 =
  document.getElementById("rootRing3");

const segments = [];
const hoverPath = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path"
);

const lockedPath = document.createElementNS(
  "http://www.w3.org/2000/svg",
  "path"
);

hoverPath.setAttribute("fill","white");
hoverPath.setAttribute("opacity","0");

hoverPath.setAttribute("stroke","black");
hoverPath.setAttribute("stroke-width","8");

hoverPath.setAttribute("stroke-linejoin","round");
hoverPath.setAttribute("stroke-linecap","round");

lockedPath.setAttribute("fill","white");
lockedPath.setAttribute("opacity","0");

lockedPath.setAttribute("stroke","black");
lockedPath.setAttribute("stroke-width","8");

lockedPath.setAttribute("stroke-linejoin","round");
lockedPath.setAttribute("stroke-linecap","round");

document
  .getElementById("hoverLayer")
  .appendChild(lockedPath);

document
  .getElementById("hoverLayer")
  .appendChild(hoverPath);

const ringAnimalItems = [];

for(let i=0;i<20;i++){

  let start = (-i * 18 + 90 + 9) * Math.PI/180;
  let end   = (-(i+1) * 18 + 90 + 9) * Math.PI/180;

  let rOuter = 310;
  let rInner = 260;
  let rMid   = (rOuter + rInner)/2;

  let x1 = Math.cos(start)*rOuter;
  let y1 = Math.sin(start)*rOuter;

  let x2 = Math.cos(end)*rOuter;
  let y2 = Math.sin(end)*rOuter;

  let x3 = Math.cos(end)*rInner;
  let y3 = Math.sin(end)*rInner;

  let x4 = Math.cos(start)*rInner;
  let y4 = Math.sin(start)*rInner;

  let path = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );

  let d = `
    M ${x1} ${y1}
    A ${rOuter} ${rOuter} 0 0 0 ${x2} ${y2}
    L ${x3} ${y3}
    A ${rInner} ${rInner} 0 0 1 ${x4} ${y4}
    Z
  `;

  path.setAttribute("d", d);

  path.setAttribute("fill", colors[i % 4]);

  path.setAttribute("opacity","1");

  path.setAttribute("stroke","black");

  path.setAttribute("stroke-width","2");

  ringSegments.appendChild(path);

  segments.push(path);

  // ===== POS =====
  let angle = -i * 18 + 90;

  let x = Math.cos(angle*Math.PI/180)*rMid;
  let y = Math.sin(angle*Math.PI/180)*rMid;

  const adjust = [
    {angle:180,x:0,y:0},
    {angle:162,x:0,y:0},
    {angle:144,x:0,y:0},
    {angle:126,x:0,y:0},
    {angle:108,x:0,y:0},
    {angle:90,x:0,y:0},
    {angle:72,x:0,y:0},
    {angle:54,x:0,y:0},
    {angle:36,x:0,y:0},
    {angle:18,x:0,y:0},
    {angle:0,x:0,y:0},
    {angle:-18,x:0,y:0},
    {angle:-36,x:0,y:0},
    {angle:-54,x:0,y:0},
    {angle:-72,x:0,y:0},
    {angle:-90,x:0,y:0},
    {angle:-108,x:0,y:0},
    {angle:-126,x:0,y:0},
    {angle:-144,x:0,y:0},
    {angle:-162,x:0,y:0}
  ];

  let adj = adjust[i];

  let img = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image"
  );

  img.setAttribute(
    "href",
    "animals/" + animalFiles[i]
  );

  img.setAttribute("width",38);
  img.setAttribute("height",38);

  img.setAttribute("x",-19);
  img.setAttribute("y",-19);

  img.setAttribute(
    "transform",
    `
    translate(${x + adj.x}, ${y + adj.y})
    rotate(${adj.angle + 180})
    `
  );

  ringAnimals.appendChild(img);
  ringAnimalItems.push(img);
}

// ===== SOULKIN ONDERSTE FRACTALRING =====

const rootFractalFiles = [
  "animals/13Ahau.svg",       // 00
  "animals/13Chicchan.svg",   // 01
  "animals/13Oc.svg",         // 11
  "animals/13Men.svg"         // 10
];

const rootRing1Items = [];

for(let i = 0; i < 4; i++){

  const angle =
    -i * (360 / 4) + 90;

  const radius = 225;

  const x =
    Math.cos(angle * Math.PI / 180) * radius;

  const y =
    Math.sin(angle * Math.PI / 180) * radius;


const fractalOrder = [2, 1, 0, 3];

const fractalIndex =
  fractalOrder[i % 4];

  const img =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );

  img.setAttribute(
    "href",
    rootFractalFiles[fractalIndex]
  );

  img.setAttribute("width", "24");
  img.setAttribute("height", "24");

  img.setAttribute("x", "-12");
  img.setAttribute("y", "-12");

  img.setAttribute(
    "transform",
    `
    translate(${x},${y})
    rotate(${angle + 270})
    `
  );

  img.setAttribute("opacity", "1");

  rootRing1.appendChild(img);
  rootRing1Items.push(img);
}

// ===== SOULKIN TWEEDE FRACTALRIJ: STATISCHE TEST =====
//
// 16 fractals totaal:
// 4 × Chicchan
// 4 × Oc
// 4 × Men
// 4 × Ahau

rootRing2.innerHTML = "";

const rootRing2Files = [
  // Vier Chicchan
  "animals/13Men.svg",
  "animals/13Men.svg",
  "animals/13Men.svg",
  "animals/13Men.svg",

  // Vier Oc
  "animals/13Oc.svg",
  "animals/13Oc.svg",
  "animals/13Oc.svg",
  "animals/13Oc.svg",

  "animals/13Chicchan.svg",
  "animals/13Chicchan.svg",
  "animals/13Chicchan.svg",
  "animals/13Chicchan.svg",

  // Vier Ahau
  "animals/13Ahau.svg",
  "animals/13Ahau.svg",
  "animals/13Ahau.svg",
  "animals/13Ahau.svg"
];

const rootRing2Items = [];

for(let i = 0; i < 16; i++){

  const angle =
    -i * (360 / 16) + 90;

  // Binnen de eerste fractalrij
  const radius = 238;

  const x =
    Math.cos(angle * Math.PI / 180) *
    radius;

  const y =
    Math.sin(angle * Math.PI / 180) *
    radius;

  const img =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );

  img.setAttribute(
    "href",
    rootRing2Files[i]
  );

  img.setAttribute("width", "24");
  img.setAttribute("height", "24");

  img.setAttribute("x", "-12");
  img.setAttribute("y", "-12");

  // Alleen het individuele plaatje wordt gericht.
  // rootRing2 zelf wordt niet geroteerd.
  img.setAttribute(
    "transform",
    `
    translate(${x},${y})
    rotate(${angle + 270})
    `
  );

  img.setAttribute("opacity", "1");

  rootRing2.appendChild(img);
  rootRing2Items.push(img);
}

// ===== SOULKIN DERDE FRACTALRIJ: STATISCHE TEST =====
//
// 64 fractals totaal:
// 16 × Chicchan
// 16 × Oc
// 16 × Men
// 16 × Ahau
//
// Voorlopig:
// - alles zichtbaar
// - geen reveal
// - geen groepsrotatie

rootRing3.innerHTML = "";

const rootRing3Files = [
  ...Array(16).fill("animals/13Men.svg"),
  ...Array(16).fill("animals/13Oc.svg"),
  ...Array(16).fill("animals/13Chicchan.svg"),
  ...Array(16).fill("animals/13Ahau.svg")
];

const rootRing3Items = [];

for(let i = 0; i < 64; i++){

  const angle =
    -i * (360 / 64) + 90;

  const radius = 251;

  const x =
    Math.cos(angle * Math.PI / 180) *
    radius;

  const y =
    Math.sin(angle * Math.PI / 180) *
    radius;

  const img =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "image"
    );

  img.setAttribute(
    "href",
    rootRing3Files[i]
  );

  img.setAttribute("width", "24");
  img.setAttribute("height", "24");

  img.setAttribute("x", "-12");
  img.setAttribute("y", "-12");

  img.setAttribute(
    "transform",
    `
    translate(${x},${y})
    rotate(${angle + 270})
    `
  );

  img.setAttribute("opacity", "1");

  rootRing3.appendChild(img);
  rootRing3Items.push(img);
}

function showOperatorText(){

  const operatorPages =
    wavespellOperatorLanguages[language] ||
    wavespell_operators_en;

  const operator =
    getWavespellOperator();

  if(operator === null){
    return;
  }

  const infoPanel =
    document.getElementById("infoPanel");

  const infoPanelTitle =
    document.getElementById("infoPanelTitle");

  const infoPanelContent =
    document.getElementById("infoPanelContent");

  infoPanelTitle.classList.remove("chakraTitle");

infoPanelTitle.textContent =
    lang.operator;

const operatorBackgrounds = {
  1:  "rgba(120,0,0,0.35)",       // rood
  2:  "rgba(255,220,0,0.25)",     // geel
  3:  "rgba(255,255,255,0.18)",   // wit
  4:  "rgba(80,180,255,0.25)",    // blauw
  5:  "rgba(120,0,0,0.35)",       // rood
  6:  "rgba(255,220,0,0.25)",     // geel
  7:  "rgba(255,255,255,0.18)",   // wit
  8:  "rgba(80,180,255,0.25)",    // blauw
  9:  "rgba(0,128,0,0.25)",       // groen
  10: "rgba(120,0,0,0.35)",       // rood
  11: "rgba(255,220,0,0.25)",     // geel
  12: "rgba(255,255,255,0.18)",   // wit
  13: "rgba(80,180,255,0.25)"     // blauw
};

infoPanel.style.backgroundImage = "none";
infoPanel.style.backgroundColor =
  operatorBackgrounds[operator];

  infoPanelContent.innerHTML =
    operatorPages[operator] ?? "";
}

function showWavespellText(){

  const infoPanel =
    document.getElementById("infoPanel");

  const infoPanelTitle =
    document.getElementById("infoPanelTitle");

  const infoPanelContent =
    document.getElementById("infoPanelContent");

  const workfieldSeal =
    getWavespellWorkfieldSeal();

  const workfieldPages =
    wavespellWorkfieldLanguages[language] ||
    wavespell_workfields_en;


  // ===== TITEL =====

  infoPanelTitle.classList.remove("chakraTitle");

infoPanelTitle.textContent =
    lang.workfield;


  // ===== TEKST =====

  infoPanelContent.innerHTML =
    workfieldPages[workfieldSeal + 1] ?? "";


  // ===== WAVESPELL-KLEUR =====
  // 11/11 = toon 1 van eerste volledige wavespell.
  // 10/11 hoort visueel al bij rood.

  const wavespellColorStart =
    WAVESPELL_FRACTAL_START_DAY + 1;

  const wavespellBlock =
    dayOffset < wavespellColorStart
      ? 0
      : Math.floor(
          (dayOffset - wavespellColorStart) / 13
        );

  const colorIndex =
    ((wavespellBlock % 4) + 4) % 4;


  // ===== ZELFDE ACHTERGRONDEN ALS CHAKRA'S =====

  const wavespellBackgrounds = [
    "rgba(120,0,0,0.35)",       // rood    = Muladhara
    "rgba(255,255,255,0.18)",   // wit     = Sahasrara
    "rgba(80,180,255,0.25)",    // blauw   = Vishuddha
    "rgba(255,220,0,0.25)"      // geel    = Manipura
  ];

  infoPanel.style.backgroundImage = "none";
  infoPanel.style.background =
    wavespellBackgrounds[colorIndex];
}

function getWavespellOperator(){

  const firstDay = Number(
    daysFromCivil(-17264374702, 11, 10) -
    daysFromCivil(1982, 8, 22)
  );

  const normalStart = Number(
    daysFromCivil(-17264374702, 11, 15) -
    daysFromCivil(1982, 8, 22)
  );

  if(dayOffset < firstDay){
    return null;
  }

  if(dayOffset < normalStart){

const specialOperators = [
  1,   // 10/11
  6,   // 11/11
  11,  // 12/11
  3,   // 13/11
  8    // 14/11
];

    return specialOperators[
      dayOffset - firstDay
    ];
  }

  // 15/11 begint Integreren (9), telkens 20 dagen.
  const block =
    Math.floor(
      (dayOffset - normalStart) / 20
    );

  return ((8 + block) % 13) + 1;
}

function getWavespellWorkfieldSeal(){

  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

  // 10/11 t/m 14/11:
  // Imix → Chicchan → Muluc → Ben → Caban
  const specialIndex =
    dayOffset - (ROOT_OFFSET - 4);

  if(specialIndex >= 0 && specialIndex <= 4){

    return [
      0,   // Imix
      4,   // Chicchan
      8,   // Muluc
      12,  // Ben
      16   // Caban
    ][specialIndex];
  }

  // Vanaf 15/11 normale Tzolkin:
  // workfield wisselt op toon 1, 5, 9 en 13
  let back;

  if(tone === 13){
    back = 0;
  } else if(tone >= 9){
    back = tone - 9;
  } else if(tone >= 5){
    back = tone - 5;
  } else {
    back = tone - 1;
  }

  return ((seal - back) % 20 + 20) % 20;
}


function getHeartPoint(sealIndex, radius = 255){

  const angle =
    (-sealIndex * 18 + 90) *
    Math.PI / 180;

  const x =
    Math.cos(angle) * radius;

  const y =
    Math.sin(angle) * radius;

  return `${x},${y}`;
}

const heartTriangleA =
  document.getElementById("heartTriangleA");

const heartTriangleB =
  document.getElementById("heartTriangleB");

heartTriangleA.setAttribute(
  "points",
  [
    getHeartPoint(3),   // Kan
    getHeartPoint(9),   // Oc
    getHeartPoint(16)   // Caban
  ].join(" ")
);

heartTriangleB.setAttribute(
  "points",
  [
    getHeartPoint(6),   // Manik
    getHeartPoint(13),  // Ix
    getHeartPoint(19)   // Ahau
  ].join(" ")
);

window.updateLanguage = function(){

  document.querySelector(".aboutTitle").innerHTML =
    lang.aboutTitle;

  document.querySelector(".aboutText").innerHTML =
    lang.aboutText;

  document.getElementById("stepButton").innerHTML =
    lang.step;

  document.getElementById("mobileStepButton").innerHTML =
    lang.step;

  document.getElementById("goDateButton").innerHTML =
    lang.go;

  const supportText =
    document.getElementById("supportText");

  if(supportText){

    supportText.innerHTML =
      `
      ${lang.supportText}

<a href="qub/index.html">Qub</a>

      `;
  }

  render();
};


const HAAB_START_DAY = Number(
  daysFromCivil(-863216567, 6, 27) -
  daysFromCivil(1982, 8, 22)
);

function getHaabFromLCDays(lcDays){

  const haabMonths = [
    "Pop",
    "Wo",
    "Sip",
    "Sotz'",
    "Sek",
    "Xul",
    "Yaxk'in",
    "Mol",
    "Ch'en",
    "Yax",
    "Sak'",
    "Keh",
    "Mak",
    "K'ank'in",
    "Muwan",
    "Pax",
    "K'ayab",
    "Kumk'u"
  ];

// Long Count 0.0.0.0.0 = 8 Kumk'u
const haabPosition =
  ((lcDays + 348) % 365 + 365) % 365;

  if(haabPosition < 360){

    const monthIndex =
      Math.floor(haabPosition / 20);

    const day =
      haabPosition % 20;

    return `${day} ${haabMonths[monthIndex]}`;
  }

  return `${haabPosition - 360} Wayeb`;
}

const toneFractals = [
  "101", // 1 Ram
  "000", // 2 Stier
  "111", // 3 Tweelingen
  "010", // 4 Kreeft
  "101", // 5 Leeuw
  "000", // 6 Maagd
  "111", // 7 Weegschaal
  "010", // 8 Schorpioen
  "yang", // 9 Ophiuchus
  "001", // 10 Boogschutter
  "100", // 11 Steenbok
  "011", // 12 Waterman
  "110"  // 13 Vissen
];

// ===== RENDER =====
function render(){

  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

  const rootStage =
    dayOffset - ROOT_OFFSET + 5;

const heartChakra =
  document.getElementById("HeartChakra");

heartChakra.setAttribute(
  "opacity",
  dayOffset === HEART_CHAKRA_DAY ? "1" : "0"
);

// Planetary cycle
const planetDays =
  dayOffset - PLANET_ANCHOR_DAY;

const mercuryStep =
  ((planetDays % 117) + 117) % 117;

const station819 =
  ((planetDays % 819) + 819) % 819 === 0;

// Welk 819-station zijn we?
const stationNumber =
  Math.floor(planetDays / 819);

// Ieder volgend 819-station gaat één werkveld terug
const planetWorkfieldSeal =
  ((16 - stationNumber) % 20 + 20) % 20;

// Verberg eerst de vier speciale planeten
planetVenus.style.opacity   = "0";
planetSaturn.style.opacity  = "0";
planetJupiter.style.opacity = "0";
planetMars.style.opacity    = "0";

// Alleen tonen op het exacte 819-station
if (station819) {

  // Venus: Caban, Eb, Manik, Ik
  if ([16, 11, 6, 1].includes(planetWorkfieldSeal)) {
    planetVenus.style.opacity = "1";
  }

  // Saturnus: Cib, Oc, Kan
  if ([15, 9, 3].includes(planetWorkfieldSeal)) {
    planetSaturn.style.opacity = "1";
  }

  // Jupiter: Akbal
  if (planetWorkfieldSeal === 2) {
    planetJupiter.style.opacity = "1";
  }

  // Mars: Ik
  if (planetWorkfieldSeal === 1) {
    planetMars.style.opacity = "1";
  }
}

planetWorkfield.setAttribute(
  "src",
  `animals/${animalFiles[planetWorkfieldSeal]}`
);

planetWorkfield.style.opacity = "1";

const planetsVisible =
  dayOffset >= PLANET_DISPLAY_START_DAY;

planetLayer.style.display =
  planetsVisible ? "block" : "none";

// Heeft dit 819-station een bijzondere planeet?
const hasSpecialPlanet =
  station819 &&
  [16, 15, 11, 9, 6, 3, 2, 1].includes(planetWorkfieldSeal);

if (mercuryStep === 0 && !hasSpecialPlanet) {

  planetMercury.style.opacity = "1";

  if (station819) {
    planetMercury.style.width = "32px";
    planetMercury.style.height = "32px";
    planetMercury.style.left = "0px";
    planetMercury.style.top = "0px";
  } else {
    planetMercury.style.width = "18px";
    planetMercury.style.height = "18px";
    planetMercury.style.left = "7px";
    planetMercury.style.top = "7px";
  }

} else {
  planetMercury.style.opacity = "0";
}


// ===== BINNENSTE 4-RING ONTVOUWING =====

// 10/11 en eerder: niets.
// 11/11: 1 positie.
// 12/11: 2 posities.
// 13/11: 3 posities.
// 14/11 en verder: alle 4 posities.
const rootRing1VisibleCount =
  Math.max(
    0,
    Math.min(4, rootStage - 1)
  );

const ROOT_RING1_REVEAL_OFFSET = 1;

rootRing1Items.forEach((item, index) => {

  const revealIndex =
    (index + ROOT_RING1_REVEAL_OFFSET) % 4;

  item.setAttribute(
    "opacity",
    revealIndex < rootRing1VisibleCount ? "1" : "0"
  );

});

// ===== TWEEDE FRACTALRIJ REVEAL =====
//
// Voor 5/12: niets zichtbaar
// Vanaf 5/12: elke dag één fractal erbij
// 20/12: alle 16 zichtbaar

const ROOT_RING2_START_DAY = Number(
  daysFromCivil(-17264374702, 12, 5) -
  daysFromCivil(1982, 8, 22)
);

const rootRing2VisibleCount =
  Math.max(
    0,
    Math.min(
      16,
      dayOffset - ROOT_RING2_START_DAY + 1
    )
  );

const ROOT_RING2_REVEAL_OFFSET = 0;

rootRing2Items.forEach((item, index) => {

  const revealIndex =
    (index + ROOT_RING2_REVEAL_OFFSET) % 16;

  item.setAttribute(
    "opacity",
    revealIndex < rootRing2VisibleCount
      ? "1"
      : "0"
  );

});


// Eerst alle buitenste fractals verbergen
ringAnimalItems.forEach(item => {
  item.setAttribute("opacity", "0");
});

// Elke entry is de datum waarop die fractal voor het eerst verschijnt
const fractalRevealDates = [
  { month: 11, day: 11, seal: 4  }, // Chicchan
  { month: 11, day: 12, seal: 9  }, // Oc
  { month: 11, day: 13, seal: 14 }, // Men
  { month: 11, day: 14, seal: 19 }, // Ahau
  { month: 11, day: 15, seal: 0  }, // Imix
  { month: 11, day: 16, seal: 1  }, // Ik
  { month: 11, day: 17, seal: 2  }, // Akbal
  { month: 11, day: 18, seal: 3  }, // Kan

  // 19/11 pauzedag

  { month: 11, day: 20, seal: 5  }, // Cimi
  { month: 11, day: 21, seal: 6  }, // Manik
  { month: 11, day: 22, seal: 7  }, // Lamat
  { month: 11, day: 23, seal: 8  }, // Muluc

  // 24/11 pauzedag

  { month: 11, day: 25, seal: 10 }, // Chuen
  { month: 11, day: 26, seal: 11 }, // Eb
  { month: 11, day: 27, seal: 12 }, // Ben
  { month: 11, day: 28, seal: 13 }, // Ix

  // 29/11 pauzedag

  { month: 11, day: 30, seal: 15 }, // Cib
  { month: 12, day: 1,  seal: 16 }, // Caban
  { month: 12, day: 2,  seal: 17 }, // Etznab
  { month: 12, day: 3,  seal: 18 }  // Cauac
];

// Huidige absolute dag
const currentAbsoluteDay =
  daysFromCivil(1982, 8, 22) + BigInt(dayOffset);

// Toon alles waarvan de reveal-datum bereikt is
fractalRevealDates.forEach(entry => {

  const revealAbsoluteDay =
    daysFromCivil(
      -17264374702,
      entry.month,
      entry.day
    );

  if(currentAbsoluteDay >= revealAbsoluteDay){

    ringAnimalItems[entry.seal]
      .setAttribute("opacity", "1");
  }
});

// ===== DERDE FRACTALRIJ REVEAL =====
//
// Voor 21/12: niets zichtbaar
// Vanaf 21/12: iedere dag één fractal erbij
// Eindigt op 22/2 met alle 64 zichtbaar

const ROOT_RING3_START_DAY = Number(
  daysFromCivil(-17264374702, 12, 21) -
  daysFromCivil(1982, 8, 22)
);

const rootRing3VisibleCount =
  Math.max(
    0,
    Math.min(
      64,
      dayOffset - ROOT_RING3_START_DAY + 1
    )
  );

const ROOT_RING3_REVEAL_OFFSET = 0; // eventueel later afstellen

rootRing3Items.forEach((item, index) => {

  const revealIndex =
    (index + ROOT_RING3_REVEAL_OFFSET) % 64;

  item.setAttribute(
    "opacity",
    revealIndex < rootRing3VisibleCount
      ? "1"
      : "0"
  );

});

// ===== VIER VASTE ROOT FRACTALS =====

  let [x,y] = pts[pos];

  document.getElementById("dot")
    .setAttribute(
      "transform",
      `translate(${x},${y})`
    );

const dot =
  document.getElementById("dot");

const dotColor =
  tone % 2 === 1
    ? "white"
    : "black";

dot.setAttribute("fill", dotColor);
dot.setAttribute("fill-opacity", "1");

  document.getElementById("rotGroup")
    .setAttribute(
      "transform",
      `rotate(${rot})`
    );

  document.getElementById("toneSymbol")
    .setAttribute(
      "href",
      `tones/tone${tone}.svg`
    );

const toneSymbol =
  document.getElementById("toneSymbol");

document.getElementById("dot")
  .setAttribute("opacity", dotVisible ? "1" : "0");

const isHeartDay =
  night === 1 &&
  !beforeOrAtRoot;

const heartType =
  isHeartDay
    ? getHeartType(seal)
    : null;

const heartHoverOnly =
  isHeartDay;

if(beforeOrAtRoot){

  toneSymbol.setAttribute("opacity","0");

} else if(
  heartHoverOnly &&
  activePage !== "muladhara"
){

  // Heart-dag: verborgen, behalve wanneer 1e chakra geselecteerd is
  toneSymbol.setAttribute("opacity","0");

} else {

  // Alle normale dagen: standaard zichtbaar
  toneSymbol.setAttribute("opacity","1");
}

const wavespellFractal =
  document.getElementById("wavespellFractal");

wavespellFractal.style.cursor = "pointer";

const wavespellButton =
  document.getElementById("wavespellButton");

const wavespellColorStart =
  WAVESPELL_FRACTAL_START_DAY + 1; // 11/11 = toon 1

const wavespellBlock =
  dayOffset < wavespellColorStart
    ? 0
    : Math.floor(
        (dayOffset - wavespellColorStart) / 13
      );

const wavespellColors = [
  "rgba(255,0,0,0.7)",       // rood
  "rgba(255,255,255,0.7)",   // wit
  "rgba(0,0,255,0.7)",       // blauw
  "rgba(255,255,0,0.7)"      // geel
];

if(dayOffset < WAVESPELL_FRACTAL_START_DAY){

  wavespellButton.setAttribute("opacity", "0");
  wavespellButton.style.pointerEvents = "none";

  // Wavespell bestaat hier nog niet
  if(wavespellActive){

    wavespellActive = false;

    activePage = "intro";

    document
      .querySelectorAll(".infoTab")
      .forEach(tab => {
        tab.classList.remove("activeTab");
      });

    updateActivePage();
  }

} else {

  const colorIndex =
    ((wavespellBlock % 4) + 4) % 4;

  wavespellButton.setAttribute(
    "fill",
    wavespellColors[colorIndex]
  );

  wavespellButton.setAttribute("opacity", "1");
  wavespellButton.style.pointerEvents = "auto";
}

const NORMAL_WAVESPELL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 14) -
  daysFromCivil(1982, 8, 22)
);


if(dayOffset < WAVESPELL_FRACTAL_START_DAY){

  wavespellFractal.setAttribute("opacity", "0");

} else if(dayOffset < NORMAL_WAVESPELL_START_DAY){

  const unfoldingWorkfields = [
    "animals/imix.svg",         // 10/11 Oorsprong
    "animals/13Chicchan.svg",   // 11/11 Energie
    "animals/muluc.svg",        // 12/11 Stroming
    "animals/ben.svg",          // 13/11 Structuur
  ];

  wavespellFractal.setAttribute(
    "href",
    unfoldingWorkfields[
      dayOffset - WAVESPELL_FRACTAL_START_DAY
    ]
  );

  wavespellFractal.setAttribute("opacity", "1");

} else {

  // Wavespell-perspectief wisselt op tonen 1, 5, 9 en 13.
  // Bepaal hoeveel dagen we terug moeten naar het laatste anker.
  let back;

  if(tone >= 9){
    back = tone - 9;
  } else if(tone >= 5){
    back = tone - 5;
  } else {
    back = tone - 1;
  }

  // Toon 13 is zelf een anker en hoort niet bij de 9-groep.
  if(tone === 13){
    back = 0;
  }

  const perspectiveSeal =
    ((seal - back) % 20 + 20) % 20;

  wavespellFractal.setAttribute(
    "href",
    `animals/${animalFiles[perspectiveSeal]}`
  );

  wavespellFractal.setAttribute("opacity", "1");
}


const operatorButton =
  document.getElementById("operatorButton");

const tzolkinOperatorFractal =
  document.getElementById("tzolkinOperatorFractal");

const TZOLKIN_OPERATOR_NORMAL_DAY = Number(
  daysFromCivil(-17264374702, 11, 14) -
  daysFromCivil(1982, 8, 22)
);

if(dayOffset < TZOLKIN_OPERATOR_START_DAY){

  tzolkinOperatorFractal.setAttribute("opacity", "0");

} else {

  let operatorTone;

  if(dayOffset < TZOLKIN_OPERATOR_NORMAL_DAY){

    // 10/11–13/11:
    // +5-patroon: 1 → 6 → 11 → 3
    const unfoldingOperators = [
      1,
      6,
      11,
      3
    ];

    operatorTone =
      unfoldingOperators[
        dayOffset - TZOLKIN_OPERATOR_START_DAY
      ];

  } else {

    // Vanaf 14/11 loopt de normale 260-lus,
    // die hier begint bij operator 8.
    operatorTone =
      Math.floor(kin / 20) + 1;

  }

  const operatorFractal =
    toneFractals[operatorTone - 1];

  tzolkinOperatorFractal.setAttribute(
    "href",
    operatorTone === 9
      ? "other/yang.svg"
      : `trigrams/${operatorFractal}.svg`
  );

  tzolkinOperatorFractal.setAttribute("opacity", "1");
}



function toggleOperator(){

  if(dayOffset < OPERATOR_FIRST_DAY){
    return;
  }

  if(operatorActive){

    operatorActive = false;

    render();

    activePage = "intro";
    updateActivePage();

    return;
  }

  // Alle andere panelen uit
  closeSources();
  closeWavespell();

  activeHistoryCell = null;

  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(cell => {
      cell.classList.remove("activeHistoryCell");
    });

  document
    .querySelectorAll(".infoTab")
    .forEach(tab => {
      tab.classList.remove("activeTab");
    });

  activePage = "intro";
  operatorActive = true;

  render();
  showOperatorText();
}

operatorButton.onclick = toggleOperator;
tzolkinOperatorFractal.onclick = toggleOperator;


const OPERATOR_NORMAL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 15) -
  daysFromCivil(1982, 8, 22)
);

const OPERATOR_FIRST_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const operatorBackgrounds = {
  red:    "rgba(255,0,0,0.7)",       // rood
  yellow: "rgba(255,255,0,0.7)",     // geel
  white:  "rgba(255,255,255,0.7)",   // wit
  blue:   "rgba(0,0,255,0.7)",       // blauw
  green:  "rgba(0,128,0,0.7)"

};

const operatorLift =
  operatorActive ? -4 : 0;

operatorButton.setAttribute(
  "transform",
  `translate(0 ${operatorLift})`
);

tzolkinOperatorFractal.setAttribute(
  "transform",
  `translate(0 ${operatorLift})`
);

operatorButton.onclick = toggleOperator;
tzolkinOperatorFractal.onclick = toggleOperator;

if(dayOffset < OPERATOR_FIRST_DAY){

  operatorButton.setAttribute("opacity", "0");
  operatorButton.style.pointerEvents = "none";

} else {

  operatorButton.setAttribute("opacity", "1");
  operatorButton.style.pointerEvents = "auto";

  let operatorColor;

  // 10/11 t/m 14/11
  if(dayOffset < OPERATOR_NORMAL_START_DAY){

    const specialIndex =
      dayOffset - OPERATOR_FIRST_DAY;

    const specialColors = [
      "red",     // 10/11
      "yellow",  // 11/11
      "yellow",  // 12/11
      "white",   // 13/11
      "blue"     // 14/11
    ];

    operatorColor =
      specialColors[specialIndex];

  } else {

    // 15/11 begint operator 9:
    // 20 dagen groen.

    const block =
      Math.floor(
        (dayOffset - OPERATOR_NORMAL_START_DAY) / 20
      );

    const colors = [
      "green",   // 9
      "red",     // 10
      "yellow",  // 11
      "white",   // 12
      "blue",    // 13
      "red",     // 1
      "yellow",  // 2
      "white",   // 3
      "blue",    // 4
      "red",     // 5
      "yellow",  // 6
      "white",   // 7
      "blue"     // 8
    ];

    operatorColor =
      colors[block % 13];
  }

  operatorButton.setAttribute(
    "fill",
    operatorBackgrounds[operatorColor]
  );
}

// ===== HEXAGRAM-ONTVOUWING =====

const hexagram =
  document.getElementById("hexagram");

const HEXAGRAM_START_DAY = Number(
  daysFromCivil(-17264374702, 12, 21) -
  daysFromCivil(1982, 8, 22)
);

const TWO_BIT_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 11) -
  daysFromCivil(1982, 8, 22)
);

const FOUR_BIT_TOP_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 15) -
  daysFromCivil(1982, 8, 22)
);

const FOUR_BIT_BOTTOM_START_DAY = Number(
  daysFromCivil(-17264374702, 12, 5) -
  daysFromCivil(1982, 8, 22)
);


// De zestien 4-bit werkvelden in de volgorde
// waarin Soulkin ze vanaf 5/12 vormt.
const workfieldFractalCodes = [
  "0101", // Muluc
  "1101", // Ben
  "1001", // Caban
  "0001", // Imix

  "0111", // Cimi
  "1111", // Ix
  "1011", // Etznab
  "0011", // Ik

  "0110", // Manik
  "1110", // Chuen
  "1010", // Cauac
  "0010", // Akbal

  "0100", // Lamat
  "1100", // Eb
  "1000", // Cib
  "0000"  // Kan
];

const UNFOLD_Y = 341;   // nieuwe reeks iets omlaag
const HEXAGRAM_Y = 300; // bestaande h1-h64

if(dayOffset < HEXAGRAM_START_DAY){
  hexagram.setAttribute("y", UNFOLD_Y);
} else {
  hexagram.setAttribute("y", HEXAGRAM_Y);
}

// ===== 0-POSITIE =====
// t/m 9/11: één Yang-lijn

if(dayOffset < PENTAGRAM_FRACTAL_START_DAY){

  hexagram.setAttribute(
    "href",
    "hexagrams/1bit/yang_uppercenter.svg"
  );

  hexagram.setAttribute("opacity", "1");


// ===== EERSTE OPENING =====
// 10/11: één Yin-lijn

} else if(dayOffset < TWO_BIT_START_DAY){

  hexagram.setAttribute(
    "href",
    "hexagrams/1bit/yin_uppercenter.svg"
  );

  hexagram.setAttribute("opacity", "1");


// ===== 2 BIT =====
// 11/11 Chicchan 01
// 12/11 Oc       11
// 13/11 Men      10
// 14/11 Ahau     00

} else if(dayOffset < FOUR_BIT_TOP_START_DAY){

  const twoBitCodes = [
    "01",
    "11",
    "10",
    "00"
  ];

  const index =
    dayOffset - TWO_BIT_START_DAY;

  hexagram.setAttribute(
    "href",
    `hexagrams/2bit/${twoBitCodes[index]}.svg`
  );

  hexagram.setAttribute("opacity", "1");


// ===== EERSTE 4-BIT ONTVOUWING =====
// 15/11 t/m 4/12
//
// Dit zijn de gewone twintig kalenderwerkvelden.
// De vier 2-bit basisvelden blijven 2-bit.
// De zestien andere velden worden als 4-bit getoond.
//
// We gebruiken LOWER:
// de nieuwe lijnen groeien dus naar BENEDEN.

} else if(dayOffset < FOUR_BIT_BOTTOM_START_DAY){

  const revealIndex =
    dayOffset - FOUR_BIT_TOP_START_DAY;

  const revealCodes = [
    "0001", // Imix
    "0011", // Ik
    "0010", // Akbal
    "0000", // Kan

    "01",   // Chicchan

    "0111", // Cimi
    "0110", // Manik
    "0100", // Lamat
    "0101", // Muluc

    "11",   // Oc

    "1110", // Chuen
    "1100", // Eb
    "1101", // Ben
    "1111", // Ix

    "10",   // Men

    "1000", // Cib
    "1001", // Caban
    "1011", // Etznab
    "1010", // Cauac

    "00"    // Ahau
  ];

  const code =
    revealCodes[revealIndex];

  if(code.length === 2){

    hexagram.setAttribute(
      "href",
      `hexagrams/2bit/${code}.svg`
    );

  } else {

    hexagram.setAttribute(
      "href",
      `hexagrams/4bit/lower/${code}.svg`
    );
  }

  hexagram.setAttribute("opacity", "1");


// ===== TWEEDE 4-BIT ONTVOUWING =====
// 5/12 t/m 20/12
//
// Nu dezelfde 4-bit geometrie aan de andere kant:
// de vier lijnen staan UPPER en laten onderaan
// ruimte voor de laatste uitbreiding naar 6 bit.

} else if(dayOffset < HEXAGRAM_START_DAY){

  const fractalIndex =
    dayOffset - FOUR_BIT_BOTTOM_START_DAY;

  const code =
    workfieldFractalCodes[fractalIndex];

  hexagram.setAttribute(
    "href",
    `hexagrams/4bit/upper/${code}.svg`
  );

  hexagram.setAttribute("opacity", "1");


// ===== 6 BIT =====
// vanaf 21/12:
// bestaande 64 hexagrammen

} else {

  const hex =
    ((dayOffset - HEXAGRAM_START_DAY) % 64 + 64) % 64 + 1;

  hexagram.setAttribute(
    "href",
    `hexagrams/h${hex}.svg`
  );

  hexagram.setAttribute("opacity", "1");
}


// ===== KLEURENRING ONTVOUWING =====
//
// Voor 10/11: alles zwart.
// Daarna verschijnen de werkvelden in Fibonacci-blokken:
// 10/11: 1  = Ahau
// 11/11: 1  = Chicchan
// 12/11: 2  = Oc + Men
// 13/11: 3  = Imix + Ik + Akbal
// 14/11: 5  = Kan + Cimi + Manik + Lamat + Muluc
// 15/11: 8  = Chuen + Eb + Ben + Ix + Cib + Caban + Etznab + Cauac

const fibonacciRevealCounts = [
  0,  // vóór 10/11
  1,  // 10/11
  2,  // 11/11
  4,  // 12/11
  7,  // 13/11
  12, // 14/11
  20  // 15/11 en verder
];

const visibleFieldCount =
  fibonacciRevealCounts[
    Math.max(
      0,
      Math.min(6, rootStage)
    )
  ];

// Volgorde waarin de twintig afzonderlijke ringsegmenten verschijnen.
// Dit is de bestaande Soulkin-volgorde in Fibonacci-blokken 1|1|2|3|5|8.
const fibonacciRevealOrder = [
  4,      // Chicchan — 10/11
  9,      // Oc — 11/11
  14, 19, // Men + Ahau — 12/11
  0, 1, 2,// Imix, Ik, Akbal
  3, 5, 6, 7, 8,
  10, 11, 12, 13, 15, 16, 17, 18
];

const visibleFields = new Set(
  fibonacciRevealOrder.slice(0, visibleFieldCount)
);

segments.forEach((segment, index) => {
  segment.setAttribute(
    "fill",
    visibleFields.has(index)
      ? colors[index % 4]
      : "black"
  );
});

const ringSeal = ringKin % 20;

ringSegments.setAttribute("transform", `rotate(${ringSeal * 18})`);
hoverLayer.setAttribute("transform", `rotate(${ringSeal * 18})`);
ringAnimals.setAttribute("transform", `rotate(${ringSeal * 18})`);


const ROOT_RING_STEP =
  360 / 4;

const rootRing1Angle =
  (mechanismKin - 1) * ROOT_RING_STEP;

rootRing1.setAttribute(
  "transform",
  `rotate(${rootRing1Angle})`
);


// ===== DOORLOPENDE FRACTALPOSITIE =====
//
// Op 14/11 staat het mechanisme bewust op kin 159.
// Vanaf daar blijft deze teller iedere dag oplopen,
// zonder na kin 259 terug te springen naar 0.

const continuousMechanismKin =
  159 + (dayOffset - ROOT_OFFSET);


// ===== TWEEDE FRACTALRING =====

const ROOT_RING2_STEP =
  360 / 16;

const rootRing2Phase =
  ((continuousMechanismKin - 4) % 16 + 16) % 16;

const rootRing2Angle =
  rootRing2Phase * ROOT_RING2_STEP;

rootRing2.setAttribute(
  "transform",
  `rotate(${rootRing2Angle})`
);


// ===== DERDE FRACTALRING =====

const ROOT_RING3_STEP =
  360 / 64;

const rootRing3Phase =
  ((continuousMechanismKin - 4) % 64 + 64) % 64;

const rootRing3Angle =
  rootRing3Phase * ROOT_RING3_STEP;

rootRing3.setAttribute(
  "transform",
  `rotate(${rootRing3Angle})`
);

let sacredAlignment =
  night === 1 &&
  sacredSeals.includes(seal);

// ===== I-CHING ROTATIE =====

// G9 en G1 = stil
// daarna 7 stappen

let iChingStep = 0;

if(night >= 2){

  iChingStep = night - 1;
}

// 45 graden per stap
let iChingRotation = iChingStep * 45;

document.getElementById("iChing")
  .setAttribute(
    "transform",
    `
    rotate(${iChingRotation})
    `
  );

const wavespellLift =
  wavespellActive ? -4 : 0;

wavespellButton.setAttribute(
  "transform",
  `translate(0 ${wavespellLift})`
);

wavespellFractal.setAttribute(
  "transform",
  `translate(0 ${wavespellLift})`
);

// ===== HEART KRUIS =====

let heartOpacity = 0;
let heartScale = 1;

if(isHeartDay){

    switch(heartType){

        case "super":
            heartOpacity = 1;
            heartScale = 1;
            break;

        case "special":
            heartOpacity = 0.8;
            heartScale = 0.8;
            break;

        default: // normal
            heartOpacity = 0.6;
            heartScale = 0.6;
            break;
    }

}


let backgroundOpacity = 0.1;

if(isHeartDay){

  switch(heartType){

    case "super":
      backgroundOpacity = 1;
      break;

    case "special":
      backgroundOpacity = 0.8;
      break;

    default:
      backgroundOpacity = 0.6;
      break;
  }
}

let heartAngle =
  ringSeal * 18;

const heartTransform = `
rotate(${heartAngle})
scale(${heartScale})
`;

heartTriangleA.setAttribute("transform", heartTransform);
heartTriangleB.setAttribute("transform", heartTransform);

heartTriangleA.setAttribute("opacity", heartOpacity);
heartTriangleB.setAttribute("opacity", heartOpacity);


// ===== SPECIALE HART =====

const superHeart =
  tone === 13 &&
  night === 5 &&
  seal === 19 &&
  !beforeOrAtRoot;

const specialHeart =
  tone === 13 &&
  night === 1 &&
  [19].includes(seal);


// ===== I-CHING ONTVOUWING + ZICHTBAAR =====

if(
  dayOffset >= ICHING_UNFOLD_START_DAY &&
  dayOffset < ICHING_UNFOLD_START_DAY + 5
){

  const iChingUnfoldingFiles = [
    "other/iching_1.svg", // 10/11
    "other/iching_2.svg", // 11/11
    "other/iching_2.svg", // 12/11
    "other/iching_3.svg", // 13/11
    "other/iching_4.svg"  // 14/11
  ];

  iChing.setAttribute(
    "href",
    iChingUnfoldingFiles[
      dayOffset - ICHING_UNFOLD_START_DAY
    ]
  );

  iChing.setAttribute("opacity","1");

} else {

  // Normale I Ching vanaf 15/11
  iChing.setAttribute(
    "href",
    "other/iching.svg"
  );

  if(beforeOrAtRoot){

    iChing.setAttribute("opacity","0");

  } else if(heartHoverOnly){

    iChing.setAttribute("opacity","0");

  } else {

    iChing.setAttribute("opacity","1");
  }
}



// ===== BDPQ POSITIES =====

// 4 vaste punten
const dirPoints = [
  [0, -186],     // boven
  [205, 10],    // rechts
  [0, 198],      // onder
  [-205, 10]    // links
];

const compactDirectionPoints = {
  letterQ: [-11, -12],
  letterP: [ 11, -12],
  letterD: [-11,  32],
  letterB: [ 11,  32]
};

// ===== O / CENTRUM-ONTVOUWING =====

const oLetters = [
  letterOQ,
  letterOD,
  letterOB,
  letterOP
];

// ≤ 9/11: één groene o in het centrum
if(dayOffset < O_UNFOLD_DAY){

  letterO.setAttribute("x", 0);
  letterO.setAttribute("y", 10);
  letterO.setAttribute("opacity", "1");

  oLetters.forEach(el =>
    el.setAttribute("opacity", "0")
  );

// 10/11: centrum verdwijnt,
// vier o's verschijnen op de vier toekomstige richtingspunten
} else if(dayOffset === O_UNFOLD_DAY){

  letterO.setAttribute("opacity", "0");

  const oPoints = [
    dirPoints[0], // OQ boven
    dirPoints[1], // OD rechts
    dirPoints[2], // OB onder
    dirPoints[3]  // OP links
  ];

  oLetters.forEach((el, i) => {
    el.setAttribute("x", oPoints[i][0]);
    el.setAttribute("y", oPoints[i][1]);
    el.setAttribute("opacity", "1");
  });

// ≥ 11/11: alle o's weg
} else {

  letterO.setAttribute("opacity", "0");

  oLetters.forEach(el =>
    el.setAttribute("opacity", "0")
  );
}

["letterB","letterD","letterP","letterQ"]
  .forEach(id => {
    document
      .getElementById(id)
      .setAttribute("opacity", "1");
  });



// alleen 4 standen
let shift = Math.floor(mechanismKin / 13) % 4;

let yinAngle = (mechanismKin % 52) * (360 / 52);

const yinYang =
  document.getElementById("yinYang");

// Eenmalig de normale opacity bewaren
if(!yinYang.dataset.normalOpacity){
  yinYang.dataset.normalOpacity =
    yinYang.getAttribute("opacity") ?? "1";
}

yinYang.setAttribute(
  "transform",
  `
  rotate(${yinAngle - 352})
  scale(1.2)
  `
);

// 9/11 en alles ervoor: volledig zichtbaar.
// Vanaf 10/11: oorspronkelijke opacity herstellen.
yinYang.setAttribute(
  "opacity",
  rootStage <= 0
    ? "1"
    : yinYang.dataset.normalOpacity
);


// ===== BACKGROUND ROTATIE =====

// Normaal volgt de achtergrond de echte Tzolkin.
let backgroundKin = kin;

// Tijdens de vijf oorsprongsdagen volgt hij de 105-sprongen.
const rootBackgroundKins = [
  259, // 10/11 = 13 Ahau
  104, // 11/11 = 1 Chicchan
  209, // 12/11 = 2 Oc
  54,  // 13/11 = 3 Men
  159  // 14/11 = 4 Ahau
];

if(rootStage >= 1 && rootStage <= 5){
  backgroundKin =
    rootBackgroundKins[rootStage - 1];
}

const backgroundAngle =
  ((backgroundKin + 1 + 260) % 260) *
  (360 / 260);

const background =
  document.getElementById("Background");

background.setAttribute(
  "transform",
  `
  rotate(${backgroundAngle})
  scale(0.27)
  `
);

// Voor 10/11 volledig onzichtbaar.
// Tijdens de vijf ontvouwingsdagen volledig zichtbaar.
// Vanaf 15/11 geldt de normale Heart-logica.
if(rootStage <= 0){

  background.setAttribute("opacity", "0");

} else if(rootStage <= 5){

  background.setAttribute("opacity", "1");

} else {

  background.setAttribute(
    "opacity",
    backgroundOpacity
  );
}

const letters = [
  "letterD",
  "letterQ",
  "letterB",
  "letterP"
];


if(rootStage <= 1){

  // 10/11 en alles daarvoor:
  // compacte gele-wavespellstand q p / d b
  Object.entries(compactDirectionPoints)
    .forEach(([id, point]) => {

      document.getElementById(id)
        .setAttribute("x", point[0]);

      document.getElementById(id)
        .setAttribute("y", point[1]);
    });

} else if(rootStage <= 5){

  // 11/11 t/m 14/11:
  // iedere dag schuift één letter vanuit het midden
  // naar zijn vaste richting; eerdere letters blijven staan.
  const stagedDirectionPoints = {
    letterB: dirPoints[2], // 11/11: onder
    letterP: dirPoints[3], // 12/11: links
    letterQ: dirPoints[1], // 13/11: rechts
    letterD: dirPoints[0]  // 14/11: boven
  };

  const stagedDirectionOrder = [
    "letterB",
    "letterP",
    "letterQ",
    "letterD"
  ];

  const expandedLetterCount =
    rootStage - 1;

  Object.entries(compactDirectionPoints)
    .forEach(([id, compactPoint]) => {

      const isExpanded =
        stagedDirectionOrder
          .slice(0, expandedLetterCount)
          .includes(id);

      const point = isExpanded
        ? stagedDirectionPoints[id]
        : compactPoint;

      document.getElementById(id)
        .setAttribute("x", point[0]);

      document.getElementById(id)
        .setAttribute("y", point[1]);
    });

} else {

  // Vanaf 15/11:
  // normale ontvouwde positie volgens de actuele wavespell
  letters.forEach((id, i) => {

    const point =
      dirPoints[(i + shift) % 4];

    document.getElementById(id)
      .setAttribute("x", point[0]);

    document.getElementById(id)
      .setAttribute("y", point[1]);
  });
}

  // actieve kin
  segments.forEach(seg=>{
    seg.setAttribute("stroke-width","2");
  });

  segments[seal]
    .setAttribute("stroke-width","4");

  // kasteel kleur
let castle = Math.floor(kin / 52);
let castleFill = castleColors[castle];

const rootCastleIndex =
  dayOffset - ROOT_OFFSET + 5;

if(rootCastleIndex < 0){
  castleFill = "transparent";
}

if(rootCastleIndex >= 0 && rootCastleIndex <= 4){
  const rootCastleColors = [
    "transparent", // 9/11 en eerder
    "red",         // 10/11
    "blue",        // 11/11
    "green",       // 12/11
    "white"        // 13/11
  ];

  castleFill = rootCastleColors[rootCastleIndex];
}

document.getElementById("castleCore")
  .setAttribute("fill", castleFill);


const rootItems = [
  ["redPoint", "smell"],     // 10/11
  ["bluePoint", "hear"],     // 11/11
  ["greenPoint", "touch"],   // 12/11
  ["whitePoint", "sight"],   // 13/11
  ["yellowPoint", "taste"]   // 14/11
];

rootItems.forEach((pair, i) => {

  const point =
    document.getElementById(pair[0]);

  const sense =
    document.getElementById(pair[1]);

  if(!point || !sense){
    return;
  }

  let visible = false;

  // 10/11 t/m 14/11:
  // iedere nieuwe dag blijft alles van daarvoor zichtbaar
  if(rootStage >= 1 && rootStage <= 5){
    visible = i < rootStage;
  }

  // vanaf 15/11 alles normaal zichtbaar
  if(rootStage > 5){
    visible = true;
  }

  point.setAttribute(
    "opacity",
    visible ? "0.65" : "0"
  );

  sense.setAttribute(
    "opacity",
    visible ? "1" : "0"
  );
});

document.getElementById("info").innerHTML = `
<tspan x="-140" dy="0">
${lang.moon}: G${night}${night === 0 ? "" : ` (${lang.nightNames[night-1]})`}
</tspan>

<tspan x="-140" dy="36">
${lang.sun}: ${animals[seal]}
</tspan>

<tspan x="-140" dy="36">
${lang.tone}: ${tone} (${lang.toneNames[tone-1]})
</tspan>
`;

const LONG_COUNT_OFFSET = 1860921;

const longCountText =
  document.getElementById("longCountText");

let lcDays =
  dayOffset + LONG_COUNT_OFFSET;

const haabDisplay =
  getHaabFromLCDays(lcDays);

const yearBearerFractal =
  document.getElementById("yearBearerFractal");

const yearBearerOperatorFractal =
  document.getElementById("yearBearerOperatorFractal");

if(dayOffset < HAAB_START_DAY){

  yearBearerFractal.setAttribute("opacity", "0");
  yearBearerOperatorFractal.setAttribute("opacity", "0");

} else {

  const daysSincePop =
    ((dayOffset - HAAB_START_DAY) % 365 + 365) % 365;

  const yearBearerKin =
    ((kin - daysSincePop) % 260 + 260) % 260;

  const yearBearerSeal =
    yearBearerKin % 20;

  const yearBearerOperator =
  (yearBearerKin % 13) + 1;

  // Werkveld van de jaardrager
  yearBearerFractal.setAttribute(
    "href",
    `animals/${animalFiles[yearBearerSeal]}`
  );

  // Operator van de jaardrager
  const operatorFractal =
    toneFractals[yearBearerOperator - 1];

  yearBearerOperatorFractal.setAttribute(
    "href",
    yearBearerOperator === 9
      ? "other/yang.svg"
      : `trigrams/${operatorFractal}.svg`
  );

  yearBearerFractal.setAttribute("opacity", "1");
  yearBearerOperatorFractal.setAttribute("opacity", "1");
}



if(dayOffset < HAAB_START_DAY){

  yearBearerFractal.setAttribute("opacity", "0");

} else {

  // Aantal dagen sinds de laatste 0 Pop
  const daysSincePop =
    ((dayOffset - HAAB_START_DAY) % 365 + 365) % 365;

  // Tzolkin-kin op die laatste 0 Pop
  const yearBearerKin =
    ((kin - daysSincePop) % 260 + 260) % 260;

  const yearBearerSeal =
    yearBearerKin % 20;

  yearBearerFractal.setAttribute(
    "href",
    `animals/${animalFiles[yearBearerSeal]}`
  );

  yearBearerFractal.setAttribute("opacity", "1");
}

const haabText =
  document.getElementById("haabText");


if(dayOffset < HAAB_START_DAY){

  haabText.textContent = "Haab: 0";

} else {

  haabText.textContent =
    "Haab: " + haabDisplay;
}

const TUN_OPERATOR_CYCLE_DAYS =
  Number(TUN_OPERATOR_DAYS) * 13;

const tunOperatorIndex =
  Math.floor(
    (
      ((lcDays % TUN_OPERATOR_CYCLE_DAYS)
      + TUN_OPERATOR_CYCLE_DAYS)
      % TUN_OPERATOR_CYCLE_DAYS
    ) /
    Number(TUN_OPERATOR_DAYS)
  );

const tunAngle =
  tunOperatorIndex * (360 / 13);

const lcText =
  getLongCountFromDays(lcDays);

let longCountDisplay =
  getExtendedLongCountFromDays(lcDays);

const ROOT_LC_START =
  dayOffset < Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

if(ROOT_LC_START){
  longCountDisplay =
    "0.0.0.0.0.0.0.0.0.0";
}

const kinOnlyStart =
  daysFromCivil(2282, 1, 21);

if(currentAbsoluteDay >= kinOnlyStart){

const kinNumber =
  (currentAbsoluteDay - kinOnlyStart + 1n) % 20n;

  longCountText.textContent =
    "Kin: " + kinNumber.toString();

} else {

  longCountText.textContent =
    lang.longCount + ": " +
    longCountDisplay;
}

// Long Count getallen los halen
const lcParts = lcText.split(".").map(Number);

const lcBaktun = lcParts[0];
const lcKatun  = lcParts[1];
const lcTun    = lcParts[2];
const lcUinal  = lcParts[3];
const lcKin    = lcParts[4];

// TunChakra ophalen
const tunChakra =
  document.getElementById("TunChakra");
// normaal = Tun start: x.x.x.0.0
const normalTun =
  lcUinal === 0 &&
  lcKin === 0;

// special = Katun start: x.x.0.0.0
const specialTun =
  lcTun === 0 &&
  lcUinal === 0 &&
  lcKin === 0;

// super = Baktun start: x.0.0.0.0
const superTun =
  lcKatun === 0 &&
  lcTun === 0 &&
  lcUinal === 0 &&
  lcKin === 0;

if(beforeOrAtRoot){

  tunChakra.setAttribute("opacity","0");

} else if(superTun){

  tunChakra.setAttribute("opacity","1");
  tunChakra.setAttribute(
    "transform",
    `rotate(${tunAngle}) scale(1.4)`
  );

} else if(specialTun){

  tunChakra.setAttribute("opacity","0.7");
  tunChakra.setAttribute(
    "transform",
    `rotate(${tunAngle}) scale(1.2)`
  );

} else if(normalTun){

  tunChakra.setAttribute("opacity","0.35");
  tunChakra.setAttribute(
    "transform",
    `rotate(${tunAngle}) scale(1)`
  );

} else {

  tunChakra.setAttribute("opacity","0");
  tunChakra.setAttribute(
    "transform",
    `rotate(${tunAngle}) scale(1)`
  );
}

// ===== TABS =====

const toneTab =
  document.getElementById("toneTab");

toneTab.style.background =
  toneColors[tone - 1];



const toneFractal = toneFractals[tone - 1];

document.getElementById("toneTabSymbol").src =
  tone === 9
    ? "other/yang.svg"
    : `trigrams/${toneFractal}.svg`;

// ===== 4E CHAKRA SYMBOOL ONTVOUWING =====

const birthTabSymbol =
  document.getElementById("birthTabSymbol");

const HEART_UNFOLD_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const HEART_NORMAL_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 15) -
  daysFromCivil(1982, 8, 22)
);

const heartUnfoldingFiles = [
  "other/yin.svg",             // 10/11
  "animals/13Chicchan.svg",    // 11/11
  "animals/13Oc.svg",          // 12/11
  "animals/13Men.svg",         // 13/11
  "animals/13Ahau.svg"         // 14/11
];

if(dayOffset < HEART_UNFOLD_START_DAY){

  // t/m 9/11: positie 0 = hand
  birthTabSymbol.src = "other/touch.svg";

} else if(dayOffset < HEART_NORMAL_START_DAY){

  // 10/11 t/m 14/11: root-uitvouwing
  const heartUnfoldIndex =
    dayOffset - HEART_UNFOLD_START_DAY;

  birthTabSymbol.src =
    heartUnfoldingFiles[heartUnfoldIndex];

} else {

  // vanaf 15/11: normale 20-ronde
const birthFile =
  seal === 4  ? "13Chicchan.svg" :
  seal === 9  ? "13Oc.svg" :
  seal === 14 ? "13Men.svg" :
  seal === 19 ? "13Ahau.svg" :
  animalFiles[seal];

birthTabSymbol.src =
  `animals/${birthFile}`;
}


// ===== ORACLE KRUIS =====

// GROEN = huidige kin
let greenKin = kin;

// WIT = gids
let guideOffset = 0;

if([1,6,11].includes(tone)){

  guideOffset = 0;

} else if([2,7,12].includes(tone)){

  guideOffset = 12;

} else if([3,8,13].includes(tone)){

  guideOffset = 4;

} else if([4,9].includes(tone)){

  guideOffset = -4;

} else if([5,10].includes(tone)){

  guideOffset = -12;
}

guideSeal =
   (seal + guideOffset + 20) % 20;

let guideKin =
  guideSeal + ((tone - 1) * 20);

const guideTabSymbol =
  document.getElementById("guideTabSymbol");

if(rootStage <= 1){
  // t/m 10/11: oorspronkelijk zintuig
  guideTabSymbol.src = "other/sight.svg";

} else if(rootStage === 2){
  // 11/11
  guideTabSymbol.src = "animals/13Chicchan.svg";

} else if(rootStage === 3){


  // 12/11
  guideTabSymbol.src = "animals/Ik.svg";

} else if(rootStage === 4){
  // 13/11
  guideTabSymbol.src = "animals/Cauac.svg";

} else {
  // vanaf 14/11 normale gidsreeks
const guideFile =
  guideSeal === 4  ? "13Chicchan.svg" :
  guideSeal === 9  ? "13Oc.svg" :
  guideSeal === 14 ? "13Men.svg" :
  guideSeal === 19 ? "13Ahau.svg" :
  animalFiles[guideSeal];

guideTabSymbol.src =
  `animals/${guideFile}`;
}

guideKin =
  ((guideKin % 260) + 260) % 260;

// ROOD = analoog
const analogMap = [
  17, // Imix -> Etznab
  16, // Ik -> Caban
  15, // Akbal -> Cib
  14, // Kan -> Men
  13, // Chicchan -> Ix
  12, // Cimi -> Ben
  11, // Manik -> Eb
  10, // Lamat -> Chuen
  9,  // Muluc -> Oc
  8,  // Oc -> Muluc
  7,  // Chuen -> Lamat
  6,  // Eb -> Manik
  5,  // Ben -> Cimi
  4,  // Ix -> Chicchan
  3,  // Men -> Kan
  2,  // Cib -> Akbal
  1,  // Caban -> Ik
  0,  // Etznab -> Imix
  19, // Cauac -> Ahau
  18  // Ahau -> Cauac
];

let analogSeal = analogMap[seal];

let redKin =
  analogSeal + ((tone - 1) * 20);

redKin =
  ((redKin % 260) + 260) % 260;

const analogTab =
  document.getElementById("analogTab");

analogTab.style.background =
  colors[analogSeal % 4];

const analogTabSymbol =
  document.getElementById("analogTabSymbol");

if(rootStage <= 1){
  // t/m 10/11: oorspronkelijk zintuig
  analogTabSymbol.src = "other/smell.svg";

} else if(rootStage === 2){
  // 11/11
  analogTabSymbol.src = "animals/Ix.svg";

} else if(rootStage === 3){
  // 12/11
  analogTabSymbol.src = "animals/Muluc.svg";

} else if(rootStage === 4){
  // 13/11
  analogTabSymbol.src = "animals/Kan.svg";

} else {
  // vanaf 14/11 normale analog-volgorde
const analogFile =
  analogSeal === 4  ? "13Chicchan.svg" :
  analogSeal === 9  ? "13Oc.svg" :
  analogSeal === 14 ? "13Men.svg" :
  analogSeal === 19 ? "13Ahau.svg" :
  animalFiles[analogSeal];

analogTabSymbol.src =
  `animals/${analogFile}`;
}

// BLAUW = antipode
let antipodeSeal = (seal + 10) % 20;

let blueKin =
  antipodeSeal + ((tone - 1) * 20);

const antipodeTabSymbol =
  document.getElementById("antipodeTabSymbol");

if(rootStage <= 1){
  // t/m 10/11: oorspronkelijk zintuig
  antipodeTabSymbol.src = "other/hear.svg";

} else if(rootStage === 2){
  // 11/11
  antipodeTabSymbol.src = "animals/13Men.svg";

} else if(rootStage === 3){

  // 12/11
  antipodeTabSymbol.src = "animals/13Ahau.svg";

} else if(rootStage === 4){
  // 13/11
  antipodeTabSymbol.src = "animals/13Chicchan.svg";

} else {
  // vanaf 14/11 normale antipode-volgorde
const antipodeFile =
  antipodeSeal === 4  ? "13Chicchan.svg" :
  antipodeSeal === 9  ? "13Oc.svg" :
  antipodeSeal === 14 ? "13Men.svg" :
  antipodeSeal === 19 ? "13Ahau.svg" :
  animalFiles[antipodeSeal];

antipodeTabSymbol.src =
  `animals/${antipodeFile}`;
}

blueKin =
  ((blueKin % 260) + 260) % 260;

const antipodeTab =
  document.getElementById("antipodeTab");

antipodeTab.style.background =
  colors[antipodeSeal % 4];

const birthTab =
  document.getElementById("birthTab");

birthTab.style.background =
  colors[seal % 4];


// GEEL = occult
let occultTone = 14 - tone;
let occultSeal = 19 - seal;

const occultTabSymbol =
  document.getElementById("occultTabSymbol");

if(rootStage <= 1){
  // t/m 10/11: oorspronkelijk zintuig
  occultTabSymbol.src = "other/taste.svg";

} else if(rootStage === 2){
  // 11/11
  occultTabSymbol.src = "animals/Cib.svg";

} else if(rootStage === 3){
  // 12/11
  occultTabSymbol.src = "animals/Manik.svg";

} else if(rootStage === 4){
  // 13/11
  occultTabSymbol.src = "animals/Cimi.svg";

} else {
  // vanaf 14/11 normale occult-volgorde
const occultFile =
  occultSeal === 4  ? "13Chicchan.svg" :
  occultSeal === 9  ? "13Oc.svg" :
  occultSeal === 14 ? "13Men.svg" :
  occultSeal === 19 ? "13Ahau.svg" :
  animalFiles[occultSeal];

occultTabSymbol.src =
  `animals/${occultFile}`;
}

const occultTab =
  document.getElementById("occultTab");

const occultColor =
  colors[occultSeal % 4];

occultTab.style.background =
  occultColor;

let yellowKin =
  occultSeal + ((occultTone - 1) * 20);

yellowKin =
  ((yellowKin % 260) + 260) % 260;

const guideTab =
  document.getElementById("guideTab");

guideTab.style.background =
  colors[guideSeal % 4];

const nightTab =
  document.querySelector(".nightTab");

const crownTabSymbol =
  document.getElementById("crownTabSymbol");

const trigramFiles = [
  "other/yin.svg",       // G1
  "trigrams/100.svg",      // G2
  "trigrams/101.svg",      // G3
  "trigrams/011.svg",      // G4
  "trigrams/111.svg",      // G5
  "trigrams/110.svg",      // G6
  "trigrams/010.svg",      // G7
  "trigrams/001.svg",      // G8
  "trigrams/000.svg"       // G9
];

const TRIGRAM_UNFOLD_START_DAY = Number(
  daysFromCivil(-17264374702, 11, 10) -
  daysFromCivil(1982, 8, 22)
);

const trigramUnfoldingFiles = [
  "trigrams/101.svg",      // 10/11 = G3
  "trigrams/010.svg",      // 11/11 = G7
  "other/yin.svg",       // 12/11 = G1
  "trigrams/111.svg",      // 13/11 = G5
  "trigrams/000.svg"       // 14/11 = G9
];

const trigramUnfoldIndex =
  dayOffset - TRIGRAM_UNFOLD_START_DAY;


if(night === 0){

  crownTabSymbol.style.visibility = "hidden";

} else {

  crownTabSymbol.style.visibility = "visible";

  if(
    trigramUnfoldIndex >= 0 &&
    trigramUnfoldIndex < trigramUnfoldingFiles.length
  ){

    crownTabSymbol.setAttribute(
      "src",
      trigramUnfoldingFiles[trigramUnfoldIndex]
    );

  } else {

    crownTabSymbol.setAttribute(
      "src",
      trigramFiles[night - 1]
    );
  }
}

wavespellFractal.onclick = () => {

wavespellButton.onclick = () => {
  wavespellFractal.onclick();
};

  // Nog niet ontvouwd = niet klikbaar
  if(dayOffset < WAVESPELL_FRACTAL_START_DAY){
    return;
  }


  // Zelfde fractal opnieuw → intro
  if(wavespellActive){

    wavespellActive = false;
    render();
    activePage = "intro";
    updateActivePage();

    return;
  }


  // Sources en Operator uit
closeSources();
closeOperator();


  // Chakra's uit
  document
    .querySelectorAll(".infoTab")
    .forEach(tab => {
      tab.classList.remove("activeTab");
    });


  // Witte historische cellen uit
  activeHistoryCell = null;

  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(cell => {
      cell.classList.remove("activeHistoryCell");
    });


  wavespellActive = true;
  render();
  showWavespellText();
};

nightTabHover.onclick = () => {

  setActivePage("sahasrara", "nightTab");
};

const stepButton =
  document.getElementById(
    "stepButton"
  );

let nightColor =
  "rgba(0,128,0,0.7)";

if([2,3].includes(night)){

  nightColor =
    "rgba(255,0,0,0.7)";

} else if([4,5].includes(night)){

  nightColor =
    "rgba(255,255,255,0.7)";

} else if([6,7].includes(night)){

  nightColor =
    "rgba(0,0,255,0.7)";

} else if([8,9].includes(night)){

  nightColor =
    "rgba(255,255,0,0.7)";
}

nightTab.style.background =
  nightColor;

const oracleKin = {
  green: greenKin,
  red: redKin,
  white: guideKin,
  blue: blueKin,
  yellow: yellowKin
};

// ===== CHAKRA TABS: OORSPRONGSFASE =====
//
// rootStage:
// 1 = 10/11
// 2 = 11/11
// 3 = 12/11
// 4 = 13/11
// 5 = 14/11
// 6 = 15/11, normale werking begint



if(rootStage <= 5){

  // Vaste kruiskleuren zolang een chakra nog vergrendeld is.
  toneTab.style.background = "black";                   // 1 Muladhara
  antipodeTab.style.background = "rgba(0,0,255,0.7)";   // 2 Svadhisthana
  analogTab.style.background = "rgba(255,0,0,0.7)";     // 3 Manipura
  birthTab.style.background = "rgba(0,128,0,0.7)";      // 4 Anahata
  occultTab.style.background = "rgba(255,255,0,0.7)";   // 5 Vishuddha
  guideTab.style.background = "rgba(255,255,255,0.7)";  // 6 Ajna
  nightTab.style.background = "black";                  // 7 Sahasrara

  // De matchdag zelf toont nog de vaste kruiskleur.
  // Vanaf de volgende dag volgt het chakra zijn dynamische kin.

  // 9/11: chakra 4 matcht groen; vanaf 10/11 dynamisch.
  if(rootStage >= 1){
    birthTab.style.background =
      colors[seal % 4];
  }

  // 10/11: chakra 1 matcht zwart; vanaf 11/11 dynamisch.
  if(rootStage >= 2){
    toneTab.style.background =
      toneColors[tone - 1];
  }

  // 11/11: chakra 2 matcht blauw en chakra 5 geel;
  // beide volgen vanaf 12/11 hun dynamische kin.
  if(rootStage >= 3){
    antipodeTab.style.background =
      colors[antipodeSeal % 4];

    occultTab.style.background =
      occultColor;
  }

  // 12/11: chakra 3 matcht rood en chakra 6 wit;
  // beide volgen vanaf 13/11 hun dynamische kin.
  if(rootStage >= 4){
    analogTab.style.background =
      colors[analogSeal % 4];

    guideTab.style.background =
      colors[guideSeal % 4];
  }

  // Chakra 7 draagt de uitvouwing van het centrum naar de top.
  // 9/11 en eerder zwart; vanaf 15/11 neemt nightColor weer over.
  const rootNightColors = [
    "black",                  // 9/11 en eerder
    "rgba(255,0,0,0.7)",     // 10/11 rood
    "rgba(0,0,255,0.7)",     // 11/11 blauw
    "rgba(0,128,0,0.7)",     // 12/11 groen
    "rgba(255,255,255,0.7)", // 13/11 wit
    "rgba(255,255,0,0.7)"    // 14/11 geel
  ];

  nightTab.style.background =
    rootNightColors[
      Math.max(0, rootStage)
    ];

// Tijdelijke kleuren tijdens de splitsing vanuit het centrum.


if(rootStage === 1){
  // 10/11

  // Chakra 2 groen
  antipodeTab.style.background =
    "rgba(0,128,0,0.7)";

  // Chakra 3 groen
  analogTab.style.background =
    "rgba(0,128,0,0.7)";

  // Chakra 4 zwart
  birthTab.style.background =
    "black";

  // Chakra 5 groen
  occultTab.style.background =
    "rgba(0,128,0,0.7)";

  // Chakra 6 groen
  guideTab.style.background =
    "rgba(0,128,0,0.7)";

} else if(rootStage === 2){
  // 11/11

  // Chakra 2 blauw
  antipodeTab.style.background =
    "rgba(0,0,255,0.7)";

  analogTab.style.background =
    "rgba(255,255,255,0.7)";

  // Chakra 6 rood
  guideTab.style.background =
    "rgba(255,0,0,0.7)";

} else if(rootStage === 3){

  // 12/11
  occultTab.style.background =
    "rgba(0,0,255,0.7)";

  guideTab.style.background =
    "rgba(255,255,255,0.7)";

  nightTab.style.background =
    "rgba(0,128,0,0.7)";
}
}

updateActivePage();

// ===== LOCK HIGHLIGHT VAN GESELECTEERDE KIN =====

const lockedKinByPage = {
  anahata: oracleKin.green,
  manipura: oracleKin.red,
  ajna: oracleKin.white,
  svadhisthana: oracleKin.blue,
  vishuddha: oracleKin.yellow
};

const lockedKin =
  lockedKinByPage[activePage];

if(
  lockedKin !== undefined &&
  dayOffset >= ROOT_OFFSET
){
  const targetSeal = lockedKin % 20;

  lockedPath.setAttribute(
    "d",
    segments[targetSeal].getAttribute("d")
  );

  lockedPath.setAttribute(
    "fill",
    segments[targetSeal].getAttribute("fill")
  );

  lockedPath.setAttribute("opacity","1");
} else {
  lockedPath.setAttribute("opacity","0");
}

// ===== HOVER LINKS =====
const hoverMap = [
  {
    box: "birthTab",
    target: oracleKin.green
  },
  {
    box: "analogTab",
    target: oracleKin.red
  },
  {
    box: "guideTab",
    target: oracleKin.white
  },
  {
    box: "antipodeTab",
    target: oracleKin.blue
  },
  {
    box: "occultTab",
    target: oracleKin.yellow
  }
];


hoverMap.forEach(h => {

  let el = document.getElementById(h.box);

  el.onmouseenter = () => {

if(dayOffset < ROOT_OFFSET){
  hoverPath.setAttribute("opacity","0");
  return;
}

    let targetSeal = h.target % 20;

    hoverPath.setAttribute(
      "d",
      segments[targetSeal].getAttribute("d")
    );

    hoverPath.setAttribute(
      "fill",
      segments[targetSeal].getAttribute("fill")
    );

    hoverPath.setAttribute("opacity","1");
  };


el.onmouseleave = () => {

  const lockedKin =
    lockedKinByPage[activePage];

  if(
    lockedKin !== undefined &&
    dayOffset >= ROOT_OFFSET
  ){

    const targetSeal =
      lockedKin % 20;

    hoverPath.setAttribute(
      "d",
      segments[targetSeal].getAttribute("d")
    );

    hoverPath.setAttribute(
      "fill",
      segments[targetSeal].getAttribute("fill")
    );

    hoverPath.setAttribute("opacity","1");

  } else {

    hoverPath.setAttribute("opacity","0");
  }
};
});

}

// ===== SOURCES =====

const sourcesButton =
  document.getElementById("sourcesButton");


function setSourcesButtonState(){

  if(sourcesActive){
    sourcesButton.classList.add("active");
  } else {
    sourcesButton.classList.remove("active");
  }
}


function closeSources(){

  if(!sourcesActive){
    return;
  }

  sourcesActive = false;

  setSourcesButtonState();

  const infoPanel =
    document.getElementById("infoPanel");

  infoPanel.style.backgroundImage = "";
  infoPanel.style.backgroundSize = "";
  infoPanel.style.backgroundPosition = "";

}

function closeWavespell(){

  if(!wavespellActive){
    return;
  }

  wavespellActive = false;

  const wavespellFractal =
    document.getElementById("wavespellFractal");

  if(wavespellFractal){
    wavespellFractal.classList.remove("activeWavespell");
  }
}

function showSources(){

  closeWavespell();
  closeOperator();
  activeHistoryCell = null;

  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(item => {
      item.classList.remove("activeHistoryCell");
    });


  // Chakra-selectie uit
  document
    .querySelectorAll(".infoTab")
    .forEach(tab => {
      tab.classList.remove("activeTab");
    });

activePage = "intro";

hoverPath.setAttribute("opacity","0");

updateActivePage();

const infoPanel =
  document.getElementById("infoPanel");

const infoPanelTitle =
  document.getElementById("infoPanelTitle");

infoPanelTitle.classList.remove("chakraTitle");

infoPanel.style.backgroundImage =
  'url("backgrounds/sources.png")';

infoPanel.style.backgroundSize = "cover";
infoPanel.style.backgroundPosition = "center";


const sourcePage =
  sourceLanguages[language] || sources_en;

document
  .getElementById("infoPanelTitle")
  .textContent = sourcePage.title;

document
  .getElementById("infoPanelContent")
  .innerHTML = sourcePage.content;
}


sourcesButton.onclick = () => {

  // Zelfde knop opnieuw = terug naar intro
  if(sourcesActive){

    sourcesActive = false;

    setSourcesButtonState();

    activePage = "intro";

    updateActivePage();

    return;
  }


  sourcesActive = true;

  setSourcesButtonState();

  showSources();
};

function toggleHistoryCell(level, key, cell){

closeSources();
closeWavespell();
closeOperator();

  // Zelfde vak opnieuw → terug naar intro
  if(
    activeHistoryCell &&
    activeHistoryCell.level === level &&
    activeHistoryCell.key === key
  ){

    activeHistoryCell = null;

    cell.classList.remove("activeHistoryCell");

    activePage = "intro";

hoverPath.setAttribute("opacity","0");

    document
      .querySelectorAll(".infoTab")
      .forEach(tab => {
        tab.classList.remove("activeTab");
      });

    updateActivePage();

    return;
  }


  // Eventuele andere historische cel uitzetten
  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(item => {
      item.classList.remove("activeHistoryCell");
    });


  // Chakra-selectie uit
  document
    .querySelectorAll(".infoTab")
    .forEach(tab => {
      tab.classList.remove("activeTab");
    });

  activePage = "intro";

hoverPath.setAttribute("opacity","0");

  activeHistoryCell = {
    level: level,
    key: key
  };

  cell.classList.add("activeHistoryCell");

  updateActivePage();
}



function setActivePage(pageName, tabId){

  closeSources();
  closeOperator();
  closeWavespell();

  activeHistoryCell = null;

  document
    .querySelectorAll(".activeHistoryCell")
    .forEach(item => {
      item.classList.remove("activeHistoryCell");
    });

  if(activePage === pageName){
    activePage = "intro";
  } else {
    activePage = pageName;
  }

  document
    .querySelectorAll(".infoTab")
    .forEach(tab => {
      tab.classList.remove("activeTab");
    });

  if(activePage !== "intro"){
    document
      .getElementById(tabId)
      .classList.add("activeTab");
  }

  updateActivePage();
  render();
}




toneTab.onclick = () => {

  setActivePage("muladhara", "toneTab");
};

const hoverHeart =
    night === 1 || superHeart || specialHeart;


toneTab.onmouseenter = () => {

  const isHeartDay =
    night === 1 &&
    !beforeOrAtRoot;

  if(isHeartDay){

    document
      .getElementById("toneSymbol")
      .setAttribute("opacity","1");
  }
};

toneTab.onmouseleave = () => {

  const toneSymbol =
    document.getElementById("toneSymbol");

  const isHeartDay =
    night === 1 &&
    !beforeOrAtRoot;

  if(beforeOrAtRoot){

    toneSymbol.setAttribute("opacity","0");

} else if(
  isHeartDay &&
  activePage !== "muladhara"
){
  toneSymbol.setAttribute("opacity","0");
} else {

    toneSymbol.setAttribute("opacity","1");
  }
};

const birthTabClick =
  document.getElementById("birthTab");

birthTabClick.onclick = () => {

  setActivePage("anahata", "birthTab");
};


const occultTabClick =
  document.getElementById("occultTab");

occultTabClick.onclick = () => {

  setActivePage("vishuddha", "occultTab");
};

const antipodeTabClick =
  document.getElementById("antipodeTab");

antipodeTabClick.onclick = () => {

  setActivePage("svadhisthana", "antipodeTab");
};

const analogTabClick =
  document.getElementById("analogTab");

analogTabClick.onclick = () => {

  setActivePage("manipura", "analogTab");
};

const guideTabClick =
  document.getElementById("guideTab");

guideTabClick.onclick = () => {

  setActivePage("ajna", "guideTab");
};

const nightTabHover =
  document.getElementById("nightTab");

const iChing =
  document.getElementById("iChing");




nightTabHover.onmouseenter = () => {

const pentagramUnfolding =
  dayOffset >= PENTAGRAM_FRACTAL_START_DAY &&
  dayOffset < PENTAGRAM_FRACTAL_START_DAY + 5;

  if(pentagramUnfolding){
    return;
  }

  const isHeartDay =
    night === 1 &&
    !beforeOrAtRoot;

  if(isHeartDay){

    iChing.setAttribute("opacity","1");
  }
};

nightTabHover.onmouseleave = () => {

const pentagramUnfolding =
  dayOffset >= PENTAGRAM_FRACTAL_START_DAY &&
  dayOffset < PENTAGRAM_FRACTAL_START_DAY + 5;

  if(pentagramUnfolding){
    return;
  }

  const isHeartDay =
    night === 1 &&
    !beforeOrAtRoot;

  if(beforeOrAtRoot){

    iChing.setAttribute("opacity","0");

  } else if(isHeartDay){

    iChing.setAttribute("opacity","0");

  } else {

    iChing.setAttribute("opacity","1");
  }
};


function getLongCountFromDays(days) {
  days = ((days % 1872000) + 1872000) % 1872000;

  const baktun = Math.floor(days / 144000);
  days %= 144000;

  const katun = Math.floor(days / 7200);
  days %= 7200;

  const tun = Math.floor(days / 360);
  days %= 360;

  const uinal = Math.floor(days / 20);
  const kin = days % 20;

  return `${baktun}.${katun}.${tun}.${uinal}.${kin}`;
}

function getExtendedLongCountFromDays(totalDays){

  totalDays = Math.floor(totalDays);

  // Hablatun.Alautun.Kinchiltun.Kalabtun.Piktun.Baktun.Katun.Tun.Uinal.Kin
  const values = [
    13, // Hablatun
    13, // Alautun
    13, // Kinchiltun
    13, // Kalabtun
    13, // Piktun
    0,  // Baktun
    0,  // Katun
    0,  // Tun
    0,  // Uinal
    0   // Kin
  ];

  values[9] += totalDays;

  const bases = [
    20, // Kin → Uinal
    18, // Uinal → Tun
    20, // Tun → Katun
    20, // Katun → Baktun
    20, // Baktun → Piktun
    20, // Piktun → Kalabtun
    20, // Kalabtun → Kinchiltun
    20, // Kinchiltun → Alautun
    20  // Alautun → Hablatun
  ];

  for(let i = values.length - 1; i > 0; i--){

    const base = bases[values.length - 1 - i];

    const carry = Math.floor(values[i] / base);
    const remainder = ((values[i] % base) + base) % base;

    values[i] = remainder;
    values[i - 1] += carry;
  }

  return values.join(".");
}

function getGrandLongCountFromBigDays(totalDays){

  let values = [
    13n, // Hablatun
    13n, // Alautun
    13n, // Kinchiltun
    13n, // Kalabtun
    13n, // Piktun
    0n,  // Baktun
    0n,  // Katun
    0n,  // Tun
    0n,  // Uinal
    0n   // Kin
  ];

  values[9] += BigInt(totalDays);

  const bases = [
    20n, // Kin
    18n, // Uinal
    20n, // Tun
    20n, // Katun
    20n, // Baktun
    20n, // Piktun
    20n, // Kalabtun
    20n, // Kinchiltun
    20n  // Alautun
  ];

  for(let i = values.length - 1; i > 0; i--){

    const base = bases[values.length - 1 - i];

    let carry = values[i] / base;
    let remainder = values[i] % base;

    if(remainder < 0n){
      remainder += base;
      carry -= 1n;
    }

    values[i] = remainder;
    values[i - 1] += carry;
  }

  return values.join(".");
}

function floorDiv(a, b){
  let q = a / b;
  let r = a % b;

  if(r < 0n){
    q -= 1n;
  }

  return q;
}

function daysFromCivil(year, month, day){

  let y = BigInt(year);
  let m = BigInt(month);
  let d = BigInt(day);

  y -= m <= 2n ? 1n : 0n;

  const era = floorDiv(y, 400n);
  const yoe = y - era * 400n;

  const mp = m + (m > 2n ? -3n : 9n);

  const doy =
    floorDiv(153n * mp + 2n, 5n) + d - 1n;

  const doe =
    yoe * 365n +
    floorDiv(yoe, 4n) -
    floorDiv(yoe, 100n) +
    doy;

  return era * 146097n + doe - 719468n;
}

// ===== START VANDAAG =====
let today = new Date();

const todayDays =
  daysFromCivil(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  );

const baseDays =
  daysFromCivil(1982, 8, 22);

dayOffset =
  Number(todayDays - baseDays);

kin = ((dayOffset % 260) + 260) % 260;

updateFromKin();
updateDateFromKin();
updateLanguage();
render();

window.goToDate = goToDate;

window.addEventListener("DOMContentLoaded", () => {

    const mobileStepButton =
        document.getElementById("mobileStepButton");

    const normalStepButton =
        document.getElementById("stepButton");

    if(mobileStepButton){

        mobileStepButton.addEventListener("click", () => {

            if(normalStepButton){
                normalStepButton.click();
            }

        });
    }

});

window.addEventListener("load", () => {
    Camera.update();
});

window.addEventListener("resize", () => {
    Camera.update();
});

window.addEventListener("orientationchange", () => {
    setTimeout(() => {
        Camera.update();
    }, 150);
});