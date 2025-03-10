// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
const fm = FileManager.local();
const dir = fm.documentsDirectory();
const filePath = fm.joinPath(dir, "schedule.json");
const settingsPath = fm.joinPath(dir, "settings.json");

// Load existing schedule or initialize a new one
let schedule = fm.fileExists(filePath) ? JSON.parse(fm.readString(filePath)) : [];
let settings = fm.fileExists(settingsPath) ? JSON.parse(fm.readString(settingsPath)) : { backgroundColor: "255,255,255", textColor: "0,0,0" };


let secIdIndex;

let yorn;

async function checkForUpdate() {
    let fm = FileManager.iCloud();
    let dir = fm.documentsDirectory();
    let filePath = fm.joinPath(dir, "ModMate.js")
    let file = fm.readString(filePath)
  let url = "https://raw.githubusercontent.com/VeraBeraGT/ModMate/refs/heads/main/Schedule.js"
  let req = new Request(url)
  let json = await req.loadString()
  yorn = file == json
return yorn
}

async function askForUpdate() {
  let yorn = await checkForUpdate()
    let fm = FileManager.iCloud();
    let dir = fm.documentsDirectory();
    let filePath = fm.joinPath(dir, "ModMate.js")
    let file = fm.readString(filePath)
  let url = "https://raw.githubusercontent.com/VeraBeraGT/ModMate/refs/heads/main/Schedule.js"
  let req = new Request(url)
  let json = await req.loadString()
let alert = new Alert()
alert.tittle = "Update Available"
alert.message = "Would you like to install the Update?"
alert.addAction("Yes")
alert.addAction("No")

    if (yorn == false) {
      let response = await alert.present()
        if (response == 1) {
          await showMainMenu();
        } else {
        fm.writeString(filePath, json)  
        }
    }
    await showMainMenu()
    return file; json
}

async function showMainMenu() {
    let table = new UITable();
    table.showSeparators = true;
    
    let scheduleRow = new UITableRow();
    let scheduleButton = scheduleRow.addButton("📅 Open Schedule");
    scheduleRow.onSelect = async () => {
        await showMenu();
    };
    table.addRow(scheduleRow);
    
    let settingsRow = new UITableRow();
    let settingsButton = settingsRow.addButton("🎨 Edit Colors");
    settingsRow.onSelect = async () => {
        await editColors();
    };
    table.addRow(settingsRow);
    
    await table.present();
}

async function editColors() {
    let table = new UITable();
    table.showSeparators = true;
    
    let backRow = new UITableRow();
        let backButton = backRow.addButton("⬅ Back");
        backRow.onSelect = async () => {
            await showMainMenu();
        };
        table.addRow(backRow);
    
    let bgRow = new UITableRow();
    let txt = bgRow.addText("Background Color (Hex): " + settings.backgroundColor);
    txt.titleColor = new Color(settings.backgroundColor)
    bgRow.onSelect = async () => {
        let alert = new Alert();
        alert.title = "Edit Background Color";
        alert.addTextField("Hex", settings.backgroundColor);
        alert.addAction("Save");
        alert.addCancelAction("Cancel");
        let response = await alert.present();
        if (response != -1) {
            settings.backgroundColor = alert.textFieldValue(0).trim();
        }
        await editColors();
    };
    table.addRow(bgRow);
    
    let textRow = new UITableRow();
    let txt2 = textRow.addText("Text Color (Hex): " + settings.textColor);
    txt2.titleColor = new Color(settings.textColor)
    textRow.onSelect = async () => {
        let alert = new Alert();
        alert.title = "Edit Text Color";
        alert.addTextField("Hex", settings.textColor);
        alert.addAction("Save");
        alert.addCancelAction("Cancel");
        let response = await alert.present();
        if (response != -1) {
            settings.textColor = alert.textFieldValue(0).trim();
        }
        await editColors();
    };
    table.addRow(textRow);
    
    let saveRow = new UITableRow();
    let saveButton = saveRow.addButton("💾 Save Colors");
    saveRow.onSelect = async () => {
        fm.writeString(settingsPath, JSON.stringify(settings, null, 2));
        await showMainMenu();
    };
    table.addRow(saveRow);
    
    await table.present();
    
}
async function showMenu() {
    
    let table = new UITable();
    table.showSeparators = true;
    
    let backRow = new UITableRow();
        let backButton = backRow.addButton("⬅ Back");
        backRow.onSelect = async () => {
            await showMainMenu();
        };
        table.addRow(backRow);
    
    let addRow = new UITableRow();
    let addButton = addRow.addButton("➕ Add Class");
    addRow.onSelect = async () => {
        await addClass();
        await showMenu();
    };
    table.addRow(addRow);
    
    schedule.forEach((cls, index) => {
        let row = new UITableRow();
        row.addText(cls.name);
        row.onSelect = async () => { 
            //console.log(index)
            await editClass(index);
        };
        table.addRow(row);
    });
    
    await table.present();
    /*schedule.forEach = (index) => {
        secIdIndex = index;
    }*/
    fm.writeString(filePath, JSON.stringify(schedule, null, 2));
}

