export const calculateUnitPrice = (product, quantity = 1, selectedVariationDetails) => {
    let unitPrice = 0;

    // console.log("Product:", product);
    // console.log("Quantity:", quantity);
    // console.log("Selected Variation Details:", selectedVariationDetails);


    if (selectedVariationDetails?.id) {
        const selectedVariation = product?.variations?.find(variation => variation?._id === selectedVariationDetails?._id);
        if (selectedVariation) {
            // Find bulk price for the selected variation within the quantity range
            const bulkPrice = selectedVariation?.bulk_prices?.find(item => item?.low_range <= quantity && item?.high_range >= quantity);

            // If no bulk price found, find the highest bulk price for the selected variation
            const highestBulkPriceVariation = selectedVariation?.bulk_prices?.reduce((prev, current) => {
                return (prev?.high_range > current?.high_range) ? prev : current;
            }, selectedVariation?.bulk_prices?.[0]);

            if (bulkPrice) {
                unitPrice = bulkPrice?.price;
            } else if (highestBulkPriceVariation) {
                unitPrice = highestBulkPriceVariation?.price;
            } else {
                unitPrice = selectedVariation?.sales_price !== undefined && selectedVariation?.sales_price !== null ? selectedVariation?.sales_price : selectedVariation?.price;
            }
        }
    } else {
        // If no variation is selected, check the product bulk prices
        const bulkPriceProduct = product?.bulk_prices?.find(item => item?.low_range <= quantity && item?.high_range >= quantity);

        // Find the highest bulk price for the product
        const highestBulkPriceProduct = product?.bulk_prices?.reduce((prev, current) => {
            return (prev?.high_range > current?.high_range) ? prev : current;
        }, product?.bulk_prices?.[0]);

        if (bulkPriceProduct) {
            unitPrice = bulkPriceProduct?.price;
        } else if (highestBulkPriceProduct) {
            unitPrice = highestBulkPriceProduct?.price;
        } else {
            unitPrice = product?.sales_price !== null && product?.sales_price !== undefined ? product?.sales_price : product?.price;
        }
    }

    // console.log("Unit Price:", unitPrice);
    return unitPrice;
}
