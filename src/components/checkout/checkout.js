import React from 'react'
import { connect } from "react-redux"
import { Route } from 'react-router-dom'
import { Step } from 'semantic-ui-react'
import {Agent} from './agent';
import PropTypes from 'prop-types'

import steps from "./libraries/steps";
import library from "./libraries/rule_based_library.json";

import sublibrary from "./libraries/subitems_based_library.json";

import {
    ADD_STEPS,
    NEXT_STEP,
    PREVIOUS_STEP,
    UPDATE_STEP
  } from '../../constants/actionTypes';

const mapDispatchToProps = dispatch => ({
    addSteps: (step, steps) =>
      dispatch({ type: ADD_STEPS, payload:{ step, steps } }),
    /**
     * Go to the next step
     */
    nextStep: () =>
      dispatch({ type: NEXT_STEP }),
    /**
     * Go to the previous step
     */
    previousStep: () =>
      dispatch({ type: PREVIOUS_STEP }),
    /**
     * Sets a specific step
     */
    setStep: (step) =>
      dispatch({ type: UPDATE_STEP, payload: { step } })
  });

/**
 * Component Checkout validate the steps you have to follow
 */
class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.addSteps = (step, steps) => this.props.addSteps(step, steps);
        this.setStep = (step) => this.props.setStep(step);
    }

    /**
     * Agent filters cart items and returns an array used to filter the steps to achieve the needed ones
     */
    componentDidMount(){
        if(this.props.cartItems.items != null && JSON.parse(localStorage.getItem('cartReducer')) != null) {
            let stepsRates;
            this.props.cartItems.items.length !== 0?
            stepsRates = Agent.objectsToArray(this.props.cartItems.items, library):
            stepsRates = Agent.objectsToArray(JSON.parse(localStorage.getItem('cartReducer')).items, library);
            let filteredSteps = Agent.filterArray(steps, stepsRates);
            this.addSteps(1, filteredSteps);
        } else {
            this.context.router.history.push('/');
        }  
    }

    componentDidUpdate() {
        

        let that=this;
        const addClickEvent = elem => elem.addEventListener("click", function(event){
            if (!event.target.id) {
                return;
            } else {
                that.setStep(parseInt(event.target.id));
            }
        });
        document.querySelectorAll("div.step").forEach(addClickEvent);
    }
    
    sendOrder(){
        let data = {"personal_data":{"name":"pepito","surname":"caball"},"contract":{"sd":"sdsd"},"confirm":{"asd":"sdsd"}};
        Agent.ObjectSendToOrder(data,steps);
    }
    /**
     * Render prints the steps to follow and calls the function show step
     */
    render() {
        const { loading, steps, currentStep, nextStep } = this.props;
        if (loading) 
            return (<div>Loading...</div>);
        if (steps.length>0 && currentStep){
            return (
                <div>
                    <Step.Group items={steps} attached='top' ordered />
                    
                    {steps[currentStep-1].component}

                    {steps.length > currentStep?
                        (<button onClick={nextStep}>
                            Next
                        </button>):(
                        <button onClick={this.sendOrder()}>
                            Submit
                        </button>)
                    }
                </div>
            )
        } else {
            return(
                <span>LOADING!</span>
            );
        }
    }
}

const mapStateToProps = state => ({
    currentStep: state.currentCheckout.currentStep,
    steps: state.currentCheckout.steps,
    data: state.currentCheckout.data,
    loading: state.currentCheckout.loading
});

Checkout.contextTypes = {
    router: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);