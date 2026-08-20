// MBG Figma Full Tokens Importer (Colors, Float, Typography Styles & Font Variables)
const collections = await figma.variables.getLocalVariableCollectionsAsync();
let collection = collections.find(function(c) { return c.name === "MBG Design System"; });

if (!collection) {
  collection = figma.variables.createVariableCollection("MBG Design System");
}

const modeId = collection.modes[0].modeId;

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return { r: r, g: g, b: b };
}

// 1. Color Tokens
const colorTokens = [
  { name: "Brand/Primary", hex: "#059669" },
  { name: "Brand/Primary-Light", hex: "#10b981" },
  { name: "Brand/Primary-Dark", hex: "#047857" },
  { name: "Brand/Surface", hex: "#ecfdf5" },
  { name: "BGN/Navy-900", hex: "#0f172a" },
  { name: "BGN/Accent-Blue", hex: "#1e3a8a" },
  { name: "BGN/Gold-Accent", hex: "#f59e0b" },
  { name: "Status/Success", hex: "#10b981" },
  { name: "Status/Warning-SLA", hex: "#f59e0b" },
  { name: "Status/Danger-Incident", hex: "#ef4444" },
  { name: "Status/Info", hex: "#3b82f6" },
  { name: "PlateWaste/Clean-0pct", hex: "#10b981" },
  { name: "PlateWaste/Low-25pct", hex: "#84cc16" },
  { name: "PlateWaste/Half-50pct", hex: "#f59e0b" },
  { name: "PlateWaste/High-75pct", hex: "#ef4444" },
  { name: "Neutral/White", hex: "#ffffff" },
  { name: "Neutral/Slate-50", hex: "#f8fafc" },
  { name: "Neutral/Slate-100", hex: "#f1f5f9" },
  { name: "Neutral/Slate-200", hex: "#e2e8f0" },
  { name: "Neutral/Slate-400", hex: "#94a3b8" },
  { name: "Neutral/Slate-600", hex: "#475569" },
  { name: "Neutral/Slate-800", hex: "#1e293b" },
  { name: "Neutral/Slate-900", hex: "#0f172a" }
];

const existingVars = await figma.variables.getLocalVariablesAsync();

for (let i = 0; i < colorTokens.length; i++) {
  const t = colorTokens[i];
  let variable = existingVars.find(function(v) { return v.name === t.name && v.variableCollectionId === collection.id; });
  if (!variable) {
    variable = figma.variables.createVariable(t.name, collection, "COLOR");
  }
  variable.setValueForMode(modeId, hexToRgb(t.hex));
}

// 2. Spacing & Radius Float Variables
const floatTokens = [
  { name: "Spacing/xs", value: 4 },
  { name: "Spacing/sm", value: 8 },
  { name: "Spacing/md", value: 16 },
  { name: "Spacing/lg", value: 24 },
  { name: "Spacing/xl", value: 32 },
  { name: "Radius/sm", value: 6 },
  { name: "Radius/md", value: 12 },
  { name: "Radius/lg", value: 16 },
  { name: "Radius/xl", value: 24 },
  { name: "Radius/full", value: 9999 },
  // Typography Size Variables (FLOAT)
  { name: "Typography/Size/Caption", value: 12 },
  { name: "Typography/Size/Body", value: 14 },
  { name: "Typography/Size/Subheading", value: 16 },
  { name: "Typography/Size/Heading", value: 20 },
  { name: "Typography/Size/Display", value: 28 },
  { name: "Typography/Size/Kids-Hero", value: 36 }
];

for (let j = 0; j < floatTokens.length; j++) {
  const f = floatTokens[j];
  let variable = existingVars.find(function(v) { return v.name === f.name && v.variableCollectionId === collection.id; });
  if (!variable) {
    variable = figma.variables.createVariable(f.name, collection, "FLOAT");
  }
  variable.setValueForMode(modeId, f.value);
}

