// ============================================================================
// MBG Design System — Kitchen Manifest UX & Printable QR Sticker Generator
// Target Issue: GORE-18 / Issue #36
// Role: Senior Product & UI/UX Designer
// Container: [Explore] - Kitchen Manifest UX & QR Stickers - v1
// ============================================================================

(async function () {
  console.log("🚀 Starting MBG Kitchen Manifest & Printable Sticker Layout generator...");

  // Helper: Hex to RGB (0 - 1 range)
  function hexToRgb(hex) {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return { r: r, g: g, b: b };
  }

  // Load Required Fonts
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  // 1. Retrieve or Initialize MBG Design System Variables
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = collections.find(c => c.name === "MBG Design System");
  if (!collection) {
    collection = figma.variables.createVariableCollection("MBG Design System");
  }
  const modeId = collection.modes[0].modeId;
  const existingVars = await figma.variables.getLocalVariablesAsync();

  function getVar(name) {
    return existingVars.find(v => v.name === name && v.variableCollectionId === collection.id);
  }

  // Common colors
  const cBrandPrimary = hexToRgb("#059669");
  const cBrandLight = hexToRgb("#10b981");
  const cBrandSurface = hexToRgb("#ecfdf5");
  const cBgnNavy = hexToRgb("#0f172a");
  const cBgnGold = hexToRgb("#f59e0b");
  const cStatusDanger = hexToRgb("#ef4444");
  const cStatusWarning = hexToRgb("#f59e0b");
  const cStatusSuccess = hexToRgb("#10b981");
  const cWhite = hexToRgb("#ffffff");
  const cSlate50 = hexToRgb("#f8fafc");
  const cSlate100 = hexToRgb("#f1f5f9");
  const cSlate200 = hexToRgb("#e2e8f0");
  const cSlate400 = hexToRgb("#94a3b8");
  const cSlate600 = hexToRgb("#475569");
  const cSlate900 = hexToRgb("#0f172a");
  const cBlack = hexToRgb("#000000");

  const vBrandPrimary = getVar("Brand/Primary");
  const vBgnNavy = getVar("BGN/Navy-900");
  const vStatusDanger = getVar("Status/Danger-Incident");
  const vStatusWarning = getVar("Status/Warning-SLA");
  const vStatusSuccess = getVar("Status/Success");
  const vSlate50 = getVar("Neutral/Slate-50");
  const vSlate200 = getVar("Neutral/Slate-200");
  const vRadiusMd = getVar("Radius/md");
  const vRadiusLg = getVar("Radius/lg");

  function applyFill(node, rgb, variable) {
    let paint = { type: "SOLID", color: rgb };
    if (variable) {
      try {
        paint = figma.variables.setBoundVariableForPaint(paint, "color", variable);
      } catch (e) {}
    }
    node.fills = [paint];
  }

  // 2. Create Outer Exploration Section
  // Rule: Container eksplorasi di luar wireflow dengan nama `[Explore] - [Nama Fitur] - [Versi]`
  const exploreSection = figma.createSection();
  exploreSection.name = "[Explore] - Kitchen Manifest UX & QR Stickers - v1";
  exploreSection.resizeWithoutConstraints(2800, 2000);
  figma.currentPage.appendChild(exploreSection);

  // Helper to create styled text
  function makeText(str, size, weight, colorRgb, options = {}) {
    const t = figma.createText();
    t.characters = str;
    t.fontSize = size;
    t.fontName = { family: "Inter", style: weight };
    t.fills = [{ type: "SOLID", color: colorRgb }];
    if (options.textAlign) t.textAlignHorizontal = options.textAlign;
    return t;
  }

  // ==========================================================================
  // COMPONENT 1: TemperatureGauge (Critical Control Point CCP Feedback)
  // ==========================================================================
  function createTempGaugeComponent(variantState, tempValue, statusText, subText, colorRgb, varRef) {
    const comp = figma.createComponent();
    comp.name = `KitchenForm/TemperatureGauge/State=${variantState}`;
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.itemSpacing = 16;
    comp.paddingTop = 16;
    comp.paddingBottom = 16;
    comp.paddingLeft = 20;
    comp.paddingRight = 20;
    comp.cornerRadius = 12;
    comp.resize(480, 80);
    comp.strokes = [{ type: "SOLID", color: colorRgb }];
    comp.strokeWeight = 2;
    applyFill(comp, { r: colorRgb.r, g: colorRgb.g, b: colorRgb.b }, null);
    comp.fills = [{ type: "SOLID", color: colorRgb, opacity: 0.08 }];

    // Left Icon Circle
    const badge = figma.createFrame();
    badge.resize(48, 48);
    badge.cornerRadius = 24;
    badge.layoutMode = "VERTICAL";
    badge.primaryAxisAlignItems = "CENTER";
    badge.counterAxisAlignItems = "CENTER";
    applyFill(badge, colorRgb, varRef);
    const badgeText = makeText(`${tempValue}°C`, 14, "Bold", cWhite);
    badge.appendChild(badgeText);
    comp.appendChild(badge);

    // Right Details Column
    const col = figma.createFrame();
    col.layoutMode = "VERTICAL";
    col.itemSpacing = 4;
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "AUTO";
    col.fills = [];

    const title = makeText(statusText, 16, "Bold", colorRgb);
    const sub = makeText(subText, 12, "Medium", cSlate600);
    col.appendChild(title);
    col.appendChild(sub);
    comp.appendChild(col);

    return comp;
  }

  const gaugeSafe = createTempGaugeComponent(
    "Safe",
    "68",
    "SUHU AMAN KEBERANGKATAN (≥ 60°C)",
    "Bakteri patogen dorman. Titik kontrol mutu CCP lolos.",
    cBrandPrimary,
    vBrandPrimary
  );
  const gaugeWarning = createTempGaugeComponent(
    "Warning",
    "54",
    "PERINGATAN SUHU (50°C - 59°C)",
    "Mendekati zona kritis. Wajib insulated thermobox!",
    cStatusWarning,
    vStatusWarning
  );
  const gaugeDanger = createTempGaugeComponent(
    "Danger",
    "44",
    "BAHAYA MUTU PANGAN (< 50°C)",
    "Zona bahaya bakteri patogen! Batch dilarang dikirim!",
    cStatusDanger,
    vStatusDanger
  );

  const gaugeCompSet = figma.combineAsVariants([gaugeSafe, gaugeWarning, gaugeDanger], exploreSection);
  gaugeCompSet.name = "KitchenForm/TemperatureGauge";
  gaugeCompSet.x = 40;
  gaugeCompSet.y = 100;

  // ==========================================================================
  // COMPONENT 2: TouchButton (Large Touch Target min 48px)
  // ==========================================================================
  function createTouchButton(variantStyle, labelStr, bgRgb, textRgb, varRef) {
    const comp = figma.createComponent();
    comp.name = `KitchenForm/TouchButton/Variant=${variantStyle}`;
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.paddingTop = 14;
    comp.paddingBottom = 14;
    comp.paddingLeft = 24;
    comp.paddingRight = 24;
    comp.cornerRadius = 12;
    comp.resize(220, 52); // Min 52px height (> 48px touch target rule)
    applyFill(comp, bgRgb, varRef);

    const txt = makeText(labelStr, 15, "Bold", textRgb);
    comp.appendChild(txt);
    return comp;
  }

  const btnPrimary = createTouchButton("Primary", "Kunci & Cetak QR", cBrandPrimary, cWhite, vBrandPrimary);
  const btnSecondary = createTouchButton("Secondary", "Simpan Draft", cSlate200, cSlate900, vSlate200);
  const btnDanger = createTouchButton("Danger", "Batalkan Batch", cStatusDanger, cWhite, vStatusDanger);

  const btnCompSet = figma.combineAsVariants([btnPrimary, btnSecondary, btnDanger], exploreSection);
  btnCompSet.name = "KitchenForm/TouchButton";
  btnCompSet.x = 40;
  btnCompSet.y = 480;

  // ==========================================================================
  // COMPONENT 3: Thermal QR Sticker 58mm (Ultra High-Contrast Monochrome)
  // ==========================================================================
  function createThermal58mmSticker() {
    const sticker = figma.createComponent();
    sticker.name = "QRSticker/Thermal-58mm";
    sticker.layoutMode = "VERTICAL";
    sticker.primaryAxisAlignItems = "CENTER";
    sticker.counterAxisAlignItems = "CENTER";
    sticker.itemSpacing = 6;
    sticker.paddingTop = 12;
    sticker.paddingBottom = 12;
    sticker.paddingLeft = 10;
    sticker.paddingRight = 10;
    sticker.resize(220, 310); // 58mm proportion
    sticker.cornerRadius = 4;
    applyFill(sticker, cWhite, null);
    sticker.strokes = [{ type: "SOLID", color: cBlack }];
    sticker.strokeWeight = 2;

    // Header BGN • SPPG MBG
    const header = makeText("[ BGN • SPPG MBG ]", 11, "Bold", cBlack);
    sticker.appendChild(header);

    // School Name
    const school = makeText("SDN RAWAMANGUN 01", 14, "Bold", cBlack, { textAlign: "CENTER" });
    sticker.appendChild(school);

    // Batch & Portions
    const batchLine = makeText("BATCH: #MBG-20260917-01 | 350 PORSI", 9, "Bold", cBlack);
    sticker.appendChild(batchLine);

    // Simulated QR Code Frame (32mm equivalent)
    const qrFrame = figma.createFrame();
    qrFrame.name = "Dynamic-QR-Code-Container";
    qrFrame.resize(130, 130);
    qrFrame.cornerRadius = 2;
    applyFill(qrFrame, cWhite, null);
    qrFrame.strokes = [{ type: "SOLID", color: cBlack }];
    qrFrame.strokeWeight = 4;
    qrFrame.layoutMode = "VERTICAL";
    qrFrame.primaryAxisAlignItems = "CENTER";
    qrFrame.counterAxisAlignItems = "CENTER";

    // QR Center Mockup with High ECC Corner markers
    const qrGraphic = figma.createFrame();
    qrGraphic.resize(110, 110);
    qrGraphic.fills = [{ type: "SOLID", color: cBlack }];
    qrFrame.appendChild(qrGraphic);
    sticker.appendChild(qrFrame);

    // Negative Inverted Strip: KONSUMSI SBLM 12:30 WIB
    const expStrip = figma.createFrame();
    expStrip.name = "Expiry-Warning-Negative-Bar";
    expStrip.resize(200, 24);
    expStrip.cornerRadius = 3;
    expStrip.layoutMode = "HORIZONTAL";
    expStrip.primaryAxisAlignItems = "CENTER";
    expStrip.counterAxisAlignItems = "CENTER";
    applyFill(expStrip, cBlack, null);
    const expText = makeText("KONSUMSI SBLM: 12:30 WIB", 11, "Bold", cWhite);
    expStrip.appendChild(expText);
    sticker.appendChild(expStrip);

    // Safety & CTA
    const footer = makeText("SUHU: 65°C [AMAN] • SCAN UTK ULASAN", 9, "Bold", cBlack);
    sticker.appendChild(footer);

    return sticker;
  }

  const sticker58 = createThermal58mmSticker();
  sticker58.x = 40;
  sticker58.y = 660;
  exploreSection.appendChild(sticker58);

  // ==========================================================================
  // COMPONENT 4: Thermal QR Sticker 80mm (Standard Kitchen Receipt/Label)
  // ==========================================================================
  function createThermal80mmSticker() {
    const sticker = figma.createComponent();
    sticker.name = "QRSticker/Thermal-80mm";
    sticker.layoutMode = "VERTICAL";
    sticker.primaryAxisAlignItems = "CENTER";
    sticker.counterAxisAlignItems = "CENTER";
    sticker.itemSpacing = 8;
    sticker.paddingTop = 16;
    sticker.paddingBottom = 16;
    sticker.paddingLeft = 14;
    sticker.paddingRight = 14;
    sticker.resize(300, 420); // 80mm proportion
    sticker.cornerRadius = 6;
    applyFill(sticker, cWhite, null);
    sticker.strokes = [{ type: "SOLID", color: cBlack }];
    sticker.strokeWeight = 3;

    // Header 2 Columns
    const headerRow = figma.createFrame();
    headerRow.layoutMode = "HORIZONTAL";
    headerRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.resize(270, 28);
    headerRow.fills = [];
    const bgnTag = makeText("★ BADAN GIZI NASIONAL", 11, "Bold", cBlack);
    const sppgTag = makeText("SPPG JAKARTA TIMUR", 10, "Semi Bold", cBlack);
    headerRow.appendChild(bgnTag);
    headerRow.appendChild(sppgTag);
    sticker.appendChild(headerRow);

    // Divider Line
    const div1 = figma.createLine();
    div1.resize(270, 0);
    div1.strokes = [{ type: "SOLID", color: cBlack }];
    div1.strokeWeight = 2;
    sticker.appendChild(div1);

    // Destination School
    const schoolTitle = makeText("SDN RAWAMANGUN 01 (350 PORSI)", 16, "Bold", cBlack, { textAlign: "CENTER" });
    sticker.appendChild(schoolTitle);

    // QR Box 45mm equivalent
    const qrFrame = figma.createFrame();
    qrFrame.resize(170, 170);
    qrFrame.cornerRadius = 4;
    applyFill(qrFrame, cWhite, null);
    qrFrame.strokes = [{ type: "SOLID", color: cBlack }];
    qrFrame.strokeWeight = 4;
    qrFrame.layoutMode = "VERTICAL";
    qrFrame.primaryAxisAlignItems = "CENTER";
    qrFrame.counterAxisAlignItems = "CENTER";
    const qrInner = figma.createFrame();
    qrInner.resize(150, 150);
    qrInner.fills = [{ type: "SOLID", color: cBlack }];
    qrFrame.appendChild(qrInner);
    sticker.appendChild(qrFrame);

    // Menu Components & Allergen Box
    const menuBox = figma.createFrame();
    menuBox.layoutMode = "VERTICAL";
    menuBox.paddingTop = 6;
    menuBox.paddingBottom = 6;
    menuBox.paddingLeft = 8;
    menuBox.paddingRight = 8;
    menuBox.resize(270, 48);
    menuBox.fills = [];
    menuBox.strokes = [{ type: "SOLID", color: cBlack }];
    menuBox.strokeWeight = 1;
    const menuTxt = makeText("Menu: Nasi, Ayam Madu, Sup Wortel, Pisang, Susu", 10, "Semi Bold", cBlack);
    const allergenTxt = makeText("PERINGATAN ALERGEN: Mengandung Telur & Kedelai", 9, "Bold", cBlack);
    menuBox.appendChild(menuTxt);
    menuBox.appendChild(allergenTxt);
    sticker.appendChild(menuBox);

    // Solid Expiry Banner
    const expBar = figma.createFrame();
    expBar.resize(270, 30);
    expBar.cornerRadius = 4;
    expBar.layoutMode = "HORIZONTAL";
    expBar.primaryAxisAlignItems = "CENTER";
    expBar.counterAxisAlignItems = "CENTER";
    applyFill(expBar, cBlack, null);
    const expText = makeText("BATAS KONSUMSI: MAKS 12:30 WIB", 12, "Bold", cWhite);
    expBar.appendChild(expText);
    sticker.appendChild(expBar);

    // Quality Stamp
    const stamp = makeText("SUHU KEBERANGKATAN: 68°C • BERANGKAT: 08:15 WIB", 9, "Bold", cBlack);
    sticker.appendChild(stamp);

    return sticker;
  }

  const sticker80 = createThermal80mmSticker();
  sticker80.x = 280;
  sticker80.y = 660;
  exploreSection.appendChild(sticker80);

  // ==========================================================================
  // FULL SCREEN: Kitchen Manifest Tablet Form (1024x768 Landscape)
  // ==========================================================================
  const tabletScreen = figma.createFrame();
  tabletScreen.name = "[Screen] - Kitchen Manifest Tablet Form - v1";
  tabletScreen.resize(1024, 768);
  tabletScreen.cornerRadius = 16;
  applyFill(tabletScreen, cSlate50, vSlate50);
  tabletScreen.layoutMode = "VERTICAL";
  tabletScreen.paddingTop = 0;
  tabletScreen.paddingBottom = 0;
  tabletScreen.paddingLeft = 0;
  tabletScreen.paddingRight = 0;
  tabletScreen.itemSpacing = 0;
  exploreSection.appendChild(tabletScreen);
  tabletScreen.x = 640;
  tabletScreen.y = 100;

  // Tablet Top App Bar (Header)
  const topBar = figma.createFrame();
  topBar.name = "Tablet-Top-AppBar";
  topBar.resize(1024, 64);
  topBar.layoutMode = "HORIZONTAL";
  topBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  topBar.counterAxisAlignItems = "CENTER";
  topBar.paddingLeft = 24;
  topBar.paddingRight = 24;
  applyFill(topBar, cBgnNavy, vBgnNavy);

  const brandCol = figma.createFrame();
  brandCol.layoutMode = "HORIZONTAL";
  brandCol.itemSpacing = 12;
  brandCol.counterAxisAlignItems = "CENTER";
  brandCol.fills = [];
  const logoBox = figma.createFrame();
  logoBox.resize(36, 36);
  logoBox.cornerRadius = 8;
  applyFill(logoBox, cBrandPrimary, vBrandPrimary);
  const logoTxt = makeText("MBG", 12, "Bold", cWhite);
  logoBox.layoutMode = "VERTICAL";
  logoBox.primaryAxisAlignItems = "CENTER";
  logoBox.counterAxisAlignItems = "CENTER";
  logoBox.appendChild(logoTxt);
  brandCol.appendChild(logoBox);

  const appTitle = makeText("SPPG Pulogadung • Manifest Distribusi Harian", 16, "Bold", cWhite);
  brandCol.appendChild(appTitle);
  topBar.appendChild(brandCol);

  const metaTag = figma.createFrame();
  metaTag.layoutMode = "HORIZONTAL";
  metaTag.itemSpacing = 8;
  metaTag.counterAxisAlignItems = "CENTER";
  metaTag.fills = [];
  const dateBadge = makeText("Kamis, 17 Sep 2026 | Morning Rush", 14, "Medium", cSlate400);
  metaTag.appendChild(dateBadge);
  topBar.appendChild(metaTag);
  tabletScreen.appendChild(topBar);

  // Tablet Main Two-Column Body Content
  const mainContent = figma.createFrame();
  mainContent.name = "Tablet-Body-Two-Columns";
  mainContent.resize(1024, 632);
  mainContent.layoutMode = "HORIZONTAL";
  mainContent.itemSpacing = 20;
  mainContent.paddingTop = 20;
  mainContent.paddingBottom = 20;
  mainContent.paddingLeft = 24;
  mainContent.paddingRight = 24;
  mainContent.fills = [];
  tabletScreen.appendChild(mainContent);

  // Left Column (Form Inputs: School, Menu, Nutrition AKG)
  const leftCol = figma.createFrame();
  leftCol.name = "Left-Column-Menu-AKG";
  leftCol.resize(480, 592);
  leftCol.layoutMode = "VERTICAL";
  leftCol.itemSpacing = 16;
  leftCol.paddingTop = 20;
  leftCol.paddingBottom = 20;
  leftCol.paddingLeft = 20;
  leftCol.paddingRight = 20;
  leftCol.cornerRadius = 14;
  applyFill(leftCol, cWhite, null);
  leftCol.strokes = [{ type: "SOLID", color: cSlate200 }];
  leftCol.strokeWeight = 1;
  mainContent.appendChild(leftCol);

  const leftHeading = makeText("1. Sekolah Penerima & Komposisi Menu", 16, "Bold", cBgnNavy);
  leftCol.appendChild(leftHeading);

  // School Selector Field
  const schoolField = figma.createFrame();
  schoolField.resize(440, 52);
  schoolField.cornerRadius = 10;
  applyFill(schoolField, cSlate50, vSlate50);
  schoolField.strokes = [{ type: "SOLID", color: cSlate200 }];
  schoolField.layoutMode = "HORIZONTAL";
  schoolField.primaryAxisAlignItems = "SPACE_BETWEEN";
  schoolField.counterAxisAlignItems = "CENTER";
  schoolField.paddingLeft = 16;
  schoolField.paddingRight = 16;
  const schoolVal = makeText("SDN Rawamangun 01 Pagi (350 Siswa)", 14, "Semi Bold", cBgnNavy);
  const dropdownArrow = makeText("▼", 12, "Bold", cSlate600);
  schoolField.appendChild(schoolVal);
  schoolField.appendChild(dropdownArrow);
  leftCol.appendChild(schoolField);

  // Menu List items
  const menuItems = [
    { name: "Karbohidrat: Nasi Putih Organik (150g)", cal: "195 kcal" },
    { name: "Lauk Hewani: Ayam Bakar Madu (80g)", cal: "220 kcal" },
    { name: "Lauk Nabati: Tempe Bacem Kukus (50g)", cal: "110 kcal" },
    { name: "Sayur: Sup Bening Wortel & Brokoli (100g)", cal: "65 kcal" },
    { name: "Buah: Pisang Barangan (1 buah)", cal: "90 kcal" }
  ];

  for (let m = 0; m < menuItems.length; m++) {
    const mi = menuItems[m];
    const row = figma.createFrame();
    row.resize(440, 36);
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisAlignItems = "SPACE_BETWEEN";
    row.counterAxisAlignItems = "CENTER";
    row.fills = [];
    const tName = makeText(mi.name, 13, "Medium", cSlate900);
    const tCal = makeText(mi.cal, 12, "Semi Bold", cBrandPrimary);
    row.appendChild(tName);
    row.appendChild(tCal);
    leftCol.appendChild(row);
  }

  // AKG Summary Card (Brand Surface)
  const akgCard = figma.createFrame();
  akgCard.resize(440, 76);
  akgCard.cornerRadius = 10;
  applyFill(akgCard, cBrandSurface, null);
  akgCard.layoutMode = "VERTICAL";
  akgCard.paddingTop = 10;
  akgCard.paddingBottom = 10;
  akgCard.paddingLeft = 14;
  akgCard.paddingRight = 14;
  akgCard.itemSpacing = 4;
  const akgTitle = makeText("ESTIMASI AKG MAKRONUTRISI PER PORSI:", 11, "Bold", cBrandPrimary);
  const akgStats = makeText("Kalori: 680 kcal | Protein: 28g | Karbo: 85g | Lemak: 18g | Serat: 6g", 12, "Bold", cSlate900);
  const akgStandard = makeText("✓ Memenuhi 100% Standar Kecukupan Gizi BGN Kategori SD", 11, "Medium", cBrandPrimary);
  akgCard.appendChild(akgTitle);
  akgCard.appendChild(akgStats);
  akgCard.appendChild(akgStandard);
  leftCol.appendChild(akgCard);

  // Right Column (Critical Control Points CCP, Temperature, Holding Time, Buttons)
  const rightCol = figma.createFrame();
  rightCol.name = "Right-Column-CCP-Safety";
  rightCol.resize(476, 592);
  rightCol.layoutMode = "VERTICAL";
  rightCol.itemSpacing = 16;
  rightCol.paddingTop = 20;
  rightCol.paddingBottom = 20;
  rightCol.paddingLeft = 20;
  rightCol.paddingRight = 20;
  rightCol.cornerRadius = 14;
  applyFill(rightCol, cWhite, null);
  rightCol.strokes = [{ type: "SOLID", color: cSlate200 }];
  rightCol.strokeWeight = 1;
  mainContent.appendChild(rightCol);

  const rightHeading = makeText("2. Titik Kontrol Mutu (CCP) & Keamanan", 16, "Bold", cBgnNavy);
  rightCol.appendChild(rightHeading);

  // Time & Holding Calculation Frame
  const timeFrame = figma.createFrame();
  timeFrame.resize(436, 68);
  timeFrame.cornerRadius = 10;
  applyFill(timeFrame, cSlate50, vSlate50);
  timeFrame.layoutMode = "HORIZONTAL";
  timeFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  timeFrame.counterAxisAlignItems = "CENTER";
  timeFrame.paddingLeft = 16;
  timeFrame.paddingRight = 16;

  const tFinish = figma.createFrame();
  tFinish.layoutMode = "VERTICAL";
  tFinish.fills = [];
  tFinish.appendChild(makeText("SELESAI MASAK", 10, "Bold", cSlate600));
  tFinish.appendChild(makeText("07:15 WIB", 16, "Bold", cSlate900));
  timeFrame.appendChild(tFinish);

  const tDispatch = figma.createFrame();
  tDispatch.layoutMode = "VERTICAL";
  tDispatch.fills = [];
  tDispatch.appendChild(makeText("JAM BERANGKAT", 10, "Bold", cSlate600));
  tDispatch.appendChild(makeText("08:15 WIB", 16, "Bold", cSlate900));
  timeFrame.appendChild(tDispatch);

  const tHolding = figma.createFrame();
  tHolding.layoutMode = "VERTICAL";
  tHolding.counterAxisAlignItems = "MAX";
  tHolding.fills = [];
  tHolding.appendChild(makeText("HOLDING TIME", 10, "Bold", cBrandPrimary));
  tHolding.appendChild(makeText("1 Jam (Aman < 4h)", 14, "Bold", cBrandPrimary));
  timeFrame.appendChild(tHolding);
  rightCol.appendChild(timeFrame);

  // Live Temperature Gauge Instance (Safe 68°C)
  const liveGauge = createTempGaugeComponent(
    "Safe",
    "68",
    "SUHU KEBERANGKATAN AMAN (68.4°C)",
    "Bakteri patogen mati/dorman. Titik mutu lolos uji.",
    cBrandPrimary,
    vBrandPrimary
  );
  liveGauge.resize(436, 80);
  rightCol.appendChild(liveGauge);

  // Sample Photo Upload Box (Touch Friendly)
  const photoBox = figma.createFrame();
  photoBox.resize(436, 120);
  photoBox.cornerRadius = 10;
  applyFill(photoBox, cSlate50, vSlate50);
  photoBox.strokes = [{ type: "SOLID", color: cBrandLight }];
  photoBox.strokeWeight = 2;
  photoBox.dashPattern = [6, 4];
  photoBox.layoutMode = "VERTICAL";
  photoBox.primaryAxisAlignItems = "CENTER";
  photoBox.counterAxisAlignItems = "CENTER";
  photoBox.itemSpacing = 6;
  const photoIcon = makeText("📷 [FOTO SAMPEL TERVERIFIKASI]", 13, "Bold", cBrandPrimary);
  const photoLabel = makeText("Foto baki hidangan lengkap terunggah (sample_dish_20260917.jpg)", 11, "Medium", cSlate600);
  photoBox.appendChild(photoIcon);
  photoBox.appendChild(photoLabel);
  rightCol.appendChild(photoBox);

  // Logistics Kurir info
  const kurirInfo = makeText("Armada: Mobil Box B-9182-MBG • Kurir: Bpk. Supriyadi (0812-3456-7890)", 11, "Medium", cSlate600);
  rightCol.appendChild(kurirInfo);

  // Action Buttons (Simpan Draft & Kunci & Cetak QR)
  const actionRow = figma.createFrame();
  actionRow.resize(436, 52);
  actionRow.layoutMode = "HORIZONTAL";
  actionRow.itemSpacing = 12;
  actionRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  actionRow.fills = [];

  const bDraft = figma.createFrame();
  bDraft.resize(150, 52);
  bDraft.cornerRadius = 10;
  applyFill(bDraft, cSlate200, vSlate200);
  bDraft.layoutMode = "VERTICAL";
  bDraft.primaryAxisAlignItems = "CENTER";
  bDraft.counterAxisAlignItems = "CENTER";
  bDraft.appendChild(makeText("Simpan Draft", 14, "Bold", cSlate900));
  actionRow.appendChild(bDraft);

  const bSubmit = figma.createFrame();
  bSubmit.resize(274, 52);
  bSubmit.cornerRadius = 10;
  applyFill(bSubmit, cBrandPrimary, vBrandPrimary);
  bSubmit.layoutMode = "VERTICAL";
  bSubmit.primaryAxisAlignItems = "CENTER";
  bSubmit.counterAxisAlignItems = "CENTER";
  bSubmit.appendChild(makeText("Kunci & Cetak QR Stiker", 15, "Bold", cWhite));
  actionRow.appendChild(bSubmit);

  rightCol.appendChild(actionRow);

  // ==========================================================================
  // COMPONENT 5: Surat Jalan Serah Terima A4 (Handover Sheet)
  // ==========================================================================
  const handoverA4 = figma.createFrame();
  handoverA4.name = "[Print] - Surat Jalan Serah Terima Makanan A4";
  handoverA4.resize(595, 842); // A4 72 DPI ratio
  handoverA4.cornerRadius = 4;
  applyFill(handoverA4, cWhite, null);
  handoverA4.strokes = [{ type: "SOLID", color: cSlate200 }];
  handoverA4.layoutMode = "VERTICAL";
  handoverA4.paddingTop = 32;
  handoverA4.paddingBottom = 32;
  handoverA4.paddingLeft = 36;
  handoverA4.paddingRight = 36;
  handoverA4.itemSpacing = 12;
  exploreSection.appendChild(handoverA4);
  handoverA4.x = 1700;
  handoverA4.y = 100;

  // Kop Resmi BGN & SPPG
  const kopRow = figma.createFrame();
  kopRow.resize(523, 50);
  kopRow.layoutMode = "HORIZONTAL";
  kopRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  kopRow.counterAxisAlignItems = "CENTER";
  kopRow.fills = [];
  const kopTitle = makeText("BADAN GIZI NASIONAL REPUBLIK INDONESIA\nSURAT JALAN & BERITA ACARA SERAH TERIMA MBG", 12, "Bold", cBgnNavy);
  const kopNo = makeText("No: MBG/SJL/2026/09/17/0042\nTanggal: 17 September 2026", 10, "Semi Bold", cSlate600, { textAlign: "RIGHT" });
  kopRow.appendChild(kopTitle);
  kopRow.appendChild(kopNo);
  handoverA4.appendChild(kopRow);

  const kopLine = figma.createLine();
  kopLine.resize(523, 0);
  kopLine.strokes = [{ type: "SOLID", color: cBgnNavy }];
  kopLine.strokeWeight = 2;
  handoverA4.appendChild(kopLine);

  // Sender & Destination Block
  const partyFrame = figma.createFrame();
  partyFrame.resize(523, 60);
  partyFrame.layoutMode = "HORIZONTAL";
  partyFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  partyFrame.fills = [];
  const senderInfo = makeText("PENGIRIM (SPPG):\nSatuan Pelayanan Gizi Pulogadung\nKepala Dapur: Hendra Kusuma", 10, "Medium", cSlate900);
  const receiverInfo = makeText("PENERIMA (SEKOLAH):\nSDN Rawamangun 01 Pagi\nPIC Sekolah: Ibu Sri Wahyuni, S.Pd", 10, "Medium", cSlate900);
  partyFrame.appendChild(senderInfo);
  partyFrame.appendChild(receiverInfo);
  handoverA4.appendChild(partyFrame);

  // Table Manifest
  const manifestHeader = makeText("RINCIAN DISTRIBUSI MAKANAN BERGIZI:", 11, "Bold", cBgnNavy);
  handoverA4.appendChild(manifestHeader);

  const tableMock = figma.createFrame();
  tableMock.resize(523, 160);
  tableMock.layoutMode = "VERTICAL";
  tableMock.cornerRadius = 4;
  tableMock.strokes = [{ type: "SOLID", color: cSlate400 }];
  applyFill(tableMock, cSlate50, vSlate50);
  tableMock.paddingTop = 8;
  tableMock.paddingBottom = 8;
  tableMock.paddingLeft = 12;
  tableMock.paddingRight = 12;
  tableMock.itemSpacing = 8;

  const tHeader = makeText("Item Menu                                   Porsi Kirim    Wadah    Status Suhu", 10, "Bold", cSlate900);
  const tRow1 = makeText("Paket Makan Bergizi Nasi Ayam Madu          350 Porsi      14 Baki  68°C [Aman]", 10, "Regular", cSlate900);
  const tRow2 = makeText("Susu UHT MBG 125ml                          350 Kotak      12 Krat  Suhu Ruang", 10, "Regular", cSlate900);
  const tRow3 = makeText("Buah Pisang Barangan                        350 Buah       7 Dus    Segar", 10, "Regular", cSlate900);
  const tRow4 = makeText("Total Porsi Terverifikasi: 350 Siswa (100% Kuota Terpenuhi)", 10, "Bold", cBrandPrimary);

  tableMock.appendChild(tHeader);
  tableMock.appendChild(tRow1);
  tableMock.appendChild(tRow2);
  tableMock.appendChild(tRow3);
  tableMock.appendChild(tRow4);
  handoverA4.appendChild(tableMock);

  // Quality Verification Checklist Box
  const verifyBox = figma.createFrame();
  verifyBox.resize(523, 90);
  verifyBox.cornerRadius = 4;
  verifyBox.paddingTop = 8;
  verifyBox.paddingBottom = 8;
  verifyBox.paddingLeft = 12;
  verifyBox.paddingRight = 12;
  verifyBox.itemSpacing = 4;
  verifyBox.layoutMode = "VERTICAL";
  applyFill(verifyBox, cBrandSurface, null);
  verifyBox.strokes = [{ type: "SOLID", color: cBrandLight }];
  const vTitle = makeText("LEMBAR VERIFIKASI KEAMANAN PANGAN SAAT TIBA DI SEKOLAH:", 10, "Bold", cBrandPrimary);
  const vItem1 = makeText("[  ] Waktu Tiba di Sekolah: ............ WIB  |  Suhu Makanan Saat Tiba: .......... °C (Wajib ≥ 50°C)", 9, "Semi Bold", cSlate900);
  const vItem2 = makeText("[  ] Segel Keamanan Thermobox Utuh & Tidak Mengalami Kerusakan Selama Pengiriman", 9, "Semi Bold", cSlate900);
  const vItem3 = makeText("[  ] Makanan Berbau Harum, Tidak Asam, Tidak Berlendir, dan Layak Konsumsi Siswa", 9, "Semi Bold", cSlate900);
  verifyBox.appendChild(vTitle);
  verifyBox.appendChild(vItem1);
  verifyBox.appendChild(vItem2);
  verifyBox.appendChild(vItem3);
  handoverA4.appendChild(verifyBox);

  // 3-Party Signature Block
  const sigRow = figma.createFrame();
  sigRow.resize(523, 110);
  sigRow.layoutMode = "HORIZONTAL";
  sigRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  sigRow.counterAxisAlignItems = "CENTER";
  sigRow.fills = [];

  function makeSigBox(roleStr, nameStr) {
    const sb = figma.createFrame();
    sb.resize(160, 100);
    sb.layoutMode = "VERTICAL";
    sb.primaryAxisAlignItems = "SPACE_BETWEEN";
    sb.counterAxisAlignItems = "CENTER";
    sb.fills = [];
    const rTxt = makeText(roleStr, 9, "Bold", cSlate600);
    const nTxt = makeText(nameStr, 10, "Bold", cSlate900);
    const line = figma.createLine();
    line.resize(130, 0);
    line.strokes = [{ type: "SOLID", color: cSlate400 }];
    sb.appendChild(rTxt);
    sb.appendChild(line);
    sb.appendChild(nTxt);
    return sb;
  }

  sigRow.appendChild(makeSigBox("Petugas Dapur SPPG", "( Hendra Kusuma )"));
  sigRow.appendChild(makeSigBox("Kurir Logistik Armada", "( Supriyadi )"));
  sigRow.appendChild(makeSigBox("PIC Sekolah Penerima", "( Sri Wahyuni, S.Pd )"));
  handoverA4.appendChild(sigRow);

  // Zoom into generated section
  figma.viewport.scrollAndZoomIntoView([exploreSection]);
  console.log("✅ Successfully created MBG Kitchen Manifest UX & QR Sticker exploration in Figma!");
})();
