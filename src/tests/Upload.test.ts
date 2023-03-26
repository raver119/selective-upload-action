import {describe, test, expect, beforeAll, afterAll} from "@jest/globals"
import * as os from "os"
import * as path from "path"
import * as fs from "fs"
import {generateRandomFiles} from "./helpers"
import {randomUUID} from "crypto"
import {uploadAllFilesInFolder} from "../upload"
import {CreateBucketCommand, ListObjectsV2Command, S3Client} from "@aws-sdk/client-s3"
import {v4 as uuid} from "uuid"

let tempDir: string

beforeAll(() => {
  // generate random files in temp dir for the tests
  tempDir = path.join(os.tmpdir(), randomUUID())
  fs.mkdirSync(tempDir)
  generateRandomFiles(tempDir, 7, "css")
  generateRandomFiles(tempDir, 4, "js")
})

afterAll(() => {
  // remove temp dir so it doesn't pollute the system
  fs.rmSync(tempDir, {recursive: true})
})

describe("Upload", () => {
  const client = new S3Client({
    endpoint: "http://localhost:9090",
    region: "any",
    credentials: {
      accessKeyId: uuid(),
      secretAccessKey: uuid(),
    },
    forcePathStyle: true,
  })

  test("partial upload", async () => {
    const bucketName = uuid()
    await expect(client.send(new CreateBucketCommand({Bucket: bucketName}))).resolves.toBeDefined()

    await expect(uploadAllFilesInFolder(client, bucketName, tempDir, "", ".css$")).resolves.toStrictEqual(true)

    // validate the upload
    const list = await client.send(new ListObjectsV2Command({Bucket: bucketName}))

    expect(list.Contents?.length).toStrictEqual(7)
    for (const obj of list.Contents ?? []) {
      expect(obj.Key).toMatch(/\.css$/)
    }
  })

  test("upload everything", async () => {
    const bucketName = uuid()
    await expect(client.send(new CreateBucketCommand({Bucket: bucketName}))).resolves.toBeDefined()

    await expect(uploadAllFilesInFolder(client, bucketName, tempDir, "", "")).resolves.toStrictEqual(true)

    const list = await client.send(new ListObjectsV2Command({Bucket: bucketName}))

    expect(list.Contents?.length).toStrictEqual(11)
  })
})
