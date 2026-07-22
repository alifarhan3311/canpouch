import { createSlice } from '@reduxjs/toolkit';

const storedAgeGate = localStorage.getItem('ageVerifiedStatus');
let initialVerified = null;
try {
  initialVerified = storedAgeGate ? JSON.parse(storedAgeGate) : null;
} catch (e) {
  initialVerified = null;
}

const initialState = {
  isAgeVerified: initialVerified ? initialVerified.isVerified : false,
  verifiedProvince: initialVerified ? initialVerified.province : 'ON',
  verifiedDob: initialVerified ? initialVerified.dob : null,
  showAgeGateModal: !initialVerified || !initialVerified.isVerified
};

const complianceSlice = createSlice({
  name: 'compliance',
  initialState,
  reducers: {
    setAgeVerification: (state, action) => {
      const { isVerified, province, dob } = action.payload;
      state.isAgeVerified = isVerified;
      state.verifiedProvince = province;
      state.verifiedDob = dob;
      state.showAgeGateModal = !isVerified;

      localStorage.setItem(
        'ageVerifiedStatus',
        JSON.stringify({ isVerified, province, dob })
      );
    },
    openAgeGateModal: (state) => {
      state.showAgeGateModal = true;
    }
  }
});

export const { setAgeVerification, openAgeGateModal } = complianceSlice.actions;
export default complianceSlice.reducer;
