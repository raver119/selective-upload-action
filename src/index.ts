import * as core from "@actions/core"
import {uploadAllFilesInFolder} from "./upload"
import {S3Client} from "@aws-sdk/client-s3"

async function run() {
  const accessKey = core.getInput("key")
  const secret = core.getInput("secret")
  const endpoint = core.getInput("endpoint")
  const region = core.getInput("region") ?? "us-east-1"
  const bucket = core.getInput("bucket")
  const prefix = core.getInput("prefix") ?? ""
  const acl = core.getInput("acl") ?? "private"
  const pathStyle = core.getInput("path_style").toLowerCase() === "true"

  const directory = core.getInput("directory")
  const regex = core.getInput("regex")
  const verbose = core.getInput("verbose") === "true"

  // create S3 client
  const client = new S3Client({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secret,
    },
    forcePathStyle: pathStyle,
  })

  // upload all files to the remote S3 server
  await uploadAllFilesInFolder(client, bucket, directory, acl, prefix, regex, verbose)
}

// invoke action, fail if something's wrong
run().catch(e => {
  console.log(e)
  core.setFailed(`Action failed with exception: ${e.message}`)
})