// Typography String Variables (Font Family)
const fontFamilies = [
  { name: "Typography/Family/Primary", value: "Inter" },
  { name: "Typography/Family/Kids-Friendly", value: "Plus Jakarta Sans" }
];

for (let m = 0; m < fontFamilies.length; m++) {
  const ff = fontFamilies[m];
  let variable = existingVars.find(function(v) { return v.name === ff.name && v.variableCollectionId === collection.id; });
  if (!variable) {
    variable = figma.variables.createVariable(ff.name, collection, "STRING");
  }
  variable.setValueForMode(modeId, ff.value);
}

// 3. Load Fonts & Create Official Figma Text Styles
await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const textStyles = [
  { name: "MBG/Heading/Display-Bold", font: { family: "Inter", style: "Bold" }, size: 28, lineHeight: 36 },
  { name: "MBG/Heading/H1-Bold", font: { family: "Inter", style: "Bold" }, size: 20, lineHeight: 28 },
  { name: "MBG/Heading/H2-SemiBold", font: { family: "Inter", style: "Semi Bold" }, size: 18, lineHeight: 26 },
  { name: "MBG/Subheading/Medium", font: { family: "Inter", style: "Medium" }, size: 16, lineHeight: 24 },
  { name: "MBG/Body/Regular", font: { family: "Inter", style: "Regular" }, size: 14, lineHeight: 20 },
  { name: "MBG/Body/Medium", font: { family: "Inter", style: "Medium" }, size: 14, lineHeight: 20 },
  { name: "MBG/Caption/Regular", font: { family: "Inter", style: "Regular" }, size: 12, lineHeight: 16 },
  { name: "MBG/Caption/SemiBold", font: { family: "Inter", style: "Semi Bold" }, size: 12, lineHeight: 16 },
  { name: "MBG/Kids/Hero-Feedback-Bold", font: { family: "Inter", style: "Bold" }, size: 36, lineHeight: 44 },
  { name: "MBG/Kids/Option-Touch-SemiBold", font: { family: "Inter", style: "Semi Bold" }, size: 20, lineHeight: 28 }
];

const existingStyles = await figma.getLocalTextStylesAsync();

for (let s = 0; s < textStyles.length; s++) {
  const ts = textStyles[s];
  let style = existingStyles.find(function(item) { return item.name === ts.name; });
  if (!style) {
    style = figma.createTextStyle();
    style.name = ts.name;
  }
  style.fontName = ts.font;
  style.fontSize = ts.size;
  style.lineHeight = { unit: "PIXELS", value: ts.lineHeight };
}

// 4. Create Visual Canvas Swatches & Typography Spec Frame
const canvasFrame = figma.createFrame();
canvasFrame.name = "MBG Design System — Foundations & Typography";
canvasFrame.layoutMode = "VERTICAL";
canvasFrame.paddingTop = 40;
canvasFrame.paddingBottom = 40;
canvasFrame.paddingLeft = 40;
canvasFrame.paddingRight = 40;
canvasFrame.itemSpacing = 32;
canvasFrame.cornerRadius = 16;
canvasFrame.fills = [{ type: "SOLID", color: hexToRgb("#f8fafc") }];
canvasFrame.primaryAxisSizingMode = "AUTO";
canvasFrame.counterAxisSizingMode = "AUTO";

const titleText = figma.createText();
titleText.characters = "MBG Design System — Tokens & Typography";
titleText.fontSize = 28;
titleText.fontName = { family: "Inter", style: "Bold" };
titleText.fills = [{ type: "SOLID", color: hexToRgb("#0f172a") }];
canvasFrame.appendChild(titleText);

