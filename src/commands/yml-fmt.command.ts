import { Command, CommandRunner, Option } from "nest-commander";
import path from "path";
import fs from "fs";
import { applySortFiles, SortOptions } from "../utils/yaml-fmt";

type YamlFmtCommandOptions = {
  config?: string;
} & Pick<SortOptions, "all" | "root" | "dryRun" | "indent">;

@Command({
  name: "fmt",
  description: `format yaml files specified by regexp`,
  arguments: "<regexp...>",
  argsDescription: {
    "<regexp...>": "zip files are unified into a directory",
  },
})
export class YamlFmtCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(targetFiles: string[], options: YamlFmtCommandOptions) {
    const { all, dryRun, root, indent, config: configPath } = options;
    const _configPath = configPath
      ? configPath.startsWith("/")
        ? configPath
        : path.resolve(process.cwd(), configPath)
      : "";

    const { targets, ...fromFile }: Partial<SortOptions> = (
      _configPath ? JSON.parse(fs.readFileSync(_configPath).toString()) : {}
    ) as Partial<SortOptions>;
    const results = targetFiles.map((files) => {
      return applySortFiles(files, {
        all: all ?? fromFile.all,
        dryRun,
        root: root ?? fromFile.root,
        indent: indent ?? fromFile.indent,
        targets,
      });
    });
    await Promise.all(results);
    console.log("done.");
  }

  @Option({
    flags: "-a --all",
    name: "all",
    description: "sort all object keys before applying configuration",
    defaultValue: false,
  })
  all(): boolean {
    return true;
  }

  @Option({
    flags: "-d --dry-run",
    name: "dryRun",
    description: "sort all object keys before applying configuration",
    defaultValue: false,
  })
  dryRun(): boolean {
    return true;
  }

  @Option({
    flags: "-r --root",
    name: "root",
    description: "sort all object keys before applying configuration",
    defaultValue: false,
  })
  forceFlag(): boolean {
    return true;
  }

  @Option({
    flags: "-i --indent",
    name: "indent",
    description: "output indent yaml",
    defaultValue: 2,
  })
  indent(arg: string): number {
    return parseInt(arg, 10);
  }

  @Option({
    flags: "-c --config <config>",
    name: "config",
    description: "sort config",
    defaultValue: undefined,
  })
  config(arg: string): string {
    return arg;
  }
}
