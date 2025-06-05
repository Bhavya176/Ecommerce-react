import React, { forwardRef ,useImperativeHandle } from "react";

const ProfileSub = forwardRef((ChildProps, ref) => {
  useImperativeHandle(ref, () => ({
    handleButtonClick
  }));

  const handleButtonClick = () => {
    alert('Button clicked, logic from Child Component!');
  };

  return <div>Child Component</div>;
});
export default ProfileSub;
