import { useState, useEffect } from "react";

interface UseAdminListOptions {
  endpoint: string;
  pageSize?: number;
  headers?: Record<string, string>;
  dataKey?: string; // API response дотор өгөгдөл хадгалагддаг key (жишээ нь: data, categories)
}

export function useAdminList<T = any>({ endpoint, pageSize = 10, headers = {}, dataKey = "data" }: UseAdminListOptions) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${page}&limit=${pageSize}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            ...headers,
            "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
            "Content-Type": "application/json",
          },
        });
        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          throw new Error("Серверээс буруу хариу ирлээ");
        }
        if (!res.ok) {
          throw new Error(data.error || data.message || "Алдаа гарлаа");
        }
        const totalCount = parseInt(res.headers.get("X-Total-Count") || "0");
        if (!isMounted) return;
        setTotal(totalCount);
        setHasMore(page * pageSize < totalCount);
        const list = Array.isArray(data[dataKey]) ? data[dataKey] : [];
        if (page === 1) {
          setItems(list);
        } else {
          setItems((prev) => [...prev, ...list]);
        }
      } catch (error) {
        if (!isMounted) return;
        setError(error instanceof Error ? error.message : "Алдаа гарлаа");
        if (page === 1) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchItems();
    return () => {
      isMounted = false;
    };
  }, [endpoint, page, pageSize, dataKey, JSON.stringify(headers)]);

  const refresh = () => {
    setPage(1);
  };

  const loadMore = () => setPage((prev) => prev + 1);

  const deleteItem = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: "DELETE",
        headers: {
          ...headers,
          "Authorization": "Basic " + (typeof window !== "undefined" ? localStorage.getItem("admin_auth") || "" : ""),
          "Content-Type": "application/json",
        },
      });
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error("Серверээс буруу хариу ирлээ");
      }
      if (!res.ok) {
        throw new Error(data.error || data.message || "Устгах үед алдаа гарлаа");
      }
      // Optimistic update: remove deleted item from list
      setItems((prev) => prev.filter((item: any) => item._id !== id));
      // Refresh list after delete
      refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Устгах үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, items, hasMore, total, refresh, loadMore, page, deleteItem };
} 