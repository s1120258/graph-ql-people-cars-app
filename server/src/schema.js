import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    personId: ID!
  }

  type Query {
    people: [Person]
    person(id: ID!): Person
    cars: [Car]
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    deletePerson(id: ID!): Person
    addCar(
      year: Int!
      make: String!
      model: String!
      price: Float!
      personId: ID!
    ): Car
    updateCar(
      id: ID!
      year: Int
      make: String
      model: String
      price: Float
      personId: ID!
    ): Car
    deleteCar(id: ID!): Car
  }
`;

export default typeDefs;
