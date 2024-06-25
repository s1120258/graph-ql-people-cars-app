import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "antd";
import { DELETE_PERSON, GET_PEOPLE } from "../../queries";

const DeletePersonButton = ({ personId }) => {
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache) {
      cache.modify({
        fields: {
          people(existingPeopleRefs = [], { readField }) {
            return existingPeopleRefs.filter(
              (personRef) => readField("id", personRef) !== personId
            );
          },
        },
      });
    },
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const handleDelete = () => {
    deletePerson({ variables: { id: personId } });
  };

  return (
    <Button onClick={handleDelete} type="danger">
      Delete Person
    </Button>
  );
};

export default DeletePersonButton;
