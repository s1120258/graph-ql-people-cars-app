import "./App.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "./components/pages/Home";
import PersonDetails from "./components/pages/PersonDetails";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Home />
        <PersonDetails />
      </div>
    </ApolloProvider>
  );
};

export default App;
