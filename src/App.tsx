import {
  Checkbox,
  Autocomplete,
  TextField,
  Avatar,
  debounce,
} from "@mui/material";
import { CheckBoxOutlineBlank, CheckBox, Close } from "@mui/icons-material";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useEffect, useState } from "react";

interface Character {
  id: number;
  name: string;
  type: string;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

function App() {
  const [data, setData] = useState<Array<Character>>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const debouncedSearch = debounce(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchTerm}`)
      .then((res) => res.json())
      .then((res) =>
        res.error ? setErrorMessage(res.error) : setData(res.results)
      )
      .catch((err) => setErrorMessage(err))
      .finally(() => setIsLoading(false));
  }, 1000);

  useEffect(() => {
    if (searchTerm.length < 1) return;

    setIsLoading(true);

    debouncedSearch();
  }, [searchTerm]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Autocomplete
        multiple
        id="highlights"
        sx={{ width: 500 }}
        options={data}
        loading={isLoading}
        ListboxProps={{
          className: "bg-slate-50",
        }}
        noOptionsText={errorMessage}
        onInputChange={(event, newInputValue) => {
          setSearchTerm(newInputValue);
        }}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            variant="outlined"
            margin="normal"
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <div
              {...getTagProps({ index })}
              className="flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-md mr-2">
              <span>{option.name}</span>
              <span
                onClick={getTagProps({ index }).onDelete}
                className="flex items-center bg-slate-400 text-white rounded-md cursor-pointer">
                <Close fontSize="medium" />
              </span>
            </div>
          ))
        }
        renderOption={(props, option, { inputValue, selected }) => {
          const matches = match(option.name, inputValue, {
            insideWords: true,
          });
          const parts = parse(option.name, matches);

          return (
            <li
              {...props}
              className="flex items-center gap-2 py-3 text-sm border-b-2 border-slate-300">
              <Checkbox
                icon={<CheckBoxOutlineBlank fontSize="small" />}
                checkedIcon={<CheckBox fontSize="small" />}
                checked={selected}
              />
              <Avatar variant="rounded" alt={option.name} src={option.image} />
              <div className="text-gray">
                {parts.map((part: any, index: any) => (
                  <span
                    key={index}
                    className={`${part.highlight ? "font-bold" : "font-base"}`}>
                    {part.text}
                  </span>
                ))}
                <p>{option.episode.length} Episodes</p>
              </div>
            </li>
          );
        }}
      />
    </div>
  );
}

export default App;
