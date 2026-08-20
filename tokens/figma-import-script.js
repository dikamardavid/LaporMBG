// MBG Figma Importer Script
// Paste this in Figma -> Plugins -> Development -> Open Console
// Or run in Figma Plugin Scripter / Dev Console

(async function importMBGDesignTokens() {
  console.log("🚀 Starting MBG Design Tokens import to Figma...");

  // 1. Create or get Variables Collection
  let collection = (await figma.variables.getLocalVariableCollectionsAsync())
    .find(c => c.name === "MBG Design System");

  if (!collection) {
    collection = figma.variables.createVariableCollection("MBG Design System");
    console.log("✅ Created Variable Collection: MBG Design System");
  }

  const modeId = collection.modes[0].modeId;

  // Helper function to convert Hex to 0-1 RGB
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    return { r, g, b };
  }

  // 2. Color Tokens Definition
  const colorTokens = [
    // Brand
    { name: "Brand/Primary", hex: "#059669", scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"] },
    { name: "Brand/Primary-Light", hex: "#10b981", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "Brand/Primary-Dark", hex: "#047857", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "Brand/Surface", hex: "#ecfdf5", scopes: ["FRAME_FILL"] },
    
    // BGN Official
    { name: "BGN/Navy-900", hex: "#0f172a", scopes: ["FRAME_FILL", "TEXT_FILL"] },
    { name: "BGN/Accent-Blue", hex: "#1e3a8a", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "BGN/Gold-Accent", hex: "#f59e0b", scopes: ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"] },

    // Status / Quality Control
    { name: "Status/Success", hex: "#10b981", scopes: ["FRAME_FILL", "TEXT_FILL", "STROKE_COLOR"] },
    { name: "Status/Warning-SLA", hex: "#f59e0b", scopes: ["FRAME_FILL", "TEXT_FILL", "STROKE_COLOR"] },
    { name: "Status/Danger-Incident", hex: "#ef4444", scopes: ["FRAME_FILL", "TEXT_FILL", "STROKE_COLOR"] },
    { name: "Status/Info", hex: "#3b82f6", scopes: ["FRAME_FILL", "TEXT_FILL", "STROKE_COLOR"] },

    // Plate Waste Visual Colors
    { name: "PlateWaste/Clean-0pct", hex: "#10b981", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "PlateWaste/Low-25pct", hex: "#84cc16", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "PlateWaste/Half-50pct", hex: "#f59e0b", scopes: ["FRAME_FILL", "SHAPE_FILL"] },
    { name: "PlateWaste/High-75pct", hex: "#ef4444", scopes: ["FRAME_FILL", "SHAPE_FILL"] },

    // Neutrals
    { name: "Neutral/White", hex: "#ffffff", scopes: ["FRAME_FILL", "TEXT_FILL"] },
    { name: "Neutral/Slate-50", hex: "#f8fafc", scopes: ["FRAME_FILL"] },
    { name: "Neutral/Slate-100", hex: "#f1f5f9", scopes: ["FRAME_FILL", "STROKE_COLOR"] },
    { name: "Neutral/Slate-200", hex: "#e2e8f0", scopes: ["STROKE_COLOR", "FRAME_FILL"] },
    { name: "Neutral/Slate-400", hex: "#94a3b8", scopes: ["TEXT_FILL", "STROKE_COLOR"] },
    { name: "Neutral/Slate-600", hex: "#475569", scopes: ["TEXT_FILL"] },
    { name: "Neutral/Slate-800", hex: "#1e293b", scopes: ["TEXT_FILL", "FRAME_FILL"] },
    { name: "Neutral/Slate-900", hex: "#0f172a", scopes: ["TEXT_FILL", "FRAME_FILL"] }
  ];

  const existingVars = await figma.variables.getLocalVariablesAsync();

  for (const t of colorTokens) {
    let variable = existingVars.find(v => v.name === t.name && v.variableCollectionId === collection.id);
    if (!variable) {
      variable = figma.variables.createVariable(t.name, collection, "COLOR");
    }
    variable.scopes = t.scopes;
    variable.setValueForMode(modeId, hexToRgb(t.hex));
  }
  console.log(`✅ Imported ${colorTokens.length} Color Variables!`);

  // 3. Spacing & Radius Float Variables
  const floatTokens = [
    { name: "Spacing/xs", value: 4, scopes: ["GAP"] },
    { name: "Spacing/sm", value: 8, scopes: ["GAP"] },
    { name: "Spacing/md", value: 16, scopes: ["GAP"] },
    { name: "Spacing/lg", value: 24, scopes: ["GAP"] },
    { name: "Spacing/xl", value: 32, scopes: ["GAP"] },
    { name: "Radius/sm", value: 6, scopes: ["CORNER_RADIUS"] },
    { name: "Radius/md", value: 12, scopes: ["CORNER_RADIUS"] },
    { name: "Radius/lg", value: 16, scopes: ["CORNER_RADIUS"] },
    { name: "Radius/xl", value: 24, scopes: ["CORNER_RADIUS"] },
    { name: "Radius/full", value: 9999, scopes: ["CORNER_RADIUS"] }
  ];

  for (const f of floatTokens) {
    let variable = existingVars.find(v => v.name === f.name && v.variableCollectionId === collection.id);
    if (!variable) {
      variable = figma.variables.createVariable(f.name, collection, "FLOAT");
    }
    variable.scopes = f.scopes;
    variable.setValueForMode(modeId, f.value);
  }
  console.log(`✅ Imported ${floatTokens.length} Spacing & Radius Variables!`);

  // 4. Generate Visual Canvas Swatches for Reference
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const canvasFrame = figma.createAutoLayout("VERTICAL");
  canvasFrame.name = "MBG Design System — Token Swatches & Foundations";
  canvasFrame.paddingTop = 40;
  canvasFrame.paddingBottom = 40;
  canvasFrame.paddingLeft = 40;
  canvasFrame.paddingRight = 40;
  canvasFrame.itemSpacing = 24;
  canvasFrame.cornerRadius = 16;
  canvasFrame.fills = [{ type: "SOLID", color: hexToRgb("#f8fafc") }];

  const titleText = figma.createText();
  titleText.characters = "🍱 MBG Design System (Design Tokens & Color Palette)";
  titleText.fontSize = 24;
  titleText.fontName = { family: "Inter", style: "Bold" };
  titleText.fills = [{ type: "SOLID", color: hexToRgb("#0f172a") }];
  canvasFrame.appendChild(titleText);

  // Swatch row container
  const gridContainer = figma.createAutoLayout("HORIZONTAL");
  gridContainer.itemSpacing = 16;
  gridContainer.layoutWrap = "WRAP";
  canvasFrame.appendChild(gridContainer);

  for (const t of colorTokens) {
    const card = figma.createAutoLayout("VERTICAL");
    card.name = t.name;
    card.resize(180, 110);
    card.cornerRadius = 8;
    card.fills = [{ type: "SOLID", color: hexToRgb(t.hex) }];
    card.paddingLeft = 12;
    card.paddingRight = 12;
    card.paddingTop = 12;
    card.paddingBottom = 12;
    card.primaryAxisAlignItems = "MAX";

    const labelBg = figma.createAutoLayout("VERTICAL");
    labelBg.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.9 }];
    labelBg.cornerRadius = 4;
    labelBg.paddingLeft = 6;
    labelBg.paddingRight = 6;
    labelBg.paddingTop = 4;
    labelBg.paddingBottom = 4;

    const label = figma.createText();
    label.characters = `${t.name.split("/")[1]}\n${t.hex}`;
    label.fontSize = 11;
    label.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
    labelBg.appendChild(label);
    card.appendChild(labelBg);

    gridContainer.appendChild(card);
  }

  figma.currentPage.appendChild(canvasFrame);
  figma.viewport.scrollAndZoomIntoView([canvasFrame]);

  console.log("🎉 MBG Design Tokens successfully injected to Figma canvas & variables!");
})();
