import * as Sort from "./sort";

describe("applyFmtFromJsonToYaml", () => {
  it("sort using js-yaml without configuration", () => {
    const data = Sort.applyFmtFromJsonToYaml({
      properties: {
        id: {
          type: "number",
        },
        enum: ["b", "c", "a"],
        a: {
          type: "string",
        },
      },
    });
    expect(data).toEqual(
      `
properties:
  a:
    type: string
  enum:
    - b
    - c
    - a
  id:
    type: number
`.trimStart()
    );
  });

  it("sort with specified priority keys", () => {
    const data = Sort.applyFmtFromJsonToYaml(
      {
        properties: {
          id: {
            type: "number",
          },
          enum: ["b", "c", "a"],
          a: {
            type: "string",
          },
        },
      },
      {
        targets: {
          properties: ["id"],
        },
      }
    );
    expect(data).toEqual(
      `
properties:
  id:
    type: number
  a:
    type: string
  enum:
    - b
    - c
    - a
`.trimStart()
    );
  });

  it("sort specific array keys", () => {
    const data = Sort.applyFmtFromJsonToYaml(
      {
        properties: {
          id: {
            type: "number",
          },
          enum: ["b", "c", "a"],
          a: {
            type: "string",
          },
        },
      },
      {
        targets: {
          properties: ["id"],
          "properties.enum.[]": true,
        },
      }
    );
    expect(data).toEqual(
      `
properties:
  id:
    type: number
  a:
    type: string
  enum:
    - a
    - b
    - c
`.trimStart()
    );
  });

  it("sort specific array keys with prioritized", () => {
    const data = Sort.applyFmtFromJsonToYaml(
      {
        properties: {
          id: {
            type: "number",
          },
          enum: ["b", "c", "a"],
          a: {
            type: "string",
          },
        },
      },
      {
        targets: {
          properties: ["id"],
          "properties.enum.[]": ["b"],
        },
      }
    );
    expect(data).toEqual(
      `
properties:
  id:
    type: number
  a:
    type: string
  enum:
    - b
    - a
    - c
`.trimStart()
    );
  });

  it("sort specific keys with wild card", () => {
    const data = Sort.applyFmtFromJsonToYaml(
      {
        b: {
          target: {
            b: 1,
            a: 2,
          },
        },

        a: {
          target: {
            b: 1,
            a: 2,
          },
        },
      },
      {
        root: true,
        targets: {
          "*.target": true,
        },
      }
    );
    expect(data).toEqual(
      `
a:
  target:
    a: 2
    b: 1
b:
  target:
    a: 2
    b: 1
`.trimStart()
    );
  });
});
