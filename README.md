# Loony Heads Vanguard: Omni-SaaS 🚀

## Overview
The **Vanguard System** is a world-class, **Self-Healing Sales & Compliance Autonomous Loop** engineered specifically for **Loony Heads Digital Innovations**. Grounded in zero-footprint data sovereignty and high-speed execution, it synthesizes the absolute best of zero-latency edge computing with advanced AI behavioral logic.

This repository runs a **Clean Microservices Architecture**, orchestrating a native "Model Garden" which forces zero per-token cost execution against the most sophisticated open-source LLMs globally (Phi-3, Llama-3 70B).

## Core Philosophy & Security Architecture
*   **Zero-Knowledge Vault (AES-256):** Every single lead captured from Meta/WhatsApp is encrypted directly at the tenant layer via `ZeroKnowledgeVault.ts`. Loony Heads mathematically cannot execute unauthorized reads on client PII.
*   **"Kill-Switch" Reseller Enforcement:** Sub-tenants can execute an instantaneous localized wipe (GDPR "Right to be Forgotten") which severs SQL/Prisma mapping globally via automated `wipedAt` signals.
*   **Continuous Shadow Auditing:** While the Autonomous Sales AI responds to incoming leads, an asynchronous background thread inherently assesses the lead's infrastructure map against **ISO 27001**, **ISO 42001**, and **ADHICS V2.0** standards, dynamically populating a real-time Live Heatmap on the Omni-Dashboard.

## Microservices Topology
| Service Module | Engine | Domain Specialization |
| :--- | :--- | :--- |
| **`frontend/`** | Next.js 15 | **God-Mode Dashboard & Trust Center.** Streamlined Edge architecture using Shadcn/UI for pure "Cyber-Noir" dark aesthetics over WebRTC integrations. |
| **`inference-service/`** | Python / FastAPI | **The Model Garden.** Interfaces direct Ollama queries, manages Python PII Scrubber pipelines, and executes Behavioral Dark Psychology loops. |
| **`identity-service/`** | Node.js / Express | **Monetization Core.** Universal SSO via SAML/Entra ID integration and Stripe Webhooks driven purely by *Metered Leads*, not AI tokens. |
| **`audit-service/`** | Node.js / Kafka | **Asynchronous Compliance.** Maps conversation events silently to evaluate infrastructural security boundaries. |

## Quick Start & Demo Configuration

A predefined "Live Demo Loop" is available to natively show off the sales architecture locally to Enterprise partners.

**1. Secure Tunnel Exposure**
To bind the WhatsApp meta integration to your local `n8n` queue router:
```bash
cloudflared tunnel --url http://localhost:5678
# AND pass it inline to your docker runtime below:
```

**2. Ignite the Vanguard Local Deploy**
```bash
$env:YOUR_TUNNEL_URL="[YOUR_TUNNEL_URL]"; docker-compose -f docker-compose.yml up -d
```

**3. Launch the Omni-Dashboard**
```bash
cd frontend && npm run dev
# Then navigate to http://localhost:3000/admin/settings
```

## The Ultimate Pitch
> *"This is the **Loony Heads Vanguard**. It is not a bot; it is your **Digital Chief Growth Officer**. It runs on your own hardware for **zero per-token costs**, protects your data with **military-grade encryption**, and closes sales using **advanced behavioral psychology**. It is the world's first self-contained, cyber-aware sales infrastructure."*
