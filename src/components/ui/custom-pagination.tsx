import * as React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { getPageNumbers } from '@/lib/utils';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function PageLink({ page, currentPage, onPageChange }: { page: number; currentPage: number; onPageChange: (page: number) => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onPageChange(page);
  };

  return (
    <PaginationLink href='#' isActive={currentPage === page} onClick={handleClick}>
      {page}
    </PaginationLink>
  );
}

export function CustomPagination({ currentPage, totalPages, onPageChange, className }: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePreviousClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNextClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem className='hidden md:block'>
          <PaginationPrevious
            href='#'
            onClick={handlePreviousClick}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PageLink page={page as number} currentPage={currentPage} onPageChange={onPageChange} />
            </PaginationItem>
          );
        })}

        <PaginationItem className='hidden md:block'>
          <PaginationNext
            href='#'
            onClick={handleNextClick}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
