function getAppBase() {
  const { pathname } = window.location;
  if (pathname === "/" || pathname === "/index.html") {
    return "";
  }
  if (pathname.endsWith("/index.html")) {
    return pathname.slice(0, -"/index.html".length);
  }
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

const apiBase = getAppBase().replace(/\/bibliography\.html$/, "");
const bibliographyList = document.querySelector("#bibliography-list");
const bibliographySearch = document.querySelector("#bibliography-search");
const bibliographyStatus = document.querySelector("#bibliography-status");
const bibliographyDownload = document.querySelector("#bibliography-download");
let currentBibliographyItems = [];

function resolveStaticApiPath(path) {
  const [route] = String(path || "").split("?");
  if (route === "/api/bibliography") {
    return "/api/bibliography/index.json";
  }
  return null;
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return { data: text ? JSON.parse(text) : {}, jsonOk: true };
  } catch (error) {
    return { data: { error: text || String(error) }, jsonOk: false };
  }
}

async function fetchJsonWithStaticFallback(path) {
  const response = await fetch(`${apiBase}${path}`);
  const { data, jsonOk } = await readJsonResponse(response);
  if (response.ok && jsonOk) {
    return { response, data, staticFallback: false };
  }

  const staticPath = resolveStaticApiPath(path);
  if (!staticPath) {
    return { response, data, staticFallback: false };
  }

  const staticResponse = await fetch(`${apiBase}${staticPath}`);
  const { data: staticData } = await readJsonResponse(staticResponse);
  return { response: staticResponse, data: staticData, staticFallback: staticResponse.ok };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeAbstractForDisplay(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  const temp = document.createElement("div");
  temp.innerHTML = raw;
  return temp.textContent
    .replace(/^abstract\s*[:.\-]?\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseBibtexFields(draftBibtex) {
  const fields = {};
  const text = String(draftBibtex || "");
  const pattern = /([a-zA-Z_]+)\s*=\s*\{([^}]*)\}/g;
  let match = pattern.exec(text);
  while (match) {
    fields[match[1].toLowerCase()] = match[2].trim();
    match = pattern.exec(text);
  }
  return fields;
}

function collectBibtexRecords(items) {
  const seen = new Set();
  const records = [];
  for (const item of items || []) {
    const draftBibtex = String(item && item.draft_bibtex ? item.draft_bibtex : "").trim();
    if (!draftBibtex || seen.has(draftBibtex)) {
      continue;
    }
    seen.add(draftBibtex);
    records.push(draftBibtex);
  }
  return records;
}

function downloadBibtexRecords(items, filenameStem) {
  const records = collectBibtexRecords(items);
  if (!records.length) {
    return false;
  }
  const blob = new Blob([`${records.join("\n\n")}\n`], { type: "application/x-bibtex;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenameStem}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}

function syncDownloadButton(items) {
  if (!bibliographyDownload) {
    return;
  }
  const recordCount = collectBibtexRecords(items).length;
  bibliographyDownload.disabled = !recordCount;
  bibliographyDownload.textContent = recordCount
    ? `Download BibTeX (${recordCount})`
    : "Download BibTeX";
}

function buildCitationText(item) {
  const fields = parseBibtexFields(item.draft_bibtex || "");
  if (item.normalized_text) {
    return escapeHtml(item.normalized_text);
  }
  const author = fields.author || "";
  const year = fields.year || "";
  const title = fields.title || "";
  const venue = fields.journal || fields.booktitle || fields.publisher || "";
  const volume = fields.volume || "";
  const issue = fields.number || "";
  const pages = fields.pages || "";
  const parts = [];
  const lead = [author, year ? `(${year})` : ""].filter(Boolean).join(" ");
  if (lead) {
    parts.push(lead);
  }
  if (title) {
    parts.push(title);
  }
  const venueBits = [venue, volume ? `${volume}${issue ? `(${issue})` : ""}` : issue ? `(${issue})` : "", pages]
    .filter(Boolean)
    .join(", ");
  if (venueBits) {
    parts.push(venueBits);
  }
  return escapeHtml(parts.join(". ").trim() || item.raw_text || "");
}

function renderSpeciesRefs(refs) {
  return refs
    .map(
      (ref) =>
        `<a href="./index.html#${escapeHtml(ref.slug)}">${escapeHtml(ref.common_name || ref.slug)}</a>`,
    )
    .join(", ");
}

function renderAbstractBlock(text) {
  const abstract = normalizeAbstractForDisplay(text);
  if (!abstract) {
    return "";
  }
  return `
    <div class="citation-abstract-shell">
      <button type="button" class="secondary-button citation-abstract-toggle" aria-expanded="false">
        Show Abstract
      </button>
      <div class="citation-abstract-display hidden">
        <p class="public-citation-abstract">${escapeHtml(abstract)}</p>
      </div>
    </div>
  `;
}

function attachCitationAbstractToggles(root) {
  for (const toggle of root.querySelectorAll(".citation-abstract-toggle")) {
    const shell = toggle.parentElement;
    const display = shell && shell.querySelector(".citation-abstract-display");
    if (!display) {
      continue;
    }
    toggle.addEventListener("click", () => {
      const hidden = display.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", hidden ? "false" : "true");
      toggle.textContent = hidden ? "Show Abstract" : "Hide Abstract";
    });
  }
}

function renderBibliography(items) {
  bibliographyList.innerHTML = "";
  if (!items.length) {
    bibliographyList.innerHTML = `<p class="editor-status">No bibliography entries match the current search.</p>`;
    return;
  }

  for (const item of items) {
    const links = [
      item.doi ? `<a href="https://doi.org/${encodeURIComponent(String(item.doi).replace(/^https?:\/\/doi\.org\//, ""))}" target="_blank" rel="noopener noreferrer">DOI</a>` : "",
      item.source_url ? `<a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener noreferrer">Source</a>` : "",
      item.openalex_id ? `<a href="https://openalex.org/${escapeHtml(String(item.openalex_id).replace(/^https?:\/\/openalex\.org\//, ""))}" target="_blank" rel="noopener noreferrer">OpenAlex</a>` : "",
    ]
      .filter(Boolean)
      .join(" · ");

    const article = document.createElement("article");
    article.className = "public-citation-entry";
    article.innerHTML = `
      <p class="public-citation-text">${buildCitationText(item)}</p>
      ${renderAbstractBlock(item.abstract_text || "")}
      <p class="public-citation-meta">
        Appears in ${item.species_count} species record${item.species_count === 1 ? "" : "s"}
        ${item.legacy_reference_numbers && item.legacy_reference_numbers.length ? ` • Imported references: ${item.legacy_reference_numbers.map((value) => escapeHtml(value)).join(", ")}` : ""}
      </p>
      <p class="public-citation-meta">Species: ${renderSpeciesRefs(item.species_refs || [])}</p>
      ${links ? `<p class="public-citation-links">${links}</p>` : ""}
    `;
    attachCitationAbstractToggles(article);
    bibliographyList.appendChild(article);
  }
}

async function loadBibliography(search = "") {
  bibliographyStatus.textContent = "Loading bibliography...";
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const { response, data, staticFallback } = await fetchJsonWithStaticFallback(`/api/bibliography${query}`);
  if (!response.ok) {
    bibliographyList.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load bibliography.")}</p>`;
    bibliographyStatus.textContent = data.error || "Bibliography load failed";
    return;
  }

  currentBibliographyItems = data.items || [];
  if (staticFallback && search) {
    const needle = search.toLowerCase();
    currentBibliographyItems = currentBibliographyItems.filter((item) => {
      return [
        item.normalized_text || "",
        item.raw_text || "",
        item.citation_key || "",
        item.doi || "",
        item.abstract_text || "",
        item.draft_bibtex || "",
      ].some((value) => String(value).toLowerCase().includes(needle));
    });
  }
  renderBibliography(currentBibliographyItems);
  syncDownloadButton(currentBibliographyItems);
  bibliographyStatus.textContent = `${currentBibliographyItems.length} bibliography entr${currentBibliographyItems.length === 1 ? "y" : "ies"}`;
}

bibliographySearch.addEventListener("input", async (event) => {
  await loadBibliography(event.target.value);
});

loadBibliography().catch((error) => {
  bibliographyList.innerHTML = `<p class="error">Failed to load bibliography: ${escapeHtml(String(error))}</p>`;
  bibliographyStatus.textContent = "Bibliography load failed";
});

if (bibliographyDownload) {
  bibliographyDownload.addEventListener("click", () => {
    const downloaded = downloadBibtexRecords(currentBibliographyItems, "ecospecies-bibliography");
    if (!downloaded) {
      bibliographyStatus.textContent = "No BibTeX records are available for download yet.";
    }
  });
}
