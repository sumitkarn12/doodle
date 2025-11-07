const KONVA_STROKES = "STROKES";

const cnvs = document.querySelector("#annotation-canvas");
const cntrls = document.querySelector("#controls");
const fillEl = document.querySelector("#fill-color");
const strokeEl = document.querySelector("#stroke-color");
const nofillEl = document.querySelector("#no-fill");
const nostrokeEl = document.querySelector("#no-stroke");
const toolBtns = document.querySelectorAll(".tool-button");
const removeBtn = document.querySelector("#mode-remove");
const canvasWrapper = document.querySelector("#placeholder-text");
const strokeInput = document.querySelector("#stroke-size");

const stage = new Konva.Stage({
  container: 'annotation-canvas',
  x: 0,
  y: 0
});
const layer = new Konva.Layer();
stage.add(layer);
const strokes = new Map(JSON.parse(localStorage.getItem(KONVA_STROKES)));

let selectInfoShowCount = 0;
let fillColor = `transparent`;
let strokeColor = '#ff0000';
let isDrawing = false;
let currentMode = 'rect';
let currentShape = null;
let counter = 0;
let tr = new Konva.Transformer();

function shapeSelected(s) {
  currentShape = s;
  if (s && currentShape.strokeWidth) {
    strokeInput.value = currentShape.strokeWidth();
  } else {
    strokeInput.value = "";
  }
}

function getContrastingTextColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance (perceived brightness)
  // A common formula is (0.299*R + 0.587*G + 0.114*B)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance threshold
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

toolBtns.forEach(el => {
  el.addEventListener("click", ev => {
    ev.preventDefault();
    toolBtns.forEach(e => { e.classList.remove("is-info") });
    currentMode = ev.currentTarget.dataset.mode;
    ev.currentTarget.classList.add("is-info");
  });
});

fillEl.addEventListener("input", el => {
  nofillEl.classList.remove("is-info");
  fillColor = el.target.value;
  if (currentShape) {
    currentShape.fill(fillColor);
  }
});
strokeEl.addEventListener("input", el => {
  nostrokeEl.classList.remove("is-info");
  strokeColor = el.target.value;
  if (currentShape)
    currentShape.stroke(strokeColor);
});
nofillEl.addEventListener("click", el => {
  el.target.classList.add("is-info");
  fillColor = `transparent`;
  fillEl.value = "#ffffff"
  if (currentShape)
    currentShape.fill(fillColor);
});
nostrokeEl.addEventListener("click", el => {
  el.target.classList.add("is-info");
  strokeColor = `transparent`;
  strokeEl.value = "#ffffff"
  if (currentShape)
    currentShape.stroke(strokeColor);
});
removeBtn.addEventListener("click", ev => {
  currentShape.destroy();
  counter = 0;
  layer.find(".step-counter ").forEach(c => {
    c.findOne("Text").text(++counter);
  });
  stage.container().style.cursor = "default";
  tr.nodes([]);
  shapeSelected(null);
});

function drawRect(x, y) {
  const r = new Konva.Rect({
    x: x,
    y: y,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokes.get("rect") || 10,
    cornerRadius: 10,
    name: "rect",
    draggable: true
  });
  return r;
}

function drawCircle(x, y) {
  const r = new Konva.Ellipse({
    x: x,
    y: y,
    radiusX: 10,
    radiusY: 10,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokes.get("circle") || 10,
    name: "circle",
    draggable: true
  });
  return r;
}

function drawArrow(x, y) {
  const r = new Konva.Arrow({
    x: x,
    y: y,
    points: [0, 0, 10, 15],
    pointerLength: 20,
    pointerWidth: 20,
    fill: fillColor,
    stroke: strokeColor,
    strokeWidth: strokes.get("arrow") || 40,
    name: "arrow",
    draggable: true
  });
  return r;
}

