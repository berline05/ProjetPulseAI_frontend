import { useState, useEffect, useCallback } from "react";
import {
  getTickets,
  createTicket,
  updateTicket as apiUpdate,
  deleteTicket as apiDelete,
} from "../services/tickets";

export function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getTickets()
      .then(setTickets)
      .catch(() => setTickets([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addTicket = useCallback(async (data) => {
    const created = await createTicket(data);
    setTickets((ts) => [created, ...ts]);
    return created;
  }, []);

  const editTicket = useCallback(async (uuid, data) => {
    const updated = await apiUpdate(uuid, data);
    setTickets((ts) => ts.map((t) => (t.uuid === uuid ? updated : t)));
    return updated;
  }, []);

  const removeTicket = useCallback(async (uuid) => {
    await apiDelete(uuid);
    setTickets((ts) => ts.filter((t) => t.uuid !== uuid));
  }, []);

  return { tickets, loading, refresh, addTicket, editTicket, removeTicket };
}
