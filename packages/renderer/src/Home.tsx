import "./App.css";
import { trpc } from "./utils/trpc";
import reactLogo from "./assets/react.svg";

function Home() {
  const examples = trpc.useQuery(["example.getAll"]);
  const utils = trpc.useContext();
  const addExample = trpc.useMutation(["example.add"], {
    onSuccess() {
      utils.invalidateQueries(["example.getAll"]);
    },
  });
  const removeExample = trpc.useMutation(["example.remove"], {
    onSuccess() {
      utils.invalidateQueries(["example.getAll"]);
    },
  });

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <button onClick={() => addExample.mutate()}>ADD example</button>
      <ul>
        {examples.data?.map((example, idx) => {
          return (
            <li
              key={idx}
              className="example"
              onClick={() => {
                removeExample.mutate({ id: example.id });
              }}
            >
              <span>{example.id}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
