import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeSwitcher } from "./components/theme-switcher";
import { AppLayout } from "./components/app-layout";
import { Dashboard } from "./pages/dashboard";
import { ElectionDetails } from "./pages/election-details";
import { CastVote } from "./pages/cast-vote";
import { Results } from "./pages/results";
import { Profile } from "./pages/profile";
import { VotingContextProvider } from "./context/voting-context";

export default function App() {
  return (
    <Router>
      <VotingContextProvider>
        <AppLayout>
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route path="/election/:id" component={ElectionDetails} />
            <Route path="/vote/:id" component={CastVote} />
            <Route path="/results/:id" component={Results} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </AppLayout>
      </VotingContextProvider>
    </Router>
  );
}