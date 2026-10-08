import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarOpen: boolean;
  activeTripId: string | null;
  driverShiftStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
  emergencyModalOpen: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
  activeTripId: null,
  driverShiftStatus: "OFFLINE",
  emergencyModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveTripId: (state, action: PayloadAction<string | null>) => {
      state.activeTripId = action.payload;
    },
    setDriverShiftStatus: (
      state,
      action: PayloadAction<"AVAILABLE" | "BUSY" | "OFFLINE">,
    ) => {
      state.driverShiftStatus = action.payload;
    },
    setEmergencyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.emergencyModalOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveTripId,
  setDriverShiftStatus,
  setEmergencyModalOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
