### Procedure

1. Select the target conductive wire element configuration using the **Metal Material Selection** dropdown menu:
   * **Aluminum (Al &bull; Baseline)** for creating standard legacy tracks.
   * **Copper (Cu &bull; Low Resistivity)** for high-speed, high-performance logic tracks.
   * **Tungsten (W &bull; High Reliability)** for forming vertical localized plug contacts.

2. Click on the **IC Substrate Die** icon card within the equipment tray on the left panel to load the substrate.

3. Observe that both the circular **Top Surface View** and the layered **Cross-Section Profile** layout graphics initialize simultaneously in the bottom end-station dashboard.

4. Set your operating process parameters using the configuration sliders within the allowed machine tolerances:
   * Wire Width (Nanoscale Track Span): **50 – 500 nm**
   * Wire Thickness (Vertical Trench Height): **100 – 1000 nm**

5. For optimized high-yield device operating configurations, maintain target recipes approximately near:
   * Wire Width (Nanoscale Track Span): **200 – 400 nm**
   * Wire Thickness (Vertical Trench Height): **400 – 800 nm**

6. Click the **Route Material** button to map out chemical trace targets and lock down film parameter profiles.

7. Observe the mechanical components activate in sequence: the **Metal Sputter Target** card switches to active status, the **Plasma Generator** initializes, and the **Process Outputs** update the raw material conductivity properties.

8. Click the **Deposit Track** button to open vacuum shutter gates and activate the bottom-up vapor condensation stream.

9. Observe the real-time sub-surface telemetry growth properties carefully and monitor:
   * **Top Surface View:** Changes color dynamically to represent structural width and trace visibility.
   * **Cross-Section Profile:** Fills up layer-by-layer between the oxide walls as metal fills the mold trench from the bottom up.
   * **Digital Resistance Ohmmeter:** Ticks downward continuously in Ohms ($\Omega$) as the conductive cross section area expands.
   * **Countdown Timer:** Counts down continuously from the designated 10-second runtime window.
   * *Note: Click the "Pause" button at any point to freeze the deposition stream, film growth path, and countdown clock.*

10. Once the timer reaches zero, evaluate the diagnostic cards on the right console panel for final **Resistance ($R$)**, **Current Flow Ease**, and overall **Net Device Quality Grade**.

11. Click the **Reset** button to clear the target chuck, reset slider baselines, and test an alternative metallization recipe matrix.


### Observations

1. Shrinking the wire width or wire thickness restricts the cross-sectional area ($A$), creating a geometric bottleneck that causes the electrical resistance ($R$) to surge upward.

2. Selecting alternative metal targets with naturally low bulk resistivity (such as Copper) drops the path impedance, increasing conductivity outputs on the multi-gauge readout.

3. Depositing current traces at extremely low size dimensions decreases the final device quality score by introducing electromigration risks and broken void hazards.

4. Allowing the 10-second deposition process to run to completion expands the vertical fill profile, allowing the digital ohmmeter to settle at its minimum calculated resistance state.


### Result

The back-end-of-line (BEOL) Physical Vapor Deposition sputtering sequence was successfully simulated. The empirical influence of nanoscale width parameters, vertical layer thickness dimensions, and chemical target choices on cross-sectional channel profiles and interconnect electrical resistance properties was observed and evaluated.