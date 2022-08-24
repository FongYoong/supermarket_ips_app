import React, { useState, createContext, useRef } from 'react';

export const MapContext = createContext(undefined);

export function MapProvider ({children}) {
    
    const [showMap, setShowMap] = useState(false);
    const currentNavRef = useRef();

    const displayMap = (navigation) => {
        setShowMap(true);
        if (navigation) {
            currentNavRef.current = navigation;
        }
        // if (navigation) {
        //     const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        //         console.log('bruh_map')
        //         e.preventDefault();
        //         setShowMap(false);
        //         unsubscribe();
        //     });
        // }
    }

    const hideMap = (manualNavBack=false) => {
        setShowMap(false);
        if (currentNavRef.current && manualNavBack) {
            currentNavRef.current.goBack();
        }
        currentNavRef.current = null;
    }

    const [mapState, setMapState] = useState({
        target: undefined,
        
    });

    const setTarget = (target) => {
        setMapState((prev) => {
            return {
                ...prev,
                target
            }
        });
    }

    const mapStateRef = useRef();
    mapStateRef.current = mapStateRef;


    // useEffect(() => {
    // }, [])

    return (
        <MapContext.Provider value={{mapState, setTarget, showMap, displayMap, hideMap}} >
            {children}
        </MapContext.Provider>
    )
}