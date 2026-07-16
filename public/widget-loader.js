/**
 * PulsAI Widget Loader
 * Usage: <script src="https://votre-domaine.com/widget-loader.js" data-api-key="VOTRE_CLE"></script>
 */
(function () {
  var script = document.currentScript;
  var apiKey = script && script.getAttribute("data-api-key") || "";
  var scriptSrc = script && script.src || "";
  var baseUrl = scriptSrc.replace(/\/widget-loader\.js.*$/, "") || "http://localhost:5173";
  var widgetPageUrl = baseUrl + "/widget?api_key=" + encodeURIComponent(apiKey);

  if (!apiKey) {
    console.warn("[PulsAI] data-api-key manquant sur le script widget.");
    return;
  }

  // ─── Styles ────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    "#pulsai-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;",
    "border-radius:50%;background:linear-gradient(135deg,#3590E3,#BAF09D);",
    "border:none;cursor:pointer;box-shadow:0 4px 24px rgba(53,144,227,0.4);",
    "z-index:2147483646;display:flex;align-items:center;justify-content:center;",
    "transition:transform 0.2s,box-shadow 0.2s;}",
    "#pulsai-btn:hover{transform:scale(1.07);box-shadow:0 6px 32px rgba(53,144,227,0.55);}",
    "#pulsai-btn svg{width:24px;height:24px;fill:white;pointer-events:none;}",
    "#pulsai-frame{position:fixed;bottom:92px;right:24px;width:380px;height:600px;",
    "border:none;border-radius:20px;box-shadow:0 12px 48px rgba(0,0,0,0.35);",
    "z-index:2147483647;display:none;transition:opacity 0.2s,transform 0.2s;",
    "opacity:0;transform:translateY(12px) scale(0.97);}",
    "#pulsai-frame.open{display:block;opacity:1;transform:translateY(0) scale(1);}",
    "@media(max-width:480px){",
    "#pulsai-frame{width:100vw;height:100vh;bottom:0;right:0;border-radius:0;}",
    "#pulsai-btn{bottom:16px;right:16px;}}",
  ].join("");
  document.head.appendChild(style);

  // ─── Bouton ────────────────────────────────────────────
  var btn = document.createElement("button");
  btn.id = "pulsai-btn";
  btn.title = "Chat";
  btn.setAttribute("aria-label", "Ouvrir le chat PulsAI");
  var ICON_CHAT = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';
  btn.innerHTML = ICON_CHAT;
  document.body.appendChild(btn);

  // ─── Iframe ────────────────────────────────────────────
  var iframe = document.createElement("iframe");
  iframe.id = "pulsai-frame";
  iframe.src = widgetPageUrl;
  iframe.title = "PulsAI Chat";
  iframe.allow = "clipboard-write";
  document.body.appendChild(iframe);

  // ─── Toggle ────────────────────────────────────────────
  var isOpen = false;

  btn.addEventListener("click", function () {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.style.display = "block";
      // Force reflow pour déclencher la transition CSS
      iframe.offsetHeight; // eslint-disable-line no-unused-expressions
      iframe.classList.add("open");
      btn.innerHTML = ICON_CLOSE;
    } else {
      iframe.classList.remove("open");
      btn.innerHTML = ICON_CHAT;
      setTimeout(function () { iframe.style.display = "none"; }, 200);
    }
  });
})();
