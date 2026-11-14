/* VV-2028 interactive datasheet: decap showpiece */
(function () {
  const SVGNS = "http://www.w3.org/2000/svg";
  const stage = document.getElementById("stage");
  const die = document.getElementById("die");
  const detail = document.getElementById("detail");
  const detailBody = document.getElementById("detailBody");
  const crumbBlock = stage.querySelector(".crumb-block");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let logTimer = null;

  /* ---------- draw package pins and die bond pads ---------- */
  function rect(g, x, y, w, h) {
    const r = document.createElementNS(SVGNS, "rect");
    r.setAttribute("x", x); r.setAttribute("y", y);
    r.setAttribute("width", w); r.setAttribute("height", h);
    g.appendChild(r);
  }
  const pins = document.getElementById("pins");
  for (let i = 0; i < 12; i++) {
    const p = 182 + i * 40;
    rect(pins, p - 9, 112, 18, 30);   // top
    rect(pins, p - 9, 658, 18, 30);   // bottom
    rect(pins, 112, p - 9, 30, 18);   // left
    rect(pins, 658, p - 9, 30, 18);   // right
  }
  const pads = document.getElementById("pads");
  for (let i = 0; i < 13; i++) {
    const p = 166 + i * 39;
    rect(pads, p - 7, 134, 14, 14);
    rect(pads, p - 7, 652, 14, 14);
    rect(pads, 134, p - 7, 14, 14);
    rect(pads, 652, p - 7, 14, 14);
  }

  /* ---------- block content ---------- */
  const schematic = `
  <svg class="sch" viewBox="0 0 340 300" role="img" aria-label="Schematic: inductively degenerated common-source LNA">
    <!-- VDD and load inductor -->
    <line x1="180" y1="22" x2="240" y2="22"/>
    <text x="246" y="27">V<tspan font-size="9" dy="4">DD</tspan></text>
    <line x1="210" y1="22" x2="210" y2="38"/>
    <path class="acc" d="M210 38 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20"/>
    <text x="226" y="74" class="lab">L<tspan font-size="9" dy="4">d</tspan></text>
    <line x1="210" y1="98" x2="210" y2="126"/>
    <circle class="node" cx="210" cy="112" r="3.5"/>
    <!-- output coupling cap -->
    <line x1="210" y1="112" x2="262" y2="112"/>
    <line x1="262" y1="100" x2="262" y2="124"/>
    <line x1="270" y1="100" x2="270" y2="124"/>
    <line x1="270" y1="112" x2="322" y2="112"/>
    <text x="276" y="100">RF<tspan font-size="9" dy="4">out</tspan></text>
    <!-- NMOS M1 -->
    <line x1="210" y1="126" x2="186" y2="126"/>
    <line x1="186" y1="122" x2="186" y2="178"/>
    <line x1="176" y1="126" x2="176" y2="174"/>
    <line x1="186" y1="174" x2="210" y2="174"/>
    <polyline points="198,169 206,174 198,179"/>
    <text x="216" y="156" class="lab">M<tspan font-size="9" dy="4">1</tspan></text>
    <!-- gate input path with Lg -->
    <line x1="18" y1="150" x2="60" y2="150"/>
    <text x="10" y="138">RF<tspan font-size="9" dy="4">in</tspan></text>
    <path class="acc" d="M60 150 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0 a10 10 0 0 1 20 0"/>
    <text x="80" y="128" class="lab">L<tspan font-size="9" dy="4">g</tspan></text>
    <line x1="120" y1="150" x2="176" y2="150"/>
    <!-- source degeneration Ls -->
    <line x1="210" y1="174" x2="210" y2="196"/>
    <path class="acc" d="M210 196 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20 a10 10 0 0 1 0 20"/>
    <text x="226" y="232" class="lab">L<tspan font-size="9" dy="4">s</tspan></text>
    <line x1="210" y1="256" x2="210" y2="270"/>
    <line x1="194" y1="270" x2="226" y2="270"/>
    <line x1="200" y1="277" x2="220" y2="277"/>
    <line x1="206" y1="284" x2="214" y2="284"/>
    <!-- animated signal path -->
    <polyline class="sig" points="18,150 176,150"/>
    <polyline class="sig" points="214,112 322,112"/>
  </svg>`;

  const BLOCKS = {
    rf: {
      name: "RF front end",
      kind: "IEEE Electron Devices Society, Aug 2026 to present",
      title: "5.8 GHz low-noise amplifier",
      body: `<p>The LNA is the first amplifier a wireless signal meets. Its job is to add gain while adding as little noise as possible.</p>
        <ul>
          <li>Inductively degenerated common-source topology: L<sub>s</sub> creates a real input resistance to match 50&nbsp;&Omega; without a noisy resistor.</li>
          <li>Setting the bias of M<sub>1</sub> and the input/output matching for gain and noise figure at 5.8&nbsp;GHz.</li>
          <li>Trading off gain, noise figure, linearity, power and stability, then verifying across the band in simulation.</li>
        </ul>`,
      fig: `<figure class="fig">${schematic}<figcaption><b>Figure 2.</b> Simplified topology. The dashed line traces the signal path.</figcaption></figure>`
    },
    dice: {
      name: "Timing & logic",
      kind: "ECE 20007 mini-project, Nov 2026",
      title: "555 timer electronic dice",
      body: `<p>Press the button and six LEDs spin fast enough to blur, then land on a random face about three seconds after release.</p>
        <ul>
          <li>Monostable 555 roll timer (t = 1.1RC = 2.97&nbsp;s) holds the clock out of reset while the die spins.</li>
          <li>Astable 555 clock steps a CD74HC4017 decade counter; wiring Q6 back to reset limits it to six faces.</li>
          <li>Sized every RC network by hand, simulated in LTspice, then verified each stage on an oscilloscope.</li>
          <li>Debugged a clock that wouldn't oscillate by measuring pin voltages one block at a time, and flagged a 2.98&nbsp;V clock high level below the 4017's 3.5&nbsp;V input spec as a noise-margin risk.</li>
        </ul>
        <p><a class="proj-open" href="https://drive.google.com/file/d/1I2v0BolJJitAPWBkBIefgOz70AKBWhkS/view?usp=sharing" target="_blank" rel="noopener">Watch the demo video</a></p>`,
      fig: `<figure class="fig"><svg class="sch" viewBox="0 0 360 236" role="img" aria-label="Block diagram: button press triggers a 555 one-shot roll timer, which releases the reset on a 555 astable clock, which steps a CD74HC4017 counter driving six LEDs">
          <text x="10" y="14" font-size="12">button press</text>
          <line x1="85" y1="18" x2="85" y2="30" class="acc"/>
          <rect x="10" y="30" width="150" height="54" fill="#141B2C" stroke="#45557A" stroke-width="2"/>
          <text x="85" y="53" text-anchor="middle" font-size="13" style="fill:#E4E8F0">555 one-shot</text>
          <text x="85" y="72" text-anchor="middle" font-size="11">roll timer, 2.97 s</text>
          <line x1="160" y1="57" x2="200" y2="57" class="acc"/>
          <text x="180" y="49" text-anchor="middle" font-size="11">RST</text>
          <rect x="200" y="30" width="150" height="54" fill="#141B2C" stroke="#45557A" stroke-width="2"/>
          <text x="275" y="53" text-anchor="middle" font-size="13" style="fill:#E4E8F0">555 astable</text>
          <text x="275" y="72" text-anchor="middle" font-size="11">clock, ~40 Hz</text>
          <line x1="275" y1="84" x2="275" y2="110" class="acc"/>
          <text x="283" y="101" font-size="11">CLK</text>
          <rect x="200" y="110" width="150" height="54" fill="#141B2C" stroke="#D08C4E" stroke-width="2"/>
          <text x="275" y="133" text-anchor="middle" font-size="13" style="fill:#E4E8F0">CD74HC4017</text>
          <text x="275" y="152" text-anchor="middle" font-size="11">Q6 &#8594; RST: 6 faces</text>
          <polyline points="200,137 30,137 30,178" class="acc"/>
          <line x1="30" y1="178" x2="330" y2="178"/>
          ${[0,1,2,3,4,5].map(i=>`<line x1="${30+i*60}" y1="178" x2="${30+i*60}" y2="188"/><circle cx="${30+i*60}" cy="198" r="10" fill="${i===3?'#E58C7A':'#2A3550'}" stroke="#45557A"/><text x="${30+i*60}" y="228" text-anchor="middle" font-size="11">${i+1}</text>`).join("")}
        </svg>
        <table class="matrix" style="margin-top:10px">
          <thead><tr><th>Measurement</th><th>Calc.</th><th>Measured</th><th>Error</th></tr></thead>
          <tbody>
            <tr><td>Roll pulse</td><td>2.97 s</td><td>2.99 s</td><td class="pass">+0.6%</td></tr>
            <tr><td>One-shot (CP1)</td><td>2.97 s</td><td>2.931 s</td><td class="pass">&minus;1.3%</td></tr>
            <tr><td>Astable duty</td><td>59.5%</td><td>60.2%</td><td class="pass">+1.2%</td></tr>
            <tr><td>Q0 duty (1/6)</td><td>16.7%</td><td>16.2%</td><td class="pass">&minus;2.8%</td></tr>
          </tbody></table>
        <p class="cap"><b>Figure 3.</b> Block diagram and measured results from the lab write-up.</p></figure>`
    },
    test: {
      name: "Validation",
      kind: "Purdue Rocket Propulsion Lab, Aug 2025 to Aug 2026",
      title: "Hardware test campaigns",
      body: `<p>Supported the rotating detonation engine team by turning test runs into data the team could trust.</p>
        <ul>
          <li>Built test matrices with six fields for every run, so each test had measurable pass/fail criteria.</li>
          <li>Used Python and MATLAB to organize inputs, review run data and compare operating conditions.</li>
          <li>Cross-checked inputs and outputs to catch inconsistencies before analysis.</li>
          <li>Helped standardize a five-stage workflow from planning through documentation.</li>
        </ul>`,
      fig: `<figure class="fig"><table class="matrix">
          <thead><tr><th>Test point</th><th>Variable</th><th>Config</th><th>Expected</th><th>Result</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>TP-01</td><td>Ctrl A</td><td>Base</td><td>In range</td><td class="pass">Pass</td><td>Logged</td></tr>
            <tr><td>TP-02</td><td>Ctrl A</td><td>Mod 1</td><td>In range</td><td class="fail">Fail</td><td>Re-run</td></tr>
            <tr><td>TP-03</td><td>Ctrl B</td><td>Mod 1</td><td>In range</td><td class="pend">Pending</td><td>Queued</td></tr>
          </tbody></table>
          <p class="cap"><b>Figure 4.</b> The six-field matrix layout. Values are illustrative.</p></figure>`
    },
    compute: {
      name: "Compute core",
      kind: "Personal project, Jul 2026",
      title: "Automated paper trading system",
      body: `<p>A Python system that runs the Silver Bullet strategy at about $10,000 in simulated daily volume.</p>
        <ul>
          <li>Pulls market data and places orders through the Alpaca and Polygon APIs.</li>
          <li>Strategy logic was checked with backtests on historical data before going live in paper trading.</li>
          <li>Logs every trade and error to trace behavior and debug failures.</li>
          <li>Built with Claude Code and Codex, reviewing and testing the AI-generated code before using it.</li>
        </ul>`,
      fig: `<figure class="fig"><div class="log" id="log" aria-hidden="true"></div>
          <p class="cap"><b>Figure 5.</b> Log output format. Entries are illustrative.</p></figure>`
    },
    data: {
      name: "Data / ML",
      kind: "Personal project, Jun 2025",
      title: "Social media data analysis",
      body: `<p>A machine-learning workflow relating social media behavior to self-efficacy in survey data.</p>
        <ul>
          <li>Cleaned, validated and structured raw survey data with Pandas and NumPy.</li>
          <li>Applied scikit-learn models to see how combinations of features related to self-efficacy.</li>
          <li>Built interactive Plotly charts with filters and hover data to compare groups.</li>
        </ul>`,
      fig: `<figure class="fig"><svg class="sch" viewBox="0 0 340 250" role="img" aria-label="Pipeline: raw survey data, clean and validate, features, model, charts">
          ${["Raw survey data","Clean & validate","Feature sets","scikit-learn models","Plotly charts"].map((t,i)=>`
            <rect x="60" y="${8+i*48}" width="220" height="32" fill="#141B2C" stroke="${i===3?'#D08C4E':'#45557A'}" stroke-width="2"/>
            <text x="170" y="${29+i*48}" text-anchor="middle" style="fill:#E4E8F0">${t.replace("&","&amp;")}</text>
            ${i<4?`<line x1="170" y1="${40+i*48}" x2="170" y2="${56+i*48}" class="acc"/>`:""}`).join("")}
        </svg><figcaption><b>Figure 6.</b> Analysis pipeline.</figcaption></figure>`
    }
  };

  /* ---------- illustrative log stream ---------- */
  const LOG = [
    ["info", "polygon", "1m bars received, 390 rows"],
    ["info", "strategy", "window open, scanning for setup"],
    ["ok", "signal", "setup confirmed, entry computed"],
    ["ok", "alpaca", "paper order submitted"],
    ["ok", "alpaca", "order filled"],
    ["err", "polygon", "request timeout, retry 1/3"],
    ["ok", "polygon", "retry succeeded"],
    ["info", "risk", "stop and target attached"],
    ["ok", "alpaca", "position closed, P/L logged"],
    ["info", "strategy", "window closed, idle"]
  ];
  function startLog() {
    const el = document.getElementById("log");
    if (!el) return;
    let i = 0, sec = 34200;
    const line = () => {
      const [lvl, src, msg] = LOG[i % LOG.length];
      sec += 7 + (i * 13) % 40;
      const t = new Date(sec * 1000).toISOString().substr(11, 8);
      const row = document.createElement("div");
      row.innerHTML = `<span class="t">${t}</span> <span class="${lvl}">${lvl.toUpperCase().padEnd(4, " ")}</span> ${src}: ${msg}`;
      el.appendChild(row);
      while (el.children.length > 10) el.removeChild(el.firstChild);
      i++;
    };
    for (let k = 0; k < 6; k++) line();
    if (!reduce) logTimer = setInterval(line, 900);
  }

  die.querySelectorAll(".block").forEach(b => b.setAttribute("tabindex", "-1"));

  /* ---------- level control ---------- */
  function setLevel(level) {
    stage.dataset.level = level;
    die.querySelectorAll(".block").forEach(b => b.setAttribute("tabindex", level === "die" ? "0" : "-1"));
    if (level !== "block") {
      detail.hidden = true;
      die.style.transform = "";
      clearInterval(logTimer);
    }
  }

  function openBlock(key) {
    const b = BLOCKS[key];
    const g = die.querySelector(`[data-block="${key}"] .blk`);
    // zoom the die toward the chosen block
    const x = +g.getAttribute("x"), y = +g.getAttribute("y");
    const w = +g.getAttribute("width"), h = +g.getAttribute("height");
    const cx = x + w / 2, cy = y + h / 2, s = 2.4;
    const tx = (-s * (cx - 400) / 800) * 100, ty = (-s * (cy - 400) / 800) * 100;
    die.style.transform = `translate(${tx}%, ${ty}%) scale(${s})`;

    stage.dataset.level = "block";
    crumbBlock.textContent = b.name;
    detailBody.innerHTML = `<div class="d-grid"><div>
        <p class="d-kind">${b.kind}</p><h3>${b.title}</h3>${b.body}</div>${b.fig}</div>`;
    clearInterval(logTimer);
    const show = () => {
      detail.hidden = false;
      if (key === "compute") startLog();
      document.getElementById("backBtn").focus({ preventScroll: true });
      if (window.innerWidth <= 760) detail.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    reduce ? show() : setTimeout(show, 450);
  }

  document.getElementById("decapBtn").addEventListener("click", () => {
    setLevel("die");
    setTimeout(() => {
      const first = die.querySelector(".block");
      first && first.focus({ preventScroll: true });
    }, reduce ? 0 : 900);
  });
  document.getElementById("backBtn").addEventListener("click", () => {
    setLevel("die");
    const ret = die.querySelector(`.block`);
    ret && ret.focus({ preventScroll: true });
  });
  stage.querySelectorAll("[data-go]").forEach(btn =>
    btn.addEventListener("click", () => setLevel(btn.dataset.go)));

  die.querySelectorAll(".block").forEach(el => {
    const go = () => { if (stage.dataset.level === "die") openBlock(el.dataset.block); };
    el.addEventListener("click", go);
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && stage.dataset.level === "block") setLevel("die");
  });

  // "See it on the die" buttons in the projects section
  document.querySelectorAll(".proj-open").forEach(btn =>
    btn.addEventListener("click", () => {
      document.getElementById("decap").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      setLevel("die");
      setTimeout(() => openBlock(btn.dataset.open), reduce ? 0 : 1100);
    }));
})();
