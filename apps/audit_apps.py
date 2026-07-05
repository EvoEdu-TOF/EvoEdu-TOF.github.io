#!/usr/bin/env python3

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parent

PUBLIC_APP_IMPLEMENTATIONS = {
    "allele-tracker": ["popg"],
    "gene-flow-mapper": ["landgen"],
    "life-cycle-modeler": ["popdyn"],
    "ecobalance": ["popdyn-predator-prey"],
    "climate-range-shifter": ["climate-range-shifter", "crs"],
    "shape-evolver": ["biomorphs"],
    "route-optimizer": ["tsp"],
    "network-builder": ["steiner"],
    "cumulative-selection-explorer": ["weasel"],
    "grid-world-survival": ["gw"],
    "literature-explorer": [],
}

EXTERNAL_SYSTEMS = {
    "literature-explorer": {
        "implementation": "/opt/www/dev/CiteGeist",
        "api": True,
        "tests": True,
        "notes": "External codebase with tests; public evo-edu surface is still only a placeholder."
    },
    "ecospecies": {
        "implementation": "/opt/www/dev/EcoSpecies-Atlas",
        "api": True,
        "tests": True,
        "notes": "Not in ./apps, but part of the evo-edu app portfolio and already has API and UI tests."
    },
}

APP_REPLACEMENT_NOTES = {
    "shape-evolver": {
        "replacement_runtime": "/apps/biomorphs/app.html",
        "reference_pattern": True,
        "notes": [
            "Current Shape Evolver route already points to the newer Biomorphs runtime.",
            "Biomorphs was explicitly tested for responsive behavior and richer learner/teacher support.",
            "Treat Biomorphs as a reference pattern for modernizing other legacy iframe-wrapped apps."
        ],
    }
}


def load_catalog() -> dict:
    return json.loads((ROOT / "catalog.json").read_text())


def load_role_walkthroughs() -> dict:
    path = ROOT / "role_walkthroughs.json"
    if not path.exists():
        return {}
    return json.loads(path.read_text())


def find_required_surface(appdir: Path, slug: str, kind: str) -> bool:
    expected = {
        "landing": [appdir / "index.html"],
        "application": [appdir / "launch.html", appdir / "index.html"],
        "study_guide": [
            appdir / "study-guide.html",
            appdir / "guide.html",
            appdir / "teachers-guide.html",
            appdir / "learners-guide.html",
        ],
        "curriculum_alignment": [
            appdir / "curriculum-alignment.html",
            appdir / "curriculum.html",
            appdir / "alignment.html",
        ],
        "teacher_guide": [
            appdir / "teacher-guide.html",
            appdir / "teachers-guide.html",
            appdir / "teacher.html",
        ],
        "standards": [
            appdir / "standards.html",
            appdir / "standards-alignment.html",
        ],
        "about": [
            appdir / "about.html",
            appdir / "provenance.html",
        ],
    }
    return any(path.exists() for path in expected[kind])


def surface_from_metadata(meta: dict, kind: str) -> bool:
    pages = meta.get("pages", {})
    page = pages.get(kind)
    if not page:
        return False
    relative = page.removeprefix("/apps/")
    return (ROOT / relative).exists()


def implementation_status(slug: str) -> dict:
    legacy_dirs = PUBLIC_APP_IMPLEMENTATIONS.get(slug, [])
    if not legacy_dirs:
        return {"legacy_dirs": [], "api": False, "tests": False}

    files = []
    api = False
    tests = False
    for legacy in legacy_dirs:
        appdir = ROOT / legacy
        if not appdir.exists():
            continue
        for path in appdir.rglob("*"):
            if path.is_file():
                files.append(path)
        api = api or any("api" in part.lower() for path in files for part in path.parts[-3:])
        tests = tests or any(
            path.name.startswith("test_") or "/tests/" in path.as_posix() or path.name.endswith(".spec.js")
            for path in files
        )
    return {"legacy_dirs": legacy_dirs, "api": api, "tests": tests}


def detect_application_model(appdir: Path) -> dict:
    application_paths = [
        appdir / "app" / "index.html",
        appdir / "launch.html",
        appdir / "webapp.html",
        appdir / "index.html",
    ]
    for path in application_paths:
        if not path.exists():
            continue
        raw = path.read_text(encoding="utf-8")
        return {
            "path": str(path.relative_to(ROOT)),
            "iframe_wrapper": "<iframe" in raw,
            "legacy_window_link": "Legacy hub" in raw or "Open in a full window" in raw,
        }
    return {"path": None, "iframe_wrapper": False, "legacy_window_link": False}


