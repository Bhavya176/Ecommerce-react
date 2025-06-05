import React, { useEffect } from "react";

const ProfileSub2 = ({ setButtonHandler }) => {
  useEffect(() => {
    // Define the logic for button click in child
    const handleClick = () => {
      alert("Button clicked, logic from Child Component2!");
    };

    // Set the button click handler in the parent through the prop
    setButtonHandler(() => handleClick);
  }, [setButtonHandler]);
  return (
    <div>
      <h2>Child Component</h2>
    </div>
  );
};

export default ProfileSub2;
