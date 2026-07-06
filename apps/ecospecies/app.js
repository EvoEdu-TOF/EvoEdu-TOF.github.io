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

function getInitialSpeciesSlug() {
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash || "";
}

const apiBase = getAppBase();

const speciesList = document.querySelector("#species-list");
const searchInput = document.querySelector("#search");
const archiveFilterGroup = document.querySelector("#archive-filter-group");
const detailEmpty = document.querySelector("#detail-empty");
const detail = document.querySelector("#detail");
const detailCode = document.querySelector("#detail-code");
const detailCommonName = document.querySelector("#detail-common-name");
const detailArchiveBadge = document.querySelector("#detail-archive-badge");
const detailArchiveNote = document.querySelector("#detail-archive-note");
const detailScientificName = document.querySelector("#detail-scientific-name");
const detailSummary = document.querySelector("#detail-summary");
const detailSections = document.querySelector("#detail-sections");
const legacyPanel = document.querySelector("#legacy-panel");
const legacySourceMeta = document.querySelector("#legacy-source-meta");
const legacySourceText = document.querySelector("#legacy-source-text");
const speciesCount = document.querySelector("#species-count");
const sectionCount = document.querySelector("#section-count");
const authTokenInput = document.querySelector("#auth-token");
const authSaveButton = document.querySelector("#auth-save");
const authClearButton = document.querySelector("#auth-clear");
const authStatus = document.querySelector("#auth-status");
const contributorEmailInput = document.querySelector("#contributor-email");
const contributorAgeGate = document.querySelector("#contributor-age-gate");
const contributorAgeLabel = document.querySelector("#contributor-age-label");
const contributorRegisterButton = document.querySelector("#contributor-register");
const contributorStatus = document.querySelector("#contributor-status");
const contributorCreateButton = document.querySelector("#contributor-create");
const accessPanel = document.querySelector("#access-panel");
const editorPanel = document.querySelector("#editor-panel");
const editorPublicationStatus = document.querySelector("#editor-publication-status");
const editorNotes = document.querySelector("#editor-notes");
const editorIsArchived = document.querySelector("#editor-is-archived");
const editorSaveButton = document.querySelector("#editor-save");
const editorStatus = document.querySelector("#editor-status");
const documentPanel = document.querySelector("#document-panel");
const documentMarkdown = document.querySelector("#document-markdown");
const documentPreview = document.querySelector("#document-preview");
const documentSaveButton = document.querySelector("#document-save");
const documentStatus = document.querySelector("#document-status");
const citationPanel = document.querySelector("#citation-panel");
const citationStatus = document.querySelector("#citation-status");
const citationList = document.querySelector("#citation-list");
const citationBackfillSpeciesButton = document.querySelector("#citation-backfill-species");
const citationEnrichAllButton = document.querySelector("#citation-enrich-all");
const citationMatchDialog = document.querySelector("#citation-match-dialog");
const citationMatchSeed = document.querySelector("#citation-match-seed");
const citationMatchCandidates = document.querySelector("#citation-match-candidates");
const citationMatchStatus = document.querySelector("#citation-match-status");
const citationMatchCloseButton = document.querySelector("#citation-match-close");
const auditPanel = document.querySelector("#audit-panel");
const auditList = document.querySelector("#audit-list");
const collapsibleToggles = document.querySelectorAll(".collapsible-toggle");

let currentItems = [];
let currentSlug = null;
let currentSession = null;
let currentArchiveFilter = "active";
let currentCitationMatch = null;
let currentSpeciesCitations = [];
let workflowPanelState = {
  "legacy-panel": false,
  "access-panel": false,
  "editor-panel": false,
  "document-panel": false,
  "citation-panel": false,
  "audit-panel": false,
};

function resolveStaticApiPath(path) {
  const [route] = String(path || "").split("?");
  if (route === "/api/auth/session") {
    return "/api/auth/session.json";
  }
  if (route === "/api/insights/summary") {
    return "/api/insights/summary.json";
  }
  if (route === "/api/species") {
    return "/api/species/index.json";
  }
  if (route.startsWith("/api/species/")) {
    const slug = route.slice("/api/species/".length).replace(/\/+$/, "");
    return slug ? `/api/species/${encodeURIComponent(slug)}.json` : null;
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

async function fetchJsonWithStaticFallback(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, options);
  const { data, jsonOk } = await readJsonResponse(response);
  if (response.ok && jsonOk) {
    return { response, data, staticFallback: false };
  }

  const staticPath = resolveStaticApiPath(path);
  if (!staticPath || (options.method && options.method !== "GET")) {
    return { response, data, staticFallback: false };
  }

  const staticResponse = await fetch(`${apiBase}${staticPath}`);
  const { data: staticData } = await readJsonResponse(staticResponse);
  return { response: staticResponse, data: staticData, staticFallback: staticResponse.ok };
}

function setCollapsibleState(panel, expanded) {
  if (!panel) {
    return;
  }
  panel.classList.toggle("collapsed", !expanded);
  const toggle = panel.querySelector(".collapsible-toggle");
  if (!toggle) {
    return;
  }
  const label = toggle.dataset.label || panel.dataset.label || "Section";
  toggle.textContent = `${expanded ? "Hide" : "Show"} ${label}`;
  toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  workflowPanelState[panel.id] = expanded;
}

function collapseWorkflowPanels() {
  [legacyPanel, accessPanel, editorPanel, documentPanel, citationPanel, auditPanel].forEach((panel) => {
    setCollapsibleState(panel, false);
  });
}

function expandCitationPanel() {
  setCollapsibleState(citationPanel, true);
}

function restoreWorkflowPanels() {
  [legacyPanel, accessPanel, editorPanel, documentPanel, citationPanel, auditPanel].forEach((panel) => {
    if (!panel || panel.classList.contains("hidden")) {
      return;
    }
    setCollapsibleState(panel, Boolean(workflowPanelState[panel.id]));
  });
}

function renderStructuredBody(body) {
  const trimmed = String(body || "").trim();
  if (!trimmed) {
    return "";
  }

  const paragraphs = trimmed
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => {
      const html = escapeHtml(paragraph).replace(/\n/g, "<br>");
      return `<p class="structured-node-body">${html}</p>`;
    })
    .join("");
}

