let lastCase = null;

function processCase() {
  const get = (id) => document.getElementById(id).value.trim();
  const checked = (id) => document.getElementById(id).checked;
  const result = document.getElementById("result");
  document.getElementById("saveMsg").textContent = "";

  // ---------- 1. VALIDITY CHECK ----------
  const missing = [];
  if (!get("patient") && !get("age") && !get("sex")) missing.push("Identifiable patient");
  if (!get("reporter")) missing.push("Identifiable reporter");
  if (!get("drug")) missing.push("Suspect drug");
  if (!get("event")) missing.push("Adverse event");

  if (missing.length > 0) {
    lastCase = null;
    result.innerHTML =
      '<div class="box red"><b>Invalid case.</b> Missing: ' +
      missing.join(", ") +
      '.<br>The clock starts only when all four minimum criteria are received.</div>';
    return;
  }

  // ---------- 2. SERIOUSNESS ----------
  const criteria = [];
  if (checked("death")) criteria.push("Death");
  if (checked("lifethreat")) criteria.push("Life-threatening");
  if (checked("hosp")) criteria.push("Hospitalization");
  if (checked("disability")) criteria.push("Persistent disability");
  if (checked("congenital")) criteria.push("Congenital anomaly");
  if (checked("medimp")) criteria.push("Other medically important");

  const isSerious = criteria.length > 0;
  const seriousnessText = isSerious
    ? "Serious (" + criteria.join(", ") + ")"
    : "Non-serious";

  // ---------- 3. DEADLINE ----------
  let deadlineHTML = "";
  let dueISO = "";
  let deadlineDays = 0;

  if (!get("receiptDate")) {
    deadlineHTML = '<div class="box amber"><b>Deadline:</b> Enter the date of receipt to calculate the due date.</div>';
  } else {
    let days = 90;
    if (checked("death") || checked("lifethreat")) {
      days = 7;
    } else if (isSerious) {
      days = 15;
    }
    deadlineDays = days;

    const due = new Date(get("receiptDate") + "T00:00:00");
    due.setDate(due.getDate() + days);

    dueISO =
      due.getFullYear() + "-" +
      String(due.getMonth() + 1).padStart(2, "0") + "-" +
      String(due.getDate()).padStart(2, "0");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.round((due - today) / (1000 * 60 * 60 * 24));

    let colour = "green";
    let status = daysLeft + " days remaining";
    if (daysLeft < 0) {
      colour = "red";
      status = "OVERDUE by " + Math.abs(daysLeft) + " days";
    } else if (daysLeft <= 3) {
      colour = "amber";
    }

    deadlineHTML =
      '<div class="box ' + colour + '"><b>Deadline:</b> ' + days +
      "-day timeline. Due date: " + due.toDateString() + "<br>" + status + "</div>";
  }

  // ---------- 4. CAUSALITY (WHO-UMC, simplified) ----------
  const timeRel = get("timeRel");
  const otherCauses = get("otherCauses");
  const dechallenge = get("dechallenge");
  const rechallenge = get("rechallenge");

  let causality = "Unassessable (answer the causality questions)";
  if (timeRel === "no") {
    causality = "Unlikely";
  } else if (timeRel === "yes" && otherCauses !== "") {
    if (otherCauses === "no" && dechallenge === "yes" && rechallenge === "yes") {
      causality = "Certain";
    } else if (otherCauses === "no" && dechallenge === "yes") {
      causality = "Probable / Likely";
    } else {
      causality = "Possible";
    }
  }

  // ---------- 5. TERM CODING + EXPECTEDNESS ----------
  const drugKey = get("drug").toLowerCase();
  const eventKey = get("event").toLowerCase();

  let codedTerm = get("event");
  let codingText = "Not in demo dictionary, used as entered";
  if (terms[eventKey]) {
    codedTerm = terms[eventKey].pt;
    codingText = terms[eventKey].pt + " (" + terms[eventKey].soc + ")";
  }

  let expectedness;
  if (!drugs[drugKey]) {
    expectedness = "Cannot assess (drug not in demo database)";
  } else if (drugs[drugKey].includes(codedTerm.toLowerCase())) {
    expectedness = "Listed (expected)";
  } else {
    expectedness = "Unlisted (unexpected)";
  }

  // ---------- 6. NARRATIVE ----------
  const age = get("age") ? get("age") + "-year-old " : "";
  const sex = get("sex") ? get("sex") + " " : "";
  const dose = get("dose") ? " (" + get("dose") + ")" : "";
  const onset = get("onsetDate") ? " on " + get("onsetDate") : "";
  const outcome = get("outcome");

  const narrative =
    "A " + age + sex + "patient received " + get("drug") + dose +
    " and experienced " + get("event") + onset +
    ". The case was reported by " + get("reporter") +
    ". The event was assessed as " + seriousnessText.toLowerCase() +
    " and " + expectedness.toLowerCase() +
    ", with causality " + causality +
    ". Outcome: " + outcome + ".";

  // ---------- REMEMBER THIS CASE (for saving) ----------
  lastCase = {
    drug: get("drug"),
    event: get("event"),
    seriousness: isSerious ? "Serious" : "Non-serious",
    expectedness: expectedness,
    causality: causality,
    dueDate: dueISO,
    days: deadlineDays
  };

  // ---------- SHOW RESULT ----------
  result.innerHTML =
    '<div class="box green"><b>Valid case.</b> All four minimum criteria are present.</div>' +
    '<div class="box"><b>Seriousness:</b> ' + seriousnessText + "</div>" +
    '<div class="box"><b>Coded term (demo):</b> ' + codingText + "<br><b>Expectedness:</b> " + expectedness + "</div>" +
    '<div class="box"><b>Causality (WHO-UMC):</b> ' + causality + "</div>" +
    deadlineHTML +
    '<div class="box"><b>Narrative:</b><br>' + narrative + "</div>";
}

