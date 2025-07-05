// packages/charts/src/context.tsx
import { createContext, useContext } from "react";
import type { ChartDependencies } from "./types";

const ChartContext = createContext<ChartDependencies | null>(null);

export const ChartProvider = ({
  children,
  dependencies,
}: {
  children: React.ReactNode;
  dependencies: ChartDependencies;
}) => (
  <ChartContext.Provider value={dependencies}>{children}</ChartContext.Provider>
);

export const useChartDeps = () => {
  const deps = useContext(ChartContext);
  if (!deps) throw new Error("ChartProvider not found");
  return deps;
};
