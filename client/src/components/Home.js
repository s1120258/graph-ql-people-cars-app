import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Form, Input, Button, Card, Modal } from "antd";

import EditPersonForm from "./forms/EditPersonForm";
import DeletePersonButton from "./buttons/DeletePersonButton";

const GET_PEOPLE_AND_CARS = gql`
  query GetPeopleAndCars {
    people {
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

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE_AND_CARS);
  const [addPerson] = useMutation(ADD_PERSON);
  const [editingPersonId, setEditingPersonId] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: </p>;

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

      {data.people.map((person) => (
        <Card
          key={person.id}
          title={`${person.firstName} ${person.lastName}`}
          extra={<a href={`/people/${person.id}`}>LEARN MORE</a>}
        >
          <>
            <Button onClick={() => setEditingPersonId(person.id)}>
              Edit Person
            </Button>
            <DeletePersonButton personId={person.id} />
            <div>
              {person.cars.map((car) => (
                <Card
                  key={car.id}
                  type="inner"
                  title={`${car.make} ${car.model}`}
                  extra={`$${car.price}`}
                >
                  <p>Year: {car.year}</p>
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
    </div>
  );
};

export default Home;
