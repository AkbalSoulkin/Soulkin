const qubLanguage =
  localStorage.getItem(
    "soulkinLanguage"
  ) || "en";

const qubTexts = {

  en: {
    returnTo: "Return to:",
    draw: "Draw a card",
    endTurn: "End turn",
    giveUp: "Give up",
    gameOver: "Game over",
    win: "You win",
    lose: "You lose",
    playAgain: "Play again"
  },

  nl: {
    returnTo: "Terug naar:",
    draw: "Pak een kaart",
    endTurn: "Beëindig beurt",
    giveUp: "Opgeven",
    gameOver: "Spel afgelopen",
    win: "Je wint",
    lose: "Je verliest",
    playAgain: "Opnieuw spelen"
  },

  tr: {
    returnTo: "Geri dön:",
    draw: "Bir kart çek",
    endTurn: "Turu bitir",
    giveUp: "Pes et",
    gameOver: "Oyun bitti",
    win: "Kazandın",
    lose: "Kaybettin",
    playAgain: "Tekrar oyna"
  },

  ru: {
    returnTo: "Вернуться:",
    draw: "Взять карту",
    endTurn: "Завершить ход",
    giveUp: "Сдаться",
    gameOver: "Игра окончена",
    win: "Вы выиграли",
    lose: "Вы проиграли",
    playAgain: "Играть снова"
  },

  jp: {
    returnTo: "戻る:",
    draw: "カードを引く",
    endTurn: "ターン終了",
    giveUp: "降参する",
    gameOver: "ゲーム終了",
    win: "あなたの勝ち",
    lose: "あなたの負け",
    playAgain: "もう一度遊ぶ"
  }

};

const qubText =
  qubTexts[qubLanguage] ||
  qubTexts.en;

document
  .getElementById("returnText")
  .textContent = qubText.returnTo;

const gameOverScreen =
  document.getElementById("gameOverScreen");

const gameOverTitle =
  document.getElementById("gameOverTitle");

const playAgainButton =
  document.getElementById("playAgainButton");

playAgainButton.textContent =
  qubText.playAgain;

const gameSvg = document.getElementById("gameSvg");
const info = document.getElementById("info");

const seals = [
  "Imix","Ik","Akbal","Kan","Chicchan",
  "Cimi","Manik","Lamat","Muluc","Oc",
  "Chuen","Eb","Ben","Ix","Men",
  "Cib","Caban","Etznab","Cauac","Ahau"
];

const tonesFiles = [
  "tone1.svg","tone2.svg","tone3.svg","tone4.svg",
  "tone5.svg","tone6.svg","tone7.svg","tone8.svg",
  "tone9.svg","tone10.svg","tone11.svg","tone12.svg",
  "tone13.svg"
];

const animalFiles = [
  "qimix.svg","qik.svg","qakbal.svg","qkan.svg",
  "qchicchan.svg","qcimi.svg","qmanik.svg","qlamat.svg",
  "qmuluc.svg","qoc.svg","qchuen.svg","qeb.svg",
  "qben.svg","qix.svg","qmen.svg","qcib.svg",
  "qcaban.svg","qetznab.svg","qcauac.svg","qahau.svg"
];

const colors = [
  "#d94b4b",
  "#eeeeee",
  "#3f6fd8",
  "#e0c84f"
];

let deck = [];
let hand = [];
let tableCards = [];
let opponentHand = [];
let turnCards = [];
let playerOpened = false;
let opponentOpened = false;
let turnHasValidPlay = false;
let openingScore = 0;
let drawAnimating = false;
let turnTableSnapshot = [];
let turnStartedAtMaxHand = false;

const MAX_HAND = 26;

let gameOver = false;
let winner = null;

const OPENING_SCORE = 20;

const turnButton =
  document.getElementById("turnButton");

const CARD_W = 70;
const CARD_H = 95;
const GRID_X = -820;
const GRID_Y = -400;
const GRID_COLS = 27;
const GRID_ROWS = 13;
const MIDDLE_ROW = 6;
const VISIBLE_GRID_ROWS = 7;
const GRID_GAP_X = 80;
const GRID_GAP_Y = 100;
const DECK_X = 760;
const DECK_Y = -525;
const OPPONENT_Y = -525;
const DRAW_ANIMATION_TIME = 450;
const GROUP_GAP = 2;
const OPPONENT_ROWS = [];

for(
  let row = MIDDLE_ROW - 1;
  row >= 0;
  row--
){
  OPPONENT_ROWS.push(row);
}

const PLAYER_ROWS = [];

for(
  let row = MIDDLE_ROW + 1;
  row < GRID_ROWS;
  row++
){
  PLAYER_ROWS.push(row);
}

let boardOffsetX = 0;
let boardOffsetY =
  -(
    MIDDLE_ROW -
    Math.floor(
      VISIBLE_GRID_ROWS / 2
    )
  ) *
  GRID_GAP_Y;

let dragging = null;

for(let tone = 1; tone <= 13; tone++){
  for(let seal = 0; seal < 20; seal++){
deck.push({
  id: `${tone}-${seal}`,
  tone,
  seal: seals[seal],
  color: colors[seal % 4],
  toneFile: tonesFiles[tone - 1],
  animalFile: animalFiles[seal],
  x: 0,
  y: 0,
  zone: "deck",
  committed: false
});
  }
}

function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(deck);

hand = deck.splice(0, 13);
opponentHand = deck.splice(0, 13);

hand.forEach(card => card.zone = "hand");
opponentHand.forEach(card => card.zone = "opponent");

function svgPoint(evt){
  const pt = gameSvg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  return pt.matrixTransform(gameSvg.getScreenCTM().inverse());
}

function gridPosition(col, row){
  return {
    x:
      GRID_X +
      col * GRID_GAP_X +
      boardOffsetX,

    y:
      GRID_Y +
      row * GRID_GAP_Y +
      boardOffsetY
  };
}

function scrollBoardRows(amount){

  const maxScrollRows =
    GRID_ROWS -
    VISIBLE_GRID_ROWS;

  const minOffset =
    -maxScrollRows *
    GRID_GAP_Y;

  boardOffsetY +=
    amount *
    GRID_GAP_Y;

  boardOffsetY =
    Math.max(
      minOffset,
      Math.min(
        0,
        boardOffsetY
      )
    );

  render();
}

function nearestGridSlot(x, y){

  const col =
    Math.round(
      (
        x -
        GRID_X -
        boardOffsetX
      ) /
      GRID_GAP_X
    );

  const row =
    Math.round(
      (
        y -
        GRID_Y -
        boardOffsetY
      ) /
      GRID_GAP_Y
    );

  if(
    col < 0 ||
    col >= GRID_COLS ||
    row < 0 ||
    row >= GRID_ROWS
  ){
    return null;
  }

  return {
    col,
    row,
    ...gridPosition(col, row)
  };
}

function slotOccupied(col, row, ignoreCard){
  return tableCards.some(card =>
    card !== ignoreCard &&
    card.col === col &&
    card.row === row
  );
}


function getSealIndex(card){
  return seals.indexOf(card.seal);
}

function getCardColorIndex(card){
  return getSealIndex(card) % 4;
}

function getCardAt(col, row){
  return tableCards.find(card =>
    card.col === col &&
    card.row === row
  );
}

function isSequenceGroup(cards){
  if(cards.length < 3) return false;

  function checkOrder(list){
    for(let i = 1; i < list.length; i++){
      const prev = list[i - 1];
      const cur = list[i];

      const expectedTone =
        (prev.tone % 13) + 1;

      const expectedColor =
        (getCardColorIndex(prev) + 1) % 4;

      if(cur.tone !== expectedTone) return false;
      if(getCardColorIndex(cur) !== expectedColor) return false;
    }

    return true;
  }

  return checkOrder(cards) ||
         checkOrder([...cards].reverse());
}

function isSameGroup(cards){
  if(cards.length < 3 || cards.length > 5){
    return false;
  }

  const tone = cards[0].tone;
  const color = getCardColorIndex(cards[0]);

  return cards.every(card =>
    card.tone === tone &&
    getCardColorIndex(card) === color
  );
}

function validateGroup(cards){
  if(isSameGroup(cards)){
    return {
      valid: true,
      type: "same"
    };
  }

  if(isSequenceGroup(cards)){
    return {
      valid: true,
      type: "sequence"
    };
  }

  return {
    valid: false,
    type: "invalid"
  };
}

function returnTurnCardsToHand(){

  const cardsToReturn = [...turnCards];

  cardsToReturn.forEach(card => {

    tableCards =
      tableCards.filter(c => c !== card);

    if(!hand.includes(card)){
      hand.push(card);
    }

    card.zone = "hand";
    card.committed = false;

    delete card.col;
    delete card.row;
  });

  turnCards = [];
}

