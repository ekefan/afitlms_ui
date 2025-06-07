'use client';

import React, { createContext, useContext } from 'react';

type RoleContextType = {
    activeRole: string;
    userId: string | null;
    switchRole: () => void;
};

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within RoleProvider");
    }
    return context;
};
