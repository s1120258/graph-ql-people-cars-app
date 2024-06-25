import { people, cars } from "./presetData.js";

const resolvers = {
  Query: {
    people: () => people,
    person: (parent, args) => people.find((person) => person.id === args.id),
    cars: () => cars,
    car: (parent, args) => cars.find((car) => car.id === args.id),
  },
  Mutation: {
    addPerson: (parent, args) => {
      const newPerson = {
        id: String(people.length + 1),
        firstName: args.firstName,
        lastName: args.lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (parent, args) => {
      const personIndex = people.findIndex((person) => person.id === args.id);
      if (personIndex === -1) throw new Error("Person not found");
      const updatedPerson = { ...people[personIndex], ...args };
      people[personIndex] = updatedPerson;
      return updatedPerson;
    },
    deletePerson: (parent, args) => {
      const personIndex = people.findIndex((person) => person.id === args.id);
      if (personIndex === -1) throw new Error("Person not found");
      const deletedPerson = people.splice(personIndex, 1)[0];
      cars = cars.filter((car) => car.personId !== args.id);
      return deletedPerson;
    },
    addCar: (parent, args) => {
      const newCar = { id: String(cars.length + 1), ...args };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (parent, args) => {
      const carIndex = cars.findIndex((car) => car.id === args.id);
      if (carIndex === -1) throw new Error("Car not found");
      const updatedCar = { ...cars[carIndex], ...args };
      cars[carIndex] = updatedCar;
      return updatedCar;
    },
    deleteCar: (parent, args) => {
      const carIndex = cars.findIndex((car) => car.id === args.id);
      if (carIndex === -1) throw new Error("Car not found");
      return cars.splice(carIndex, 1)[0];
    },
  },
  Person: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },
};

export default resolvers;
