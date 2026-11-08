 // ===== AUTOMATISCHE ZONSONDERGANG =====
 // NOAA-benadering, zonder externe bibliotheken.
 // Alleen bedoeld voor experimentele G-vergelijkingen.

function soulkinSunset(year, month, day, latitude, longitude, utcOffset) {
  const rad = Math.PI / 180;
  const deg = 180 / Math.PI;

  const norm = (x, max) => ((x % max) + max) % max;

  // Dagnummer van het jaar (proleptische Gregoriaanse kalender)
  const start = Date.UTC(year, 0, 1);
  const date = Date.UTC(year, month - 1, day);
  const N = Math.floor((date - start) / 86400000) + 1;

  const lngHour = longitude / 15;
  const t = N + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;

  const L = norm(
    M +
    1.916 * Math.sin(M * rad) +
    0.020 * Math.sin(2 * M * rad) +
    282.634,
    360
  );

  let RA = norm(
    Math.atan(0.91764 * Math.tan(L * rad)) * deg,
    360
  );

  RA += Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90;
  RA /= 15;

  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));

  const cosH = (
    Math.cos(90.833 * rad) -
    sinDec * Math.sin(latitude * rad)
  ) / (cosDec * Math.cos(latitude * rad));

  if (cosH < -1 || cosH > 1) {
    return null; // Geen gewone zonsondergang op deze datum
  }

  const H = Math.acos(cosH) * deg / 15;

  const T = H + RA - 0.06571 * t - 6.622;
  const utcHour = norm(T - lngHour, 24);
  const localHour = norm(utcHour + utcOffset, 24);

  const totalMinutes = Math.round(localHour * 60) % 1440;

  return (
    String(Math.floor(totalMinutes / 60)).padStart(2, "0") +
    ":" +
    String(totalMinutes % 60).padStart(2, "0")
  );
}

window.soulkinSunset = soulkinSunset;

