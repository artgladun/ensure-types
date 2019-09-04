import { isString } from "lodash";
import { buildEnsurer, ensure, ensureArray, stringType } from "./ensure-types";

describe("types", () => {
  describe("buildEnsurer", () => {
    it("should return given value if predicate is true", () => {
      const stringChecker = buildEnsurer(isString)();
      expect(stringChecker("isString")).toEqual("isString");
    });

    it("should return default value when predicate is not ok", () => {
      const stringChecker = buildEnsurer(isString)("default");
      expect(stringChecker([])).toEqual("default");
    });

    it("should return undefined value when predicate is not ok and dafult values in not set", () => {
      const stringChecker = buildEnsurer(isString)();
      expect(stringChecker([])).toEqual(undefined);
    });
  });

  describe("ensure", () => {
    it("ensure should work", () => {
      const simpleConfig = {
        simple: stringType(""),
      };
      const simpleType = ensure(simpleConfig);
      const simpleArrayType = ensureArray(simpleType);

      const config = {
        name: stringType(""),
        arrayObj: ensureArray(simpleType),
        nestedObj: simpleType,
      };
      const testType = ensure(config);

      expect(
        testType({
          name: "name",
          arrayObj: [{ simple: "nested-name" }],
          nestedObj: { simple: "nested-name" },
        }),
      ).toEqual({
        name: "name",
        arrayObj: [{ simple: "nested-name" }],
        nestedObj: { simple: "nested-name" },
      });

      expect(
        testType({
          name: [],
          notDefinedInConfig: "not-defined",
          arrayObj: [{ simple: [], notDefinedInConfig: "not-defined" }],
          nestedObj: {
            simple: [],
            notDefinedInConfig: "not-defined",
          },
        }),
      ).toEqual({
        name: "",
        arrayObj: [{ simple: "" }],
        nestedObj: { simple: "" },
      });

      expect(testType()).toEqual({
        name: "",
        arrayObj: [],
        nestedObj: { simple: "" },
      });

      expect(simpleArrayType([{}, { simple: [] }])).toEqual([{ simple: "" }, { simple: "" }]);
    });
  });
});
