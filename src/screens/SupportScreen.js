import React, { useContext } from "react";
import { Layout, Text, Divider, TopNavigation, TopNavigationAction } from "@ui-kitten/components";
import { Chat } from '@flyerhq/react-native-chat-ui'
import { InfoIcon, NavigationBackIcon } from "../components/Icons";
import { AuthContext } from "../lib/firebase_auth";
import { TrolleysContext } from "../lib/trolleys";
import { getChatMessagesRef, toArray, addChatMessage } from "../lib/firebase";
import { useDatabaseSnapshot  } from "@react-query-firebase/database";

const userProfile = { id: 'user' }
const adminProfile = { id: 'admin' }

const SupportScreen = ({navigation}) => {

    const { trolleyConnected, trolleysState } = useContext(TrolleysContext);
    const { auth, authLoading } = useContext(AuthContext);
    const authUID = auth ? auth.uid : null;
    const chatMessagesRef = getChatMessagesRef(authUID);
    const chatMessagesQuery = useDatabaseSnapshot(["chatMessages", authUID], chatMessagesRef,
    {
        subscribe: true,
    },
        {
            select: (result) => {
                const messages = toArray(result).map((m) => {
                    return {
                        id: m.id,
                        author: { id: m.sender},
                        dateCreated: new Date(m.dateCreated),
                        text: m.content,
                        type: 'text',
                    }
                }).reverse();
                return messages;
            },
            refetchOnMount: "always",
    });

    // console.log('auth:', auth.uid)
    // console.log('loading:', chatMessagesQuery.isLoading)
    // console.log('messages:', chatMessagesQuery.data)
    const chatMessages = chatMessagesQuery.data ? chatMessagesQuery.data : [];

    const handleSendPress = (message) => {
        addChatMessage(authUID, {
            sender: 'user',
            content: message.text,
            trolley: trolleyConnected === true ? trolleysState.selectedTrolley.name : null
        }, (messageId) => {
            // Success
        }, (error) => {
            console.log(error)
        })
    }  

    console.log(trolleyConnected)

    return (
    <>
        <TopNavigation
            title='Support'
            accessoryLeft={
                <TopNavigationAction icon={NavigationBackIcon} 
                    onPress={() => navigation.goBack() }
                />
            }
        />
        <Divider />
        <Layout level='2' style={{
            borderRadius: 4,
            padding: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
        }} >
            <InfoIcon fill='#8F9BB3' style={{ marginHorizontal: 8, width: 32, height: 32 }}  />
            <Text category='s1' >
                {trolleyConnected === true ? `Connected to: ${trolleysState.selectedTrolley.name}` : 'Not connected to any trolley.' }
            </Text>
        </Layout>
        <Chat
            messages={chatMessages}
            onSendPress={handleSendPress}
            user={userProfile}
        />
        {/* <Layout style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 8,
        }}>

        </Layout> */}
    </>
)};

export default SupportScreen;