window.compareSoulkinBirth = function({
  calendarG,
  year,
  month,
  day,
  latitude,
  longitude,
  utcOffset,
  birthTime
}) {
  const sunsetTime = soulkinSunset(
    year, month, day,
    latitude, longitude, utcOffset
  );

  if (sunsetTime === null) {
    return {
      calendarG,
      sunsetG: null,
      sunsetTime: null,
      reason: "Geen gewone zonsondergang"
    };
  }

  return {
    ...compareSoulkinNightlord(
      calendarG, birthTime, sunsetTime
    ),
    sunsetTime
  };
};


 // ===== NIGHTLORD: VIER DAGGRENSMODELLEN =====
 // Experimenteel: verandert de bestaande Soulkin-G niet.

 function soulkinSolarEvent(
   year, month, day, latitude, longitude, utcOffset, event
 ) {
   const rad = Math.PI / 180;
   const deg = 180 / Math.PI;
   const norm = (x, max) => ((x % max) + max) % max;

   if (!["sunrise", "sunset"].includes(event)) {
     throw new Error("Gebruik sunrise of sunset.");
   }

   const start = new Date(0);
   start.setUTCFullYear(year, 0, 1);
   start.setUTCHours(0, 0, 0, 0);

   const date = new Date(0);
   date.setUTCFullYear(year, month - 1, day);
   date.setUTCHours(0, 0, 0, 0);

   const N = Math.floor(
     (date.getTime() - start.getTime()) / 86400000
   ) + 1;

   const lngHour = longitude / 15;
   const t = N + (
     (event === "sunrise" ? 6 : 18) - lngHour
   ) / 24;

   const M = 0.9856 * t - 3.289;
   const L = norm(
     M + 1.916 * Math.sin(M * rad)
       + 0.020 * Math.sin(2 * M * rad)
       + 282.634,
     360
   );

   let RA = norm(
     Math.atan(0.91764 * Math.tan(L * rad)) * deg,
     360
   );

   RA += Math.floor(L / 90) * 90
       - Math.floor(RA / 90) * 90;

   RA /= 15;

   const sinDec = 0.39782 * Math.sin(L * rad);
   const cosDec = Math.cos(Math.asin(sinDec));

   const cosH = (
     Math.cos(90.833 * rad)
       - sinDec * Math.sin(latitude * rad)
   ) / (cosDec * Math.cos(latitude * rad));

   if (cosH < -1 || cosH > 1) return null;

   const H = (
     event === "sunrise"
       ? 360 - Math.acos(cosH) * deg
       : Math.acos(cosH) * deg
   ) / 15;

   const T = H + RA - 0.06571 * t - 6.622;
   const utcHour = norm(T - lngHour, 24);
   const localHour = norm(utcHour + utcOffset, 24);

   const minutes = Math.round(localHour * 60) % 1440;

   return (
     String(Math.floor(minutes / 60)).padStart(2, "0")
     + ":"
     + String(minutes % 60).padStart(2, "0")
   );
 }

 window.compareSoulkinFourModels = function({
   calendarG, year, month, day,
   latitude, longitude, utcOffset, birthTime
 }) {
   if (!Number.isInteger(calendarG) ||
       calendarG < 1 || calendarG > 9) {
     throw new Error("Gebruik calendarG van 1 t/m 9.");
   }

   const sunrise = soulkinSolarEvent(
     year, month, day, latitude, longitude,
     utcOffset, "sunrise"
   );

   const sunset = soulkinSolarEvent(
     year, month, day, latitude, longitude,
     utcOffset, "sunset"
   );

   const birth = soulkinTimeMinutes(birthTime);
   const sunriseMin = sunrise === null
     ? null : soulkinTimeMinutes(sunrise);
   const sunsetMin = sunset === null
     ? null : soulkinTimeMinutes(sunset);

   const previousG = (calendarG + 7) % 9 + 1;
   const nextG = calendarG % 9 + 1;

   return {
     birthTime,
     sunrise,
     sunset,
     M0_midnight: calendarG,
     M1_sunsetForward: sunsetMin === null
       ? null
       : birth >= sunsetMin ? nextG : calendarG,
     M2_sunsetBackward: sunsetMin === null
       ? null
       : birth < sunsetMin ? previousG : calendarG,
     M3_sunrise: sunriseMin === null
       ? null
       : birth < sunriseMin ? previousG : calendarG
   };
 };


 // ===== M4: WERELDWIJDE NIGHTLORD-CYCLUS =====
 // Experimenteel. Verandert Soulkin's night niet.
 //
 // anchor: bekende kalenderdatum met bijbehorende G.
 // switchHourUTC: wereldwijd omschakeluur (0–24).
 // Alle datums worden als proleptisch Gregoriaans behandeld.

 function soulkinUTCDate(year, month, day, hour = 0, minute = 0) {
   const d = new Date(0);
   d.setUTCFullYear(year, month - 1, day);
   d.setUTCHours(hour, minute, 0, 0);
   return d;
 }

 function soulkinGlobalG(utcDate, {
   anchorYear,
   anchorMonth,
   anchorDay,
   anchorG,
   switchHourUTC = 0
 }) {
   if (!Number.isInteger(anchorG) ||
       anchorG < 1 || anchorG > 9) {
     throw new Error("anchorG moet G1 t/m G9 zijn.");
   }

   if (!Number.isFinite(switchHourUTC) ||
       switchHourUTC < 0 || switchHourUTC >= 24) {
     throw new Error("switchHourUTC moet tussen 0 en 24 liggen.");
   }

   const anchor = soulkinUTCDate(
     anchorYear, anchorMonth, anchorDay
   ).getTime() + switchHourUTC * 3600000;

   const elapsedDays = Math.floor(
     (utcDate.getTime() - anchor) / 86400000
   );

   return ((anchorG - 1 + elapsedDays) % 9 + 9) % 9 + 1;
 }

 window.compareSoulkinGlobal = function({
   year, month, day, birthTime,
   utcOffset, anchorYear, anchorMonth,
   anchorDay, anchorG, switchHourUTC = 0
 }) {
   const [hour, minute] = birthTime.split(":").map(Number);
   soulkinTimeMinutes(birthTime);

   const utcDate = soulkinUTCDate(
     year, month, day, hour, minute
   );

   utcDate.setTime(
     utcDate.getTime() - utcOffset * 3600000
   );

   return {
     utcMoment: utcDate.toISOString(),
     M4_global: soulkinGlobalG(utcDate, {
       anchorYear, anchorMonth, anchorDay,
       anchorG, switchHourUTC
     })
   };
 };

 window.soulkinGlobalG = soulkinGlobalG;


 // ===== WERELDWIJDE M0–M4 VERGELIJKING =====
 // Gebruikt het echte Soulkin-anker:
 // 22 augustus 1982 = G9.
 // Verandert geen bestaande kalenderwaarden.

 function soulkinCalendarG(year, month, day) {
   const offset = Number(
     daysFromCivil(year, month, day) -
     daysFromCivil(1982, 8, 22)
   );

   return ((offset + 8) % 9 + 9) % 9 + 1;
 }

 window.compareSoulkinWorld = function({
   utcMoment,
   locations,
   switchHourUTC = 0
 }) {
   const instant = new Date(utcMoment);

   if (!Number.isFinite(instant.getTime())) {
     throw new Error("Ongeldig UTC-moment.");
   }

   const anchor = {
     anchorYear: 1982,
     anchorMonth: 8,
     anchorDay: 22,
     anchorG: 9,
     switchHourUTC
   };

   const globalG = soulkinGlobalG(instant, anchor);

   const results = locations.map(location => {
     const offset = location.utcOffset;

     const local = new Date(
       instant.getTime() + offset * 3600000
     );

     const year = local.getUTCFullYear();
     const month = local.getUTCMonth() + 1;
     const day = local.getUTCDate();

     const birthTime =
       String(local.getUTCHours()).padStart(2, "0") +
       ":" +
       String(local.getUTCMinutes()).padStart(2, "0");

     const calendarG = soulkinCalendarG(
       year, month, day
     );

     const models = compareSoulkinFourModels({
       calendarG,
       year, month, day,
       latitude: location.latitude,
       longitude: location.longitude,
       utcOffset: offset,
       birthTime
     });

     return {
       plaats: location.name,
       lokaleDatum: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
       lokaleTijd: birthTime,
       zonsopkomst: models.sunrise,
       zonsondergang: models.sunset,
       M0: models.M0_midnight,
       M1: models.M1_sunsetForward,
       M2: models.M2_sunsetBackward,
       M3: models.M3_sunrise,
       M4: globalG
     };
   });

   console.table(results);
   return results;
 };



 // ===== M4: MAYA-REFERENTIEPUNT TEST =====
 // Onderzoekt de astronomische overgangstijd.
 // Verandert de bestaande Soulkin-kalender niet.

 const SOULKIN_MAYA_REFERENCE = {
   name: "Tikal",
   latitude: 17.222,
   longitude: -89.623,
   utcOffset: -6
 };

 function soulkinHHMM(minutes) {
   const m = ((Math.round(minutes) % 1440) + 1440) % 1440;

   return (
     String(Math.floor(m / 60)).padStart(2, "0") +
     ":" +
     String(m % 60).padStart(2, "0")
   );
 }

 function soulkinCircularDistance(a, b) {
   const difference = Math.abs(a - b) % 1440;
   return Math.min(difference, 1440 - difference);
 }

 window.testSoulkinMayaBoundary = function(
   year = 2026,
   reference = SOULKIN_MAYA_REFERENCE
 ) {
   const dates = [
     [3, 20, "Maart-equinox"],
     [6, 21, "Junizonnewende"],
     [9, 22, "September-equinox"],
     [12, 21, "Decemberzonnewende"]
   ];

   const events = dates.map(([month, day, label]) => {
     const sunset = soulkinSolarEvent(
       year, month, day,
       reference.latitude,
       reference.longitude,
       reference.utcOffset,
       "sunset"
     );

     const sunrise = soulkinSolarEvent(
       year, month, day,
       reference.latitude,
       reference.longitude,
       reference.utcOffset,
       "sunrise"
     );

     const sunsetUTC = sunset === null ? null :
       (
         soulkinTimeMinutes(sunset) -
         reference.utcOffset * 60 + 1440
       ) % 1440;

     return {
       datum: `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
       seizoen: label,
       sunriseLocal: sunrise,
       sunsetLocal: sunset,
       sunsetUTCMinutes: sunsetUTC,
       sunsetUTC: sunsetUTC === null
         ? null : soulkinHHMM(sunsetUTC)
     };
   });

   console.table(events.map(e => ({
     datum: e.datum,
     seizoen: e.seizoen,
     zonsopkomst: e.sunriseLocal,
     zonsondergang: e.sunsetLocal,
     omschakelingUTC: e.sunsetUTC
   })));

   // Alle 24 mogelijke vaste UTC-uren vergelijken.
   const hours = Array.from({ length: 24 }, (_, hour) => {
     const distances = events
       .filter(e => e.sunsetUTCMinutes !== null)
       .map(e => soulkinCircularDistance(
         hour * 60,
         e.sunsetUTCMinutes
       ));

     return {
       UTC_uur: soulkinHHMM(hour * 60),
       gemiddeldeAfwijkingMin:
         distances.length
           ? Math.round(
               distances.reduce((a, b) => a + b, 0) /
               distances.length
             )
           : null,
       grootsteAfwijkingMin:
         distances.length ? Math.max(...distances) : null
     };
   });

   hours.sort((a, b) =>
     a.gemiddeldeAfwijkingMin -
     b.gemiddeldeAfwijkingMin
   );

   console.table(hours);

   return {
     reference,
     events,
     ranking: hours,
     bestFixedHour: hours[0]
   };
 };


 // ===== M4c: WERELDWIJDE OVERGANG BIJ TIKAL-ZONSONDERGANG =====
 // Geen wijziging aan Soulkin's bestaande night.
 // Conventie: zonsondergang op datum D start G van D+1.

 function soulkinTikalSunsetUTC(year, month, day) {
   const ref = SOULKIN_MAYA_REFERENCE;

   const sunset = soulkinSolarEvent(
     year, month, day,
     ref.latitude, ref.longitude,
     ref.utcOffset, "sunset"
   );

   if (sunset === null) return null;

   const [hour, minute] = sunset.split(":").map(Number);

   const utc = soulkinUTCDate(
     year, month, day, hour, minute
   );

   utc.setTime(
     utc.getTime() - ref.utcOffset * 3600000
   );

   return utc;
 }

 function soulkinNextCalendarG(year, month, day) {
   const nextDate = soulkinUTCDate(year, month, day + 1);

   return soulkinCalendarG(
     nextDate.getUTCFullYear(),
     nextDate.getUTCMonth() + 1,
     nextDate.getUTCDate()
   );
 }

 window.soulkinM4c = function(utcMoment) {
   const instant = new Date(utcMoment);

   if (!Number.isFinite(instant.getTime())) {
     throw new Error("Ongeldig UTC-moment.");
   }

   // Zoek de meest recente zonsondergang in Tikal.
   // Gebruik UTC-datums rondom het testmoment.
   let latest = null;

   for (let offset = -3; offset <= 2; offset++) {
     const d = new Date(instant.getTime());
     d.setUTCHours(12, 0, 0, 0);
     d.setUTCDate(d.getUTCDate() + offset);

     const year = d.getUTCFullYear();
     const month = d.getUTCMonth() + 1;
     const day = d.getUTCDate();

     const sunsetUTC = soulkinTikalSunsetUTC(
       year, month, day
     );

     if (
       sunsetUTC !== null &&
       sunsetUTC <= instant &&
       (latest === null || sunsetUTC > latest.sunsetUTC)
     ) {
       latest = {
         sunsetUTC,
         localDate: `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`,
         G: soulkinNextCalendarG(year, month, day)
       };
     }
   }

   if (latest === null) {
     throw new Error("Geen eerdere zonsondergang gevonden.");
   }

   return {
     utcMoment: instant.toISOString(),
     lastTikalSunset: latest.sunsetUTC.toISOString(),
     tikalDate: latest.localDate,
     M4c: latest.G
   };
 };

 window.compareSoulkinM4 = function(utcMoment) {
   const instant = new Date(utcMoment);

   const M4a = soulkinGlobalG(instant, {
     anchorYear: 1982,
     anchorMonth: 8,
     anchorDay: 22,
     anchorG: 9,
     switchHourUTC: 0
   });

   const M4c = soulkinM4c(utcMoment);

   return {
     utcMoment: instant.toISOString(),
     M4a,
     M4c: M4c.M4c,
     same: M4a === M4c.M4c,
     lastTikalSunset: M4c.lastTikalSunset
   };
 };


 // ===== JAARTEST M4a VERSUS M4c =====
 // Elke lokale Tikal-datum D:
 // M4a schakelt naar G(D+1) om 00:00 UTC op D+1.
 // M4c schakelt naar G(D+1) bij zonsondergang op D.

 window.testSoulkinM4Year = function(year = 2026) {
   const rows = [];
   const start = soulkinUTCDate(year, 1, 1);
   const end = soulkinUTCDate(year + 1, 1, 1);

   for (
     let ms = start.getTime();
     ms < end.getTime();
     ms += 86400000
   ) {
     const d = new Date(ms);
     const y = d.getUTCFullYear();
     const m = d.getUTCMonth() + 1;
     const day = d.getUTCDate();

     const sunset = soulkinTikalSunsetUTC(y, m, day);
     if (!sunset) continue;

     const midnight = soulkinUTCDate(y, m, day + 1);

     // Positief: M4c schakelt later dan M4a.
     // Negatief: M4c schakelt eerder.
     const differenceMinutes =
       (sunset.getTime() - midnight.getTime()) / 60000;

     rows.push({
       date: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
       month: m,
       sunsetUTC: sunset.toISOString(),
       differenceMinutes,
       mismatchMinutes: Math.abs(differenceMinutes)
     });
   }

   const total = rows.reduce(
     (sum, r) => sum + r.mismatchMinutes, 0
   );

   const months = Array.from({ length: 12 }, (_, i) => {
     const subset = rows.filter(r => r.month === i + 1);

     return {
       month: i + 1,
       days: subset.length,
       averageMismatchMinutes: subset.length
         ? Math.round(
             subset.reduce((s, r) => s + r.mismatchMinutes, 0)
             / subset.length * 10
           ) / 10
         : null,
       totalMismatchHours: Math.round(
         subset.reduce((s, r) => s + r.mismatchMinutes, 0)
         / 60 * 10
       ) / 10
     };
   });

   const result = {
     year,
     days: rows.length,
     totalMismatchHours: Math.round(total / 60 * 100) / 100,
     percentageOfYear: Math.round(
       total / (rows.length * 1440) * 10000
     ) / 100,
     averageMismatchMinutes: Math.round(
       total / rows.length * 100
     ) / 100,
     maximumMismatchMinutes: Math.max(
       ...rows.map(r => r.mismatchMinutes)
     ),
     M4cLaterDays: rows.filter(
       r => r.differenceMinutes > 0
     ).length,
     M4cEarlierDays: rows.filter(
       r => r.differenceMinutes < 0
     ).length
   };

   console.table([result]);
   console.table(months);

   return { summary: result, months, days: rows };
 };


 // ===== LENGTEGRAADTEST NIGHTLORD =====
 // Zoek de lengtegraad waar zonsondergang het
 // dichtst bij 00:00 UTC ligt.
 // Breedtegraad blijft gelijk aan Tikal.
 // Resolutie: 0,25 graad.

 window.testSoulkinLongitude = function(
   year = 2026,
   latitude = 17.222,
   minLongitude = -110,
   maxLongitude = -70,
   step = 0.25
 ) {
   const dates = [];

   for (
     let d = soulkinUTCDate(year, 1, 1);
     d < soulkinUTCDate(year + 1, 1, 1);
     d = new Date(d.getTime() + 86400000)
   ) {
     dates.push([
       d.getUTCFullYear(),
       d.getUTCMonth() + 1,
       d.getUTCDate()
     ]);
   }

   const results = [];

   for (
     let lon = minLongitude;
     lon <= maxLongitude + 0.00001;
     lon += step
   ) {
     let total = 0;
     let maximum = 0;
     let valid = 0;

     for (const [y, m, day] of dates) {
       // UTC−6 is alleen de rekenklok.
       // Geen claim over historische tijdzones.
       const sunset = soulkinSolarEvent(
         y, m, day, latitude, lon, -6, "sunset"
       );

       if (sunset === null) continue;

       const utcMinutes = (
         soulkinTimeMinutes(sunset) + 360
       ) % 1440;

       const deviation = Math.min(
         utcMinutes,
         1440 - utcMinutes
       );

       total += deviation;
       maximum = Math.max(maximum, deviation);
       valid++;
     }

     results.push({
       longitude: Number(lon.toFixed(2)),
       averageMinutes: valid
         ? Number((total / valid).toFixed(2))
         : null,
       maximumMinutes: maximum,
       mismatchPercent: valid
         ? Number(
             (total / (valid * 1440) * 100).toFixed(3)
           )
         : null
     });
   }

   results.sort(
     (a, b) => a.averageMinutes - b.averageMinutes
   );

   const tikal = results.reduce((best, row) =>
     Math.abs(row.longitude + 89.623) <
     Math.abs(best.longitude + 89.623)
       ? row : best
   );

   console.log("Beste lengtegraad:", results[0]);
   console.log("Dichtst bij Tikal:", tikal);
   console.table(results.slice(0, 15));

   return {
     best: results[0],
     tikal,
     ranking: results
   };
 };


 // ===== NIGHTLORD: 2D GEOGRAFISCHE TEST =====
 // Breedtegraad 14–22 N, lengtegraad 94–86 W.
 // Alle dagen van het jaar, raster van 0,5 graad.
 // Verandert de bestaande Soulkin-berekening niet.

 window.testSoulkinGeography = function(
   year = 2026,
   step = 0.5
 ) {
   const results = [];

   const dates = [];
   const start = soulkinUTCDate(year, 1, 1);
   const end = soulkinUTCDate(year + 1, 1, 1);

   for (
     let ms = start.getTime();
     ms < end.getTime();
     ms += 86400000
   ) {
     const d = new Date(ms);
     dates.push([
       d.getUTCFullYear(),
       d.getUTCMonth() + 1,
       d.getUTCDate()
     ]);
   }

   for (let lat = 14; lat <= 22.00001; lat += step) {
     for (let lon = -94; lon <= -85.99999; lon += step) {

       const deviations = [];
       const signed = [];

       for (const [y, m, day] of dates) {
         const sunset = soulkinSolarEvent(
           y, m, day, lat, lon, -6, "sunset"
         );

         if (sunset === null) continue;

         const utcMinutes =
           (soulkinTimeMinutes(sunset) + 360) % 1440;

         // Verschil ten opzichte van 00:00 UTC,
         // met correcte overgang rond middernacht.
         const signedMinutes =
           ((utcMinutes + 720) % 1440) - 720;

         signed.push(signedMinutes);
         deviations.push(Math.abs(signedMinutes));
       }

       if (!deviations.length) continue;

       const mean = deviations.reduce(
         (a, b) => a + b, 0
       ) / deviations.length;

       const maximum = Math.max(...deviations);
       const minimum = Math.min(...signed);
       const latest = Math.max(...signed);

       // Spreiding tussen vroegste en laatste
       // zonsondergang ten opzichte van UTC-middernacht.
       const seasonalRange = latest - minimum;

       results.push({
         latitude: Number(lat.toFixed(2)),
         longitude: Number(lon.toFixed(2)),
         averageMinutes: Number(mean.toFixed(2)),
         maximumMinutes: maximum,
         seasonalRangeMinutes: seasonalRange,
         mismatchPercent: Number(
           (mean / 1440 * 100).toFixed(3)
         )
       });
     }
   }

   const byAverage = [...results].sort(
     (a, b) => a.averageMinutes - b.averageMinutes
   );

   const byMaximum = [...results].sort(
     (a, b) => a.maximumMinutes - b.maximumMinutes
   );

   const bySeason = [...results].sort(
     (a, b) =>
       a.seasonalRangeMinutes - b.seasonalRangeMinutes
   );

   const tikal = results.reduce((best, row) => {
     const distance =
       (row.latitude - 17.222) ** 2 +
       (row.longitude + 89.623) ** 2;

     const bestDistance =
       (best.latitude - 17.222) ** 2 +
       (best.longitude + 89.623) ** 2;

     return distance < bestDistance ? row : best;
   });

   console.log("Aantal onderzochte locaties:", results.length);

   console.table([
     { criterium: "Beste gemiddelde", ...byAverage[0] },
     { criterium: "Kleinste maximum", ...byMaximum[0] },
     { criterium: "Kleinste seizoensvariatie", ...bySeason[0] },
     { criterium: "Dichtst bij Tikal", ...tikal }
   ]);

   console.log("Top 10 gemiddelde afwijking:");
   console.table(byAverage.slice(0, 10));

   console.log("Top 10 kleinste maximum:");
   console.table(byMaximum.slice(0, 10));

   return {
     year,
     locations: results.length,
     bestAverage: byAverage[0],
     bestMaximum: byMaximum[0],
     bestSeasonal: bySeason[0],
     tikal,
     ranking: byAverage,
     all: results
   };
 };


window.testSoulkinAjnaGeometry = function() {
  const codes = [
    "000","001","010","011",
    "100","101","110","111"
  ];

  const observed = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const complement = s =>
    [...s].map(b => b === "0" ? "1" : "0").join("");

  const distance = (a,b) =>
    [...a].filter((bit,i) => bit !== b[i]).length;

  function permutations(arr) {
    if (!arr.length) return [[]];

    return arr.flatMap((item,i) =>
      permutations(arr.filter((_,j) => j !== i))
        .map(rest => [item,...rest])
    );
  }

  const all = permutations(
    codes.filter(c => c !== "001")
  ).map(rest => ["001",...rest]);

  const complementary = all.filter(seq =>
    seq.every((code,i) =>
      seq[(i+4)%8] === complement(code)
    )
  );

  const matchingPattern = complementary.filter(seq => {
    const distances = seq.map((code,i) =>
      distance(code,seq[(i+1)%8])
    );

    const doubles = distances
      .map((d,i) => d === 2 ? i : -1)
      .filter(i => i >= 0);

    return (
      distances.filter(d => d === 1).length === 6 &&
      doubles.length === 2 &&
      (doubles[1] - doubles[0]) === 4
    );
  });

  const observedDistances = observed.map((code,i) =>
    distance(code,observed[(i+1)%8])
  );

  const summary = {
    totalSequences: all.length,
    complementarySequences: complementary.length,
    matchingSequences: matchingPattern.length,
    observedMatches: matchingPattern.some(seq =>
      seq.join(",") === observed.join(",")
    )
  };

  console.table([summary]);
  console.log("Soulkin-afstanden:", observedDistances);
  console.table(
    matchingPattern.slice(0,12).map((seq,i) => ({
      number: i+1,
      sequence: seq.join(" → ")
    }))
  );

  return {
    summary,
    observed,
    observedDistances,
    matchingPattern
  };
};


window.testSoulkinCubeRotations = function() {
  const observed = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const solutions =
    testSoulkinAjnaGeometry().matchingPattern;

  const permutations = [
    [0,1,2],[0,2,1],
    [1,0,2],[1,2,0],
    [2,0,1],[2,1,0]
  ];

  function parity(p) {
    let inversions = 0;
    for (let i=0;i<3;i++)
      for (let j=i+1;j<3;j++)
        if (p[i]>p[j]) inversions++;
    return inversions%2===0 ? 1 : -1;
  }

  const rotations = [];

  for (const p of permutations) {
    for (let mask=0;mask<8;mask++) {
      const flips = [0,1,2].map(i =>
        (mask >> i) & 1
      );

      const sign =
        flips.reduce((s,f) => s*(f ? -1 : 1),1);

      if (parity(p)*sign !== 1) continue;

      const transform = code =>
        p.map((index,i) =>
          String(Number(code[index]) ^ flips[i])
        ).join("");

      const rotated = observed.map(transform);

      const start = rotated.indexOf("001");

      const normalized = [
        ...rotated.slice(start),
        ...rotated.slice(0,start)
      ];

      rotations.push(normalized);
    }
  }

  const unique = [
    ...new Map(
      rotations.map(seq => [seq.join(","),seq])
    ).values()
  ];

  const solutionKeys = new Set(
    solutions.map(seq => seq.join(","))
  );

  const rotationKeys = new Set(
    unique.map(seq => seq.join(","))
  );

  const matched = unique.filter(seq =>
    solutionKeys.has(seq.join(","))
  );

  const summary = {
    cubeRotations: rotations.length,
    uniqueNormalizedSequences: unique.length,
    matchingSolutions: matched.length,
    totalSolutions: solutions.length,
    allSolutionsAreRotations:
      [...solutionKeys].every(key =>
        rotationKeys.has(key)
      )
  };

  console.table([summary]);

  return {
    summary,
    rotations: unique,
    matched,
    solutions
  };
};


window.testSoulkinGGenerator = function() {
  const sequence = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const axes = [
    [0,1,2],[0,2,1],
    [1,0,2],[1,2,0],
    [2,0,1],[2,1,0]
  ];

  const candidates = [];

  for (const p of axes) {
    for (let mask = 0; mask < 8; mask++) {
      const flips = [0,1,2].map(i =>
        (mask >> i) & 1
      );

      const transform = code =>
        p.map((index,i) =>
          String(Number(code[index]) ^ flips[i])
        ).join("");

      const matches = sequence.every((code,i) =>
        transform(code) ===
        sequence[(i+1)%8]
      );

      if (matches) {
        candidates.push({axes:p,flips});
      }
    }
  }

  // Algemene cyclische opvolger:
  // bestaat altijd, maar is hier expliciet
  // uit de bestaande volgorde geconstrueerd.
  const successor = Object.fromEntries(
    sequence.map((code,i) => [
      code, sequence[(i+1)%8]
    ])
  );

  let current = sequence[0];
  const generated = [current];

  for (let i=0;i<8;i++) {
    current = successor[current];
    generated.push(current);
  }

  const summary = {
    testedCubeSymmetries: 48,
    matchingFixedSymmetries: candidates.length,
    abstractSuccessorWorks:
      generated.slice(0,8).join(",") ===
      sequence.join(","),
    returnsToStart:
      generated[8] === sequence[0]
  };

  console.table([summary]);
  console.log("Gegenereerde hoekpuntcyclus:",generated);
  console.log("Passende kubussymmetrieën:",candidates);

  return {summary,candidates,successor,generated};
};

window.testSoulkinG1FourRounds = function(
  g1Codes = ["001", "011", "010", "000"]
) {
  const corners = [
    "001", "101", "011", "111",
    "110", "010", "100", "000"
  ];

  const rows = [];

  for (let round = 0; round < 4; round++) {
    const codes = [g1Codes[round], ...corners];

    codes.forEach((code, i) => {
      rows.push({
        day: round * 9 + i + 1,
        round: round + 1,
        G: i + 1,
        code
      });
    });
  }

  const counts = Object.fromEntries(
    ["000","001","010","011",
     "100","101","110","111"].map(code => [
      code,
      rows.filter(r => r.code === code).length
    ])
  );

  console.table(
    rows.filter(r => r.G === 1)
  );

  console.table(
    Object.entries(counts).map(([code,count]) => ({
      code, count
    }))
  );

  console.log("Totale posities:", rows.length);
  console.log("Unieke G1-codes:", new Set(g1Codes).size);

  return {rows,counts,g1Codes};
};

window.testSoulkinEnneagramRemap = function() {
  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const g1Codes = ["001","011","010","000"];

  const original = {
    1:"G5", 2:"G6", 3:"G3", 4:"G7",
    5:"G2", 6:"G9", 7:"G4", 8:"G8"
  };

  const types = [1,2,3,4,5,6,7,8];
  const gs = Object.keys(codes);
  const hexad = [1,4,2,8,5,7];

  const distance = (a,b) =>
    [...a].filter((bit,i) => bit !== b[i]).length;

  function evaluate(mapping) {
    const code = type => codes[mapping[type]];

    const hexadDistances = hexad.map((type,i) =>
      distance(
        code(type),
        code(hexad[(i+1)%hexad.length])
      )
    );

    const hexadTotal = hexadDistances.reduce(
      (a,b) => a+b, 0
    );

    const triangle36 = distance(code(3),code(6));

    const triangleByColor = g1Codes.map(g1 =>
      distance(g1,code(3)) +
      triangle36 +
      distance(code(6),g1)
    );

    const triangleTotal = triangleByColor.reduce(
      (a,b) => a+b, 0
    );

    return {
      mapping: {...mapping},
      hexadTotal,
      hexadDistances,
      triangle36,
      triangleTotal,
      triangleByColor,
      hexadAllEdges: hexadDistances.every(d => d===1)
    };
  }

  const results = [];

  function generate(remaining, mapping = {}, index = 0) {
    if (index === types.length) {
      results.push(evaluate(mapping));
      return;
    }

    const type = types[index];

    for (const g of remaining) {
      generate(
        remaining.filter(x => x !== g),
        {...mapping,[type]:g},
        index+1
      );
    }
  }

  generate(gs);

  const baseline = evaluate(original);

  const minHexad = Math.min(
    ...results.map(r => r.hexadTotal)
  );

  const minTriangle = Math.min(
    ...results.map(r => r.triangleTotal)
  );

  const bestHexad = results.filter(
    r => r.hexadTotal === minHexad
  );

  const bestTriangle = results.filter(
    r => r.triangleTotal === minTriangle
  );

  const simultaneous = results.filter(
    r =>
      r.hexadTotal === minHexad &&
      r.triangleTotal === minTriangle
  );

  // Pareto-optimaal: geen andere koppeling is
  // op beide criteria minstens even goed
  // en op minstens één criterium beter.
  const pairs = new Map();

  for (const r of results) {
    const key = `${r.hexadTotal},${r.triangleTotal}`;
    pairs.set(key,(pairs.get(key)||0)+1);
  }

  const pareto = [...pairs].map(([key,count]) => {
    const [hexad,triangle] = key.split(",").map(Number);
    return {hexad,triangle,count};
  }).filter(a =>
    ![...pairs.keys()].some(key => {
      const [h,t] = key.split(",").map(Number);
      return h<=a.hexad &&
             t<=a.triangle &&
             (h<a.hexad || t<a.triangle);
    })
  ).sort((a,b) => a.hexad-b.hexad);

  const summary = {
    mappingsTested:results.length,
    originalHexad:baseline.hexadTotal,
    originalTriangle:baseline.triangleTotal,
    minimumHexad:minHexad,
    minimumTriangle:minTriangle,
    bestHexadMappings:bestHexad.length,
    bestTriangleMappings:bestTriangle.length,
    simultaneousOptima:simultaneous.length,
    originalParetoOptimal:pareto.some(p =>
      p.hexad===baseline.hexadTotal &&
      p.triangle===baseline.triangleTotal
    )
  };

  console.table([summary]);
  console.log("Pareto-grens:");
  console.table(pareto);

  console.log("Oorspronkelijke koppeling:");
  console.table([baseline]);

  console.log("Voorbeeld van gezamenlijk optimum:");
  if (simultaneous.length) {
    console.table(
      types.map(type => ({
        type,
        G:simultaneous[0].mapping[type],
        code:codes[simultaneous[0].mapping[type]]
      }))
    );
  } else {
    console.log(
      "Geen gezamenlijk optimum; criteria concurreren."
    );
  }

  return {
    summary,baseline,pareto,
    bestHexad,bestTriangle,simultaneous,
    results
  };
};


window.testSoulkinEnneagramFamilies = function() {
  const optima = testSoulkinEnneagramRemap().simultaneous;

  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const types = [1,2,3,4,5,6,7,8];

  const permutations = [
    [0,1,2],[0,2,1],
    [1,0,2],[1,2,0],
    [2,0,1],[2,1,0]
  ];

  function parity(p) {
    let inversions = 0;
    for (let i=0;i<3;i++)
      for (let j=i+1;j<3;j++)
        if (p[i]>p[j]) inversions++;
    return inversions%2 ? -1 : 1;
  }

  const rotations = [];

  for (const p of permutations) {
    for (let mask=0;mask<8;mask++) {
      const flips = [0,1,2].map(i => (mask>>i)&1);
      const sign = flips.reduce(
        (s,f) => s*(f ? -1 : 1),1
      );

      if (parity(p)*sign !== 1) continue;

      rotations.push(code =>
        p.map((axis,i) =>
          String(Number(code[axis]) ^ flips[i])
        ).join("")
      );
    }
  }

  function key(mapping) {
    return types.map(t => codes[mapping[t]]).join(",");
  }

  const allKeys = new Set(
    optima.map(o => key(o.mapping))
  );

  const visited = new Set();
  const families = [];

  for (const solution of optima) {
    const start = key(solution.mapping);
    if (visited.has(start)) continue;

    const transformed = new Set();

    for (const rotate of rotations) {
      const sequence = types.map(t =>
        rotate(codes[solution.mapping[t]])
      ).join(",");

      if (allKeys.has(sequence)) {
        transformed.add(sequence);
      }
    }

    for (const k of transformed) visited.add(k);

    families.push({
      family: families.length+1,
      members: transformed.size,
      representative: start
    });
  }

  console.table(families);
  console.log("Aantal families:",families.length);
  console.log("Gedekte optima:",visited.size);
  console.log("Totaal:",optima.length);

  return {families,covered:visited.size};
};


window.testSoulkinYinSymmetries = function() {
  const optima =
    testSoulkinEnneagramRemap().simultaneous;

  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const types = [1,2,3,4,5,6,7,8];

  const permutations = [
    [0,1,2],[0,2,1],
    [1,0,2],[1,2,0],
    [2,0,1],[2,1,0]
  ];

  function parity(p) {
    let inversions = 0;
    for(let i=0;i<3;i++)
      for(let j=i+1;j<3;j++)
        if(p[i]>p[j]) inversions++;
    return inversions%2 ? -1 : 1;
  }

  const keys = new Set(
    optima.map(o =>
      types.map(t => codes[o.mapping[t]]).join(",")
    )
  );

  const results = [];

  for (const p of permutations) {
    for(let mask=0;mask<8;mask++) {
      const flips = [0,1,2].map(i=>(mask>>i)&1);

      const sign = flips.reduce(
        (s,f)=>s*(f?-1:1),1
      );

      if(parity(p)*sign!==1) continue;

      const transform = code =>
        p.map((axis,i) =>
          String(Number(code[axis])^flips[i])
        ).join("");

      let preserved=0;

      for(const solution of optima) {
        const transformed = types.map(t =>
          transform(codes[solution.mapping[t]])
        ).join(",");

        if(keys.has(transformed)) preserved++;
      }

      results.push({
        axes:p.join(""),
        flips:flips.join(""),
        preserved,
        preservesAll:preserved===optima.length
      });
    }
  }

  console.table(
    results.filter(r=>r.preservesAll)
  );

  console.log(
    "Volledige symmetrieën:",
    results.filter(r=>r.preservesAll).length
  );

  console.table(
    results.filter(r=>!r.preservesAll)
  );

  return results;
};


window.testSoulkinTrueFamilies = function() {
  const optima =
    testSoulkinEnneagramRemap().simultaneous;

  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const types = [1,2,3,4,5,6,7,8];

  // De vier bewezen volledige symmetrieën.
  const symmetries = [
    {p:[0,1,2],f:[0,0,0]},
    {p:[0,1,2],f:[0,1,1]},
    {p:[0,2,1],f:[0,1,0]},
    {p:[0,2,1],f:[0,0,1]}
  ];

  const transform = (code,s) =>
    s.p.map((axis,i) =>
      String(Number(code[axis]) ^ s.f[i])
    ).join("");

  const key = mapping =>
    types.map(t => codes[mapping[t]]).join(",");

  const available = new Set(
    optima.map(o => key(o.mapping))
  );

  const visited = new Set();
  const families = [];

  for(const solution of optima) {
    const start = key(solution.mapping);
    if(visited.has(start)) continue;

    const members = new Set();

    for(const symmetry of symmetries) {
      const transformed = types.map(t =>
        transform(codes[solution.mapping[t]],symmetry)
      ).join(",");

      if(available.has(transformed)) {
        members.add(transformed);
      }
    }

    for(const member of members) {
      visited.add(member);
    }

    families.push({
      family:families.length+1,
      size:members.size,
      representative:start
    });
  }

  const summary = {
    totalOptima:optima.length,
    families:families.length,
    covered:visited.size,
    allFamiliesSize4:
      families.every(f=>f.size===4)
  };

  console.table([summary]);
  console.table(families);

  return {summary,families};
};


window.testSoulkinNightlordEnneagram = function() {
  const optima =
    testSoulkinEnneagramRemap().simultaneous;

  const types = [1,2,3,4,5,6,7,8];

  const gOrder = [
    "G2","G3","G4","G5",
    "G6","G7","G8","G9"
  ];

  const hexad = [1,4,2,8,5,7];

  const edges = new Set();

  function addEdge(a,b) {
    edges.add([a,b].sort((x,y)=>x-y).join("-"));
  }

  for(let i=0;i<hexad.length;i++) {
    addEdge(hexad[i],hexad[(i+1)%hexad.length]);
  }

  // Van de driehoek is 3-6 de verbinding
  // tussen twee vaste G-codes.
  addEdge(3,6);

  function circleDistance(a,b) {
    const d = Math.abs(a-b);
    return Math.min(d,9-d);
  }

  const results = optima.map((solution,index) => {
    const inverse = {};

    for(const type of types) {
      inverse[solution.mapping[type]] = type;
    }

    const sequence = gOrder.map(g=>inverse[g]);

    const steps = sequence.map((type,i) =>
      circleDistance(
        type,
        sequence[(i+1)%sequence.length]
      )
    );

    const matchingEdges = sequence.reduce(
      (count,type,i) => {
        const next =
          sequence[(i+1)%sequence.length];

        const edge = [type,next]
          .sort((a,b)=>a-b).join("-");

        return count + Number(edges.has(edge));
      },0
    );

    return {
      index,
      sequence:sequence.join("→"),
      circleTotal:steps.reduce((a,b)=>a+b,0),
      matchingEdges,
      mapping:solution.mapping
    };
  });

  const minCircle = Math.min(
    ...results.map(r=>r.circleTotal)
  );

  const maxEdges = Math.max(
    ...results.map(r=>r.matchingEdges)
  );

  const best = results.filter(r =>
    r.circleTotal===minCircle &&
    r.matchingEdges===maxEdges
  );

  const summary = {
    tested:results.length,
    minimumCircleDistance:minCircle,
    maximumMatchingEdges:maxEdges,
    simultaneousBest:best.length
  };

  console.table([summary]);

  console.log("Beste cirkelafstand:");
  console.table(
    results.filter(r=>r.circleTotal===minCircle)
      .map(({index,sequence,circleTotal,matchingEdges}) =>
        ({index,sequence,circleTotal,matchingEdges})
      )
  );

  console.log("Meeste enneagramverbindingen:");
  console.table(
    results.filter(r=>r.matchingEdges===maxEdges)
      .map(({index,sequence,circleTotal,matchingEdges}) =>
        ({index,sequence,circleTotal,matchingEdges})
      )
  );

  return {summary,results,best};
};


window.testSoulkinMeaningRobustness = function(runs=100000) {
  const scores = {
    G2:[1,0,0,1,3,3,0,1],
    G3:[2,1,2,2,2,1,2,1],
    G4:[1,2,1,2,2,1,3,1],
    G5:[2,1,3,1,1,1,2,3],
    G6:[0,3,1,2,1,1,3,1],
    G7:[1,0,0,2,3,3,0,2],
    G8:[1,1,2,1,0,1,3,3],
    G9:[1,3,1,1,1,3,1,1]
  };

  const candidates = {
    8: [3,1,2,4,5,8,7,6],
    24:[3,2,1,4,5,7,8,6],
    71:[6,8,7,5,4,1,2,3],
    87:[6,7,8,5,4,2,1,3]
  };

  const ids = Object.keys(candidates);
  const wins = Object.fromEntries(ids.map(id=>[id,0]));
  const total = Object.fromEntries(ids.map(id=>[id,0]));
  let ties = 0;

  for(let run=0;run<runs;run++) {
    const varied = {};

    for(const [g,row] of Object.entries(scores)) {
      varied[g] = row.map(value => {
        const change = Math.floor(Math.random()*3)-1;
        return Math.max(0,Math.min(3,value+change));
      });
    }

    const results = ids.map(id => {
      const sequence = candidates[id];
      return {
        id,
        score:sequence.reduce((sum,type,i) =>
          sum+varied["G"+(i+2)][type-1],0
        )
      };
    });

    for(const r of results) total[r.id]+=r.score;

    const best = Math.max(...results.map(r=>r.score));
    const winners = results.filter(r=>r.score===best);

    if(winners.length>1) ties++;

    // Gedeelde winst wordt eerlijk verdeeld.
    for(const winner of winners) {
      wins[winner.id]+=1/winners.length;
    }
  }

  const output = ids.map(id=>({
    candidate:Number(id),
    averageScore:(total[id]/runs).toFixed(3),
    winPercentage:(wins[id]/runs*100).toFixed(2)+"%"
  })).sort((a,b)=>
    parseFloat(b.winPercentage)-parseFloat(a.winPercentage)
  );

  console.table(output);
  console.log(
    "Runs met gedeelde eerste plaats:",
    (ties/runs*100).toFixed(2)+"%"
  );

  return {output,ties,runs};
};


window.testSoulkinMeaningConflicts = function() {
  const fit = {
    G2:[1,0,0,1,3,3,0,1],
    G3:[3,1,2,2,2,1,2,1],
    G4:[1,2,1,2,2,1,3,1],
    G5:[2,1,3,1,1,1,2,3],
    G6:[0,3,1,2,1,1,3,1],
    G7:[1,0,0,2,3,3,0,2],
    G8:[1,1,2,1,0,1,3,3],
    G9:[1,3,1,1,1,3,1,1]
  };

  const conflict = {
    G2:[0,1,2,0,0,0,2,1],
    G3:[0,0,0,0,0,1,0,0],
    G4:[0,0,0,0,0,0,0,2],
    G5:[0,0,0,2,0,0,0,0],
    G6:[2,0,0,0,0,0,0,0],
    G7:[0,1,1,0,0,0,2,0],
    G8:[0,0,0,0,2,0,0,0],
    G9:[0,0,2,0,0,0,0,0]
  };

  const candidates = {
    8: [3,1,2,4,5,8,7,6],
    24:[3,2,1,4,5,7,8,6],
    71:[6,8,7,5,4,1,2,3],
    87:[6,7,8,5,4,2,1,3]
  };

  const rows = Object.entries(candidates).map(
    ([id,sequence]) => {
      let positive = 0;
      let negative = 0;

      sequence.forEach((type,i) => {
        const g = "G"+(i+2);
        positive += fit[g][type-1];
        negative += conflict[g][type-1];
      });

      return {
        candidate:Number(id),
        positive,
        negative,
        net:positive-negative,
        sequence:sequence.join("→")
      };
    }
  );

  console.log("Scores:");
  console.table(rows.sort((a,b)=>b.net-a.net));

  console.log("Gevoeligheid voor strafgewicht:");

  const sensitivity = [];

  for(let weight=0;weight<=2.001;weight+=0.25) {
    const scored = rows.map(r=>({
      id:r.candidate,
      score:r.positive-weight*r.negative
    }));

    const maximum = Math.max(
      ...scored.map(r=>r.score)
    );

    sensitivity.push({
      penaltyWeight:Number(weight.toFixed(2)),
      winners:scored
        .filter(r=>Math.abs(r.score-maximum)<1e-9)
        .map(r=>r.id).join(", "),
      bestScore:Number(maximum.toFixed(2))
    });
  }

  console.table(sensitivity);

  return {rows,sensitivity,fit,conflict};
};


window.testSoulkin36 = function() {
  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const candidates = {
    8:  [3,1,2,4,5,8,7,6],
    24: [3,2,1,4,5,7,8,6],
    71: [6,8,7,5,4,1,2,3],
    87: [6,7,8,5,4,2,1,3]
  };

  const colors = ["001","011","010","000"];
  const distance = (a,b) =>
    [...a].filter((x,i)=>x!==b[i]).length;

  const rows = [];

  for (const [id,types] of Object.entries(candidates)) {
    const typeCode = {};

    types.forEach((type,i)=>{
      typeCode[type] = codes["G"+(i+2)];
    });

    const daily = Array.from({length:36},(_,day)=>{
      const g1 = colors[Math.floor(day/9)];
      const d3 = distance(g1,typeCode[3]);
      const d6 = distance(g1,typeCode[6]);

      return {
        day:day+1,
        g1,
        d3,
        d6,
        triangleDistance:d3+d6
      };
    });

    const total3 = daily.reduce((s,r)=>s+r.d3,0);
    const total6 = daily.reduce((s,r)=>s+r.d6,0);
    const total = daily.reduce(
      (s,r)=>s+r.triangleDistance,0
    );

    const transitions = daily.reduce((s,r,i)=>{
      const next = daily[(i+1)%daily.length];
      return s+distance(r.g1,next.g1);
    },0);

    rows.push({
      candidate:Number(id),
      total3,
      total6,
      triangleTotal:total,
      g1TransitionTotal:transitions,
      signature:daily
        .filter((_,i)=>i%9===0)
        .map(r=>`${r.d3}/${r.d6}`)
        .join(" | ")
    });
  }

  console.table(rows);

  const allEqual = rows.every(r=>
    r.triangleTotal===rows[0].triangleTotal &&
    r.g1TransitionTotal===rows[0].g1TransitionTotal
  );

  console.log(
    "Gelijk volgens deze twee totale afstandsmaten:",
    allEqual
  );

  return rows;
};


window.testSoulkinEnneagramDirection = function() {
  const candidates = {
    8:  [3,1,2,4,5,8,7,6],
    24: [3,2,1,4,5,7,8,6],
    71: [6,8,7,5,4,1,2,3],
    87: [6,7,8,5,4,2,1,3]
  };

  const cycles = {
    triangle: [9,3,6],
    hexad: [1,4,2,8,5,7]
  };

  const edges = Object.entries(cycles).flatMap(
    ([cycle,types]) => types.map((from,i) => ({
      cycle,
      from,
      to:types[(i+1)%types.length]
    }))
  );

  const mod = (n,m) => ((n%m)+m)%m;
  const results = [];
  const details = [];

  for (const [id,types] of Object.entries(candidates)) {
    const positions = {9:0};

    types.forEach((type,i) => {
      positions[type] = i+1;
    });

    let forward = 0;
    let backward = 0;
    let distanceSum = 0;

    for (const edge of edges) {
      const stepsForward = mod(
        positions[edge.to]-positions[edge.from],9
      );

      const stepsBackward = mod(
        positions[edge.from]-positions[edge.to],9
      );

      const shortest = Math.min(
        stepsForward,stepsBackward
      );

      const isForward = stepsForward===1;
      const isBackward = stepsBackward===1;

      forward += Number(isForward);
      backward += Number(isBackward);
      distanceSum += shortest;

      details.push({
        candidate:Number(id),
        cycle:edge.cycle,
        connection:`${edge.from}→${edge.to}`,
        forwardSteps:stepsForward,
        backwardSteps:stepsBackward,
        shortest,
        direction:isForward ? "vooruit" :
          isBackward ? "achteruit" : "geen buur"
      });
    }

    results.push({
      candidate:Number(id),
      forward,
      backward,
      adjacent:forward+backward,
      directionBalance:forward-backward,
      totalCircleDistance:distanceSum
    });
  }

  console.log("Overzicht:");
  console.table(results);

  console.log("Alle negen verbindingen:");
  console.table(details);

  console.log(
    "Minimum totale ringafstand:",
    Math.min(...results.map(r=>r.totalCircleDistance))
  );

  return {results,details};
};


window.testSoulkinStructuralMatch = function() {
  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const candidates = {
    8:  [3,1,2,4,5,8,7,6],
    24: [3,2,1,4,5,7,8,6],
    71: [6,8,7,5,4,1,2,3],
    87: [6,7,8,5,4,2,1,3]
  };

  const g1Colors = ["001","011","010","000"];
  const triangle = [9,3,6,9];
  const hexad = [1,4,2,8,5,7,1];

  const distance = (a,b) =>
    [...a].reduce((s,bit,i) => s+(bit!==b[i]),0);

  const pathDistance = (path,lookup) =>
    path.slice(1).reduce((sum,type,i) =>
      sum+distance(lookup[path[i]],lookup[type]),0
    );

  const results = [];

  for(const [id,sequence] of Object.entries(candidates)) {
    const lookup = {};

    sequence.forEach((type,i) => {
      lookup[type] = codes["G"+(i+2)];
    });

    const hexadDistance = pathDistance(hexad,lookup);
    const triangleDistances = g1Colors.map(code => {
      lookup[9] = code;
      return pathDistance(triangle,lookup);
    });

    const triangleTotal =
      triangleDistances.reduce((a,b)=>a+b,0);

    results.push({
      candidate:Number(id),
      hexadDistance,
      triangleDistances:triangleDistances.join(", "),
      triangleTotal,
      combined:4*hexadDistance+triangleTotal
    });
  }

  console.table(results);

  const signatures = results.map(r =>
    `${r.hexadDistance}/${r.triangleTotal}`
  );

  console.log(
    "Zelfde totale structurele score:",
    new Set(signatures).size===1
  );

  return results;
};


window.testSoulkinCubeHexagons = function() {
  const codes = {
    G2:"001", G3:"101", G4:"011", G5:"111",
    G6:"110", G7:"010", G8:"100", G9:"000"
  };

  const candidates = {
    8:  [3,1,2,4,5,8,7,6],
    24: [3,2,1,4,5,7,8,6],
    71: [6,8,7,5,4,1,2,3],
    87: [6,7,8,5,4,2,1,3]
  };

  const vertices = [
    "000","001","010","011",
    "100","101","110","111"
  ];

  const g1 = ["001","011","010","000"];
  const hexad = [1,4,2,8,5,7];

  const dist = (a,b) =>
    [...a].filter((bit,i)=>bit!==b[i]).length;

  function canonical(path) {
    const variants = [];

    for (const direction of [path,[...path].reverse()]) {
      for (let i=0;i<6;i++) {
        variants.push(
          [...direction.slice(i),...direction.slice(0,i)]
            .join("-")
        );
      }
    }

    return variants.sort()[0];
  }

  const allCycles = new Map();

  function search(path) {
    if (path.length===6) {
      if (dist(path[5],path[0])!==1) return;

      const key = canonical(path);
      if (!allCycles.has(key)) {
        const omitted = vertices.filter(
          v=>!path.includes(v)
        );

        allCycles.set(key,{
          key,
          path:[...path],
          omitted,
          omittedDistance:dist(omitted[0],omitted[1]),
          g1Overlap:omitted.filter(v=>g1.includes(v))
            .length
        });
      }
      return;
    }

    for (const next of vertices) {
      if (!path.includes(next) &&
          dist(path[path.length-1],next)===1) {
        search([...path,next]);
      }
    }
  }

  for (const start of vertices) search([start]);

  const cycles = [...allCycles.values()];

  const candidateRows = Object.entries(candidates).map(
    ([id,types])=>{
      const lookup = {9:null};

      types.forEach((type,i)=>{
        lookup[type]=codes["G"+(i+2)];
      });

      const path = hexad.map(type=>lookup[type]);
      const key = canonical(path);
      const cycle = allCycles.get(key);

      return {
        candidate:Number(id),
        type3:lookup[3],
        type6:lookup[6],
        omitted:cycle?.omitted.join(" / ") ?? "onbekend",
        omittedDistance:cycle?.omittedDistance,
        g1Overlap:cycle?.g1Overlap,
        cubePath:key,
        valid:!!cycle
      };
    }
  );

  const summary = {
    totalCycles:cycles.length,
    adjacentOmissions:cycles.filter(
      c=>c.omittedDistance===1
    ).length,
    oppositeOmissions:cycles.filter(
      c=>c.omittedDistance===3
    ).length,
    cyclesOmittingTwoG1Codes:cycles.filter(
      c=>c.g1Overlap===2
    ).length,
    uniqueCandidatePaths:new Set(
      candidateRows.map(r=>r.cubePath)
    ).size
  };

  console.log("Alle 16 kubuszeshoeken:");
  console.table(cycles.map((c,i)=>({
    number:i+1,
    omitted:c.omitted.join(" / "),
    omittedDistance:c.omittedDistance,
    g1Overlap:c.g1Overlap,
    path:c.key
  })));

  console.log("Vergelijking van de vier kandidaten:");
  console.table(candidateRows);

  console.log("Samenvatting:");
  console.table([summary]);

  return {cycles,candidateRows,summary};
};


window.testSoulkinAllMappings = function() {
  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const colors = ["001","011","010","000"];
  const hexad = [1,4,2,8,5,7,1];
  const dist = (a,b) =>
    [...a].filter((x,i)=>x!==b[i]).length;

  const results = [];
  const counts = {};

  function evaluate(types) {
    const mapping = {};

    types.forEach((type,i)=>{
      mapping[type] = codes[i];
    });

    const hexadDistance = hexad.slice(1)
      .reduce((sum,type,i)=>
        sum+dist(mapping[hexad[i]],mapping[type]),0
      );

    if(hexadDistance!==6) return;

    const omitted = [mapping[3],mapping[6]];
    if(!omitted.every(c=>colors.includes(c))) return;

    const triangleTotal = colors.reduce((sum,c)=>
      sum+dist(c,mapping[3])
         +dist(mapping[3],mapping[6])
         +dist(mapping[6],c),0
    );

    if(triangleTotal!==12) return;

    const key = [...omitted].sort().join(" / ");
    counts[key] = (counts[key]||0)+1;

    results.push({
      types:[...types],
      omitted:key,
      hexadDistance,
      triangleTotal
    });
  }

  function permute(a,start=0) {
    if(start===a.length) {
      evaluate(a);
      return;
    }

    for(let i=start;i<a.length;i++) {
      [a[start],a[i]]=[a[i],a[start]];
      permute(a,start+1);
      [a[start],a[i]]=[a[i],a[start]];
    }
  }

  permute([1,2,3,4,5,6,7,8]);

  console.log("Geldige oplossingen:",results.length);

  console.table(
    Object.entries(counts).map(([pair,count])=>({
      omitted:pair,
      solutions:count
    }))
  );

  console.log(
    "Alle 96 oplossingen:",
    results
  );

  return {results,counts};
};


window.testSoulkinChronology = function() {
  const mappings = testSoulkinAllMappings().results;

  const triangle = [9,3,6,9];
  const hexad = [1,4,2,8,5,7,1];

  const edges = [triangle,hexad].flatMap(
    cycle=>cycle.slice(1).map((to,i)=>[
      cycle[i],to
    ])
  );

  const mod = (n,m)=>((n%m)+m)%m;

  const results = mappings.map((entry,index)=>{
    const positions = {9:0};

    entry.types.forEach((type,i)=>{
      positions[type]=i+1;
    });

    let forward=0;
    let backward=0;
    let totalDistance=0;

    for(const [from,to] of edges) {
      const f=mod(positions[to]-positions[from],9);
      const b=mod(positions[from]-positions[to],9);

      if(f===1) forward++;
      if(b===1) backward++;

      totalDistance+=Math.min(f,b);
    }

    return {
      index,
      omitted:entry.omitted,
      sequence:entry.types.join("→"),
      forward,
      backward,
      adjacent:forward+backward,
      totalDistance,
      directionBalance:forward-backward
    };
  });

  const minDistance=Math.min(
    ...results.map(r=>r.totalDistance)
  );

  const maxAdjacent=Math.max(
    ...results.map(r=>r.adjacent)
  );

  const best=results.filter(r=>
    r.totalDistance===minDistance &&
    r.adjacent===maxAdjacent
  );

  console.log("Alle oplossingen:",results.length);
  console.log("Minimale ringafstand:",minDistance);
  console.log("Maximale directe verbindingen:",maxAdjacent);
  console.log("Voldoen aan beide:",best.length);

  console.table(best);

  return {results,best,minDistance,maxAdjacent};
};


window.testSoulkinSymmetryFamilies = function() {
  const entries = testSoulkinAllMappings().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];
  const g1 = ["001","011","010","000"];
  const cycles = [
    [9,3,6,9],
    [1,4,2,8,5,7,1]
  ];
  const edges = cycles.flatMap(path =>
    path.slice(1).map((to,i)=>[path[i],to])
  );

  const mod = (n,m)=>(n%m+m)%m;

  // Zelfde chronologische selectie als vorige test.
  const scored = entries.map((entry,index)=>{
    const positions = {9:0};

    entry.types.forEach((type,i)=>{
      positions[type]=i+1;
    });

    let distance=0, adjacent=0;

    for(const [a,b] of edges) {
      const f=mod(positions[b]-positions[a],9);
      const backward=9-f;
      distance+=Math.min(f,backward);
      if(f===1 || backward===1) adjacent++;
    }

    return {index,types:entry.types,distance,adjacent};
  });

  const minDistance=Math.min(...scored.map(x=>x.distance));
  const maxAdjacent=Math.max(...scored.map(x=>x.adjacent));

  const selected=scored.filter(x=>
    x.distance===minDistance &&
    x.adjacent===maxAdjacent
  );

  const permutations = [
    [0,1,2],[0,2,1],[1,0,2],
    [1,2,0],[2,0,1],[2,1,0]
  ];

  const transforms=[];

  for(const axes of permutations) {
    for(let mask=0;mask<8;mask++) {
      const flips=[0,1,2].map(i=>(mask>>i)&1);

      const apply = code =>
        axes.map((axis,i)=>
          String(Number(code[axis])^flips[i])
        ).join("");

      transforms.push({
        axes,flips,apply,
        preservesG1Set:g1.every(c=>
          g1.includes(apply(c))
        ),
        preservesG1Order:g1.every(c=>
          apply(c)===c
        )
      });
    }
  }

  function signature(types) {
    return types.join(",");
  }

  function transformTypes(types,t) {
    const typeToCode={};

    types.forEach((type,i)=>{
      typeToCode[type]=codes[i];
    });

    const codeToType={};

    for(const [type,code] of Object.entries(typeToCode)) {
      codeToType[t.apply(code)]=Number(type);
    }

    return codes.map(c=>codeToType[c]);
  }

  const selectedKeys=new Set(
    selected.map(x=>signature(x.types))
  );

  function families(group) {
    const remaining=new Set(selectedKeys);
    const output=[];

    while(remaining.size) {
      const seed=remaining.values().next().value;
      const types=seed.split(",").map(Number);

      const members=new Set(
        group.map(t=>signature(transformTypes(types,t)))
          .filter(key=>selectedKeys.has(key))
      );

      output.push({
        representative:seed,
        members:[...members].sort(),
        size:members.size
      });

      for(const key of members) remaining.delete(key);
    }

    return output.sort((a,b)=>
      a.representative.localeCompare(b.representative)
    );
  }

  const full=families(transforms);
  const g1Set=families(
    transforms.filter(t=>t.preservesG1Set)
  );
  const exact=families(
    transforms.filter(t=>t.preservesG1Order)
  );

  const summary=[
    {symmetry:"Alle kubussymmetrieën",
     transformations:48,
     families:full.length,
     sizes:full.map(x=>x.size).join(", ")},
    {symmetry:"G1-kleurverzameling behouden",
     transformations:transforms.filter(
       t=>t.preservesG1Set
     ).length,
     families:g1Set.length,
     sizes:g1Set.map(x=>x.size).join(", ")},
    {symmetry:"G1-kleurcodes exact behouden",
     transformations:transforms.filter(
       t=>t.preservesG1Order
     ).length,
     families:exact.length,
     sizes:exact.map(x=>x.size).join(", ")}
  ];

  console.log("Chronologisch geselecteerd:",selected.length);
  console.table(summary);

  console.log("Zes vrije geometrische families:");
  console.table(full.map((f,i)=>({
    family:i+1,
    size:f.size,
    representative:f.representative
  })));

  return {selected,summary,full,g1Set,exact};
};


window.testSoulkinFamilyStructure = function() {
  const source = testSoulkinSymmetryFamilies();
  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];
  const hexad = [1,4,2,8,5,7,1];
  const triangle = [9,3,6,9];
  const g1Colors = ["001","011","010","000"];

  const dist = (a,b) =>
    [...a].filter((bit,i)=>bit!==b[i]).length;

  const mod = (n,m)=>(n%m+m)%m;

  function analyze(sequence) {
    const lookup = {};
    const positions = {9:0};

    sequence.forEach((type,i)=>{
      lookup[type]=codes[i];
      positions[type]=i+1;
    });

    const hexadCodes = hexad.map(t=>lookup[t]);

    const bitChanges = hexadCodes.slice(1).map(
      (code,i)=>dist(hexadCodes[i],code)
    );

    const ringSteps = hexad.slice(1).map(
      (type,i)=>mod(
        positions[type]-positions[hexad[i]],9
      )
    );

    const trianglePatterns = g1Colors.map(code=>{
      const values = {...lookup,9:code};
      return triangle.slice(1).map(
        (type,i)=>dist(values[triangle[i]],values[type])
      );
    });

    return {
      type3:lookup[3],
      type6:lookup[6],
      hexadCodes:hexadCodes.join("→"),
      bitChanges:bitChanges.join(","),
      ringSteps:ringSteps.join(","),
      trianglePatterns:trianglePatterns
        .map(x=>x.join("-")).join(" | ")
    };
  }

  const rows = source.full.map((family,i)=>{
    const sequence = family.representative
      .split(",").map(Number);

    return {
      family:i+1,
      members:family.size,
      ...analyze(sequence)
    };
  });

  console.log("Zes familievertegenwoordigers:");
  console.table(rows);

  const familyDetails = source.full.map((family,i)=>{
    const members = family.members.map(key=>
      analyze(key.split(",").map(Number))
    );

    return {
      family:i+1,
      count:members.length,
      uniqueRingPatterns:new Set(
        members.map(m=>m.ringSteps)
      ).size,
      uniqueTrianglePatterns:new Set(
        members.map(m=>m.trianglePatterns)
      ).size,
      uniqueHexadPaths:new Set(
        members.map(m=>m.hexadCodes)
      ).size,
      uniqueBitPatterns:new Set(
        members.map(m=>m.bitChanges)
      ).size
    };
  });

  console.log("Variatie binnen iedere familie:");
  console.table(familyDetails);

  return {rows,familyDetails};
};


window.testSoulkinSevenths = function() {
  const all = testSoulkinAllMappings().results;
  const chronology = testSoulkinSymmetryFamilies();

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const hexad = [1,4,2,8,5,7,1];
  const triangle = [9,3,6,9];

  const bits = n => (n & 7)
    .toString(2).padStart(3,"0");

  const hamming = (a,b) =>
    [...a].filter((v,i)=>v!==b[i]).length;

  // Controleer de cijfers van 1/7 via staartdeling.
  let remainder=1;
  const digits=[];
  const remainders=[];

  do {
    remainders.push(remainder);
    const value=remainder*10;
    digits.push(Math.floor(value/7));
    remainder=value%7;
  } while(remainder!==1 && digits.length<20);

  console.log("1/7 cijfers:",digits.join(""));
  console.log("Restcyclus:",remainders.join("→"));
  console.log("Enneagramzeshoek:",hexad.join("→"));
  console.log("Enneagramdriehoek:",triangle.join("→"));

  const encodings = {
    direct: n=>bits(n),
    vanafNul: n=>bits(n-1)
  };

  // Hamming-afstanden van de rekenkundige zeshoek.
  const arithmetic = Object.entries(encodings).map(
    ([name,encode])=>{
      const path=hexad.map(encode);
      const distances=path.slice(1).map(
        (code,i)=>hamming(path[i],code)
      );

      return {
        encoding:name,
        path:path.join("→"),
        distances:distances.join(","),
        total:distances.reduce((a,b)=>a+b,0),
        allCubeEdges:distances.every(d=>d===1)
      };
    }
  );

  console.log("Rekenkundige binaire zeshoek:");
  console.table(arithmetic);

  // Vergelijk met de 96 bestaande Soulkin-oplossingen.
  function analyze(entry,index,encode) {
    const types=entry.types;
    const matches=types.reduce(
      (sum,type,i)=>
        sum+Number(codes[i]===encode(type)),0
    );

    return {
      index,
      sequence:types.join("→"),
      matches
    };
  }

  const selectedKeys=new Set(
    chronology.selected.map(x=>x.types.join(","))
  );

  const results={};

  for(const [name,encode] of Object.entries(encodings)) {
    const scored=all.map((entry,index)=>
      analyze(entry,index,encode)
    );

    const bestScore=Math.max(...scored.map(x=>x.matches));
    const best=scored.filter(x=>x.matches===bestScore);
    const best72=best.filter(x=>
      selectedKeys.has(all[x.index].types.join(","))
    );

    const distribution={};
    scored.forEach(x=>{
      distribution[x.matches]=(distribution[x.matches]||0)+1;
    });

    console.log("Codering:",name);
    console.log("Beste overeenkomst:",bestScore,"van 8");
    console.log("Winnaars van 96:",best.length);
    console.log("Daarvan binnen de 72:",best72.length);

    console.table(
      Object.entries(distribution).map(([matches,count])=>({
        matches:Number(matches),
        count
      }))
    );
    console.table(best);

    results[name]={bestScore,best,best72,distribution};
  }

  return {
    digits,
    remainders,
    arithmetic,
    results
  };
};


window.testSoulkinSeventhsStructure = function() {
  const all = testSoulkinAllMappings().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const hexad = [1,4,2,8,5,7];
  const residues = [1,3,2,6,4,5];

  const hamming = (a,b) =>
    [...a].filter((v,i)=>v!==b[i]).length;

  const rotate = (arr,k) =>
    arr.map((_,i)=>arr[(i+k)%arr.length]);

  const orientations = [];

  for(let reverse=0;reverse<2;reverse++) {
    const sequence = reverse
      ? [...residues].reverse()
      : [...residues];

    for(let shift=0;shift<6;shift++) {
      orientations.push({
        reverse:!!reverse,
        shift,
        sequence:rotate(sequence,shift)
      });
    }
  }

  // Vergelijk de zespositiestructuur zonder
  // numerieke gelijkstelling van de labels.
  const structural = orientations.map(o=>({
    reverse:o.reverse,
    shift:o.shift,
    residues:o.sequence.join("→"),
    hexad:hexad.join("→"),
    cycleEdges:6
  }));

  console.log("Mogelijke cyclusoriëntaties:");
  console.table(structural);

  const results=all.map((entry,index)=>{
    const typeToCode={};

    entry.types.forEach((type,i)=>{
      typeToCode[type]=codes[i];
    });

    const path=hexad.map(t=>typeToCode[t]);

    const distances=path.map((code,i)=>
      hamming(code,path[(i+1)%6])
    );

    return {
      index,
      sequence:entry.types.join("→"),
      distances:distances.join(","),
      cubeCycle:distances.every(d=>d===1),
      orientations:orientations.length
    };
  });

  const valid=results.filter(r=>r.cubeCycle);

  console.log("Geometrische oplossingen:",all.length);
  console.log("Exacte zesribben-cycli:",valid.length);
  console.log(
    "Rekenkundige oriëntaties per oplossing:",
    orientations.length
  );
  console.log(
    "Totaal combinaties:",
    valid.length*orientations.length
  );

  const uniquePatterns=[
    ...new Set(valid.map(r=>r.distances))
  ];

  console.log("Unieke afstandspatronen:");
  console.table(uniquePatterns.map(pattern=>({pattern})));

  return {
    orientations,
    results,
    valid,
    uniquePatterns
  };
};


window.testSoulkinG1Direction = function() {
  const all = testSoulkinAllMappings().results;
  const chronology = testSoulkinSymmetryFamilies();

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const g1 = ["001","011","010","000"];
  const triangle = [9,3,6,9];
  const hexad = [1,4,2,8,5,7,1];

  const selected = new Set(
    chronology.selected.map(x=>x.types.join(","))
  );

  function transition(a,b) {
    const changes=[];

    for(let i=0;i<3;i++) {
      if(a[i]!==b[i]) {
        changes.push({
          bit:i,
          direction:a[i]+"→"+b[i]
        });
      }
    }

    return changes;
  }

  function analyze(entry,index) {
    const lookup={};

    entry.types.forEach((type,i)=>{
      lookup[type]=codes[i];
    });

    const rounds=g1.map((g1code,round)=>{
      const values={...lookup,9:g1code};

      const triangleTransitions=triangle.slice(1).map(
        (type,i)=>transition(
          values[triangle[i]],values[type]
        )
      );

      return {
        round:round+1,
        g1:g1code,
        transitions:triangleTransitions,
        signature:triangleTransitions.map(
          edge=>edge.map(
            c=>c.bit+":"+c.direction
          ).join("+")||"="
        ).join("|")
      };
    });

    const hexadTransitions=hexad.slice(1).map(
      (type,i)=>transition(
        lookup[hexad[i]],lookup[type]
      )
    );

    const hexadSignature=hexadTransitions.map(
      edge=>edge.map(
        c=>c.bit+":"+c.direction
      ).join("+")
    ).join("|");

    const g1Transitions=g1.map((code,i)=>
      transition(code,g1[(i+1)%4])
    );

    return {
      index,
      sequence:entry.types.join("→"),
      in72:selected.has(entry.types.join(",")),
      triangleSequence:rounds.map(
        r=>r.signature
      ).join(" / "),
      hexadSignature,
      g1Signature:g1Transitions.map(
        edge=>edge.map(
          c=>c.bit+":"+c.direction
        ).join("+")
      ).join("|")
    };
  }

  const results=all.map(analyze);

  function countUnique(field,items) {
    return new Set(items.map(x=>x[field])).size;
  }

  const selectedResults=results.filter(x=>x.in72);

  const summary=[
    {
      set:"Alle 96",
      count:results.length,
      uniqueTriangleSequences:countUnique(
        "triangleSequence",results
      ),
      uniqueHexadSignatures:countUnique(
        "hexadSignature",results
      ),
      uniqueG1Signatures:countUnique(
        "g1Signature",results
      )
    },
    {
      set:"Chronologische 72",
      count:selectedResults.length,
      uniqueTriangleSequences:countUnique(
        "triangleSequence",selectedResults
      ),
      uniqueHexadSignatures:countUnique(
        "hexadSignature",selectedResults
      ),
      uniqueG1Signatures:countUnique(
        "g1Signature",selectedResults
      )
    }
  ];

  console.log("Richtingspatronen:");
  console.table(summary);

  const grouped={};

  for(const r of selectedResults) {
    const key=r.triangleSequence;

    if(!grouped[key]) {
      grouped[key]={
        count:0,
        indices:[]
      };
    }

    grouped[key].count++;
    grouped[key].indices.push(r.index);
  }

  console.log("Driehoekpatronen binnen de 72:");
  console.table(
    Object.values(grouped).map((g,i)=>({
      pattern:i+1,
      count:g.count,
      indices:g.indices.join(",")
    }))
  );

  return {results,summary,grouped};
};


window.testSoulkin36DayDynamics = function() {
  const all = testSoulkinAllMappings().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const g1 = ["001","011","010","000"];
  const triangle = [9,3,6,9];
  const hexad = [1,4,2,8,5,7,1];

  const hamming = (a,b) =>
    [...a].filter((bit,i)=>bit!==b[i]).length;

  // Vier rondes van negen dagen.
  const days=Array.from({length:36},(_,day)=>{
    const round=Math.floor(day/9);
    const g=day%9+1;

    return {
      day:day+1,
      round:round+1,
      g,
      code:g===1 ? g1[round] : codes[g-2]
    };
  });

  // Controleer de 36 dagelijkse overgangen.
  const transitions=days.map((day,i)=>{
    const next=days[(i+1)%36];

    return {
      from:day.day,
      to:next.day,
      gFrom:day.g,
      gTo:next.g,
      codeFrom:day.code,
      codeTo:next.code,
      distance:hamming(day.code,next.code)
    };
  });

  console.log("36-daagse Nightlord-overgangen:");
  console.table(transitions);

  function analyze(entry,index) {
    const typeToG={9:1};

    entry.types.forEach((type,i)=>{
      typeToG[type]=i+2;
    });

    function codeForType(type,round) {
      const g=typeToG[type];

      return g===1 ? g1[round] : codes[g-2];
    }

    const rounds=Array.from({length:4},(_,round)=>{
      function distances(path) {
        return path.slice(1).map((type,i)=>
          hamming(
            codeForType(path[i],round),
            codeForType(type,round)
          )
        );
      }

      return {
        triangle:distances(triangle),
        hexad:distances(hexad)
      };
    });

    const triangleSignature=rounds.map(r=>
      r.triangle.join("")
    ).join("|");

    const hexadSignature=rounds.map(r=>
      r.hexad.join("")
    ).join("|");

    // Dagelijkse enneagramtype-reeks,
    // inclusief de terugkeer na dag 36.
    const dailyTypes=days.map(day=>
      day.g===1 ? 9 : entry.types[day.g-2]
    );

    const dayTypeTransitions=dailyTypes.map((type,i)=>
      type+"→"+dailyTypes[(i+1)%36]
    );

    return {
      index,
      sequence:entry.types.join("→"),
      triangleSignature,
      hexadSignature,
      combinedSignature:
        triangleSignature+" / "+hexadSignature,
      dailyTypeSignature:dailyTypes.join(","),
      uniqueDailyTransitions:
        new Set(dayTypeTransitions).size
    };
  }

  const results=all.map(analyze);

  const unique = field =>
    new Set(results.map(r=>r[field])).size;

  const summary={
    mappings:results.length,
    uniqueTrianglePatterns:unique("triangleSignature"),
    uniqueHexadPatterns:unique("hexadSignature"),
    uniqueCombinedPatterns:unique("combinedSignature"),
    uniqueDailyTypeSequences:unique("dailyTypeSignature"),
    uniqueDailyTransitionCounts:[
      ...new Set(results.map(r=>r.uniqueDailyTransitions))
    ]
  };

  console.log("36-daagse dynamische vergelijking:");
  console.table([summary]);

  const groups={};

  for(const r of results) {
    const key=r.combinedSignature;

    if(!groups[key]) {
      groups[key]={
        count:0,
        indices:[]
      };
    }

    groups[key].count++;
    groups[key].indices.push(r.index);
  }

  console.log("Groepen met hetzelfde dynamische patroon:");
  console.table(
    Object.values(groups).map((g,i)=>({
      pattern:i+1,
      count:g.count,
      indices:g.indices.join(",")
    }))
  );

  return {days,transitions,results,summary,groups};
};


window.testSoulkinOuterRing = function() {
  const all = testSoulkinAllMappings().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];
  const g1 = ["001","011","010","000"];
  const ring = [9,1,2,3,4,5,6,7,8,9];

  const hamming = (a,b) =>
    [...a].filter((bit,i)=>bit!==b[i]).length;

  const mod = (n,m)=>(n%m+m)%m;

  function analyze(entry,index) {
    const typeToG={9:1};
    const typeToCode={};

    entry.types.forEach((type,i)=>{
      typeToG[type]=i+2;
      typeToCode[type]=codes[i];
    });

    const rounds=g1.map((g1code,round)=>{
      const lookup={...typeToCode,9:g1code};

      const distances=ring.slice(1).map((type,i)=>
        hamming(lookup[ring[i]],lookup[type])
      );

      return {
        round:round+1,
        distances,
        total:distances.reduce((a,b)=>a+b,0),
        directEdges:distances.filter(d=>d===1).length,
        zeroEdges:distances.filter(d=>d===0).length,
        signature:distances.join("")
      };
    });

    const positions=ring.slice(0,9).map(
      type=>typeToG[type]-1
    );

    const forwardSteps=positions.map((pos,i)=>
      mod(positions[(i+1)%9]-pos,9)
    );

    const backwardSteps=forwardSteps.map(d=>9-d);

    const shortest=forwardSteps.map(
      (d,i)=>Math.min(d,backwardSteps[i])
    );

    const chronologicalDistance=shortest.reduce(
      (a,b)=>a+b,0
    );

    const forwardAdjacent=forwardSteps.filter(
      d=>d===1
    ).length;

    const backwardAdjacent=backwardSteps.filter(
      d=>d===1
    ).length;

    return {
      index,
      sequence:entry.types.join("→"),
      ringSignature:rounds.map(
        r=>r.signature
      ).join("|"),
      totals:rounds.map(r=>r.total).join(","),
      directEdges:rounds.map(
        r=>r.directEdges
      ).join(","),
      zeroEdges:rounds.map(
        r=>r.zeroEdges
      ).join(","),
      chronologicalDistance,
      forwardAdjacent,
      backwardAdjacent,
      forwardSteps:forwardSteps.join(",")
    };
  }

  const results=all.map(analyze);

  const unique = field =>
    new Set(results.map(r=>r[field])).size;

  const summary={
    mappings:results.length,
    uniqueRingPatterns:unique("ringSignature"),
    uniqueChronologicalDistances:
      unique("chronologicalDistance"),
    uniqueForwardPatterns:unique("forwardSteps"),
    minChronologicalDistance:Math.min(
      ...results.map(r=>r.chronologicalDistance)
    ),
    maxForwardAdjacent:Math.max(
      ...results.map(r=>r.forwardAdjacent)
    ),
    maxBackwardAdjacent:Math.max(
      ...results.map(r=>r.backwardAdjacent)
    )
  };

  console.log("Volledige buitenring:");
  console.table([summary]);

  const byPattern={};

  for(const r of results) {
    const key=r.ringSignature;

    if(!byPattern[key]) {
      byPattern[key]={count:0,indices:[]};
    }

    byPattern[key].count++;
    byPattern[key].indices.push(r.index);
  }

  console.log("Binaire buitenringpatronen:");
  console.table(
    Object.values(byPattern).map((g,i)=>({
      pattern:i+1,
      count:g.count,
      indices:g.indices.join(",")
    }))
  );

  const distribution={};

  for(const r of results) {
    const key=r.chronologicalDistance;
    distribution[key]=(distribution[key]||0)+1;
  }

  console.log("Chronologische afstandsverdeling:");
  console.table(
    Object.entries(distribution).map(([distance,count])=>({
      distance:Number(distance),
      count
    })).sort((a,b)=>a.distance-b.distance)
  );

  return {results,summary,byPattern,distribution};
};


window.testSoulkinPairSymmetry = function() {
  const all = testSoulkinAllMappings().results;
  const outer = testSoulkinOuterRing().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  const g1 = ["001","011","010","000"];
  const ring = [9,1,2,3,4,5,6,7,8,9];

  const permutations = [
    [0,1,2],[0,2,1],[1,0,2],
    [1,2,0],[2,0,1],[2,1,0]
  ];

  const transforms=[];

  for(const axes of permutations) {
    for(let mask=0;mask<8;mask++) {
      const flips=[0,1,2].map(i=>(mask>>i)&1);

      const apply=code=>axes.map(
        (axis,i)=>String(Number(code[axis])^flips[i])
      ).join("");

      transforms.push({
        axes,flips,apply,
        preservesG1Set:g1.every(c=>g1.includes(apply(c))),
        preservesG1Exact:g1.every(c=>apply(c)===c)
      });
    }
  }

  function lookup(entry) {
    const result={};

    entry.types.forEach((type,i)=>{
      result[type]=codes[i];
    });

    return result;
  }

  function directedEdge(a,b) {
    return [...a].map((bit,i)=>{
      if(bit===b[i]) return "";
      return i+":"+bit+"→"+b[i];
    }).filter(Boolean).join("+") || "=";
  }

  function directedRing(entry) {
    const base=lookup(entry);

    return g1.map(g1code=>{
      const values={...base,9:g1code};

      return ring.slice(1).map((type,i)=>
        directedEdge(values[ring[i]],values[type])
      ).join("|");
    }).join(" / ");
  }

  const groups=new Map();

  outer.forEach((result,index)=>{
    const key=result.ringSignature;

    if(!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(index);
  });

  const pairs=[...groups.values()].filter(
    group=>group.length===2
  );

  const rows=pairs.map(([a,b],pairIndex)=>{
    const A=lookup(all[a]);
    const B=lookup(all[b]);

    const matches=transforms.filter(t=>
      Object.keys(A).every(type=>
        t.apply(A[type])===B[type]
      )
    );

    const sameDirected=
      directedRing(all[a])===directedRing(all[b]);

    const changedTypes=Object.keys(A).filter(
      type=>A[type]!==B[type]
    );

    return {
      pair:pairIndex+1,
      a,b,
      changedTypes:changedTypes.join(","),
      cubeSymmetries:matches.length,
      g1SetSymmetries:matches.filter(
        t=>t.preservesG1Set
      ).length,
      g1ExactSymmetries:matches.filter(
        t=>t.preservesG1Exact
      ).length,
      sameDirectedRing:sameDirected
    };
  });

  console.log("Paarsymmetrie:");
  console.table(rows);

  const summary={
    pairs:pairs.length,
    cubeEquivalent:rows.filter(
      r=>r.cubeSymmetries>0
    ).length,
    g1SetEquivalent:rows.filter(
      r=>r.g1SetSymmetries>0
    ).length,
    g1ExactEquivalent:rows.filter(
      r=>r.g1ExactSymmetries>0
    ).length,
    sameDirectedRing:rows.filter(
      r=>r.sameDirectedRing
    ).length,
    differentDirectedRing:rows.filter(
      r=>!r.sameDirectedRing
    ).length
  };

  console.log("Samenvatting:");
  console.table([summary]);

  const distribution={};

  for(const r of rows) {
    const key=r.changedTypes.split(",").length;
    distribution[key]=(distribution[key]||0)+1;
  }

  console.log("Aantal veranderde typen per paar:");
  console.table(
    Object.entries(distribution).map(([changed,count])=>({
      changed:Number(changed),
      count
    }))
  );

  return {pairs,rows,summary,distribution};
};


window.testSoulkinHistoricalPhases = function() {
  const all = testSoulkinAllMappings().results;

  const codes = [
    "001","101","011","111",
    "110","010","100","000"
  ];

  // Gronemeyers voorgestelde indeling
  const phases = [
    [2,3],
    [4,5,6],
    [7,8,9]
  ];

  const hamming = (a,b) =>
    [...a].filter((x,i)=>x!==b[i]).length;

  const rows = all.map((entry,index)=>{
    const typeToG = {9:1};
    const gToType = {1:9};

    entry.types.forEach((type,i)=>{
      typeToG[type]=i+2;
      gToType[i+2]=type;
    });

    const phaseTypes = phases.map(group=>
      group.map(g=>gToType[g])
    );

    const ring = [9,1,2,3,4,5,6,7,8];

    const phaseOfType = type => {
      const g=typeToG[type];
      if(g===1) return 0;
      if(g<=3) return 1;
      if(g<=6) return 2;
      return 3;
    };

    const phaseTransitions=ring.map((type,i)=>{
      const next=ring[(i+1)%9];
      return (
        phaseOfType(type)+"→"+
        phaseOfType(next)
      );
    });

    const internalHexad=[1,4,2,8,5,7,1];
    const internalTriangle=[9,3,6,9];

    const phaseChanges=path=>
      path.slice(1).filter((type,i)=>
        phaseOfType(type)!==phaseOfType(path[i])
      ).length;

    return {
      index,
      phase1:phaseTypes[0].join(","),
      phase2:phaseTypes[1].join(","),
      phase3:phaseTypes[2].join(","),
      ringPhaseChanges:phaseChanges(
        [...ring,ring[0]]
      ),
      hexadPhaseChanges:phaseChanges(internalHexad),
      trianglePhaseChanges:phaseChanges(internalTriangle),
      phasePattern:phaseTransitions.join("|")
    };
  });

  const summary={
    mappings:rows.length,
    uniquePhasePatterns:new Set(
      rows.map(r=>r.phasePattern)
    ).size,
    ringChangeValues:[
      ...new Set(rows.map(r=>r.ringPhaseChanges))
    ].sort((a,b)=>a-b),
    hexadChangeValues:[
      ...new Set(rows.map(r=>r.hexadPhaseChanges))
    ].sort((a,b)=>a-b),
    triangleChangeValues:[
      ...new Set(rows.map(r=>r.trianglePhaseChanges))
    ].sort((a,b)=>a-b)
  };

  console.log("Historische fasen:");
  console.table([summary]);

  const distributions={};

  for(const field of [
    "ringPhaseChanges",
    "hexadPhaseChanges",
    "trianglePhaseChanges"
  ]) {
    const counts={};
    for(const r of rows) {
      counts[r[field]]=(counts[r[field]]||0)+1;
    }
    distributions[field]=counts;

    console.log(field);
    console.table(
      Object.entries(counts).map(([changes,count])=>({
        changes:Number(changes),count
      })).sort((a,b)=>a.changes-b.changes)
    );
  }

  return {rows,summary,distributions,phases};
};


window.testSoulkinG9PeriodEnds = function() {
  const mod = (n,m) => ((n % m) + m) % m;

  const lord = (uinal,kin) => {
    const remainder = mod(2*uinal + kin,9);
    return remainder === 0 ? 9 : remainder;
  };

  const totalDays = (b,k,t,u,d) =>
    b*144000 + k*7200 + t*360 + u*20 + d;

  const cases = [
    [0,0,0,0,0],
    [0,0,0,0,1],
    [0,0,0,0,8],
    [0,0,0,0,9],
    [0,0,0,1,0],
    [0,0,1,0,0],
    [0,1,0,0,0],
    [1,0,0,0,0],
    [9,15,0,0,0],
    [13,0,0,0,0]
  ];

  const examples = cases.map(parts => {
    const [b,k,t,u,d] = parts;
    const days = totalDays(...parts);

    const expected = mod(days,9) || 9;
    const calculated = lord(u,d);

    return {
      longCount:parts.join("."),
      days,
      expected:"G"+expected,
      calculated:"G"+calculated,
      correct:expected===calculated
    };
  });

  const fullTun = [];

  for(let day=0;day<360;day++) {
    const u=Math.floor(day/20);
    const k=day%20;

    fullTun.push({
      day,
      g:lord(u,k),
      expected:mod(day,9)||9
    });
  }

  const mismatches = fullTun.filter(
    x=>x.g!==x.expected
  );

  const frequencies = Array.from(
    {length:9},(_,i)=>({
      g:"G"+(i+1),
      count:fullTun.filter(x=>x.g===i+1).length
    })
  );

  const endings = [
    ["Tun",360],
    ["Katun",7200],
    ["Baktun",144000],
    ["Piktun",2880000]
  ].map(([name,days])=>({
    period:name,
    days,
    remainder:mod(days,9),
    lord:"G"+(mod(days,9)||9)
  }));

  console.log("Controle Lange Telling:");
  console.table(examples);

  console.log("Verdeling binnen één tun:");
  console.table(frequencies);

  console.log("Periode-einden:");
  console.table(endings);

  const summary = {
    testedDays:360,
    mismatches:mismatches.length,
    allExamplesCorrect:examples.every(x=>x.correct),
    allPeriodEndsG9:endings.every(x=>x.lord==="G9"),
    everyLordOccurs40Times:
      frequencies.every(x=>x.count===40)
  };

  console.log("Samenvatting:");
  console.table([summary]);

  return {
    examples,
    fullTun,
    frequencies,
    endings,
    summary
  };
};


window.testSoulkin819Complete = function() {
  const names = [
    "Imix","Ik","Akbal","Kan","Chicchan",
    "Cimi","Manik","Lamat","Muluc","Oc",
    "Chuen","Eb","Ben","Ix","Men",
    "Cib","Caban","Etznab","Cauac","Ahau"
  ];

  const special = seal => {
    const result = [];

    if ([16,11,6,1].includes(seal))
      result.push("Venus");
    if ([15,9,3].includes(seal))
      result.push("Saturnus");
    if (seal === 2)
      result.push("Jupiter");
    if (seal === 1)
      result.push("Mars");

    return result;
  };

  const normal = day => {
    const result = [];

    if (day % 117 === 0) {
      result.push(
        day % 585 === 0 ? "Venus" : "Mercurius"
      );
    }

    if (day % 378 === 0)
      result.push("Saturnus");
    if (day % 399 === 0)
      result.push("Jupiter");
    if (day % 780 === 0)
      result.push("Mars");

    return result;
  };

  const rows = [];

  // 20 stations + het begin van de volgende ronde
  for (let station = 0; station <= 20; station++) {
    const day = station * 819;
    const seal = ((16 - station) % 20 + 20) % 20;

    const bijzondere = special(seal);
    const gewone = normal(day);

    const hasSpecial = bijzondere.length > 0;

    const zichtbaarGewoon = gewone.filter(planet => {
      if (planet === "Saturnus" ||
          planet === "Jupiter" ||
          planet === "Mars") {
        return false; // onderdrukt op elk 819-station
      }

      // Mercurius/Venus via de 117-dagenregel
      return !hasSpecial;
    });

    const onderdrukt = gewone.filter(
      planet => !zichtbaarGewoon.includes(planet)
    );

    rows.push({
      station,
      dag: day,
      werkveld: names[seal],
      specialePlaneet: bijzondere.join(" + ") || "—",
      gewonePlaneet: gewone.join(" + ") || "—",
      zichtbaarGewoon: zichtbaarGewoon.join(" + ") || "—",
      onderdrukt: onderdrukt.join(" + ") || "—",
      grootWerkveld: names[seal]
    });
  }

  console.log("819: volledige werkveldenronde");
  console.table(rows);

  const conflicts = rows.filter(
    r => r.onderdrukt !== "—"
  );

  console.log("Samenloop met onderdrukte planeet:");
  console.table(conflicts);

  const summary = {
    stations: 20,
    dagenPerRonde: 16380,
    uniekeWerkvelden: new Set(
      rows.slice(0,20).map(r => r.werkveld)
    ).size,
    sluitCorrect:
      rows[0].werkveld === rows[20].werkveld,
    samenloopStations: conflicts.length
  };

  console.table([summary]);

  return {rows,conflicts,summary};
};


window.zoekSoulkinG6 = async function({
  aantal = 100,
  vanafJaar = 1900,
  totJaar = 2000
} = {}) {

  if (!Number.isInteger(aantal) || aantal < 1 ||
      !Number.isInteger(vanafJaar) ||
      !Number.isInteger(totJaar) ||
      vanafJaar > totJaar) {
    throw new Error("Controleer aantal en jaartallen.");
  }

  // Soulkin-anker: 22 augustus 1982 = G9.
  // Gebruikt de bestaande Soulkin-kalenderfunctie.
  if (typeof soulkinCalendarG !== "function") {
    throw new Error("soulkinCalendarG ontbreekt.");
  }

  const query = `
    SELECT DISTINCT ?persoon ?persoonLabel ?geboorte ?artikel
    WHERE {
      ?persoon wdt:P31 wd:Q5;
               wdt:P569 ?geboorte.

      ?artikel schema:about ?persoon;
               schema:isPartOf <https://en.wikipedia.org/>.

      FILTER(YEAR(?geboorte) >= ${vanafJaar})
      FILTER(YEAR(?geboorte) <= ${totJaar})

      SERVICE wikibase:label {
        bd:serviceParam wikibase:language "nl,en".
      }
    }
    ORDER BY ?geboorte
    LIMIT ${Math.max(aantal * 20, 1000)}
  `;

  const endpoint = "https://query.wikidata.org/sparql";

  const response = await fetch(
    endpoint + "?query=" + encodeURIComponent(query),
    {
      headers: {
        Accept: "application/sparql-results+json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(
      "Wikidata-fout: HTTP " + response.status
    );
  }

  const data = await response.json();
  const kandidaten = [];

  for (const item of data.results.bindings) {
    const datum = item.geboorte.value;

    const match = datum.match(
      /^(\d{4})-(\d{2})-(\d{2})T/
    );

    if (!match) continue;

    const jaar = Number(match[1]);
    const maand = Number(match[2]);
    const dag = Number(match[3]);

    const G = soulkinCalendarG(jaar, maand, dag);

    if (G !== 6) continue;

    kandidaten.push({
      naam: item.persoonLabel.value,
      geboortedatum:
        `${match[1]}-${match[2]}-${match[3]}`,
      G: "G6",
      wikipedia: item.artikel.value,
      wikidata: item.persoon.value,
      geboortetijd: "Onbekend",
      enneagram: "Nog te onderzoeken"
    });

    if (kandidaten.length >= aantal) break;
  }

  console.table(kandidaten);
  console.log(
    "G6-kandidaten gevonden:",
    kandidaten.length
  );

  return kandidaten;
};
