import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";


export default function Files() {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "files",
  });

  return <div className="flex flex-col gap-2 p-2">  
    <h2 className="text-2xl">Files:</h2>
    <ul className="flex flex-col gap-2">
    {fields.map((field, index) => (
      <li key={field.id} className="join">
        <label className="flex gap-2 items-center grow">
          {index + 1}: 
          <input
            key={field.id}
            type="file"
            className="file-input file-input-sm grow"
            {...register(`files.${index}`, { required: true })}
          />
        </label>
        <button className="btn btn-square btn-error btn-sm join-item"  onClick={remove.bind(null, index)} type="button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </li>
    ))}
    </ul>
    <button className="btn btn-sm btn-success" onClick={append} type="button">Add file</button>
  </div>
}