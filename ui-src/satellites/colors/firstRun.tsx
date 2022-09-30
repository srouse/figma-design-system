import React from "react";
import DTButton from "../../components/DTButton";

export default function firstRun() {
  return (
    <div>
      <DTButton
        label="Create New Set"
        onClick={() => console.log('hi')}>
      </DTButton>
      <DTButton
        label="Pull From Styles"
        onClick={() => console.log('hi')}>
      </DTButton>
    </div>
  );
}