import React, { useRef, useState } from "react";
import "./index.css";
import { nanoid } from "nanoid";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

const App = () => {
  const [input, setinput] = useState("");
  const [tasks, settasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) ?? []
  );

  const submitHandeler = (e) => {
    e.preventDefault();
    const obj = {
      name: input,
      complete: false,
      id: nanoid(),
    };
    settasks([...tasks, obj]);
    setinput("");
    localStorage.setItem("tasks", JSON.stringify([...tasks, obj]));
    setstrokeDashoffset(
      ([...tasks, obj].filter((t) => t.complete).length /
        [...tasks, obj].length) *
        252 -
        252
    );
  };

  const completedClass = "ri-circle-fill text-green-500 mt-1";
  const incompletedClass = "ri-circle-fill text-red-500 mt-1";
  const completeName = "text-white text-xl  w-full line-through";
  const incompleteName = "text-white text-xl  w-full";

  const taskCompleted = (index) => {
    const newTasks = [...tasks];
    newTasks[index].complete = !newTasks[index].complete;
    settasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setstrokeDashoffset(
      (newTasks.filter((t) => t.complete).length / newTasks.length) * 252 - 252
    );
  };

  const deleteHandler = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    settasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setstrokeDashoffset(
      (newTasks.filter((t) => t.complete).length / newTasks.length) * 252 - 252
    );
  };

  const circle = useRef();

  const [strokeDashoffset, setstrokeDashoffset] = useState(
    (tasks.filter((t) => t.complete).length / tasks.length) * 252 - 252
  );

  useGSAP(() => {
    console.log(strokeDashoffset);
    gsap.to(circle.current, {
      strokeDashoffset,
    });
  }, [strokeDashoffset]);

  const parent = useRef(null);

  return (
    <>
      <div className="main items-center bg-zinc-800 justify-center h-screen w-full p-2 overflow-hidden">
        <nav className="fixed z-[99] top-4 w-full px-10  bg-transparent">
          <form
            onSubmit={submitHandeler}
            className="md:w-[50vw] w-full flex items-center gap-2 rounded-full border p-2 overflow-hidden"
          >
            <input
              required
              onChange={(e) => setinput(e.target.value)}
              value={input}
              type="text"
              placeholder="Task"
              className=" px-2 text-xl outline-none text-white py-1 bg-transparent  w-full "
            />
            <button
              type="submit"
              className=" bg-zinc-900 rounded-full px-2 aspect-square text-2xl text-white font-black flex items-center justify-center"
            >
              <i className="ri-add-line"></i>
            </button>
          </form>
        </nav>

        <div className="left-0 relative w-1/2 h-full flex flex-col gap-10 items-center justify-center overflow-hidden">
          <div className="head md:w-2/3 w-full h-[35vh] bg-zinc-950 p-4 rounded-xl md:py-6 flex flex-col md:flex-row gap-4 items-center justify-center">
            <h1 className="md:text-3xl text-xl text-white font-medium">Progress</h1>
            <div className="progress w-1/2 h-full flex items-center justify-center relative">
              <svg
                width="100%"
                height="100%"
                className="absolute"
                viewBox="-50 -50 100 100"
              >
                <circle
                  r="40"
                  cx="00"
                  cy="0"
                  fill="transparent"
                  stroke="#e0e0e0"
                  strokeWidth="12px"
                ></circle>
                <circle
                  className="rotate-[-90deg]"
                  ref={circle}
                  r="40"
                  cx="0"
                  cy="0"
                  fill="transparent"
                  stroke="orange"
                  strokeWidth="12px"
                  strokeDasharray="252"
                ></circle>
              </svg>
              <h1 className="md:text-2xl text-xs font-medium text-white">
                {tasks.filter((t) => t.complete).length}/{tasks.length}
              </h1>
            </div>
          </div>
        </div>

        <div
          ref={parent}
          className="right absolute top-0 pt-20 w-full h-screen flex flex-col items-center justify-center gap-4 overflow-hidden "
        >
          <div className="tasks w-full mt-10 pl-10 md:m-5 flex gap-2 overflow-hidden h-screen flex-wrap">
            {tasks.length === 0
              ? [
                  <h1
                    key={nanoid()}
                    className="text-white font-medium text-3xl capitalize text-center"
                  >
                    no task yet
                  </h1>,
                ]
              : tasks.map((task, index) => {
                  return (
                    <motion.div
                      key={task.id}
                      drag // Enable drag functionality
                      dragConstraints={parent}
                      className="task flex items-center bg-zinc-900 rounded-xl md:min-w-[15vw] md:h-[5vw] h-fit px-4 py-2 gap-6 flex-shrink-0"
                      style={{ cursor: "pointer" }} // Set cursor to indicate draggable element
                    >
                      <i
                        onClick={() => taskCompleted(index)}
                        className={
                          task.complete ? completedClass : incompletedClass
                        }
                      ></i>
                      <h1
                        className={
                          task.complete ? completeName : incompleteName
                        }
                      >
                        {task.name}
                      </h1>
                      <i
                        onClick={() => deleteHandler(index)}
                        className="ri-close-line text-white"
                      ></i>
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
