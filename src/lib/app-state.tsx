import { createContext, useContext, useState, type ReactNode } from "react";
import { notificationsSeed } from "./mock-data";

interface AppState {
  year: string;
  setYear: (y: string) => void;
  notifications: typeof notificationsSeed;
  markAllRead: () => void;
  search: string;
  setSearch: (s: string) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState("2025–26");
  const [notifications, setN] = useState(notificationsSeed);
  const [search, setSearch] = useState("");
  return (
    <Ctx.Provider
      value={{
        year, setYear, notifications, search, setSearch,
        markAllRead: () => setN((n) => n.map((x) => ({ ...x, unread: false }))),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppState() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppState outside provider");
  return c;
}
