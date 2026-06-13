"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/components/landing/auth";
import { getUserConnections } from "../../../actions/db";
import { Loader2 } from "lucide-react";

export default function LineageRedirect() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  useEffect(() => {
    if (authLoading) return;

    const performRedirect = async () => {
      const storedId = localStorage.getItem("last_connection_id");
      if (storedId) {
        router.replace(`/dashboard/lineage/${encodeURIComponent(storedId)}`);
        return;
      }

      if (session?.user?.id) {
        const res = await getUserConnections(session.user.id);
        if (res.success && res.data && res.data.length > 0) {
          const firstConnId = res.data[0].id;
          router.replace(`/dashboard/lineage/${encodeURIComponent(firstConnId)}`);
          return;
        }
      }

      router.replace("/dashboard/lineage/demo-neon-db");
    };

    performRedirect();
  }, [session, authLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
