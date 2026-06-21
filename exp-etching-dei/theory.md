# Theory

## 1. Introduction

Etching is one of the most important processes in semiconductor manufacturing. After photolithography creates patterns on the wafer surface, unwanted material must be removed so that only the required structures remain. This material removal process is known as **etching**.

During etching, the photoresist layer acts as a protective mask. Areas covered by the photoresist remain unchanged, while exposed regions are selectively removed. The process enables the formation of microscopic features required for integrated circuits, sensors, and electronic devices.

Etching can be performed using either liquid chemicals (**Wet Etching**) or ionized gases (**Dry Plasma Etching**).


## 2. Objectives

The objectives of this experiment are:

- To understand the role of etching in semiconductor fabrication.
- To study the influence of process parameters on material removal.
- To compare wet etching and dry plasma etching techniques.
- To observe isotropic and anisotropic etching profiles.
- To analyze the quality of the etched structure under different operating conditions.

## 3. Input Parameters

The etching process is controlled using the following parameters:

### 3.1 Etch Mechanism

The user can select one of the following etching methods:

#### Wet Chemical Isotropic Etching

Material is removed using liquid chemical etchants. The etching occurs in multiple directions, producing isotropic profiles.

#### Dry Reactive Ion Etching (RIE)

Material is removed using energetic plasma ions inside a vacuum chamber. The etching occurs primarily in the vertical direction, producing anisotropic profiles.


### 3.2 Chemical Concentration

**Range:** 10% – 80%

Chemical concentration determines the strength of the etchant solution used during wet etching.

- Higher concentration increases the chemical reaction rate.
- Faster reaction rates generally increase material removal.
- Excessively high concentration may reduce process quality.


### 3.3 RF Plasma Power

**Range:** 50 W – 300 W

RF power controls the energy supplied to generate plasma during dry etching.

- Higher RF power produces a denser and more energetic plasma.
- Increased ion bombardment enhances material removal.
- Excessive power can damage delicate wafer structures.


### 3.4 Etch Time

**Range:** 10 – 60 seconds

Etch time determines how long the wafer remains exposed to the etching environment.

- Short duration may result in incomplete material removal.
- Longer duration increases etch depth.
- Excessive exposure may cause over-etching.


## 4. Scientific Formula and Logic

The simulation uses an empirical etch kinetics relationship to estimate material removal behavior.

### Etch Kinetics Empirical Model

        Ec × P
R =  -----------
            t

Where:

| Symbol | Description |
|----------|-------------|
| **R** | Total Etch Rate Removal Velocity |
| **Ec** | Chemistry Selectivity Index Coefficient |
| **P** | Operational Parameter Input Value |
| **t** | Operational Process Time |


### Process Logic

#### Effect of Chemical Concentration

Increasing chemical concentration increases the effectiveness of the etchant and therefore increases the etch rate.

#### Effect of RF Plasma Power

Increasing RF power creates a stronger plasma field that enhances ion bombardment and material removal.

#### Effect of Process Time

Longer process times allow more material to be removed from the wafer surface. However, excessive exposure may damage the desired structures.

#### Profile Formation

**Wet Etching**

- Produces isotropic etching.
- Material is removed in multiple directions.
- Undercutting beneath the photoresist mask may occur.

**Dry Etching**

- Produces anisotropic etching.
- Material is removed primarily in the vertical direction.
- Better dimensional control is achieved.

## 5. Output Parameters

The simulation generates the following outputs:

### Etch Rate (nm/min)

Represents the speed at which material is removed from the wafer surface.

### Profile Selectivity

Indicates the nature of the etch profile:

- Isotropic Profile
- Anisotropic Profile

### Yield Quality (%)

Represents the estimated quality of the fabricated structure based on the selected operating conditions.

## 6. Applications

Semiconductor etching is widely used in:

- Integrated Circuit (IC) fabrication
- MEMS device manufacturing
- Sensor fabrication
- Microelectronics production
- Nanotechnology applications
- Printed Circuit Board (PCB) manufacturing


## 9. Conclusion

Etching is a critical semiconductor fabrication process used to transfer patterns onto wafer surfaces by selectively removing material. The quality of the etched structure depends on proper control of chemical concentration, plasma power, and process duration. Through this experiment, students gain practical understanding of both wet and dry etching techniques and their impact on semiconductor device fabrication.