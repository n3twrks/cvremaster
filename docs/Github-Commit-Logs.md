# CVRemaster GitHub Commits Documentation

## Table des Matières

1. [Commit [[<initial_nextjs_setup_hash>]] - 2026-05-27 - Initial Next.js 15 Project Setup](#commit-initial_nextjs_setup_hash---2026-05-27---initial-nextjs-15-project-setup) - **chore(arch)**
2. [Commit [[<cv_data_model_ai_parser_hash>]] - 2026-05-27 - CV Data Model, Gemini API Route & AI Parser](#commit-cv_data_model_ai_parser_hash---2026-05-27---cv-data-model-gemini-api-route--ai-parser) - **feat(arch, ai)**
3. [Commit [[<three_column_editor_layout_hash>]] - 2026-05-28 - Three-Column Editor Layout & Core UI Shell](#commit-three_column_editor_layout_hash---2026-05-28---three-column-editor-layout--core-ui-shell) - **feat(ui, arch)**
4. [Commit [[<classic_template_hash>]] - 2026-05-28 - Classic CV Template — First Template Implementation](#commit-classic_template_hash---2026-05-28---classic-cv-template--first-template-implementation) - **feat(templates)**
5. [Commit [[<pdf_export_engine_hash>]] - 2026-05-28 - PDF Export Engine with html2canvas & jsPDF](#commit-pdf_export_engine_hash---2026-05-28---pdf-export-engine-with-html2canvas--jspdf) - **feat(export)**
6. [Commit [[<ai_chat_assistant_hash>]] - 2026-05-28 - AI Chat Assistant — Gemini-Powered CV Editor](#commit-ai_chat_assistant_hash---2026-05-28---ai-chat-assistant--gemini-powered-cv-editor) - **feat(ai, ux)**
7. [Commit [[<pdf_import_parser_hash>]] - 2026-05-28 - PDF Import & AI Parsing Pipeline](#commit-pdf_import_parser_hash---2026-05-28---pdf-import--ai-parsing-pipeline) - **feat(import, ai)**
8. [Commit [[<multi_template_system_hash>]] - 2026-05-28 - Multi-Template System — SidebarDark & TealHorizontal](#commit-multi_template_system_hash---2026-05-28---multi-template-system--sidebardark--tealhorizontal) - **feat(templates, arch)**
9. [Commit [[<advanced_templates_hash>]] - 2026-05-28 - Advanced Templates — TealSidebar, NavyDark & PastelSidebar](#commit-advanced_templates_hash---2026-05-28---advanced-templates--tealsidebar-navydark--pastelsidebar) - **feat(templates)**
10. [Commit [[<photo_upload_integration_hash>]] - 2026-05-28 - Photo Upload, Storage & Template Integration](#commit-photo_upload_integration_hash---2026-05-28---photo-upload-storage--template-integration) - **feat(ux, data)**
11. [Commit [[<html_export_engine_hash>]] - 2026-05-29 - HTML Export — Clean Web Version Download](#commit-html_export_engine_hash---2026-05-29---html-export--clean-web-version-download) - **feat(export)**
12. [Commit [[<version_management_hash>]] - 2026-05-29 - Version Management System — Create, Restore & History](#commit-version_management_hash---2026-05-29---version-management-system--create-restore--history) - **feat(data, ux)**
13. [Commit [[<cv_analysis_panel_hash>]] - 2026-05-29 - CV Analysis Panel — AI Scoring & Recommendations](#commit-cv_analysis_panel_hash---2026-05-29---cv-analysis-panel--ai-scoring--recommendations) - **feat(ai, ux)**
14. [Commit [[<a4_preview_mode_hash>]] - 2026-05-29 - A4 Page Preview Mode — Smart Page Breaks & Separator Overlay](#commit-a4_preview_mode_hash---2026-05-29---a4-page-preview-mode--smart-page-breaks--separator-overlay) - **feat(ux, export)**
15. [Commit [[<translation_system_hash>]] - 2026-05-30 - Translation System — AI-Powered Language Switching](#commit-translation_system_hash---2026-05-30---translation-system--ai-powered-language-switching) - **feat(ai, i18n)**
16. [Commit [[<static_section_labels_hash>]] - 2026-05-30 - Static Section Labels — Instant Multi-Language Section Headings](#commit-static_section_labels_hash---2026-05-30---static-section-labels--instant-multi-language-section-headings) - **feat(i18n, templates)**
17. [Commit [[<language_version_upsert_hash>]] - 2026-05-31 - Language Version Upsert — One Version Per Language with History](#commit-language_version_upsert_hash---2026-05-31---language-version-upsert--one-version-per-language-with-history) - **feat(data, ux)**
18. [Commit [[<fix_max_tokens_photo_strip_hash>]] - 2026-05-31 - Fix: Strip Photo from AI Payload to Eliminate MAX_TOKENS Truncation](#commit-fix_max_tokens_photo_strip_hash---2026-05-31---fix-strip-photo-from-ai-payload-to-eliminate-max_tokens-truncation) - **fix(ai, translation)**
19. [Commit [[<fix_button_nesting_hash>]] - 2026-05-31 - Fix: Nested Button Hydration Error in SectionCard](#commit-fix_button_nesting_hash---2026-05-31---fix-nested-button-hydration-error-in-sectioncard) - **fix(a11y, ui)**

---

## Commit History

### Commit [[<initial_nextjs_setup_hash>]] - 2026-05-27 - Initial Next.js 15 Project Setup
**chore(arch): Bootstrap CVRemaster with Next.js 15 App Router, Tailwind CSS, TypeScript and project directory structure.**

Foundation commit establishing the monorepo structure and toolchain for the AI-powered CV builder.

- **Framework:** Next.js 15 App Router with TypeScript strict mode and Turbopack for development.
- **Styling:** Tailwind CSS with a custom design system — custom font pairings (`font-display`, `font-body`, `font-mono`), muted neutral palette (`#FAFAF8`, `#1A1A18`, `#1B4332`).
- **Project Structure:** Established `src/app`, `src/components`, `src/templates`, `src/lib`, `src/hooks`, `src/types` directory conventions.
- **Route Architecture:** App group layout `(app)` for authenticated tooling, `(landing)` for public pages.

Files created:
- `next.config.ts`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/(app)/cv/page.tsx`

---

### Commit [[<cv_data_model_ai_parser_hash>]] - 2026-05-27 - CV Data Model, Gemini API Route & AI Parser
**feat(arch, ai): Define the canonical CVData type, wire the Gemini 2.5 Flash API route, and implement a resilient JSON response parser.**

Establishes the core data contract and AI backbone that all templates and editor features depend on.

- **CVData Type:** Defined the canonical `CVData` interface in `src/types/cv.ts` with all CV sections: `name`, `tagline`, `contact[]`, `summary`, `experience[]`, `education[]`, `skills[]`, `languages[]`, `hobbies[]`, `photo?`.
- **Experience Entry Model:** Each experience entry typed as `{ title, company, location, date, bullets[] }` to support rich timeline rendering.
- **Gemini API Route (`/api/ai`):** Created a `POST` route targeting `gemini-2.5-flash-lite` with automatic fallback to `gemini-flash-lite-latest`. Accepts `{ system, user, maxOutputTokens }` payload. Returns `{ result, finishReason }` for downstream error handling.
- **`parseJSONResponse` — 3-Tier Parser:** Implemented a resilient parser with three extraction strategies: (1) markdown code fence regex, (2) direct `JSON.parse`, (3) `{...}` substring extraction. Prevents hard failures on imperfect AI output.
- **`normaliseCVData`:** Ensures all array fields default to `[]` and all string fields default to `''` regardless of what the AI returns — prevents runtime crashes across templates.
- **Logging:** Added `finishReason` + `responseLength` logging on the API route to diagnose truncation issues early.

Files created:
- `src/types/cv.ts`
- `src/app/api/ai/route.ts`
- `src/lib/parseAIResponse.ts`

---

### Commit [[<three_column_editor_layout_hash>]] - 2026-05-28 - Three-Column Editor Layout & Core UI Shell
**feat(ui, arch): Build the full three-column CV editor shell with persistent state via useCVStore and localStorage.**

Establishes the main application frame that houses all editing, preview, and chat functionality.

- **Layout Architecture:** Three-column layout — `LeftSidebar` (data + templates), `CenterPanel` (CV preview), `Sidebar` (AI chat) — inside a full-height `flex` container with `overflow-hidden` to prevent body scroll.
- **Header:** Minimal top bar with "CVRemaster" logotype in `font-display`. Reserved right slot for future user menu.
- **`useCVStore` Hook:** Central state hook managing `cvData`, `photo`, `showPhoto`, `activeTemplateId`, `activeLanguage`, `versions`, `messages`, `isLoading`. All persistent state backed by `localStorage` via `src/lib/cvStorage.ts`.
- **`cvStorage.ts`:** Implements `saveCV` / `loadCV` (strips photo separately to keep data lean), `savePhoto` / `loadPhoto`, `saveTemplate` / `loadTemplate`, `saveShowPhoto` / `loadShowPhoto`, `loadVersions` / `saveVersion` / `deleteVersion`.
- **URL CV Import:** On mount, checks `?cv=` query param for base64-encoded CV data (`encodeCVToURL` / `decodeCVFromURL`) to enable shareable CV links.
- **Language Detection:** `detectCVLanguage` — lightweight regex-based detection of French vs English from `tagline + summary` text.

Files created:
- `src/app/(app)/cv/page.tsx`
- `src/hooks/useCVStore.ts`
- `src/lib/cvStorage.ts`
- `src/components/Sidebar.tsx`
- `src/components/LeftSidebar.tsx`
- `src/components/CenterPanel.tsx`

---

### Commit [[<classic_template_hash>]] - 2026-05-28 - Classic CV Template — First Template Implementation
**feat(templates): Launch the Classic template — a clean, serif-inspired single-column design with tag-based skill and language chips.**

First production-ready CV layout establishing the visual language and rendering conventions for all future templates.

- **Design Language:** Georgia serif font, muted green accent (`#1B4332`), warm off-white background (`#F4F3F0`). Clean typographic hierarchy with `font-display` headings, `font-body` body copy, `font-mono` metadata.
- **Header Block:** Name + tagline + contact row with `ContactItem` utility (renders clickable `<a>` for emails, phones, URLs, and plain text otherwise).
- **Section Rendering:** Summary, Experience (title · company · location + date badge + bullet list), Education (degree · school + date badge), Skills (tag chips with `##` prefix support for sub-headings), Languages (green chips), Hobbies (amber/orange chips).
- **`ContactItem` Utility:** Shared utility in `src/templates/utils.tsx` — detects `@` (mailto), `http` (href), `+` or digit prefix (tel:), falls back to `<span>`.
- **Responsive Photo:** Optional `<img>` in header, hidden entirely when `cvData.photo` is falsy — no empty placeholder.
- **`id="cv-content"`:** Root div carries this ID, used by PDF/HTML export engines to locate the rendered CV.

Files created:
- `src/templates/ClassicTemplate.tsx`
- `src/templates/utils.tsx`
- `src/components/TemplateRenderer.tsx`

---

### Commit [[<pdf_export_engine_hash>]] - 2026-05-28 - PDF Export Engine with html2canvas & jsPDF
**feat(export): Implement pixel-perfect PDF generation with smart page break detection via canvas pixel scanning.**

Produces A4-formatted PDFs directly from the live DOM render, avoiding server-side rendering complexity.

- **Pipeline:** `html2canvas` (scale: 2 for retina sharpness, `useCORS: true` for base64 photos, `logging: false`) → PNG → `jsPDF` A4 slice-and-stack.
- **`findSafeBreakY`:** Scans the right 65% of the canvas (skips the dark sidebar) for near-white pixel rows before each A4 boundary. Reads `getImageData`, checks luminance > 242 with < 2.5% dark pixel threshold. Falls back to `idealY` if no safe row found within 80px window.
- **Multi-Page Slicing:** Iterates break points, slices the canvas at each safe break, adds a new jsPDF page, and stacks PNG strips — preventing mid-word/mid-line cuts.
- **Visibility Toggle:** Hides the CV element via `position: fixed; left: -9999px` during html2canvas capture (avoids `visibility:hidden` layout-space issue), restores after.
- **File Naming:** Output as `cv.pdf`.

Files created:
- `src/lib/exportPDF.ts`

---

### Commit [[<ai_chat_assistant_hash>]] - 2026-05-28 - AI Chat Assistant — Gemini-Powered CV Editor
**feat(ai, ux): Deploy a conversational AI assistant in the right sidebar for natural-language CV editing and rewriting.**

Enables users to improve their CV through chat commands without manually editing individual fields.

- **Chat UI:** Message list with role-based bubbles (`user`, `assistant`, `thinking` spinner). Auto-scroll to latest message. Input textarea with Enter-to-send and Shift+Enter for newlines.
- **System Prompt Engineering:** System message instructs Gemini to return a full updated `CVData` JSON when modifications are requested, or plain text for questions/advice.
- **Response Routing:** If the AI response contains a parseable JSON object, `parseJSONResponse` extracts it and calls `onUpdateCV`. Otherwise displays raw text as a chat message.
- **"Analyser" Tab:** Separate panel for structured CV analysis (see dedicated commit).
- **State Integration:** `messages[]` and `isLoading` managed in `useCVStore`, persisted for the session.

Files created:
- `src/components/Sidebar.tsx` (chat implementation)

---

### Commit [[<pdf_import_parser_hash>]] - 2026-05-28 - PDF Import & AI Parsing Pipeline
**feat(import, ai): Enable CV upload from PDF — extract raw text via pdf.js, parse structure with Gemini, and hydrate the editor.**

Lets users bootstrap their CV in seconds by uploading an existing PDF.

- **`extractTextFromPDF`:** Uses `pdfjs-dist` with the worker sourced from CDN. Iterates all pages, extracts text content, joins with newlines. Handles multi-column PDFs gracefully.
- **AI Parsing Prompt:** Strict system message requesting `{ name, tagline, contact[], summary, experience[], education[], skills[], languages[], hobbies[] }` JSON only, no markdown wrappers.
- **Toolbar Integration:** Hidden `<input type="file" accept=".pdf">` triggered by "Importer PDF" button. On selection: extract text → call `/api/ai` → `normaliseCVData` → `onUpdateCV`.
- **Error Handling:** User-facing error messages in chat if extraction or parsing fails.

Files created:
- `src/lib/pdfParser.ts`

Files modified:
- `src/components/Toolbar.tsx`

---

### Commit [[<multi_template_system_hash>]] - 2026-05-28 - Multi-Template System — SidebarDark & TealHorizontal
**feat(templates, arch): Launch TemplateRenderer switcher, add SidebarDark and TealHorizontal templates, and build the template picker in LeftSidebar.**

Gives users visual choices and establishes the template registration pattern for future additions.

- **`TemplateRenderer`:** Central switch component mapping `templateId` strings to template components. All templates receive `{ cvData, language? }` props.
- **`SidebarDarkTemplate`:** Dark charcoal left sidebar (`#3C3C3C`) with full-width photo, diamond `◆` contact icons, and `SegmentBar` language proficiency bars. Right panel: clean white with `font-system-ui`.
- **`TealHorizontalTemplate`:** Full-width layout with teal accent (`#3DBDB3`), triangle corner decoration, horizontal `Row` component (label-left / content-right). Teal `SegmentBar` for language levels. Two-column skill grid.
- **`SegmentBar` + `langScore` Utilities:** 5-segment visual proficiency bar. `langScore` parses language level strings (Native, C2, B2, A2…) to a 1–5 numeric score.
- **Template Picker UI:** `LeftSidebar` "Templates" tab with visual thumbnail cards. Active template highlighted with green ring. Persists selection to `localStorage`.

Files created:
- `src/templates/SidebarDarkTemplate.tsx`
- `src/templates/TealHorizontalTemplate.tsx`

Files modified:
- `src/components/TemplateRenderer.tsx`
- `src/components/LeftSidebar.tsx`
- `src/templates/utils.tsx` (SegmentBar, langScore)

---

### Commit [[<advanced_templates_hash>]] - 2026-05-28 - Advanced Templates — TealSidebar, NavyDark & PastelSidebar
**feat(templates): Add three premium layouts covering sidebar-teal, dark navy, and pastel peach design aesthetics.**

Completes the initial template library of 6 distinct visual styles.

- **`TealSidebarTemplate`:** Light `#FAFAFA` sidebar with teal `#3DBDB3` border accent. Rotated vertical date labels for experience entries (writing-mode: vertical-rl). Diamond bullet points with `◆`. Education in sidebar.
- **`NavyDarkTemplate`:** Deep navy sidebar (`#2B3547`) with circular photo, muted slate text (`#94A3B8`), and a timeline dot system for experience entries (circle dots + vertical connector lines). Georgia serif font.
- **`PastelSidebarTemplate`:** Warm pastel aesthetic with peach accent (`#F2C4A0`). Circular photo with peach shadow disc offset. Tagline rendered in a peach band. Skills separated by subtle horizontal rules.
- **All templates:** Photo hidden entirely (no placeholder) when `cvData.photo` is falsy. `id="cv-content"` on root div.

Files created:
- `src/templates/TealSidebarTemplate.tsx`
- `src/templates/NavyDarkTemplate.tsx`
- `src/templates/PastelSidebarTemplate.tsx`

Files modified:
- `src/components/TemplateRenderer.tsx`

---

### Commit [[<photo_upload_integration_hash>]] - 2026-05-28 - Photo Upload, Storage & Template Integration
**feat(ux, data): Implement profile photo upload with base64 storage, show/hide toggle, and seamless integration across all 6 templates.**

Allows users to personalize their CV with a professional photo that persists across sessions.

- **Upload UI:** "Ajouter une photo" button in `LeftSidebar` Données tab. Hidden `<input type="file" accept="image/*">`. On selection: reads as `DataURL`, stores in `localStorage` via `savePhoto`.
- **`showPhoto` Toggle:** Checkbox to include/exclude photo from the CV render without deleting it. Persisted separately from the photo data itself.
- **Photo Merge:** `useCVStore` merges photo into `cvData` only when `showPhoto === true` → `cvWithPhoto` object passed to all rendering paths. Photo always stripped from `saveCV` (stored separately).
- **Template Support:** All 6 templates conditionally render `{cvData.photo && <img .../>}` — no empty frame when absent.
- **Export Safety:** PDF export: `html2canvas` uses `useCORS: true` to handle base64 data URLs. Translation: photo stripped before sending to AI, reattached after — prevents base64 bloating the token payload.

Files modified:
- `src/components/LeftSidebar.tsx`
- `src/hooks/useCVStore.ts`
- `src/lib/cvStorage.ts`
- All 6 template files

---

### Commit [[<html_export_engine_hash>]] - 2026-05-29 - HTML Export — Clean Web Version Download
**feat(export): Generate a standalone HTML file embedding the live CV render with all linked stylesheets.**

Lets users share or host a pixel-perfect web version of their CV without any build tooling.

- **`downloadHTML`:** Snapshots `document.getElementById('cv-content').outerHTML`. Collects all `<link rel="stylesheet">` and `<style>` tags from `document.head`. Assembles a valid `<!DOCTYPE html>` document.
- **Clean output:** `html,body { margin:0; padding:0; background:#fff; }` injected to neutralize browser defaults.
- **Full-width rendering:** No `max-width` constraint in export — CV renders edge-to-edge for web viewing.
- **Simplified approach:** No JS toggle, no A4 mode, no pagination — just a clean semantic snapshot. Single-purpose export.

Files created:
- `src/lib/exportHTML.ts`

---

### Commit [[<version_management_hash>]] - 2026-05-29 - Version Management System — Create, Restore & History
**feat(data, ux): Deploy a version snapshot system allowing users to save named checkpoints and restore previous CV states.**

Provides a safety net for destructive AI edits and enables multi-variant CV management.

- **`CVVersion` Type:** `{ id, name, savedAt, data, templateId?, language?, history: CVVersionSnapshot[] }`. History array stores previous snapshots within the same version slot (newest first, capped at 20).
- **`saveVersion`:** Creates a new version entry, prepends to the versions array (capped at 20 total), persists to `localStorage`.
- **`upsertVersion`:** Language-aware upsert — if a version with the same `language` already exists, updates it in place and pushes the old data into `history[]`. Creates a new entry if no match found. Prevents duplicate language versions.
- **Restore Flow:** `restoreVersion` calls `updateCV(v.data)`, optionally restores `templateId` and `activeLanguage`.
- **Toolbar Panel:** Dropdown panel with name input + "Sauvegarder" button. Versions list with flag emoji, name, timestamp, hover-reveal "Restaurer" and delete `×` buttons. History per version shown with "N snaps ▼" expand toggle — clicking shows past snapshots with individual restore buttons.
- **`removeVersion`:** Filters version from localStorage and state.

Files created:
- (logic integrated into existing files)

Files modified:
- `src/lib/cvStorage.ts` (CVVersion, CVVersionSnapshot, upsertVersion)
- `src/hooks/useCVStore.ts` (createVersion, upsertVersion)
- `src/components/Toolbar.tsx` (versions panel UI)

---

### Commit [[<cv_analysis_panel_hash>]] - 2026-05-29 - CV Analysis Panel — AI Scoring & Recommendations
**feat(ai, ux): Launch a structured CV scoring engine with per-section analysis, skill gap identification, and saveable recommendations.**

Gives users actionable intelligence on their CV quality via a dedicated "Analyser" panel.

- **Analysis Schema:** `CVAnalysis` type with `globalScore`, `scores { impact, clarity, keywords, formatting }`, `sections[]` (name, score, comment, suggestions[]), `skills { toHighlight[], missing[] }`, `recommendations[]`, `savedRecommendations[]`.
- **AI Prompt:** System message requesting strict JSON analysis output. Gemini evaluates the full CV and returns structured scoring across all dimensions.
- **`ScoreRing` Component:** SVG circular progress ring rendering the global score with color-coded thresholds (green/amber/red).
- **`ScoreBar` Component:** Horizontal pill bar for sub-scores and section scores.
- **`SectionCard` Component:** Collapsible section card showing score, name, bar, comment, and improvement suggestions. Toggle header rendered as `div[role="button"]` (not `<button>`) to allow nested `<button>` children without HTML nesting violations.
- **Recommendations:** Each recommendation card has a bookmark toggle to save priority axes. Saved recommendations displayed in a dedicated summary block.
- **Re-scoring:** Individual sections can be re-scored without running the full analysis again.
- **Persistence:** Analysis result persisted to `localStorage` via `saveAnalysis` / `loadAnalysis`.

Files created:
- `src/components/AnalysisPanel.tsx`
- `src/lib/analysisStorage.ts`

Files modified:
- `src/components/Sidebar.tsx` (Chat / Analyser tab switcher)

---

### Commit [[<a4_preview_mode_hash>]] - 2026-05-29 - A4 Page Preview Mode — Smart Page Breaks & Separator Overlay
**feat(ux, export): Add a Continu / Pages A4 toggle in the center panel with smart separator lines indicating page boundaries.**

Lets users see exactly where page breaks will occur in the exported PDF without leaving the editor.

- **Toggle Pill:** "Continu" | "Pages A4" pill switcher in center panel header bar. State: `viewMode: 'continuous' | 'a4'`.
- **Continuous Mode:** Standard scrollable preview on `#F4F3F0` background.
- **A4 Mode:** Single `TemplateRenderer` at exactly 794px width on dark `#6E6E6E` background (mimics print environment). No clipping, no pagination — just the full CV with separator overlays.
- **`PageSeparators` Component:** `useEffect` with `ResizeObserver` + `requestAnimationFrame` computes break positions. Renders dashed red lines (`rgba(220,40,40,0.45)`) at each break with page number labels.
- **`findSafeBreak` (DOM-based):** Queries all leaf elements (`wrapper.querySelectorAll('*')` filtered to `children.length === 0`). If a leaf element straddles the ideal break boundary, shifts the separator up to 80px earlier to avoid mid-content cuts.
- **TypeScript Compatibility:** `RefObject<HTMLDivElement | null>` for React 19 compat.

Files modified:
- `src/components/CenterPanel.tsx` (full rewrite)

---

### Commit [[<translation_system_hash>]] - 2026-05-30 - Translation System — AI-Powered Language Switching
**feat(ai, i18n): Implement full CV translation via Gemini with language version caching, and a 6-language picker in the Toolbar.**

Enables users to generate professional translations of their CV with a single click, with automatic version management.

- **Language Picker:** Dropdown in Toolbar with 6 languages: 🇫🇷 Français, 🇬🇧 English, 🇪🇸 Español, 🇩🇪 Deutsch, 🇮🇹 Italiano, 🇵🇹 Português. Current language shown as flag + code button.
- **Translation Flow:** On language switch — (1) auto-save current language state, (2) check if a version exists for the target language (restore it silently if yes), (3) if not, call Gemini to translate.
- **AI Translation Prompt:** Instructs the model to translate `tagline`, `summary`, experience `bullets`, and education `degree` fields. Preserves proper nouns (names, companies, cities).
- **Photo Strip:** Photo (`base64` data URL) stripped from the payload before sending to AI — prevents it from being echoed back and multiplying token usage by 3–10×. Photo reattached after parsing.
- **`maxOutputTokens: 25000`:** Raised from default 4096 to handle large CVs without truncation.
- **`finishReason` Guard:** If Gemini returns `MAX_TOKENS`, translation is aborted with a user-facing error message. Logged with raw tail for debugging.
- **"sauvegardé" Badge:** Language picker shows a subtle "sauvegardé" label next to languages with an existing cached version.

Files modified:
- `src/components/Toolbar.tsx`
- `src/app/api/ai/route.ts` (finishReason logging)

---

### Commit [[<static_section_labels_hash>]] - 2026-05-30 - Static Section Labels — Instant Multi-Language Section Headings
**feat(i18n, templates): Decouple section title translation from AI calls with a static multi-language label map across all 6 templates.**

Section headings (Expérience, Formation, Compétences…) now switch instantly on language change without waiting for the AI translation pipeline.

- **`getSectionLabels(langCode?)`:** Returns a `SectionLabels` object with 8 keys: `summary`, `experience`, `education`, `skills`, `languages`, `hobbies`, `contact`, `expertise`. Static map for: `fr`, `en`, `es`, `pt`, `de`, `it`. Falls back to `en` for unknown codes.
- **All 6 Templates Updated:** Each template accepts `language?: string` prop, calls `getSectionLabels(language)` at the top, and uses `L.experience`, `L.education`, etc. for all section headings.
- **`TemplateRenderer`:** Updated to accept and forward `language?: string` to all template components.
- **`CenterPanel`:** Updated to accept `language?: string` and pass it to `TemplateRenderer`.
- **`cv/page.tsx`:** Passes `store.activeLanguage` to `CenterPanel`.

Files created:
- `src/lib/sectionLabels.ts`

Files modified:
- `src/templates/ClassicTemplate.tsx`
- `src/templates/SidebarDarkTemplate.tsx`
- `src/templates/TealHorizontalTemplate.tsx`
- `src/templates/TealSidebarTemplate.tsx`
- `src/templates/NavyDarkTemplate.tsx`
- `src/templates/PastelSidebarTemplate.tsx`
- `src/components/TemplateRenderer.tsx`
- `src/components/CenterPanel.tsx`
- `src/app/(app)/cv/page.tsx`

---

### Commit [[<language_version_upsert_hash>]] - 2026-05-31 - Language Version Upsert — One Version Per Language with History
**feat(data, ux): Replace create-on-every-save with a language-keyed upsert so each language has exactly one version slot with a scrollable history of past snapshots.**

Prevents version panel clutter and gives users a clean per-language history.

- **`CVVersionSnapshot`:** New type `{ savedAt: string, data: CVData }` for historical snapshots within a version.
- **`upsertVersion` (cvStorage):** If a version with `language === target` already exists, pushes the old `data` into `history[]` (capped at 20) and updates the slot in place. Creates a new slot only on first save for a given language.
- **Store `upsertVersion`:** Accepts optional `overrideData?: CVData` to bypass React's stale closure — critical for correctly saving translated data immediately after `onUpdateCV` (which queues a state update asynchronously).
- **Toolbar Refactor:** All `createVersion` calls replaced with `upsertVersion` for language-related saves. Manual "Sauvegarder" button also upserts the current language slot.
- **History UI:** Each version row shows a "N snaps ▼" toggle button. Clicking expands an indented list of past snapshots with their timestamps and individual "Restaurer" buttons.
- **Suppressed Chat Spam:** Switching to an existing language version no longer adds a "Version X restaurée" message to the chat — restore is silent.

Files modified:
- `src/lib/cvStorage.ts` (CVVersionSnapshot, upsertVersion)
- `src/hooks/useCVStore.ts` (upsertVersion with overrideData)
- `src/components/Toolbar.tsx` (upsertVersion calls, history UI)
- `src/app/(app)/cv/page.tsx` (upsertVersion prop)

---

### Commit [[<fix_max_tokens_photo_strip_hash>]] - 2026-05-31 - Fix: Strip Photo from AI Payload to Eliminate MAX_TOKENS Truncation
**fix(ai, translation): Resolve systematic translation failures caused by base64 photo data inflating the Gemini response token count.**

Root cause identified via `finishReason=MAX_TOKENS` logs: the photo was being included in `JSON.stringify(cvData)` and the model was echoing it back verbatim, producing 39 000+ character responses that were cut off mid-JSON.

- **Root Cause:** `cvData.photo` is a base64-encoded image string (typically 30–60 KB). When serialized into the prompt, Gemini echoes the full base64 blob in its JSON response, consuming the entire token budget before finishing the actual translated content.
- **Fix:** Destructure `{ photo: savedPhoto, ...cvWithoutPhoto }` before the API call. Send only `cvWithoutPhoto`. After parsing the translated JSON, merge `{ ...updated, photo: savedPhoto }` to restore the photo before calling `onUpdateCV`.
- **Impact:** Response payload drops from ~40 000 chars to ~4 000–8 000 chars. No more truncation on real-world CVs. `maxOutputTokens: 25000` retained as a safety ceiling.

Files modified:
- `src/components/Toolbar.tsx`

---

### Commit [[<fix_button_nesting_hash>]] - 2026-05-31 - Fix: Nested Button Hydration Error in SectionCard
**fix(a11y, ui): Resolve "button cannot be a descendant of button" React hydration error in the Sidebar SectionCard component.**

The toggle header (`<button onClick={onToggle}>`) contained a nested re-score `<button>`, which is invalid HTML and triggered a React hydration mismatch in production.

- **Root Cause:** `SectionCard` in `src/components/Sidebar.tsx` used a `<button>` as the collapsible section header wrapper. The re-score action button inside it created an illegal `<button> > <button>` nesting.
- **Fix:** Replaced the outer `<button>` with a `<div role="button" tabIndex={0} onKeyDown={...}>` while keeping the inner re-score `<button>` unchanged. Keyboard navigation preserved via `Enter` key handler.
- **A11y:** `role="button"` + `tabIndex={0}` maintains full keyboard accessibility. `cursor-pointer` added via className to preserve visual affordance.

Files modified:
- `src/components/Sidebar.tsx`
