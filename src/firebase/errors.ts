
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;

  constructor(context: SecurityRuleContext) {
    super(`FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify({
  auth: {
    uid: "mock-user-id",
    token: {
      name: "User Simulasi",
      email: "user@example.com"
    }
  },
  method: context.operation,
  path: context.path,
  data: context.requestResourceData
}, null, 2)}`);
    this.name = 'FirestorePermissionError';
    this.context = context;
  }
}
