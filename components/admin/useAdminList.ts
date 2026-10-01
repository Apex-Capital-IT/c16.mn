import { useState, useEffect, useCallback } from "react";
import {
  adminStore,
  collectionFromEndpoint,
  fakeDelay,
  removeFromStore,
} from "./mock-store";

interface UseAdminListOptions {
  endpoint: string; // used only to pick the mock collection: news / categories / authors
  pageSize?: number;
  headers?: Record<string, string>;
  dataKey?: string;
}

// Mock list hook: reads from the in-memory admin store, simulates pagination and delete.
export function useAdminList<T = any>({ endpoint, pageSize = 10 }: UseAdminListOptions) {
  const collection = collectionFromEndpoint(endpoint);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    fakeDelay(250).then(() => {
      if (!isMounted) return;
      const all = adminStore[collection] as unknown as T[];
      setTotal(all.length);
      setItems(all.slice(0, page * pageSize));
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [collection, page, pageSize, version]);

  const refresh = useCallback(() => {
    setPage(1);
    setVersion((v) => v + 1);
  }, []);

  const loadMore = () => setPage((prev) => prev + 1);

  const deleteItem = async (id: string) => {
    await fakeDelay(200);
    removeFromStore(collection, id);
    setItems((prev) => prev.filter((item: any) => item._id !== id));
    setTotal((t) => Math.max(0, t - 1));
  };

  const hasMore = items.length < total;

  return { loading, error, items, hasMore, total, refresh, loadMore, page, deleteItem };
}