async function addClass() {
    let alert = new Alert();
    alert.title = "Enter Class Name";
    alert.addTextField();
    alert.addAction("OK");
    alert.addCancelAction("Cancel");
    
    let response = await alert.present();
    if (response == -1) return;
    
    let nameInput = alert.textFieldValue(0).trim();
    let name = isNaN(nameInput) ? nameInput : parseInt(nameInput, 10);
    if (!name) return;
    
    let newClass = {name, schedule: {}};
    for (let day of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) {
        newClass.schedule[day] = null;
    }
    schedule.push(newClass);
}

async function editClass(index) {
    let cls = schedule[index];
    
    let updateTable = async () => {
        let table = new UITable();

        let backRow = new UITableRow();
        let backButton = backRow.addButton("⬅ Back");
        backRow.onSelect = async () => {
            await showMenu();
        };
        table.addRow(backRow);
        
        let nameRow = new UITableRow();
        nameRow.addText("Class Name: " + cls.name);
        nameRow.onSelect = async () => {
            let alert = new Alert();
            alert.title = "Edit Class Name";
            alert.addTextField(cls.name.toString());
            alert.addAction("Save");
            alert.addCancelAction("Cancel");
            
            let response = await alert.present();
            if (response != -1) {
                let nameInput = alert.textFieldValue(0).trim();
                cls.name = isNaN(nameInput) ? nameInput : parseInt(nameInput, 10);
            }
            await updateTable();
        };
        table.addRow(nameRow);
        
        for (let day of Object.keys(cls.schedule)) {
            let row = new UITableRow();
            row.addText(`${day}: ${cls.schedule[day] !== null ? cls.schedule[day] : "Not Set"}`);
            row.onSelect = async () => {
                let alert = new Alert();
                alert.title = `Enter Mod for ${day}`;
                alert.addTextField(cls.schedule[day] !== null ? cls.schedule[day].toString() : "");
                alert.addAction("Save");
                alert.addCancelAction("Cancel");
                
                let response = await alert.present();
                if (response != -1) {
                    let modValue = alert.textFieldValue(0).trim();
                    cls.schedule[day] = modValue ? parseInt(modValue) : null;
                }
                await updateTable();
            };
            table.addRow(row);
        }
        
        
        let saveRow = new UITableRow();
        let saveButton = saveRow.addButton("💾 Save Changes");
        saveRow.onSelect = async () => {
            fm.writeString(filePath, JSON.stringify(schedule, null, 2))
            await showMenu()
        }
        table.addRow(saveRow)
        
        let deleteRow = new UITableRow();
        let deleteButton = deleteRow.addButton("🗑 Delete Class");
        deleteRow.onSelect = async () => {
            schedule.splice(index, 1);
            await showMenu();
        };
        table.addRow(deleteRow);
        
        await table.present();
    };
    
    await updateTable();
}

