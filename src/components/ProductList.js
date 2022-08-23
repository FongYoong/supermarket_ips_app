import React, { useState, useEffect, memo } from "react";
import { StyleSheet } from 'react-native';
import { useTheme, Layout, Text, Spinner, Divider, List } from "@ui-kitten/components";
import ProductListItem from "./ProductListItem";
import { getProductsRef, toArray } from "../lib/firebase";
import { useDatabaseSnapshot  } from "@react-query-firebase/database";


const ProductList = memo(({categoryFilter, searchName, sortType, sortDescending}) => {
  const productsRef = getProductsRef();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const products = useDatabaseSnapshot(["products"], productsRef,
    {
        //subscribe: true,
    },
    {
        select: (result) => {
            const products = toArray(result);
            return products;
        },
  });

  useEffect(() => {
    if (products.isSuccess) {
        const filtered = products.data.filter((prod) => {
        if (categoryFilter.length > 0 && !categoryFilter.includes(prod.category)) {
            return false;
        }
        if (searchName) {
            return prod.name.toLowerCase().includes(searchName.toLowerCase());
        }
        return true;
    
        });
        filtered.sort((a, b) => {
        if (sortType === 'alphabet') {
            return sortDescending ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
        }
        else if (sortType === 'dateModified') {
            return sortDescending ? b.dateModified - a.dateModified : a.dateModified - b.dateModified;
        }
        });
        //return filtered;
        setFilteredProducts(filtered);
    }
  }, [products.isSuccess, categoryFilter, searchName, sortType, sortDescending]);

  const renderItem = (info) => (
    <ProductListItem info={info.item}  />
  );

  return (
    <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}} >
        {!products.isLoading && products.isSuccess ?
            <List
                style={{
                    width: '100%'
                }}
                // contentContainerStyle={{
                // }}
                columnWrapperStyle={{
                    padding: 4,
                    flex: 1,
                    justifyContent: "flex-start",
                }}
                refreshing={products.isRefetching}
                numColumns={2}
                initialNumToRender={6}
                maxToRenderPerBatch={6}
                removeClippedSubviews
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={{
                        padding: 8
                    }}>
                        No items found.
                    </Text>
                }
            />
        :
            <Spinner size='large' />
        }
    </Layout>
)});

export default ProductList;

