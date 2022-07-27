import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeSelectedTrolley = (selectedTrolley) => {
    console.log('storeSelected')
    const jsonValue = JSON.stringify(selectedTrolley);
    return AsyncStorage.setItem('selectedTrolley', jsonValue).catch((e) => console.log(e));
}

export const getSelectedTrolley = () => {
    console.log('getSelected')
    return AsyncStorage.getItem('selectedTrolley').catch((e) => console.log(e));
}