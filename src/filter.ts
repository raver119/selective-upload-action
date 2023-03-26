// This function filters the list of filenames based on the regex
export function filterFiles(regex: string, ...files: string[]): string[] {
  if (regex === "") return files

  return files.filter(f => (regex === "" ? true : new RegExp(regex, "g").test(f)))
}
