import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_PROFILE_DATA } from "../constants/profileData";

const STORAGE_KEY = "@profileEditor:data:v1";

const initialState = {
  profile: DEFAULT_PROFILE_DATA,
  isEditing: false,
  lastLoadedUsername: null,
};

const ProfileDataContext = createContext({
  state: initialState,
  dispatch: () => {},
});

function reducer(state, action) {
  switch (action.type) {
    case "SET_EDITING":
      return { ...state, isEditing: action.value };
    case "MERGE_PROFILE":
      return { ...state, profile: { ...state.profile, ...action.updates } };
    case "SET_PROFILE":
      return { ...state, profile: action.profile || action.data || state.profile };
    case "SET_LAST_LOADED_USERNAME":
      return { ...state, lastLoadedUsername: action.value };
    case "SET_HIGHLIGHTS_VISIBLE":
      return {
        ...state,
        profile: {
          ...state.profile,
          highlightsVisible: action.value,
          showHighlights: action.value,
        },
      };
    case "SET_THREADS_VISIBLE":
      return {
        ...state,
        profile: {
          ...state.profile,
          threadsRowVisible: action.value,
          showThreadsRow: action.value,
        },
      };
    case "RESET_PROFILE":
      return { ...initialState };
    case "HYDRATE":
      const hydratedProfile = action.profile || state.profile;
      return {
        ...state,
        profile: {
          ...DEFAULT_PROFILE_DATA,
          ...hydratedProfile,
          dashboardVisible:
            hydratedProfile.dashboardVisible ?? hydratedProfile.showDashboardVisible ?? true,
          threadsRowVisible:
            hydratedProfile.threadsRowVisible ?? hydratedProfile.showThreadsRow ?? true,
          highlightsVisible:
            hydratedProfile.highlightsVisible ?? hydratedProfile.showHighlights ?? true,
        },
        lastLoadedUsername: action.lastLoadedUsername ?? state.lastLoadedUsername,
      };
    default:
      return state;
  }
}

export function ProfileDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!mounted || !raw) {
          return;
        }

        try {
          const parsed = JSON.parse(raw);
          dispatch({
            type: "HYDRATE",
            profile: parsed.profile,
            lastLoadedUsername: parsed.lastLoadedUsername,
          });
        } catch {
          // Ignore stale or malformed storage.
        }
      })
      .finally(() => {
        if (mounted) {
          setHydrated(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        profile: state.profile,
        lastLoadedUsername: state.lastLoadedUsername,
      })
    );
  }, [hydrated, state.profile, state.lastLoadedUsername]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ProfileDataContext.Provider value={value}>{children}</ProfileDataContext.Provider>;
}

export function useProfileData() {
  return useContext(ProfileDataContext);
}
