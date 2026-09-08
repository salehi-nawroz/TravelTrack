import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

import {
  getCities,
  getCity as getCityApi,
  createCity as createCityApi,
  updateCity as updateCityApi,
  deleteCity as deleteCityApi,
} from "../services/cityService";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/updated":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.map((city) =>
          city.id === action.payload.id ? action.payload : city,
        ),
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  // GET ALL CITIES
  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });

      try {
        const data = await getCities();

        dispatch({
          type: "cities/loaded",
          payload: data,
        });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }

    fetchCities();
  }, []);

  // GET ONE CITY
  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const data = await getCityApi(id);

        dispatch({
          type: "city/loaded",
          payload: data,
        });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity.id],
  );

  // CREATE CITY
  async function createCity(city) {
    dispatch({ type: "loading" });

    try {
      const data = await createCityApi(city);

      dispatch({
        type: "city/created",
        payload: data,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  // UPDATE CITY
  async function updateCity(id, city) {
    dispatch({ type: "loading" });

    try {
      const data = await updateCityApi(id, city);

      dispatch({
        type: "city/updated",
        payload: data,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error updating the city...",
      });
    }
  }

  // DELETE CITY
  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await deleteCityApi(id);

      dispatch({
        type: "city/deleted",
        payload: id,
      });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        error,
        getCity,
        currentCity,
        createCity,
        updateCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined) {
    throw new Error("CitiesContext was used outside of the CitiesProvider");
  }

  return context;
}

export { CitiesProvider, useCities };
