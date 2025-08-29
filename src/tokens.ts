export enum TokenKind {
  EOF = "EOF",
  IDENT = "Identifier",
  // STRING = "String",
  NUMBER = "Number",
  PLUS = "+",
  STAR = "*",
  MINUS = "-",
  SLASH = "/",
  EQUALS = "+",
  OPEN_PAREN = "(",
  CLOSE_PAREN = ")",
  CARET = "^",
  SQRT = "$",
}

export class Token {
  public kind: TokenKind;
  public lexeme: string;
  public literal: Object;
  public line: number;

  constructor(kind: TokenKind, lexeme: string, literal: any, line: number) {
    this.kind = kind;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
  }
}
