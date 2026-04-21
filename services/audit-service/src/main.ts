// e:\SAAVI\Repo\services\audit-service\src\main.ts
// Clean Architecture: Continuous Shadow Audit Service

import { Kafka } from 'kafkajs';
import express from 'express';

const app = express();
app.use(express.json());

// Event Bus Integration (Interface Adapters)
const kafka = new Kafka({
  clientId: 'audit-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092']
});
const consumer = kafka.consumer({ groupId: 'shadow-audit-group' });

async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'chat.completed', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value?.toString() || '{}');
            console.log(`[Audit Service] Processing chat for Tenant: ${payload.tenantId}`);
            
            // Invoke Core Domain Logic
            const heatmap = generateAuditHeatmap(payload.message, payload.draftResponse);
            
            // Save to Audit DB instance (isolated polyglot persistence)
            saveAuditRecord(payload.tenantId, heatmap);
        },
    });
}

// Domain & Use-Case Layer
function generateAuditHeatmap(prompt: string, aiResponse: string) {
    // Map conversation to IT/OT frameworks
    const gapDetected = prompt.toLowerCase().includes('password') && !aiResponse.toLowerCase().includes('mfa');
    return {
        timestamp: new Date(),
        standardsIdentified: ['ISO 27001', 'ADHICS V2.0'],
        riskLevel: gapDetected ? 'CRITICAL' : 'LOW',
        actionRequired: gapDetected ? 'Propose Identity MFA Solution' : 'None'
    }
}

function saveAuditRecord(tenantId: string, heatmap: any) {
    // DB write via repository pattern
    console.log(`Saved Audit Heatmap for ${tenantId}:`, heatmap);
}

app.get('/audit/health', (req, res) => res.send('OK'));

app.listen(3002, async () => {
    console.log("🛡️ Audit Service listening on Port 3002");
    // await startConsumer(); // Uncomment to connect to Kafka
});