// ---------- SAVE CASE ----------
function saveCase() {
  const msg = document.getElementById("saveMsg");
  if (!lastCase) {
    msg.textContent = "Process a valid case first, then save it.";
    return;
  }

  const cases = JSON.parse(localStorage.getItem("cases")) || [];
  let counter = Number(localStorage.getItem("caseCounter")) || 0;
  counter++;
  localStorage.setItem("caseCounter", counter);

  const newCase = Object.assign({}, lastCase, {
    id: "ICSR-" + String(counter).padStart(3, "0")
  });

  cases.push(newCase);
  localStorage.setItem("cases", JSON.stringify(cases));

  msg.textContent = "Saved as " + newCase.id;
  lastCase = null;
  showTracker();
}

// ---------- DELETE CASE ----------
function deleteCase(id) {
  let cases = JSON.parse(localStorage.getItem("cases")) || [];
  cases = cases.filter(function (c) { return c.id !== id; });
  localStorage.setItem("cases", JSON.stringify(cases));
  showTracker();
}

// ---------- SHOW TRACKER ----------
function showTracker() {
  const cases = JSON.parse(localStorage.getItem("cases")) || [];
  const box = document.getElementById("tracker");

  if (cases.length === 0) {
    box.innerHTML = "<p>No saved cases yet.</p>";
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = cases.map(function (c) {
    let daysLeft = null;
    if (c.dueDate) {
      daysLeft = Math.round((new Date(c.dueDate + "T00:00:00") - today) / (1000 * 60 * 60 * 24));
    }
    return { c: c, daysLeft: daysLeft };
  });

  rows.sort(function (a, b) {
    const x = a.daysLeft === null ? 99999 : a.daysLeft;
    const y = b.daysLeft === null ? 99999 : b.daysLeft;
    return x - y;
  });

  let html =
    '<div class="table-wrap"><table><tr><th>Case ID</th><th>Drug</th><th>Event</th>' +
    "<th>Seriousness</th><th>Expectedness</th><th>Due date</th><th>Status</th><th></th></tr>";

  rows.forEach(function (r) {
    let status = "No receipt date";
    let cls = "";
    if (r.daysLeft !== null) {
      if (r.daysLeft < 0) {
        status = "OVERDUE by " + Math.abs(r.daysLeft) + " days";
        cls = "rowred";
      } else if (r.daysLeft <= 3) {
        status = r.daysLeft + " days left";
        cls = "rowamber";
      } else {
        status = r.daysLeft + " days left";
        cls = "rowgreen";
      }
    }

    html +=
      '<tr class="' + cls + '">' +
      "<td>" + r.c.id + "</td>" +
      "<td>" + r.c.drug + "</td>" +
      "<td>" + r.c.event + "</td>" +
      "<td>" + r.c.seriousness + "</td>" +
      "<td>" + (r.c.expectedness || "-") + "</td>" +
      "<td>" + (r.c.dueDate || "-") + "</td>" +
      "<td>" + status + "</td>" +
      '<td><button type="button" class="small" onclick="deleteCase(\'' + r.c.id + '\')">Delete</button></td>' +
      "</tr>";
  });

  html += "</table></div>";
  box.innerHTML = html;
}

// Show saved cases when the page opens
showTracker();