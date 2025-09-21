# Automated OMR Evaluation & Scoring System

**Project:** Automated OMR Evaluation & Scoring System  
**Organisation:** Innomatics Research Labs  
**Primary language:** Python  
**Status:** Draft / MVP

---

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Installation (local / dev)](#installation-local--dev)
- [Quick Start (run the pipeline)](#quick-start-run-the-pipeline)
- [Web App (MVP) — Streamlit / API](#web-app-mvp---streamlit--api)
- [Input / Output Formats](#input--output-formats)
- [Configuration & Answer Keys](#configuration--answer-keys)
- [Evaluation, Metrics & Requirements](#evaluation-metrics--requirements)
- [Folder Structure (suggested)](#folder-structure-suggested)
- [Data Privacy & Security](#data-privacy--security)
- [Testing](#testing)
- [Troubleshooting & Tips](#troubleshooting--tips)
- [Contributing](#contributing)
- [License & Contacts](#license--contacts)

---

## Project Overview
Automate the evaluation of standardized OMR sheets (100 questions; 5 subjects × 20 questions) captured by mobile phone cameras. The system should:
- Correct for rotation, skew, illumination and perspective.
- Detect and classify filled bubbles robustly (supporting 2–4 sheet versions).
- Return per-subject scores (0–20 each) and a total (0–100).
- Flag ambiguous sheets for manual review.
- Provide a web interface for evaluators to upload, review flagged sheets and export results.
- Maintain an audit trail of rectified images + overlays and JSON results.

Target quality: **< 0.5% error tolerance**.

---

## Key Features
- Mobile-photo-ready preprocessing: rotation, skew & perspective correction.
- Fiducial mark detection (corner markers / QR/fiducials).
- Bubble grid localization and normalization (handles multiple versions).
- Classical CV + optional lightweight ML classifier for ambiguous marks.
- Per-subject scoring and combined total.
- Audit artifacts: rectified image, overlay with detected marks, JSON result.
- Export: CSV / Excel / JSON.
- Evaluator web UI (Streamlit MVP) + REST API (FastAPI / Flask).
- DB logging (SQLite for MVP, Postgres for prod).

---

## Architecture & Tech Stack

**Core OMR engine**
- Python 3.9+
- OpenCV (image processing)
- NumPy / SciPy (numerics & thresholding)
- Pillow (image I/O)
- PyMuPDF / pdfplumber (optional PDF handling)
- scikit-learn / TensorFlow Lite (optional for ambiguous classification)

**Web & API**
- FastAPI (recommended) or Flask for REST APIs
- Streamlit for quick evaluator UI (MVP)
- Database: SQLite (dev) / PostgreSQL (prod)
- Optional: Celery + Redis for async processing (if batch > thousands)

**Dev & Packaging**
- Docker (recommended)
- pytest for testing

---

## Installation (local / dev)

1. Clone the repo
```bash
git clone <https://github.com/PandiIshwaryaT/evalify>
cd omr-evaluation
