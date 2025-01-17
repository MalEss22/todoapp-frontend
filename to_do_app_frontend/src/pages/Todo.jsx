

import React , {useEffect, useState} from 'react'
import   './todo.module.css'
import { backend } from '../api';
import { getTokenFromCookie } from '../lib/utils';



const TodoList = () => {
    const [tasks , settasks]=useState([]);
    const [newtask , setnewtask]=useState("");
    //const [editedTask, setEditedTask] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTaskId, setEditedTaskId] = useState(undefined);
    const token = getTokenFromCookie();  // or getTokenFromLocalStorage(), getTokenFromSessionStorage()
    const fetchTasks = async () => {
        try{
            const response = await backend.get(`${import.meta.env.VITE_BACKEND_URL}/todos`,{
                headers: {
                    'Authorization': `Bearer ${token}`,  // Ensure this format
                    'Content-Type': 'application/json',
                  },
            });
            console.log(response.data.todos);
            settasks(response.data);
        }
        catch (error) {
            // Handle error
            if (error.response && error.response.status === 401) {
              console.error('Unauthorized. Please login again.');
            } else {
              console.error('An error occurred:', error.message);
            }
          }
        
    }
    async function deleteTask(taskId){
    try{
        const response  = await backend.delete(`${import.meta.env.VITE_BACKEND_URL}/todos/${taskId}`,
            {
                headers:{
                    'Authorization': `Bearer ${token}`,  // Ensure this format
                    'Content-Type': 'application/json',
              }
            }
        )
        settasks(tasks.filter(task=>task.id !==taskId));
        //alert(response.status)
        
     } 
     catch (error){
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized. Please login again.');
          } else {
            console.error('An error occurred:', error.message);
          }
     }
    }
    function editTask(taskId, taskText) {
        setIsEditMode(true);
        setnewtask(taskText);
        setEditedTaskId(taskId);
      }

    useEffect(
        () =>{
            fetchTasks();
        },
        []
    )

    function handleInputChange(event){
        setnewtask(event.target.value)

    }
    
    async function addTask(){
            
        if(!isEditMode){
            if(newtask.trim()!==""){
            //API call to save task
        
            alert(token)
    
            try {
            const response = await backend.post(`${import.meta.env.VITE_BACKEND_URL}/todos`,{task: newtask }, {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Ensure this format
                    'Content-Type': 'application/json',
                },
            });
        
            // Handle successful response
            console.log('Protected Data:', response.data.task);

            // Update the task state array
            settasks((prevTasks)=>([...prevTasks,{
                id: response.data.todoId,
                task: response.data.task

            }]))


            //Add the task and the task_id to the array
            
            } catch (error) {
            // Handle error
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized. Please login again.');
            } else {
                console.error('An error occurred:', error.message);
            }
            }
            // settasks(t =>[...t,newtask]);
            // setnewtask("");
            }
        }else{
            const newTasks = [...tasks]
            const taskToBeEdited = newTasks.find(task => task.id === editedTaskId);
            taskToBeEdited.task = newtask;

            //API
            try {
                console.log(taskToBeEdited);
                const taskId = taskToBeEdited.id;
                const response  = await backend.put(`${import.meta.env.VITE_BACKEND_URL}/todos/${taskId}`, {
                    task: taskToBeEdited.task,
                    completed: taskToBeEdited.completed
                },
                    {
                        headers:{
                            'Authorization': `Bearer ${token}`,  // Ensure this format
                            'Content-Type': 'application/json',
                      }
                    }
                )
               
                
             } 
            
            catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized. Please login again.');
                  } else {
                    console.error('An error occurred:', error.message);
                  }
            }
        

            //save edited task using put method
            // modify the ui
            
            settasks(newTasks);
            

        }
    }

    return (
        <div className='container'>
            <h1>Todo List</h1>

            <div className='input'>
                    <input 
                    type="text"
                    placeholder='Add a new task...'
                    value={newtask}
                    onChange={handleInputChange}
                     />
                     <button 
                      onClick={addTask} 
                     >Add</button>
            </div>
            {(tasks.length>0)? (<ol className='orderedlist'>
                {tasks.map((task) => 
                    <li  key={task.id}>
                        <input onChange={()=>updateTask(task)} type="checkbox" />
                       <p className=''>
                       {task.task}
                       </p> 
                      <p
                       className='edit'
                       onClick={() => editTask(task.id, task.task)}
                      >Edit</p>
                       <p
                       className='delete'
                       onClick={() => deleteTask(task.id)}
                      >Delete</p>
                    </li>
                )}
                
            </ol>):
            
            <p>You currently have no task. Add a task😁</p>}

        </div>

    )

}

export default TodoList;