function isCitationHeading(title) {
  const normalized = String(title || "").trim().replace(/:$/, "").toLowerCase();
  return [
    "reference numbers",
    "references",
    "reference",
    "citations",
    "citation",
    "bibliography",
    "related references",
    "related citations",
  ].includes(normalized);
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

function sanitizeFilenamePart(value, fallback = "records") {
  const cleaned = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || fallback;
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
  link.download = `${sanitizeFilenamePart(filenameStem)}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}

function buildPublicCitationText(item) {
  const fields = parseBibtexFields(item.draft_bibtex || "");
  if (item.normalized_text) {
    return escapeHtml(String(item.normalized_text));
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

  return escapeHtml(parts.join(". ").trim() || String(item.raw_text || ""));
}

function renderPublicCitationEntry(item) {
  const fields = parseBibtexFields(item.draft_bibtex || "");
  const meta = [
    item.legacy_reference_number ? `Imported reference ${escapeHtml(item.legacy_reference_number)}` : "",
    item.source_type === "editor_added_candidate" ? "Added citation" : "",
    item.source_type === "editor_selected_candidate" ? "Reviewed citation" : "",
  ]
    .filter(Boolean)
    .join(" • ");

  const links = [
    item.doi ? `<a href="https://doi.org/${encodeURIComponent(String(item.doi).replace(/^https?:\/\/doi\.org\//, ""))}" target="_blank" rel="noopener noreferrer">DOI</a>` : "",
    item.source_url ? `<a href="${escapeHtml(item.source_url)}" target="_blank" rel="noopener noreferrer">Source</a>` : "",
    item.openalex_id ? `<a href="https://openalex.org/${escapeHtml(String(item.openalex_id).replace(/^https?:\/\/openalex\.org\//, ""))}" target="_blank" rel="noopener noreferrer">OpenAlex</a>` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return `
    <article class="public-citation-entry">
      <p class="public-citation-text">${buildPublicCitationText(item)}</p>
      ${meta ? `<p class="public-citation-meta">${meta}</p>` : ""}
      ${links ? `<p class="public-citation-links">${links}</p>` : ""}
      ${renderCitationAbstractBlock(item.abstract_text || fields.abstract || "", false)}
    </article>
  `;
}

function buildPublicBibliographyMarkup(citations, filenameStem) {
  const records = collectBibtexRecords(citations);
  const downloadButton = `
    <div class="public-bibliography-actions">
      <button
        type="button"
        class="secondary-button bibliography-download-button"
        data-filename-stem="${escapeHtml(filenameStem)}"
        ${records.length ? "" : "disabled"}
      >
        Download BibTeX
      </button>
      <p class="public-bibliography-note">
        ${records.length ? `${records.length} BibTeX record${records.length === 1 ? "" : "s"} available for download.` : "No BibTeX records are available for download yet."}
      </p>
    </div>
  `;

  return Array.isArray(citations) && citations.length
    ? `${downloadButton}<div class="public-citation-list">${citations.map((item) => renderPublicCitationEntry(item)).join("")}</div>`
    : `${downloadButton}<p class="structured-node-body">No extracted bibliography entries are available yet.</p>`;
}

function renderStructuredNodes(nodes, container, citations, renderState = { renderedBibliography: false }) {
  for (const node of nodes || []) {
    const rawTitle = String(node.title || "").trim() || "Untitled section";
    const isCitationSection = isCitationHeading(rawTitle);
    if (isCitationSection && renderState.renderedBibliography) {
      continue;
    }

    const sectionEl = document.createElement("section");
    sectionEl.className = "detail-section structured-node";

    const depth = Number(node.depth || 2);
    const headingLevel = Math.min(6, Math.max(3, depth + 1));
    const title = escapeHtml(isCitationHeading(rawTitle) ? "Bibliography" : rawTitle);
    const body = String(node.body || "").trim();
    const children = Array.isArray(node.children) ? node.children : [];
    const citationMarkup = isCitationSection
      ? buildPublicBibliographyMarkup(citations, `${currentSlug || "ecospecies"}-bibliography`)
      : "";

    sectionEl.innerHTML = `
      <h${headingLevel}>${title}</h${headingLevel}>
      ${isCitationSection ? citationMarkup : renderStructuredBody(body)}
      ${children.length ? '<div class="structured-node-children"></div>' : ""}
    `;

    if (isCitationSection) {
      renderState.renderedBibliography = true;
    }

    if (children.length) {
      renderStructuredNodes(children, sectionEl.querySelector(".structured-node-children"), citations, renderState);
    }

    container.appendChild(sectionEl);
  }
}

function renderPrimaryContent(data) {
  detailSections.innerHTML = "";

  if (data.diagnostics.length) {
    const diagnosticsEl = document.createElement("section");
    diagnosticsEl.className = "detail-section detail-diagnostics";
    diagnosticsEl.innerHTML = `
      <h3>Ingest Diagnostics</h3>
      <ul class="diagnostic-list">
        ${data.diagnostics
          .map(
            (diagnostic) =>
              `<li><strong>${escapeHtml(diagnostic.code)}</strong>: ${escapeHtml(diagnostic.message)}</li>`,
          )
          .join("")}
      </ul>
    `;
    detailSections.appendChild(diagnosticsEl);
  }

  const structuredNodes =
    data.structured_document &&
    data.structured_document.ast &&
    Array.isArray(data.structured_document.ast.nodes)
      ? data.structured_document.ast.nodes.filter(
          (node) => String(node.title || "").trim().toLowerCase() !== "summary",
        )
      : [];

  if (structuredNodes.length) {
    renderStructuredNodes(structuredNodes, detailSections, data.citations || [], { renderedBibliography: false });
    attachCitationToggleControls(detailSections);
    const downloadButton = detailSections.querySelector(".bibliography-download-button");
    if (downloadButton) {
      downloadButton.addEventListener("click", () => {
        const downloaded = downloadBibtexRecords(data.citations || [], `${data.slug || currentSlug || "ecospecies"}-bibliography`);
        const note = detailSections.querySelector(".public-bibliography-note");
        if (note && !downloaded) {
          note.textContent = "No BibTeX records are available for download yet.";
        }
      });
    }
    return;
  }

  for (const section of data.sections) {
    const sectionEl = document.createElement("section");
    sectionEl.className = "detail-section";
    sectionEl.innerHTML = `
      <h3>${escapeHtml(section.heading)}</h3>
      <pre>${escapeHtml(section.content)}</pre>
    `;
    detailSections.appendChild(sectionEl);
  }
}

function renderLegacySource(data) {
  const legacySource = data.legacy_source;
  const hasLegacySource = Boolean(legacySource && String(legacySource.text || "").trim());
  legacyPanel.classList.toggle("hidden", !hasLegacySource);
  if (!hasLegacySource) {
    legacySourceMeta.textContent = "";
    legacySourceText.textContent = "";
    return;
  }

  legacySourceMeta.textContent = legacySource.source_file
    ? `Original imported file: ${legacySource.source_file}`
    : "Original imported legacy material";
  legacySourceText.textContent = String(legacySource.text || "");
}

function getAuthToken() {
  return window.localStorage.getItem("ecospecies_auth_token") || "";
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function escapeHtml(value) {
  return value
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

function parseMarkdownFrontMatter(markdown) {
  const stripped = markdown.trimStart();
  if (!stripped.startsWith("---\n")) {
    return { metadata: {}, body: markdown };
  }

  const remainder = stripped.slice(4);
  const separatorIndex = remainder.indexOf("\n---\n");
  if (separatorIndex === -1) {
    return { metadata: {}, body: markdown };
  }

  const metadataBlock = remainder.slice(0, separatorIndex);
  const body = remainder.slice(separatorIndex + 5);
  const metadata = {};

  for (const line of metadataBlock.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    if (key) {
      metadata[key] = value;
    }
  }

  return { metadata, body };
}

function renderDocumentPreview(markdown) {
  const { metadata, body } = parseMarkdownFrontMatter(markdown);
  const headings = body
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,6})\s+(.+?)\s*$/);
      if (!match) {
        return null;
      }
      return {
        depth: match[1].length,
        title: match[2].trim(),
      };
    })
    .filter(Boolean);

  if (!headings.length && !Object.keys(metadata).length) {
    documentPreview.innerHTML = `<p class="document-preview-empty">No headings detected yet.</p>`;
    return;
  }

  const metadataItems = Object.entries(metadata)
    .map(([key, value]) => `<li><strong>${escapeHtml(key)}</strong>: ${escapeHtml(value)}</li>`)
    .join("");

  const headingItems = headings
    .map(
      (heading) =>
        `<li style="margin-left:${Math.max(0, heading.depth - 2) * 18}px">${escapeHtml(heading.title)}</li>`,
    )
    .join("");

  documentPreview.innerHTML = `
    ${metadataItems ? `<ul class="document-preview-metadata">${metadataItems}</ul>` : ""}
    ${headingItems ? `<ol class="document-preview-list">${headingItems}</ol>` : '<p class="document-preview-empty">No headings detected yet.</p>'}
  `;
}

function renderCitationList(items, editable) {
  citationList.innerHTML = "";
  if (!items.length) {
    citationList.innerHTML = `<p class="editor-status">No citations have been extracted yet.</p>`;
    return;
  }

  for (const item of items) {
    const article = document.createElement("article");
    article.className = "citation-entry";

    const readOnlyMeta = [
      item.section_heading ? `Section: ${escapeHtml(item.section_heading)}` : "",
      item.legacy_reference_number
        ? `Legacy reference: ${escapeHtml(item.legacy_reference_number)}`
        : "",
      item.source_type ? `Source: ${escapeHtml(item.source_type)}` : "",
      item.enrichment_status ? `Enrichment: ${escapeHtml(item.enrichment_status)}` : "",
    ]
      .filter(Boolean)
      .join(" • ");

    if (!editable) {
      article.innerHTML = `
        <p class="citation-entry-meta">${readOnlyMeta}</p>
        <p class="citation-entry-raw">${escapeHtml(item.raw_text || "")}</p>
        <p class="citation-entry-meta">Review status: ${escapeHtml(item.review_status || "draft")}</p>
        ${item.doi ? `<p class="citation-entry-meta">DOI: ${escapeHtml(item.doi)}</p>` : ""}
      ${item.openalex_id ? `<p class="citation-entry-meta">OpenAlex: ${escapeHtml(item.openalex_id)}</p>` : ""}
      ${item.resolver_source_label ? `<p class="citation-entry-meta">Resolver source: ${escapeHtml(item.resolver_source_label)}</p>` : ""}
      ${renderCitationAbstractBlock(item.abstract_text || "", false)}
      ${item.enrichment_error ? `<p class="citation-entry-meta error">${escapeHtml(item.enrichment_error)}</p>` : ""}
      ${renderCitationBibtexBlock(item.draft_bibtex || "", false)}
      `;
      attachCitationToggleControls(article);
      citationList.appendChild(article);
      continue;
    }

    article.innerHTML = `
      <p class="citation-entry-meta">${readOnlyMeta}</p>
      <p class="citation-entry-raw">${escapeHtml(item.raw_text || "")}</p>
      <label class="editor-label">Review Status</label>
      <select class="citation-review-status">
        <option value="draft"${item.review_status === "draft" ? " selected" : ""}>Draft</option>
        <option value="reviewed"${item.review_status === "reviewed" ? " selected" : ""}>Reviewed</option>
        <option value="accepted"${item.review_status === "accepted" ? " selected" : ""}>Accepted</option>
        <option value="rejected"${item.review_status === "rejected" ? " selected" : ""}>Rejected</option>
      </select>
      <label class="editor-label">DOI</label>
      <input class="citation-doi" type="text" value="${escapeHtml(item.doi || "")}">
      <label class="editor-label">OpenAlex ID</label>
      <input class="citation-openalex" type="text" value="${escapeHtml(item.openalex_id || "")}" disabled>
      <label class="editor-label">Source URL</label>
      <input class="citation-source-url" type="text" value="${escapeHtml(item.source_url || "")}" disabled>
      <label class="editor-label">Resolver Source</label>
      <input class="citation-resolver-source" type="text" value="${escapeHtml(item.resolver_source_label || "")}" disabled>
      <label class="editor-label">Citation Key</label>
      <input class="citation-key" type="text" value="${escapeHtml(item.citation_key || "")}">
      <label class="editor-label">Entry Type</label>
      <input class="citation-entry-type" type="text" value="${escapeHtml(item.entry_type || "misc")}">
      <label class="editor-label">Normalized Citation</label>
      <textarea class="citation-normalized" rows="3">${escapeHtml(item.normalized_text || "")}</textarea>
      <label class="editor-label">Abstract</label>
      <textarea class="citation-abstract" rows="5">${escapeHtml(item.abstract_text || "")}</textarea>
      ${renderCitationAbstractBlock(item.abstract_text || "", true)}
      <label class="editor-label">Draft BibTeX</label>
      <textarea class="citation-bibtex-editor" rows="8">${escapeHtml(item.draft_bibtex || "")}</textarea>
      ${renderCitationBibtexBlock(item.draft_bibtex || "", true)}
      ${item.enrichment_error ? `<p class="citation-entry-meta error">${escapeHtml(item.enrichment_error)}</p>` : ""}
      <div class="editor-actions">
        <button type="button" class="secondary-button citation-enrich">Run Enrichment</button>
        <button type="button" class="secondary-button citation-review-matches">Review Matches</button>
        <button type="button" class="citation-save">Save Citation Review</button>
      </div>
    `;

    article.querySelector(".citation-enrich").addEventListener("click", async () => {
      if (!currentSlug) {
        return;
      }
      citationStatus.textContent = `Running enrichment for citation ${item.position}...`;
      const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/citations/${item.id}/enrich`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        citationStatus.textContent = data.error || "Citation enrichment failed";
        return;
      }
      citationStatus.textContent = `Citation ${data.citation.position} enrichment ${data.citation.enrichment_status}`;
      await Promise.all([loadSpecies(currentSlug), loadSpeciesCitations(currentSlug)]);
    });

    article.querySelector(".citation-save").addEventListener("click", async () => {
      if (!currentSlug) {
        return;
      }
      citationStatus.textContent = `Saving citation ${item.position}...`;
      const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/citations/${item.id}`, {
        method: "POST",
        body: JSON.stringify({
          review_status: article.querySelector(".citation-review-status").value,
          doi: article.querySelector(".citation-doi").value,
          citation_key: article.querySelector(".citation-key").value,
          entry_type: article.querySelector(".citation-entry-type").value,
          normalized_text: article.querySelector(".citation-normalized").value,
          abstract_text: article.querySelector(".citation-abstract").value,
          draft_bibtex: article.querySelector(".citation-bibtex-editor").value,
        }),
      });
      if (!response.ok) {
        citationStatus.textContent = data.error || "Citation review save failed";
        return;
      }
      citationStatus.textContent = `Citation ${data.citation.position} saved by ${data.last_modified_by}`;
      await Promise.all([loadSpecies(currentSlug), loadSpeciesCitations(currentSlug)]);
    });

    article.querySelector(".citation-review-matches").addEventListener("click", async () => {
      await openCitationMatchDialog(item.id);
    });

    attachCitationToggleControls(article);
    citationList.appendChild(article);
  }
}

function renderCitationAbstractBlock(abstractText, editable) {
  const text = normalizeAbstractForDisplay(abstractText);
  if (!text) {
    return "";
  }
  const label = editable ? "Stored Abstract" : "Abstract";
  return `
    <div class="citation-abstract-shell">
      <button type="button" class="secondary-button citation-abstract-toggle" aria-expanded="false">
        Show ${label}
      </button>
      <div class="citation-abstract-display hidden">
        <p class="public-citation-abstract">${escapeHtml(text)}</p>
      </div>
    </div>
  `;
}

function renderCitationBibtexBlock(draftBibtex, editable) {
  const text = String(draftBibtex || "").trim();
  if (!text) {
    return "";
  }
  const label = editable ? "Stored BibTeX" : "BibTeX";
  return `
    <div class="citation-detail-shell">
      <button type="button" class="secondary-button citation-detail-toggle" aria-expanded="false">
        Show ${label}
      </button>
      <div class="citation-detail-display hidden">
        <pre class="citation-bibtex">${escapeHtml(text)}</pre>
      </div>
    </div>
  `;
}

function attachCitationToggleControls(root) {
  const toggles = root.querySelectorAll(".citation-abstract-toggle, .citation-detail-toggle");
  for (const toggle of toggles) {
    const shell = toggle.parentElement;
    const display = shell && shell.querySelector(".citation-abstract-display, .citation-detail-display");
    if (!display) {
      continue;
    }
    const showLabel = toggle.textContent.replace(/^Hide /, "Show ").trim();
    const hideLabel = showLabel.replace(/^Show /, "Hide ");
    toggle.addEventListener("click", () => {
      const hidden = display.classList.toggle("hidden");
      toggle.setAttribute("aria-expanded", hidden ? "false" : "true");
      toggle.textContent = hidden ? showLabel : hideLabel;
    });
  }
}

function renderMetadataTable(fields) {
  const rows = [
    ["Author", fields.author || ""],
    ["Year", fields.year || ""],
    ["Title", fields.title || ""],
    ["Venue", fields.journal || fields.booktitle || fields.publisher || fields.howpublished || ""],
    ["Volume", fields.volume || ""],
    ["Issue", fields.number || ""],
    ["Pages", fields.pages || ""],
    ["DOI", fields.doi || ""],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<div class="match-row"><span class="match-label">${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`,
    )
    .join("");
  return rows || `<p class="editor-status">No structured metadata extracted yet.</p>`;
}

