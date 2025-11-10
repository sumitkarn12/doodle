# 🎨 Image Annotation Tool User Guide

Welcome to the Annotation Tool! This simple and powerful application lets you mark up images with different shapes, arrows, and step-by-step counters.

- - -

## 🖼️ Getting Started: Importing Your Image

Before you can annotate, you need to load an image. You have two easy options:

*   **Copy and Paste:** Simply **copy** an image (screenshot or image file) from anywhere, then click on the tool's area and press Ctrl+V (Windows/Linux) or Cmd+V (Mac).
*   **Drag and Drop:** Drag an image file from your computer's folder and **drop** it anywhere onto the main canvas area.

- - -

## 🛠️ Annotation Tools & Modes

You can select your drawing tool from the controls panel at the top. The currently active tool is highlighted.

| Tool Icon | Mode Name | Purpose | Keyboard Shortcut |
| --- | --- | --- | --- |
| ▭    | **Rectangle** | Draw rectangular boxes to highlight areas. | R   |
| ⭕️   | **Circle** | Draw circular or elliptical shapes. | C   |
| ➡   | **Arrow** | Draw arrows to point out specific elements. | A   |
| ﹟   | **Step Counter** | Place numbered markers to create sequential guides. | S   |

- - -

## ✍️ Drawing & Editing Shapes

### 1\. Drawing

*   **Select a Tool:** Click one of the tool icons (Rectangle, Circle, Arrow, etc.) in the control bar, or use its keyboard shortcut (e.g., R for Rectangle).
*   **Draw:** Click and hold the **left mouse button** on the canvas, then **drag** the cursor to create the shape. Release the button when done.

### 2\. Selecting & Transforming

*   **Select:** **Click** on any existing shape to select it. A bounding box with handles will appear around it, and the color/stroke controls will apply to it.
    *   _Tip:_ For the Step Counter, clicking the number or the circle selects the whole group.
*   **Move:** Click and drag the selected shape to move its position.
*   **Resize:** Click and drag the small **handles** on the bounding box to resize the shape.

### 3\. Adjusting Colors and Line Thickness

The selected shape will respond to the controls:

*   **Fill Color:** Click the **Fill Color** swatch to change the main color inside the shape.
    *   To make a shape transparent inside, click the **"No Fill"** button.
*   **Stroke Color:** Click the **Stroke Color** swatch to change the color of the outline/line.
    *   To make a shape have no outline, click the **"No Stroke"** button.
*   **Adjusting Thickness (Stroke Width):**
    *   Hover your mouse over a shape and use your **mouse wheel (scroll wheel)** to quickly increase or decrease the line thickness. The thickness will also appear in the input box.

- - -

## 🖱️ Quick Actions & Shortcuts

| Action | Mouse/Keyboard Action | Notes |
| --- | --- | --- |
| **Deselect Shape** | Press Esc or Click on the background image. | Removes the transformation handles. |
| **Remove Selected Shape** | Press Delete or Backspace. | You can also use button in the controls. |
| **Undo (Remove Last Shape)** | Press Ctrl+Z. | Removes the most recently added shape. |
| **Download Image** | Click the button. | Saves the annotated image to your computer. |
| **Copy Annotated Image** | Click the button or press Ctrl+C. | Copies the final annotated image to your clipboard. |
| **Swap Colors while Drawing** | Hold Shift while drawing. | This swaps the assigned **Fill** and **Stroke** colors for that specific shape. |