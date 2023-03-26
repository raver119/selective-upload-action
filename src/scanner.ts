import * as fs from "fs"
import * as path from "path"

/**
 * This function scans given directly recursively, and return list of files relative to entry folder
 * @param directory
 * @returns list of file names, relative to the directoy
 */
export function readDirectoryRecursively(directory: string, verbose = false): string[] {
  if (verbose) console.log(`Current directory: ${process.cwd()}`)
  if (verbose) console.log(`Target directory: ${directory}`)
  if (!path.isAbsolute(directory)) {
    directory = path.join(process.cwd(), directory)
    if (verbose) console.log(`Updated directory: ${directory}`)
  }

  const prefix = directory.endsWith(path.sep) ? directory : `${directory}${path.sep}`

  // scan files recursively AND make paths relative
  return isDirectory(directory) ? _readDirectoryRecursively(directory).map(d => d.replace(prefix, "")) : [directory]
}

function _readDirectoryRecursively(directory: string, verbose = false): string[] {
  const result: string[] = []
  const initial = fs.readdirSync(directory)

  for (let entry of initial) {
    if (verbose) console.log(`Processing entry: ${entry}`)
    const absolute = path.join(directory, entry)
    if (isDirectory(absolute)) {
      result.push(..._readDirectoryRecursively(absolute))
    } else {
      result.push(absolute)
    }
  }

  return result
}

function isDirectory(path: string): boolean {
  const stats = fs.statSync(path)
  return stats.isDirectory()
}
