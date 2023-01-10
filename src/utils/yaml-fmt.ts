import yaml from "js-yaml";
import fs from "fs";
import glob from "glob";
import { applyFmtFromJsonToYaml, SortOptions } from "./sort";

export { SortOptions };

// Get document, or throw exception on error
export const applySortFiles = async (
  globPaths: string,
  options?: SortOptions
) => {
  const files = glob.sync(globPaths).filter(filePath => fs.statSync(filePath).isFile());
  try {
    const promises = files.map((file) => {
      const doc: Record<string, any> = yaml.load(
        fs.readFileSync(file, "utf8"),
        { json: true }
      ) as Record<string, any>;
      const yamlStr = applyFmtFromJsonToYaml(doc, options);
      if (options?.dryRun) {
        process.stdout.write(yamlStr);
      } else {
        return fs.promises.writeFile(file, yamlStr);
      }
    });
    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }
};
