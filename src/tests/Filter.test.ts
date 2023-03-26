import {describe, test, expect} from "@jest/globals"
import {filterFiles} from "../filter"

describe("Filtering tests", () => {
  test("no filter", () => {
    expect(filterFiles("", "alpha.txt", "beta.css", "gamma.css")).toStrictEqual(["alpha.txt", "beta.css", "gamma.css"])
  })

  test("basic filtering", () => {
    expect(filterFiles(".css$", "alpha.txt", "beta.css", "gamma.css")).toStrictEqual(["beta.css", "gamma.css"])
  })

  test("negative filtering", () => {
    expect(filterFiles(`(?<!.css)$`, "alpha.txt", "beta.css", "gamma.css")).toStrictEqual(["alpha.txt"])
  })
})