function findValidGroupsInHand(cards){

  const groups = [];

  // ===== DEZELFDE =====
  // Zelfde toon + zelfde kleur, 3 t/m 5 kaarten

  for(let tone = 1; tone <= 13; tone++){

    for(let color = 0; color < 4; color++){

      const matches = cards.filter(card =>
        card.tone === tone &&
        getCardColorIndex(card) === color
      );

      if(matches.length >= 3){

        groups.push(
          matches.slice(0, Math.min(5, matches.length))
        );
      }
    }
  }


  // ===== VOLGORDE =====
  // toon +1 en kleur +1, cyclisch

  for(const startCard of cards){

    const sequence = [startCard];
    let current = startCard;

    const used = new Set([startCard]);

    while(true){

      const expectedTone =
        (current.tone % 13) + 1;

      const expectedColor =
        (getCardColorIndex(current) + 1) % 4;

      const next = cards.find(card =>
        !used.has(card) &&
        card.tone === expectedTone &&
        getCardColorIndex(card) === expectedColor
      );

      if(!next){
        break;
      }

      sequence.push(next);
      used.add(next);
      current = next;
    }

    if(sequence.length >= 3){
      groups.push(sequence);
    }
  }

  return groups;
}

function getCombinations(cards, length){

  const result = [];

  function build(start, combo){

    if(combo.length === length){
      result.push([...combo]);
      return;
    }

    for(let i = start; i < cards.length; i++){

      combo.push(cards[i]);

      build(i + 1, combo);

      combo.pop();
    }
  }

  build(0, []);

  return result;
}

function getAllOpponentGroups(){

  const groups = [];

  /*
    SAME GROUPS
    Zelfde tone + zelfde kleur
    Minimaal 3, maximaal 5 kaarten
  */

  for(let tone = 1; tone <= 13; tone++){

    for(let color = 0; color < 4; color++){

      const matches = opponentHand.filter(card =>
        card.tone === tone &&
        getCardColorIndex(card) === color
      );

      if(matches.length >= 3){

        const maxLength = Math.min(5, matches.length);

        for(let length = 3; length <= maxLength; length++){

          // Alle combinaties van deze lengte
          getCombinations(matches, length)
            .forEach(combo => {

              if(isSameGroup(combo)){
                groups.push(combo);
              }

            });
        }
      }
    }
  }


  /*
    SEQUENCES
    Tone +1
    Kleur +1
  */

  opponentHand.forEach(startCard => {

    const sequence = [startCard];

    let currentTone = startCard.tone;
    let currentColor = getCardColorIndex(startCard);

    const used = new Set([startCard]);

    while(true){

      const nextTone =
        (currentTone % 13) + 1;

      const nextColor =
        (currentColor + 1) % 4;

      const nextCard =
        opponentHand.find(card =>
          !used.has(card) &&
          card.tone === nextTone &&
          getCardColorIndex(card) === nextColor
        );

      if(!nextCard){
        break;
      }

      sequence.push(nextCard);
      used.add(nextCard);

      currentTone = nextTone;
      currentColor = nextColor;

      if(sequence.length >= 3){

        // Alle lengtes vanaf 3 opslaan
        groups.push([...sequence]);
      }
    }
  });


  /*
    Dubbele groepen verwijderen
  */

  const unique = new Map();

  groups.forEach(group => {

    const key =
      group
        .map(card => card.id)
        .sort()
        .join("|");

    unique.set(key, group);
  });

  return [...unique.values()];
}

function chooseBestOpponentGroups(){

  const groups = getAllOpponentGroups();

  let bestGroups = [];
  let bestCardCount = 0;
  let bestScore = 0;


  function search(index, chosenGroups, usedCards){

    if(index >= groups.length){

      const cardCount = usedCards.size;

      const score =
        [...usedCards].reduce(
          (total, card) => total + card.tone,
          0
        );


      /*
        Voor de eerste opening:
        totaal moet minstens 20 punten zijn
      */

      if(
        !opponentOpened &&
        score < OPENING_SCORE
      ){
        return;
      }


      /*
        Prioriteit:

        1. meeste kaarten kwijt
        2. bij gelijk aantal: hoogste score
      */

      if(
        cardCount > bestCardCount ||
        (
          cardCount === bestCardCount &&
          score > bestScore
        )
      ){

        bestCardCount = cardCount;
        bestScore = score;
        bestGroups = [...chosenGroups];
      }

      return;
    }


    /*
      Optie 1:
      deze groep overslaan
    */

    search(
      index + 1,
      chosenGroups,
      usedCards
    );


    /*
      Optie 2:
      deze groep gebruiken
      maar alleen als geen kaart al gebruikt is
    */

    const group = groups[index];

    const overlaps =
      group.some(card =>
        usedCards.has(card)
      );

    if(overlaps){
      return;
    }


    const newUsed =
      new Set(usedCards);

    group.forEach(card =>
      newUsed.add(card)
    );

    chosenGroups.push(group);

    search(
      index + 1,
      chosenGroups,
      newUsed
    );

    chosenGroups.pop();
  }


  search(
    0,
    [],
    new Set()
  );


  return bestGroups;
}

/*
  ============================================
  OPPONENT FULL TABLE SEARCH
  ============================================

  Zodra de tegenstander geopend is:

  - alle tafelkaarten moeten behouden blijven
  - tafelgroepen mogen volledig worden gesplitst
  - kaarten uit verschillende groepen mogen
    opnieuw gecombineerd worden
  - kaarten uit de hand mogen overal gebruikt worden
  - alle overgebleven handkaarten mogen ook
    nieuwe losse groepen vormen

  Doel:
  zoveel mogelijk handkaarten kwijt.
*/

function getAllValidGroupsFromPool(pool){

  const unique = new Map();

  /*
    Kolom 0 en laatste kolom blijven vrij.

    Een enkele combinatie kan dus nooit
    langer zijn dan dit.
  */
const MAX_GROUP_LENGTH = 5;


  /*
    =====================================
    KAARTEN VOORAF INDEXEREN
    =====================================

    Hierdoor hoeven we niet telkens opnieuw
    de volledige pool te filteren.
  */

  const cardsByToneColor =
    new Map();


  pool.forEach(card => {

    const key =
      `${card.tone}-${getCardColorIndex(card)}`;

    if(!cardsByToneColor.has(key)){

      cardsByToneColor.set(
        key,
        []
      );
    }

    cardsByToneColor
      .get(key)
      .push(card);
  });



  function addGroup(
    cards,
    type
  ){

    if(
      cards.length < 3 ||
      cards.length > MAX_GROUP_LENGTH
    ){
      return;
    }


    /*
      De groep is door de generator
      zelf al geldig opgebouwd.

      We hoeven validateGroup()
      dus niet nog eens uit te voeren.
    */

    const key =
      cards
        .map(card => card.id)
        .sort()
        .join("|");


    if(unique.has(key)){
      return;
    }


    unique.set(
      key,
      {
        cards: [...cards],
        type
      }
    );
  }



  /*
    =====================================
    SAME GROUPS
    =====================================

    Zelfde toon + zelfde kleur.
    Lengte 3 t/m 5.

    Alle combinaties blijven mogelijk.
  */

  for(let tone = 1; tone <= 13; tone++){

    for(let color = 0; color < 4; color++){

      const key =
        `${tone}-${color}`;

      const matches =
        cardsByToneColor.get(key) ||
        [];


      const maxLength =
        Math.min(
          5,
          matches.length
        );


      for(
        let length = 3;
        length <= maxLength;
        length++
      ){

        const combinations =
          getCombinations(
            matches,
            length
          );


        combinations.forEach(combo => {

          addGroup(
            combo,
            "same"
          );

        });
      }
    }
  }



  /*
    =====================================
    SEQUENCES
    =====================================

    Iedere mogelijke kaart wordt nog steeds
    onderzocht.

    Verschil:
    zodra MAX_GROUP_LENGTH bereikt is,
    stoppen we dat zoekpad.

    Verder zoeken kan namelijk nooit meer
    een bruikbare groep opleveren.
  */


  function extendSequence(
    sequence,
    usedCards
  ){

    /*
      Deze groep is geldig doordat iedere
      volgende kaart exact tone +1 en
      color +1 volgt.
    */

    if(sequence.length >= 3){

      addGroup(
        sequence,
        "sequence"
      );
    }


    /*
      HARD STOP.

      Dit is de belangrijke versnelling.
    */

    if(
      sequence.length >=
      MAX_GROUP_LENGTH
    ){
      return;
    }


    const last =
      sequence[
        sequence.length - 1
      ];


    const nextTone =
      (last.tone % 13) + 1;


    const nextColor =
      (
        getCardColorIndex(last) + 1
      ) % 4;


    const key =
      `${nextTone}-${nextColor}`;


    const possibilities =
      cardsByToneColor.get(key) ||
      [];


    for(const nextCard of possibilities){

      if(usedCards.has(nextCard)){
        continue;
      }


      const nextUsed =
        new Set(usedCards);

      nextUsed.add(
        nextCard
      );


      extendSequence(
        [
          ...sequence,
          nextCard
        ],
        nextUsed
      );
    }
  }



  /*
    Iedere kaart mag nog steeds
    het begin van een sequence zijn.
  */

  pool.forEach(startCard => {

    extendSequence(
      [startCard],
      new Set([startCard])
    );

  });



  return [
    ...unique.values()
  ];
}


