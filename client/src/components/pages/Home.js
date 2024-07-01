import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Card, Modal } from "antd";

import EditPersonForm from "../forms/EditPersonForm";
import EditCarForm from "../forms/EditCarForm";
import PersonDetails from "./PersonDetails";
import CarForm from "../forms/CarForm";
import {
  GET_PEOPLE_AND_CARS,
  ADD_PERSON,
  DELETE_PERSON,
  DELETE_CAR,
} from "../../graphql/queries";

const Home = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE_AND_CARS);
  const [addPerson] = useMutation(ADD_PERSON);
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE_AND_CARS });
      cache.writeQuery({
        query: GET_PEOPLE_AND_CARS,
        data: {
          people: people.filter((person) => person.id !== deletePerson.id),
        },
      });
    },
  });
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE_AND_CARS });
      cache.writeQuery({
        query: GET_PEOPLE_AND_CARS,
        data: {
          people: people.map((person) => ({
            ...person,
            cars: person.cars.filter((car) => car.id !== deleteCar.id),
          })),
        },
      });
    },
  });

  const [editingPersonId, setEditingPersonId] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : </p>;

  const handleAddPerson = (values) => {
    addPerson({
      variables: values,
      update: (cache, { data: { addPerson } }) => {
        const { people } = cache.readQuery({ query: GET_PEOPLE_AND_CARS });
        cache.writeQuery({
          query: GET_PEOPLE_AND_CARS,
          data: { people: [...people, addPerson] },
        });
      },
    });
  };

  const handleDeletePerson = (personId) => {
    deletePerson({ variables: { id: personId } });
  };

  const handleDeleteCar = (carId) => {
    deleteCar({ variables: { id: carId } });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  const handleViewDetails = (personId) => {
    setSelectedPersonId(personId);
  };

  const handleGoBack = () => {
    setSelectedPersonId(null);
  };

  if (selectedPersonId) {
    return (
      <PersonDetails personId={selectedPersonId} onGoBack={handleGoBack} />
    );
  }

  return (
    <div>
      <Form onFinish={handleAddPerson}>
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "First name is required" }]}
        >
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Last name is required" }]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Add Person
        </Button>
      </Form>

      <CarForm people={data.people} onClose={() => {}} />

      {data.people.map((person) => (
        <Card
          key={person.id}
          title={`${person.firstName} ${person.lastName}`}
          extra={
            <Button onClick={() => handleViewDetails(person.id)}>
              LEARN MORE
            </Button>
          }
        >
          <>
            <Button onClick={() => setEditingPersonId(person.id)}>
              Edit Person
            </Button>
            <Button onClick={() => handleDeletePerson(person.id)} danger>
              Delete Person
            </Button>
            <div>
              {person.cars.map((car) => (
                <Card
                  key={car.id}
                  type="inner"
                  title={`${car.make} ${car.model}`}
                  extra={`$${car.price}`}
                >
                  <p>Year: {car.year}</p>
                  <Button onClick={() => handleEditCar(car)}>Edit Car</Button>
                  <Button onClick={() => handleDeleteCar(car.id)} danger>
                    Delete Car
                  </Button>
                </Card>
              ))}
            </div>
          </>
        </Card>
      ))}

      {editingPersonId != null && (
        <Modal
          title="Edit Person"
          visible={true}
          onCancel={() => setEditingPersonId(null)}
          footer={null}
        >
          <EditPersonForm
            person={data.people.find((person) => person.id === editingPersonId)}
            onClose={() => setEditingPersonId(null)}
          />
        </Modal>
      )}

      {editingCar && (
        <Modal
          visible={!!editingCar}
          title="Edit Car"
          onCancel={() => setEditingCar(null)}
          footer={null}
        >
          <EditCarForm
            car={editingCar}
            people={data.people}
            onClose={() => setEditingCar(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Home;
