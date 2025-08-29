import { Expression } from "./expressions/expression";
import {
  BinaryExpression,
  LiteralExpression,
  UnaryExpression,
} from "./expressions/expressions";
import { Token, TokenKind } from "./tokens";

export class Parser {
  private current: number;
  constructor(private tokens: Token[]) {
    this.current = 0;
  }
  private getBindingPower(op: TokenKind): [number, number] {
    switch (op) {
      case TokenKind.PLUS:
      case TokenKind.MINUS:
        return [1.0, 1.1];
      case TokenKind.STAR:
      case TokenKind.SLASH:
        return [2.0, 2.1];
      case TokenKind.CARET:
        return [3.1, 3];
    }
    throw new Error(`Unrecognized operator: '${op}'`);
  }
  private next() {
    return this.tokens[this.current++];
  }
  private isAtEnd() {
    return this.current >= this.tokens.length;
  }
  private peek() {
    return this.tokens[this.current];
  }
  public parse(minBp: number = 0): Expression {
    let c = this.next();
    let lhs: Expression;

    // --- prefix case (just literals for now)
    switch (c.kind) {
      case TokenKind.NUMBER:
      case TokenKind.IDENT:
        if (this.peek().kind == TokenKind.OPEN_PAREN) {
          const rhs = this.parse(0);
          lhs = new BinaryExpression(
            new LiteralExpression(c.lexeme),
            TokenKind.STAR,
            rhs
          );
        } else {
          lhs = new LiteralExpression(c.lexeme);
        }
        break;
      case TokenKind.MINUS:
      case TokenKind.SQRT:
        const rhs = this.parse(3);
        lhs = new UnaryExpression(c.kind, rhs);
        break;
      case TokenKind.OPEN_PAREN:
        lhs = this.parse(0);
        if (this.next().kind != TokenKind.CLOSE_PAREN) {
          throw new Error("Group missing closing parenthesis ')'");
        }
        break;
      default:
        throw new Error(`Unexpected token in prefix position: '${c.kind}'`);
    }

    // --- infix loop
    while (!this.isAtEnd()) {
      const op = this.peek().kind;
      if (op === TokenKind.EOF) break;
      if (op === TokenKind.CLOSE_PAREN) break;

      let [lbp, rbp] = this.getBindingPower(op);

      if (lbp < minBp) break; // stop if operator precedence is too low

      this.next(); // consume operator
      let rhs = this.parse(rbp);
      lhs = new BinaryExpression(lhs, op, rhs);
    }
    return lhs;
  }
}
