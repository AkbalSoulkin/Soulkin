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


// ===== BASISDATUM =====
const baseDate = new Date("1982-08-22");

// ===== PAD =====
const pts = [
  [0,250],
  [-147,-202],
  [238,77],
  [-238,77],
  [147,-202]
];

// ===== FRACTALS =====
const animals = [
  "0001 (Imix)",
  "0011 (Ik)",
  "0010 (Akbal)",
  "0000 (Kan)",
  "01 (Chicchan)",
  "0111 (Cimi)",
  "0110 (Manik)",
  "0100 (Lamat)",
  "0101 (Muluc)",
  "11 (Oc)",
  "1110 (Chuen)",
  "1100 (Eb)",
  "1101 (Ben)",
  "1111 (Ix)",
  "10 (Men)",
  "1000 (Cib)",
  "1001 (Caban)",
  "1011 (Etznab)",
  "1010 (Cauac)",
  "00 (Ahau)"
];

const animalFiles = [
  "imix.svg","ik.svg","akbal.svg","kan.svg",
  "chicchan.svg","cimi.svg","manik.svg","lamat.svg",
  "muluc.svg","oc.svg","chuen.svg","eb.svg",
  "ben.svg","ix.svg","men.svg","cib.svg",
  "caban.svg","etznab.svg","cauac.svg","ahau.svg"
];

const sacredSeals = [19, 4, 9, 14];

const colors = [
  "rgba(255,0,0,0.7)",
  "rgba(255,255,255,0.7)",
  "rgba(0,0,255,0.7)",
  "rgba(255,255,0,0.7)"
];

const castleColors = [
  "red",
  "white",
  "blue",
  "yellow",
  "green"
];

const toneNames = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Ophiuchus",
  "Sagitarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const toneColors = [
  "rgba(255,0,0,0.7)",
  "rgba(255,255,0,0.7)",
  "rgba(255,255,255,0.7)",
  "rgba(0,0,255,0.7)",
  "rgba(255,0,0,0.7)",
  "rgba(255,255,0,0.7)",
  "rgba(255,255,255,0.7)",
  "rgba(0,0,255,0.7)",
  "rgba(0,128,0,0.7)",
  "rgba(255,0,0,0.7)",
  "rgba(255,255,0,0.7)",
  "rgba(255,255,255,0.7)",
  "rgba(0,0,255,0.7)"
];

const nightNamesNL = [
  "Heart",    // G1
  "Thunder",  // G2
  "Fire",     // G3
  "Wind",     // G4
  "Heaven",   // G5
  "Lake",     // G6
  "Water",    // G7
  "Mountain", // G8
  "Earth"     // G9
];


// ===== UPDATE =====
function updateFromKin(){

  tone = (kin % 13) + 1;

  seal = kin % 20;

  night = ((kin + 8) % 9) + 1;

  pos = cycle[kin].pos;

  rot = cycle[kin].rot;
}

// ===== DATUM UPDATE =====
function updateDateFromKin(){

  let d = new Date(baseDate);

  d.setDate(baseDate.getDate() + dayOffset);

  let yyyy = d.getFullYear();

  let mm = String(d.getMonth()+1).padStart(2,"0");

  let dd = String(d.getDate()).padStart(2,"0");

  document.getElementById("datePicker").value =
    `${yyyy}-${mm}-${dd}`;
}

// ===== DATE PICKER =====
document.getElementById("datePicker")
.addEventListener("change", e => {

  let d = new Date(e.target.value);

  let diff = Math.floor(
    (d - baseDate) / (1000*60*60*24)
  );

  dayOffset = diff;

  kin = ((dayOffset % 260) + 260) % 260;

  updateFromKin();

  render();
});

// ===== RING =====

const hoverLayer =
  document.getElementById("hoverLayer");

const ringSegments =
  document.getElementById("ringSegments");

const ringAnimals =
  document.getElementById("ringAnimals");

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
}