/*
  ============================================
  COMPLETE TAFEL HERINDELEN
  ============================================
*/
function findBestOpponentRearrangement(){

  if(!opponentOpened){
    return null;
  }


  const originalTable =
    [...tableCards];

  const originalHand =
    [...opponentHand];

  const pool = [
    ...originalTable,
    ...originalHand
  ];


  /*
    =====================================
    BITMASKS
    =====================================

    Iedere kaart krijgt één bit.

    Bijvoorbeeld:

    kaart 0 = 000001
    kaart 1 = 000010
    kaart 2 = 000100

    Daardoor worden overlap-controles
    extreem goedkoop.
  */

  const cardBits =
    new Map();


  pool.forEach((card, index) => {

    cardBits.set(
      card,
      1n << BigInt(index)
    );

  });


  let tableMask = 0n;
  let handMask = 0n;


  originalTable.forEach(card => {

    tableMask |=
      cardBits.get(card);

  });


  originalHand.forEach(card => {

    handMask |=
      cardBits.get(card);

  });



  /*
    Alle mogelijke geldige groepen
    blijven exact dezelfde.
  */

  const rawCandidates =
    getAllValidGroupsFromPool(
      pool
    );


  /*
    Iedere kandidaat één keer
    omzetten naar bitmasks.
  */

  const candidates =
    rawCandidates.map(group => {

      let mask = 0n;
      let groupTableMask = 0n;
      let groupHandMask = 0n;

      let handCount = 0;
      let handScore = 0;


      group.cards.forEach(card => {

        const bit =
          cardBits.get(card);

        mask |= bit;


        if(
          tableMask & bit
        ){

          groupTableMask |= bit;

        }


        if(
          handMask & bit
        ){

          groupHandMask |= bit;

          handCount++;

          handScore +=
            card.tone;
        }

      });


      return {
        cards: group.cards,
        type: group.type,

        mask,

        tableMask:
          groupTableMask,

        handMask:
          groupHandMask,

        handCount,
        handScore
      };
  });



  /*
    =====================================
    TAFELKAART -> MOGELIJKE GROEPEN
    =====================================
  */

  const groupsByTableCard =
    new Map();


  originalTable.forEach(card => {

    groupsByTableCard.set(
      card,
      []
    );

  });


  candidates.forEach(group => {

    group.cards.forEach(card => {

      if(
        groupsByTableCard.has(card)
      ){

        groupsByTableCard
          .get(card)
          .push(group);
      }

    });

  });



  /*
    =====================================
    HAND-ONLY GROEPEN
    =====================================

    Voor nieuwe groepen die volledig
    uit resterende handkaarten bestaan.
  */

  const handOnlyGroups =
    candidates.filter(group =>
      group.tableMask === 0n
    );


  const handGroupsByCard =
    new Map();


  originalHand.forEach(card => {

    handGroupsByCard.set(
      card,
      []
    );

  });


  handOnlyGroups.forEach(group => {

    group.cards.forEach(card => {

      if(
        handGroupsByCard.has(card)
      ){

        handGroupsByCard
          .get(card)
          .push(group);
      }

    });

  });



  /*
    =====================================
    BESTE GROEPEN UIT RESTERENDE HAND
    =====================================
  */

  const handMemo =
    new Map();


  function solveRemainingHand(
    availableMask
  ){

    if(availableMask === 0n){

      return {
        groups: [],
        usedMask: 0n,
        count: 0,
        score: 0
      };
    }


    if(
      handMemo.has(
        availableMask
      )
    ){

      return handMemo.get(
        availableMask
      );
    }


    /*
      Kies opnieuw de kaart met
      de minste opties.

      Maar nu zonder Sets te bouwen.
    */

    let chosenCard = null;
    let chosenBit = 0n;
    let chosenOptions = null;


    for(const card of originalHand){

      const bit =
        cardBits.get(card);


      if(
        !(availableMask & bit)
      ){
        continue;
      }


      const options =
        (
          handGroupsByCard.get(card) ||
          []
        ).filter(group =>

          (
            group.mask &
            availableMask
          ) === group.mask

        );


      if(
        chosenOptions === null ||
        options.length <
        chosenOptions.length
      ){

        chosenCard = card;
        chosenBit = bit;
        chosenOptions = options;


        /*
          Nul mogelijkheden is
          al optimaal als keuze.
        */

        if(options.length === 0){
          break;
        }
      }
    }


    /*
      Optie 1:
      deze kaart niet gebruiken.
    */

    let best =
      solveRemainingHand(
        availableMask &
        ~chosenBit
      );


    /*
      Optie 2:
      iedere geldige groep proberen.
    */

    for(
      const group of chosenOptions
    ){

      const nextMask =
        availableMask &
        ~group.mask;


      const result =
        solveRemainingHand(
          nextMask
        );


      const candidateResult = {

        groups: [
          group,
          ...result.groups
        ],

        usedMask:
          group.mask |
          result.usedMask,

        count:
          group.handCount +
          result.count,

        score:
          group.handScore +
          result.score
      };


      if(
        candidateResult.count >
        best.count ||
        (
          candidateResult.count ===
            best.count &&
          candidateResult.score >
            best.score
        )
      ){

        best =
          candidateResult;
      }
    }


    handMemo.set(
      availableMask,
      best
    );


    return best;
  }



  /*
    Kleine helpers voor alleen
    de maximaal 26 handkaarten.
  */

  function countHandMask(mask){

    let count = 0;

    for(const card of originalHand){

      if(
        mask &
        cardBits.get(card)
      ){
        count++;
      }
    }

    return count;
  }


  function scoreHandMask(mask){

    let score = 0;

    for(const card of originalHand){

      if(
        mask &
        cardBits.get(card)
      ){
        score += card.tone;
      }
    }

    return score;
  }



  /*
    =====================================
    HOOFDZOEKER
    =====================================
  */

  let bestSolution = null;

  const visited =
    new Set();


  function search(
    uncoveredTableMask,
    usedMask,
    chosenGroups
  ){

    /*
      Kan nooit beter worden dan alle
      kaarten uit zijn hand kwijt.

      Zodra dat lukt zijn we klaar.
    */

    if(
      bestSolution &&
      bestSolution.handCardsUsed ===
        originalHand.length
    ){
      return;
    }


    /*
      Alle bestaande tafelkaarten
      hebben een geldige bestemming.
    */

    if(
      uncoveredTableMask === 0n
    ){

      const usedHandMask =
        usedMask &
        handMask;


      const remainingHandMask =
        handMask &
        ~usedHandMask;


      const extra =
        solveRemainingHand(
          remainingHandMask
        );


      const completeUsedHandMask =
        usedHandMask |
        extra.usedMask;


      const handCardsUsed =
        countHandMask(
          completeUsedHandMask
        );


      const handScore =
        scoreHandMask(
          completeUsedHandMask
        );


      if(
        !bestSolution ||
        handCardsUsed >
          bestSolution.handCardsUsed ||
        (
          handCardsUsed ===
            bestSolution.handCardsUsed &&
          handScore >
            bestSolution.handScore
        )
      ){

        const completeGroups = [
          ...chosenGroups,
          ...extra.groups
        ];


        const usedHandCards =
          originalHand.filter(card =>

            completeUsedHandMask &
            cardBits.get(card)

          );


        bestSolution = {

          groups:
            completeGroups.map(
              group => ({
                cards:
                  [...group.cards],
                type:
                  group.type
              })
            ),

          usedHandCards,

          handCardsUsed,

          handScore
        };
      }


      return;
    }



    /*
      =====================================
      MEMO STATE
      =====================================

      Omdat tafel- en handbits elkaar
      niet overlappen kunnen we ze simpel
      combineren tot één BigInt.

      Geen arrays.
      Geen sort().
      Geen join().
      Geen strings.
    */

    const stateKey =
      uncoveredTableMask |
      (
        usedMask &
        handMask
      );


    if(
      visited.has(
        stateKey
      )
    ){
      return;
    }


    visited.add(
      stateKey
    );



    /*
      =====================================
      MEEST BEPERKTE TAFELKAART KIEZEN
      =====================================
    */

    let chosenCard = null;
    let chosenBit = 0n;
    let options = null;


    for(
      const card of originalTable
    ){

      const bit =
        cardBits.get(card);


      if(
        !(
          uncoveredTableMask &
          bit
        )
      ){
        continue;
      }


      const possible =
        (
          groupsByTableCard.get(card) ||
          []
        ).filter(group =>

          (
            group.mask &
            usedMask
          ) === 0n

        );


      if(
        options === null ||
        possible.length <
        options.length
      ){

        chosenCard = card;
        chosenBit = bit;
        options = possible;


        if(
          possible.length === 0
        ){
          break;
        }
      }
    }



    /*
      Geen geldige manier:
      tak direct stoppen.
    */

    if(
      !options ||
      options.length === 0
    ){
      return;
    }



    /*
      =====================================
      ALLE MOGELIJKHEDEN PROBEREN
      =====================================
    */

    for(const group of options){

      const nextUsedMask =
        usedMask |
        group.mask;


      const nextUncoveredMask =
        uncoveredTableMask &
        ~group.tableMask;


      chosenGroups.push(
        group
      );


      search(
        nextUncoveredMask,
        nextUsedMask,
        chosenGroups
      );


      chosenGroups.pop();


      /*
        Absolute optimum bereikt.
      */

      if(
        bestSolution &&
        bestSolution.handCardsUsed ===
          originalHand.length
      ){
        return;
      }
    }
  }



  search(
    tableMask,
    0n,
    []
  );


  if(
    !bestSolution ||
    bestSolution.handCardsUsed === 0
  ){
    return null;
  }


  return bestSolution;
}



