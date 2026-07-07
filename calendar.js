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