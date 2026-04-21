// e:\SAAVI\Repo\services\identity-service\src\crm\CrmAdapter.ts

import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

export type CrmProvider = 'hubspot' | 'salesforce' | 'google_sheets' | 'local_excel';

export interface LeadPayload {
    tenantId: string;
    whatsappNumber: string;
    urgencyScore: number;
    extractedGaps: string[];
}

export class GhostHunterCrmSync {
    constructor(
        private provider: CrmProvider, 
        private apiKey?: string, 
        private externalUrl?: string
    ) {}

    public async syncLead(lead: LeadPayload): Promise<boolean> {
        console.log(`[Ghost-Hunter] Dispatching lead to configured routing: ${this.provider}`);

        try {
            switch (this.provider) {
                case 'hubspot':
                    return await this.syncToHubSpot(lead);
                case 'salesforce':
                    return await this.syncToSalesforce(lead);
                case 'google_sheets':
                    return await this.syncToGoogleSheets(lead);
                case 'local_excel':
                    return await this.autoCreateLocalExcel(lead);
                default:
                    throw new Error("Invalid CRM routing target.");
            }
        } catch (error) {
            console.error("[Ghost-Hunter] Sync failed:", error);
            // Fallback loop logic
            if (this.provider !== 'local_excel') {
                console.log("[Ghost-Hunter] Falling back to Local Excel Vault Creation...");
                return await this.autoCreateLocalExcel(lead);
            }
            return false;
        }
    }

    private async syncToHubSpot(lead: LeadPayload) {
        if (!this.apiKey) throw new Error("Missing HubSpot API Key");
        console.log("Mock HTTP push to api.hubapi.com/crm/v3/objects/contacts");
        return true;
    }

    private async syncToSalesforce(lead: LeadPayload) {
        if (!this.apiKey) throw new Error("Missing Salesforce Secret");
        console.log("Mock Sforce API POST /services/data/v52.0/sobjects/Lead");
        return true;
    }

    private async syncToGoogleSheets(lead: LeadPayload) {
        if (!this.externalUrl) throw new Error("Missing Google Sheet URL target");
        console.log(`Appending row to Google API for sheet: ${this.externalUrl}`);
        // Implementing Google APIs logic
        return true;
    }

    private async autoCreateLocalExcel(lead: LeadPayload) {
        console.log("No CRM present or failover requested. Generating local robust MS Excel repository...");
        
        const vaultDir = path.join(process.cwd(), 'vault_exports');
        if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir);

        const filePath = path.join(vaultDir, `tenant_${lead.tenantId}_leads.xlsx`);
        
        let workbook;
        let worksheet;

        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
            worksheet = workbook.Sheets['Leads'];
        } else {
            workbook = xlsx.utils.book_new();
            worksheet = xlsx.utils.json_to_sheet([]);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Leads');
        }

        const data = xlsx.utils.sheet_to_json(worksheet);
        data.push({
            WhatsApp: lead.whatsappNumber,
            Urgency: lead.urgencyScore,
            GapsExtracted: lead.extractedGaps.join(" | "),
            Timestamp: new Date().toISOString()
        });

        const newWorksheet = xlsx.utils.json_to_sheet(data);
        workbook.Sheets['Leads'] = newWorksheet;
        
        xlsx.writeFile(workbook, filePath);
        console.log(`Lead written permanently to fallback local MS Excel -> ${filePath}`);
        return true;
    }
}
