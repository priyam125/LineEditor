import "./App.css";
import LineEditor2 from "./components/LineEditor2";
import LineEditor from "./components/LineEditor";

function App() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="h-[90vh] w-[90vw]">
        <LineEditor />
      </div>
    </div>
  );
}

export default App;
