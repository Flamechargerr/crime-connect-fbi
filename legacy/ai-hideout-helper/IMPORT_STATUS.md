# ai-hideout-helper integration status

## Objective
Import and merge `ai-hideout-helper` features into this repository in a controlled way.

## Current blocker
- The referenced repository `Flamechargerr/ai-hideout-helper` is not accessible from this environment (GitHub API returns `404 Not Found`).
- Because repository cloning is disallowed in this environment, import must be performed via accessible GitHub API content or a user-provided export.

## Required input to continue
Provide one of:
1. Correct repository URL/owner/name if the reference changed.
2. Access permissions to the repository.
3. A source export (zip/tar) or feature inventory of `ai-hideout-helper`.

## Integration target location
When source is available, imported files should be staged under:
- `legacy/ai-hideout-helper/source/`

This keeps migration auditable and prevents accidental overwrite of production paths.

