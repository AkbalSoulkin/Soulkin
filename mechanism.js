
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