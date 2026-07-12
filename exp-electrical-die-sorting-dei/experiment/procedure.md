### Procedure

1. Select the desired sorting array criteria on the settings panel using the **Tester Speed Binning Mode** dropdown menu:
   * **Standard Logic Cycle Grade**
   * **High-Performance Stress Tier**
   * **Automotive Safety Tolerance**

2. Click on the **Wafer Substrate** icon within the equipment tray to load the substrate into the circuit prober testing station.

3. Observe the wafer positioned on the central **Thermal Chuck Unit** inside the matrix testing chamber, ready for probe card contact.

4. Choose the desired stress constraints by adjusting the process parameters using the sliders within the specified operating ranges:
   * Supply Voltage: **1.0 – 5.0 V**
   * Test Frequency: **1 – 100 MHz**

5. For optimum wafer grading quality, maintain approximately:
   * Supply Voltage: **3.0 – 4.0 V**
   * Test Frequency: **40 – 60 MHz**

6. Click the **Route Tester** button to initialize the high-density circuit prober interface.
   * The multi-probe needle card assembly aligns directly above the target die coordinates.
   * The baseline propagation waveform timing signal stabilizes on the oscilloscope view.

7. Click the **Start Sorting** button to initiate the automated matrix verification sweeps.

8. Observe the process throughout the testing cycle and monitor:
   * Rapid needle matrix sweeps moving systematically row-by-row across individual chip blocks.
   * Live color changes on the main grid map, marking premium parts (**Green**), standard parts (**Blue**), and defects (**Red / Orange**).
   * Real-time propagation waveform frequency shifts reacting to voltage parameter adjustments.
   * Live countdown timer indicating the remaining testing block duration.
   * Continuous increase in verified pass and fail die counts.

9. After completion of the process, examine the generated output parameters:
   * Pass Count
   * Fail Count
   * Net Yield
   * Quality Grade

10. Modify the speed binning mode, voltage parameters, or clock frequency levels and repeat the experiment to compare the influence of different operating conditions on functional chip yield characteristics.

### Observations

1. Dropping the tester supply voltage below critical functional levels (under 1.7 V) limits internal circuit drive currents, causing a high accumulation of **Red (Timing Fail)** markers due to signal switching lags.

2. Pushing test frequencies to extreme upper boundaries (above 80 MHz) cuts the available data time window for logic gates to settle, exposing minor lattice flaws and causing the net **Wafer Yield Percentage** to fall significantly.

3. Configuring excessively high operational voltages (above 4.5 V) over-stresses fragile dielectric insulation layers, causing an increase in **Orange (Parametric Fail)** markers due to catastrophic gate short circuits.

4. Maintaining an optimized balance between drive power voltage and safe test clocking limits allows the prober to maximize passing counts, resulting in improved **Net Yield** metrics and an **"A" or "B" Wafer Quality Grade**.

### Result

The Electrical Die Sorting wafer probing process was successfully simulated across various logic cycle modes. The effect of supply voltage boundaries and clock speed test frequencies on die pass/fail parameters, microstructural speed-binning tier classification, and net manufacturing wafer yield percentages was observed and analyzed successfully.