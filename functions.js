import fs from "fs/promises";

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


export async function isValidID(totest, allowedlength) {
  // Prüfen, ob der Wert eine Zahl ist und die angegebene Länge hat,
  // oder ob es sich um einen String handelt, der mit einer Ziffer von 1-9 beginnt und gefolgt von der entsprechenden Anzahl von Ziffern ist
  const numericalTest = typeof totest === 'number' && totest >= Math.pow(10, allowedlength - 1) && totest < Math.pow(10, allowedlength);
  const stringTest = typeof totest === 'string' && new RegExp(`^[1-9]\\d{${allowedlength - 1}}$`).test(totest);

  return numericalTest || stringTest;
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
