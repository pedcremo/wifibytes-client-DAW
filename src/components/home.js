/** @module ComponentsApp */
import React from 'react';
import { connect } from "react-redux";
import RateBoxSubComponent from './rateBoxSubcomponent';
import VegasCarousel from './vegasCarousel';
import { getDatosTarifas } from "../actions/datosTarifasActions";
import { getDatosHome } from "../actions/datosHomeActions";
import { getDatosEmpresa } from "../actions/datosEmpresaActions";

class Home extends React.Component {

    componentDidMount() {
        this.props.dispatch(getDatosTarifas());
        this.props.dispatch(getDatosHome());
        this.props.dispatch(getDatosEmpresa());
    }
    /** render: Array with two JSONs first element tarifa?destacado=true endpoint and second home endpoint */
    render() {
        const { error, loading, datosHome, datosTarifa, datosEmpresa } = this.props;
        if (error) return (<div>Error Home! </div>);

        if (loading) return (<div>Loading Home ...</div>);

        if (datosHome && datosTarifa) {

            return (
                <div>
                    <div>
                        <div className="p-5">
                            {
                                datosHome.filter((itemText) => {
                                    return itemText.pk == 1;
                                }).map((item, index) => {
                                    return <span key={index}>
                                        <h1 id="title" className="glow text-center pb-5" key={item.pk}>{item.subtitulo}</h1>
                                        <RateBoxSubComponent key={"rateBox"} rates={datosTarifa.results} />
                                    </span>
                                })
                            }
                            <VegasCarousel vegas={datosEmpresa}/>
                        </div>
                        <div className="row p-5 bg-white">
                            <div className="col-md-6 mt-md-0 mt-3" >
                                {
                                    datosHome.filter((itemText) => {
                                        return itemText.pk == 1;
                                    }).map((item, index) => {
                                        return <span key={index}>
                                            <h1 className="text-uppercase" key={item.pk}>{item.caja_izquierda_titulo}</h1>
                                            <div id="left_box" key={index} dangerouslySetInnerHTML={{ __html: item.caja_izquierda_texto }}></div>
                                        </span>
                                    })
                                }
                            </div>

                            <div className="col-md-6 mt-md-0 mt-3" >
                                {
                                    datosHome.filter((itemText) => {
                                        return itemText.pk == 1;
                                    }).map((item, index) => {
                                        return <span key={index}>
                                            <h1 className="text-uppercase" key={item.pk}>{item.caja_derecha_titulo}</h1>
                                            <div key={index} dangerouslySetInnerHTML={{ __html: item.caja_derecha_texto }}></div>
                                        </span>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

const mapStateToProps = state => ({
    datosHome: state.datosHome.items,
    datosTarifa: state.datosTarifa.items,
    datosEmpresa: state.datosEmpresa.items,
    loading: state.datosEmpresa.loading,
    error: state.datosEmpresa.error
});

//export default Home;
export default connect(mapStateToProps)(Home);