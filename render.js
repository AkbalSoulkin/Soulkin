// ===== RENDER =====
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
      pages.muladhara[tone]
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
      pages.anahata[seal + 1]
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