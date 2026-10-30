function setPanelBackground(panel, image, tint = null) {
  panel.style.background = "";

  panel.style.backgroundImage = tint
    ? `linear-gradient(${tint}, ${tint}), url("${image}")`
    : `url("${image}")`;

  setPanelBackgroundLayout(panel);
}

function setPanelBackgroundLayout(panel) {
  panel.style.backgroundSize = "cover";
  panel.style.backgroundPosition = "center";
}

const historyLevelBackgrounds = {
  hablatun: "backgrounds/hablatun.png",
  alautun: "backgrounds/alautun.png",
  kinchiltun: "backgrounds/kinchiltun.png",
  kalabtun: "backgrounds/kalabtun.png",
  piktun: "backgrounds/piktun.png",
  katun: "backgrounds/katun.png"
};

function setPanelContent(title, content, heading, text) {
  title.innerHTML = heading;
  title.classList.remove("chakraTitle");
  content.innerHTML = text ?? "";
}

function clearPanelContent(title, content) {
  title.innerHTML = "";
  title.classList.remove("chakraTitle");
  content.innerHTML = "";
}

function buildToneCombinationHTML(toneText, combinationText) {
  return `
    <div class="toneText">
      ${toneText}
    </div>

    <div class="textDivider"></div>

    <div class="combinationText">
      ${combinationText}
    </div>
  `;
}

const baktunBackgrounds = {

verankeren_waarheid:
  "backgrounds/baktun13.png",

afstemmen_oorsprong:
  "backgrounds/baktun13_1.png",

transformeren_informatie:
  "backgrounds/baktun13_2.png",

integreren_verbeelding:
  "backgrounds/baktun13_3.png",

doorgronden_potentieel:
  "backgrounds/baktun13_4.png",

verankeren_energie:
  "backgrounds/baktun13_5.png",

ontsluiten_grenzen:
  "backgrounds/baktun13_6.png",

vrijmaken_interactie:
  "backgrounds/baktun13_7.png",

actualiseren_waarde:
  "backgrounds/baktun13_8.png",

erkennen_stroming:
  "backgrounds/baktun13_9.png",

onderscheiden_relatie:
  "backgrounds/baktun13_10.png",

plaatsen_expressie:
  "backgrounds/baktun13_11.png",

selecteren_levenspad:
  "backgrounds/baktun13_12.png",

verfijnen_structuur:
  "backgrounds/baktun13_13.png",

afstemmen_bewustzijn:
  "backgrounds/baktun13_14.png",

transformeren_perspectief:
  "backgrounds/baktun13_15.png",

integreren_spoor:
  "backgrounds/baktun13_16.png",

doorgronden_manifestatie:
  "backgrounds/baktun13_17.png",

ontsluiten_samenhang:
  "backgrounds/baktun13_19.png",

vrijmaken_essentie:
  "backgrounds/baktun13_20.png",

vrijmaken_bewustzijn:
  "backgrounds/baktun12.png",

onderscheiden_manifestatie:
  "backgrounds/baktun12.png",

onderscheiden_expressie:
  "backgrounds/baktun11.png",

erkennen_relatie:
  "backgrounds/baktun11.png",

transformeren_relatie:
  "backgrounds/baktun10.png",

integreren_expressie:
  "backgrounds/baktun10.png",

transformeren_potentieel:
  "backgrounds/baktun09.png",

selecteren_bewustzijn:
  "backgrounds/baktun09.png",

onderscheiden_grenzen:
  "backgrounds/baktun08.png",

actualiseren_manifestatie_rome:
  "backgrounds/baktun08.png",

erkennen_waarheid:
  "backgrounds/baktun08.png",

onderscheiden_samenhang:
  "backgrounds/baktun08.png",

plaatsen_essentie:
  "backgrounds/baktun08.png",

onderscheiden_structuur_athene:
  "backgrounds/baktun07.png",

transformeren_waarheid:
  "backgrounds/baktun07.png",

erkennen_samenhang:
  "backgrounds/baktun06.png",

ontvouwen_verbeelding:
  "backgrounds/baktun06.png",

onderscheiden_bewustzijn:
  "backgrounds/baktun05.png",

afstemmen_waarheid:
  "backgrounds/baktun05.png",

selecteren_relatie:
  "backgrounds/baktun04.png",

erkennen_interactie:
  "backgrounds/baktun04.png",

vrijmaken_levenspad:
  "backgrounds/baktun03.png",

transformeren_interactie:
  "backgrounds/baktun03.png",

actualiseren_essentie:
  "backgrounds/baktun02.png",

onderscheiden_stroming:
  "backgrounds/baktun02.png",

actualiseren_oorsprong:
  "backgrounds/baktun01.png",

erkennen_informatie:
  "backgrounds/baktun01.png"

};

  const pentagramBackgrounds = [
    "backgrounds/pent_1.png",
    "backgrounds/pent_2.png",
    "backgrounds/pent_3.png",
    "backgrounds/pent_4.png",
    "backgrounds/pent_5.png"
  ];

  const unfoldBackgrounds = [
    "backgrounds/kasteel_1.png",
    "backgrounds/kasteel_2.png",
    "backgrounds/kasteel_3.png",
    "backgrounds/kasteel_4.png",
    "backgrounds/kasteel_5.png"
  ];

  const unfoldTitles = [
    "0",   // 10/11
    "01",  // 11/11
    "11",  // 12/11
    "10",  // 13/11
    "00"   // 14/11
  ];

  const workfieldTitles = [
    "0001", // 15/11 Imix
    "0011", // 16/11 Ik
    "0010", // 17/11 Akbal
    "0000", // 18/11 Kan

    "01",   // 19/11 Chicchan

    "0111", // 20/11 Cimi
    "0110", // 21/11 Manik
    "0100", // 22/11 Lamat
    "0101", // 23/11 Muluc

    "11",   // 24/11 Oc

    "1110", // 25/11 Chuen
    "1100", // 26/11 Eb
    "1101", // 27/11 Ben
    "1111", // 28/11 Ix

    "10",   // 29/11 Men

    "1000", // 30/11 Cib
    "1001", // 1/12 Caban
    "1011", // 2/12 Etznab
    "1010", // 3/12 Cauac

    "00"    // 4/12 Ahau
  ];

    const hex16Titles = [
      "0101",
      "1101",
      "1001",
      "0001",
      "0111",
      "1111",
      "1011",
      "0011",
      "0110",
      "1110",
      "1010",
      "0010",
      "0100",
      "1100",
      "1000",
      "0000"
    ];

  const HEX16_START_DAY = Number(
    daysFromCivil(-17264374702, 12, 5) -
    daysFromCivil(1982, 8, 22)
  );

