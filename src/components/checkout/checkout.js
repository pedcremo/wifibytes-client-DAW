import React from 'react'
import { connect } from "react-redux"
import { Step } from 'semantic-ui-react'
import { addSteps, updateStep } from "../../actions/checkoutActions";
import {Agent} from './agent';
import { PropTypes } from 'prop-types';
import steps from "./libraries/steps";
import library from "./libraries/rule_based_library.json";

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
    setStep(step) {
        this.props.dispatch(updateStep(step));
    }

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
     * Agent filters cart items and returns an array used to filter the steps to achieve the needed ones
     */
    componentDidMount(){
        let stepsRates = Agent.objectsToArray(items, library);
        let filteredSteps = Agent.filterArray(steps, stepsRates);
        this.props.dispatch(addSteps(1, filteredSteps));
        

    }

    componentWillReceiveProps() {
        let that=this;
        const addClickEvent = elem => elem.addEventListener("click", function(event){
            that.setStep(event.target.id);
        });
        document.querySelectorAll("div.step").forEach(addClickEvent);
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
                    
                    {steps[currentStep-1].component}

                    {steps.length > currentStep?
                    (<button onClick={this.nextStep}>
                        Next
                    </button>):(
                        <button>
                            Submit
                        </button>
                    )
                    
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
    loading: state.currentCheckout.loading
});

Checkout.contextTypes = {
    t: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Checkout);