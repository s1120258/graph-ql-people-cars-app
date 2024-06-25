import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Home from "./components/Home";
import PersonDetails from "./components/PersonDetails.js";
import "./App.css";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

// const App = () => {
//   return (
//     <ApolloProvider client={client}>
//       <div className='App'>
//         <Title />
//         <AddContact />
//         <Contacts />
//       </div>
//     </ApolloProvider>
//   )
// }

const App = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people/:id" element={<PersonDetails />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
