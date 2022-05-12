import React, { useEffect } from "react";
import Home from "./Home";
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  useHistory,
} from "react-router-dom";
import ShowReport from "./ShowReport";
import NotFound from "./NotFound";

function App() {
  const location = useLocation();
  const history = useHistory();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("W")) {
      history.push("/home?W=" + query.get("W"));
    }
  }, []);
  return (
    <div>
      <Switch>
        <Route
          exact
          path="/showreport"
          render={(props) => <ShowReport {...props} />}
        />
        <Route path="/home" render={(props) => <Home {...props} />} />
        <Route path="/" />
        <Route path="/not-found" render={() => <NotFound />} />
        {/* <Route path="/*" component={() => <NotFound />} /> */}
      </Switch>
    </div>
  );
}

export default App;