/*
  Bepaal waar een nieuwe combinatie
  visueel ongeveer thuishoort.

  Bestaande tableSide blijft dus
  zoveel mogelijk gerespecteerd.
*/

function getSolvedGroupSide(group){

  let opponentVotes = 0;
  let playerVotes = 0;


  group.cards.forEach(card => {

    if(
      card.tableSide ===
      "opponent"
    ){
      opponentVotes++;
    }

    if(
      card.tableSide ===
      "player"
    ){
      playerVotes++;
    }

  });


  if(playerVotes > opponentVotes){
    return "player";
  }

  return "opponent";
}



/*
  Groepen over meerdere rijen verdelen.

  Kolom 0 vrij links.
  Laatste kolom vrij rechts.
  Exact GROUP_GAP tussen groepen.
*/

function placeSolvedGroups(
  groups,
  rows
){

  /*
    Eerst alleen BEREKENEN.
    Pas als alles past werkelijk plaatsen.
  */

  const placements = [];

  let rowIndex = 0;
  let col = 1;


  for(const group of groups){

    const length =
      group.cards.length;


    /*
      Laat altijd één vak rechts vrij.
    */

    if(
      col + length - 1 >
      GRID_COLS - 2
    ){

      rowIndex++;
      col = 1;
    }


    if(rowIndex >= rows.length){
      return false;
    }


    placements.push({
      group,
      row: rows[rowIndex],
      startCol: col
    });


    /*
      Exact twee lege plekken
      tussen complete groepen.
    */

    col +=
      length +
      GROUP_GAP;
  }


  /*
    Alles past:
    NU pas werkelijk verplaatsen.
  */

  placements.forEach(
    placement => {

      const cards =
        [...placement.group.cards];

      cards.forEach(
        (card, index) => {

          card.row =
            placement.row;

          card.col =
            placement.startCol +
            index;
        }
      );
    }
  );


  return true;
}



function applyOpponentRearrangement(
  solution
){

  if(!solution){
    return false;
  }


  const opponentGroups = [];
  const playerGroups = [];


  solution.groups.forEach(group => {

    const side =
      getSolvedGroupSide(group);

    if(side === "player"){
      playerGroups.push(group);
    } else {
      opponentGroups.push(group);
    }

  });


  /*
    Nieuwe kaarten uit zijn hand
    werkelijk van hand naar tafel.
  */

  const usedHandSet =
    new Set(
      solution.usedHandCards
    );


  opponentHand =
    opponentHand.filter(card =>
      !usedHandSet.has(card)
    );


  /*
    Alle kaarten uit de gevonden oplossing
    zijn nu de nieuwe volledige tafel.
  */

  tableCards =
    solution.groups.flatMap(
      group => group.cards
    );


  /*
    Eerst kaartstatus goedzetten.
  */

  solution.groups.forEach(group => {

    const side =
      getSolvedGroupSide(group);


    group.cards.forEach(card => {

      const cameFromHand =
        usedHandSet.has(card);

      card.zone = "table";
      card.committed = true;
      card.tableSide = side;

      if(cameFromHand){
        card.owner = "opponent";
      }
    });
  });


  /*
    Tegenstander boven,
    speler onder.

    We hebben nu 7 rijen, dus bij
    grote tafels kunnen ook extra
    rijen gebruikt worden.
  */

/*
  Eerst maximaal twee normale rijen
  per kant gebruiken.
*/

let opponentPlaced =
  placeSolvedGroups(
    opponentGroups,
    OPPONENT_ROWS
  );

let playerPlaced =
  placeSolvedGroups(
    playerGroups,
    PLAYER_ROWS
  );


/*
  Past één kant niet?

  Dan beschouwen we vanaf hier de tafel
  als één gezamenlijke speelruimte.

  Alle groepen opnieuw verdelen over:

  boven 1
  boven 2
  onder 2
  onder 1

  en PAS daarna de twee derde rijen.
*/

if(
  !opponentPlaced ||
  !playerPlaced
){

  const allGroups = [
    ...opponentGroups,
    ...playerGroups
  ];

  const placed =
    placeSolvedGroups(
      allGroups,
[
  ...OPPONENT_ROWS,
  ...PLAYER_ROWS
]
    );

  if(!placed){

    console.warn(
      "Solved table does not fit board"
    );
  }
}


  if(
    !opponentPlaced ||
    !playerPlaced
  ){

    console.warn(
      "Solved table does not fit board"
    );
  }


  return true;
}

function findOpponentSpace(length){

  const row =
  OPPONENT_ROWS[0];

  // Zoek de meest rechtse kaart van de tegenstander op rij 0
  let lastCol = null;

  for(let col = 0; col < GRID_COLS; col++){

    const card = getCardAt(col, row);

    if(card && card.owner === "opponent"){
      lastCol = col;
    }
  }

  // Eerste set
  if(lastCol === null){
    return {
      row: 0,
      startCol: 1
    };
  }

  // Volgende set: drie lege posities ertussen
  const startCol =
    lastCol + GROUP_GAP + 1;

  if(startCol + length > GRID_COLS){
    return null;
  }

  return {
    row: 0,
    startCol
  };
}

function keepGroupSpacing(row){

  if(!isWholeTableValid()){
    return;
  }

  normalizeTableLayout();
}

function playOpponentGroup(group){

const space =
  findOpponentSpace(group.length);

  if(!space){
    return false;
  }

  group.forEach((card, i) => {

    opponentHand =
      opponentHand.filter(c => c !== card);

card.zone = "table";
card.committed = true;
card.owner = "opponent";
card.tableSide = "opponent";


    card.col =
      space.startCol + i;

    card.row =
      space.row;

    const pos =
      gridPosition(card.col, card.row);

    card.x = pos.x;
    card.y = pos.y;

    tableCards.push(card);
  });


  if(!opponentOpened){
    opponentOpened = true;
  }

  return true;
}

function findGroups(){

  const groups = [];

  // horizontale groepen
  for(let row = 0; row < GRID_ROWS; row++){

    let current = [];

    for(let col = 0; col < GRID_COLS; col++){
      const card = getCardAt(col, row);

      if(card){
        current.push(card);
      } else {
        if(current.length >= 3){
          groups.push(current);
        }
        current = [];
      }
    }

    if(current.length >= 3){
      groups.push(current);
    }
  }

  // verticale groepen
  for(let col = 0; col < GRID_COLS; col++){

    let current = [];

    for(let row = 0; row < GRID_ROWS; row++){
      const card = getCardAt(col, row);

      if(card){
        current.push(card);
      } else {
        if(current.length >= 3){
          groups.push(current);
        }
        current = [];
      }
    }

    if(current.length >= 3){
      groups.push(current);
    }
  }

  return groups.map(cards => ({
    cards,
    ...validateGroup(cards)
  }));
}

