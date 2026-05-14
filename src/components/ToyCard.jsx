import React from "react";

const ToyCard = ({ toy, onDeleteToy, onUpdateToy }) => {
  const { id, name, image, likes } = toy;

  function handleDeleteClick() {
    fetch(`/api/toys/${id}`, {
      method: "DELETE",
    }).then(() => {
      onDeleteToy(id);
    });
  }

  function handleLikeClick() {
    const updateObj = {
      likes: toy.likes + 1,
    };

    fetch(`/api/toys/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateObj),
    })
      .then((r) => r.json())
      .then((updatedToy) => {
        onUpdateToy(updatedToy);
      });
  }

  return (
    <div className="card" id={`toy-${id}`} data-testid="toy-card">
      <h2>{name}</h2>
      <img src={image} alt={name} className="toy-avatar" />
      <p>{likes} Likes </p>
      <button className="like-btn" onClick={handleLikeClick}>
        Like {"<3"}
      </button>
      <button className="del-btn" onClick={handleDeleteClick}>
        Donate to GoodWill
      </button>
    </div>
  );
}

export default ToyCard;
