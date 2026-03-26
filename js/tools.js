(function () {
  "use strict";

  const API_ENDPOINT = window.CVLIFT_TOOLS_API || "https://api.cvlift.me/tool";
  const USAGE_KEY = "cvlift-tools-usage";
  const USAGE_LIMIT = 3;

  const toolDefinitions = {
    "ats-checker": {
      label: "free ats resume checker",
      title: "ATS Score Checker",
      description: "Paste your resume and a target job title to get a keyword match score and improvement guidance.",
      fields: [
        { id: "jobTitle", label: "Target job title", type: "text", placeholder: "Senior Product Designer" },
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true }
      ]
    },
    "resume-scorecard": {
      label: "how to grade my resume",
      title: "Resume Scorecard",
      description: "Get section-by-section grades and feedback for the major parts of your resume.",
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true }
      ]
    },
    "bullet-rewriter": {
      label: "improve resume bullet points free",
      title: "Before/After Bullet Rewriter",
      description: "Turn one weak bullet into stronger, more quantified variants.",
      fields: [
        { id: "bulletText", label: "Bullet point", type: "textarea", placeholder: "Responsible for managing client accounts and preparing reports.", full: true }
      ]
    },
    "headline-generator": {
      label: "linkedin headline generator free",
      title: "LinkedIn Headline Generator",
      description: "Generate sharper headline options from your role and industry.",
      fields: [
        { id: "role", label: "Current or target role", type: "text", placeholder: "Software Engineer" },
        { id: "industry", label: "Industry", type: "text", placeholder: "B2B SaaS" }
      ]
    },
    "skills-gap": {
      label: "resume skills gap checker",
      title: "Skills Gap Analyser",
      description: "Compare your resume against a target job description and surface missing skills.",
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true },
        { id: "jobDescription", label: "Target job description", type: "textarea", placeholder: "Paste the job description here...", full: true }
      ]
    }
  };

  const selectorButtons = Array.from(document.querySelectorAll(".tool_card"));
  const toolFields = document.getElementById("toolFields");
  const toolForm = document.getElementById("toolForm");
  const toolResults = document.getElementById("toolResults");
  const toolPanelLabel = document.getElementById("toolPanelLabel");
  const toolPanelTitle = document.getElementById("toolPanelTitle");
  const toolPanelDescription = document.getElementById("toolPanelDescription");
  const toolPanelStatus = document.getElementById("toolPanelStatus");
  const stickyToolsBanner = document.getElementById("stickyToolsBanner");
  const usageModal = document.getElementById("usageModal");

  if (!toolFields || !toolForm || !toolResults) {
    return;
  }

  function getInitialUsage() {
    try {
      const rawValue = localStorage.getItem(USAGE_KEY);
      if (!rawValue) {
        return { date: new Date().toDateString(), count: 0 };
      }
      const parsed = JSON.parse(rawValue);
      if (parsed.date !== new Date().toDateString()) {
        return { date: new Date().toDateString(), count: 0 };
      }
      return parsed;
    } catch (error) {
      return { date: new Date().toDateString(), count: 0 };
    }
  }

  let usageState = getInitialUsage();
  let activeTool = window.location.hash.replace("#", "") || "ats-checker";
  if (!toolDefinitions[activeTool]) {
    activeTool = "ats-checker";
  }

  function saveUsage() {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usageState));
  }

  function incrementUsage() {
    usageState.count += 1;
    saveUsage();
    if (usageState.count >= 1 && stickyToolsBanner) {
      stickyToolsBanner.hidden = false;
    }
    if (usageState.count >= USAGE_LIMIT) {
      openModal();
    }
  }

  function openModal() {
    if (usageModal) {
      usageModal.hidden = false;
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (usageModal) {
      usageModal.hidden = true;
      document.body.style.overflow = "";
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setStatus(text) {
    toolPanelStatus.textContent = text;
  }

  function renderFields(toolKey) {
    const definition = toolDefinitions[toolKey];
    toolPanelLabel.textContent = definition.label;
    toolPanelTitle.textContent = definition.title;
    toolPanelDescription.textContent = definition.description;

    toolFields.innerHTML = definition.fields
      .map((field) => {
        const input = field.type === "textarea"
          ? '<textarea class="tool_textarea" id="' + field.id + '" name="' + field.id + '" placeholder="' + field.placeholder + '"></textarea>'
          : '<input class="tool_input" id="' + field.id + '" name="' + field.id + '" type="text" placeholder="' + field.placeholder + '"/>';
        return '<div class="tool_field' + (field.full ? ' full' : '') + '"><label class="tool_input_label" for="' + field.id + '">' + field.label + '</label>' + input + '</div>';
      })
      .join("");
  }

  function renderEmptyState() {
    toolResults.innerHTML = '<div class="tool_empty_state"><h3>Run a tool to see the result</h3><p>Your output appears here with a conversion CTA below it.</p></div>';
  }

  function renderAtsResult(result) {
    const matched = (result.matched_keywords || []).map((item) => '<span class="result_chip">' + escapeHtml(item) + '</span>').join("");
    const missing = (result.missing_keywords || []).map((item) => '<span class="result_chip">' + escapeHtml(item) + '</span>').join("");
    toolResults.innerHTML =
      '<div class="result_grid">' +
        '<div class="result_stat"><div class="result_section_title">Match score</div><div class="result_score">' + escapeHtml(result.score || "0") + '%</div></div>' +
        '<div class="result_stat"><div class="result_section_title">Verdict</div><p>' + escapeHtml(result.verdict || "No verdict returned.") + '</p></div>' +
      '</div>' +
      '<div class="result_list"><div class="result_list_title">Matched keywords</div><div class="chip_list">' + matched + '</div></div>' +
      '<div class="result_list"><div class="result_list_title">Missing keywords</div><div class="chip_list">' + missing + '</div></div>';
  }

  function renderScorecardResult(result) {
    const sections = ["summary", "experience", "skills", "education", "formatting"];
    const cards = sections.map((section) => {
      const data = result[section] || {};
      return '<div class="scorecard_item"><div class="result_section_title">' + escapeHtml(section) + '</div><div class="result_grade">' + escapeHtml(data.grade || "-") + '</div><p class="tool_grade_feedback">' + escapeHtml(data.feedback || "No feedback returned.") + '</p></div>';
    }).join("");
    toolResults.innerHTML = '<div class="scorecard_grid">' + cards + '</div>';
  }

  function renderBulletResult(result, originalBullet) {
    const rewrites = (result.rewrites || []).map((item) => {
      const safeItem = escapeHtml(item);
      return '<div class="result_rewrite_item"><div class="result_section_title">Before</div><p class="result_bullet_before">' + escapeHtml(originalBullet) + '</p><div class="result_section_title">After</div><p class="result_bullet_after">' + safeItem + '</p><button type="button" class="result_copy_btn" data-copy="' + safeItem + '" data-copy-label="Copy rewrite">Copy rewrite</button></div>';
    }).join("");
    toolResults.innerHTML = rewrites || '<div class="result_callout"><p>No rewrites returned.</p></div>';
  }

  function renderHeadlineResult(result) {
    const headlines = (result.headlines || []).map((item) => '<div class="result_rewrite_item"><p class="result_bullet_after">' + escapeHtml(item) + '</p><button type="button" class="result_copy_btn" data-copy="' + escapeHtml(item) + '" data-copy-label="Copy headline">Copy headline</button></div>').join("");
    toolResults.innerHTML = headlines || '<div class="result_callout"><p>No headlines returned.</p></div>';
  }

  function renderSkillsResult(result) {
    const matched = (result.matched_skills || []).map((item) => '<span class="result_chip">' + escapeHtml(item) + '</span>').join("");
    const missing = (result.missing_skills || []).map((item) => '<span class="result_chip">' + escapeHtml(item) + '</span>').join("");
    toolResults.innerHTML =
      '<div class="result_list"><div class="result_list_title">Matched skills</div><div class="chip_list">' + matched + '</div></div>' +
      '<div class="result_list"><div class="result_list_title">Missing skills</div><div class="chip_list">' + missing + '</div></div>' +
      '<div class="result_callout"><div class="result_section_title">Verdict</div><p>' + escapeHtml(result.verdict || "No verdict returned.") + '</p></div>';
  }

  function renderSetupMessage(errorMessage) {
    toolResults.innerHTML =
      '<div class="result_callout">' +
        '<div class="result_section_title">API not live yet</div>' +
        '<p>This frontend is ready, but the Cloudflare Worker endpoint still needs to be deployed at <strong>api.cvlift.me</strong>.</p>' +
        '<p class="result_hint">' + escapeHtml(errorMessage || "The request could not be completed.") + '</p>' +
      '</div>';
  }

  function renderResult(toolKey, result, payload) {
    if (toolKey === "ats-checker") {
      renderAtsResult(result);
      return;
    }
    if (toolKey === "resume-scorecard") {
      renderScorecardResult(result);
      return;
    }
    if (toolKey === "bullet-rewriter") {
      renderBulletResult(result, payload.bulletText || "");
      return;
    }
    if (toolKey === "headline-generator") {
      renderHeadlineResult(result);
      return;
    }
    if (toolKey === "skills-gap") {
      renderSkillsResult(result);
    }
  }

  function collectPayload(toolKey) {
    const definition = toolDefinitions[toolKey];
    const payload = {};
    let hasContent = false;

    definition.fields.forEach((field) => {
      const element = document.getElementById(field.id);
      const value = element ? element.value.trim() : "";
      payload[field.id] = value;
      if (value) {
        hasContent = true;
      }
    });

    if (!hasContent) {
      throw new Error("Add some input before running the tool.");
    }

    return payload;
  }

  async function callToolApi(toolKey, payload) {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tool: toolKey,
        input: payload
      })
    });

    if (response.status === 429) {
      openModal();
      throw new Error("Rate limit reached. Sign up to keep using the tools.");
    }

    if (!response.ok) {
      throw new Error("Tool request failed with status " + response.status + ".");
    }

    return response.json();
  }

  function selectTool(toolKey) {
    activeTool = toolKey;
    window.location.hash = toolKey;
    selectorButtons.forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-tool") === toolKey);
    });
    renderFields(toolKey);
    renderEmptyState();
    setStatus("Ready");
  }

  selectorButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const toolKey = this.getAttribute("data-tool");
      if (toolDefinitions[toolKey]) {
        selectTool(toolKey);
      }
    });
  });

  window.addEventListener("hashchange", function () {
    const nextTool = window.location.hash.replace("#", "");
    if (toolDefinitions[nextTool] && nextTool !== activeTool) {
      selectTool(nextTool);
    }
  });

  toolForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
      const payload = collectPayload(activeTool);
      setStatus("Running");
      toolResults.innerHTML = '<div class="result_callout"><div class="result_section_title">Working</div><p>Generating your result now...</p></div>';
      const response = await callToolApi(activeTool, payload);
      const result = response.result || response;
      renderResult(activeTool, result, payload);
      setStatus("Completed");
      incrementUsage();
    } catch (error) {
      setStatus("Needs API");
      renderSetupMessage(error.message);
    }
  });

  document.addEventListener("click", function (event) {
    const closeTrigger = event.target.closest("[data-close-modal='true']");
    if (closeTrigger) {
      closeModal();
      return;
    }

    const copyButton = event.target.closest("[data-copy]");
    if (copyButton && navigator.clipboard) {
      navigator.clipboard.writeText(copyButton.getAttribute("data-copy"));
      copyButton.textContent = "Copied";
      window.setTimeout(function () {
        copyButton.textContent = copyButton.getAttribute("data-copy-label") || "Copy";
      }, 1200);
    }
  });

  if (usageState.count >= 1 && stickyToolsBanner) {
    stickyToolsBanner.hidden = false;
  }

  selectTool(activeTool);
})();