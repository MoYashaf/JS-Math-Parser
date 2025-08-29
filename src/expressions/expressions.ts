import { Token, TokenKind } from "../tokens";
import { Expression } from "./expression";

export class LiteralExpression implements Expression {
  constructor(private literal: string) {}
  print(): string {
    return `${this.literal}`;
  }
  evaluate(): number {
    return parseFloat(this.literal);
  }
}

export class UnaryExpression implements Expression {
  constructor(private op: TokenKind, private right: Expression) {}
  print(): string {
    return `${this.op}${this.right.print()}`;
  }
  evaluate(): number {
    const r = this.right.evaluate();
    switch (this.op) {
      case TokenKind.MINUS:
        return -r;
      case TokenKind.SQRT:
        return Math.sqrt(r);
    }
    throw new Error(`Invalid Unary Operator: '${this.op}'`);
  }
}

export class BinaryExpression implements Expression {
  constructor(
    private left: Expression,
    private operator: TokenKind,
    private right: Expression
  ) {}
  print(): string {
    return `(${this.left.print()} ${this.operator} ${this.right.print()})`;
  }
  evaluate(): number {
    const l = this.left.evaluate();
    const r = this.right.evaluate();
    switch (this.operator) {
      case TokenKind.PLUS:
        return l + r;
      case TokenKind.MINUS:
        return l - r;
      case TokenKind.STAR:
        // case TokenKind.OPEN_PAREN:
        return l * r;
      case TokenKind.SLASH:
        return l / r;
      case TokenKind.CARET:
        return Math.pow(l, r);
      default:
        throw new Error(`Unknown operator: '${this.operator}'`);
    }
  }
}
