import {
    GET_CONTACT_DATA_FORM_BEGIN,
    GET_CONTACT_DATA_FORM_SUCCESS,
    GET_CONTACT_DATA_FORM_FAILURE,
    GET_CURRENT_CONTACT_DATA_FORM,
    GET_CONTACT_DATA_FORM_UPDATE,
    UPDATE_CONTACT_DATA_FORM_SERVICES,
    UPDATE_VALID_DTOS_PERSONALES,
    GET_CONTACT_DATA_FORM_SERVICES,
    UPDATE_DATOS_PRODUCTOS,
    GET_VALIDA_FORMS
} from '../actions/personalDataFormActions';

const initialState = {
    fields: {
        datosPersonales:{},
        datosProductos:[]
    },
    totalServices:0,
    validDatosPersonales: false,
    validDatosProductos:false,
    validForms:false,
    loaded: false,
};

export default function personalDataFormReducer(state = initialState, action) {
    
    switch (action.type) {

        case UPDATE_DATOS_PRODUCTOS:
            state.fields["datosProductos"] = action.payload
            state.validDatosProductos = true
            return {
                ...state,
                loaded: false,
                fields: state.fields
            };

        case GET_CONTACT_DATA_FORM_BEGIN:
            
            return {
                ...state,
                loaded: true,
                error: null
            };

        case GET_CONTACT_DATA_FORM_SUCCESS:
        //console.log(Object.keys(state.fields.datosPersonales).length)
        if (Object.keys(state.fields.datosPersonales).length ==0 ) {
                state.fields.datosPersonales ={
                        name: {value: "a"},
                        surname: {value: "lopez"},
                        email: {value: "lopez@gmail.com"},
                        address: {value: "C/ alicante 1"},
                        zip: {value: 46870},
                        city: {value: "Gandia"},
                        cuenta: {value: ""},
                        date: {value: ""},
                        preview: {value: ""}, 
                        tipcli: {value: 0},
                        /* nie: {value: ""},
                        dni: {value: ""},
                        cif: {value: ""}, */
                    }
            }
            console.log(state.fields)
                
            return {
                ...state,
                loaded: false,
                fields: state.fields
            };

        case GET_CONTACT_DATA_FORM_UPDATE:
            const object = action.payload.contactDataForm
            let valid=true;
            state.fields["datosPersonales"] = object
            //console.log(object)
            for (const key in object) {
                if (object[key] != null && object[key]["error"] != false && object[key]["error"] != null) {
                    valid = false;
                    break;
                }
            }
            state.validDatosPersonales = valid
            
            /* if (state.validDatosPersonales && state.validDatosProductos) 
                state.validForms=true
            else
                state.validForms = false */
            //validar
            return {
                ...state,
                loaded: false,
                fields: state.fields
            };

        case UPDATE_CONTACT_DATA_FORM_SERVICES:
            if (!state.fields["datosProductos"]) 
                state.fields["datosProductos"]=[]
                
            state.validDatosProductos = false
            let exist = state.fields["datosProductos"].filter((item)=>{return item.key == parseInt(action.payload.key)})
            
            if (exist.length == 0) {
                let obj= {
                    key: parseInt(action.payload.key),
                    value: action.payload,
                }
                state.fields["datosProductos"].push(obj)
                
            } else {
                state.fields["datosProductos"].filter((item) => {
                    /**
                     * Filtro del el objeto datosProductos por medio de su key
                     * Este objeto contiene la informacion de las tarifas de altas y portabilidades que tiene el carrito
                     */
                    if (item.key == parseInt(action.payload.key)) {
                        /**
                         * Si tiene tipo lo cambia y si fuese necesario elimina la propiedad values, ya que si cambia alta se tienen que eliminar los datos
                         */
                        if (action.payload.tipo) {
                            item.tipo = action.payload.tipo
                            if (item.hasOwnProperty("value")) {
                                delete item.value
                            }
                            if (item.tipo==="alta") {
                                item.valido=true
                            }else{
                                item.valido = false
                            }
                        }
                        /**
                         * Si el objeto que recive del action.payload viene con contenido cambia el objeto de redux con el nuevo contenido
                         */
                        if (action.payload.name) {
                            delete action.payload.key
                            let name = action.payload.name
                            delete action.payload.name
                            //console.log(action.payload[name])
                            if (!item.value) {
                                item.value={}
                            }
                            item.value[name] = action.payload[name]

                        }

                        if (item.tipo === "portabilidad" && item.hasOwnProperty("value")) {
                            if (item.tipoTlf==="fijo") {
                                let object = item.value
                                if (Object.keys(object).length === 2) {
                                    //console.log(object)
                                    let valid = true
                                    //console.log(valid)
                                    for (const key in object) {
                                        if (object[key].hasOwnProperty("error") && object[key]["error"] != undefined) {
                                            valid = false;
                                            break;
                                        }
                                    }
                                    //console.log(valid)
                                    item.valido = valid
                                }
                            }
                            if (item.tipoTlf==="movil") {
                                let object = item.value
                                if (Object.keys(object).length === 3) {
                                    //console.log(object)
                                    let valid = true
                                    //console.log(valid)
                                    for (const key in object) {
                                        if (object[key].hasOwnProperty("error") && object[key]["error"]!=undefined) {
                                            valid = false;
                                            break;
                                        }
                                    }
                                    //console.log(valid)
                                    item.valido = valid
                                }
                            }
                        }
                    }
                })

                let arrayValidados = state.fields["datosProductos"].filter((item)=>{
                    if(item.valido){
                        return item
                    }
                })
                //console.log(arrayValidados.length, state.fields["datosProductos"].length)
                if (arrayValidados.length === state.fields["datosProductos"].length) {
                    state.validDatosProductos = true
                }
                
                
            }

            return {
                ...state,
                loaded: false,
                fields: state.fields
            };

        case GET_CONTACT_DATA_FORM_FAILURE:
            return {
                ...state,
                loaded: false,
                error: action.payload,
                fields: []
            };
        
        case GET_CURRENT_CONTACT_DATA_FORM:
            return {
                ...state,
                loaded: false,
                fields: state
            };

        case UPDATE_VALID_DTOS_PERSONALES:
            state.validDatosPersonales = true
            if (state.validDatosProductos) 
                this.validForms=true

            return {
                ...state,
            };

        case GET_CONTACT_DATA_FORM_SERVICES:
            /**tiene verificar si esiste un objeto con la key que recibe y si no existe crearlo */
            return {
                products: state.fields.datosProductos
            };
        case GET_VALIDA_FORMS:
            let formsValids
            if (state.validDatosPersonales && state.validDatosProductos)
                formsValids = true
            else
                formsValids = false
            //console.log(formsValids, "formsValids")

            return {
                ...state,
                validForms: formsValids
            };

        default:
            return state;
    }
}


function iteraObject(object){

    return "errores"
}