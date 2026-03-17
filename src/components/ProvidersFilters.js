"use client";
import { useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import Select from "react-select";

export default function ProvidersFilters({ query, setQuery }) {
  const { name, state, virtualOnly } = query;

  const handleNameUpdate = event => {
    const value = event.target.value;
    setQuery(prev => ({ ...prev, name: value || null }));
  };

  const debouncedHandleNameUpdate = useRef(
    debounce(handleNameUpdate, 400)
  ).current;

  useEffect(() => {
    return () => debouncedHandleNameUpdate.cancel();
  }, [debouncedHandleNameUpdate]);

  const handleStateUpdate = (option) => {
    setQuery(prev => ({ ...prev, state: option?.value || null }));
  };

  const handleModeUpdate = (option) => {
    setQuery(prev => ({ ...prev, virtualOnly: option?.value || null }));
  };

  const selectStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? 'yellow' : 'black',
      borderRadius: 100,
      minWidth: 160,
      height: 33,
      margin: 10
    }),
  };

  return (
    <div className='flex flex-box flex-col md:flex-row gap-4 justify-center my-[4px] text-black'>
      <input
        aria-label="Search by provider name"
        type='text'
        className='
          bg-white
          border
          text-black
          py-1 px-4
          rounded-full
          m-[10px]
          sm:w-auto
          md:w-[207px]
        '
        placeholder='Search by Name...'
        onChange={debouncedHandleNameUpdate}
        defaultValue={name}
      />
      <Select
        aria-label="Filter by State"
        styles={selectStyles}
        name="state"
        placeholder="State"
        options={usStatesOptions}
        isClearable
        onChange={handleStateUpdate}
        value={state ? usStatesOptions.find(o => o.value === state) : null}
        instanceId={"provider-state-filter"}
      />
      <Select
        aria-label="Filter by Mode (Virtual Only)"
        styles={selectStyles}
        name="virtualOnly"
        placeholder="Virtual Only?"
        options={virtualOnlyOptions}
        isClearable
        onChange={handleModeUpdate}
        value={virtualOnly ? virtualOnlyOptions.find(o => o.value === virtualOnly) : null}
        instanceId={"provider-mode-filter"}
      />
    </div>
  )
}

const usStatesOptions = [
  { label: "AL", value: "Alabama" },
  { label: "AK", value: "Alaska" },
  { label: "AZ", value: "Arizona" },
  { label: "AR", value: "Arkansas" },
  { label: "CA", value: "California" },
  { label: "CO", value: "Colorado" },
  { label: "CT", value: "Connecticut" },
  { label: "DE", value: "Delaware" },
  { label: "FL", value: "Florida" },
  { label: "GA", value: "Georgia" },
  { label: "HI", value: "Hawaii" },
  { label: "ID", value: "Idaho" },
  { label: "IL", value: "Illinois" },
  { label: "IN", value: "Indiana" },
  { label: "IA", value: "Iowa" },
  { label: "KS", value: "Kansas" },
  { label: "KY", value: "Kentucky" },
  { label: "LA", value: "Louisiana" },
  { label: "ME", value: "Maine" },
  { label: "MD", value: "Maryland" },
  { label: "MA", value: "Massachusetts" },
  { label: "MI", value: "Michigan" },
  { label: "MN", value: "Minnesota" },
  { label: "MS", value: "Mississippi" },
  { label: "MO", value: "Missouri" },
  { label: "MT", value: "Montana" },
  { label: "NE", value: "Nebraska" },
  { label: "NV", value: "Nevada" },
  { label: "NH", value: "New Hampshire" },
  { label: "NJ", value: "New Jersey" },
  { label: "NM", value: "New Mexico" },
  { label: "NY", value: "New York" },
  { label: "NC", value: "North Carolina" },
  { label: "ND", value: "North Dakota" },
  { label: "OH", value: "Ohio" },
  { label: "OK", value: "Oklahoma" },
  { label: "OR", value: "Oregon" },
  { label: "PA", value: "Pennsylvania" },
  { label: "RI", value: "Rhode Island" },
  { label: "SC", value: "South Carolina" },
  { label: "SD", value: "South Dakota" },
  { label: "TN", value: "Tennessee" },
  { label: "TX", value: "Texas" },
  { label: "UT", value: "Utah" },
  { label: "VT", value: "Vermont" },
  { label: "VA", value: "Virginia" },
  { label: "WA", value: "Washington" },
  { label: "WV", value: "West Virginia" },
  { label: "WI", value: "Wisconsin" },
  { label: "WY", value: "Wyoming" }
];

const virtualOnlyOptions = [
  {label: "Yes", value: "Yes"},
  {label: "No", value: "No"}
];