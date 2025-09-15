export const JsonUtil = {
  parse,
};

function parse(str: string) {
  const corrected = pipe(stripFirstBrace, correctMissingLastBrace)(str);
  return JSON.parse(corrected);
}

const pipe = (...fns: ((str: string) => string)[]) => (str: string) => fns.reduce((acc, fn) => fn(acc), str);

function stripFirstBrace(str: string) {
  if(RegExp("^{}.").test(str) === true) {
    return str.substring(2);
  }
  return str;
}

export function correctMissingLastBrace(input: string): string {
  const initial: ParseState = { s: "OUT", stack: [], line: 1, col: 0, edits: [] };

  const scanned = Array.from(input).reduce<ParseState>((ps, ch, i) => {
    const updated = ch === "\n"
      ? { ...ps, line: ps.line + 1, col: 0 }
      : { ...ps, col: ps.col + 1 };

    const tok = categorize(ch);
    const trans = (table[updated.s] as Record<Token, Transition>)?.[tok];
    return trans ? trans(updated, ch, i) : updated;
  }, initial);

  // Return original string if string is not closed (do not modify)
  if (scanned.s !== "OUT") return input;

  // Insert closing braces at the end for remaining open braces (LIFO)
  const withTail = scanned.stack.length === 0
    ? scanned
    : ((): ParseState => {
        const closers = scanned.stack.slice().reverse().map(e => closeOf[e.type]).join("");
        return {
          ...scanned,
          edits: [...scanned.edits, { op: "insert", index: input.length, text: closers }],
          stack: [],
        };
      })();

  return applyEditsImmutable(input, withTail.edits);
}

// Apply edits immutably
function applyEditsImmutable(src: string, edits: ReadonlyArray<Edit>): string {
  const sorted = [...edits].sort((a, b) => a.index - b.index);

  type Build = { out: string; cursor: number };
  const built = sorted.reduce<Build>((acc, e) => {
    const prefix = src.slice(acc.cursor, e.index);
    const acc1 = { out: acc.out + prefix, cursor: e.index };
    return e.op === "delete"
      ? { out: acc1.out,          cursor: acc1.cursor + 1 }
      : e.op === "replace"
      ? { out: acc1.out + e.text, cursor: acc1.cursor + 1 }
      : /* insert */ { out: acc1.out + e.text, cursor: acc1.cursor };
  }, { out: "", cursor: 0 });

  return built.out + src.slice(built.cursor);
}

const openOf = Object.freeze<Readonly<Record<BraceClose, BraceOpen>>>({ "}": "{", "]": "[" });
const closeOf = Object.freeze<Readonly<Record<BraceOpen, BraceClose>>>({ "{": "}", "[": "]" });

const categorize = (ch: string): Token => {
  switch (ch) {
    case '"': return "DQUOTE";
    case "\\": return "BSLASH";
    case "{": return "OCB";
    case "[": return "OSB";
    case "}": return "CCB";
    case "]": return "CSB";
    case "\n": return "NEWLINE";
    default: return "CHAR";
  }
}

type Transition = (ps: ParseState, ch: string, i: number) => ParseState;
type Table = Readonly<Partial<Record<StateName, Partial<Record<Token, Transition>>>>>;

const push = (ps: ParseState, type: BraceOpen, index: number): ParseState =>
  ({ ...ps, stack: [...ps.stack, { type, index }] });

const withEdit = (ps: ParseState, edit: Edit): ParseState =>
  ({ ...ps, edits: [...ps.edits, edit] });

const popOrFix = (ps: ParseState, closer: BraceClose, idx: number): ParseState =>
  ((): ParseState => {
    if (ps.stack.length === 0) {
      // Extra closing brace → delete
      return withEdit(ps, { op: "delete", index: idx });
    }
    const top = ps.stack[ps.stack.length - 1];
    if (top !== undefined && top.type !== openOf[closer]) {
      // Type mismatch → replace with expected value + pop
      const expected = closeOf[top.type];
      return withEdit({ ...ps, stack: ps.stack.slice(0, -1) }, { op: "replace", index: idx, text: expected });
    }
    // Normal matching → pop
    return { ...ps, stack: ps.stack.slice(0, -1) };
  })();

const table: Table = {
  OUT: {
    DQUOTE: (ps) => ({ ...ps, s: "IN" }),
    OCB:    (ps, _ch, i) => push(ps, "{", i),
    OSB:    (ps, _ch, i) => push(ps, "[", i),
    CCB:    (ps, _ch, i) => popOrFix(ps, "}", i),
    CSB:    (ps, _ch, i) => popOrFix(ps, "]", i),
  },
  IN: {
    BSLASH: (ps) => ({ ...ps, s: "ESC" }),
    DQUOTE: (ps) => ({ ...ps, s: "OUT" }),
  },
  ESC: {
    DQUOTE: (ps) => ({ ...ps, s: "IN" }),
    BSLASH: (ps) => ({ ...ps, s: "IN" }),
    OCB:    (ps) => ({ ...ps, s: "IN" }),
    OSB:    (ps) => ({ ...ps, s: "IN" }),
    CCB:    (ps) => ({ ...ps, s: "IN" }),
    CSB:    (ps) => ({ ...ps, s: "IN" }),
    CHAR:   (ps) => ({ ...ps, s: "IN" }),
    NEWLINE:(ps) => ({ ...ps, s: "IN" }),
  },
};

type StateName = "OUT" | "IN" | "ESC";
type BraceOpen = "{" | "[";
type BraceClose = "}" | "]";
type Token = "DQUOTE" | "BSLASH" | "OCB" | "OSB" | "CCB" | "CSB" | "NEWLINE" | "CHAR";

type StackEntry = { type: BraceOpen; index: number };
type Edit =
  | { op: "delete"; index: number }
  | { op: "replace"; index: number; text: string }
  | { op: "insert"; index: number; text: string };

type ParseState = {
  s: StateName;
  stack: ReadonlyArray<StackEntry>;
  line: number;
  col: number;
  edits: ReadonlyArray<Edit>;
};