function getTurnGroups(){

  const groups = findGroups();

  return groups.filter(group =>
    group.cards.some(card =>
      turnCards.includes(card)
    )
  );
}


function calculateTurnScore(){

  return turnCards.reduce(
    (total, card) => total + card.tone,
    0
  );
}


function updateTurnState(){

  const validTurnCards =
    getValidTurnCards();

  const validScore =
    validTurnCards.reduce(
      (total, card) =>
        total + card.tone,
      0
    );

  openingScore = validScore;


  /*
    De COMPLETE tafel moet geldig zijn.

    Dus:
    - geen kapot gesplitst rijtje
    - geen losse committed kaarten
    - geen half afgemaakte manipulatie
  */
  const wholeTableValid =
    isWholeTableValid();


  if(!playerOpened){

    turnHasValidPlay =
      validTurnCards.length > 0 &&
      validScore >= OPENING_SCORE &&
      wholeTableValid;

  } else {

    turnHasValidPlay =
      validTurnCards.length > 0 &&
      wholeTableValid;
  }


  updateTurnButton();
}


function updateTurnButton(){

  if(gameOver){

    turnButton.textContent =
      qubText.gameOver;

    turnButton.disabled = true;
    return;
  }


  /*
    Een GELDIGE zet mag je natuurlijk
    nog steeds afmaken, ook wanneer je
    met 26 kaarten begon.
  */

  if(turnHasValidPlay){

    turnButton.textContent =
      qubText.endTurn;

    return;
  }


if(
  turnStartedAtMaxHand ||
  deck.length === 0
){

  turnButton.textContent =
    qubText.giveUp;

  return;
}


  turnButton.textContent =
    qubText.draw;
}

function endGame(who){

  gameOver = true;
  winner = who;

  turnButton.disabled = true;

if(who === "player"){
  gameOverTitle.textContent =
    qubText.win;
} else {
  gameOverTitle.textContent =
    qubText.lose;
}

  gameOverScreen.classList.remove("hidden");
}

function drawPlayerCard(){

  /*
    Geen kaart meer beschikbaar:
    degene die moet trekken verliest.
  */

  if(deck.length === 0){

    endGame("opponent");
    return;
  }


  const card = deck.pop();

  card.zone = "hand";
  hand.push(card);


  /*
    26 kaarten = direct verlies.
  */

  if(hand.length > MAX_HAND){

    render();

    endGame("opponent");
    return;
  }


  const cardIndex =
    hand.length - 1;

  const target =
    getPlayerHandPosition(
      cardIndex
    );


  animateDrawCard(
    target.x,
    target.y,
    () => {
      opponentTurn();
    }
  );
}


function drawOpponentCard(){

  /*
    Geen kaart meer beschikbaar:
    tegenstander verliest.
  */

  if(deck.length === 0){

    endGame("player");
    return;
  }


  const card = deck.pop();

  card.zone = "opponent";
  opponentHand.push(card);


  /*
    26 kaarten = direct verlies.
  */

  if(
    opponentHand.length >
    MAX_HAND
  ){

    render();

    endGame("player");
    return;
  }


  const opponentSpacing = 48;

  const opponentWidth =
    CARD_W +
    Math.max(
      0,
      opponentHand.length - 1
    ) *
    opponentSpacing;

  const opponentStartX =
    -opponentWidth / 2;

  const targetX =
    opponentStartX +
    (
      opponentHand.length - 1
    ) *
    opponentSpacing;

  const targetY =
    OPPONENT_Y;


  animateDrawCard(
    targetX,
    targetY,
    () => {
      startPlayerTurn();
    }
  );
}

function findFiveKinGroups(){

  const groups = [];

  for(let tone = 1; tone <= 13; tone++){

    for(let color = 0; color < 4; color++){

      const matches =
        tableCards.filter(card =>
          card.tone === tone &&
          getCardColorIndex(card) === color
        );

      if(matches.length === 5){

        groups.push({
          cards: [...matches],
          valid: true,
          type: "same"
        });
      }
    }
  }

  return groups;
}


function drawPenaltyCard(
  target,
  onComplete
){

  /*
    Geen kaart meer beschikbaar:
    degene die de strafkaart moet pakken
    verliest.
  */

  if(deck.length === 0){

    if(target === "player"){
      endGame("opponent");
    } else {
      endGame("player");
    }

    return;
  }


  const card = deck.pop();


  /*
    ============================
    STRAFKAART VOOR SPELER
    ============================
  */

  if(target === "player"){

    card.zone = "hand";
    hand.push(card);


    if(hand.length > MAX_HAND){

      render();
      endGame("opponent");
      return;
    }


    const targetPos =
      getPlayerHandPosition(
        hand.length - 1
      );


    animateDrawCard(
      targetPos.x,
      targetPos.y,
      () => {

        render();

        if(onComplete){
          onComplete();
        }
      }
    );

    return;
  }


  /*
    ============================
    STRAFKAART VOOR TEGENSTANDER
    ============================
  */

  card.zone = "opponent";
  opponentHand.push(card);


  if(
    opponentHand.length >
    MAX_HAND
  ){

    render();
    endGame("player");
    return;
  }


  const opponentSpacing = 48;

  const opponentWidth =
    CARD_W +
    Math.max(
      0,
      opponentHand.length - 1
    ) *
    opponentSpacing;

  const opponentStartX =
    -opponentWidth / 2;

  const targetX =
    opponentStartX +
    (
      opponentHand.length - 1
    ) *
    opponentSpacing;


  animateDrawCard(
    targetX,
    OPPONENT_Y,
    () => {

      render();

      if(onComplete){
        onComplete();
      }
    }
  );
}



function resolveFiveKinGroups(
  playedBy,
  onComplete
){

  const groups =
    findFiveKinGroups();


  if(groups.length === 0){

    if(onComplete){
      onComplete();
    }

    return;
  }


  /*
    Alle 5-Kin-groepen tegelijk
    van tafel verwijderen.
  */

  const cardsToRemove =
    new Set();


  groups.forEach(group => {

    group.cards.forEach(card =>
      cardsToRemove.add(card)
    );

  });


  tableCards =
    tableCards.filter(card =>
      !cardsToRemove.has(card)
    );


  cardsToRemove.forEach(card => {

    card.zone = "removed";
    card.committed = true;

    delete card.col;
    delete card.row;

  });


  normalizeTableLayout();
  render();


  /*
    Voor iedere verdwenen groep
    één strafkaart.

    Speler legt hem:
      tegenstander trekt.

    Tegenstander legt hem:
      speler trekt.
  */

  const penaltyTarget =
    playedBy === "player"
      ? "opponent"
      : "player";


  let remaining =
    groups.length;


  function nextPenalty(){

    if(gameOver){
      return;
    }


    if(remaining <= 0){

      if(onComplete){
        onComplete();
      }

      return;
    }


    remaining--;


    drawPenaltyCard(
      penaltyTarget,
      nextPenalty
    );
  }


  nextPenalty();
}

function finishPlayerTurn(){

if(drawAnimating) return;

if(gameOver) return;

if(turnHasValidPlay){

  returnInvalidTurnCards();

  if(!playerOpened){
    playerOpened = true;
  }

turnCards.forEach(card => {

  card.committed = true;

  if(!card.owner){
    card.owner = "player";
  }

  if(!card.tableSide){
    card.tableSide = "player";
  }
});

normalizeTableLayout();

  turnCards = [];
  openingScore = 0;
  turnHasValidPlay = false;

if(hand.length === 0){

  endGame("player");
  return;
}


resolveFiveKinGroups(
  "player",
  () => {

    if(gameOver){
      return;
    }

    opponentTurn();
  }
);

return;

}

returnTurnCardsToHand();

if(hand.length >= MAX_HAND){
  endGame("opponent");
  return;
}
  // Geen geldige zet gespeeld:
  // speler moet een kaart trekken
restoreTableSnapshot();

if(hand.length >= MAX_HAND){
  endGame("opponent");
  return;
}

drawPlayerCard();

  turnCards = [];
  openingScore = 0;
  turnHasValidPlay = false;

}

