
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

/**
 * Kelas error ini hanya digunakan untuk simulasi visual "glitch" 
 * agar terlihat seperti error sistem database sungguhan.
 */
export class SimulatedPermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    super(`SimulationError: Akses ditolak saat mencoba menyinkronkan data ke storage lokal:
${JSON.stringify({
  method: context.operation,
  path: context.path,
  data: context.requestResourceData,
  timestamp: new Date().toISOString(),
  info: "Ini adalah simulasi error untuk melatih ketelitian."
}, null, 2)}`);
    this.name = 'SimulatedPermissionError';
    this.context = context;
  }
}
