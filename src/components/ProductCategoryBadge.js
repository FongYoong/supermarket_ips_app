import React, { memo } from 'react';
import { Text } from "@ui-kitten/components";
import { productCategories } from '../lib/supermarket_products'

function ProductCategoryBadge({category, textCategory, style, ...props}) {

    const productCategory = productCategories.find((cat) => cat.name === category);

    return (
        <Text category={textCategory} style={{
            width: 'auto',
            backgroundColor: productCategory.color,
            borderRadius: 8,
            fontWeight: 'bold',
            ...style
        }}
            {...props}
        >
            {category}
        </Text>
    )
}

export default memo(ProductCategoryBadge);