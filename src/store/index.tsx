import { useState, createContext, ReactElement } from "react";

export interface ContextID {
  id?: number;
  setID?: React.Dispatch<React.SetStateAction<number>>;
}
export const DeviceContext = createContext<ContextID>({});

export const DeviceProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [id, setID] = useState<number>(0);

  return (
    <DeviceContext.Provider value={{ id, setID }}>
      {children}
    </DeviceContext.Provider>
  );
};
