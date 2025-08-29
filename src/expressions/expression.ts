export interface Expression {
  /**
   * Pretty-print the expression
   */
  print(): string;
  evaluate(): number;
}
