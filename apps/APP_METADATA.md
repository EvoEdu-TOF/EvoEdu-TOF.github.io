# App Metadata

Each top-level directory under `./apps` can include an `app.json` file to
describe whether the app is intended for public `evo-edu.org` navigation.

This is a lightweight publishing contract for site organization work. It is
not yet wired into automatic page generation, but it gives the project a clear
source of truth for:

- whether an app is published
- the public label
- the role the app plays on `evo-edu.org`
- the category it belongs to
- the primary entrypoint to launch

Suggested fields:

- `slug`: stable app slug
- `title`: public title
- `published`: whether it should appear in public `evo-edu.org` pages
- `visibility`: one of `public`, `internal`, `legacy`, `planned`
- `role`: short statement of the app's role on the site
- `category`: public grouping such as `population-genetics`, `ecology`, `artificial-life`, `research-support`
- `entrypoint`: primary launch path
- `description`: short public summary
- `legacy_names`: optional historical labels or implementation names

Recommended next fields for remediation work:

- `pages`: object describing required public surfaces:
  - `landing`
  - `application`
  - `study_guide`
  - `curriculum_alignment`
- `implementation`: object describing where the underlying runnable app lives
- `api`: object describing whether an API exists and where it is documented
- `tests`: object describing test coverage and how to run it
- `status`: object describing remediation state and publication readiness

For now:

- `cma` is intentionally not public
- `llm_learning` is intentionally not public

Future improvement:

- drive `/apps/` generation from these files instead of maintaining the public
  taxonomy manually

There is now a simple helper script:

- `generate_catalog.py`
- `generate_public_apps_page.py`
- `../generate_homepage.py`
- `audit_apps.py`

It scans all top-level app directories, reads `app.json` where present, and
writes a machine-readable summary to:

- `catalog.json`
- `audit.json`

The public `/apps/` page can now also be regenerated from metadata with:

```bash
python3 generate_catalog.py
python3 generate_public_apps_page.py
python3 ../generate_homepage.py
python3 audit_apps.py
```

That keeps the public app taxonomy tied to the `app.json` source of truth
instead of hand-maintained HTML alone, lets the homepage draw from the same
published app catalog, and provides a per-app remediation audit for the next
documentation/API/test pass.
