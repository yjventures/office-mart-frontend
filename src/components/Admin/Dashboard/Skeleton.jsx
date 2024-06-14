import React from 'react'

const Skeleton = () => {
    return (
        <div role="status" class="max-w-full p-4 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div class="flex items-baseline mt-4">
                <div class="w-full bg-gray-200 rounded-t-lg h-72 dark:bg-gray-700"></div>
                <div class="w-full h-56 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div class="w-full h-64 ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
                <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
                <div class="w-full bg-gray-200 rounded-t-lg h-72 ms-6 dark:bg-gray-700"></div>
                <div class="w-full bg-gray-200 rounded-t-lg h-80 ms-6 dark:bg-gray-700"></div>
            </div>
            <span class="sr-only">Loading...</span>
        </div>
    )
}

export default Skeleton