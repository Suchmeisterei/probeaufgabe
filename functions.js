import fs from "fs/promises";
import log from "./log.js";

export async function getTWUserIDFromPersonioID(per_id) {
    try {
      const data = await fs.readFile("./workers.json", "utf8");
      const workers = JSON.parse(data);
      const worker = workers.find(
        (worker) => worker.per_id === per_id.toString()
      );
      
      return worker ? Number(worker.tw_id) : null;
    } catch (error) {
      log.error("[functions] [getTWUserIDFromPersonioID] Fehler beim Lesen der Datei:", error);
      return null;
    }
}

export async function getWorkers() {
  try {
    const data = await fs.readFile("./workers.json", "utf8");
    const workers = JSON.parse(data);
    return workers;
  } catch (error) {
    log.error("[functions] [getWorkers] Fehler beim Lesen der Datei:", error);
    return null;
  }
}

export async function idMapping(id, toolFrom, toolTo) {
  try {
    const data = await fs.readFile("./workers.json", "utf8");
    const workers = JSON.parse(data);
    const worker = workers.find(
      (worker) => worker[toolFrom] === id.toString()
    );
    
    return worker ? worker[toolTo] : null;
  } catch (error) {
    log.error("[functions] [idMapping] Fehler beim Lesen der Datei:", error);
    return null;
  }
}

export async function getPersonioIDFromTWID(tw_id) {
    return per_id = await idMapping(tw_id, "tw_id", "per_id")
}

export async function correctCommaSeparatedIntegers(str) {
  if (typeof str !== 'string') {
    return false; // Nicht verarbeiten, wenn es kein String ist
  }
  // Entfernen aller Leerzeichen aus dem String
  const noSpaces = str.replace(/\s+/g, '');
  // Zerlegen des bereinigten Strings in ein Array von Substrings
  const substrings = noSpaces.split(',');

  let correctedArray = [];

  for (let i = 0; i < substrings.length; i++) {
      const num = parseInt(substrings[i]);

      // Überprüfen, ob der Substring eine Ganzzahl ist und dem ursprünglichen Substring entspricht
      if (!Number.isInteger(num) || num.toString() !== substrings[i]) {
          return false; // Nicht alle Substrings sind gültige Ganzzahlen
      }

      correctedArray.push(num.toString());
  }

  // Zusammenbauen und Rückgabe des korrigierten Strings
  return correctedArray.join(',');
}



/* 
Wandelt Produkttyp eines Hubspot Produkts/LineItems in einen Tag für Teamwork Projekte um.
*/
export async function productToTag(type){
  try {
    const data = await fs.readFile("./tag_lookup.json", "utf8");
    const tags = JSON.parse(data);
    const tag = tags.find(
      (tag) => tag.hs_product_type == type
    );
    return tag ? Number(tag.tw_tag_id) : '';
  } catch (error) {
    log.error("[teamwork] [productToTag] Fehler beim Lesen der Datei:", error);
    return '';
  }
}

/*
Funktion zum Schreiben von Daten in eine JSON Datei
*/
export async function saveDataToFile(data, filename) {
    // Konvertiere das JavaScript-Objekt in einen String im JSON-Format
    const jsonData = JSON.stringify(data, null, 2);
  
    // Schreibe die Daten in eine Datei
    fs.writeFile(filename, jsonData, "utf8", function (err) {
      if (err) {
        log.error("Ein Fehler ist beim Schreiben der Datei aufgetreten:", err);
      } else {
        log.success("Daten wurden erfolgreich in " + filename + " gespeichert.");
      }
    });
  }

