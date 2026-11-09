# GutBrainViz 1.0.0

> **Research use only. Not a medical device.**
> This software was developed in the HEREDITARY project as a research prototype. It has not been assessed or certified under the EU Medical Device Regulation (EU) 2017/745. It must not be used to diagnose, treat, monitor or make any other decision about individual patients.

<!-- For demos and web applications, also show this line in the user interface:
"Research prototype of the HEREDITARY project. Not a medical device and not for clinical use. Do not enter personal or patient data." -->

## 1. Overview

| Field | Value |
|---|---|
| Name | GutBrainViz |
| Version | 1.0.0 |
| Type | Demo or web application |
| Owner partner and contact | SURF, Casper van Leeuwen, casper.vanleeuwen@surf.nl |
| Release data | Repository created 20.11.2025, public and maintained (last push 03.08.2026); V1.0 with VCBM 2026. No Zenodo archival yet. |
| License | MIT License |
| Related task or deliverable | T5.2, D5.3, D5.4 |
| How to cite | https://github.com/hereditary-eu/gut-brain-visualization |

## 2. Intended use

**Primary intended use.** GutBrainViz visualizes multi-modal results of a Linked Independent Component Analysis that ran across the gut-brain axis, making cross-modal comparisons between brain resting state networks and the relative abundance of bacterial genera possible. 

**Intended users.** Biomedical researchers.

**Out-of-scope uses.** This release must not be used for
- clinical diagnosis, prognosis or treatment of individual patients;
- decisions about individuals, such as insurance, employment or access to care;
- re-identification of individuals or linkage with other data sources;
- populations, devices or data types not described in Section 3.

## 3. Data provenance

| Dataset | Source partner | Type (public, synthetic, pseudonymized, anonymized) | Population (size, age, sex, country, condition) | Ethics approval or access conditions |
|---|---|---|---|---|
| [src/assets/example-data/neuro/brain-atlas-volume-registered.nii.gz](src/assets/example-data/neuro/brain-atlas-volume-registered.nii.gz) | [https://brainmap.org/ale/](https://brainmap.org/ale/) | public | N/A | N/A |
| [src/assets/example-data/neuro/harvard-registered.nii.gz](src/assets/example-data/neuro/harvard-registered.nii.gz) | [https://neurovault.org/images/1707/](https://neurovault.org/images/1707/) | public | N/A | N/A |
| [src/assets/example-data/gut/gut-microbiota-lica-results.csv](src/assets/example-data/gut/gut-microbiota-lica-results.csv) | N/A | Synthetic | N/A | N/A |
| [https://surfdrive.surf.nl/s/FTqedjssmQmGFdp](https://surfdrive.surf.nl/s/FTqedjssmQmGFdp) | RadboudUMC | Synthetic | N/A | N/A |
| [src/assets/example-data/Modality_contributions.txt](src/assets/example-data/Modality_contributions.txt) | N/A | Synthetic | N/A | N/A |

**Third-party brain atlases.** The two brain atlases in `src/assets/example-data/neuro/` are not covered by the MIT License of this repository and keep their original non-commercial terms:

- `harvard-registered.nii.gz` is a registered and rescaled copy of the Harvard-Oxford subcortical atlas (`HarvardOxford-sub-maxprob-thr25-2mm`, FSL 5.0), distributed under the [FSL licence](https://fsl.fmrib.ox.ac.uk/fsl/docs/license.html): non-commercial use only, and these conditions apply to anyone who receives a copy. Please cite Desikan et al. (2006), Frazier et al. (2005), Makris et al. (2006) and Goldstein et al. (2007).
- `brain-atlas-volume-registered.nii.gz` is a registered copy of the Colin27 MNI template provided with BrainMap GingerALE, distributed under the [BrainMap licence](https://brainmap.org/ale/license.html): educational and scientific non-commercial use only.

Anyone reusing these files, including in a fork of this repository, must follow these terms.

This repository and the released files contain no personal data, pseudonymized records, identifiers or pseudonymization keys.

## 6. Known limitations and risks

- **Generalizability.** The GutBrainViz tool was generated for gut-brain axis LICA results. This means it general use is limited to the data types used, csv files for the gut microbiota data and NIfTI files for the brain resting state network data. 
- **Known biases and confounders.** N/A
- **Failure modes.** N/A
- **Privacy risks.** No privacy risks, files the user drops in are processed in the browser.

## 7. Responsible use and reporting

- **Terms of use.** The source code and the randomized example data (gut microbiota and modality contributions) are released under the MIT License (see [LICENSE](LICENSE)). No trained model is released, and no registration is needed. The bundled brain atlases are third-party data and keep their own non-commercial terms (see Section 3). The brain LICA images linked in the README are not part of this release and are shared under MIT license. Users must follow the research-use-only notice and the out-of-scope uses in Section 2, and must not enter personal or patient data into the application.
- **Contact for misuse or vulnerability reports.** [casper.vanleeuwen@surf.nl](casper.vanleeuwen@surf.nl).

## 8. Acknowledgement

Funded by the European Union under grant agreement No 101137074 (HEREDITARY). Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European Union or the European Health and Digital Executive Agency (HaDEA). Neither the European Union nor the granting authority can be held responsible for them.
