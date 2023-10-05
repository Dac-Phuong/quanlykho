import React, { useState } from "react";
import TextField from "@mui/material/TextField";

export default function Input({ label, onChange, value, ...props }) {
  return (
    <div className="form-group">
      <div className="form-line">
        <label>{label}</label>
        <TextField
          className="form-control"
          {...props}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
