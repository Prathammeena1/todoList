import React, { useRef, useState } from 'react'
import './index.css'
import { nanoid } from 'nanoid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';


const App = () => {

  const [input, setinput] = useState("");
  const [tasks, settasks] = useState(JSON.parse(localStorage.getItem('tasks')) ?? []);

  const submitHandeler = (e) => {
    e.preventDefault();
    const obj = {
      name: input,
      complete: false,
      id: nanoid()
    }
    settasks([...tasks, obj])
    setinput('')
    localStorage.setItem("tasks", JSON.stringify([...tasks, obj]))
    setstrokeDashoffset((tasks.filter(t=> t.complete).length/tasks.length)*252 - 252)
  }


  const completedClass = "ri-circle-fill text-green-500 mt-1"
  const incompletedClass = "ri-circle-fill text-red-500 mt-1"
  const completeName = 'text-white text-xl  w-full line-through'
  const incompleteName = 'text-white text-xl  w-full'



  const taskCompleted = (index) => {
    const newTasks = [...tasks]
    newTasks[index].complete = !newTasks[index].complete
    settasks(newTasks)
    localStorage.setItem('tasks',JSON.stringify(newTasks))
    setstrokeDashoffset((tasks.filter(t=> t.complete).length/tasks.length)*252 - 252)
  }
  
  
  const deleteHandler = (index)=>{
    const newTasks = [...tasks]
    newTasks.splice(index,1)
    settasks(newTasks)
    localStorage.setItem('tasks',JSON.stringify(newTasks))
    setstrokeDashoffset((tasks.filter(t=> t.complete).length/tasks.length)*252 - 252)
  }

  const circle = useRef()

  const [strokeDashoffset, setstrokeDashoffset] = useState((tasks.filter(t=> t.complete).length/tasks.length)*252 - 252)  
  
  useGSAP(()=>{
    console.log(strokeDashoffset)
    gsap.to(circle.current,{
        strokeDashoffset,
    })
  },[strokeDashoffset])


  return (
    <>
      <div className="main flex items-center bg-black justify-center h-screen w-full p-10">

        <div className="left w-1/2 h-full flex flex-col gap-10 items-center justify-center">
          <div className="head w-2/3 h-[35vh] bg-zinc-900 rounded-xl py-6 flex gap-4 items-center justify-center">
            <h1 className='text-3xl text-white font-medium'>Progress</h1>
            <div className="progress w-1/2 h-full flex items-center justify-center relative">
              <svg width="100%" height="100%" className='absolute' viewBox="-50 -50 100 100">
                <circle  r="40" cx='00' cy='0' fill="transparent" stroke="#e0e0e0" strokeWidth="12px"></circle>
                <circle className='rotate-[-90deg]' ref={circle} r="40" cx='0' cy='0' fill="transparent" stroke="orange" strokeWidth="12px" strokeDasharray="252"></circle>
              </svg>
              <h1 className='text-2xl font-medium text-white'>{tasks.filter(t=> t.complete).length}/{tasks.length}</h1>
            </div>
          </div>
          <form onSubmit={submitHandeler} className='w-2/3 flex items-center gap-2 rounded-full border p-2'>
            <input onChange={(e) => setinput(e.target.value)} value={input} type="text" placeholder='Task' className='px-2 text-xl outline-none text-white py-1 bg-transparent  w-full ' />
            <button type='submit' className='bg-zinc-900 rounded-full px-2 aspect-square text-2xl text-white font-black flex items-center justify-center'><i className="ri-add-line"></i></button>
          </form>
        </div>


        <div className="right w-[25vw] h-full flex flex-col items-center justify-center gap-4">
          <h1 className='text-white w-full text-3xl font-medium mb-4 text-center'>Tasks</h1>
          <div className="tasks w-full flex flex-col gap-2 overflow-y-auto h-[60vh]">
            {tasks.length == 0 ? [<h1 key={nanoid()} className='text-white font-medium text-3xl capitalize text-center'>no task yet</h1>] : tasks.map((task,index) => {
              return (<div key={task.id}  className="task flex items-center bg-zinc-900  rounded-full px-4 py-2 gap-2">
                <i onClick={() => taskCompleted(index)} className={task.complete ? completedClass : incompletedClass}></i><h1 className={task.complete ? completeName : incompleteName}>{task.name}</h1>
                <i onClick={()=> deleteHandler(index)} className='ri-close-line text-white'></i>
              </div>)
            })}
          </div>

        </div>

      </div>
    </>
  )
}

export default App