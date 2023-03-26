import * as fs from "fs"
import * as path from "path"
import "whatwg-fetch"
import {filterFiles} from "./filter"
import {readDirectoryRecursively} from "./scanner"
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

export async function uploadAllFilesInFolder(
  client: S3Client,
  bucket: string,
  directory: string,
  acl: string,
  prefix: string = "",
  regex: string = "",
  verbose: boolean = false
) {
  // get list of files in the specified directory
  const files = readDirectoryRecursively(directory, verbose)
  if (files.length === 0) throw new Error(`Directory [${directory}] has no files in it!`)

  // and upload them one by one as a set of promises
  const promises = filterFiles(regex, ...files).map(file => {
    const absolute = path.join(directory, file)
    const content = fs.readFileSync(absolute)

    if (verbose) console.log(`Uploading ${file} => /${bucket}/${prefix}${file}`)

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `${prefix}${file}`,
      ACL: acl,
      Body: content,
    })

    const result = client.send(command)
    return new Promise<{filename: string; length: number}>((resolve, reject) => {
      result
        .then(r => {
          resolve({
            filename: file,
            length: content.length,
          })
        })
        .catch(e => {
          throw e // :)
        })
    })
  })

  // wait till all promises resolve
  ;(await Promise.all(promises)).map(r => {
    if (verbose) console.log(`Successfully uploaded ${r.filename}`)
  })

  return true
}