function drawCounter(x, y) {
  const c = new Konva.Circle({
    x: 0,
    y: 0,
    radius: 40,
    fill: (fillColor == "transparent") ? "#fff" : fillColor,
    stroke: strokeColor,
    name: "counter",
    strokeWidth: strokes.get("step-counter") || 10,
  });
  const t = new Konva.Text({
    x: -40,
    y: -40,
    height: 80,
    width: 80,
    align: 'center',
    verticalAlign: 'middle',
    text: (++counter),
    // fill: getContrastingTextColor(c.stroke()),
    fill: c.stroke(),
    fontSize: 50,
    name: 'counter'
  });
  const g = new Konva.Group({
    x: x,
    y: y,
    name: "step-counter",
    draggable: true
  });
  g.fill = (color) => { c.fill(color); t.fill(c.stroke()); }
  g.stroke = (color) => { c.stroke(color); t.fill(c.stroke()); }
  g.strokeWidth = (w) => {
    if (w) {
      c.strokeWidth(w);
    }
    return c.strokeWidth();
  }
  g.add(c);
  g.add(t);
  return g;
}

stage.on("mousedown", ev => {
  if (ev.target.id() !== "bgimage") return;
  const pos = stage.getRelativePointerPosition();

  isDrawing = true;

  if (currentMode == "rect") {
    currentShape = drawRect(pos.x, pos.y);
  } else if (currentMode == "circle") {
    currentShape = drawCircle(pos.x, pos.y);
  } else if (currentMode == "arrow") {
    currentShape = drawArrow(pos.x, pos.y);
  } else if (currentMode == "counter") {
    currentShape = drawCounter(pos.x, pos.y);
  }
  layer.add(currentShape);
});

stage.on("mousemove", (e) => {
  if (!isDrawing) return;
  const pos = stage.getRelativePointerPosition();
  if (currentMode == "rect") {
    currentShape.width(pos.x - currentShape.x());
    currentShape.height(pos.y - currentShape.y());
  } else if (currentMode == "circle") {
    currentShape.radiusX(Math.abs(pos.x - currentShape.x()));
    currentShape.radiusY(Math.abs(pos.y - currentShape.y()));
  } else if (currentMode == "arrow") {
    currentShape.points([0, 0, (pos.x - currentShape.x()), (pos.y - currentShape.y())]);
  }
  if (e.evt.shiftKey) {
    currentShape.fill(strokeColor);
    currentShape.stroke(fillColor);
  }
});

stage.on("mouseup", ev => {
  isDrawing = false;
  shapeSelected(null);
});

stage.on("mouseover", ev => {
  if (ev.target == stage || ev.target.id() === "bgimage") {
    return;
  }
  ev.target.getStage().container().style.cursor = "move";
});

stage.on("mouseout", ev => {
  if (ev.target == stage || ev.target.id() === "bgimage") {
    return;
  }
  ev.target.getStage().container().style.cursor = "default";
});

stage.on("click", ev => {
  if (ev.target == stage || ev.target.id() === "bgimage") {
    tr.nodes([]);
    strokeInput.value = "";
    return;
  }
  shapeSelected(ev.target);
  if (currentShape.getClassName() == "Text" || currentShape.getClassName() == "Circle") {
    shapeSelected(ev.target.getParent());
  }
  tr.nodes([currentShape]);
  layer.add(tr);
  if (selectInfoShowCount >= 5) return;
  Toastify({
    text: "Click 'Delete' or 'Backspace' button to remove. 'Esc' to deselect.",
    close: true,
    gravity: "bottom",
    position: "left",
    duration: 2000
  }).showToast();
  ++selectInfoShowCount;
});

stage.on("wheel", ev => {
  if (ev.target == stage || ev.target.id() === "bgimage") return;
  ev.evt.preventDefault();

  if (strokeColor == "transparent") return;

  let increaseBy = 3;
  let timeout = null;
  clearTimeout(timeout);


  let node = (ev.target.name() == "counter") ? ev.target.getParent() : ev.target;
  let oldStrokeWidth = node.strokeWidth();

  let s = oldStrokeWidth + Math.sign(ev.evt.wheelDeltaY) * increaseBy;
  if (s > 3) {
    node.strokeWidth(s);
    strokes.set(node.name(), s);
    localStorage.setItem(KONVA_STROKES, JSON.stringify(Array.from(strokes)));
    strokeInput.value = s;
    setTimeout(() => {
      if (!tr.nodes().length)
        strokeInput.value = "";
    }, 3000);
  }
});