/*
 Bsp: 69999.88976 => 69.999,89
*/
 export async function formatiereZahl(zahl) {
  // Runde die Zahl auf zwei Nachkommastellen
  const gerundeteZahl = Math.round(zahl * 100) / 100;

  // Konvertiere die Zahl in einen String und teile sie in Vorkommastellen und Nachkommastellen auf
  const [vorkommastellen, nachkommastellen] = gerundeteZahl.toFixed(2).split('.');

  // Füge Punkte für Tausendertrennung vor den Vorkommastellen ein
  const formatierteVorkommastellen = vorkommastellen.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Setze ein Komma vor die Nachkommastellen
  const formatierteNachkommastellen = `,${nachkommastellen}`;

  // Kombiniere Vorkommastellen und Nachkommastellen zu einem formatierten String
  const formatierterString = `${formatierteVorkommastellen}${formatierteNachkommastellen}`;

  return formatierterString;
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getLastNMonths(n) {
  const monate = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  let ergebnisArray = [];
  let heute = new Date();

  for (let i = 0; i < n; i++) {
    // Berechne das neue Datum, indem du Monate subtrahierst
    let datum = new Date(heute.getFullYear(), heute.getMonth() - i, 1);
    // Füge den formatierten String zum Ergebnis-Array hinzu
    ergebnisArray.push(`${monate[datum.getMonth()]} ${datum.getFullYear()}`);
  }

  // Da wir rückwärts gehen, kehre das Array um, um die Reihenfolge zu korrigieren
  return ergebnisArray;
}

export async function isValidID(totest, allowedlength) {
  // Prüfen, ob der Wert eine Zahl ist und die angegebene Länge hat,
  // oder ob es sich um einen String handelt, der mit einer Ziffer von 1-9 beginnt und gefolgt von der entsprechenden Anzahl von Ziffern ist
  const numericalTest = typeof totest === 'number' && totest >= Math.pow(10, allowedlength - 1) && totest < Math.pow(10, allowedlength);
  const stringTest = typeof totest === 'string' && new RegExp(`^[1-9]\\d{${allowedlength - 1}}$`).test(totest);

  return numericalTest || stringTest;
}

export async function newANumbers (x_toadd){
  if(!(x_toadd>0)) return;
  const data = await fs.readFile("../anumbers.json", "utf8");
  const anumbers = JSON.parse(data);
  var newnumbers = [];
  
  anumbers.sort();
  var lastnumber = anumbers[anumbers.length-1];
  for (let i=0; i< x_toadd; i++) {
    anumbers.push(parseInt(lastnumber)+i+1);
    newnumbers.push('A'+parseInt(lastnumber+i+1));
  }
  await fs.writeFile('../anumbers.json', JSON.stringify(anumbers), function (err) {
          if (err) return log(err.message)});
  return newnumbers;
  
}


export function splitArray(arr, chunkSize) {
  return Array.from({ length: Math.ceil(arr.length / chunkSize) }, (_, i) =>
    arr.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}

export function displayJSON(jsonObject) {
  try {
     
      // Funktion, um ein Objekt in HTML umzuwandeln
      function objectToHTML(obj) {
          let html = '<ul>';
          for (let key in obj) {
              if (obj.hasOwnProperty(key)) {
                  html += `<li><strong>${key}:</strong> `;
                  if (typeof obj[key] === 'object') {
                      html += objectToHTML(obj[key]); // Rekursiver Aufruf für verschachtelte Objekte
                  } else {
                      html += `${obj[key]}</li>`;
                  }
              }
          }
          html += '</ul>';
          return html;
      }

      // Konvertiere das JavaScript-Objekt in HTML
      const htmlString = objectToHTML(jsonObject);

      // Füge das HTML in das DOM ein
      return htmlString;
  } catch (error) {
      log.error("[functions] [displayJSON]",'Ungültiges JSON:', error.message);
  }
}

// returns entries of array1 that are not also included in array2
export async function differenceBetweenDateArrays(array1, array2) {
  return array1.filter(date => !array2.includes(date));
}

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m"
};

function log(...args) {
  console.log(new Date(), ...args);
}

function createColoredLogFunction(color) {
  return function(...args) {
      console.log(`${color}${new Date()}${colors.reset}`, ...args, colors.reset);
  };
}

log.success = createColoredLogFunction(colors.green);
log.error = createColoredLogFunction(colors.red);
log.info = createColoredLogFunction(colors.blue);
log.warning = createColoredLogFunction(colors.yellow);

export default log;



