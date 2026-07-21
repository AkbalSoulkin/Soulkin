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

const rootImages = [
  "animals/13Ahau.svg",
  "animals/13Chicchan.svg",
  "animals/13Oc.svg",
  "animals/13Men.svg"
];

const img =
  rootImages[kin % 4];

const languages = {

  en: lang_en,
  nl: lang_nl,
  jp: lang_jp,
  ru: lang_ru

};

const languageSelect =
  document.getElementById(
    "languageSelect"
  );

languageSelect.onchange = () => {

language = languageSelect.value;
lang = languages[language];
pages = pageSets[language];

updateLanguage();
};


const pageSets = {
  en: {
    muladhara: muladharaPages_en,
    svadhisthana: svadhisthanaPages_en,
    manipura: manipuraPages_en,
    anahata: anahataPages_en,
    vishuddha: vishuddhaPages_en,
    ajna: ajnaPages_en,
    sahasrara: sahasraraPages_en,
  },

  nl: {
    muladhara: muladharaPages_nl,
    svadhisthana: svadhisthanaPages_nl,
    manipura: manipuraPages_nl,
    anahata: anahataPages_nl,
    vishuddha: vishuddhaPages_nl,
    ajna: ajnaPages_nl,
    sahasrara: sahasraraPages_nl,
  },

  jp: {
    muladhara: muladharaPages_jp,
    svadhisthana: svadhisthanaPages_jp,
    manipura: manipuraPages_jp,
    anahata: anahataPages_jp,
    vishuddha: vishuddhaPages_jp,
    ajna: ajnaPages_jp,
    sahasrara: sahasraraPages_jp,
  },

  ru: {
    muladhara: muladharaPages_ru,
    svadhisthana: svadhisthanaPages_ru,
    manipura: manipuraPages_ru,
    anahata: anahataPages_ru,
    vishuddha: vishuddhaPages_ru,
    ajna: ajnaPages_ru,
    sahasrara: sahasraraPages_ru,
  }
};

let pages = pageSets.en;

