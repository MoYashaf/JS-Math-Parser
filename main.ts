import { stdin, stdout } from "node:process";
import { Lexer } from "./src/lexer";
import { Parser } from "./src/parser";
import { createInterface } from "node:readline";

let rl = createInterface({
  input: stdin,
  output: stdout,
  prompt: "\x1b[32m" + "$" + "\x1b[0m" + " ",
});

rl.prompt();
rl.on("line", (input) => {
  if (input.trim() == "exit") {
    rl.close();
    process.exit();
  }
  try {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer.scanTokens());
    console.log(parser.parse().evaluate());
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
  rl.prompt();
});
