import "./App.css";
import LineEditor from "./components/LineEditor";
import LineEditor1 from "./components/LineEditor1";
import LineEditor2 from "./components/LineEditor2";

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-[90vh] w-[90vw]">
        <LineEditor1 />
      </div>
    </div>
  );
}

export default App;
