## Usage

This action allows you to include a title check of a pull request automatically. This action only works on `pull_request` events.

To use it, add the following steps in your workflow:

```yaml
name: Jira Check
on:
  pull_request:
    types:
      - opened
      - synchronize
      - edited
      - reopened

jobs:
  publish:
    runs-on: ubuntu-18.04
    steps:
      - uses: g2crowd/action-check-pr-title@g2version
        with:
          regexp: '^((TRKINTEG|TRK|IN)-\d+|NOJIRA) ' # Regex the title should match
```
