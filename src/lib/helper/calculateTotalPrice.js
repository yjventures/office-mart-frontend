
export const calculateTotalPrice = (product, quantity = 1, selectedVariationDetails) => {
    let totalPrice = 0;

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
                totalPrice = bulkPrice?.price * quantity;
            } else if (highestBulkPriceVariation) {
                totalPrice = highestBulkPriceVariation?.price * quantity;
            } else {
                totalPrice = selectedVariation?.sales_price !== undefined && selectedVariation?.sales_price !== null ? selectedVariation?.sales_price * quantity : selectedVariation?.price * quantity;
            }
        }
    } else {
        // Find the highest bulk price product
        const highestBulkPriceProduct = product?.bulk_prices?.reduce((prev, current) => {
            return (prev?.high_range > current?.high_range) ? prev : current;
        }, product?.bulk_prices?.[0]);

        // Find the appropriate bulk price product for the current quantity
        const bulkPriceProduct = product?.bulk_prices?.find(item => item?.low_range <= quantity && item?.high_range >= quantity) || highestBulkPriceProduct;

        if (bulkPriceProduct) {
            totalPrice = bulkPriceProduct?.price * quantity;
        } else if (highestBulkPriceProduct) {
            totalPrice = highestBulkPriceProduct?.price * quantity;
        } else {
            totalPrice = product?.sales_price !== null && product?.sales_price !== undefined ? product?.sales_price * quantity : product?.price * quantity;
        }
    }

    // console.log("Total Price:", totalPrice);
    return totalPrice;
}
