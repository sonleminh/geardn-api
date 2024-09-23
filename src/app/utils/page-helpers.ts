export const MAX_PER_PAGE = 50;

export function paginateCalculator(pageNumber?: number, limit?: number) {
  const resPerPage = Number(limit ?? MAX_PER_PAGE);
  const currentPage = Number(pageNumber || 1);
  const passedPage = resPerPage * (currentPage - 1);
  return { resPerPage, currentPage, passedPage };
}