function renderFieldMatches(fieldMatches) {
  return Object.entries(fieldMatches || {})
    .map(([field, detail]) => {
      const status = String(detail.status || "unknown");
      return `
        <div class="match-row">
          <span class="match-label">${escapeHtml(field)}</span>
          <span class="match-status match-status-${escapeHtml(status)}">${escapeHtml(status)}</span>
          <span>${escapeHtml(String(detail.seed || ""))}</span>
          <span>${escapeHtml(String(detail.candidate || ""))}</span>
        </div>
      `;
    })
    .join("");
}

function normalizeCitationIdentity(value) {
  return String(value || "").trim().toLowerCase();
}

function candidateAlreadyExists(candidate) {
  const candidateFields = candidate && candidate.fields ? candidate.fields : {};
  const candidateDoi = normalizeCitationIdentity(candidateFields.doi || candidate.doi || "");
  const candidateOpenAlex = normalizeCitationIdentity(candidateFields.openalex || candidate.openalex_id || "");
  const candidateKey = normalizeCitationIdentity(candidate.citation_key || "");
  const candidateText = normalizeCitationIdentity(candidate.normalized_text || "");

  return currentSpeciesCitations.some((item) => {
    const itemDoi = normalizeCitationIdentity(item.doi || "");
    const itemOpenAlex = normalizeCitationIdentity(item.openalex_id || "");
    const itemKey = normalizeCitationIdentity(item.citation_key || "");
    const itemText = normalizeCitationIdentity(item.normalized_text || "");
    return (
      (candidateDoi && itemDoi && candidateDoi === itemDoi)
      || (candidateOpenAlex && itemOpenAlex && candidateOpenAlex === itemOpenAlex)
      || (candidateKey && itemKey && candidateKey === itemKey)
      || (candidateText && itemText && candidateText === itemText)
    );
  });
}