function updateFromKin(){

  tone = (kin % 13) + 1;
  seal = kin % 20;

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

  // alles vóór 10/11 blijft bevroren op 13 Ahau
  if(dayOffset < ROOT_OFFSET - 4){

    tone = 13;
    seal = 19;
    night = 5;

    mechanismKin = 259;
    ringKin = 159;
    pos = 0;
    rot = ROOT_ROT;
    dotVisible = false;

    return;
  }

  const specialIndex =
    dayOffset - ROOT_OFFSET + 4;

  if(specialIndex >= 0 && specialIndex <= 4){

    const special = [
      {tone:13, seal:19, night:5, mechanismKin:259, ringKin:159, dot:false}, // 10 nov
      {tone:1,  seal:4,  night:6, mechanismKin:156, ringKin:159, dot:true},
      {tone:2,  seal:9,  night:7, mechanismKin:157, ringKin:159, dot:true},
      {tone:3,  seal:14, night:8, mechanismKin:158, ringKin:159, dot:true},
      {tone:4,  seal:19, night:9, mechanismKin:159, ringKin:159, dot:true}
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



// ===== DATE PICKER =====
function goToDate(){

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

  render();
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

hoverPath.setAttribute("fill","white");
hoverPath.setAttribute("opacity","0");

hoverPath.setAttribute("stroke","black");
hoverPath.setAttribute("stroke-width","8");

hoverPath.setAttribute("stroke-linejoin","round");
hoverPath.setAttribute("stroke-linecap","round");


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
    rotate(${adj.angle})
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
//
// Voorlopig:
// - allemaal zichtbaar
// - geen reveal
// - geen groepsrotatie

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

  // Binnen Ring 2 plaatsen.
  // Alleen deze waarde aanpassen als de rij te dicht
  // op Ring 2 of te dicht op het midden staat.
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

window.updateLanguage = function(){

  document.querySelector(".aboutTitle").innerHTML =
    lang.aboutTitle;

  document.querySelector(".aboutText").innerHTML =
    lang.aboutText;

  document.getElementById("stepButton").innerHTML =
    lang.step;

  document.getElementById("goDateButton").innerHTML =
    lang.go;

  const supportText =
    document.getElementById("supportText");

  if(supportText){

    supportText.innerHTML =
      `
      ${lang.supportText}

      <a href="https://ko-fi.com/soulkin"
         target="_blank">
         ko-fi.com/soulkin
      </a>
      `;
  }

  render();
};


// ===== RENDER =====
function render(){

  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

  const rootStage =
    dayOffset - ROOT_OFFSET + 5;

const rootYin =
  document.getElementById("rootYin");

const rootYang =
  document.getElementById("rootYang");

const showRootPair =
  rootStage === 1; // 10/11

rootYin.setAttribute(
  "opacity",
  showRootPair ? "1" : "0"
);

rootYang.setAttribute(
  "opacity",
  showRootPair ? "1" : "0"
);

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

const rootFractalPreview = [
  document.getElementById("rootChicchan"), // 11/11
  document.getElementById("rootOc"),       // 12/11
  document.getElementById("rootMen"),      // 13/11
  document.getElementById("rootAhau")      // 14/11
];

const showRootFractalPreview =
  rootStage >= 2 &&
  rootStage <= 5;

rootFractalPreview.forEach((item, index) => {

  if(!showRootFractalPreview){

    item.setAttribute("opacity", "0");
    return;
  }

  const activeIndex =
    rootStage - 2;

  item.setAttribute(
    "opacity",
    index === activeIndex ? "1" : "0.3"
  );
});

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

if(beforeOrAtRoot || night === 1){
  toneSymbol.setAttribute("opacity","0");
} else {
  toneSymbol.setAttribute("opacity","1");
}

// ===== KLEURENRING ONTVOUWING =====
//
// 10/11 en eerder: alle segmenten zwart
// 11/11: rood verschijnt
// 12/11: wit verschijnt
// 13/11: blauw verschijnt
// 14/11: geel verschijnt
// 15/11 en verder: compleet en in beweging

const visibleColorCount =
  Math.max(
    0,
    Math.min(4, rootStage - 1)
  );



segments.forEach((segment, index) => {

  const colorIndex = index % 4;

  const colorIsVisible =
    colorIndex < visibleColorCount;

  let segmentFill;

  // Alle normaal witte vakken blijven wit.
  if(colorIndex === 1){

    segmentFill = "white";

  // Alle normaal rode vakken zijn t/m 10/11 wit.
  // Op 11/11 worden ze rood.
  } else if(colorIndex === 0 && rootStage <= 1){

    segmentFill = "white";

  // De bestaande ontvouwingslogica blijft gelden.
  } else {

    segmentFill =
      colorIsVisible
        ? colors[colorIndex]
        : "black";
  }

  segment.setAttribute(
    "fill",
    segmentFill
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

const ROOT_RING2_STEP =
  360 / 16;

const rootRing2Angle =
  (mechanismKin - 4) * ROOT_RING2_STEP;

rootRing2.setAttribute(
  "transform",
  `rotate(${rootRing2Angle})`
);

const ROOT_RING3_STEP = 360 / 64;

// Ring 3 is op 22/2 volledig revealed.
// Vanaf 23/2 moet hij 4 fractalposities vooruit
// om synchroon door te lopen naar Chicchan.
const ROOT_RING3_COMPLETE_DAY =
  ROOT_RING3_START_DAY + 63;

const rootRing3SyncCorrection =
  dayOffset > ROOT_RING3_COMPLETE_DAY
    ? 4
    : 0;

const rootRing3Angle =
  (
    mechanismKin
    - 4
    + rootRing3SyncCorrection
  ) * ROOT_RING3_STEP;

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

// eigen 360-daagse cyclus
let heartAngle =
  (dayOffset % 360) * (360 / 360);

let heartScale = 1;


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

if(superHeart){

  document.getElementById("HeartChakra")
    .setAttribute("opacity","1");

  document.getElementById("Background")
    .setAttribute("opacity","1");

  heartScale = 1.64;

} else if(specialHeart){

  document.getElementById("HeartChakra")
    .setAttribute("opacity","0.8");

  document.getElementById("Background")
    .setAttribute("opacity","0.8");

  heartScale = 1.2;

} else {

  document.getElementById("Background")
    .setAttribute("opacity","0.6");

  if(night === 1){

    document.getElementById("HeartChakra")
      .setAttribute("opacity","0.6");

  } else {

    document.getElementById("Background")
      .setAttribute("opacity","0.1");

    document.getElementById("HeartChakra")
      .setAttribute("opacity","0");
  }
}


// ===== HART CHAKRA ROTATIE =====

document.getElementById("HeartChakra")
  .setAttribute(
    "transform",
    `
    rotate(${heartAngle - 59})
    scale(${heartScale})
    `
  );

// ===== I-CHING ZICHTBAAR =====

if(beforeOrAtRoot || night === 1 || superHeart || specialHeart){
  document.getElementById("iChing")
    .setAttribute("opacity","0");
} else {
  document.getElementById("iChing")
    .setAttribute("opacity","1");
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
// Vanaf 15/11 blijft de normale Heart-logica gelden.
if(rootStage <= 0){

  background.setAttribute("opacity", "0");

} else if(rootStage <= 5){

  background.setAttribute("opacity", "1");
}


const letters = [
  "letterD",
  "letterQ",
  "letterB",
  "letterP"
];


if(rootStage <= 0){

  // 9/11 en alles daarvoor:
  // compacte gele-wavespellstand q p / d b
  Object.entries(compactDirectionPoints)
    .forEach(([id, point]) => {

      document.getElementById(id)
        .setAttribute("x", point[0]);

      document.getElementById(id)
        .setAttribute("y", point[1]);
    });

} else {

  // Vanaf 10/11:
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
<tspan x="-90" dy="0">
${lang.moon}: G${night} (${lang.nightNames[night-1]})
</tspan>

<tspan x="-90" dy="36">
${lang.sun}: ${animals[seal]}
</tspan>

<tspan x="-90" dy="36">
${lang.tone}: ${tone} (${lang.toneNames[tone-1]})
</tspan>
`;

const LONG_COUNT_OFFSET = 1860921;

const longCountText =
  document.getElementById("longCountText");

let lcDays =
  dayOffset + LONG_COUNT_OFFSET;

const tunAngle =
  (lcDays % 1872000) * (360 / 1872000);

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

longCountText.textContent =
  lang.longCount + ": " +
  longCountDisplay;

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

document.getElementById("toneTabSymbol")
  .src = `zodiac/${tone}.svg`;


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

// BLAUW = antipode
let antipodeSeal = (seal + 10) % 20;

let blueKin =
  antipodeSeal + ((tone - 1) * 20);

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

updateActivePage();

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

    hoverPath.setAttribute("opacity","0");
  };
});

}

function updateActivePage(){

  const panel =
    document.getElementById("infoPanel");

  const title =
    document.getElementById("infoPanelTitle");

  const content =
    document.getElementById("infoPanelContent");

  if(activePage === "intro"){

  panel.style.backgroundImage =
    'url("backgrounds/maya.png")';

  panel.style.backgroundSize =
    "cover";

  panel.style.backgroundPosition =
    "center";

    title.innerHTML = lang.introTitle;

  title.classList.add("chakraTitle");

  content.innerHTML =
    lang.introText;

  }

  if(activePage === "muladhara"){

    panel.style.background =
      "rgba(120,0,0,0.35)";

    title.innerHTML = lang.muladhara;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.muladhara[tone];

  }

  if(activePage === "sahasrara"){

    panel.style.background =
      "rgba(255,255,255,0.18)";

    title.innerHTML = lang.sahasrara;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.sahasrara[night];
  }

if(activePage === "anahata"){

  panel.style.background =
    "rgba(0,128,0,0.25)";

  title.innerHTML =
    lang.anahata;

  title.classList.remove("chakraTitle");

  content.innerHTML =
    pages.anahata[seal + 1];
}

  if(activePage === "vishuddha"){

    panel.style.background =
      "rgba(80,180,255,0.25)";

    title.innerHTML = lang.vishuddha;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.vishuddha[seal + 1];
  }

  if(activePage === "svadhisthana"){

    panel.style.background =
      "rgba(255,120,0,0.25)";

    title.innerHTML = lang.svadhisthana;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.svadhisthana[seal + 1];
  }

  if(activePage === "manipura"){

    panel.style.background =
      "rgba(255,220,0,0.25)";

    title.innerHTML = lang.manipura;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.manipura[seal + 1];
  }

  if(activePage === "ajna"){

    panel.style.background =
      "rgba(90,70,180,0.28)";

    title.innerHTML = lang.ajna;

    title.classList.remove("chakraTitle");

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

    content.innerHTML =
      pages.ajna[sealKey][guideStep];
  }
}

function setActivePage(pageName, tabId){

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
}


const toneTab =
  document.getElementById("toneTab");

toneTab.onclick = () => {

  setActivePage("muladhara", "toneTab");
};

toneTab.onmouseenter = () => {

  if(night === 1){

    document.getElementById("toneSymbol")
      .setAttribute("opacity","1");
  }
};

toneTab.onmouseleave = () => {

  if(night === 1){

    document.getElementById("toneSymbol")
      .setAttribute("opacity","0");

  } else {

    document.getElementById("toneSymbol")
      .setAttribute("opacity","1");
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

  if(night === 1){

    iChing.setAttribute("opacity","1");
  }
};

nightTabHover.onmouseleave = () => {

  if(night === 1){

    iChing.setAttribute("opacity","0");
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

window.addEventListener("load", () => {

    Camera.update();

});

window.addEventListener("resize", () => {

    Camera.update();

});