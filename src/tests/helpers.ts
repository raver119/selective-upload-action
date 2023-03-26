import * as fs from "fs"
import * as path from "path"
import {v4 as uuid} from "uuid"

export function generateRandomFiles(folder: string, num: number, extension: string = "txt", content = "wow"): string[] {
  const result: string[] = []
  for (let i = 0; i < num; i++) {
    const name = `${uuid()}.${extension}`
    result.push(name)

    fs.writeFileSync(path.join(folder, name), content)
  }

  return result
}

export function putSpecificFiles(folder: string, content = "wow", ...files: string[]) {
  for (let file of files) {
    fs.writeFileSync(path.join(folder, file), content)
  }
}