function closeCitationMatchDialog() {
  currentCitationMatch = null;
  citationMatchDialog.classList.add("hidden");
  citationMatchDialog.setAttribute("aria-hidden", "true");
  citationMatchSeed.innerHTML = "";
  citationMatchCandidates.innerHTML = "";
  citationMatchStatus.textContent = "Compare the parsed source citation against candidate metadata.";
}

async function applyCitationCandidate(candidate) {
  if (!currentSlug || !currentCitationMatch) {
    return;
  }
  citationMatchStatus.textContent = `Applying ${candidate.source_label || "candidate"}...`;
  const { response, data } = await requestJson(
    `/api/editor/species/${currentSlug}/citations/${currentCitationMatch.citationId}/apply-match`,
    {
      method: "POST",
      body: JSON.stringify({ candidate }),
    },
  );
  if (!response.ok) {
    citationMatchStatus.textContent = data.error || "Candidate application failed";
    return;
  }
  citationStatus.textContent = `Citation ${data.citation.position} accepted from reviewed candidate`;
  closeCitationMatchDialog();
  expandCitationPanel();
  await Promise.all([loadSummary(), loadSpeciesList(searchInput.value), loadSpeciesCitations(currentSlug)]);
  expandCitationPanel();
}

async function addCitationCandidate(candidate) {
  if (!currentSlug || !currentCitationMatch) {
    return;
  }
  citationMatchStatus.textContent = `Adding ${candidate.source_label || "candidate"} as another citation...`;
  const { response, data } = await requestJson(
    `/api/editor/species/${currentSlug}/citations/${currentCitationMatch.citationId}/add-match`,
    {
      method: "POST",
      body: JSON.stringify({ candidate }),
    },
  );
  if (!response.ok) {
    citationMatchStatus.textContent = data.error || "Candidate addition failed";
    return;
  }
  citationStatus.textContent = `Added reviewed candidate as citation ${data.citation.position}`;
  citationMatchStatus.textContent = `Added as citation ${data.citation.position}. You can continue reviewing other candidates.`;
  expandCitationPanel();
  await Promise.all([loadSummary(), loadSpeciesList(searchInput.value), loadSpeciesCitations(currentSlug)]);
  expandCitationPanel();
}