async function format() {
    
    let array = ["HomeRoom"]
    
    let num = -1;
    
    var find;
    var push;
    
    find = schedule.find(item => item.schedule.Monday === 1)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 2)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 3)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 4)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 5)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 6)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 7)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 8)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 9)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Monday === 10)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    
    array.push("HomeRoom")
    
    find = schedule.find(item => item.schedule.Tuesday === 1)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 2)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 3)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 4)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 5)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 6)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 7)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 8)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 9)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Tuesday === 10)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    
    array.push(" ")
    num = num + 1
    
    find = schedule.find(item => item.schedule.Wednesday === 1)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 2)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 3)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 4)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 5)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 6)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 7)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 8)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 9)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Wednesday === 10)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    
    array.push("HomeRoom")
    num = num + 1
    
    find = schedule.find(item => item.schedule.Thursday === 1)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 2)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 3)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 4)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 5)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 6)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 7)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 8)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 9)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Thursday === 10)
    push = find ? find.name : "Open Modd"
    num = num + 1
    array.push(push)
    
    array.push("HomeRoom")
    num = num + 1
    
    find = schedule.find(item => item.schedule.Friday === 1)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 2)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 3)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 4)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 5)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 6)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 7)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 8)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 9)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    find = schedule.find(item => item.schedule.Friday === 10)
    push = find ? find.name : "Open Mod"
    num = num + 1
    array.push(push)
    
    
    
    
    return array;
}

let txtclr = new Color(settings.textColor)
let bkgclr = new Color(settings.backgroundColor)

var now = new Date();
var dow = now.getDay();
// Homeroom
// Start Time 
let hrS = new Date();
hrS.setHours(8);
hrS.setMinutes(00);

// End Time
let hrE = new Date();
hrE.setHours(8);
hrE.setMinutes(10);


// Mod 1
// Start Time
let mod1S =  new Date();
mod1S.setHours(8);
mod1S.setMinutes(15);

// End Time
let mod1E = new Date();
mod1E.setHours(8);
mod1E.setMinutes(52);
// Mod 1 Wednesday
// Start Time
let mod1SW = new Date();
mod1SW.setHours(8);
mod1SW.setMinutes(10);

// End Time
let mod1EW = new Date();
mod1EW.setHours(8);
mod1EW.setMinutes(41);


// Mod 2
// Start Time
let mod2S = new Date();
mod2S.setHours(8);
mod2S.setMinutes(57);

// End Time
let mod2E = new Date();
mod2E.setHours(9);
mod2E.setMinutes(34);

// Mod 2 Wednesday
// Start Time
let mod2SW = new Date();
mod2SW.setHours(8);
mod2SW.setMinutes(46);

// End Time
let mod2EW = new Date();
mod2EW.setHours(9);
mod2EW.setMinutes(22);


// Mod 3
// Start Time
let mod3S = new Date();
mod3S.setHours(9);
mod3S.setMinutes(39);

// End Time
let mod3E = new Date();
mod3E.setHours(10);
mod3E.setMinutes(16);

// Mod 3 Wednesday
// Start Time
let mod3SW = new Date();
mod3SW.setHours(9);
mod3SW.setMinutes(27);

// End Time
let mod3EW = new Date();
mod3EW.setHours(10);
mod3EW.setMinutes(03);


// Mod 4
// Start Time
let mod4S = new Date();
mod4S.setHours(10);
mod4S.setMinutes(21);

// End Time
let mod4E = new Date();
mod4E.setHours(10);
mod4E.setMinutes(58);

// Mod 4 Wednesday
// Start Time
let mod4SW = new Date();
mod4SW.setHours(10);
mod4SW.setMinutes(08);

// End Time
let mod4EW = new Date();
mod4EW.setHours(10);
mod4EW.setMinutes(44);


// Mod 5
// Start Time
let mod5S = new Date();
mod5S.setHours(11);
mod5S.setMinutes(03);

// End Time
let mod5E = new Date();
mod5E.setHours(11);
mod5E.setMinutes(40);

// Mod 5 Wednesday
// Start Time
let mod5SW = new Date();
mod5SW.setHours(10);
mod5SW.setMinutes(49);

// End Time
let mod5EW = new Date();
mod5EW.setHours(11);
mod5EW.setMinutes(25);


// Mod 6
// Start Time
let mod6S = new Date();
mod6S.setHours(11);
mod6S.setMinutes(45);

// End Time
let mod6E = new Date();
mod6E.setHours(12);
mod6E.setMinutes(22);

// Mod 6 Wednesday
// Start Time
let mod6SW = new Date();
mod6SW.setHours(11);
mod6SW.setMinutes(30);

// End Time
let mod6EW = new Date();
mod6EW.setHours(12);
mod6EW.setMinutes(06);


// Mod 7
// Start Time
let mod7S = new Date();
mod7S.setHours(12);
mod7S.setMinutes(27);

// End Time
let mod7E = new Date();
mod7E.setHours(13);
mod7E.setMinutes(04);

