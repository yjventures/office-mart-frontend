export const getSelectedVariationDetails = (product, quantity) => {
    // console.log("Product:", product);
    // console.log("Quantity:", quantity);

    if (product.variations && product.variations.length > 0) {
        // Find a variation with the matching quantity range in bulk prices
        const matchingVariation = product.variations.find(variation => {
            return variation.bulk_prices?.some(bp => bp.low_range <= quantity && bp.high_range >= quantity);
        });

        if (matchingVariation) {
            // Find the bulk price for the matching variation
            const bulkPrice = matchingVariation.bulk_prices.find(bp => bp.low_range <= quantity && bp.high_range >= quantity);
            // console.log("Matching Variation Bulk Price:", bulkPrice);

            return {
                ...matchingVariation,
                price: bulkPrice.price,
                sales_price: matchingVariation.sales_price,
                _id: matchingVariation._id
            };
        } else {
            // No matching variation found, return the first variation with default prices
            const defaultVariation = product.variations[0];
            return {
                ...defaultVariation,
                price: defaultVariation.price,
                sales_price: defaultVariation.sales_price,
                _id: defaultVariation._id
            };
        }
    } else {
        // No variations, return product level price
        const bulkPriceProduct = product.bulk_prices?.find(bp => bp.low_range <= quantity && bp.high_range >= quantity);
        if (bulkPriceProduct) {
            // console.log("Product Level Bulk Price:", bulkPriceProduct);
            return {
                // name: { en: 'Product level price' },
                // description: { en: 'No variation' },
                // images: product.images,
                // _id: product._id,
                // on_sale: product.on_sale,
                // sales_price: product.sales_price,
                price: bulkPriceProduct.price
            };
        } else {
            return {
                // name: { en: 'Product level price' },
                // description: { en: 'No variation' },
                // images: product.images,
                // _id: product._id,
                // on_sale: product.on_sale,
                // sales_price: product.sales_price,
                price: product.price
            };
        }
    }
};