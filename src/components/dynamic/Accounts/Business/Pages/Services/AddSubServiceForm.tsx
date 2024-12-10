import React, { useState } from "react";

interface Props {
  toggleModal: () => void;
}

const AddSubServiceModal: React.FC<Props> = ({ toggleModal }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(0);
  const [priceType, setPriceType] = useState("");

  const handleSubmit = () => {
    console.log({
      name,
      price,
      duration,
      priceType,
    });
    toggleModal();
  };

  return (
    <div className="modal">
      <h2>Add Sub Service</h2>
      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <label>Price</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <label>Duration</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(Number(e.target.value))}
      />
      <label>Price Type</label>
      <input
        value={priceType}
        onChange={(e) => setPriceType(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={toggleModal}>Cancel</button>
    </div>
  );
};

export default AddSubServiceModal;
