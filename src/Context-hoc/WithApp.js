import React from "react";
import AppContext from "./AppContext";

const WithApp = (Component) => (props) => (
  <AppContext.Consumer>
    {(context) => <Component {...props} context={context} />}
  </AppContext.Consumer>
);

export default WithApp;
