# ox_target Redesign

An advanced, modern 3D World-Space Entity Interaction System & In-Game Settings Menu redesign for FiveM ox_target.

---

## Preview

![Preview Showcase](https://github.com/user-attachments/assets/28d05c3c-f207-4754-8212-bda48cdfb0d0)
![Menu Preview](https://github.com/user-attachments/assets/8c68765e-762e-46c6-a5d5-0991404fa1d9)

---

## Key Features

### 3D World-Space UI
* **3D Floating Menu:** The interaction UI floats directly above targeted entities in 3D world space, dynamically updating position frame-by-frame.
* **Dynamic Connecting Line:** Uses native DrawLine rendering to connect the targeted entity to the UI card. Fully customizable line styles (L-Shape, Straight, or Hidden).
* **Hit Point Marker:** Renders a subtle, glowing dot marker at the precise hit coordinates on the targeted entity.

---

## In-Game Settings Menu (/targetsettings)

Players can customize their UI experience in real-time using the /targetsettings command.

* **Accent Color:** Choose from color presets with real-time sync to the 3D connecting line.
* **UI Scale:** Flexible scaling options (XS, M, XL).
* **Transparency:** Custom background opacity adjustment via slider.
* **Theme Styles:** Instantly switch between Cheat, Glass, or Neo aesthetics.
* **Corner Rounding:** Adjust border-radius for smooth UI card corners.
* **Line Style:** Switch connecting lines between L-Shape, Straight, or Hidden.
* **Typography:** Custom font size & font weight scaling sliders.
* **Center Cursor:** Toggle center crosshair dot visibility.

> **Note:** All personal settings automatically save locally and persist across server restarts and sessions.

---

## Requirements & Installation

1. Ensure you have ox_lib installed on your server.
2. Download or clone this repository into your resources folder:
   ```bash
   git clone [https://github.com/dollar-src/ox_target.git](https://github.com/dollar-src/ox_target.git)
