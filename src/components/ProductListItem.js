import React, { memo } from 'react';
import { useWindowDimensions, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import { useTheme, Layout, Text, Button, TopNavigation, Divider, List, Card, Icon } from "@ui-kitten/components";
import { Image, ProgressIndicator, resizeModes } from './Image'
import ProductCategoryBadge from './ProductCategoryBadge';

const ProductListItem = memo(({info}) => {
    const navigation = useNavigation();
    const window = useWindowDimensions();

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            style={{
                backgroundColor: 'white',
                padding: 8,
                marginHorizontal: '0.5%',
                marginVertical: '0.5%',
                width: '49%',
                height: window.height / 2.5,
                borderWidth: 0.1,
                borderColor: 'black',
                borderRadius: 4,
                alignItems: 'flex-start',
                justifyContent: 'space-between'
            }}
            onPress={() => {
                navigation.push('ProductDetails', { info })
            }}
        >
            <SharedElement id={`productDetail.${info.id}.image`}
                style={{
                    width: '100%',
                    height: '60%',
                }}
            >
                <Image 
                    source={{ uri: info.imageUrl }}
                    resizeMode={resizeModes.contain}
                    indicator={ProgressIndicator}
                    indicatorProps={{
                        size: 80,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                    }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </SharedElement>
            <Text category='s1' numberOfLines={2} >
                {info.name}
            </Text>
            <ProductCategoryBadge style={{ padding: 4 }} textCategory="label" category={info.category} />
            <Text category='s1' style={{
                color: '#ff147a'
            }} >
                RM {info.price.toFixed(2)}
            </Text>
            <Text>
                <Text category='c1' style={{fontWeight: 'bold'}}  >
                    {info.quantity}
                </Text>
                <Text category='c1' >
                    &nbsp;in stock
                </Text>
            </Text>

        </TouchableOpacity>
        // <TouchableOpacity style={{
        //     height: 100
        // }} >
        //     <Layout style={{
        //         flex: 1
        //     }}>
        //         <Text>
        //             {info.name}
        //         </Text>
        //     </Layout>

        // </TouchableOpacity>
    )
});
export default ProductListItem;