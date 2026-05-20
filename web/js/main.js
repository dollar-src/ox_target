import { createOptions } from "./createOptions.js";

const optionsWrapper = document.getElementById("options-wrapper");
const menuCard = document.getElementById("menu-card");
const centerCursor = document.getElementById("center-cursor");
const body = document.body;

window.addEventListener("message", (event) => {
  const data = event.data;
  switch (data.event) {

    case "visible": {
      body.style.visibility = data.state ? "visible" : "hidden";
      // Ensure the central dot shows immediately when targeting mode starts
      centerCursor.style.display = data.state ? "flex" : "none";
      if (!data.state) {
        menuCard.style.display = "none";
        optionsWrapper.innerHTML = "";
      }
      return;
    }

    case "setTarget": {
      optionsWrapper.innerHTML = "";
      const optionsList = [];

      if (data.options) {
        for (const [type, typeOptions] of Object.entries(data.options)) {
          typeOptions.forEach((d, id) => {
            if (!d.hide) optionsList.push({ type, data: d, id: id + 1 });
          });
        }
      }
      if (data.zones) {
        data.zones.forEach((zoneOpts, zoneId) => {
          zoneOpts.forEach((d, id) => {
            if (!d.hide) optionsList.push({ type: "zones", data: d, id: id + 1, zoneId: zoneId + 1 });
          });
        });
      }
      optionsList.forEach((opt, idx) => createOptions(opt.type, opt.data, opt.id, opt.zoneId, idx));
      return;
    }

    case "leftTarget": {
      optionsWrapper.innerHTML = "";
      menuCard.style.display = "none";
      return;
    }

    case "setWorldTarget": {
      optionsWrapper.innerHTML = "";
      menuCard.style.display = "flex";
      (data.options || []).forEach((opt, idx) => {
        createOptions(opt.type, opt, opt.id, opt.zoneId, idx);
      });
      return;
    }

    case "clearWorldTarget": {
      optionsWrapper.innerHTML = "";
      menuCard.style.display = "none";
      return;
    }

    case "worldPosition": {
      const px = data.x * window.innerWidth;
      const py = data.y * window.innerHeight;

      // Offset card so the 'connector' pip on the left matches the vertical line end
      // 15 is the 'top' of the connector in CSS
      menuCard.style.left = (px + 6) + "px";
      menuCard.style.top = (py - 16) + "px";
      return;
    }
  }
});

// ── Browser Preview / Debug Mode ───────────────────────────────────────────
if (!window.invokeNative) {
  document.body.style.visibility = "visible";
  document.getElementById("center-cursor").style.display = "flex";

  setTimeout(() => {
    window.postMessage({
      event: "setWorldTarget",
      options: [
        { icon: "fa-solid fa-earth-americas", label: "(Debug) Global Interaction", type: "global", id: 1 },
        { icon: "fa-solid fa-car", label: "(Debug) Toggle Trunk", type: "entity", id: 2 },
        { icon: "fa-solid fa-toolbox", label: "(Debug) Repair Vehicle", type: "entity", id: 3 }
      ]
    }, "*");

    window.postMessage({
      event: "worldPosition",
      x: 0.6,
      y: 0.4
    }, "*");
  }, 200);
}
