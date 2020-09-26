import { createContext } from "react";

export default createContext({
  state: Object,
  client: Object,
  refresh: Function,
});
