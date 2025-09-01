import { Token, TokenKind } from "./tokens";

export class Lexer {
  private source: string;
  private tokens: Token[];
  private start: number;
  private current: number;
  private line: number;
  private keywords: Record<string, TokenKind>;
  constructor(source: string) {
    this.source = source;
    this.tokens = new Array<Token>();
    this.start = 0;
    this.current = 0;
    this.line = 1;

    this.keywords = {
      pi: TokenKind.PI,
      e: TokenKind.E,
    };
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenKind.EOF, "", null, this.line));
    return this.tokens;
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private advance(): string {
    return this.source[this.current++]!;
  }
  private scanToken() {
    const c = this.advance();
    switch (c) {
      // Single-character tokens
      case "*":
        this.addToken(TokenKind.STAR); // Checkmate
        break;
      case "/":
        this.addToken(TokenKind.SLASH);
        break;
      case "=":
        this.addToken(TokenKind.EQUALS); // Promotion
        break;
      case "-":
        this.addToken(TokenKind.MINUS);
        break;
      case "+":
        this.addToken(TokenKind.PLUS);
        break;
      case "(":
        this.addToken(TokenKind.OPEN_PAREN);
        break;
      case ")":
        this.addToken(TokenKind.CLOSE_PAREN);
        break;
      case "^":
        this.addToken(TokenKind.CARET);
        break;
      case "$":
        this.addToken(TokenKind.SQRT);
        break;
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          console.error(
            "Unknown symbol at line " + this.line + " at " + this.current
          );
        }
        break;
    }
  }
  private number() {
    while (this.isDigit(this.peek())) this.advance();
    if (this.isDot(this.peek()) && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    this.addTokenWithLiteral(
      TokenKind.NUMBER,
      parseFloat(this.source.slice(this.start, this.current))
    );
  }
  private identifier() {
    while (this.isAlpha(this.peek())) this.advance();
    const text: string = this.source.slice(this.start, this.current);
    let type: TokenKind = this.keywords[text]!;
    if (type == undefined) type = TokenKind.IDENT;
    this.addTokenWithLiteral(type, text);
  }

  private addTokenWithLiteral(kind: TokenKind, literal: any) {
    const text = this.source.slice(this.start, this.current);
    this.tokens.push(new Token(kind, text, literal, this.line));
  }
  private addToken(kind: TokenKind) {
    this.addTokenWithLiteral(kind, null);
  }
  private match(
    expected: string /* Should be a single characeter pls */
  ): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] != expected) return false;
    this.current++;
    return true;
  }
  private isDigit(c: string) {
    return "0".charCodeAt(0) <= c.charCodeAt(0) &&
      c.charCodeAt(0) <= "9".charCodeAt(0)
      ? true
      : false;
  }
  private isDot(c: string) {
    return ".".charCodeAt(0) == c.charCodeAt(0);
  }
  private peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current]!;
  }
  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1]!;
  }
  private isAlpha(expected: string): boolean {
    return (
      ("a".charCodeAt(0) <= expected.charCodeAt(0) &&
        expected.charCodeAt(0) <= "z".charCodeAt(0)) ||
      ("A".charCodeAt(0) <= expected.charCodeAt(0) &&
        expected.charCodeAt(0) <= "Z".charCodeAt(0)) ||
      expected == "_" ||
      expected == "-"
    );
  }
  private isAlphaNumeric(expected: string) {
    return this.isAlpha(expected) || this.isDigit(expected);
  }
}
