import React from "react";
import { useQuery } from "@apollo/client";
import { Card, Button, List } from "antd";
import { GET_PERSON_WITH_CARS } from "../../graphql/queries";

const PersonDetails = ({ personId, onGoBack }) => {
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id: personId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p></p>;

  const person = data.person;

  return (
    <div>
      <Button onClick={onGoBack}>Go Back Home</Button>
      <Card title={`${person.firstName} ${person.lastName}`}>
        <List
          itemLayout="horizontal"
          dataSource={person.cars}
          renderItem={(car) => (
            <List.Item>
              <List.Item.Meta
                title={`${car.year} ${car.make} ${car.model}`}
                description={`Price: $${car.price.toFixed(2)}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default PersonDetails;
