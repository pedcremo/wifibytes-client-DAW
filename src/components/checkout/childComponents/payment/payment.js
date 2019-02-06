import React from 'react'
import { connect } from "react-redux";
import {
  paymentUpdate,
  getPaymentTypes,
} from '../../../../actions/paymentActions';
import MastercardVisaAmericanExpressForm from './paymentTypes/MastercardVisaAmericanExpress';
import DirectDebitForm from './paymentTypes/DirectDebit';
import {PaymentOptionsRadioButton} from './paymentTypes/paymentOptions';
import {PropTypes} from 'prop-types';

const mapStateToProps = state => ({ ...state.payment });

class Payment extends React.Component {
  constructor() {
    super();
    this.changePaymentMethod = () => ev => {
      this.props.dispatch(paymentUpdate(parseInt(ev.target.value)));
      this.paymentForm(parseInt(ev.target.value));} 
  }

  componentDidMount() {
    this.props.dispatch(getPaymentTypes());
  }
  /**Get the month we are, thisDate.getMonth() is an array so january is month 0, we have to add 1 */
  getMonth(){
    const thisDate = new Date();
    return thisDate.getMonth()+1;
  }
  /**Get the year we are */
  getYear(){
    const thisDate = new Date();
    return thisDate.getFullYear();
  }
  paymentForm(codPago=1){
    switch(codPago){
      case 2:
        return ; /**Efectivo */
      case 3:
        return <DirectDebitForm
        changeAnyFormField={this.changeAnyFormField}
        translate={this.context} 
        debitOwner={""}
        iban={""}
        address={""}
        deletePaymentMethod = {this.deletePaymentMethod}
        addDeletePaymentMethodButton = {this.addDeletePaymentMethodButton}
        submittedAtLeastOnce = {this.props.submittedAtLeastOnce}/>;
      default:
        return <MastercardVisaAmericanExpressForm
        changeAnyFormField={this.changeAnyFormField}
        translate={this.context}
        cardOwner={""}
        cardNumber={""}
        expirationYear={this.getYear()}
        expirationMonth={this.getMonth()}
        cvv={""}
        deletePaymentMethod = {this.deletePaymentMethod}
        addDeletePaymentMethodButton = {this.addDeletePaymentMethodButton}
        submittedAtLeastOnce = {this.props.submittedAtLeastOnce}/>;
    }
  }
  showPaymentOptionsRadioButton(){
    return <PaymentOptionsRadioButton
    changePaymentMethod={this.changePaymentMethod}
    paymentOptions={this.props.paymentMethods}
    paymentMethod = {this.props.paymentMethod} />;
  }

  render() {
    return (
      <div className="payment-container">
        {this.showPaymentOptionsRadioButton()}
        {this.paymentForm(this.props.paymentMethod)}
      </div>
      
  ); 

  }
}

Payment.contextTypes = {
  t: PropTypes.func.isRequired
}

export default connect(mapStateToProps)(Payment);