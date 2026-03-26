(function () {
  "use strict";

  const API_ENDPOINT = window.CVLIFT_TOOLS_API || "https://api.cvlift.me/tool";
  const USAGE_KEY = "cvlift-tools-usage";
  const GATE_KEY = "cvlift-tools-gates";
  const USAGE_LIMIT = 3;

  const STOP_WORDS = {
    a: true, an: true, and: true, are: true, as: true, at: true, be: true, by: true,
    for: true, from: true, has: true, have: true, if: true, in: true, into: true,
    is: true, it: true, of: true, on: true, or: true, that: true, the: true, their: true,
    then: true, there: true, these: true, this: true, to: true, was: true, were: true,
    will: true, with: true, your: true
  };

  const toolDefinitions = {
    "ats-checker": {
      label: "free ats resume checker",
      title: "ATS Score Checker",
      description: "Paste your resume and a target job title to get a keyword match score and improvement guidance.",
      requiresApi: true,
      fields: [
        { id: "jobTitle", label: "Target job title", type: "text", placeholder: "Senior Product Designer", required: true },
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true, required: true }
      ]
    },
    "keyword-density": {
      label: "resume keyword checker free",
      title: "Keyword Density Tool",
      description: "Check keyword frequency and identify terms to reduce or strengthen.",
      requiresApi: false,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true, required: true },
        { id: "jobDescription", label: "Optional job description", type: "textarea", placeholder: "Paste the target job description to compare terms...", full: true }
      ]
    },
    "resume-length": {
      label: "is my resume too long",
      title: "Resume Length Checker",
      description: "Get word count, estimated page count, and a quick length verdict.",
      requiresApi: false,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true, required: true }
      ]
    },
    "salary-lookup": {
      label: "software engineer salary india",
      title: "Salary Lookup Widget",
      description: "Estimate a salary range using role and location context.",
      requiresApi: true,
      fields: [
        { id: "jobTitle", label: "Job title", type: "text", placeholder: "Software Engineer", required: true },
        { id: "location", label: "Location", type: "text", placeholder: "Bangalore, India", required: true },
        { id: "experienceLevel", label: "Experience level", type: "select", required: true, options: [
          { value: "entry", label: "Entry level (0-2 years)" },
          { value: "mid", label: "Mid level (3-6 years)" },
          { value: "senior", label: "Senior level (7+ years)" }
        ] }
      ]
    },
    "subject-line-generator": {
      label: "cover letter email subject line",
      title: "Cover Letter Subject Line Generator",
      description: "Generate application email subject lines in your preferred tone.",
      requiresApi: true,
      fields: [
        { id: "role", label: "Role title", type: "text", placeholder: "Product Manager", required: true },
        { id: "company", label: "Company", type: "text", placeholder: "Stripe", required: true },
        { id: "tone", label: "Tone", type: "select", required: true, options: [
          { value: "formal", label: "Formal" },
          { value: "friendly", label: "Friendly" },
          { value: "bold", label: "Bold" }
        ] }
      ]
    },
    "resume-scorecard": {
      label: "how to grade my resume",
      title: "Resume Scorecard",
      description: "Get section-by-section grades and feedback for the major parts of your resume.",
      requiresApi: true,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true, required: true }
      ]
    },
    "skills-gap": {
      label: "resume skills gap checker",
      title: "Skills Gap Analyser",
      description: "Compare your resume against a target job description and surface missing skills.",
      requiresApi: true,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume here...", full: true, required: true },
        { id: "jobDescription", label: "Target job description", type: "textarea", placeholder: "Paste the job description here...", full: true, required: true }
      ]
    },
    "headline-generator": {
      label: "linkedin headline generator free",
      title: "LinkedIn Headline Generator",
      description: "Generate sharper headline options by role, industry, and skills.",
      requiresApi: true,
      fields: [
        { id: "role", label: "Current or target role", type: "text", placeholder: "Software Engineer", required: true },
        { id: "industry", label: "Industry", type: "text", placeholder: "B2B SaaS", required: true },
        { id: "skills", label: "Top skills (comma-separated)", type: "text", placeholder: "React, TypeScript, System Design", required: true }
      ]
    },
    "jd-decoder": {
      label: "how to read a job description",
      title: "Job Description Decoder",
      description: "Break any job description into must-haves, nice-to-haves, and risk signals.",
      requiresApi: true,
      fields: [
        { id: "jobDescription", label: "Job description", type: "textarea", placeholder: "Paste the job description here...", full: true, required: true }
      ]
    },
    "career-quiz": {
      label: "what career is right for me",
      title: "Career Path Quiz",
      description: "Answer five quick questions to get role-fit suggestions.",
      requiresApi: false,
      fields: [
        { id: "workStyle", label: "1. How do you prefer to work?", type: "select", required: true, options: [
          { value: "analytical", label: "I like analysis, data, and structure" },
          { value: "creative", label: "I like ideas, experimentation, and creativity" },
          { value: "collaborative", label: "I like people-facing collaboration" }
        ] },
        { id: "strength", label: "2. Your strongest skill", type: "select", required: true, options: [
          { value: "writing", label: "Writing and communication" },
          { value: "problem-solving", label: "Problem-solving and logic" },
          { value: "execution", label: "Planning and execution" }
        ] },
        { id: "interest", label: "3. What excites you most?", type: "select", required: true, options: [
          { value: "product", label: "Building products users love" },
          { value: "growth", label: "Growth, marketing, and audience" },
          { value: "operations", label: "Systems, process, and scaling" }
        ] },
        { id: "experience", label: "4. Experience level", type: "select", required: true, options: [
          { value: "entry", label: "Entry level" },
          { value: "mid", label: "Mid level" },
          { value: "senior", label: "Senior level" }
        ] },
        { id: "preference", label: "5. Preferred impact area", type: "select", required: true, options: [
          { value: "technology", label: "Technology and product" },
          { value: "business", label: "Business and strategy" },
          { value: "people", label: "Customer and people outcomes" }
        ] }
      ]
    },
    "bullet-rewriter": {
      label: "improve resume bullet points free",
      title: "Before/After Bullet Rewriter",
      description: "Turn one weak bullet into stronger, quantified variants.",
      requiresApi: true,
      freeRuns: 1,
      fields: [
        { id: "bulletText", label: "Bullet point", type: "textarea", placeholder: "Responsible for managing client accounts and preparing reports.", full: true, required: true }
      ]
    },
    "resume-tailor-preview": {
      label: "resume tailor preview",
      title: "Resume Tailor Preview",
      description: "Preview three targeted edits based on your resume and a job description.",
      requiresApi: true,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume...", full: true, required: true },
        { id: "jobDescription", label: "Job description", type: "textarea", placeholder: "Paste the target job description...", full: true, required: true }
      ]
    },
    "cold-email-generator": {
      label: "cold email generator",
      title: "Cold Email Generator",
      description: "Generate recruiter outreach emails tailored to your target company and role.",
      requiresApi: true,
      freeRuns: 1,
      fields: [
        { id: "company", label: "Target company", type: "text", placeholder: "Notion", required: true },
        { id: "role", label: "Target role", type: "text", placeholder: "Product Designer", required: true },
        { id: "about", label: "One sentence about you", type: "textarea", placeholder: "I am a product designer with 4 years of SaaS experience focused on onboarding and activation.", full: true, required: true }
      ]
    },
    "interview-question-generator": {
      label: "interview question generator",
      title: "Interview Question Generator",
      description: "Generate likely interview questions with practical answer tips.",
      requiresApi: true,
      fields: [
        { id: "role", label: "Role", type: "text", placeholder: "Backend Engineer", required: true },
        { id: "industry", label: "Industry", type: "text", placeholder: "Fintech", required: true },
        { id: "seniority", label: "Seniority", type: "select", required: true, options: [
          { value: "entry", label: "Entry" },
          { value: "mid", label: "Mid" },
          { value: "senior", label: "Senior" }
        ] }
      ]
    },
    "pdf-formatter-preview": {
      label: "resume pdf formatter preview",
      title: "PDF Formatter Preview",
      description: "Preview a cleaned resume format with CVLift watermark.",
      requiresApi: false,
      fields: [
        { id: "resumeText", label: "Resume text", type: "textarea", placeholder: "Paste your resume text here...", full: true, required: true }
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

  function getToolGateState() {
    try {
      const rawValue = localStorage.getItem(GATE_KEY);
      return rawValue ? JSON.parse(rawValue) : {};
    } catch (error) {
      return {};
    }
  }

  let usageState = getInitialUsage();
  let toolGateState = getToolGateState();
  let activeTool = window.location.hash.replace("#", "") || "ats-checker";

  if (!toolDefinitions[activeTool]) {
    activeTool = "ats-checker";
  }

  function saveUsage() {
    localStorage.setItem(USAGE_KEY, JSON.stringify(usageState));
  }

  function saveToolGates() {
    localStorage.setItem(GATE_KEY, JSON.stringify(toolGateState));
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

  function tokenize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(function (word) {
        return word && word.length > 2 && !STOP_WORDS[word];
      });
  }

  function getWordCounts(text) {
    const counts = {};
    tokenize(text).forEach(function (word) {
      counts[word] = (counts[word] || 0) + 1;
    });
    return counts;
  }

  function topEntries(counts, limit) {
    return Object.keys(counts)
      .map(function (word) {
        return { word: word, count: counts[word] };
      })
      .sort(function (a, b) {
        return b.count - a.count;
      })
      .slice(0, limit || 10);
  }

  function setStatus(text) {
    toolPanelStatus.textContent = text;
  }

  function renderInputField(field) {
    if (field.type === "textarea") {
      return '<textarea class="tool_textarea" id="' + field.id + '" name="' + field.id + '" placeholder="' + field.placeholder + '"></textarea>';
    }

    if (field.type === "select") {
      const options = (field.options || []).map(function (option) {
        return '<option value="' + escapeHtml(option.value) + '">' + escapeHtml(option.label) + '</option>';
      }).join("");
      return '<select class="tool_input" id="' + field.id + '" name="' + field.id + '">' + options + '</select>';
    }

    return '<input class="tool_input" id="' + field.id + '" name="' + field.id + '" type="text" placeholder="' + field.placeholder + '"/>';
  }

  function renderFields(toolKey) {
    const definition = toolDefinitions[toolKey];
    toolPanelLabel.textContent = definition.label;
    toolPanelTitle.textContent = definition.title;
    toolPanelDescription.textContent = definition.description;

    toolFields.innerHTML = definition.fields
      .map(function (field) {
        const requiredMark = field.required ? " *" : "";
        return '<div class="tool_field' + (field.full ? ' full' : '') + '"><label class="tool_input_label" for="' + field.id + '">' + field.label + requiredMark + '</label>' + renderInputField(field) + '</div>';
      })
      .join("");
  }

  function renderEmptyState() {
    toolResults.innerHTML = '<div class="tool_empty_state"><h3>Run a tool to see the result</h3><p>Your output appears here with a conversion CTA below it.</p></div>';
  }

  function renderChips(items) {
    return (items || []).map(function (item) {
      return '<span class="result_chip">' + escapeHtml(item) + '</span>';
    }).join("");
  }

  function renderSimpleListWithCopy(items, copyLabel) {
    const html = (items || []).map(function (item) {
      const text = typeof item === "string" ? item : (item.text || "");
      return '<div class="result_rewrite_item"><p class="result_bullet_after">' + escapeHtml(text) + '</p><button type="button" class="result_copy_btn" data-copy="' + escapeHtml(text) + '" data-copy-label="' + escapeHtml(copyLabel || "Copy") + '">' + escapeHtml(copyLabel || "Copy") + '</button></div>';
    }).join("");

    return html || '<div class="result_callout"><p>No items returned.</p></div>';
  }

  function renderAtsResult(result) {
    const matched = renderChips(result.matched_keywords || []);
    const missing = renderChips(result.missing_keywords || []);
    toolResults.innerHTML =
      '<div class="result_grid">' +
        '<div class="result_stat"><div class="result_section_title">Match score</div><div class="result_score">' + escapeHtml(result.score || "0") + '%</div></div>' +
        '<div class="result_stat"><div class="result_section_title">Verdict</div><p>' + escapeHtml(result.verdict || "No verdict returned.") + '</p></div>' +
      '</div>' +
      '<div class="result_list"><div class="result_list_title">Matched keywords</div><div class="chip_list">' + matched + '</div></div>' +
      '<div class="result_list"><div class="result_list_title">Missing keywords</div><div class="chip_list">' + missing + '</div></div>';
  }

  function renderKeywordDensityResult(result) {
    const rows = (result.top_keywords || []).map(function (entry) {
      return '<tr><td>' + escapeHtml(entry.word) + '</td><td>' + escapeHtml(entry.count) + '</td></tr>';
    }).join("");

    toolResults.innerHTML =
      '<div class="result_callout">' +
        '<div class="result_section_title">Keyword frequency (top terms)</div>' +
        '<div class="result_table_wrap"><table class="result_table"><thead><tr><th>Keyword</th><th>Count</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '</div>' +
      '<div class="result_list"><div class="result_list_title">Important missing terms</div><div class="chip_list">' + renderChips(result.missing_terms || []) + '</div></div>' +
      '<div class="result_callout"><div class="result_section_title">Guidance</div><p>' + escapeHtml(result.guidance || "Adjust repeated terms and include job-relevant language where appropriate.") + '</p></div>';
  }

  function renderResumeLengthResult(result) {
    toolResults.innerHTML =
      '<div class="result_grid">' +
        '<div class="result_stat"><div class="result_section_title">Word count</div><div class="result_score">' + escapeHtml(result.word_count) + '</div></div>' +
        '<div class="result_stat"><div class="result_section_title">Estimated pages</div><div class="result_score">' + escapeHtml(result.page_estimate) + '</div></div>' +
      '</div>' +
      '<div class="result_callout"><div class="result_section_title">Verdict</div><p>' + escapeHtml(result.verdict) + '</p></div>' +
      '<div class="result_callout"><div class="result_section_title">Advice</div><p>' + escapeHtml(result.advice) + '</p></div>';
  }

  function renderSalaryResult(result) {
    toolResults.innerHTML =
      '<div class="result_grid">' +
        '<div class="result_stat"><div class="result_section_title">Min</div><div class="result_score">' + escapeHtml(result.min || "-") + '</div></div>' +
        '<div class="result_stat"><div class="result_section_title">Median</div><div class="result_score">' + escapeHtml(result.median || "-") + '</div></div>' +
        '<div class="result_stat"><div class="result_section_title">Max</div><div class="result_score">' + escapeHtml(result.max || "-") + '</div></div>' +
      '</div>' +
      '<div class="result_callout"><div class="result_section_title">Market context</div><p>' + escapeHtml(result.context || "Estimated range from model-based benchmark data.") + '</p></div>';
  }

  function renderSubjectLineResult(result) {
    const lines = result.subject_lines || result.lines || result.subjects || [];
    toolResults.innerHTML = renderSimpleListWithCopy(lines, "Copy subject");
  }

  function renderScorecardResult(result) {
    const sections = ["summary", "experience", "skills", "education", "formatting"];
    const cards = sections.map(function (section) {
      const data = result[section] || {};
      return '<div class="scorecard_item"><div class="result_section_title">' + escapeHtml(section) + '</div><div class="result_grade">' + escapeHtml(data.grade || "-") + '</div><p class="tool_grade_feedback">' + escapeHtml(data.feedback || "No feedback returned.") + '</p></div>';
    }).join("");
    toolResults.innerHTML = '<div class="scorecard_grid">' + cards + '</div>';
  }

  function renderSkillsResult(result) {
    const matched = renderChips(result.matched_skills || result.matched || []);
    const missing = renderChips(result.missing_skills || result.missing || []);
    const priorities = renderChips(result.priority_gaps || []);

    toolResults.innerHTML =
      '<div class="result_list"><div class="result_list_title">Matched skills</div><div class="chip_list">' + matched + '</div></div>' +
      '<div class="result_list"><div class="result_list_title">Missing skills</div><div class="chip_list">' + missing + '</div></div>' +
      '<div class="result_list"><div class="result_list_title">Priority gaps</div><div class="chip_list">' + priorities + '</div></div>';
  }

  function renderHeadlineResult(result) {
    const items = (result.headlines || []).map(function (item) {
      return typeof item === "string" ? item : ((item.tone ? "[" + item.tone + "] " : "") + (item.text || ""));
    });
    toolResults.innerHTML = renderSimpleListWithCopy(items, "Copy headline");
  }

  function renderJdDecoderResult(result) {
    const sections = [
      { key: "must_haves", label: "Must-haves" },
      { key: "nice_to_haves", label: "Nice-to-haves" },
      { key: "hidden_requirements", label: "Hidden requirements" },
      { key: "culture_signals", label: "Culture signals" },
      { key: "red_flags", label: "Red flags" }
    ];

    const blocks = sections.map(function (section) {
      return '<div class="result_list"><div class="result_list_title">' + section.label + '</div><div class="chip_list">' + renderChips(result[section.key] || []) + '</div></div>';
    }).join("");

    toolResults.innerHTML = blocks;
  }

  function renderCareerQuizResult(result) {
    const cards = (result.suggestions || []).map(function (item) {
      return '<div class="result_rewrite_item"><div class="result_section_title">' + escapeHtml(item.role) + ' (' + escapeHtml(item.fit) + '% fit)</div><p>' + escapeHtml(item.reason) + '</p><p class="result_hint">' + escapeHtml(item.next_step) + '</p></div>';
    }).join("");

    toolResults.innerHTML = cards || '<div class="result_callout"><p>No role suggestions generated.</p></div>';
  }

  function renderBulletResult(result, originalBullet) {
    const rewrites = (result.rewrites || []).map(function (item) {
      const safeItem = escapeHtml(item);
      return '<div class="result_rewrite_item"><div class="result_section_title">Before</div><p class="result_bullet_before">' + escapeHtml(originalBullet) + '</p><div class="result_section_title">After</div><p class="result_bullet_after">' + safeItem + '</p><button type="button" class="result_copy_btn" data-copy="' + safeItem + '" data-copy-label="Copy rewrite">Copy rewrite</button></div>';
    }).join("");

    toolResults.innerHTML = rewrites || '<div class="result_callout"><p>No rewrites returned.</p></div>';
  }

  function renderTailorPreviewResult(result) {
    const edits = (result.edits || []).map(function (item, index) {
      const before = item.before || "Current text";
      const after = item.after || "Suggested improved text";
      return '<div class="result_rewrite_item"><div class="result_section_title">Edit ' + (index + 1) + '</div><p class="result_bullet_before">' + escapeHtml(before) + '</p><p class="result_bullet_after">' + escapeHtml(after) + '</p></div>';
    }).join("");

    toolResults.innerHTML =
      (edits || '<div class="result_callout"><p>No edits returned.</p></div>') +
      '<div class="result_callout result_blur_gate"><div class="result_section_title">View 12 more suggestions</div><p>Unlock full role-specific tailoring by signing up.</p></div>';
  }

  function renderColdEmailResult(result) {
    const subject = result.subject || "Application follow-up";
    const body = result.body || "No email body returned.";

    toolResults.innerHTML =
      '<div class="result_callout">' +
        '<div class="result_section_title">Subject</div><p class="result_bullet_after">' + escapeHtml(subject) + '</p>' +
        '<button type="button" class="result_copy_btn" data-copy="' + escapeHtml(subject) + '" data-copy-label="Copy subject">Copy subject</button>' +
      '</div>' +
      '<div class="result_callout"><div class="result_section_title">Email body</div><p>' + escapeHtml(body).replace(/\n/g, "<br/>") + '</p><button type="button" class="result_copy_btn" data-copy="' + escapeHtml(body) + '" data-copy-label="Copy email">Copy email</button></div>';
  }

  function renderInterviewResult(result) {
    const questions = (result.questions || []).map(function (item) {
      const question = typeof item === "string" ? item : (item.question || "");
      const tip = typeof item === "string" ? "Use STAR structure and quantify impact where possible." : (item.tip || item.answer_tip || "Use STAR structure and quantify impact where possible.");
      return '<details class="result_accordion_item"><summary>' + escapeHtml(question) + '</summary><p>' + escapeHtml(tip) + '</p></details>';
    }).join("");

    toolResults.innerHTML = questions || '<div class="result_callout"><p>No interview questions returned.</p></div>';
  }

  function renderPdfPreviewResult(result) {
    const text = result.preview_text || "No preview text generated.";
    toolResults.innerHTML =
      '<div class="result_pdf_preview">' +
        '<div class="result_pdf_watermark">CVLIFT PREVIEW</div>' +
        '<h4>Formatted Resume Preview</h4>' +
        '<p>' + escapeHtml(text).replace(/\n/g, "<br/>") + '</p>' +
      '</div>' +
      '<div class="result_callout"><div class="result_section_title">Download locked</div><p>Sign up to remove watermark and export PDF.</p></div>';
  }

  function renderSetupMessage(errorMessage) {
    toolResults.innerHTML =
      '<div class="result_callout">' +
        '<div class="result_section_title">API not live yet</div>' +
        '<p>This frontend is ready, but the Cloudflare Worker endpoint still needs to be deployed at <strong>api.cvlift.me</strong>.</p>' +
        '<p class="result_hint">' + escapeHtml(errorMessage || "The request could not be completed.") + '</p>' +
      '</div>';
  }

  function renderTier3GateMessage(toolKey) {
    const title = toolDefinitions[toolKey].title;
    toolResults.innerHTML =
      '<div class="result_callout">' +
        '<div class="result_section_title">Free preview limit reached</div>' +
        '<p>You have already used the free preview for ' + escapeHtml(title) + '. Sign up to continue with unlimited runs.</p>' +
        '<p><a href="https://app.cvlift.me/auth" class="sticky_tools_link">Get started free</a></p>' +
      '</div>';
  }

  function localKeywordDensity(payload) {
    const resumeCounts = getWordCounts(payload.resumeText);
    const topResume = topEntries(resumeCounts, 12);
    const jdCounts = getWordCounts(payload.jobDescription || "");
    const jdTop = topEntries(jdCounts, 12).map(function (entry) { return entry.word; });
    const resumeTerms = {};
    topResume.forEach(function (entry) { resumeTerms[entry.word] = true; });

    const missing = jdTop.filter(function (term) {
      return !resumeTerms[term];
    }).slice(0, 8);

    return {
      top_keywords: topResume,
      missing_terms: missing,
      guidance: missing.length ? "Consider weaving missing terms into measurable achievements where truthful." : "Good alignment across top terms. Focus on reducing repetition and adding outcomes."
    };
  }

  function localResumeLength(payload) {
    const words = tokenize(payload.resumeText).length;
    const pages = (words / 500);
    let verdict = "Ideal length";
    let advice = "Your resume length looks balanced. Keep bullet points impact-focused.";

    if (words < 250) {
      verdict = "Too short";
      advice = "Add role context, impact metrics, and key projects so recruiters can assess depth.";
    } else if (words > 900) {
      verdict = "Too long";
      advice = "Trim repetitive bullets and move older/low-relevance items to keep focus on target role fit.";
    }

    return {
      word_count: words,
      page_estimate: pages.toFixed(1),
      verdict: verdict,
      advice: advice
    };
  }

  function localCareerQuiz(payload) {
    const roles = [
      { role: "Product Manager", score: 40, reasons: [] },
      { role: "Growth Marketer", score: 40, reasons: [] },
      { role: "Operations Manager", score: 40, reasons: [] },
      { role: "Software Engineer", score: 40, reasons: [] },
      { role: "Customer Success Manager", score: 40, reasons: [] }
    ];

    function bump(roleName, value, reason) {
      roles.forEach(function (role) {
        if (role.role === roleName) {
          role.score += value;
          role.reasons.push(reason);
        }
      });
    }

    if (payload.workStyle === "analytical") {
      bump("Software Engineer", 20, "You prefer analytical and structured work.");
      bump("Operations Manager", 12, "You align with process and systems thinking.");
    }
    if (payload.workStyle === "creative") {
      bump("Product Manager", 16, "You enjoy experimentation and new ideas.");
      bump("Growth Marketer", 18, "Creative ideation maps well to growth experimentation.");
    }
    if (payload.workStyle === "collaborative") {
      bump("Customer Success Manager", 20, "You prefer cross-functional and people-facing work.");
      bump("Product Manager", 10, "PM work requires deep collaboration with teams.");
    }

    if (payload.strength === "problem-solving") {
      bump("Software Engineer", 18, "Your strength in logic fits technical problem-solving.");
      bump("Product Manager", 10, "Problem framing is core to product decision-making.");
    }
    if (payload.strength === "writing") {
      bump("Growth Marketer", 16, "Strong communication helps messaging and campaigns.");
      bump("Customer Success Manager", 10, "Clear writing supports stakeholder alignment.");
    }
    if (payload.strength === "execution") {
      bump("Operations Manager", 18, "Execution strength maps to operational ownership.");
      bump("Product Manager", 12, "Delivery and prioritisation are core PM strengths.");
    }

    if (payload.interest === "product") {
      bump("Product Manager", 20, "You are excited by product outcomes and user value.");
      bump("Software Engineer", 12, "Product-oriented engineers often excel in this path.");
    }
    if (payload.interest === "growth") {
      bump("Growth Marketer", 22, "You are naturally growth-oriented.");
    }
    if (payload.interest === "operations") {
      bump("Operations Manager", 22, "You are motivated by systems and scale.");
    }

    if (payload.preference === "people") {
      bump("Customer Success Manager", 16, "You prioritize people and customer outcomes.");
    }
    if (payload.preference === "technology") {
      bump("Software Engineer", 14, "You prefer technology-led impact.");
    }
    if (payload.preference === "business") {
      bump("Product Manager", 10, "You like strategy and business impact.");
      bump("Growth Marketer", 10, "You value business growth outcomes.");
    }

    const experienceShift = payload.experience === "entry" ? "Build fundamentals with portfolio projects." :
      payload.experience === "mid" ? "Focus on ownership and measurable outcomes." :
        "Highlight leadership and strategic impact.";

    const suggestions = roles
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 3)
      .map(function (role) {
        return {
          role: role.role,
          fit: Math.min(98, role.score),
          reason: role.reasons[0] || "Your preferences align with this path.",
          next_step: experienceShift
        };
      });

    return { suggestions: suggestions };
  }

  function localPdfPreview(payload) {
    const lines = String(payload.resumeText || "").split(/\n+/).slice(0, 20);
    return {
      preview_text: lines.join("\n")
    };
  }

  function localToolResult(toolKey, payload) {
    if (toolKey === "keyword-density") {
      return localKeywordDensity(payload);
    }
    if (toolKey === "resume-length") {
      return localResumeLength(payload);
    }
    if (toolKey === "career-quiz") {
      return localCareerQuiz(payload);
    }
    if (toolKey === "pdf-formatter-preview") {
      return localPdfPreview(payload);
    }
    return {};
  }

  function renderResult(toolKey, result, payload) {
    if (toolKey === "ats-checker") {
      renderAtsResult(result);
      return;
    }
    if (toolKey === "keyword-density") {
      renderKeywordDensityResult(result);
      return;
    }
    if (toolKey === "resume-length") {
      renderResumeLengthResult(result);
      return;
    }
    if (toolKey === "salary-lookup") {
      renderSalaryResult(result);
      return;
    }
    if (toolKey === "subject-line-generator") {
      renderSubjectLineResult(result);
      return;
    }
    if (toolKey === "resume-scorecard") {
      renderScorecardResult(result);
      return;
    }
    if (toolKey === "skills-gap") {
      renderSkillsResult(result);
      return;
    }
    if (toolKey === "headline-generator") {
      renderHeadlineResult(result);
      return;
    }
    if (toolKey === "jd-decoder") {
      renderJdDecoderResult(result);
      return;
    }
    if (toolKey === "career-quiz") {
      renderCareerQuizResult(result);
      return;
    }
    if (toolKey === "bullet-rewriter") {
      renderBulletResult(result, payload.bulletText || "");
      return;
    }
    if (toolKey === "resume-tailor-preview") {
      renderTailorPreviewResult(result);
      return;
    }
    if (toolKey === "cold-email-generator") {
      renderColdEmailResult(result);
      return;
    }
    if (toolKey === "interview-question-generator") {
      renderInterviewResult(result);
      return;
    }
    if (toolKey === "pdf-formatter-preview") {
      renderPdfPreviewResult(result);
    }
  }

  function collectPayload(toolKey) {
    const definition = toolDefinitions[toolKey];
    const payload = {};

    definition.fields.forEach(function (field) {
      const element = document.getElementById(field.id);
      const value = element ? String(element.value || "").trim() : "";
      payload[field.id] = value;
      if (field.required && !value) {
        throw new Error("Please complete: " + field.label + ".");
      }
    });

    return payload;
  }

  function enforceToolGate(toolKey) {
    const definition = toolDefinitions[toolKey];
    if (!definition.freeRuns) {
      return true;
    }

    const count = toolGateState[toolKey] || 0;
    if (count >= definition.freeRuns) {
      renderTier3GateMessage(toolKey);
      setStatus("Limit reached");
      return false;
    }

    return true;
  }

  function incrementToolGate(toolKey) {
    const definition = toolDefinitions[toolKey];
    if (!definition.freeRuns) {
      return;
    }

    toolGateState[toolKey] = (toolGateState[toolKey] || 0) + 1;
    saveToolGates();
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
    selectorButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-tool") === toolKey);
    });
    renderFields(toolKey);
    renderEmptyState();
    setStatus("Ready");
  }

  selectorButtons.forEach(function (button) {
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
      if (!enforceToolGate(activeTool)) {
        return;
      }

      setStatus("Running");
      toolResults.innerHTML = '<div class="result_callout"><div class="result_section_title">Working</div><p>Generating your result now...</p></div>';

      let result;
      if (toolDefinitions[activeTool].requiresApi) {
        const response = await callToolApi(activeTool, payload);
        result = response.result || response;
      } else {
        result = localToolResult(activeTool, payload);
      }

      renderResult(activeTool, result, payload);
      setStatus("Completed");
      incrementUsage();
      incrementToolGate(activeTool);
    } catch (error) {
      if (!toolDefinitions[activeTool].requiresApi) {
        toolResults.innerHTML = '<div class="result_callout"><div class="result_section_title">Unable to run tool</div><p>' + escapeHtml(error.message) + '</p></div>';
        setStatus("Needs input");
        return;
      }
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
