import React from "react";
import { useMutation } from "@apollo/client";
import { Form, Input, Button } from "antd";
import { GET_PEOPLE, UPDATE_PERSON } from "../../queries";

const EditPersonForm = ({ person, onClose }) => {
  const [updatePerson] = useMutation(UPDATE_PERSON, {
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const onFinish = (values) => {
    updatePerson({
      variables: {
        id: person.id,
        firstName: values.firstName,
        lastName: values.lastName,
      },
    })
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error("Error updating person:", error);
      });
  };

  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        firstName: person.firstName,
        lastName: person.lastName,
      }}
    >
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
        <Button onClick={onClose} style={{ marginLeft: "8px" }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditPersonForm;