async function openCitationMatchDialog(citationId) {
  if (!currentSlug || !isEditorSession()) {
    return;
  }
  currentCitationMatch = { citationId };
  citationMatchDialog.classList.remove("hidden");
  citationMatchDialog.setAttribute("aria-hidden", "false");
  citationMatchSeed.innerHTML = "";
  citationMatchCandidates.innerHTML = "";
  citationMatchStatus.textContent = "Loading candidate matches...";

  const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/citations/${citationId}/candidates`);
  if (!response.ok) {
    citationMatchStatus.textContent = data.error || "Candidate lookup failed";
    citationMatchCandidates.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load candidates.")}</p>`;
    return;
  }

  citationMatchSeed.innerHTML = `
    <p class="citation-entry-raw">${escapeHtml(data.citation.raw_text || "")}</p>
    ${renderMetadataTable((data.seed && data.seed.fields) || {})}
    ${renderCitationAbstractBlock((data.seed && (data.seed.abstract_text || (data.seed.fields && data.seed.fields.abstract))) || "", false)}
    ${data.seed && data.seed.normalized_text ? `<p class="editor-status">${escapeHtml(data.seed.normalized_text)}</p>` : ""}
  `;
  attachCitationToggleControls(citationMatchSeed);

  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  citationMatchStatus.textContent = `${candidates.length} candidate${candidates.length === 1 ? "" : "s"} found`;
  if (!candidates.length) {
    citationMatchCandidates.innerHTML = `<p class="editor-status">No close candidates were returned for this citation.</p>`;
    return;
  }

  citationMatchCandidates.innerHTML = "";
  for (const candidate of candidates) {
    const alreadyExists = candidateAlreadyExists(candidate);
    const card = document.createElement("article");
    card.className = "match-candidate-card";
    card.innerHTML = `
      <div class="match-candidate-header">
        <strong>${escapeHtml(candidate.fields?.title || "Untitled candidate")}</strong>
        <span class="match-score">Score ${escapeHtml(String(candidate.score || 0))}</span>
      </div>
      <p class="citation-entry-meta">${escapeHtml(candidate.source_label || "")}</p>
      ${alreadyExists ? `<p class="citation-entry-meta">Already present in this species' citation set.</p>` : ""}
      ${candidate.conflict_reason ? `<p class="citation-entry-meta error">${escapeHtml(candidate.conflict_reason)}</p>` : ""}
      ${renderMetadataTable(candidate.fields || {})}
      ${renderCitationAbstractBlock(candidate.abstract_text || (candidate.fields && candidate.fields.abstract) || "", false)}
      <div class="match-table">
        <div class="match-row match-row-head">
          <span class="match-label">Field</span>
          <span>Status</span>
          <span>Source</span>
          <span>Candidate</span>
        </div>
        ${renderFieldMatches(candidate.field_matches || {})}
      </div>
      ${candidate.normalized_text ? `<p class="editor-status">${escapeHtml(candidate.normalized_text)}</p>` : ""}
      <div class="editor-actions">
        <button type="button" class="candidate-apply">Use This Candidate</button>
        <button type="button" class="secondary-button candidate-add"${alreadyExists ? " disabled" : ""}>Add As Another Citation</button>
      </div>
    `;
    card.querySelector(".candidate-apply").addEventListener("click", async () => {
      await applyCitationCandidate(candidate);
    });
    if (!alreadyExists) {
      card.querySelector(".candidate-add").addEventListener("click", async () => {
        await addCitationCandidate(candidate);
      });
    }
    attachCitationToggleControls(card);
    citationMatchCandidates.appendChild(card);
  }
}

async function loadSpeciesDocument(slug) {
  if (!isEditorSession() && !isContributorSession()) {
    documentPanel.classList.add("hidden");
    return;
  }

  documentPanel.classList.remove("hidden");
  documentStatus.textContent = "Loading document...";
  const path = isEditorSession()
    ? `/api/editor/species/${slug}/document`
    : `/api/contributor/species/${slug}/document`;
  const { response, data } = await requestJson(path);
  if (!response.ok) {
    documentMarkdown.value = "";
    documentPreview.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load document.")}</p>`;
    documentStatus.textContent = data.error || "Document load failed";
    return;
  }

  documentMarkdown.value = data.markdown || "";
  renderDocumentPreview(documentMarkdown.value);
  documentStatus.textContent = data.updated_by
    ? `Document last updated by ${data.updated_by}`
    : "Document loaded";
}

