import { Module } from "@nestjs/common";
import { YamlFmtCommand } from "./commands/yml-fmt.command";

@Module({
  providers: [YamlFmtCommand],
})
export class CommandModule {}
