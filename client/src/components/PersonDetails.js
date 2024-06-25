import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { Card, Button, Modal, List } from "antd";
import { GET_PERSON_WITH_CARS, DELETE_CAR } from "../queries";
import CarForm from "./forms/CarForm";
import EditCarForm from "./forms/EditCarForm";

const PersonDetails = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deleteCar] = useMutation(DELETE_CAR, {
    update(cache, { data: { deleteCar } }) {
      cache.modify({
        fields: {
          person(existingPersonRefs, { readField }) {
            return {
              ...existingPersonRefs,
              cars: existingPersonRefs.cars.filter(
                (carRef) => deleteCar.id !== readField("id", carRef)
              ),
            };
          },
        },
      });
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const person = data.person;

  const handleDeleteCar = (carId) => {
    deleteCar({ variables: { id: carId } });
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  return (
    <div>
      <Card
        title={`${person.firstName} ${person.lastName}`}
        extra={<Link to="/">Go Back Home</Link>}
      >
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
        <CarForm personId={id} onClose={() => setIsAdding(false)} />
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
