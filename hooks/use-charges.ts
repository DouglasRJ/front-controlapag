import api from "@/services/api";
import { Charge } from "@/types/charge";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const chargeKeys = {
  all: ["charges"] as const,
  details: () => [...chargeKeys.all, "detail"] as const,
  detail: (id: string) => [...chargeKeys.details(), id] as const,
  byEnrollment: (enrollmentId: string) =>
    [...chargeKeys.all, "enrollment", enrollmentId] as const,
  paymentLink: (chargeId: string) =>
    [...chargeKeys.all, "payment-link", chargeId] as const,
};

// Single charge
export function useCharge(id: string | undefined) {
  return useQuery({
    queryKey: chargeKeys.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Charge ID is required");
      const response = await api.get<Charge>(`/charge/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Charges by enrollment (charges are usually included in enrollment)
// This is a helper if needed separately
export function useChargesByEnrollment(enrollmentId: string | undefined) {
  return useQuery({
    queryKey: chargeKeys.byEnrollment(enrollmentId || ""),
    queryFn: async () => {
      if (!enrollmentId) throw new Error("Enrollment ID is required");
      const response = await api.get<Charge[]>(
        `/enrollments/${enrollmentId}/charges`
      );
      return response.data;
    },
    enabled: !!enrollmentId,
  });
}

// Payment link for charge
export function useChargePaymentLink(chargeId: string | undefined) {
  return useQuery({
    queryKey: chargeKeys.paymentLink(chargeId || ""),
    queryFn: async () => {
      if (!chargeId) throw new Error("Charge ID is required");
      const response = await api.get<{ paymentLink: string }>(
        `/payment/charge/${chargeId}`
      );
      return response.data;
    },
    enabled: !!chargeId,
  });
}

