
/** @module ComponentsApp */
import React from 'react';
import Swal from 'sweetalert2';
import {
    Utils
} from '../../../../utils'
import {    
    updateField,
    initDatosPersonales
} from "../../../../actions/personalDataFormActions";
import {validator}  from "./validation";
/* import Typecliente from './typeCliente'; */
import { connect } from "react-redux";

const TIPO_CLIENTE_VALUE={0: "particular", 1: "empresa", 5: "autonomo", 2 :"extranjero"}
    
var reader = new FileReader();

const mapDispatchToProps = (dispatch) => ({
    updateField: (data, field, error) => dispatch(updateField(data, field, error)),
    initDatosPersonales: data => dispatch(initDatosPersonales(data))
});
/*trae el estado del reducer root*/
const mapStateToProps = state => ({
    ...state.personalDataForm.datosPersonales
});

    /**
 * @class
 * This component contain the Personal Data Form
 */
class PersonalForm extends React.Component  {
    
    constructor(props) {
        super(props);
        this.previewFile = this.previewFile.bind(this);
        this.dniFile = React.createRef();
    }

    componentDidMount(){        
        const {initDatosPersonales} = this.props;
        const token = Utils.getCookie("jwt");
        //console.log("this.props", this.props)
        if (token) {
            Utils.post('/api-token-verify/', {token: token})
            .then(
                res => {
                    //console.log(res)
                    Utils.get(`/cliente/${res.id_consumer}/`, null, true)
                    .then(
                        res => {
                            //console.log(res)
                            initDatosPersonales(res)
                            /*despach de objeto con acciones*/                                              
                        },
                        error => {
                            /* arrancar el formulario con estado inicial */
                            console.log('cliente/${res.id_consumer : ', error);}
                    );
                },
                error => {
                    /*deberia abrirse el modal y arrancar el formulario con estado inicial*/
                    console.log('ERROR Utils.post ', error);}
            );
        }else{
            /*deberia abrirse el modal y arrancar el formulario con estado inicial*/
        }
    }
   
    
    previewFile() {
        var reader = new FileReader();
        let can = this.refs["dniFile"].files[0];
        if (can) {
            if (can.size < 200000) {
                reader.onloadend = () => {
                    updateField(reader.result, "dniFile", validator(reader.result, "email"))
                };
                reader.readAsDataURL(can);
                
                /* reader.src = reader.readAsDataURL(can);
                return new Promise((resolve, reject) => reader.addEventListener("load", () => resolve(updateField(reader.result, "dniFile", validator(reader.result, "email"))))) */
            } else
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text:"Imagen muy grande",
                })
        }
        return
    }

    
    render() {
            
        const {
            updateField,
            nombre,
            apellido,
            email,
            birthday_omv,
            cifnif,
            telefono,
            dniFile,
            tipo_cliente,
            direccion,
            codpostal,
            ciudad,
            cuenta,
            provincia
        } = this.props;

        //console.warn("RENDER DATAFORM", this.props, "------------------", nombre)
        /**
         * Es importante que el nombre de los inputs coincida con el combre del objeto en redux que guardara su value, ya que de esta manera reutilizamos el validador en el reducer cuando los datos son extaridos por primera vez o desde backend o desde localStorage
         */
        return (
            <form className="grid-data-form">
               <div>
                    <h2>Datos Personales</h2>
                    <div>
                        <label>
                            Nombre
                            <input
                            className="form-control form-control-lg mio"
                            name="nombre"
                            type="text"
                            value={nombre}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "nombre"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!nombre? "": validator(nombre, "nombre")}</span> 
                    </div>

                    <br />
                    <div>
                        <label>
                            <span className={`${validator(apellido, "apellido")==null?"":"text-danger"}`}>Apellido</span>
                            <input
                            className={`form-control form-control-lg mio ${validator(apellido, "apellido")==null?"":"border-danger"}`}
                            name="apellido"
                            type="text"
                            value={apellido}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "apellido"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!apellido? "": validator(apellido, "apellido")}</span> 
                    </div>
                    
                    <div>
                        <label>
                            Tipo de Cliente
                            
                            <select 
                            name = "tipo_cliente"
                            value={tipo_cliente}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "tipo_cliente"))}
                            className="form-control form-control-lg mio">
                                {this.props.tipCliente.map((item, i)=> <option key={i} value={item}>{TIPO_CLIENTE_VALUE[item]}</option>)}  
                            </select>
                            <span className="text-danger">{!tipo_cliente? "": validator(tipo_cliente, "tipo_cliente")}</span> 
                        </label>
                    </div>
                    <br />

                    <br />
                    <div>
                        <label>
                            Documento de Identidad
                            <input
                            className="form-control form-control-lg mio"
                            name="cifnif"
                            type="text"
                            value={cifnif}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, `DNI${TIPO_CLIENTE_VALUE[tipo_cliente]}`))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!cifnif? "": validator(cifnif, `DNI${TIPO_CLIENTE_VALUE[tipo_cliente]}`)}</span> 
                    </div>

                    <br />
                    

                    {/* <br />
                    <div>
                        <label>
                            Fecha de nacimiento
                            <input
                            className="form-control form-control-lg mio"
                            name="birthday_omv"
                            type="date"
                            value={birthday_omv}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "birthday_omv"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!birthday_omv? "": validator(birthday_omv, "birthday_omv")}</span> 
                    </div> */}

                    <br />
                    <div>
                        <input
                        className="form-control form-control-lg mio"
                        name="dniFile"
                        type="file"
                        /* value={dniFile} */
                        ref = "dniFile"
                        onChange={this.previewFile}
                        />
                        <br />
                        <img src={dniFile} height="200" width="200" alt="Image preview..."/>
                        {<span className="text-danger">{!dniFile? "": validator(dniFile, "dniFile")}</span> }
                    </div>

                    

                </div>

                <div>
                    <h2>Datos Facturacion</h2>
                    <div>
                        <label>
                            Email
                            <input
                            className="form-control form-control-lg mio"
                            name="email"
                            type="text"
                            value={email}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "email"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!email? "": validator(email, "email")}</span> 
                    </div>

                    {/* <div>
                        <label>
                            Telefono
                            <input
                            className="form-control form-control-lg mio"
                            name="telefono"
                            type="text"
                            value={telefono}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "telefono"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!telefono? "": validator(telefono, "telefono")}</span> 
                    </div> */}


                    <div>
                        <label>
                            Direccion
                            <input
                            className="form-control form-control-lg mio"
                            name="direccion"
                            type="text"
                            value={direccion}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "direccion"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!direccion? "": validator(direccion, "direccion")}</span> 
                    </div>

                    <div>
                        <label>
                            Codigo Postal
                            <input
                            className="form-control form-control-lg mio"
                            name="codpostal"
                            type="text"
                            value={codpostal}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "codpostal"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!codpostal? "": validator(codpostal, "codpostal")}</span> 
                    </div>

                    <div>
                        <label>
                            Ciudad
                            <input
                            className="form-control form-control-lg mio"
                            name="ciudad"
                            type="text"
                            value={ciudad}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "ciudad"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!ciudad? "": validator(ciudad, "ciudad")}</span> 
                    </div>

                    <div>
                        <label>
                            Provincia
                            <input
                            className="form-control form-control-lg mio"
                            name="provincia"
                            type="text"
                            value={provincia}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "provincia"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!provincia? "": validator(provincia, "provincia")}</span> 
                    </div>

                    <div>
                        <label>
                            Cuenta
                            <input
                            className="form-control form-control-lg mio"
                            name="cuenta"
                            type="text"
                            value={cuenta}
                            onChange={ev => updateField(ev.target.value, ev.target.name, validator(ev.target.value, "cuenta"))}
                            />
                        </label>
                        <br />
                        <span className="text-danger">{!cuenta? "": validator(cuenta, "cuenta")}</span> 
                    </div>

                    
                    {/* 
                    
                    <div>
                        <h4>Suba una imagen de su dni</h4>
                        <input 
                        type="file"
                        id="file" 
                        ref = "file"
                        name = "preview"
                        onChange={this.previewFile} /><br/>
                        <img name="preview" ref="preview" src={!this.state.preview?"":this.state.preview.value} height="130" width="100%" alt="Image preview..."></img>
                        <span className="text-danger">{!this.state.preview? "":this.state.preview.error}</span>
                    </div>
                </div>
 */}
                    
                </div >
            </form>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonalForm);