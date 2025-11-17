import type React from "react";
import { AppContext, type AppContextType } from ".";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const contextValue: AppContextType = {}; // Add your context values here
    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}