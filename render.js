// ===== RENDER CHAKRAPAGINA'S =====
function updateActivePage(){

  const panel =
    document.getElementById("infoPanel");

  const title =
    document.getElementById("infoPanelTitle");

  const content =
    document.getElementById("infoPanelContent");


  // ===== VASTE STARTDATA =====


  // 14/11/-17264374702 = vierde speciale dag
  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

  // 11/11/-17264374702:
  // Muladhara + vijf middelste chakra's worden leesbaar.
  const CHAKRA_TEXT_START_DAY =
    ROOT_OFFSET - 3;

  // 15/11/-17264374702:
  // bestaande G1–G9-tekst van Sahasrara wordt leesbaar.
  const SAHASRARA_TEXT_START_DAY =
    ROOT_OFFSET + 1;

  // 21/12/-17264374702:
  // eerste hexagram en eerste hexagramtekst.
  const HEXAGRAM_START_DAY = Number(
    daysFromCivil(-17264374702, 12, 21) -
    daysFromCivil(1982, 8, 22)
  );


  // ===== INTRO =====

  if(activePage === "intro"){

    panel.style.backgroundImage =
      'url("backgrounds/maya.png")';

    panel.style.backgroundSize =
      "cover";

    panel.style.backgroundPosition =
      "center";

    title.innerHTML =
      lang.introTitle;

    title.classList.add("chakraTitle");

    content.innerHTML =
      lang.introText;

    return;
  }


if(
  dayOffset < CHAKRA_TEXT_START_DAY &&
  activePage !== "manipura"
){

  panel.style.backgroundImage = "none";

  // Alleen kleur tonen, nog geen tekst
  if(activePage === "muladhara"){
    panel.style.background =
      "rgba(120,0,0,0.35)";
  }

  else if(activePage === "svadhisthana"){
    panel.style.background =
      "rgba(255,120,0,0.25)";
  }

  else if(activePage === "anahata"){
    panel.style.background =
      "rgba(0,128,0,0.25)";
  }

  else if(activePage === "vishuddha"){
    panel.style.background =
      "rgba(80,180,255,0.25)";
  }

  else if(activePage === "ajna"){
    panel.style.background =
      "rgba(90,70,180,0.28)";
  }

  else {
    // Sahasrara
    panel.style.background =
      "transparent";
  }

  title.innerHTML = "";
  content.innerHTML = "";

  title.classList.remove("chakraTitle");

  return;
}

  // ===== MULADHARA =====

  if(activePage === "muladhara"){

    panel.style.background =
      "rgba(120,0,0,0.35)";

    title.innerHTML =
      lang.muladhara;

    title.classList.remove("chakraTitle");

    const toneText =
      pages.muladhara[tone] ?? "";

    let combinationText = "";


    /*
     * 11/11 t/m 14/11:
     *
     * 1 Actualiseren + Energie
     * 2 Erkennen + Relatie
     * 3 Onderscheiden + Perspectief
     * 4 Plaatsen + Essentie
     */
    if(dayOffset <= ROOT_OFFSET){

      const specialPageNumber =
        dayOffset - CHAKRA_TEXT_START_DAY + 1;

combinationText =
  specialPages?.[language]?.[specialPageNumber] ?? "";

    } else {

      /*
       * Vanaf 15/11:
       * de bestaande 260 combinaties.
       *
       * Hier niets aan veranderen.
       */
      combinationText =
        pages.muladharaKin[mechanismKin + 1] ?? "";
    }


    if(combinationText){

      content.innerHTML = `
        <div class="toneText">
          ${toneText}
        </div>

        <div class="textDivider"></div>

        <div class="combinationText">
          ${combinationText}
        </div>
      `;

    } else {

      content.innerHTML = `
        <div class="toneText">
          ${toneText}
        </div>
      `;
    }

    return;
  }


  // ===== SAHASRARA =====

  if(activePage === "sahasrara"){

    panel.style.background =
      "rgba(255,255,255,0.18)";

    title.classList.remove("chakraTitle");


    /*
     * 11/11 t/m 14/11:
     * Sahasrara blijft nog volledig leeg.
     */
    if(dayOffset < SAHASRARA_TEXT_START_DAY){

      title.innerHTML = "";
      content.innerHTML = "";

      return;
    }


    /*
     * Vanaf 15/11:
     * bovenste helft / G1–G9-tekst zichtbaar.
     */
    title.innerHTML =
      lang.sahasrara;

    const nightText =
      pages.sahasrara[night] ?? "";


    /*
     * 15/11 t/m 20/12:
     * alleen de bestaande Sahasrara-tekst.
     */
    if(dayOffset < HEXAGRAM_START_DAY){

      content.innerHTML = `
        <div class="nightText">
          ${nightText}
        </div>
      `;

      return;
    }


    /*
     * Vanaf 21/12:
     * bestaande tekst + juiste hexagramtekst.
     */
    const hexagramNumber =
      (
        (dayOffset - HEXAGRAM_START_DAY) % 64
        + 64
      ) % 64 + 1;

    const hexagramText =
      pages.sahasrara64?.[hexagramNumber] ?? "";

    content.innerHTML = `
      <div class="nightText">
        ${nightText}
      </div>

      <div class="textDivider"></div>

      <div class="combinationText">
        ${hexagramText}
      </div>
    `;

    return;
  }


  // ===== ANAHATA =====

  if(activePage === "anahata"){

    panel.style.background =
      "rgba(0,128,0,0.25)";

    title.innerHTML =
      lang.anahata;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.anahata[seal + 1] ?? "";

    return;
  }


  // ===== VISHUDDHA =====

  if(activePage === "vishuddha"){

    panel.style.background =
      "rgba(80,180,255,0.25)";

    title.innerHTML =
      lang.vishuddha;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.vishuddha[seal + 1] ?? "";

    return;
  }


  // ===== SVADHISTHANA =====

  if(activePage === "svadhisthana"){

    panel.style.background =
      "rgba(255,120,0,0.25)";

    title.innerHTML =
      lang.svadhisthana;

    title.classList.remove("chakraTitle");

    content.innerHTML =
      pages.svadhisthana[seal + 1] ?? "";

    return;
  }

// ===== MANIPURA =====

if(activePage === "manipura"){

  panel.style.background =
    "rgba(255,220,0,0.25)";

  title.classList.remove("chakraTitle");

  // 10/11/-17264374702
  const MANIPURA_TEXT_DAY =
    ROOT_OFFSET - 4;


  // ===== VOOR 10/11 =====
  // Manipura is nog leeg.
  if(dayOffset < MANIPURA_TEXT_DAY){

    title.innerHTML = "";
    content.innerHTML = "";

    return;
  }


  title.innerHTML =
    lang.manipura;


  // ===== EXACT 10/11 =====
  // Eenmalige eerste tekst.
  if(dayOffset === MANIPURA_TEXT_DAY){

    content.innerHTML =
      manipuraPages?.[language]?.[1] ?? "";

    return;
  }


  // ===== VANAF 11/11 =====
  // Normale bestaande Manipura-tekst.
  content.innerHTML =
    pages.manipura[seal + 1] ?? "";

  return;
}

  // ===== AJNA =====

  if(activePage === "ajna"){

    panel.style.background =
      "rgba(90,70,180,0.28)";

    title.innerHTML =
      lang.ajna;

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
      pages.ajna?.[sealKey]?.[guideStep] ?? "";

    return;
  }
}