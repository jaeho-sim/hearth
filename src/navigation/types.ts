export type InventoryStackParamList = {
  InventoryTabs: undefined;
  AddEditItem: { categoryId: string; itemId?: string };
  CategoryManager: undefined;
};

export type ShoppingStackParamList = {
  ShoppingList: undefined;
  AddEditShoppingItem: Record<string, never>;
};

export type ChoresStackParamList = {
  Chores: undefined;
  AddEditChore: { choreId?: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
  HouseholdMembers: undefined;
  EditHousehold: undefined;
  CategoryManager: undefined;
};

export type AppTabsParamList = {
  InventoryStack: undefined;
  ShoppingStack: undefined;
  ChoresStack: undefined;
  SettingsStack: undefined;
};
