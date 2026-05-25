import type { AgenticaOperation } from "../context/AgenticaOperation";

export type AgenticaOperationLoadPolicy
  = | "always"
    | "summary"
    | "deferred"
    | "hidden";

export type AgenticaOperationIndexField
  = | "name"
    | "controller"
    | "function"
    | "description"
    | "parameter"
    | "schema"
    | "http"
    | "protocol"
    | "searchHint";

export interface AgenticaOperationIndexMetadata {
  searchHint?: string;
  loadPolicy?: AgenticaOperationLoadPolicy;
}

export interface AgenticaOperationIndexEntry {
  key: string;
  operation: AgenticaOperation;
  fields: Record<AgenticaOperationIndexField, string[]>;
  loadPolicy: AgenticaOperationLoadPolicy;
  schemaTokenEstimate: number;
  registryVersion: string;
}

export interface AgenticaOperationSearchOptions {
  topK?: number;
  minScore?: number;
}

export interface AgenticaOperationSearchResult {
  operation: AgenticaOperation;
  entry: AgenticaOperationIndexEntry;
  score: number;
  matchedFields: AgenticaOperationIndexField[];
  reason: string;
  direct: boolean;
}

export interface AgenticaOperationIndexProps {
  operations: AgenticaOperation[];
  registryVersion?: string;
  metadata?: (
    operation: AgenticaOperation,
  ) => AgenticaOperationIndexMetadata | undefined;
}

interface Query {
  directKeys: string[];
  requiredTerms: string[];
  terms: string[];
  compactPhrase: string;
}

interface ScoreState {
  score: number;
  matchedFields: Set<AgenticaOperationIndexField>;
}

const DEFAULT_TOP_K = 12;
const DEFAULT_MIN_SCORE = 0;

const FIELD_WEIGHTS: Record<AgenticaOperationIndexField, number> = {
  name: 22,
  function: 18,
  controller: 12,
  http: 15,
  searchHint: 20,
  description: 6,
  parameter: 5,
  schema: 3,
  protocol: 2,
};

const STOP_WORDS: ReadonlySet<string> = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export class AgenticaOperationIndex {
  public readonly entries: AgenticaOperationIndexEntry[];
  public readonly registryVersion: string;

  private readonly documentFrequency: Map<string, number>;

  public constructor(props: AgenticaOperationIndexProps) {
    this.registryVersion = props.registryVersion
      ?? computeRegistryVersion(props.operations);
    this.entries = props.operations
      .map(operation =>
        createEntry({
          operation,
          metadata: props.metadata?.(operation),
          registryVersion: this.registryVersion,
        }),
      )
      .filter(entry => entry.loadPolicy !== "hidden");
    this.documentFrequency = buildDocumentFrequency(this.entries);
  }

  public search(
    queryText: string,
    options?: AgenticaOperationSearchOptions,
  ): AgenticaOperationSearchResult[] {
    const query: Query = parseQuery(queryText);
    if (query.directKeys.length !== 0) {
      return this.searchDirect(query.directKeys, options);
    }
    if (query.terms.length === 0 && query.requiredTerms.length === 0) {
      return [];
    }

    const minScore: number = options?.minScore ?? DEFAULT_MIN_SCORE;
    const topK: number = options?.topK ?? DEFAULT_TOP_K;
    return this.entries
      .filter(entry => satisfiesRequiredTerms(entry, query.requiredTerms))
      .map(entry => this.score(entry, query))
      .filter(result => result.score > minScore)
      .sort(compareSearchResults)
      .slice(0, topK);
  }

  public estimateSchemaCharacters(): number {
    return this.entries.reduce(
      (sum, entry) => sum + entry.schemaTokenEstimate,
      0,
    );
  }

  public static tokenize(text: string): string[] {
    return tokenize(text);
  }

  private searchDirect(
    keys: string[],
    options?: AgenticaOperationSearchOptions,
  ): AgenticaOperationSearchResult[] {
    const entryMap: Map<string, AgenticaOperationIndexEntry> = new Map(
      this.entries.map(entry => [entry.key.toLowerCase(), entry]),
    );
    const topK: number = options?.topK ?? DEFAULT_TOP_K;
    return keys
      .map(key => entryMap.get(key.toLowerCase()))
      .filter((entry): entry is AgenticaOperationIndexEntry => entry !== undefined)
      .map(entry => ({
        operation: entry.operation,
        entry,
        score: Number.MAX_SAFE_INTEGER,
        matchedFields: ["name"],
        reason: `direct select:${entry.key}`,
        direct: true,
      } satisfies AgenticaOperationSearchResult))
      .slice(0, topK);
  }

  private score(
    entry: AgenticaOperationIndexEntry,
    query: Query,
  ): AgenticaOperationSearchResult {
    const state: ScoreState = {
      score: 0,
      matchedFields: new Set(),
    };
    const normalizedKey: string = compact(entry.key);
    const functionName: string = compact(getFunctionName(entry.operation));

    if (query.compactPhrase !== "") {
      if (
        normalizedKey === query.compactPhrase
        || functionName === query.compactPhrase
      ) {
        state.score += 10_000;
        state.matchedFields.add("name");
      }
      else if (
        normalizedKey.startsWith(query.compactPhrase)
        || functionName.startsWith(query.compactPhrase)
      ) {
        state.score += 2_500;
        state.matchedFields.add("name");
      }
    }

    const uniqueTerms: Set<string> = new Set([
      ...query.terms,
      ...query.requiredTerms,
    ]);
    for (const term of uniqueTerms) {
      const df: number = this.documentFrequency.get(term) ?? 0;
      const idf: number = Math.log(
        1 + (this.entries.length - df + 0.5) / (df + 0.5),
      );
      for (const field of Object.keys(FIELD_WEIGHTS) as AgenticaOperationIndexField[]) {
        const tokens: string[] = entry.fields[field];
        const exact: number = countExact(tokens, term);
        const prefix: number = countPrefix(tokens, term) - exact;
        if (exact !== 0) {
          state.score += FIELD_WEIGHTS[field] * idf * (1 + Math.log(exact));
          state.matchedFields.add(field);
        }
        if (prefix > 0) {
          state.score += FIELD_WEIGHTS[field] * idf * 0.35;
          state.matchedFields.add(field);
        }
      }
    }

    return {
      operation: entry.operation,
      entry,
      score: state.score,
      matchedFields: [...state.matchedFields].sort(),
      reason: describeMatch(state),
      direct: false,
    };
  }
}

