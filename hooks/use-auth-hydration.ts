import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export const useAuthHydration = () => {
  const [isHydrated, setIsHydrated] = useState(
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    const unsubHydrate = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return () => {
      unsubHydrate();
    };
  }, []);

  return isHydrated;
};
