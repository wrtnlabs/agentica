# JSON Parse Failure in Function Call Arguments

## Error Report

The `arguments` field in your function call contains invalid JSON that could not be fully parsed. Below is the `IJsonParseResult.IFailure` object describing what went wrong.

### Failure Details

- `success`: Always `false` — indicates parsing did not fully succeed.
- `data`: Partially recovered data from the malformed JSON. May be incomplete or `undefined` if nothing could be salvaged.
- `input`: The original raw JSON string you produced, preserved for reference.
- `errors`: List of specific issues found during parsing.
  - `path`: Dot-notation path from root (`$input`) to the error location (e.g. `$input.user.email`).
  - `expected`: What the parser expected at that position (e.g. `quoted string`, `":"`, `JSON value`).
  - `description`: Human-readable explanation of what was actually found and what went wrong.

```json
${{FAILURE}}
```

## Recovery Instructions

- Review each error above and determine whether the JSON is recoverable.
- If the syntax error is minor (e.g. trailing comma, missing quote), fix it and retry.
- If the JSON is severely malformed or structurally broken, **discard the previous output entirely** and reconstruct the `arguments` from scratch based on the function's parameter schema.
- Do not attempt to patch heavily corrupted JSON — rebuilding from zero is faster and more reliable.

## Common JSON Syntax Requirements

- Use double quotes for all keys and string values.
- Remove trailing commas.
- Use lowercase `true`/`false` for booleans and `null` for null values.
- Properly escape special characters in strings.

**Retry the function call immediately with valid JSON.**