def metadata_status(meta: dict) -> dict:
    api_status = meta.get("api", {}).get("status")
    tests_status = meta.get("tests", {}).get("status")
    return {
        "api": api_status in {"prototype", "present", "available", "legacy-exempt"},
        "tests": tests_status in {"prototype", "present", "available", "legacy-exempt"},
    }


def remediation_wave(slug: str, has_api: bool, has_tests: bool, has_guides: bool, has_curriculum: bool) -> str:
    if slug in {"literature-explorer", "ecospecies"}:
        return "wave-2"
    if not has_api and not has_tests:
        return "wave-1"
    if not has_guides or not has_curriculum:
        return "wave-1"
    return "wave-3"


def main() -> None:
    catalog = load_catalog()
    role_walkthroughs = load_role_walkthroughs()
    rows = []
    summary = {
        "iframe_wrapped_apps": 0,
        "missing_teacher_guide": 0,
        "missing_standards_page": 0,
        "missing_about_page": 0,
        "not_learner_ready": 0,
        "apps_with_role_walkthroughs": 0,
    }
    for app in catalog["apps"]:
        if not app.get("published"):
            continue
        slug = app["slug"]
        appdir = ROOT / slug
        meta = {}
        app_json = appdir / "app.json"
        if app_json.exists():
            meta = json.loads(app_json.read_text())
        surface = {
            "landing": find_required_surface(appdir, slug, "landing") or surface_from_metadata(meta, "landing"),
            "application": find_required_surface(appdir, slug, "application") or surface_from_metadata(meta, "application"),
            "study_guide": find_required_surface(appdir, slug, "study_guide") or surface_from_metadata(meta, "study_guide"),
            "curriculum_alignment": find_required_surface(appdir, slug, "curriculum_alignment") or surface_from_metadata(meta, "curriculum_alignment"),
            "teacher_guide": find_required_surface(appdir, slug, "teacher_guide"),
            "standards": find_required_surface(appdir, slug, "standards"),
            "about": find_required_surface(appdir, slug, "about"),
        }
        impl = implementation_status(slug)
        meta_flags = metadata_status(meta)
        app_model = detect_application_model(appdir)
        row = {
            "slug": slug,
            "title": app["title"],
            "category": app.get("category"),
            "entrypoint": app.get("entrypoint"),
            "surface": surface,
            "implementation": impl,
            "application_model": app_model,
            "replacement": APP_REPLACEMENT_NOTES.get(slug),
            "external": EXTERNAL_SYSTEMS.get(slug),
        }
        effective_api = impl["api"] or meta_flags["api"] or bool(row["external"] and row["external"]["api"])
        effective_tests = impl["tests"] or meta_flags["tests"] or bool(row["external"] and row["external"]["tests"])
        row["remediation_wave"] = remediation_wave(
            slug,
            effective_api,
            effective_tests,
            surface["study_guide"],
            surface["curriculum_alignment"],
        )
        row["priority_notes"] = []
        if not surface["study_guide"]:
            row["priority_notes"].append("Missing teacher/learner study guide page.")
        if not surface["curriculum_alignment"]:
            row["priority_notes"].append("Missing curriculum alignment page.")
        if not surface["teacher_guide"]:
            row["priority_notes"].append("No clearly separate teacher guide identified.")
        if not surface["standards"]:
            row["priority_notes"].append("No standalone standards page identified.")
        if not surface["about"]:
            row["priority_notes"].append("No about/provenance page identified.")
        if not effective_api:
            row["priority_notes"].append("No exposed API layer identified.")
        if not effective_tests:
            row["priority_notes"].append("No test suite identified for the implementation.")
        if app_model["iframe_wrapper"]:
            row["priority_notes"].append("Application page is still an iframe wrapper over a legacy runtime.")
        if app_model["legacy_window_link"]:
            row["priority_notes"].append("Current application surface still relies on explicit legacy-window escape hatches.")
        if row["replacement"]:
            row["priority_notes"].extend(row["replacement"]["notes"])
        row["learner_ready"] = bool(
            surface["landing"]
            and surface["application"]
            and surface["study_guide"]
            and surface["curriculum_alignment"]
            and surface["about"]
            and not app_model["iframe_wrapper"]
        )
        if not row["learner_ready"]:
            row["priority_notes"].append("Does not yet meet the stronger learner-ready public contract.")
        rows.append(row)
        summary["iframe_wrapped_apps"] += int(app_model["iframe_wrapper"])
        summary["missing_teacher_guide"] += int(not surface["teacher_guide"])
        summary["missing_standards_page"] += int(not surface["standards"])
        summary["missing_about_page"] += int(not surface["about"])
        summary["not_learner_ready"] += int(not row["learner_ready"])

    reviewed_walkthroughs = []
    if role_walkthroughs:
        reviewed_walkthroughs = [
            app for app in role_walkthroughs.get("apps", [])
            if app.get("status") in {"seeded", "reviewed"}
        ]
        summary["apps_with_role_walkthroughs"] = len(reviewed_walkthroughs)

    output = {
        "generated_from": str(ROOT),
        "published_apps_audited": len(rows),
        "portfolio_findings": {
            "summary": summary,
            "reader_experience_findings": [
                "The platform catalog is more coherent than the actual app interiors.",
                "Several public application pages are still iframe wrappers over legacy runtimes.",
                "Teacher-facing and standards-facing support remains inconsistent across published apps.",
                "A public platform should not count as learner-ready merely because it launches."
            ],
            "role_walkthroughs": {
                "seed_reference_app": role_walkthroughs.get("summary", {}).get("seed_reference_app"),
                "artifact": "/apps/role_walkthroughs.json" if role_walkthroughs else None,
                "purpose": "Capture role-based walkthrough findings for students, casual learners, teachers, administrators, and scientists." if role_walkthroughs else None,
            },
        },
        "apps": rows,
    }
    (ROOT / "audit.json").write_text(json.dumps(output, indent=2) + "\n")

    lines = [
        "# evo-edu.org App Portfolio Audit",
        "",
        f"- Published apps audited: `{len(rows)}`",
        f"- iframe-wrapped legacy runtimes: `{summary['iframe_wrapped_apps']}`",
        f"- missing separate teacher guide: `{summary['missing_teacher_guide']}`",
        f"- missing standalone standards page: `{summary['missing_standards_page']}`",
        f"- missing about/provenance page: `{summary['missing_about_page']}`",
        f"- not yet learner-ready under the stronger contract: `{summary['not_learner_ready']}`",
        f"- role-walkthrough layer seeded: `{summary['apps_with_role_walkthroughs']}`",
        "",
        "## Reader-Experience Findings",
        "",
    ]
    for item in output["portfolio_findings"]["reader_experience_findings"]:
        lines.append(f"- {item}")
    if role_walkthroughs:
        lines.extend(
            [
                "",
                "## Role-Walkthrough Layer",
                "",
                "- Structural audits show which surfaces exist.",
                "- Role walkthroughs show whether those surfaces are actually usable for students, casual learners, teachers, administrators, and scientists.",
                f"- Seed role-walkthrough case: `{role_walkthroughs.get('summary', {}).get('seed_reference_app', 'unknown')}`",
                "- See `apps/role_walkthroughs.md` for the current detailed findings.",
            ]
        )
    lines.extend(["", "## App Findings", ""])

    for row in rows:
        lines.extend(
            [
                f"### {row['title']}",
                "",
                f"- Slug: `{row['slug']}`",
                f"- Category: `{row['category']}`",
                f"- Entrypoint: `{row['entrypoint']}`",
                f"- Remediation wave: `{row['remediation_wave']}`",
                f"- Learner-ready: `{'yes' if row['learner_ready'] else 'no'}`",
                f"- Application model: `{row['application_model']['path'] or 'unknown'}`",
                f"- iframe wrapper: `{'yes' if row['application_model']['iframe_wrapper'] else 'no'}`",
                f"- Legacy-window escape hatch: `{'yes' if row['application_model']['legacy_window_link'] else 'no'}`",
                "",
                "**Surface coverage**",
                "",
                f"- Landing page: `{'yes' if row['surface']['landing'] else 'no'}`",
                f"- Application page: `{'yes' if row['surface']['application'] else 'no'}`",
                f"- Study guide: `{'yes' if row['surface']['study_guide'] else 'no'}`",
                f"- Curriculum alignment: `{'yes' if row['surface']['curriculum_alignment'] else 'no'}`",
                f"- Teacher guide: `{'yes' if row['surface']['teacher_guide'] else 'no'}`",
                f"- Standards page: `{'yes' if row['surface']['standards'] else 'no'}`",
                f"- About/provenance page: `{'yes' if row['surface']['about'] else 'no'}`",
                "",
                "**Implementation status**",
                "",
                f"- Legacy dirs: `{', '.join(row['implementation']['legacy_dirs']) if row['implementation']['legacy_dirs'] else 'none'}`",
                f"- API identified: `{'yes' if row['implementation']['api'] or (row['external'] and row['external']['api']) else 'no'}`",
                f"- Tests identified: `{'yes' if row['implementation']['tests'] or (row['external'] and row['external']['tests']) else 'no'}`",
                "",
                "**Priority notes**",
                "",
            ]
        )
        if row["priority_notes"]:
            for note in row["priority_notes"]:
                lines.append(f"- {note}")
        else:
            lines.append("- None recorded.")
        lines.append("")

    (ROOT / "audit.md").write_text("\n".join(lines).rstrip() + "\n")


if __name__ == "__main__":
    main()
