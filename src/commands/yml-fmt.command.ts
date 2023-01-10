import { Command, CommandRunner, Option } from "nest-commander";
import path from "path";
import { applySortFiles, SortOptions } from '../utils/yaml-fmt'

type YamlFmtCommandOptions = SortOptions

@Command({
  name: "yaml-fmt",
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

  async run(zipFiles: string[], options: YamlFmtCommandOptions) {
    const { force, archive, out } = options;

  }

  @Option({
    flags: "-o --out <out>",
    name: "out",
    description: "Output directory extartced to.",
    defaultValue: path.resolve(process.cwd(), "out"),
  })
  parseOut(arg: string): string {
    return arg;
  }

  @Option({
    flags: "-a --archive [archiveLevel]",
    name: "archiveLevel",
    description: "archive extracted files again.",
    defaultValue: null as any as number,
  })
  parseArchive(
    arg: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  ): number {
    return parseInt(arg, 10) ?? 9;
  }

  @Option({
    flags: "-f --force",
    name: "force",
    description:
      "force all zip files unified with overwriting duplicated files followed by one.",
    defaultValue: false,
  })
  forceFlag(): boolean {
    return true;
  }
}