// Section 1: Typography Showcase Frame
const typeSection = figma.createFrame();
typeSection.name = "Typography Showcase";
typeSection.layoutMode = "VERTICAL";
typeSection.itemSpacing = 16;
typeSection.primaryAxisSizingMode = "AUTO";
typeSection.counterAxisSizingMode = "AUTO";
typeSection.fills = [{ type: "SOLID", color: hexToRgb("#ffffff") }];
typeSection.cornerRadius = 12;
typeSection.paddingTop = 24;
typeSection.paddingBottom = 24;
typeSection.paddingLeft = 24;
typeSection.paddingRight = 24;

const typeSectionHeader = figma.createText();
typeSectionHeader.characters = "Typography Type Ramp & Styles";
typeSectionHeader.fontSize = 18;
typeSectionHeader.fontName = { family: "Inter", style: "Bold" };
typeSectionHeader.fills = [{ type: "SOLID", color: hexToRgb("#059669") }];
typeSection.appendChild(typeSectionHeader);

for (let s = 0; s < textStyles.length; s++) {
  const ts = textStyles[s];
  const typeRow = figma.createFrame();
  typeRow.layoutMode = "HORIZONTAL";
  typeRow.itemSpacing = 24;
  typeRow.primaryAxisSizingMode = "AUTO";
  typeRow.counterAxisSizingMode = "AUTO";
  typeRow.fills = [];

  const sampleText = figma.createText();
  sampleText.characters = ts.name.replace("MBG/", "") + " (" + ts.size + "px)";
  sampleText.fontName = ts.font;
  sampleText.fontSize = ts.size;
  sampleText.fills = [{ type: "SOLID", color: hexToRgb("#0f172a") }];

  typeRow.appendChild(sampleText);
  typeSection.appendChild(typeRow);
}
canvasFrame.appendChild(typeSection);

// Section 2: Color Grid
const colorSectionHeader = figma.createText();
colorSectionHeader.characters = "Color Palette & Variables";
colorSectionHeader.fontSize = 18;
colorSectionHeader.fontName = { family: "Inter", style: "Bold" };
colorSectionHeader.fills = [{ type: "SOLID", color: hexToRgb("#059669") }];
canvasFrame.appendChild(colorSectionHeader);

const gridContainer = figma.createFrame();
gridContainer.name = "Color Swatches Grid";
gridContainer.layoutMode = "HORIZONTAL";
gridContainer.itemSpacing = 16;
gridContainer.layoutWrap = "WRAP";
gridContainer.primaryAxisSizingMode = "AUTO";
gridContainer.counterAxisSizingMode = "AUTO";
canvasFrame.appendChild(gridContainer);

for (let k = 0; k < colorTokens.length; k++) {
  const t = colorTokens[k];
  const card = figma.createFrame();
  card.name = t.name;
  card.resize(180, 110);
  card.cornerRadius = 8;
  card.fills = [{ type: "SOLID", color: hexToRgb(t.hex) }];
  card.layoutMode = "VERTICAL";
  card.paddingLeft = 12;
  card.paddingRight = 12;
  card.paddingTop = 12;
  card.paddingBottom = 12;
  card.primaryAxisAlignItems = "MAX";

  const labelBg = figma.createFrame();
  labelBg.layoutMode = "VERTICAL";
  labelBg.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.9 }];
  labelBg.cornerRadius = 4;
  labelBg.paddingLeft = 6;
  labelBg.paddingRight = 6;
  labelBg.paddingTop = 4;
  labelBg.paddingBottom = 4;
  labelBg.primaryAxisSizingMode = "AUTO";
  labelBg.counterAxisSizingMode = "AUTO";

  const label = figma.createText();
  label.characters = t.name + "\n" + t.hex;
  label.fontSize = 11;
  label.fontName = { family: "Inter", style: "Regular" };
  label.fills = [{ type: "SOLID", color: { r: 0, g: 0, b: 0 } }];
  labelBg.appendChild(label);
  card.appendChild(labelBg);

  gridContainer.appendChild(card);
}

figma.currentPage.appendChild(canvasFrame);
figma.viewport.scrollAndZoomIntoView([canvasFrame]);
