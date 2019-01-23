import React from 'react'
import { connect } from "react-redux"
import { Step } from 'semantic-ui-react'
import { addSteps, updateStep } from "../../actions/checkoutActions";
import {Agent} from './agent';
import Payment from './payment';
import Personal from '../personalData';
import { PropTypes } from 'prop-types';

/**
 * library that is needed to validate the agent, where we pass the steps (field) and regular expressions
 */
let library = {
    fieldsToValidate:[
        {
            field: "personal_data",
            regexp: /^([0-9a-z]{8})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{4})-([0-9a-z]{12})$/
        },
        {
            field: "contract",
            regexp: /^([0-9]{1,})$/
        }
    ],
    requiredFields:["confirm"]
};

/**
 * mock items
 */
let items = [
    {
        id: "0cab50a1-ea99-4aa4-9a49-1983f06a5614"
    },
    {
        id:5
    },
    {
        id: "0cab70a1-ea99-4aa4-9a49-1983f06a5614"
    }
]

/**
 * object that Step.Group needs to show the steps
 */
let steps = [
    {
        key: 'personal_data',
        active: true,
        completed: false,
        title: 'Dades Personals',
    },
    {
        key: 'contract',
        active: false,
        completed: false,
        title: 'Contracte',
    },
    { 
        key: 'confirm',
        active: false,
        completed: false,
        title: 'Confirmar Pedido' 
    },
]
/**
 * Component Checkout validate the steps you have to follow
 */
class Checkout extends React.Component {
    constructor(props) {
        super(props)
        this.nextStep = this.nextStep.bind(this)
        this.previousStep = this.previousStep.bind(this)
    }
    /**
     * Sets a specific step
     */
    /* setStep(step) {
        this.props.dispatch(updateStep(step));
    } */

    /**
     * Go to the next step
     */
    nextStep() {
        this.props.dispatch(updateStep(this.props.currentStep+1));
    }

    /**
     * Go to the previous step
     */
    previousStep() {
        this.props.dispatch(updateStep(this.props.currentStep-1));
    }

    /**
     * Shows the step in which you are
     */
    showStep() {
        switch (this.props.steps[this.props.currentStep-1].key) {
            case 'personal_data':
                console.log("firstStep");
                return <Personal 
                            nextStep={this.nextStep}
                        />
                
            case 'contract':
                console.log("secondStep");
                return <button onClick={this.nextStep}>Next</button>

            case 'confirm':
                console.log("thirdStep");
                return <Payment />

            default:
                return
        }

    }

    /**
     * Agent filters cart items and returns an array used to filter the steps to achieve the needed ones
     */
    componentDidMount(){
        let stepsRates = Agent.objectsToArray(items, library);
        steps = Agent.filterArray(steps, stepsRates);
        this.props.dispatch(addSteps(1, steps));
    }

    /**
     * Render prints the steps to follow and calls the function show step
     */
    render() {
        const { loading, steps, currentStep } = this.props;
        if (loading) 
            return (<div>Loading...</div>);
        if (steps.length>0 && currentStep){
            return (
                <div>
                    <Step.Group items={steps} attached='top' ordered />
                    {this.showStep()}
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
    loading: state.currentCheckout.loading
});

Checkout.contextTypes = {
    t: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Checkout);