async function loadSpeciesCitations(slug, fallbackData = null) {
  citationPanel.classList.remove("hidden");
  citationBackfillSpeciesButton.classList.toggle("hidden", !isEditorSession());
  citationEnrichAllButton.classList.toggle("hidden", !isEditorSession());

  if (!isEditorSession() && !isContributorSession()) {
    const items = Array.isArray(fallbackData && fallbackData.citations) ? fallbackData.citations : [];
    currentSpeciesCitations = items;
    renderCitationList(items, false);
    citationStatus.textContent = `${items.length} citation${items.length === 1 ? "" : "s"}`;
    return;
  }

  citationStatus.textContent = "Loading citations...";
  const path = isEditorSession()
    ? `/api/editor/species/${slug}/citations`
    : `/api/contributor/species/${slug}/citations`;
  const { response, data } = await requestJson(path);
  if (!response.ok) {
    citationList.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load citations.")}</p>`;
    citationStatus.textContent = data.error || "Citation load failed";
    return;
  }

  currentSpeciesCitations = Array.isArray(data.citations) ? data.citations : [];
  renderCitationList(currentSpeciesCitations, isEditorSession());
  citationStatus.textContent = `${data.citation_count || 0} citation${data.citation_count === 1 ? "" : "s"} extracted`;
}

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const authHeaders = getAuthHeaders();
  for (const [key, value] of Object.entries(authHeaders)) {
    headers.set(key, value);
  }
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetchJsonWithStaticFallback(path, { ...options, headers });
}

function isEditorSession() {
  return Boolean(currentSession && currentSession.user && ["editor", "admin"].includes(currentSession.user.role));
}

function isContributorSession() {
  return Boolean(currentSession && currentSession.user && currentSession.user.role === "contributor");
}

function getVisibleItems(items) {
  if (!isEditorSession()) {
    return items;
  }
  if (currentArchiveFilter === "archived") {
    return items.filter((item) => item.is_archived);
  }
  if (currentArchiveFilter === "all") {
    return items;
  }
  return items.filter((item) => !item.is_archived);
}

function syncArchiveFilterUi() {
  archiveFilterGroup.classList.toggle("hidden", !isEditorSession());
  contributorCreateButton.classList.toggle("hidden", !isContributorSession());
  for (const button of archiveFilterGroup.querySelectorAll("[data-archive-filter]")) {
    button.classList.toggle("is-active", button.dataset.archiveFilter === currentArchiveFilter);
  }
}

async function loadSession() {
  const { data } = await requestJson("/api/auth/session");
  currentSession = data;
  if (!isEditorSession()) {
    currentArchiveFilter = "active";
  }
  contributorAgeLabel.textContent = String(data.minimum_contributor_age || 13);
  authTokenInput.value = getAuthToken();
  if (data.authenticated) {
    authStatus.textContent = `${data.user.username} (${data.user.role})`;
    contributorStatus.textContent = isContributorSession() ? "Contributor token stored in this browser." : "";
  } else if (data.auth_configured) {
    authStatus.textContent = "Auth configured, public session";
  } else {
    authStatus.textContent = "Public access";
  }
  syncArchiveFilterUi();
}

async function loadSummary() {
  const { data } = await requestJson("/api/insights/summary");
  speciesCount.textContent = data.species_count;
  sectionCount.textContent = data.section_count;
}