// ===== RENDER =====
function render(){

  let [x,y] = pts[pos];

  document.getElementById("dot")
    .setAttribute(
      "transform",
      `translate(${x},${y})`
    );

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

if(night === 1){

  toneSymbol.setAttribute("opacity","0");

} else {

  toneSymbol.setAttribute("opacity","1");
}

ringSegments.setAttribute(
  "transform",
  `rotate(${seal * 18})`
);

hoverLayer.setAttribute(
  "transform",
  `rotate(${seal * 18})`
);

ringAnimals.setAttribute(
  "transform",
  `rotate(${seal * 18})`
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
  night === 1 &&
  seal === 19;


const specialHeart =
  tone === 13 &&
  night === 1 &&
  [4,9,14].includes(seal);

if(superHeart){

  document.getElementById("HeartChakra")
    .setAttribute("opacity","1");

  document.getElementById("Background")
    .setAttribute("opacity","1");

  heartScale = 1.35;

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
    rotate(${heartAngle})
    scale(${heartScale})
    `
  );

// ===== I-CHING ZICHTBAAR =====

if(night === 1){

  document.getElementById("iChing")
    .setAttribute("opacity","0");

} else {

  document.getElementById("iChing")
    .setAttribute("opacity","1");
}


// ===== BDPQ POSITIES =====

// 4 vaste punten
const dirPoints = [
  [0, -219],     // boven
  [235, 10],    // rechts
  [0, 198],      // onder
  [-235, 10]    // links
];

// alleen 4 standen
let shift = Math.floor(kin / 13) % 4;

let yinAngle = (kin % 52) * (360 / 52);

document.getElementById("yinYang")
  .setAttribute(
    "transform",
    `
    rotate(${yinAngle - 270})
    scale(1.2)
    `
  );


// ===== BACKGROUND ROTATIE =====

// 260 dagen = 360 graden
let backgroundAngle =
  ((kin + 1 + 260) % 260) * (360 / 260);

document.getElementById("Background")
  .setAttribute(
    "transform",
    `
    rotate(${backgroundAngle})
    scale(0.27)
    `
  );

// beginvolgorde:
// p links
// d rechts
// b onder
// q boven

const letters = [
  "letterQ",
  "letterD",
  "letterB",
  "letterP"
];

letters.forEach((id, i) => {

  let pt = dirPoints[(i + shift) % 4];

  document.getElementById(id)
    .setAttribute("x", pt[0]);

  document.getElementById(id)
    .setAttribute("y", pt[1]);
});

  // actieve kin
  segments.forEach(seg=>{
    seg.setAttribute("stroke-width","2");
  });

  segments[seal]
    .setAttribute("stroke-width","6");

  // kasteel kleur
  let castle = Math.floor(kin / 52);

  document.getElementById("castleCore")
    .setAttribute(
      "fill",
      castleColors[castle]
    );

  // info
document.getElementById("info").innerHTML =
  `
  <tspan x="-70" dy="0">
    Moonseal: G${night} (${nightNamesNL[night-1]})
  </tspan>

  <tspan x="-70" dy="32">
    Sunseal: ${animals[seal]}
  </tspan>

  <tspan x="-70" dy="32">
    Starseed: Tone ${tone} (${toneNames[tone-1]})
  </tspan>
  `;

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

  activePage = "sahasrara";

  updateActivePage();
};

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

    panel.style.background =
      "rgba(0,0,0,0.35)";

    title.innerHTML = "Soulkin";

    content.innerHTML =
      `
      Welcome to Soulkin.<br><br>

      Select one of the tabs above
      to explore the symbolic layers
      of the calendar mechanism.<br><br>

      The information shown here will
      change dynamically depending on
      the selected chakra, kin relationship
      or archetype.
      `;
  }

  if(activePage === "muladhara"){

    panel.style.background =
      "rgba(120,0,0,0.35)";

    title.innerHTML = "Muladhara";

    content.innerHTML =
      muladharaPages[tone];
  }

  if(activePage === "sahasrara"){

    panel.style.background =
      "rgba(255,255,255,0.18)";

    title.innerHTML = "Sahasrara";

    content.innerHTML =
      sahasraraPages[night];
  }

  if(activePage === "anahata"){

    panel.style.background =
      "rgba(0,128,0,0.25)";

    title.innerHTML = "Anahata";

    content.innerHTML =
      anahataPages[seal + 1];
  }

  if(activePage === "vishuddha"){

    panel.style.background =
      "rgba(80,180,255,0.25)";

    title.innerHTML = "Vishuddha";

    content.innerHTML =
      vishuddhaPages[seal + 1];
  }

  if(activePage === "svadhisthana"){

    panel.style.background =
      "rgba(255,120,0,0.25)";

    title.innerHTML = "Svadhisthana";

    content.innerHTML =
      svadhisthanaPages[seal + 1];
  }

  if(activePage === "manipura"){

    panel.style.background =
      "rgba(255,220,0,0.25)";

    title.innerHTML = "Manipura";

    content.innerHTML =
      manipuraPages[seal + 1];
  }

  if(activePage === "ajna"){

    panel.style.background =
      "rgba(90,70,180,0.28)";

    title.innerHTML = "Ajna";

    content.innerHTML =
      ajnaPages[guideSeal + 1];
  }
}

const toneTab =
  document.getElementById("toneTab");

toneTab.onclick = () => {

  activePage = "muladhara";

  updateActivePage();
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

  activePage = "anahata";

  updateActivePage();
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

const occultTabClick =
  document.getElementById("occultTab");

occultTabClick.onclick = () => {

  activePage = "vishuddha";

  updateActivePage();
};

const antipodeTabClick =
  document.getElementById("antipodeTab");

antipodeTabClick.onclick = () => {

  activePage = "svadhisthana";

  updateActivePage();
};

const analogTabClick =
  document.getElementById("analogTab");

analogTabClick.onclick = () => {

  activePage = "manipura";

  updateActivePage();
};

const guideTabClick =
  document.getElementById("guideTab");

guideTabClick.onclick = () => {

  activePage = "ajna";

  updateActivePage();
};

// ===== STEP =====
function step(){

  if(animating) return;

  animating = true;

  let prevPos = pos;
  let prevTone = tone;

  dayOffset++;

  kin = ((dayOffset % 260) + 260) % 260;

  updateFromKin();

  if(prevTone === 13){

    let startRot = rot - 72;
    let endRot = rot;

    animateRotate(startRot,endRot,400,()=>{

      updateDateFromKin();

      animating = false;

      render();
    });

  } else {

    let from = pts[prevPos];
    let to = pts[pos];

    animateMove(from,to,300,()=>{

      updateDateFromKin();

      animating = false;

      render();
    });
  }

  render();
}

// ===== MOVE =====
function animateMove(from,to,duration,callback){

  let start = null;

  function frame(t){

    if(!start) start = t;

    let p = Math.min((t-start)/duration,1);

    let x = from[0] + (to[0]-from[0])*p;
    let y = from[1] + (to[1]-from[1])*p;

    document.getElementById("dot")
      .setAttribute(
        "transform",
        `translate(${x},${y})`
      );

    if(p<1){

      requestAnimationFrame(frame);

    } else {

      callback();
    }
  }

  requestAnimationFrame(frame);
}


// ===== ROTATE =====
function animateRotate(from,to,duration,callback){

  let start = null;

  function frame(t){

    if(!start) start = t;

    let p = Math.min((t-start)/duration,1);

    let r = from + (to-from)*p;

    document.getElementById("rotGroup")
      .setAttribute(
        "transform",
        `rotate(${r})`
      );

    if(p<1){

      requestAnimationFrame(frame);

    } else {

      callback();
    }
  }

  requestAnimationFrame(frame);
}

// ===== START VANDAAG =====
let today = new Date();

dayOffset = Math.floor(
  (today - baseDate) / (1000*60*60*24)
);

kin = ((dayOffset % 260) + 260) % 260;

updateFromKin();

updateDateFromKin();

render();

window.step = step;