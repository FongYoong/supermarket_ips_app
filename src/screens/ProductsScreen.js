import React, { useState, useRef, useContext } from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, Layout, Input, Text, Spinner, TopNavigation, TopNavigationAction, Divider, List } from "@ui-kitten/components";
import { NavigationBackIcon, CloseIcon } from "../components/Icons";
import { BluetoothContext } from "../lib/bluetooth";
import ProductList from "../components/ProductList";
import { MaterialIcons } from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { productCategories } from "../lib/supermarket_products";
const multiselectProductCategories = [
    {
        name: 'Product Categories',
        id: 0,
        children: productCategories.map((cat) => {
            return {
                name: cat.name,
                id: cat.name
            }
        }),
    },
];

const ProductsScreen = ({navigation}) => {
  
  const { bluetoothState } = useContext(BluetoothContext);

  const [searchName, setSearchName] = useState('');
  const [sortType, setSortType] = useState('dateModified');
  const [sortDescending, setSortDescending] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const searchNameInputRef = useRef();

  return (
    <>
        <TopNavigation
            title='Products'
            accessoryLeft={
                <TopNavigationAction icon={NavigationBackIcon} 
                    onPress={() => navigation.goBack() }
                />
            }
        />
        <Divider />
        <Layout style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 8,
        }}>
            <Input
                ref={searchNameInputRef}
                style={{
                    flex: 1
                }}
                defaultValue=""
                placeholder='Search by name'
                accessoryRight={(props) =>
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => {
                            setSearchName('');
                            searchNameInputRef.current.clear();
                        }}
                    >
                        <CloseIcon {...props} />
                    </TouchableOpacity>
                }
                onChangeText={setSearchName}
            />
        </Layout>
        <SectionedMultiSelect
            styles={{
                selectToggle: {
                    padding: 8,
                    marginHorizontal: 8,
                    marginVertical: 16,
                    borderColor: '#9a03ff',
                    borderWidth: 1,
                    borderRadius: 4,
                    backgroundColor: '#e6eefa'
                }
            }}
            items={multiselectProductCategories}
            IconRenderer={MaterialIcons}
            uniqueKey="id"
            subKey="children"
            selectText="Filters"
            showDropDowns={false}
            readOnlyHeadings
            //hideSearch
            onSelectedItemsChange={setCategoryFilter}
            selectedItems={categoryFilter}
        />
        {/* <Text category="h1">Length: {products.length}</Text> */}
        <ProductList categoryFilter={categoryFilter} searchName={searchName} sortType={sortType} sortDescending={sortDescending} />
        {/* <Layout
            style={{
                alignItems: 'center',
            }}
        >
        </Layout> */}
    </>
)};

export default ProductsScreen;