function getHorizontalTableGroups(){

  const groups = [];

  /*
    Alleen horizontale blokken bekijken.

    Verticale aanraking tussen rij 0/1
    of rij 3/4 betekent NIET dat twee
    groepen bij elkaar horen.
  */
  for(let row = 0; row < GRID_ROWS; row++){

    let current = [];

    for(let col = 0; col < GRID_COLS; col++){

      const card =
        getCardAt(col, row);

      if(card){

        current.push(card);

      } else {

        if(current.length >= 3){

          const result =
            validateGroup(current);

          if(result.valid){

            groups.push({
              cards: [...current],
              row,
              startCol:
                current[0].col,
              type: result.type
            });
          }
        }

        current = [];
      }
    }


    if(current.length >= 3){

      const result =
        validateGroup(current);

      if(result.valid){

        groups.push({
          cards: [...current],
          row,
          startCol:
            current[0].col,
          type: result.type
        });
      }
    }
  }


  return groups;
}


function packGroupsIntoRows(groups, primaryRow, secondaryRow){

  if(groups.length === 0){
    return;
  }


  /*
    Eerst huidige visuele volgorde.

    Groepen die al op de primaire rij
    staan blijven vooraan.
  */
  groups.sort((a, b) => {

    const aPriority =
      a.row === primaryRow ? 0 :
      a.row === secondaryRow ? 1 : 2;

    const bPriority =
      b.row === primaryRow ? 0 :
      b.row === secondaryRow ? 1 : 2;


    if(aPriority !== bPriority){
      return aPriority - bPriority;
    }

    return a.startCol - b.startCol;
  });


  /*
    We zoeken een SPLITPUNT.

    Alles vóór split gaat op primaire rij.
    Alles erna op tweede rij.

    Daardoor wordt eerst de primaire rij
    zo ver mogelijk gevuld.
  */

  function requiredWidth(list){

    if(list.length === 0){
      return 0;
    }

    const cardCount =
      list.reduce(
        (sum, group) =>
          sum + group.cards.length,
        0
      );

    const gaps =
      (list.length - 1) *
      GROUP_GAP;

    return cardCount + gaps;
  }


  /*
    Kolom 0 blijft vrij voor uitbreiding
    aan de linkerkant.

    Beschikbaar:
    kolom 1 t/m GRID_COLS - 1.
  */
  const MAX_WIDTH =
    GRID_COLS - 2;


  let chosenPrimary = null;
  let chosenSecondary = null;


  /*
    Grootst mogelijke aantal groepen
    op de primaire rij proberen.
  */
  for(
    let split = groups.length;
    split >= 0;
    split--
  ){

    const first =
      groups.slice(0, split);

    const second =
      groups.slice(split);


    if(
      requiredWidth(first) <= MAX_WIDTH &&
      requiredWidth(second) <= MAX_WIDTH
    ){

      chosenPrimary = first;
      chosenSecondary = second;

      break;
    }
  }


  /*
    Als beide rijen samen werkelijk
    niet genoeg plaats hebben:
    NIETS half verplaatsen.
  */
  if(
    chosenPrimary === null ||
    chosenSecondary === null
  ){

    console.warn(
      "Table layout has insufficient space"
    );

    return;
  }


  /*
    Nu pas werkelijk verplaatsen.
  */
  function placeRow(list, row){

    let col = 1;


    list.forEach(group => {

      /*
        Binnen de groep blijft de
        bestaande kaartvolgorde behouden.
      */
      const cards =
        [...group.cards].sort(
          (a, b) =>
            a.col - b.col
        );


      cards.forEach(card => {

        card.row = row;
        card.col = col;

        col++;
      });


      /*
        Exact twee lege vakken
        tussen complete groepen.
      */
      col += GROUP_GAP;
    });
  }


placeRow(
  chosenPrimary,
  primaryRow
);

placeRow(
  chosenSecondary,
  secondaryRow
);
}


function normalizeTableLayout(){

  /*
    BELANGRIJK:

    Eerst ALLE groepen verzamelen voordat
    we ook maar één kaart verplaatsen.
  */
  const allGroups =
    getHorizontalTableGroups();


const opponentGroups =
  allGroups.filter(group =>
    group.row < MIDDLE_ROW
  );

const playerGroups =
  allGroups.filter(group =>
    group.row > MIDDLE_ROW
  );

const middleGroups =
  allGroups.filter(group =>
    group.row === MIDDLE_ROW
  );


  middleGroups.forEach(group => {

    const playerVotes =
      group.cards.filter(card =>
        card.tableSide === "player"
      ).length;

    const opponentVotes =
      group.cards.filter(card =>
        card.tableSide === "opponent"
      ).length;


    if(opponentVotes > playerVotes){

      opponentGroups.push(group);

    } else {

      playerGroups.push(group);
    }
  });

packGroupsIntoRows(
  opponentGroups,
  OPPONENT_ROWS[0],
  OPPONENT_ROWS[1]
);

packGroupsIntoRows(
  playerGroups,
  PLAYER_ROWS[0],
  PLAYER_ROWS[1]
);
}

function getHandInsertIndex(x, y){

  const PLAYER_SPACING_X = 54;

  const totalWidth =
    CARD_W +
    Math.max(0, hand.length - 1) *
    PLAYER_SPACING_X;

  const startX =
    -totalWidth / 2 - 54;

  const index =
    Math.round(
      (x - startX) /
      PLAYER_SPACING_X
    );

  return Math.max(
    0,
    Math.min(index, hand.length)
  );
}

function opponentTurn(){

  if(gameOver){
    return;
  }


  const wasOpened =
    opponentOpened;


  /*
    ====================================
    REEDS GEOPEND
    ====================================

    Vanaf nu mag hij de COMPLETE tafel
    onderzoeken, splitsen en herbouwen.
  */

  if(wasOpened){

    const solution =
      findBestOpponentRearrangement();


    if(solution){

      applyOpponentRearrangement(
        solution
      );

      render();


      if(opponentHand.length === 0){

        endGame("opponent");
        return;
      }


      resolveFiveKinGroups(
  "opponent",
  () => {

    if(gameOver){
      return;
    }

    startPlayerTurn();
  }
);

return;
    }
  }


  /*
    ====================================
    NOG NIET GEOPEND
    ====================================

    Dan mag hij uitsluitend combinaties
    uit zijn eigen hand gebruiken.
  */

  if(!wasOpened){

    const groups =
      chooseBestOpponentGroups();


    if(groups.length > 0){

      groups.forEach(group => {
        playOpponentGroup(group);
      });


      opponentOpened = true;

      normalizeTableLayout();

      render();


      if(opponentHand.length === 0){

  endGame("opponent");
  return;
}


resolveFiveKinGroups(
  "opponent",
  () => {

    if(gameOver){
      return;
    }

    startPlayerTurn();
  }
);

return;
    }
  }


  /*
    Geen enkele geldige mogelijkheid.
  */

  if(opponentHand.length >= MAX_HAND){

    endGame("player");
    return;
  }


  drawOpponentCard();
}


function startPlayerTurn(){

  turnCards = [];
  openingScore = 0;
  turnHasValidPlay = false;

  turnStartedAtMaxHand =
    hand.length >= MAX_HAND;

  saveTableSnapshot();

  updateTurnState();
  render();
}

turnButton.addEventListener("click", () => {
  finishPlayerTurn();
});

playAgainButton.addEventListener("click", () => {
  location.reload();
});

function drawCard(card){

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "card");
  g.setAttribute("transform", `translate(${card.x},${card.y})`);
  g.style.cursor = "grab";

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);
  rect.setAttribute("width", CARD_W);
  rect.setAttribute("height", CARD_H);
  rect.setAttribute("rx", 10);
  rect.setAttribute("fill", card.color);
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 2);
  g.appendChild(rect);

  const toneImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
  toneImg.setAttribute("href", "tones/" + card.toneFile);
  toneImg.setAttribute("x", 10);
  toneImg.setAttribute("y", 2);
  toneImg.setAttribute("width", 50);
  toneImg.setAttribute("height", 46);
  g.appendChild(toneImg);

  const animalImg = document.createElementNS("http://www.w3.org/2000/svg", "image");
  animalImg.setAttribute("href", "animals/" + card.animalFile);
  animalImg.setAttribute("x", 14);
  animalImg.setAttribute("y", 45);
  animalImg.setAttribute("width", 42);
  animalImg.setAttribute("height", 42);
  g.appendChild(animalImg);

