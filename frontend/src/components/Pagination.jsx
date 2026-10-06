import styles from "./Pagination.module.css";

// Always shows the first and last page plus a small window around the
// current page, collapsing any gaps into a single "…" - a standard compact
// pattern that stays readable whether there are 4 pages or 40.
function getPageNumbers(currentPage, totalPages) {
  const delta = 1;
  const pages = [];

  for (let page = 1; page <= totalPages; page++) {
    if (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - delta && page <= currentPage + delta)
    ) {
      pages.push(page);
    }
  }

  const pagesWithEllipsis = [];
  let previousPage;

  pages.forEach((page) => {
    if (previousPage) {
      if (page - previousPage === 2) {
        pagesWithEllipsis.push(previousPage + 1);
      } else if (page - previousPage > 2) {
        pagesWithEllipsis.push("…");
      }
    }
    pagesWithEllipsis.push(page);
    previousPage = page;
  });

  return pagesWithEllipsis;
}

// Purely presentational: knows nothing about cities, users, filters, or
// Supabase. It just renders Previous/page numbers/Next for whatever page
// state the caller (e.g. usePagination) hands it.
function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  if (!totalItems || totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &larr; Previous
      </button>

      <ul className={styles.pageList}>
        {pageNumbers.map((page, index) =>
          page === "…" ? (
            <li
              key={`ellipsis-${index}`}
              className={styles.ellipsis}
              aria-hidden="true"
            >
              &hellip;
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                className={`${styles.pageButton} ${
                  page === currentPage ? styles.pageButtonActive : ""
                }`}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={styles.navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next &rarr;
      </button>
    </nav>
  );
}

export default Pagination;
