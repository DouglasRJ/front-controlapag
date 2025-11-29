import { USER_ROLE } from "@/types/user-role";

/**
 * Verifica se o usuário tem uma role de provider (PROVIDER, INDIVIDUAL, MASTER, SUB_PROVIDER)
 */
export function isProviderRole(role?: USER_ROLE): boolean {
  if (!role) return false;
  return (
    role === USER_ROLE.PROVIDER ||
    role === USER_ROLE.INDIVIDUAL ||
    role === USER_ROLE.MASTER ||
    role === USER_ROLE.SUB_PROVIDER
  );
}

/**
 * Verifica se o usuário é MASTER (dono da organização)
 */
export function isMasterRole(role?: USER_ROLE): boolean {
  return role === USER_ROLE.MASTER;
}

/**
 * Verifica se o usuário é SUB_PROVIDER (funcionário convidado)
 */
export function isSubProviderRole(role?: USER_ROLE): boolean {
  return role === USER_ROLE.SUB_PROVIDER;
}

/**
 * Verifica se o usuário é INDIVIDUAL (provider sem organização)
 */
export function isIndividualRole(role?: USER_ROLE): boolean {
  return role === USER_ROLE.INDIVIDUAL;
}

