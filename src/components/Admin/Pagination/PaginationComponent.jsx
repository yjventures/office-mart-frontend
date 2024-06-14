import React, { useEffect, useState } from 'react'

export default function PaginationComponent({ currentPage, totalPages, onPageChange }) {
    const range = 2; // Number of pages to show on each side of the current page

    // Function to handle pagination link clicks
    const handlePageClick = (pageNumber) => {
        if (pageNumber !== currentPage) {
            onPageChange(pageNumber);
        }
    };

    // Function to generate an array of page numbers for rendering pagination links
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const ellipsis = <span key="ellipsis" className="px-4 pt-4 text-sm font-medium">...</span>;
    
        // Function to add page numbers or ellipsis to the array
        const addPageOrEllipsis = (pageNumber) => {
            pageNumbers.push(
                <p
                    key={pageNumber}
                    className={`inline-flex items-center cursor-pointer border-t-2 ${
                        pageNumber === currentPage
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } px-4 pt-4 text-sm font-medium`}
                    onClick={() => handlePageClick(pageNumber)}
                >
                    {pageNumber}
                </p>
            );
        };
    
        // Add first page
        addPageOrEllipsis(1);
    
        // Add ellipsis if there are skipped pages between the first page and the current page
        if (currentPage - range > 2) {
            pageNumbers.push(ellipsis);
        }
    
        // Add pages within the range of the current page
        for (let i = Math.max(2, currentPage - range); i <= Math.min(currentPage + range, totalPages - 1); i++) {
            addPageOrEllipsis(i);
        }
    
        // Add ellipsis if there are skipped pages between the current page and the last page
        if (totalPages - (currentPage + range) > 1) {
            pageNumbers.push(ellipsis);
        }
    
        // Add last page
        if (totalPages > 1) {
            addPageOrEllipsis(totalPages);
        }
    
        return pageNumbers;
    };
    

    return (
        <nav className="flex items-center justify-center border-t border-gray-200 px-4 py-2 sm:px-0">
            <div className="md:-mt-px md:flex">
                {generatePageNumbers().map((element, index) => (
                    <React.Fragment key={index}>{element}</React.Fragment>
                ))}
            </div>
        </nav>
    );
}

