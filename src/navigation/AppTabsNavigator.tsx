import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';

import { InventoryTopTabs } from '@/navigation/InventoryTopTabs';
import { AddEditItemScreen } from '@/screens/inventory/AddEditItemScreen';
import { CategoryManagerScreen } from '@/screens/inventory/CategoryManagerScreen';

import { ShoppingListScreen } from '@/screens/shopping/ShoppingListScreen';
import { AddEditShoppingItemScreen } from '@/screens/shopping/AddEditShoppingItemScreen';

import { ChoresScreen } from '@/screens/chores/ChoresScreen';
import { AddEditChoreScreen } from '@/screens/chores/AddEditChoreScreen';

import { SettingsScreen } from '@/screens/settings/SettingsScreen';
import { HouseholdMembersScreen } from '@/screens/settings/HouseholdMembersScreen';
import { EditHouseholdScreen } from '@/screens/settings/EditHouseholdScreen';

const stackScreenOptions = {
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' as const },
};

const InventoryStack = createNativeStackNavigator();
function InventoryStackNavigator() {
  return (
    <InventoryStack.Navigator screenOptions={stackScreenOptions}>
      <InventoryStack.Screen name="InventoryTabs" component={InventoryTopTabs} options={{ headerShown: false }} />
      <InventoryStack.Screen name="AddEditItem" component={AddEditItemScreen} options={{ title: '' }} />
      <InventoryStack.Screen name="CategoryManager" component={CategoryManagerScreen} options={{ title: '' }} />
    </InventoryStack.Navigator>
  );
}

const ShoppingStack = createNativeStackNavigator();
function ShoppingStackNavigator() {
  return (
    <ShoppingStack.Navigator screenOptions={stackScreenOptions}>
      <ShoppingStack.Screen name="ShoppingList" component={ShoppingListScreen} options={{ title: 'Shopping List' }} />
      <ShoppingStack.Screen name="AddEditShoppingItem" component={AddEditShoppingItemScreen} options={{ title: '' }} />
    </ShoppingStack.Navigator>
  );
}

const ChoresStack = createNativeStackNavigator();
function ChoresStackNavigator() {
  return (
    <ChoresStack.Navigator screenOptions={stackScreenOptions}>
      <ChoresStack.Screen name="Chores" component={ChoresScreen} options={{ title: 'Chores' }} />
      <ChoresStack.Screen name="AddEditChore" component={AddEditChoreScreen} options={{ title: '' }} />
    </ChoresStack.Navigator>
  );
}

const SettingsStack = createNativeStackNavigator();
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={stackScreenOptions}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <SettingsStack.Screen name="HouseholdMembers" component={HouseholdMembersScreen} options={{ title: '' }} />
      <SettingsStack.Screen name="EditHousehold" component={EditHouseholdScreen} options={{ title: '' }} />
      <SettingsStack.Screen name="CategoryManager" component={CategoryManagerScreen} options={{ title: '' }} />
    </SettingsStack.Navigator>
  );
}

const Tabs = createBottomTabNavigator();

export function AppTabsNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="InventoryStack"
        component={InventoryStackNavigator}
        options={{ title: 'Inventory', tabBarIcon: ({ color, size }) => <Ionicons name="cube-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="ShoppingStack"
        component={ShoppingStackNavigator}
        options={{ title: 'Shopping', tabBarIcon: ({ color, size }) => <Ionicons name="cart-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="ChoresStack"
        component={ChoresStackNavigator}
        options={{ title: 'Chores', tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{ title: 'Settings', tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }}
      />
    </Tabs.Navigator>
  );
}
