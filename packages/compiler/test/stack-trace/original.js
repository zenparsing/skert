function x() { throw new Error('!'); }

export { x };

export class C {
  constructor() { this.x = 1; }
  m() { this.t(); }
  t() { throw new Error('t'); }
}