// Mod 7 Wednesday
// Start Time
let mod7SW = new Date();
mod7SW.setHours(12);
mod7SW.setMinutes(11);

// End Time
let mod7EW = new Date();
mod7EW.setHours(12);
mod7EW.setMinutes(47);


// Mod 8
// Start Time
let mod8S = new Date();
mod8S.setHours(13);
mod8S.setMinutes(09);

// End Time
let mod8E = new Date();
mod8E.setHours(13);
mod8E.setMinutes(46);

// Mod 8 Wednesday
// Start Time
let mod8SW = new Date();
mod8SW.setHours(12);
mod8SW.setMinutes(52);

// End Time
let mod8EW = new Date();
mod8EW.setHours(13);
mod8EW.setMinutes(28);


// Mod 9
// Start Time
let mod9S = new Date();
mod9S.setHours(13);
mod9S.setMinutes(51);

// End Time
let mod9E = new Date();
mod9E.setHours(14);
mod9E.setMinutes(28);

// Mod 9 Wednesday
// Start Time
let mod9SW = new Date();
mod9SW.setHours(13);
mod9SW.setMinutes(33);

// End Time
let mod9EW = new Date();
mod9EW.setHours(14);
mod9EW.setMinutes(09);


// Mod 10
// Start Time
let mod10S = new Date();
mod10S.setHours(14);
mod10S.setMinutes(33);

// End Time
let mod10E = new Date();
mod10E.setHours(15);
mod10E.setMinutes(10);

// Mod 10 Wednesday
// Start Time
let mod10SW = new Date();
mod10SW.setHours(14);
mod10SW.setMinutes(14);

// End Time
let mod10EW = new Date();
mod10EW.setHours(14);
mod10EW.setMinutes(50);

var mods = await format()
var modStartTimes = ["8:00","8:15","8:57","9:39","10:21","11:03","11:45","12:27","13:09","13:51","14:33"];
var modEndTimes = ["8:10","8:52","9:34","10:16","10:58","11:40","12:22","13:04","13:46","14:28","15:10"];

var modStartTimesW = ["N/A","8:00","8:46","9:27","10:08","10:49","11:30","12:11","12:52","13:33","14:14"];
var modEndTimesW = ["N/A","8:41","9:22","10:03","10:44","11:25","12:06","12:47","13:28","14:09","14:50"];

// Retreve the mod number fo a specific time
function getModNum(n,d) {
  var m = -1
  if (hrS < n && n < hrE && d != 3) {
   m = 0 
  } else if (hrE < n && n < mod1S && d != 3) {
    m = 1
  } else if (mod1S <= n && n < mod1E && d != 3 || mod1SW <= n && n < mod1EW && d == 3) {
    m = 1
  } else if (mod1E <= n && n < mod2S && d != 3 || mod1EW <= n && n < mod2SW && d == 3) {
    m = 2
  } else if (mod2S <= n && n < mod2E && d != 3 || mod2SW <= n && n < mod2EW && d == 3) {
    m = 2
  } else if (mod2E <= n && n < mod3S && d != 3 || mod2EW <= n && n < mod3SW && d == 3) {
    m = 3
  } else if (mod3S <= n && n < mod3E && d != 3 || mod3SW <= n && n < mod3EW && d == 3) {
    m = 3
  } else if (mod3E <= n && n < mod4S && d != 3 || mod3EW <= n && n < mod4SW && d == 3) {
    m = 4
  } else if (mod4S <= n && n < mod4E && d != 3 || mod4SW <= n && n < mod4EW && d == 3) {
    m = 4
  } else if (mod4E <= n && n < mod5S && d != 3 || mod4EW <= n && n < mod5SW && d == 3) {
    m = 5
  } else if (mod5S <= n && n < mod5E && d != 3 || mod5SW <= n && n < mod5EW && d == 3) {
    m = 5
  } else if (mod5E <= n && n < mod6S && d != 3 || mod5EW <= n && n < mod6SW && d == 3) {
    m = 6
  } else if (mod6S <= n && n < mod6E && d != 3 || mod6SW <= n && n < mod6EW && d == 3) {
    m = 6
  } else if (mod6E <= n && n < mod7S && d != 3 || mod6EW <= n && n < mod7SW && d == 3) {
    m = 7
  } else if (mod7S <= n && n < mod7E && d != 3 || mod7SW <= n && n < mod7EW && d == 3) {
    m = 7
  } else if (mod7E <= n && n < mod8S && d != 3 || mod7EW <= n && n < mod8SW && d == 3) {
    m = 8
  } else if (mod8S <= n && n < mod8E && d != 3 || mod8SW <= n && n < mod8EW && d == 3) {
    m = 8
  } else if (mod8E <= n && n < mod9S && d != 3 || mod8EW <= n && n < mod9SW && d == 3) {
    m = 9
  } else if (mod9S <= n && n < mod9E && d != 3 || mod9SW <= n && n < mod9EW && d == 3) {
    m = 9
  } else if (mod9E <= n && n < mod10S && d != 3 || mod9EW <= n && n < mod1SW && d == 3) {
    m = 10
  }	else if (mod10S <= n && n < mod10E && d != 3 || mod10SW <= n && n < mod10EW && d == 3) {
    m = 10
  } else if (mod10E <= n && d != 3 || mod10EW <= n && d == 3) {
    m = 11
  } 
  return m
}

