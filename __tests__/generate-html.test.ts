import generateHtml from "../src/generate-html";

describe("Generate HTML", () => {
  it(`returns a string`, () => {
    const result = generateHtml({});
    expect(result).toBeTruthy();
  });

  it(`contains background variable`, () => {
    const result = generateHtml({
      background: "{{name}}"
    });
    expect(result.includes("--background")).toBe(true);
  });

  it(`contains font color variable`, () => {
    const result = generateHtml({
      fontColor: "{{name}}"
    });
    expect(result.includes("--fontColor")).toBe(true);
  });

  it(`contains font size variable`, () => {
    const result = generateHtml({
      fontSize: "{{name}}"
    });
    expect(result.includes("--fontSize")).toBe(true);
  });

  it(`contains passed in title`, () => {
    const result = generateHtml({
      title: `{{name}}`
    });
    expect(result.includes("{{name}}")).toBe(true);
    expect(result.includes(`slot="title"`)).toBe(true);
  });
});
