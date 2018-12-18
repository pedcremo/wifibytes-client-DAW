//Dependencies
import React from 'react';
import {Route, Switch} from 'react-router-dom';
//Components
import Home from "./components/home";
import Legal from "./components/legal";
import Catalog from "./components/catalog/catalog";
import Company from "./components/company";
import Cookies from "./components/cookies";
import Rates from "./components/rates";
import Contacte from "./components/contacte";

const AppRoutes = () =>
   (
       <Switch>
            <Route exact path="/" render={() => <Home />} />
            <Route exact path="/legal" render={() => <Legal />} />
            <Route exact path="/catalog" render={() => <Catalog />} />
            <Route exact path="/company" render={() => <Company />} />
            <Route exact path="/contacte" render={() => <Contacte />} />
            <Route exact path="/cookies" render={() => <Cookies />} />
            <Route exact path="/rates" render={() => <Rates />} />
       </Switch>
    );

export default AppRoutes;