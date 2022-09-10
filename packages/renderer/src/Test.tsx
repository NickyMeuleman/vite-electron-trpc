import "./App.css";
import { trpc } from "./utils/trpc";
function Test() {
  const set = new Set<number>();
  set.add(1);
  set.add(2);
  set.add(3);
  set.add(4);
  set.add(5);
  const date = trpc.useQuery(["date", { string: "2022-09-10", test: set }]);
  if (!date.data) return <div>Loading...</div>;

  return (
    <div className="App">
      <p>TEST</p>
      <p>{date.data.date.getFullYear()}</p>
    </div>
  );
}

export default Test;
