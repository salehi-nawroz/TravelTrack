import { useCallback, useEffect, useState } from "react";

// Owns only "which page am I on" for a list of `totalItems` - it never
// fetches or touches the underlying data. Callers slice their own
// already-filtered/sorted array with `startIndex`/`endIndex` for client-side
// pagination, or use `currentPage`/`pageSize` directly as query inputs for a
// future server-side list.
export function usePagination(totalItems, pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Keeps the current page in range whenever totalItems/pageSize shrink the
  // number of available pages (e.g. a filter narrows the results, or the
  // last item on the last page gets removed), instead of stranding the
  // caller on a now-empty page.
  useEffect(() => {
    setCurrentPage((page) => (page > totalPages ? totalPages : page));
  }, [totalPages]);

  const goToPage = useCallback(
    (page) => {
      setCurrentPage(Math.min(Math.max(1, page), totalPages));
    },
    [totalPages],
  );

  const nextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }, []);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    resetPage,
  };
}
