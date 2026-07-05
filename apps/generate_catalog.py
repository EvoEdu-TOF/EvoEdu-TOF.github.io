#!/usr/bin/env python3

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "catalog.json"


def load_app_metadata(app_dir: Path) -> dict:
    metadata_path = app_dir / "app.json"
    if not metadata_path.exists():
        return {
            "slug": app_dir.name,
            "title": app_dir.name,
            "published": False,
            "visibility": "unclassified",
            "role": "No app.json metadata present yet.",
            "category": "unclassified",
            "entrypoint": "",
            "description": "",
            "legacy_names": [],
            "metadata_present": False,
        }

    data = json.loads(metadata_path.read_text())
    data.setdefault("slug", app_dir.name)
    data.setdefault("title", app_dir.name)
    data.setdefault("published", False)
    data.setdefault("visibility", "unclassified")
    data.setdefault("role", "")
    data.setdefault("category", "unclassified")
    data.setdefault("entrypoint", "")
    data.setdefault("description", "")
    data.setdefault("legacy_names", [])
    data["metadata_present"] = True
    return data


def main() -> None:
    apps = []
    for child in sorted(ROOT.iterdir()):
        if not child.is_dir():
          continue
        apps.append(load_app_metadata(child))

    published = [app for app in apps if app["published"]]
    internal = [app for app in apps if not app["published"]]

    payload = {
        "generated_from": str(ROOT),
        "published_count": len(published),
        "non_public_count": len(internal),
        "apps": apps,
    }

    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n")


if __name__ == "__main__":
    main()
