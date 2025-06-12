import { View, Text, ImageBackground, Image, Keyboard, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Tabs } from 'expo-router'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'

const TabIcon = ({ focused, title, icon }: any) => {
    if (focused) {
        return (
            <ImageBackground 
                source={images.highlight}
                className='flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden'>
                <Image 
                    source={icon}
                    tintColor="#151312"
                    className='size-5'
                />
                <Text className="text-secondary text-base font-semibold ml-2">{title}</Text>
            </ImageBackground>
        )
    }
    else {
        return (
            <View className="size-full justify-center items-center mt-4 rounded-full">
                <Image source={icon} className='size-5' tintColor="#A8B5DB" />
            </View>
        )
    }
}

const _layout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      keyboardDidHideListener?.remove()
      keyboardDidShowListener?.remove()
    }
  }, [])

  return (
    <Tabs screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
        },
        tabBarStyle: isKeyboardVisible ? { display: 'none' } : {
            backgroundColor: '#0f0d23',
            borderRadius: 50,
            marginHorizontal: 20,
            marginBottom: 50,
            height: 52,
            position: 'absolute',
            overflow: 'hidden',
            borderColor: '0f0d23',
        }
        }}>
        <Tabs.Screen
            name="index"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.home}
                        title="Home"/>
                ),
            }}
        />
        <Tabs.Screen
            name="search"
            options={{
                title: "Search",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.search}
                        title="Search"/>
                ),
            }}
        />
        <Tabs.Screen
            name="saved"
            options={{
                title: "Saved",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.save}
                        title="Saved"/>
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon 
                        focused={focused}
                        icon={icons.person}
                        title="Profile"/>
                ),
            }}
        />

    </Tabs>
  )
}

export default _layout