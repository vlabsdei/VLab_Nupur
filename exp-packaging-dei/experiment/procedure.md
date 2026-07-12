### Procedure

1. Choose your connector wire using the **Interconnect Wire Material** dropdown menu:
   * **Thermosonic Gold (Au) Wire** for standard, highly reliable connections.
   * **High-Performance Copper (Cu) Wire** for cheap, low-resistance connections.
   * **Aluminum (Al) Wedge Contact** for heavy-duty, high-power chip layouts.

2. Click on the **Singulated Die Chuck** icon in the equipment tray on the left to load your cut microchip into the machine.

3. Notice that both the **Package Encapsulation Fill** screen and the **Joint Shear Strength** graph turn on at the bottom of the dashboard.

4. Set your processing values using the sliders within these safe machine ranges:
   * Capillary Ultrasonic Force: **10 – 150 mN**
   * Molding Temperature: **120 – 220 °C**

5. To get the best chip quality and prevent broken parts, try to keep your settings near:
   * Capillary Ultrasonic Force: **40 – 90 mN**
   * Molding Temperature: **165 – 185 °C**

6. Click the **Initialize Bonding Tool** button to warm up the welding tip and turn on the machine's internal vacuum systems.

7. Watch the machine parts turn on one by one: the **Capillary Tool** needle moves over the chip pads, the **Spark Glow** test fires a tiny arc, and the **Leadframe Substrate Carrier** track lights turn green.

8. Click the **Start Packaging** button to begin the automated, high-speed wire stitching process.

9. Watch the live animations carefully and monitor:
   * **Packaging Envelope:** The tool needle rapidly moves up and down, welding gold or copper wire loops between the chip pads and the metal pins.
   * **Package Encapsulation Fill:** Dark plastic resin flows into the chamber step-by-step to build the outer protective shell.
   * **Bond Pull Strength:** A live gauge goes up in grams of force ($gf$) showing how strong the wire weld is based on your slider force.
   * **Process Timer:** Counts down the remaining time left for the assembly run.
   * *Note: You can click the "Pause" button at any time to freeze the needle tool, plastic flow, and timer.*

10. When the timer hits zero, look at the output cards on the right panel to check your final **Wire Sweep Rate**, **Delamination Score**, and overall **Assembly Status**.

11. Click the **Reset** button to wipe the chamber, reset the sliders, and test a brand new packaging setup.


### Observations

1. Using higher tool force welds the wires tightly at first, but pushing it too high (above 115 mN) smashes and cracks the fragile silicon glass under the pads (**Die Cratering**).

2. Cranking the molding temperature too high makes the plastic cure faster, but the extreme heat creates heavy structural stress that snaps wire joints apart (**Popcorn Effect** failure).

3. Setting the molding temperature too low (under 140°C) makes the liquid plastic too thick to flow smoothly, which pushes and bends the tiny wire loops into each other (**Wire Sweeping** short circuits).

4. Keeping all your parameters inside the recommended middle windows prevents lifted wires and short circuits, giving you a clean **"Pass (High Reliability)"** final result.


### Result

The backend Semiconductor Packaging and Assembly workflow was successfully simulated. We observed and analyzed how changing the needle tool force, the encapsulation mold temperatures, and the wire metals directly affects wire bond strengths, plastic peeling layers, and the final mechanical reliability of a microchip package.