function renderSpecies(items) {
  speciesList.innerHTML = "";
  const visibleItems = getVisibleItems(items);

  if (!visibleItems.length) {
    speciesList.innerHTML = `<p class="editor-status">${isEditorSession() ? "No species match the current archive filter." : "No species match the current search."}</p>`;
    return;
  }

  for (const item of visibleItems) {
    const button = document.createElement("button");
    button.className = item.is_archived ? "species-card species-card-archived" : "species-card";
    button.type = "button";
    const archivedMeta = item.is_archived ? `<span class="species-state-badge">Archived</span>` : "";
    const commonName = item.common_name || item.title;
    const scientificName = item.scientific_name || "Scientific name missing";
    button.innerHTML = `
      <span class="species-name">${escapeHtml(commonName)}</span>
      <span class="species-meta">Common name: ${escapeHtml(commonName)}</span>
      <span class="species-meta">Scientific name: ${escapeHtml(scientificName)}</span>
      <span class="species-meta">${escapeHtml(item.publication_status || "published")}${archivedMeta}</span>
      <span class="species-meta">${item.diagnostic_count ? `${item.diagnostic_count} ingest flags` : "No ingest flags"}</span>
      <span class="species-snippet">${escapeHtml((item.summary || "No summary extracted yet.").slice(0, 180))}</span>
    `;
    button.addEventListener("click", () => {
      window.location.hash = item.slug;
      loadSpecies(item.slug);
    });
    speciesList.appendChild(button);
  }
}

function formatIdentifierBanner(item) {
  if (item.primary_taxon_identifier && item.primary_taxon_authority) {
    return `${String(item.primary_taxon_authority).toUpperCase()} ${item.primary_taxon_identifier.identifier || ""}`.trim();
  }
  const legacyIdentifier = Array.isArray(item.legacy_identifiers) ? item.legacy_identifiers[0] : null;
  if (legacyIdentifier && legacyIdentifier.identifier) {
    const label = legacyIdentifier.label || "Legacy identifier";
    return `${label} ${legacyIdentifier.identifier}`;
  }
  return "No external taxon identifier assigned";
}

async function loadSpeciesList(search = "") {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const path = isEditorSession()
    ? `/api/editor/species${query}`
    : isContributorSession()
      ? `/api/contributor/species${query}`
      : `/api/species${query}`;
  const { data, staticFallback } = await requestJson(path);
  currentItems = data.items || [];
  if (staticFallback && search) {
    const needle = search.toLowerCase();
    currentItems = currentItems.filter((item) => {
      return [
        item.common_name || "",
        item.scientific_name || "",
        item.title || "",
      ].some((value) => String(value).toLowerCase().includes(needle));
    });
  }
  syncArchiveFilterUi();
  renderSpecies(currentItems);
}

async function loadSpecies(slug) {
  const previousSlug = currentSlug;
  currentSlug = slug;
  closeCitationMatchDialog();
  const path = isEditorSession()
    ? `/api/editor/species/${slug}`
    : isContributorSession()
      ? `/api/contributor/species/${slug}`
      : `/api/species/${slug}`;
  const { response, data } = await requestJson(path);
  if (!response.ok) {
    detailEmpty.classList.remove("hidden");
    detail.classList.add("hidden");
    speciesList.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load species.")}</p>`;
    return;
  }

  detailEmpty.classList.add("hidden");
  detail.classList.remove("hidden");
  if (previousSlug !== slug) {
    collapseWorkflowPanels();
  }

  detailCode.textContent = formatIdentifierBanner(data);
  detailCommonName.textContent = data.common_name || data.title;
  detailArchiveBadge.classList.toggle("hidden", !data.is_archived);
  detailArchiveNote.classList.toggle("hidden", !data.is_archived);
  detailScientificName.textContent = data.scientific_name || "Scientific name missing in source";
  detailSummary.textContent = data.summary || "No summary extracted from the current source file.";
  editorPanel.classList.toggle("hidden", !isEditorSession());
  auditPanel.classList.toggle("hidden", !isEditorSession());
  if (isEditorSession()) {
    editorPublicationStatus.value = data.publication_status || "published";
    editorNotes.value = data.editor_notes || "";
    editorIsArchived.checked = Boolean(data.is_archived);
    editorStatus.textContent = data.last_modified_by
      ? `Last modified by ${data.last_modified_by}`
      : "Editor session active";
    await Promise.all([loadAudit(slug), loadSpeciesDocument(slug), loadSpeciesCitations(slug)]);
  } else if (isContributorSession()) {
    editorStatus.textContent = "";
    await Promise.all([loadSpeciesDocument(slug), loadSpeciesCitations(slug)]);
  } else {
    documentPanel.classList.add("hidden");
    await loadSpeciesCitations(slug, data);
  }

  renderLegacySource(data);
  restoreWorkflowPanels();
  renderPrimaryContent(data);
}

function renderAudit(items) {
  auditList.innerHTML = "";
  if (!items.length) {
    auditList.innerHTML = `<p class="editor-status">No audit entries yet.</p>`;
    return;
  }

  for (const item of items) {
    const entry = document.createElement("article");
    entry.className = "audit-entry";
    const detailRows = Object.entries(item.details)
      .map(([field, values]) => {
        if (values && typeof values === "object" && "from" in values && "to" in values) {
          return `<li><strong>${escapeHtml(field)}</strong>: ${escapeHtml(String(values.from || ""))} -> ${escapeHtml(String(values.to || ""))}</li>`;
        }
        return `<li><strong>${escapeHtml(field)}</strong>: ${escapeHtml(String(values ?? ""))}</li>`;
      })
      .join("");
    entry.innerHTML = `
      <p class="audit-meta">${escapeHtml(item.changed_by)} • ${escapeHtml(item.changed_at)} • ${escapeHtml(item.action)}</p>
      <ul class="diagnostic-list">${detailRows}</ul>
    `;
    auditList.appendChild(entry);
  }
}

async function loadAudit(slug) {
  if (!isEditorSession()) {
    return;
  }
  const { response, data } = await requestJson(`/api/editor/species/${slug}/audit`);
  if (!response.ok) {
    auditList.innerHTML = `<p class="error">${escapeHtml(data.error || "Unable to load audit history.")}</p>`;
    return;
  }
  renderAudit(data.items);
}

