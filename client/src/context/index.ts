import { createContext } from "react";

export type AppContextType = Record<string, unknown>;

export const AppContext = createContext<AppContextType>({});