// PreviousRouteContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { NextRouter, useRouter } from "next/router";

interface PreviousRouteContextType {
  previousRoute: string | null;
  setPreviousRoute: (route: string) => void;
}

const PreviousRouteContext = createContext<
  PreviousRouteContextType | undefined
>(undefined);

const postCurrentRoute = async (router: NextRouter) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_ASHWINGUR_API + "/analytics/frontend_visits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials with the request
        body: JSON.stringify({ route: router.asPath }),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.error("Failed to track route:", error);
  }
};

export const PreviousRouteProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const router = useRouter();
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setPreviousRoute(router.asPath);
    };

    postCurrentRoute(router);

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <PreviousRouteContext.Provider value={{ previousRoute, setPreviousRoute }}>
      {children}
    </PreviousRouteContext.Provider>
  );
};

export const usePreviousRoute = () => {
  const context = useContext(PreviousRouteContext);
  if (context === undefined) {
    throw new Error(
      "usePreviousRoute must be used within a PreviousRouteProvider"
    );
  }
  return context;
};
