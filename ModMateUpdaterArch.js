let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()
let filePath = fm.joinPath(dir, "ModMate.js")

let file = args.shortcutParameter

fm.writeString(filePath, file)

Script.complete()