function createEntry(props: {
  operation: AgenticaOperation;
  metadata: AgenticaOperationIndexMetadata | undefined;
  registryVersion: string;
}): AgenticaOperationIndexEntry {
  const operation = props.operation;
  const func = operation.function as unknown as Record<string, unknown>;
  const metadata: AgenticaOperationIndexMetadata = {
    ...readOperationMetadata(operation),
    ...props.metadata,
  };
  const parameterTexts: string[] = [];
  const schemaTexts: string[] = [];
  collectSchemaText(func.parameters, schemaTexts, parameterTexts);
  collectSchemaText(func.output, schemaTexts, []);

  const httpTexts: string[] = operation.protocol === "http"
    ? [
        String(func.method ?? ""),
        String(func.path ?? ""),
        ...readStringArray(func.tags),
      ]
    : [];
  const schemaJson: string = safeJsonStringify({
    parameters: func.parameters,
    output: func.output,
  });

  return {
    key: operation.name,
    operation,
    fields: {
      name: tokenize(operation.name),
      controller: tokenize(operation.controller.name),
      function: tokenize(getFunctionName(operation)),
      description: tokenize(String(func.description ?? "")),
      parameter: tokenize(parameterTexts.join(" ")),
      schema: tokenize(schemaTexts.join(" ")),
      http: tokenize(httpTexts.join(" ")),
      protocol: tokenize(operation.protocol),
      searchHint: tokenize(metadata.searchHint ?? ""),
    },
    loadPolicy: metadata.loadPolicy ?? "summary",
    schemaTokenEstimate: schemaJson.length + String(func.description ?? "").length,
    registryVersion: props.registryVersion,
  };
}

function readOperationMetadata(
  operation: AgenticaOperation,
): AgenticaOperationIndexMetadata {
  const operationRecord = operation as unknown as Record<string, unknown>;
  const functionRecord = operation.function as unknown as Record<string, unknown>;
  const metadata = {
    ...readMetadataObject(operationRecord.metadata),
    ...readMetadataObject(operationRecord["x-agentica"]),
    ...readMetadataObject(functionRecord.metadata),
    ...readMetadataObject(functionRecord["x-agentica"]),
  };
  return {
    searchHint: readString(
      metadata.searchHint
      ?? metadata.search
      ?? functionRecord.searchHint
      ?? functionRecord["x-agentica-search-hint"],
    ),
    loadPolicy: readLoadPolicy(
      metadata.loadPolicy
      ?? metadata.defer
      ?? metadata.projection
      ?? functionRecord.loadPolicy,
    ),
  };
}

function readMetadataObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? value as Record<string, unknown>
    : {};
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value
    : undefined;
}

function readLoadPolicy(value: unknown): AgenticaOperationLoadPolicy | undefined {
  return value === "always"
    || value === "summary"
    || value === "deferred"
    || value === "hidden"
    ? value
    : undefined;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((elem): elem is string => typeof elem === "string")
    : [];
}