g.addEventListener("mousedown", evt => {

  if(gameOver){
    return;
  }

  // Voor opening mogen bestaande tafelkaarten
  // nog niet gemanipuleerd worden.
  if(card.committed && !playerOpened){
    return;
  }

  const p = svgPoint(evt);

  dragging = {
    card,
    el: g,

    offsetX: p.x - card.x,
    offsetY: p.y - card.y,

    oldX: card.x,
    oldY: card.y,
    oldCol: card.col,
    oldRow: card.row,
    oldZone: card.zone,

    // Belangrijk voor de cheat-beveiliging
    oldCommitted: card.committed
  };

  g.style.cursor = "grabbing";

  // Gesleepte kaart bovenop tekenen
  gameSvg.appendChild(g);
});

  return g;
}

function drawCardBack(x, y){

  const g = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  g.setAttribute("class", "card");
  g.setAttribute("transform", `translate(${x},${y})`);

  const rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  rect.setAttribute("x", 0);
  rect.setAttribute("y", 0);
  rect.setAttribute("width", CARD_W);
  rect.setAttribute("height", CARD_H);
  rect.setAttribute("rx", 10);
  rect.setAttribute("fill", "#222");
  rect.setAttribute("stroke", "black");
  rect.setAttribute("stroke-width", 2);

  g.appendChild(rect);

  const img = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "image"
  );

  img.setAttribute("href", "cardback.png");
  img.setAttribute("x", 0);
  img.setAttribute("y", 0);
  img.setAttribute("width", CARD_W);
  img.setAttribute("height", CARD_H);
  img.setAttribute("preserveAspectRatio", "xMidYMid slice");

  g.appendChild(img);

  return g;
}

function drawBoardBorder(){

  const first =
    gridPosition(0, 0);

  const width =
    (GRID_COLS - 1) *
    GRID_GAP_X +
    CARD_W;

  const height =
    (VISIBLE_GRID_ROWS - 1) *
    GRID_GAP_Y +
    CARD_H;

  const rect =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

  rect.setAttribute(
    "class",
    "board-border"
  );

  rect.setAttribute(
    "x",
    GRID_X + boardOffsetX
  );

  rect.setAttribute(
    "y",
    GRID_Y
  );

  rect.setAttribute(
    "width",
    width
  );

  rect.setAttribute(
    "height",
    height
  );

  rect.setAttribute(
    "fill",
    "none"
  );

  rect.setAttribute(
    "stroke",
    "rgba(255,255,255,0.55)"
  );

  rect.setAttribute(
    "stroke-width",
    "2"
  );

  rect.setAttribute(
    "pointer-events",
    "none"
  );

  gameSvg.appendChild(rect);
}

function ensureBoardClip(){

  let defs =
    gameSvg.querySelector("defs");

  if(!defs){

    defs =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );

    gameSvg.insertBefore(
      defs,
      gameSvg.firstChild
    );
  }

  let clipPath =
    defs.querySelector(
      "#boardClip"
    );

  if(!clipPath){

    clipPath =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "clipPath"
      );

    clipPath.setAttribute(
      "id",
      "boardClip"
    );

    defs.appendChild(
      clipPath
    );
  }

  let rect =
    clipPath.querySelector("rect");

  if(!rect){

    rect =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );

    clipPath.appendChild(
      rect
    );
  }

  rect.setAttribute(
    "x",
    GRID_X + boardOffsetX
  );

  rect.setAttribute(
    "y",
    GRID_Y
  );

  rect.setAttribute(
    "width",
    (GRID_COLS - 1) *
      GRID_GAP_X +
      CARD_W
  );

  rect.setAttribute(
    "height",
    (VISIBLE_GRID_ROWS - 1) *
      GRID_GAP_Y +
      CARD_H
  );
}

function drawDeck(){

  const layers =
    Math.min(4, deck.length);

  for(let i = 0; i < layers; i++){

    gameSvg.appendChild(
      drawCardBack(
        DECK_X - i * 3,
        DECK_Y - i * 3
      )
    );
  }
}

function getPlayerHandPosition(index){

  const PLAYER_SPACING_X = 54;

  const totalWidth =
    CARD_W +
    Math.max(0, hand.length - 1) *
    PLAYER_SPACING_X;

  const startX =
    -totalWidth / 2 - 54;

  return {
    x:
      startX +
      index * PLAYER_SPACING_X,

    y: 350
  };
}

function isWholeTableValid(){

  const groups = findGroups();

  const cardsInValidGroups = new Set();

  groups.forEach(group => {

    if(!group.valid) return;

    group.cards.forEach(card => {
      cardsInValidGroups.add(card);
    });

  });

  return (
    tableCards.length > 0 &&
    tableCards.every(card =>
      cardsInValidGroups.has(card)
    )
  );
}

function saveTableSnapshot(){

  turnTableSnapshot =
    tableCards.map(card => ({
      card: card,
      col: card.col,
      row: card.row,
      zone: card.zone,
      committed: card.committed
    }));

}

function restoreTableSnapshot(){

  // Eerst alle nieuw gespeelde kaarten terug naar hand
  turnCards.forEach(card => {

    tableCards =
      tableCards.filter(c => c !== card);

    if(!hand.includes(card)){
      hand.push(card);
    }

    card.zone = "hand";
    card.committed = false;

    delete card.col;
    delete card.row;
  });

  // Daarna bestaande tafel herstellen
  turnTableSnapshot.forEach(saved => {

    const card = saved.card;

    card.col = saved.col;
    card.row = saved.row;
    card.zone = saved.zone;
    card.committed = saved.committed;

    if(!tableCards.includes(card)){
      tableCards.push(card);
    }

  });

  turnCards = [];
}

function getValidTurnCards(){

  const groups = findGroups();
  const validCards = new Set();

  groups.forEach(group => {

    if(!group.valid) return;

    group.cards.forEach(card => {

      if(turnCards.includes(card)){
        validCards.add(card);
      }

    });

  });

  return [...validCards];
}

function returnInvalidTurnCards(){

  const validCards =
    new Set(getValidTurnCards());

  const invalidCards =
    turnCards.filter(card =>
      !validCards.has(card)
    );

  invalidCards.forEach(card => {

    tableCards =
      tableCards.filter(c => c !== card);

    if(!hand.includes(card)){
      hand.push(card);
    }

    card.zone = "hand";
    card.committed = false;

    delete card.col;
    delete card.row;

  });

  turnCards =
    turnCards.filter(card =>
      validCards.has(card)
    );
}

function getTableComponents(){

  const remaining =
    new Set(tableCards);

  const components = [];

  while(remaining.size > 0){

    const first =
      remaining.values().next().value;

    const group = [];
    const queue = [first];

    remaining.delete(first);

    while(queue.length){

      const current =
        queue.shift();

      group.push(current);

      const neighbours =
        [...remaining].filter(card => {

          const dx =
            Math.abs(card.col - current.col);

          const dy =
            Math.abs(card.row - current.row);

          return dx + dy === 1;
        });

      neighbours.forEach(card => {
        remaining.delete(card);
        queue.push(card);
      });
    }

    components.push(group);
  }

  return components;
}



function preserveLeftExtensionSpace(card){

  if(!card || card.zone !== "table"){
    return;
  }

  const row = card.row;

  // Alleen interessant wanneer juist kolom 0 gevuld werd
  if(card.col !== 0){
    return;
  }

  // Verzamel het aangesloten blok vanaf links
  const group = [];

  for(let col = 0; col < GRID_COLS; col++){

    const current = getCardAt(col, row);

    if(!current){
      break;
    }

    group.push(current);
  }

  // Eerst controleren of dit daadwerkelijk
  // een geldige combinatie geworden is
  if(group.length < 3){
    return;
  }

  if(!validateGroup(group).valid){
    return;
  }

  // Is er rechts voldoende ruimte?
  const lastCol =
    Math.max(...group.map(c => c.col));

  if(lastCol + 1 >= GRID_COLS){
    return;
  }

  // Complete set één vak naar rechts
  // Achterstevoren om tijdelijke botsingen te voorkomen
  [...group]
    .sort((a, b) => b.col - a.col)
    .forEach(c => {
      c.col += 1;
    });
}


function animateDrawCard(
  targetX,
  targetY,
  onComplete
){

  drawAnimating = true;
  turnButton.disabled = true;

  const flyingCard =
    drawCardBack(
      DECK_X,
      DECK_Y
    );

  flyingCard.style.pointerEvents =
    "none";

  gameSvg.appendChild(
    flyingCard
  );

  const startX = DECK_X;
  const startY = DECK_Y;

  const startTime =
    performance.now();


  function animate(now){

    const progress =
      Math.min(
        1,
        (now - startTime) /
        DRAW_ANIMATION_TIME
      );

    /*
      zachte versnelling/vertraging
    */
    const eased =
      progress < 0.5
        ? 2 * progress * progress
        : 1 -
          Math.pow(
            -2 * progress + 2,
            2
          ) / 2;


    const x =
      startX +
      (targetX - startX) *
      eased;

    const y =
      startY +
      (targetY - startY) *
      eased;


    flyingCard.setAttribute(
      "transform",
      `translate(${x},${y})`
    );


    if(progress < 1){

      requestAnimationFrame(
        animate
      );

      return;
    }


    flyingCard.remove();

    drawAnimating = false;
    turnButton.disabled = false;

    if(onComplete){
      onComplete();
    }
  }


  requestAnimationFrame(
    animate
  );
}


