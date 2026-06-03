import './global.css'

import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito'
//import AntDesign from '@expo/vector-icons/AntDesign'
import Entypo from '@expo/vector-icons/Entypo'
import { Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { LocationPermissionProvider } from '../contexts/location-permission'

const tabIcons = {
  welcome: require('../../assets/images/tabIcons/home.png'),
  content: require('../../assets/images/tabIcons/explore.png'),
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  })

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-rose-subtle">
        <ActivityIndicator color="#7ac480" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="dark" />
      <LocationPermissionProvider>
        <Tabs
          screenOptions={{
            headerStyle: { backgroundColor: '#f0fdf1' },
            headerTintColor: '#7ac480',
            headerTitleStyle: { fontFamily: 'Nunito_700Bold' },
            tabBarActiveTintColor: '#7ac480',
            tabBarInactiveTintColor: '#90a89a',
            tabBarLabelStyle: { fontFamily: 'Nunito_600SemiBold' },
            tabBarStyle: {
              backgroundColor: '#FAF4EC',
              borderTopColor: '#E8D8C4',
            },
          }}
        >
      <Tabs.Screen
        name="mainmenu"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ size, color }) => <Entypo name="location" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="novolocal"
        options={{
          title: 'Novo Local',
          tabBarIcon: ({ size, color }) => <Entypo name="new-message" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="meuslocais"
        options={{
          title: 'Meus Locais',
          tabBarIcon: ({ size, color }) => <Entypo name="map" size={size} color={color} />
        }}
      />
        </Tabs>
      </LocationPermissionProvider>
    </>
  )
}
