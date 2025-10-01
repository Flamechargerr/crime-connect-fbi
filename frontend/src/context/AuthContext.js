// Unify auth context across JS/TS by re-exporting the TypeScript implementation.
// This avoids divergence between two different contexts that caused session persistence issues.
export { AuthProvider, useAuth } from './AuthContext.tsx';
