import React from "react";
import { useMutation, gql } from "@apollo/client";
import { Form, Input, InputNumber, Button, Select } from "antd";
import { GET_PEOPLE_AND_CARS, UPDATE_CAR } from "../../graphql/queries";

const EditCarForm = ({ car, people, onClose }) => {
  const [updateCar] = useMutation(UPDATE_CAR, {
    update(cache, { data: { updateCar } }) {
      // Update the cache to reflect the updated car owner
      cache.modify({
        fields: {
          people(existingPeopleRefs = [], { readField }) {
            // Find the person who owns the updated car
            const newPerson = existingPeopleRefs.find(
              (personRef) => readField("id", personRef) === updateCar.personId
            );

            // Find the person who used to own the car
            const oldPerson = existingPeopleRefs.find(
              (personRef) => readField("id", personRef) === car.personId
            );

            // Remove the car from the old owner's cars
            if (oldPerson) {
              cache.modify({
                id: cache.identify(oldPerson),
                fields: {
                  cars(existingCarRefs = [], { readField }) {
                    return existingCarRefs.filter(
                      (carRef) => readField("id", carRef) !== car.id
                    );
                  },
                },
              });
            }

            // Add the car to the new owner's cars
            if (newPerson) {
              cache.modify({
                id: cache.identify(newPerson),
                fields: {
                  cars(existingCarRefs = []) {
                    const newCarRef = cache.writeFragment({
                      data: updateCar,
                      fragment: gql`
                        fragment NewCar on Car {
                          id
                          year
                          make
                          model
                          price
                          personId
                        }
                      `,
                    });
                    return [...existingCarRefs, newCarRef];
                  },
                },
              });
            }

            return existingPeopleRefs;
          },
        },
      });
    },
    refetchQueries: [{ query: GET_PEOPLE_AND_CARS }],
  });

  const onFinish = (values) => {
    updateCar({
      variables: {
        id: car.id,
        year: parseInt(values.year, 10),
        make: values.make,
        model: values.model,
        price: parseFloat(values.price),
        personId: values.personId,
      },
    });
    onClose();
  };

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ ...car, personId: car.personId }}
    >
      <Form.Item
        name="year"
        label="Year"
        rules={[
          { required: true, message: "Please input the year of the car!" },
        ]}
      >
        <InputNumber min={1886} max={new Date().getFullYear()} />
      </Form.Item>
      <Form.Item
        name="make"
        label="Make"
        rules={[
          { required: true, message: "Please input the make of the car!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="model"
        label="Model"
        rules={[
          { required: true, message: "Please input the model of the car!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[
          { required: true, message: "Please input the price of the car!" },
        ]}
      >
        <InputNumber min={0} step={0.01} />
      </Form.Item>
      <Form.Item
        name="personId"
        label="Person"
        rules={[
          { required: true, message: "Please select the owner of the car!" },
        ]}
      >
        <Select placeholder="Select a person">
          {people.map((person) => (
            <Select.Option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Update Car
      </Button>
    </Form>
  );
};

export default EditCarForm;
