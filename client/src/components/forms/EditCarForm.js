import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Form, Input, InputNumber, Button, Select } from "antd";
import { GET_PEOPLE, UPDATE_CAR, GET_PERSON_WITH_CARS } from "../../queries";

const { Option } = Select;

const EditCarForm = ({ car, onClose }) => {
  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [
      { query: GET_PERSON_WITH_CARS, variables: { id: car.personId } },
    ],
  });

  const { loading, error, data } = useQuery(GET_PEOPLE);

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
    })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error updating car:", error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        year: car.year,
        make: car.make,
        model: car.model,
        price: car.price,
        personId: car.personId,
      }}
    >
      <Form.Item name="year" label="Year" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item name="make" label="Make" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="model" label="Model" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="price" label="Price" rules={[{ required: true }]}>
        <InputNumber />
      </Form.Item>
      <Form.Item name="personId" label="Owner" rules={[{ required: true }]}>
        <Select>
          {data.people.map((person) => (
            <Option key={person.id} value={person.id}>
              {person.firstName} {person.lastName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCarForm;
