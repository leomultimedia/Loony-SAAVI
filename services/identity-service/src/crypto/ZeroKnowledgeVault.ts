import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export class ZeroKnowledgeVault {
  /**
   * Encrypts Lead PII before storing in the multi-tenant database.
   * This ensures even the SaaS provider cannot access raw data without the tenant's exact secret.
   */
  static encrypt(text: string, tenantSecret: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    const key = crypto.pbkdf2Sync(tenantSecret, salt, 100000, KEY_LENGTH, 'sha512');
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    // Store all components needed to decrypt (except the tenant's secret)
    return Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')]).toString('base64');
  }

  /**
   * Decrypts the Lead PII strictly at the edge or locally when requested by an authorized tenant.
   */
  static decrypt(encryptedPayloadBase64: string, tenantSecret: string): string {
    const payload = Buffer.from(encryptedPayloadBase64, 'base64');
    
    const salt = payload.subarray(0, SALT_LENGTH);
    const iv = payload.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = payload.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const textBuffer = payload.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    
    const key = crypto.pbkdf2Sync(tenantSecret, salt, 100000, KEY_LENGTH, 'sha512');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(textBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  }
}
