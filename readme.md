# Microservices-Based Architecture for West Java Road & Bridge Monitoring Platform
### SCSE-Based Microservices Decomposition • Resilience Validation • Interoperability Testing  
**Implementation Repository for Master Thesis Prototype**

---

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-Microservices-blue?style=flat-square">
  <img src="https://img.shields.io/badge/Framework-Fastify-green?style=flat-square">
  <img src="https://img.shields.io/badge/Database-MySQL-orange?style=flat-square">
  <img src="https://img.shields.io/badge/Container-Docker-blue?style=flat-square">
  <img src="https://img.shields.io/badge/Testing-k6-red?style=flat-square">
</p>

---
## 📚 Table of Contents

- [Overview](#-overview)
- [Key Contributions](#-key-contributions)
- [Architecture Summary](#-architecture-summary)
  - [Microservice Catalogue](#-microservice-catalogue)
  - [High-Level Architecture Diagram](#-high-level-architecture-diagram)
- [Technology Stack](#-technology-stack)
- [Architectural Evaluation Results](#-architectural-evaluation-results)
- [Interoperability Validation](#-interoperability-validation)
- [Resilience & Chaos Testing Results](#-resilience--chaos-testing-results)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Clone the Repository](#1-clone-the-repository)
  - [Start All Services](#2-start-all-services-local)
  - [Run Interoperability Tests](#3-run-interoperability-tests)
  - [Run Fault Isolation / Chaos Tests](#4-run-fault-isolation--chaos-tests)
  - [Graceful Degradation Test](#5-graceful-degradation-test)
  - [Recovery Test](#6-recovery-test)
- [Reference (Paper Source)](#-reference-paper-source)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)



## 📌 Overview

This repository contains the implementation of a **microservices-based architecture** for the *Teman Jabar Road & Bridge Monitoring Platform*, developed as part of a Master's Thesis and published in:

**“Microservices-Based Architecture for West Java Road and Bridge Monitoring Platform” — AJIS, 2025**

The project modernizes a legacy **monolithic** government system into **six fully independent microservices**, designed using the **Service Computing System Engineering (SCSE)** methodology and evaluated through:

- Quantitative architectural metrics (cohesion, coupling, complexity, reusability)  
- Interoperability and cross-service API validation  
- Chaos / fault-injection testing for resilience  
- Automatic recovery time measurements  

### 🎯 Problems Addressed
- **Scalability limitations** in monolithic architecture  
- **Difficult interoperability** with external platforms (Talikuat, Sipelajar, Systarumija)  
- **Single point of failure** causing full-system outages  
- **Low maintainability** and slow development cycles  

### 🚀 Microservices Solution
- Independent domain-driven services  
- Fault isolation and fail-fast behavior  
- API Gateway for controlled interoperability  
- Dedicated databases per service  
- Improved resilience through auto-healing  

This repository represents the complete source code, testing suite, and architecture implementation of the proposed microservices solution.

## ✨ Key Contributions

- **SCSE-driven microservice decomposition** into six bounded contexts  
- **Very low coupling** (0.0022) → minimal failure propagation  
- **High cohesion** (0.91) → meaningfully scoped services  
- **Fault isolation** → 100% availability of unaffected services during outages  
- **Self-healing containers** → recovery time < 3 seconds  
- **Interoperability validation** using k6  
- Compliance with **One Data Indonesia** & West Java governance standards  

---

## 🧱 Architecture Summary

### 📂 Microservice Catalogue

| ID | Service Name | Description |
|----|--------------|-------------|
| **TS1** | Road & Bridge Maintenance Service | Work orders, crews, materials, validation |
| **TS2** | User Management Service | Authentication, SSO, roles |
| **TS3** | Citizen Complaint Service | Complaint intake → verification → resolution |
| **TS4** | Project Monitoring Service | Talikuat project tracking & documents |
| **TS5** | Asset & Right-of-Way Licensing Service | Rumija permits, asset master data |
| **TS6** | Information & Dashboard Service | Aggregation, analytics, open data feeds |

---

## 🏗 High-Level Architecture Diagram
```text
                 [ API GATEWAY ]
                        |
        ---------------------------------------------
        |                  |                 |       |
      [TS1]              [TS2]             [TS3]    [TS4]
   Maintenance           Users         Complaints   Project

                |                               |
              [TS5]                           [TS6]
             Assets                          Dashboard
```

## ⚙️ Technology Stack

| Category | Technology |
|----------|------------|
| Backend Framework | Fastify (Node.js) |
| Architecture | Microservices, REST API, API Gateway |
| Deployment | Docker, docker-compose (K8s-ready) |
| Database | MySQL (database-per-service) |
| Testing Tools | k6 (load, interoperability), Chaos injection |
| Monitoring | Health checks, structured logging |

---

## 📊 Architectural Evaluation Results

Using metrics from Mohammed Elhag & Mohamad (2014) and Alzamil (2023):

| Metric | Value | Interpretation |
|--------|--------|----------------|
| **Coupling Factor** | 0.002215 | Extremely low → strong isolation |
| **Cohesion Factor** | 0.91026 | High → clean service boundaries |
| **Complexity Factor** | 0.0024 | Low structural complexity |
| **Reusability Factor** | 0.925 | Services reusable across domains |

These results validate alignment with microservices best practices.

---

## 🧪 Interoperability Validation

Automated k6 tests were performed:

### Test Scenarios
| Scenario | Expected | Result |
|----------|----------|---------|
| TS2 Authentication | 200 OK | Pass |
| TS2 → TS1 Transaction | 201 Created | Pass |

All requests were processed successfully.

---

## 🔥 Resilience & Chaos Testing Results

### ✔ Fault Isolation
During forced crash of **TS1**:

- **TS2** (User Service): 100% success (500/500)
- **TS3** (Complaint Service): 100% success (500/500)

Failures did **not** propagate.

### ✔ Graceful Degradation
- Downed services return **502/503 instantly** (fail-fast)
- Other services continue operating normally

### ✔ Self-Healing Recovery
| Service | Recovery Time |
|---------|----------------|
| TS1 | **2.626 s** |
| TS2 | **2.510 s** |

---

## 📁 Repository Structure
```text
microservice-andank/
|
+-- dashboard-service/
+-- laporan-service/
+-- pemeliharaan-service/     (TS1)
+-- rumija-service/           (TS5)
+-- talikuat-service/         (TS4)
+-- user-service/             (TS2)
|
+-- tests/
|   +-- test-interoperability.js
|   +-- test-stability.js
|   +-- test-fault-isolation.js
|
+-- docker-compose.yml
+-- README.md
```

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/andankk/Microservices-Teman-Jabar.git
cd microservice-andank
```
### 2. Start All Services (Local)
```bash
docker-compose up --build
```
### 3. Run Interoperability Tests
```bash
k6 run tests/test-interoperability.js
```
### 4. Run Fault Isolation / Chaos Tests
```bash
docker stop pemeliharaan-service
k6 run tests/test-fault-isolation.js
```
### 5. Graceful Degradation Test
This test validates that when a service fails (e.g., TS1: Maintenance Service),
the API Gateway returns fail-fast responses (502/503) while other services remain stable.
```bash
docker stop pemeliharaan-service
k6 run tests/test-graceful-degradation.js
```
Expected Behavior
- Requests to TS1 → immediate 502/503 with near-zero latency
- Requests to TS2 (User) & TS3 (Complaint) → continue operating with normal latency
- No cascading failures
- Frontend can hide/disable specific features while keeping the platform usable
  
### 6. Recovery Test
This test measures Time To Recovery (TTR) after a service crashes.
Used to validate Docker/Kubernetes auto-healing.
```bash
docker start pemeliharaan-service
k6 run tests/test-recovery.js
```
Expected Behavior
- Downed container automatically restarts (cold start)
- Recovery time should be ~2.5 – 3.0 seconds
- Health check transitions from UNHEALTHY → HEALTHY
- Requests resume normally without manual intervention

---

## 📚 Reference (Paper Source)

This implementation is based on the research article:
**Microservices-Based Architecture for West Java Road and Bridge Monitoring Platform**   


---

## 📝 License

Developed as part of a Master’s Thesis on Microservices-Based System Modernization
Licensed under Creative Commons BY-NC 4.0

---

## 🙌 Acknowledgements

This system was developed focusing on:
- SCSE methodology  
- Microservices architectural evaluation  
- Fault isolation & resilience   
- Interoperability testing in government digital platforms  

---

### 
Crafted with 🖤 for High-Resilience Microservices & Seamless Interoperability
