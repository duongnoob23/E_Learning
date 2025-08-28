import { useEffect, useState } from "react";

const Test = () => {
  const [couter, setCouter] = useState(0);

  const handleIncrease = () => {
    setCouter((pre) => pre + 1);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("url");
      const result = await response.json();
      setCouter(result);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      console.log("Unmounted");
    };
  }, [couter]);

  return (
    <>
      <div className="interview">Hello</div>

      <div className="count">{couter}</div>
      <button onClick={() => handleIncrease()} className="increase">
        Tăng
      </button>
    </>
  );
};

export default Test;