gameSvg.addEventListener("mousemove", evt => {
  if(!dragging) return;

  const p = svgPoint(evt);

  dragging.card.x = p.x - dragging.offsetX;
  dragging.card.y = p.y - dragging.offsetY;

  dragging.el.setAttribute(
    "transform",
    `translate(${dragging.card.x},${dragging.card.y})`
  );
});

gameSvg.addEventListener("mouseup", () => {

  if(!dragging){
    return;
  }

  const card = dragging.card;

  const slot =
    nearestGridSlot(card.x, card.y);


  /*
    ========================================
    1. KAART WORDT NAAR DE HAND GESLEEPT
    ========================================
  */

const boardBottom =
  GRID_Y +
  (VISIBLE_GRID_ROWS - 1) *
    GRID_GAP_Y +
  CARD_H;

if(card.y > boardBottom){

    if(
      dragging.oldZone === "table" &&
      dragging.oldCommitted
    ){

      card.x = dragging.oldX;
      card.y = dragging.oldY;

      card.col = dragging.oldCol;
      card.row = dragging.oldRow;

      card.zone = "table";
      card.committed = true;

    } else {

      /*
        Gewone handkaart of kaart die deze
        beurt vanuit de hand op tafel kwam.

        Die mag terug naar de hand.
      */

      tableCards =
        tableCards.filter(c => c !== card);

      turnCards =
        turnCards.filter(c => c !== card);


      const oldIndex =
        hand.indexOf(card);

      if(oldIndex !== -1){
        hand.splice(oldIndex, 1);
      }


      const newIndex =
        getHandInsertIndex(
          card.x,
          card.y
        );

      hand.splice(
        newIndex,
        0,
        card
      );


      card.zone = "hand";
      card.committed = false;

      delete card.col;
      delete card.row;
    }
  }


  /*
    ========================================
    2. KAART WORDT OP EEN VRIJ TAFELVAK GEZET
    ========================================
  */

else if(
  slot &&
  !slotOccupied(
    slot.col,
    slot.row,
    card
  )
){

    /*
      Voor de eerste opening mag je niet
      rechtstreeks aan bestaande tafelsets
      bouwen.
    */

    if(
      !playerOpened &&
      dragging.oldZone === "hand" &&
      touchesCommittedCard(
        slot.col,
        slot.row
      )
    ){

      card.x = dragging.oldX;
      card.y = dragging.oldY;

      card.zone =
        dragging.oldZone;

      card.col =
        dragging.oldCol;

      card.row =
        dragging.oldRow;

    } else {

      /*
        Alleen wanneer de kaart werkelijk
        uit je hand afkomstig was, wordt hij
        een kaart van deze beurt.
      */

      if(
        dragging.oldZone === "hand"
      ){

        hand =
          hand.filter(c =>
            c !== card
          );


        if(
          !turnCards.includes(card)
        ){
          turnCards.push(card);
        }


        card.committed = false;
      }


      /*
        Bestaande tafelkaart blijft committed.
      */

      if(
        dragging.oldZone === "table" &&
        dragging.oldCommitted
      ){
        card.committed = true;
      }


      if(
        !tableCards.includes(card)
      ){
        tableCards.push(card);
      }


/*
  Nieuwe kaart uit hand:
  standaard hoort hij bij speler.

  Maar als hij direct aan een bestaande
  tafelgroep wordt gelegd, erft hij
  de tableSide van die groep.
*/
if(dragging.oldZone === "hand"){

  let inheritedSide = null;

  const neighbours = [
    getCardAt(slot.col - 1, slot.row),
    getCardAt(slot.col + 1, slot.row),
    getCardAt(slot.col, slot.row - 1),
    getCardAt(slot.col, slot.row + 1)
  ].filter(Boolean);

  const existingNeighbour =
    neighbours.find(c =>
      c.zone === "table"
    );

  if(existingNeighbour){

    inheritedSide =
      existingNeighbour.tableSide ||
      (
        existingNeighbour.row <= 1
          ? "opponent"
          : "player"
      );
  }

  card.tableSide =
    inheritedSide || "player";
}

      card.zone = "table";

      card.col = slot.col;
      card.row = slot.row;

      card.x = slot.x;
      card.y = slot.y;


      preserveLeftExtensionSpace(card);
      keepGroupSpacing(card.row);
    }
  }


  /*
    ========================================
    3. ONGELDIGE DROP
    ========================================
  */

  else {

    card.x = dragging.oldX;
    card.y = dragging.oldY;

    card.zone =
      dragging.oldZone;

    card.col =
      dragging.oldCol;

    card.row =
      dragging.oldRow;

    card.committed =
      dragging.oldCommitted;
  }


  dragging = null;

  updateTurnState();
  render();
});

function touchesCommittedCard(col, row){

  const neighbours = [
    [col - 1, row],
    [col + 1, row],
    [col, row - 1],
    [col, row + 1]
  ];

  return neighbours.some(([c, r]) => {

    const neighbour = getCardAt(c, r);

    return neighbour &&
           neighbour.committed;
  });
}

function placeGroupsOnRow(groups, row){

  let col = 1;

  groups.forEach(group => {

    const cards =
      [...group.cards].sort(
        (a, b) => a.col - b.col
      );

    cards.forEach(card => {
      card.row = row;
      card.col = col;
      col++;
    });

    col += GROUP_GAP;
  });
}

function nearestGridSlot(x, y){

  const col =
    Math.round(
      (
        x -
        GRID_X -
        boardOffsetX
      ) /
      GRID_GAP_X
    );

  const row =
    Math.round(
      (
        y -
        GRID_Y -
        boardOffsetY
      ) /
      GRID_GAP_Y
    );

  if(
    col < 0 ||
    col >= GRID_COLS ||
    row < 0 ||
    row >= GRID_ROWS
  ){
    return null;
  }

  return {
    col,
    row,
    ...gridPosition(
      col,
      row
    )
  };
}

function render(){

  gameSvg
    .querySelectorAll(".card")
    .forEach(el => el.remove());

  gameSvg
    .querySelectorAll(".board-border")
    .forEach(el => el.remove());

const oldTableLayer =
  gameSvg.querySelector(
    "#tableLayer"
  );

if(oldTableLayer){
  oldTableLayer.remove();
}

  drawBoardBorder();

const opponentSpacing = 48;

const opponentWidth =
  CARD_W + Math.max(0, opponentHand.length - 1) * opponentSpacing;

const opponentStartX =
  -opponentWidth / 2;

opponentHand.forEach((card, i) => {

  const x =
    opponentStartX + i * opponentSpacing;

  const y = OPPONENT_Y;

  gameSvg.appendChild(
    drawCardBack(x, y)
  );
});

  // Deck
  drawDeck();

  // Eigen hand
const PLAYER_COLS = 13;
const PLAYER_SPACING_X = 80;
const PLAYER_SPACING_Y = 105;

hand.forEach((card, i) => {

  const pos =
    getPlayerHandPosition(i);

  card.x = pos.x;
  card.y = pos.y;
  card.zone = "hand";

  gameSvg.appendChild(
    drawCard(card)
  );
});

// Tafel
ensureBoardClip();

let tableLayer =
  gameSvg.querySelector(
    "#tableLayer"
  );

if(tableLayer){
  tableLayer.remove();
}

tableLayer =
  document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

tableLayer.setAttribute(
  "id",
  "tableLayer"
);

tableLayer.setAttribute(
  "clip-path",
  "url(#boardClip)"
);

tableCards.forEach(card => {

  const pos =
    gridPosition(
      card.col,
      card.row
    );

  card.x = pos.x;
  card.y = pos.y;
  card.zone = "table";

  tableLayer.appendChild(
    drawCard(card)
  );
});

gameSvg.appendChild(
  tableLayer
);

  const groups = findGroups();

  const validGroups =
    groups.filter(g => g.valid).length;

  const invalidGroups =
    groups.filter(g => !g.valid).length;

const turnGroups = getTurnGroups();
const validTurnGroups = turnGroups.filter(g => g.valid);

}

updateTurnState();
boardOffsetX -= 400;
render();