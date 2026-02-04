import React from "react";

type Props = {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  indexOfFirstUser: number;
  indexOfLastUser: number;
  filteredLength: number;
  usersPerPage: number;
};

export default function DisplayedPagination({ currentPage, setCurrentPage, totalPages, indexOfFirstUser, indexOfLastUser, filteredLength, usersPerPage }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-4">
      <div className="text-sm text-muted-foreground">
        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredLength)} of {filteredLength} users
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? 'bg-primary text-primary-foreground shadow-primary'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-muted text-muted-foreground font-semibold hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
