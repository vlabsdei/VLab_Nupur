## THEORY

### Introduction

Semiconductor packaging is the final stage of microchip manufacturing where a fragile, individual silicon die is enclosed in a protective housing. Once integrated circuits pass electrical sorting checks, they are still exposed slices of brittle silicon that cannot interact with macro-scale electronics on their own.

Packaging bridges the gap between nanoscale silicon and consumer circuit boards by providing environmental insulation, mechanical protection, and electrical signal routing.

Common packaging materials and elements include:

- Microscopic Interconnect Wires (Gold, Copper, Aluminum)
- Epoxy Molding Compound (EMC Plastic Resin)
- Leadframes and Organic Substrates
- Solder Balls and External Contact Leads


## Steps in the Assembly Process

### Wafer Dicing and Singulation

The full processed wafer disk is mounted onto adhesive tape and cut into separate standalone squares called **dies** using a high-speed diamond-tipped saw or a precision laser.

**Features:**
- Physically isolates functional chips from the wafer layout
- Requires clean alignment along empty scribe lines

### Interconnect Wire Bonding

Microscopic wire lines are welded from the landing pads on the perimeter of the silicon die to the external matching leads of the package frame.

**Features:**
- Uses thermosonic force, heat, and ultrasonic acoustic friction to form welds
- Connects the inner circuit logic to the outside world


## Factors Affecting Packaging Reliability

### Capillary Ultrasonic Force

The physical downward pressure and vibration applied by the bonding tool. Maintaining an optimal force ensures a strong weld, while excessive force risks cracking the fragile underlying silicon (die cratering).

### Encapsulation Curing Temperature

The baking thermal budget used to cure the protective plastic molding compound shell. Operating within recommended temperature windows limits internal stress build-up caused by expanding materials.

### Interconnect Wire Material

Different metals (Gold, Copper, or Aluminum) feature distinct electrical resistance parameters and mechanical hardness properties that dictate structural processing recipes.

## Packaging Propagation Delay Relationship

The structural performance and electrical delay limits can be estimated using the formula:

<div align="center">
    <i>t<sub>pd</sub></i> &prop; (<i>C</i> &times; <i>V</i>) / <i>I<sub>drift</sub></i>
</div>
<br>

Where:
- **<i>t<sub>pd</sub></i>** = Internal logic propagation gate delay (ns)
- **<i>C</i>** = Transistor node parasitic capacitance (F)
- **<i>V</i>** = Driving tester supply operating voltage (V)
- **<i>I<sub>drift</sub></i>** = Active channel carrier drift current (A)


## Importance of Packaging

Packaging is a critical backend step in semiconductor manufacturing because it transforms delicate silicon components into durable, consumer-ready electronics. Without structural encapsulation, microchips would instantly fail due to atmospheric moisture, corrosion, dust contamination, or mechanical handling shocks. Modern electronic systems rely on robust packaging footprints to distribute power evenly and dissipate thermal energy safely.


## Expected Learning Outcome

After performing this experiment, students will be able to:

- Understand the fundamental purpose of backend microchip packaging and assembly.
- Study the effect of capillary ultrasonic force values on structural bond pull strengths.
- Examine how encapsulation molding temperatures influence package reliability margins.
- Observe how separate silicon dies are physically insulated and prepared for circuit board integration.