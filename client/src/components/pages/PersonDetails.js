import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Card, Button, Modal, List } from "antd";
import CarForm from "../forms/CarForm";
import EditCarForm from "../forms/EditCarForm";

const GET_PERSON_WITH_CARS = gql`
  query GetPersonWithCars($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

const PersonDetails = ({ personId, onGoBack }) => {
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id: personId },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      cache.modify({
        id: cache.identify(data.person),
        fields: {
          cars(existingCars = [], { readField }) {
            return existingCars.filter(
              (carRef) => deleteCar.id !== readField("id", carRef)
            );
          },
        },
      });
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p></p>;

  const person = data.person;

  const handleDeleteCar = (carId) => {
    deleteCar({ variables: { id: carId } });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  return (
    <div>
      <Button onClick={onGoBack}>Go Back Home</Button>
      <Card title={`${person.firstName} ${person.lastName}`}>
        <Button onClick={() => setIsAdding(true)}>Add Car</Button>
        <List
          itemLayout="horizontal"
          dataSource={person.cars}
          renderItem={(car) => (
            <List.Item
              actions={[
                <Button onClick={() => handleEditCar(car)}>Edit</Button>,
                <Button onClick={() => handleDeleteCar(car.id)} danger>
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`${car.year} ${car.make} ${car.model}`}
                description={`Price: $${car.price.toFixed(2)}`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        visible={isAdding}
        title="Add Car"
        onCancel={() => setIsAdding(false)}
        footer={null}
      >
        <CarForm personId={personId} onClose={() => setIsAdding(false)} />
      </Modal>

      {editingCar && (
        <Modal
          visible={!!editingCar}
          title="Edit Car"
          onCancel={() => setEditingCar(null)}
          footer={null}
        >
          <EditCarForm car={editingCar} onClose={() => setEditingCar(null)} />
        </Modal>
      )}
    </div>
  );
};

export default PersonDetails;
