// ./hooks/useRoleCheck.ts
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const BUSINESS_ROLE_ID = "fd8c9450-7c5c-432b-963d-d46bf20aef11";
const CUSTOMER_ROLE_ID = "d9d87093-97d1-4ed3-ab95-bb1c789ab258";

export const useRoleCheck = () => {
  const { userData, isAuthenticated } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && userData) {
        if (userData.role === CUSTOMER_ROLE_ID && pathname && pathname.startsWith("/business")) {
            router.push("/not-yours");
          }
    }
  }, [isAuthenticated, userData, pathname, router]);
};
