// ===== STEP =====
function step(){

  if(animating) return;

  const ROOT_OFFSET = Number(
    daysFromCivil(-17264374702, 11, 14) -
    daysFromCivil(1982, 8, 22)
  );

  // bewaar oude toestand
  let prevPos = pos;
  let prevTone = tone;

  dayOffset++;

  kin = ((dayOffset % 260) + 260) % 260;

  updateFromKin();

const rootStage =
  dayOffset - ROOT_OFFSET + 5;

const rootUnfolding =
  rootStage >= 1 &&
  rootStage <= 5;

  // vóór 10/11: absoluut geen animatie
  if(dayOffset < ROOT_OFFSET - 4){

    updateDateFromKin();
    render();
    return;
  }

  animating = true;

if(rootStage <= 1){

  // Tot en met 10/11: niets animeren.
  updateDateFromKin();
  animating = false;
  render();
  return;

} else if(rootUnfolding){

  const enteringFirstDot =
    rootStage === 2; // 10/11 → 11/11

  if(enteringFirstDot){
    dotVisible = false;
    render();
  }

  animateMove(pts[prevPos], pts[pos], 300, () => {

    if(enteringFirstDot){
      dotVisible = true;
    }

    updateDateFromKin();
    animating = false;
    render();
  });

} else if(prevTone === 13){

  let startRot = rot - 72;
  let endRot = rot;

  animateRotate(startRot, endRot, 400, () => {

    updateDateFromKin();
    animating = false;
    render();

  });



} else {

  animateMove(pts[prevPos], pts[pos], 300, () => {
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