async function saveEditorialChanges() {
  if (!currentSlug || !isEditorSession()) {
    return;
  }
  editorStatus.textContent = "Saving...";
  const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/editorial`, {
    method: "POST",
    body: JSON.stringify({
      publication_status: editorPublicationStatus.value,
      editor_notes: editorNotes.value,
      is_archived: editorIsArchived.checked,
    }),
  });
  if (!response.ok) {
    editorStatus.textContent = data.error || "Save failed";
    return;
  }
  editorStatus.textContent = `Saved by ${data.last_modified_by}`;
  await Promise.all([loadSummary(), loadSpeciesList(searchInput.value), loadSpecies(currentSlug)]);
}

async function saveDocumentMarkdown() {
  if (!currentSlug || (!isEditorSession() && !isContributorSession())) {
    return;
  }
  documentStatus.textContent = "Saving document...";
  const path = isEditorSession()
    ? `/api/editor/species/${currentSlug}/document`
    : `/api/contributor/species/${currentSlug}/document`;
  const { response, data } = await requestJson(path, {
    method: "POST",
    body: JSON.stringify({ markdown: documentMarkdown.value }),
  });
  if (!response.ok) {
    documentStatus.textContent = data.error || "Document save failed";
    return;
  }
  renderDocumentPreview(documentMarkdown.value);
  documentStatus.textContent = `Document saved by ${data.updated_by}`;
  await Promise.all([loadSummary(), loadSpeciesList(searchInput.value), loadSpecies(currentSlug)]);
}

async function registerContributor() {
  contributorStatus.textContent = "Registering contributor...";
  const { response, data } = await requestJson("/api/contributor/register", {
    method: "POST",
    body: JSON.stringify({
      email: contributorEmailInput.value.trim(),
      age_gate_confirmed: contributorAgeGate.checked,
    }),
  });
  if (!response.ok) {
    contributorStatus.textContent = data.error || "Contributor registration failed";
    return;
  }
  window.localStorage.setItem("ecospecies_auth_token", data.token);
  authTokenInput.value = data.token;
  contributorStatus.textContent = data.warning;
  await loadSession();
  await loadSpeciesList(searchInput.value);
}

async function createContributorDraft() {
  if (!isContributorSession()) {
    return;
  }
  contributorStatus.textContent = "Creating new contributor draft...";
  const { response, data } = await requestJson("/api/contributor/species", {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    contributorStatus.textContent = data.error || "Draft creation failed";
    return;
  }
  contributorStatus.textContent = "Draft created. Store your token carefully.";
  await loadSpeciesList(searchInput.value);
  await loadSpecies(data.slug);
}

searchInput.addEventListener("input", async (event) => {
  await loadSpeciesList(event.target.value);
});

for (const button of archiveFilterGroup.querySelectorAll("[data-archive-filter]")) {
  button.addEventListener("click", () => {
    currentArchiveFilter = button.dataset.archiveFilter || "active";
    syncArchiveFilterUi();
    renderSpecies(currentItems);
  });
}

for (const button of collapsibleToggles) {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.target || "");
    if (!panel || panel.classList.contains("hidden")) {
      return;
    }
    const expanded = panel.classList.contains("collapsed");
    setCollapsibleState(panel, expanded);
  });
}

authSaveButton.addEventListener("click", async () => {
  const token = authTokenInput.value.trim();
  if (token) {
    window.localStorage.setItem("ecospecies_auth_token", token);
  }
  await loadSession();
  await loadSpeciesList(searchInput.value);
  if (currentSlug) {
    await loadSpecies(currentSlug);
  }
});

authClearButton.addEventListener("click", async () => {
  window.localStorage.removeItem("ecospecies_auth_token");
  authTokenInput.value = "";
  contributorStatus.textContent = "";
  await loadSession();
  await loadSpeciesList(searchInput.value);
  if (currentSlug) {
    await loadSpecies(currentSlug);
  }
});

editorSaveButton.addEventListener("click", saveEditorialChanges);
documentSaveButton.addEventListener("click", saveDocumentMarkdown);
contributorRegisterButton.addEventListener("click", registerContributor);
contributorCreateButton.addEventListener("click", createContributorDraft);
citationMatchCloseButton.addEventListener("click", closeCitationMatchDialog);
citationMatchDialog.querySelector(".match-dialog-backdrop").addEventListener("click", closeCitationMatchDialog);
citationBackfillSpeciesButton.addEventListener("click", async () => {
  if (!currentSlug || !isEditorSession()) {
    return;
  }
  expandCitationPanel();
  citationStatus.textContent = "Running citation backfill for this species...";
  const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/citations/backfill`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    citationStatus.textContent = data.error || "Species citation backfill failed";
    return;
  }
  citationStatus.textContent =
    `Species backfill complete: ${data.backfilled_count || 0} checked, ${data.changed_count || 0} changed, ${data.resolved_count || 0} resolved, ${data.unresolved_count || 0} unresolved, ${data.error_count || 0} errors`;
  await Promise.all([loadSpecies(currentSlug), loadSpeciesCitations(currentSlug)]);
});
citationEnrichAllButton.addEventListener("click", async () => {
  if (!currentSlug || !isEditorSession()) {
    return;
  }
  expandCitationPanel();
  citationStatus.textContent = "Running enrichment for all citations...";
  const { response, data } = await requestJson(`/api/editor/species/${currentSlug}/citations/enrich`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  if (!response.ok) {
    citationStatus.textContent = data.error || "Batch citation enrichment failed";
    return;
  }
  citationStatus.textContent =
    `Batch enrichment complete: ${data.resolved_count || 0} resolved, ${data.unresolved_count || 0} unresolved, ${data.error_count || 0} errors`;
  await Promise.all([loadSpecies(currentSlug), loadSpeciesCitations(currentSlug)]);
});
documentMarkdown.addEventListener("input", () => {
  renderDocumentPreview(documentMarkdown.value);
});

async function bootstrap() {
  await loadSession();
  await Promise.all([loadSummary(), loadSpeciesList()]);
  const initialSlug = getInitialSpeciesSlug();
  if (initialSlug) {
    await loadSpecies(initialSlug);
  }
}

bootstrap().catch((error) => {
  speciesList.innerHTML = `<p class="error">Failed to load data: ${escapeHtml(String(error))}</p>`;
});

window.addEventListener("hashchange", async () => {
  const slug = getInitialSpeciesSlug();
  if (slug && slug !== currentSlug) {
    await loadSpecies(slug);
  }
});
