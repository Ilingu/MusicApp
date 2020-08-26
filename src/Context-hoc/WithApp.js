import React from "react";
import AppContext from "./AppContext";

const WithPanier = (Component) => (props) => (
  <AppContext.Consumer>
    {(context) => <Component {...props} context={context} />}
  </AppContext.Consumer>
);

export default WithPanier;