/* retrive the time that the mod starts at */
function getModStartTime(d,m) {
  var mod = "N/A";
  if (m > 10) {
    mod = " "
  } else {
    if (d == 3) {
      mod = modStartTimesW[m];
    } else {
      mod = modStartTimes[m];
    }
  }
  return mod;
}
// Retrive the time of the end of the current mod
function getModEndTime(d,m) {
  var mod = "N/A";
  if (m > 10) {
    mod = " "
  } else {  
    if (d == 3) {
      mod = modEndTimesW[m];
    } else {
      mod = modEndTimes[m];
    }
  }
  return mod;
}
// Format the mod num into a traceable number on the array
function accountForDOW(d,m) {
  if (d >= 3 && d <= 5) {
    if (d == 3) {
      var dt = d
    } else {
      var dt = d-1
    }
  var dw = ((d-1) * 10) + dt;
  var md = dw + m
  if (md >= 33 && d == 3 || md >= 44 && d == 4 || md >= 55 && d == 5) {
    var t = " "
  } else {
  t = mods[m + dw]; 
  }
  } else if (d == 2) {
    dw = 11
    var md = dw + m
    if (md > 22 && d == 2) {
      t = " "
    } else {
    t = mods[m + dw]
    }
  } else if (d > 5 || d == 0) {
    t = 1
  } else {  
    if(m > 10 && d == 1){
     t = " " 
    } else { 
    t = mods[m]
    }
  }
  return t
}
var blclr = new Color("000");
var wclr = new Color("fff");
var rclr = new Color("f00");
var pclr = new Color("f080f0");
var tealclr = new Color("0ff")
var gclr = new Color("00f");
var bclr = new Color("0f0");
async function createWidget() {
  let listWidget = new ListWidget()
  listWidget.backgroundColor = bkgclr
  
  var widgetPerm = listWidget.widgetParameter;
  
  if (config.widgetFamily == "medium") {
    var txt1Size = 20;
    var txt2Size = 20;
    var txt3Size = 10;
    
    let nextClass = listWidget.addText("Next Class: " + accountForDOW(dow, getModNum(now, dow) + 1));
  nextClass.font = Font.blackSystemFont(35);
  nextClass.centerAlignText();
  nextClass.textColor = txtclr
  
  } else if (config.runsInAccessoryWidget) {
    var txtSize = 10;
    
    let nextClass = listWidget.addText("Next Class: " + accountForDOW(dow, getModNum(now, dow) + 1));
  nextClass.font = Font.blackSystemFont(txtSize);
  nextClass.centerAlignText();
  nextClass.textColor = wclr
  
  let currentClassEndTime = listWidget.addText("Mod Ends at: " + getModEndTime(dow,getModNum(now,dow)));
  currentClassEndTime.font = Font.blackSystemFont(txtSize);
  currentClassEndTime.centerAlignText();
  currentClassEndTime.textColor = wclr
  
  } else if (config.widgetFamily == "extraLarge") {
    var bigText = 40;
    var txt1Size = 30;
    var txt2Size = 30;
    var txt3Size = 20;
    
  let currentClass = listWidget.addText("Current Class: " + accountForDOW(dow, getModNum(now, dow)));
  currentClass.font = Font.blackSystemFont(bigText);
  currentClass.centerAlignText();
  currentClass.textColor = txtclr;
  
  let mainStack = listWidget.addStack();
  mainStack.size = new Size(718,180);
  
  let leftStack = mainStack.addStack();
  leftStack.size = new Size(409,180);
  leftStack.centerAlignContent();
  
  let ncStack = leftStack.addStack();
  ncStack.size = new Size(409,180);
  ncStack.setPadding(20, 70, 0, 0)
  ncStack.layoutVertically();
  ncStack.centerAlignContent();
  
  let nextClass = ncStack.addText("Next Class: " + accountForDOW(dow, getModNum(now, dow) + 1));
  nextClass.font = Font.blackSystemFont(txt1Size);
  nextClass.centerAlignText();
  nextClass.textColor = txtclr
  
  ncStack.addSpacer(10)
  
  let currentClassEndTime = ncStack.addText("Mod Ends at: " + getModEndTime(dow,getModNum(now,dow)));
  currentClassEndTime.font = Font.blackSystemFont(txt1Size);
  currentClassEndTime.centerAlignText();
  currentClassEndTime.textColor = txtclr;
  
  let rightStack = mainStack.addStack();
  rightStack.size = new Size(309,180)
  rightStack.layoutVertically();
  rightStack.centerAlignContent();
  
  let textStack = rightStack.addStack();
  textStack.setPadding(0, 50, 0, 0) 
  textStack.size = new Size(309,60);
  textStack.centerAlignContent();
  textStack.layoutVertically();
  
  let text1 = textStack.addText("Up Next:");
  text1.font = Font.lightSystemFont(txt2Size);
  text1.textColor = txtclr
  
  let underline = textStack.addStack()
  underline.size = new Size(110,5)
  underline.backgroundColor = txtclr
  
  let rightinfoStack = rightStack.addStack();
  rightinfoStack.size = new Size(309,120);
  
  let timeStack = rightinfoStack.addStack();
  timeStack.size = new Size(100,120);
  timeStack.layoutVertically();
  //timeStack.setPadding(0, 20, 0, 0)
  //timeStack.borderColor = bclr;
  //timeStack.borderWidth = 2;
  
  let time1 = timeStack.addText(getModStartTime(dow, getModNum(now,dow) + 1));
  time1.font = Font.lightMonospacedSystemFont(txt3Size);
  time1.textColor = txtclr;
  
  let time2 = timeStack.addText(getModStartTime(dow, getModNum(now,dow) + 2));
  time2.font = Font.lightMonospacedSystemFont(txt3Size);
  time2.textColor = txtclr;
  
  let time3 = timeStack.addText(getModStartTime(dow, getModNum(now,dow) + 3));
  time3.font = Font.lightMonospacedSystemFont(txt3Size);
  time3.textColor = txtclr;
  
  let time4 = timeStack.addText(getModStartTime(dow, getModNum(now,dow) + 4));
  time4.font = Font.lightMonospacedSystemFont(txt3Size);
  time4.textColor = txtclr;
  
  let classStack = rightinfoStack.addStack();
  classStack.size = new Size(209,120);
  classStack.layoutVertically();
  
  let class1 = classStack.addText(accountForDOW(dow, getModNum(now,dow) + 1));
  class1.font = Font.lightMonospacedSystemFont(txt3Size);
  class1.textColor = txtclr;
  
  let class2 = classStack.addText(accountForDOW(dow, getModNum(now,dow) + 2));
  class2.font = Font.lightMonospacedSystemFont(txt3Size);
  class2.textColor = txtclr;
  
  let class3 = classStack.addText(accountForDOW(dow, getModNum(now,dow) + 3));
  class3.font = Font.lightMonospacedSystemFont(txt3Size);
  class3.textColor = txtclr;
  
  let class4 = classStack.addText(accountForDOW(dow, getModNum(now,dow) + 4));
  class4.font = Font.lightMonospacedSystemFont(txt3Size);
  class4.textColor = txtclr;
  
  }
  
  return listWidget;
}
let widget = await createWidget();
// let aWidget = await createAccessory()
if (config.runsInAccessoryWidget) {
   Script.setWidget(widget);
} else if (config.runsInWidget) {
  Script.setWidget(widget);
} else if (config.runsInApp) {
    format()
    await askForUpdate()
Script.complete()
} else {
  widget.presentExtraLarge()
}
