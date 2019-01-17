import { combineReducers } from "redux";
import datosEmpresa from "./datosEmpresaReducer";
import datosHome from "./datosHomeReducer";
import datosTarifa from "./datosTarifaReducer";
import currentRateDetails from "./currentRateDetailsReducer";
import datosArticulos from "./datosArticulosReducer";
import datosRates from "./datosRatesReducer";
import currentCheckout from "./checkoutReducer";
import {i18nState} from "redux-i18n"

export default combineReducers({
    datosHome,
    datosRates,
    datosEmpresa,
    datosTarifa,
    currentRateDetails,
    datosArticulos,
    currentCheckout,
    i18nState
});