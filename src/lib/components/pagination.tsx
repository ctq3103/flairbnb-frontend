import ReactPaginate from "react-paginate";

interface Props {
  totalPages: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ setPage, currentPage, totalPages }: Props) => {
  return (
    <ReactPaginate
      breakLabel={"..."}
      breakClassName={
        "text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-rose-500 bg-white text-rose-500"
      }
      previousLabel={"＜"}
      nextLabel={"＞"}
      previousClassName={
        "text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-rose-500 bg-white text-rose-500"
      }
      nextClassName={
        "text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-rose-500 bg-white text-rose-500"
      }
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={2}
      initialPage={currentPage}
      onPageChange={({ selected }: { selected: number }) => setPage(selected)}
      containerClassName={"flex pl-0 rounded flex-wrap text-sm"}
      pageClassName={
        "text-xs font-semibold flex w-8 h-8 mx-1 p-0 rounded-full items-center justify-center leading-tight relative border border-solid border-rose-500 bg-white text-rose-500"
      }
      pageLinkClassName={"outline-none"}
      breakLinkClassName={"outline-none"}
      previousLinkClassName={"outline-none"}
      nextLinkClassName={"outline-none"}
      activeClassName={"bg-rose-500"}
      activeLinkClassName={"text-white"}
    />
  );
};
