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

## Quick Start & Demo Configuration (Beginner Friendly)

If you are new to programming or just want to see the system running, follow these super simple steps! Before you start, make sure you download and install these three free tools:
1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**: This runs all the background services.
2. **[Node.js (LTS)](https://nodejs.org/)**: This runs the visual dashboard.
3. **[Cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/) or [Ngrok](https://ngrok.com/download)**: This connects your computer to the internet securely so WhatsApp can talk to your AI.

### Step 1: Open a Secure Tunnel to the Internet
We need to let WhatsApp send messages to your laptop securely. Open your terminal (Command Prompt or PowerShell) and run:
`> cloudflared tunnel --url http://localhost:5678`
*(If you are using Ngrok, run `ngrok http 5678` instead).* 
**Keep this terminal window open!** It will print out a URL that looks like `https://random-words.trycloudflare.com` or `https://1234-abc.ngrok.app`. Copy that URL!

### Step 2: Ignite the Vanguard Architecture
Open a **new** terminal window. Navigate to the folder where this code is saved, and replace `[YOUR_URL_HERE]` with the URL you copied in Step 1 (make sure to leave out the "https://" part if using Windows PowerShell environment variables):

```bash
# Example for Windows PowerShell:
$env:YOUR_TUNNEL_URL="random-words.trycloudflare.com"; docker-compose up -d
```
Docker will now download and start the AI Brain, the Secure Database, and the n8n Automation Engine.

### Step 3: Launch the Omni-Dashboard
Now we just need to start the visual website you will show to people. In the same terminal, type:
```bash
cd frontend
npm install
npm run dev
```
Wait a few seconds, then open a web browser (like Chrome or Safari) and go to:
👉 **[http://localhost:3000/admin/settings](http://localhost:3000/admin/settings)**

That's it! You have successfully deployed an Enterprise-grade AI Sales Infrastructure on your own computer.

## The Ultimate Pitch
> *"This is the **Loony Heads Vanguard**. It is not a bot; it is your **Digital Chief Growth Officer**. It runs on your own hardware for **zero per-token costs**, protects your data with **military-grade encryption**, and closes sales using **advanced behavioral psychology**. It is the world's first self-contained, cyber-aware sales infrastructure."*
