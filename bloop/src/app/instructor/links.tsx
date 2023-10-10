'use client';

import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

const Links = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  return <div className="flex flex-col gap-2 p-2">  
    <h2 className="text-2xl">Links:</h2>
    <ul className="flex flex-col gap-2">
    {fields.map((field, index) => (
      <li key={field.id} className="join">
        <label className="flex gap-2 items-center grow">
          {index + 1}: 
          <input
            key={field.id}
            type="text"
            className="input input-bordered input-sm join-item grow"
            {...register(`links.${index}`, { required: true })}
          />
        </label>
        <button className="btn btn-square btn-error btn-sm join-item"  onClick={remove.bind(null, index)} type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </li>
    ))}
    </ul>
    <button className="btn btn-sm btn-success" onClick={append} type="button">Add link</button>
  </div>
}

export default Links;