function loadImage(imgElement) {
  stage.scale({ x: 1, y: 1 });
  const placeholderText = document.querySelector("#placeholder-text");
  placeholderText.classList.add('is-hidden');
  cnvs.classList.remove("is-hidden");
  cntrls.classList.remove("is-hidden");

  stage.height(imgElement.height);
  stage.width(imgElement.width);

  if (cnvs.clientWidth < imgElement.width) {
    const scaleFactor = cnvs.clientWidth / imgElement.width;
    stage.scale({ x: scaleFactor, y: scaleFactor });
    cnvs.style.height = (imgElement.height * scaleFactor) + "px";
  }

  const bgImage = new Konva.Image({ image: imgElement, id: 'bgimage' });
  layer.add(bgImage);
}

document.addEventListener('paste', (e) => {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items;
  let imagefound = false;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      stage.clear();
      const blob = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => loadImage(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(blob);
      imagefound = true;
      e.preventDefault();
      return;
    }
  }
  if (!imagefound) {
    Toastify({
      text: "No image found in your clipboard. Copy an image first.",
      duration: 5000,
      gravity: "bottom",
      position: "left",
      close: true
    }).showToast();
  }
});

/** Handles drag and drop file upload. */
canvasWrapper.addEventListener('dragover', (e) => {
  e.preventDefault();
  canvasWrapper.classList.add('has-background-link');
});

canvasWrapper.addEventListener('dragleave', (e) => {
  e.preventDefault();
  canvasWrapper.classList.remove('has-background-link');
});

canvasWrapper.addEventListener('drop', (e) => {
  e.preventDefault();
  canvasWrapper.classList.remove('has-background-link');
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => loadImage(img);
      img.src = event.target.result;
    };
    reader.readAsDataURL(files[0]);
  } else {
    Toastify({ text: 'Only imaged are supported.', close: true, duration: 3000, position: 'left', gravity: "bottom" }).showToast();
  }
});

document.getElementById('download-btn').addEventListener('click', () => {
  tr.nodes([]);
  const scaleX = stage.scaleX();
  const scaleY = stage.scaleY();
  stage.scale({ x: 1, y: 1 });
  const dataURL = stage.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = (new Date()).toISOString() + `annotated-image.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    stage.scale({ x: scaleX, y: scaleY });
  }, 2000);
});

document.querySelector("#copy-btn").addEventListener("click", async ev => {
  tr.nodes([]);
  const scaleX = stage.scaleX();
  const scaleY = stage.scaleY();
  stage.scale({ x: 1, y: 1 });
  const blob = await stage.toBlob();

  try {
    // Use the ClipboardItem interface to write the image blob
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);

    Toastify({
      text: 'Copied!',
      duration: 3000,
      close: true,
      position: "left",
      gravity: "bottom"
    }).showToast();

    setTimeout(() => {
      stage.scale({ x: scaleX, y: scaleY });
    }, 2000);
  } catch (err) {
    // Catch the likely NotAllowedError
    Toastify({
      text: 'Copy to clipboard failed: The browser blocked this action due to security restrictions. Please use the "Download PNG" button instead.',
      duration: 3000,
      close: true,
      position: "left",
      gravity: "bottom"
    }).showToast();
    console.error('Copy to clipboard failed:', err);
  }
});

document.addEventListener("keyup", ev => {
  console.log(ev.code, ev.key, ev, (ev.code == "KeyC" && ev.metaKey));
  if (ev.code == "Backspace" || ev.code == "Delete") {
    removeBtn.click();
  } else if (ev.code == "Escape") {
    shapeSelected(null);
    tr.nodes([]);
    strokeInput.value = "";
  } else if (ev.code == "KeyR") {
    document.querySelector("#mode-rect").click();
  } else if (ev.code == "KeyC") {
    if ( ev.ctrlKey ) {
      document.querySelector("#copy-btn").click();
      return;
    }
    document.querySelector("#mode-circle").click();
  } else if (ev.code == "KeyA") {
    document.querySelector("#mode-arrow").click();
  } else if (ev.code == "KeyS") {
    document.querySelector("#mode-counter").click();
  } else if (ev.code == "KeyZ" && ev.ctrlKey) {
    let lastElm = layer.getChildren().pop();
    if (lastElm.id() !== "bgimage") {
      shapeSelected(lastElm);
      removeBtn.click();
    }
  }
});