const hexagramTints = [
  "rgba(120,0,0,0.35)",       // 1–16 rood
  "rgba(255,255,255,0.18)",   // 17–32 wit
  "rgba(80,180,255,0.25)",    // 33–48 blauw
  "rgba(255,220,0,0.25)"      // 49–64 geel
];

const ChakraBackgrounds = {
  muladhara: "rgba(120,0,0,0.35)",
  svadhisthana: "rgba(255,120,0,0.25)",
  manipura: "rgba(255,220,0,0.25)",
  anahata: "rgba(0,128,0,0.25)",
  vishuddha: "rgba(80,180,255,0.25)",
  ajna: "rgba(90,70,180,0.28)",
  sahasrara: "transparent"
};

const earlyChakraPages = new Set([
  "muladhara",
  "svadhisthana",
  "anahata",
  "vishuddha",
  "sahasrara"
]);

// ===== RENDER CHAKRAPAGINA'S =====
function updateActivePage(){

  const panel =
    document.getElementById("infoPanel");

  const title =
    document.getElementById("infoPanelTitle");

  const content =
    document.getElementById("infoPanelContent");

const FIRST_CHAKRA_DAY =
  ROOT_OFFSET - 4; // 10 november

const CHAKRA_TEXT_START_DAY =
  FIRST_CHAKRA_DAY + 1; // 11 november

const SAHASRARA_TEXT_START_DAY =
  FIRST_CHAKRA_DAY + 5; // 15 november

// ===== HISTORISCHE LONG COUNT CEL =====

if(activeHistoryCell){

  const level =
    activeHistoryCell.level;

  const key =
    activeHistoryCell.key;

  const entry =
    window.historyTexts?.[language]?.[level]?.[key]
    ??
    window.historyTexts?.en?.[level]?.[key];

  if(entry){

const historyBackground =
  level === "baktun"
    ? baktunBackgrounds[key]
    : historyLevelBackgrounds[level];

if(historyBackground){
  setPanelBackground(panel, historyBackground);
} else {
  panel.style.background = "transparent";
}

    setPanelContent(
  title,
  content,
  entry.title,
  entry.text
);

    return;
  }
}

  // ===== INTRO =====

  if(activePage === "intro"){

setPanelBackground(panel, "backgrounds/maya.png");

    setPanelContent(
  title,
  content,
  lang.introTitle,
  lang.introText
);

title.classList.add("chakraTitle");

    return;
  }

const isEarlyChakraPage =
  dayOffset < CHAKRA_TEXT_START_DAY &&
  earlyChakraPages.has(activePage);

if(isEarlyChakraPage){

  panel.style.background =
    ChakraBackgrounds[activePage];

  clearPanelContent(title, content);

  return;
}

// ===== MULADHARA =====

if(activePage === "muladhara"){

  panel.style.background =
    ChakraBackgrounds.muladhara;

  setPanelContent(
  title,
  content,
  lang.muladhara,
  pages.muladhara[seal + 1]
);

return;
}


// ===== SAHASRARA =====

if(activePage === "sahasrara"){

  setPanelBackground(
  panel,
  `backgrounds/toon_${tone}.png`
);

const toneText =
  pages.sahasrara?.[tone] ?? "";

// ===== EERSTE UITVOUWING 11/11 T/M 14/11 =====

if(dayOffset < SAHASRARA_TEXT_START_DAY){

  const specialPageNumber =
    dayOffset - CHAKRA_TEXT_START_DAY + 1;

  const specialText =
    specialPages?.[language]?.[specialPageNumber] ?? "";

  setPanelContent(
    title,
    content,
    lang.sahasrara,
    buildToneCombinationHTML(
      toneText,
      specialText
    )
  );

  return;
}

// ===== 260 COMBINATIE =====

const combinationText =
  pages.sahasraraKin?.[mechanismKin + 1] ?? "";

const sahasraraText = combinationText
  ? buildToneCombinationHTML(toneText, combinationText)
  : `
    <div class="toneText">
      ${toneText}
    </div>
  `;

setPanelContent(
  title,
  content,
  lang.sahasrara,
  sahasraraText
);

  return;
}

// ===== ANAHATA =====

if(activePage === "anahata"){

  panel.style.background =
    ChakraBackgrounds.anahata;

  const sealKey =
  sealKeys[seal];

const guideOrder = [
  seal,
  (seal + 4) % 20,
  (seal + 8) % 20,
  (seal + 12) % 20,
  (seal + 16) % 20
];

const guideStep =
  guideOrder.indexOf(guideSeal) + 1;

setPanelContent(
  title,
  content,
  lang.anahata,
  pages.anahata?.[sealKey]?.[guideStep]
);

return;
}


  // ===== VISHUDDHA =====

  if(activePage === "vishuddha"){

  panel.style.background =
    ChakraBackgrounds.vishuddha;

  setPanelContent(
    title,
    content,
    lang.vishuddha,
    pages.vishuddha[seal + 1]
  );

  return;
}


  // ===== SVADHISTHANA =====

  if(activePage === "svadhisthana"){

  panel.style.background =
    ChakraBackgrounds.svadhisthana;

  setPanelContent(
    title,
    content,
    lang.svadhisthana,
    pages.svadhisthana[seal + 1]
  );

  return;
}


// ===== MANIPURA =====

if(activePage === "manipura"){

  panel.style.background =
  ChakraBackgrounds.manipura;

// ===== VÓÓR 11/11: GEEN TEKST =====
// Nog geen Manipura: titel én tekst leeg.
if(dayOffset < CHAKRA_TEXT_START_DAY){

  clearPanelContent(title, content);

  return;
}

  // ===== VANAF 11/11 =====

  setPanelContent(
  title,
  content,
  lang.manipura,
  pages.manipura[seal + 1]
);

return;
}

// ===== AJNA =====

if(activePage === "ajna"){

  if(dayOffset < FIRST_CHAKRA_DAY){

  panel.style.background =
    ChakraBackgrounds.ajna;

  clearPanelContent(title, content);

  return;
}

// ===== EERSTE UITVOUWING 10/11 T/M 14/11 =====

if(dayOffset < SAHASRARA_TEXT_START_DAY){

  const pentagramPage =
    dayOffset - FIRST_CHAKRA_DAY + 1;

  setPanelContent(
    title,
    content,
    lang.ajna,
    pentagramPages?.[language]?.[pentagramPage] ?? ""
  );

  setPanelBackground(
    panel,
    pentagramBackgrounds[pentagramPage - 1]
  );

  return;
}

  const nightText =
  pages.ajna?.[night] ?? "";

// Vanaf 15/11: alleen Night + vaste Ajna achtergrond

setPanelBackground(panel, "backgrounds/ajna.png");

setPanelContent(
  title,
  content,
  lang.ajna,
  `
    <div class="nightText">
      ${nightText}
    </div>
  `
);

return;
}

// ===== HEXAGRAM 64 =====

if(activePage === "hexagram64"){

const unfoldIndex =
  dayOffset - HEXAGRAM_ZERO_DAY;

// ===== EERSTE 5 DAGEN =====

if(
  unfoldIndex >= 0 &&
  unfoldIndex < unfoldBackgrounds.length
){

setPanelContent(
  title,
  content,
  unfoldTitles[unfoldIndex],
  pages.hexagram?.[unfoldIndex + 1] ?? ""
);

  setPanelBackground(
  panel,
  unfoldBackgrounds[unfoldIndex]
);

  return;
}

// ===== 20 WERKVELDEN 15/11 T/M 4/12 =====

if(
  unfoldIndex >= unfoldBackgrounds.length &&
  unfoldIndex < unfoldBackgrounds.length + workfieldTitles.length
){

  const workfieldIndex =
  unfoldIndex - unfoldBackgrounds.length;

  // Teksten komen later
setPanelContent(
  title,
  content,
  workfieldTitles[workfieldIndex],
  ""
);

  setPanelBackground(
  panel,
  `backgrounds/${workfieldIndex + 1}.png`
);

  return;
}


// ===== 16 FRACTALS 5/12 T/M 20/12 =====

if(dayOffset < HEXAGRAM_TEXT_START_DAY){

  if(
  dayOffset >= HEX16_START_DAY &&
  dayOffset < HEX16_START_DAY + hex16Titles.length
){

    const hex16Index =
      dayOffset - HEX16_START_DAY;

    setPanelContent(
  title,
  content,
  hex16Titles[hex16Index],
  ""
);

setPanelBackground(
  panel,
  `backgrounds/hex_${hex16Index + 1}.png`
);

return;
  }

  clearPanelContent(title, content);

  return;
}

  const hexagramNumber =
  (dayOffset - HEXAGRAM_TEXT_START_DAY) % 64 + 1;

const hexagramText =
  pages.hexagram64?.[hexagramNumber] ?? "";

const trimmedHexagramText = hexagramText.trim();

const hexagramCode =
  trimmedHexagramText.slice(0, 6);

const hexagramBody =
  trimmedHexagramText.slice(6).trim();


// ===== EERSTE 64 HEXAGRAMDAGEN =====
// 21/12 t/m 22/2:
// alleen titel + eigen achtergrond

if(dayOffset < HEXAGRAM_TEXT_START_DAY + 64){

  setPanelContent(
    title,
    content,
    hexagramCode,
    ""
  );

  setPanelBackground(
    panel,
    `backgrounds/hexagram_${hexagramNumber}.png`
  );

  return;
}

setPanelContent(
  title,
  content,
  hexagramCode,
  hexagramBody
);

const colorGroup =
  Math.floor((hexagramNumber - 1) / 16);

const hexagramTint =
  hexagramTints[colorGroup];

setPanelBackground(
  panel,
  "backgrounds/hexagrams.png",
  hexagramTint
);

  return;
}

}