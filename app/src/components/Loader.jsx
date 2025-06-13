import { ReactComponent as Ring } from "@assets/oval.svg";

const Loader = () => {
  return (
    <div className="loading">
      <div className="flex flex-row bg-white min-h-screen justify-center w-screen absolute gap-2 items-center z-50">
        <div className="bg-blue-700 h-4 rounded-full w-4 [animation-delay:.7s] animate-bounce"></div>
        <div className="bg-blue-700 h-4 rounded-full w-4 [animation-delay:.3s] animate-bounce"></div>
        <div className="bg-blue-700 h-4 rounded-full w-4 [animation-delay:.7s] animate-bounce"></div>
      </div>
    </div>
  );
};

export default Loader;
