import dynamic from "next/dynamic";
import { ComponentType, ReactNode } from "react";

export function createClientOnlyComponent<P extends object>(
  Component: ComponentType<P>,
  fallback?: () => ReactNode
) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: fallback,
  });
}