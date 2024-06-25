import React from "react";
import { useMutation, gql } from "@apollo/client";
import { Form, Input, InputNumber, Button } from "antd";
import { ADD_CAR, GET_PERSON_WITH_CARS } from "../../queries";

const CarForm = ({ personId, onClose }) => {
  const [addCar] = useMutation(ADD_CAR, {
    update(cache, { data: { addCar } }) {
      cache.modify({
        fields: {
          person(existingPersonRefs = {}) {
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
            return {
              ...existingPersonRefs,
              cars: existingPersonRefs.cars
                ? [...existingPersonRefs.cars, newCarRef]
                : [newCarRef],
            };
          },
        },
      });
    },
    refetchQueries: [
      { query: GET_PERSON_WITH_CARS, variables: { id: personId } },
    ],
  });

  const onFinish = (values) => {
    addCar({
      variables: {
        year: parseInt(values.year, 10),
        make: values.make,
        model: values.model,
        price: parseFloat(values.price),
        personId,
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
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Car
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CarForm;
