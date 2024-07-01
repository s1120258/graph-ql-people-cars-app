import React from "react";
import { useMutation, gql } from "@apollo/client";
import { Form, Input, InputNumber, Button, Select } from "antd";
import { GET_PEOPLE_AND_CARS, ADD_CAR } from "../../graphql/queries";

const CarForm = ({ people, onClose }) => {
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      cache.modify({
        fields: {
          people(existingPeopleRefs = [], { readField }) {
            const newCarRef = cache.writeFragment({
              data: addCar,
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

            return existingPeopleRefs.map((personRef) => {
              if (readField("id", personRef) === addCar.personId) {
                return {
                  ...personRef,
                  cars: [...readField("cars", personRef), newCarRef],
                };
              } else {
                return personRef;
              }
            });
          },
        },
      });
    },
    refetchQueries: [{ query: GET_PEOPLE_AND_CARS }],
  });

  const onFinish = (values) => {
    addCar({
      variables: {
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
    <Form onFinish={onFinish} layout="vertical">
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
        Add Car
      </Button>
    </Form>
  );
};

export default CarForm;