function getFunctionName(operation: AgenticaOperation): string {
  return String((operation.function as { name?: unknown }).name ?? operation.name);
}

function collectSchemaText(
  value: unknown,
  schemaTexts: string[],
  parameterTexts: string[],
  seen: Set<unknown> = new Set(),
): void {
  if (value === null || value === undefined) {
    return;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    schemaTexts.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectSchemaText(item, schemaTexts, parameterTexts, seen);
    }
    return;
  }
  if (typeof value !== "object" || seen.has(value)) {
    return;
  }

  seen.add(value);
  const record: Record<string, unknown> = value as Record<string, unknown>;
  for (const [key, child] of Object.entries(record)) {
    schemaTexts.push(key);
    if (
      key === "description"
      || key === "title"
      || key === "summary"
      || key === "examples"
    ) {
      collectSchemaText(child, schemaTexts, parameterTexts, seen);
    }
    else if (key === "properties" && typeof child === "object" && child !== null) {
      for (const [property, propertySchema] of Object.entries(child)) {
        parameterTexts.push(property);
        collectSchemaText(propertySchema, schemaTexts, parameterTexts, seen);
      }
    }
    else {
      collectSchemaText(child, schemaTexts, parameterTexts, seen);
    }
  }
}

function parseQuery(text: string): Query {
  const directKeys: string[] = [];
  const withoutDirect: string = text.replace(
    /\bselect:(\S+)/gi,
    (_full, keys: string): string => {
      directKeys.push(
        ...keys
          .split(",")
          .map((key: string) => key.trim())
          .filter((key: string) => key !== ""),
      );
      return " ";
    },
  );
  const requiredTerms: string[] = Array.from(
    withoutDirect.matchAll(/(?:^|\s)\+(\S+)/g),
    match => match[1] ?? "",
  ).flatMap(tokenize);
  const terms: string[] = tokenize(
    withoutDirect.replace(/(?:^|\s)\+\S+/g, " "),
  );

  return {
    directKeys,
    requiredTerms: unique(requiredTerms),
    terms: unique(terms),
    compactPhrase: compact(withoutDirect),
  };
}

function compact(text: string): string {
  return tokenize(text).join("");
}

function tokenize(text: string): string[] {
  const spaced: string = text
    .normalize("NFKC")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_./:{}()[\],?&=#@|+-]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .toLowerCase();
  return unique(
    spaced
      .split(/\s+/)
      .map(token => token.trim())
      .filter(token => token.length >= 2 && STOP_WORDS.has(token) === false),
  );
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function buildDocumentFrequency(
  entries: AgenticaOperationIndexEntry[],
): Map<string, number> {
  const frequency: Map<string, number> = new Map();
  for (const entry of entries) {
    const terms: Set<string> = new Set(
      Object.values(entry.fields).flat(),
    );
    for (const term of terms) {
      frequency.set(term, (frequency.get(term) ?? 0) + 1);
    }
  }
  return frequency;
}

function satisfiesRequiredTerms(
  entry: AgenticaOperationIndexEntry,
  terms: string[],
): boolean {
  if (terms.length === 0) {
    return true;
  }
  const tokens: string[] = Object.values(entry.fields).flat();
  return terms.every(term => hasToken(tokens, term));
}

function countExact(tokens: string[], term: string): number {
  return tokens.filter(token => token === term).length;
}

function countPrefix(tokens: string[], term: string): number {
  if (term.length < 3) {
    return countExact(tokens, term);
  }
  return tokens.filter(token => token === term || token.startsWith(term)).length;
}

function hasToken(tokens: string[], term: string): boolean {
  return countPrefix(tokens, term) > 0;
}

function describeMatch(state: ScoreState): string {
  const fields: string = [...state.matchedFields].sort().join(", ");
  return fields === ""
    ? "no lexical match"
    : `matched ${fields} with score ${state.score.toFixed(3)}`;
}

function compareSearchResults(
  x: AgenticaOperationSearchResult,
  y: AgenticaOperationSearchResult,
): number {
  if (y.score !== x.score) {
    return y.score - x.score;
  }
  return x.operation.name.localeCompare(y.operation.name);
}

function computeRegistryVersion(operations: AgenticaOperation[]): string {
  return `fnv1a:${fnv1a(
    operations
      .map(operation => [
        operation.protocol,
        operation.controller.name,
        operation.name,
        getFunctionName(operation),
        String((operation.function as unknown as Record<string, unknown>).description ?? ""),
      ].join("\u001F"))
      .join("\u001E"),
  )}`;
}

function fnv1a(text: string): string {
  let hash = 0x811C9DC5;
  for (let i = 0; i < text.length; ++i) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? "";
  }
  catch {
    return "";
  }
}
