

import React , {useEffect, useState} from 'react'
import   './todo.module.css'
import { backend } from '../api';
import { getTokenFromCookie } from '../lib/utils';
import { removeTokenFromCookie } from '../lib/utils';
import { Button, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';



const TodoList = () => {
    const [tasks , settasks]=useState([]);
    const [newtask , setnewtask]=useState("");
    const [editedTask, setEditedTask] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedTaskId, setEditedTaskId] = useState(undefined);
    const token = getTokenFromCookie();  // or getTokenFromLocalStorage(), getTokenFromSessionStorage()
    const [page , setPage]=useState(1);
    const [limit, setLimit]=useState(10);
    const [totalTodos, setTotalTodos]=useState();
    const [totalPages, setTotalPages]=useState(6);
    const [taskCompleted, setTaskCompleted] = useState({});
    const navigate = useNavigate();

    const fetchTasks = async () => {
        try{
            const response = await backend.get(`${import.meta.env.VITE_BACKEND_URL}/todos?page=${page}&limit=${limit}`,{
                headers: {
                    'Authorization': `Bearer ${token}`,  // Ensure this format
                    'Content-Type': 'application/json',
                  },
            });
            console.log(response.data);
            settasks(response.data.todos);
            setTotalPages(response.data.pagination.totalPages);
            setTotalTodos(response.data.pagination.totalTodos);
            setPage(response.data.pagination.page);
                 // Initialize completed state for each task
            const initialCompletedState = {};
             response.data.todos.forEach((task) => {
            initialCompletedState[task.id] = task.completed === 1; // Mark as true if completed
        });
      setTaskCompleted(initialCompletedState);
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

    const handleCheckboxChange = async (taskToBeUpdated, completed) => {
        // Find the task by ID
        const taskIndex = tasks.findIndex((task) => task.id === taskToBeUpdated.id);
        const newTasks = [...tasks]
        newTasks[taskIndex].completed = completed;

        //Update your task

        
        // Toggle the completed state
        //const newStatus = !task.completed ? 1 : 0;  // If not completed, mark as completed, else unmark
        
        // Update the local state to reflect the change
        //setTaskCompleted((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
    
        try {
            // Send the updated status to the backend
            const response = await backend.put(`${import.meta.env.VITE_BACKEND_URL}/todos/${taskToBeUpdated.id}`, {
                task: taskToBeUpdated.task,  // Keep the task text unchanged
                completed: taskToBeUpdated.completed,  // Update the completed field
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert(response.data.message);
    
            console.log('Todo updated successfully', response.data);
            // Optionally, update the task in the local state again if needed
            settasks(newTasks);
        } catch (err) {
            console.error('Error updating todo:', err);
        }
    };
    

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

    const logout = () => {
        // Remove the JWT token from the cookies
        removeTokenFromCookie();
        alert("User logged out successfully");
        // Redirect user to the welcome page
        navigate('/');
      };
    function editTask(taskId, taskText) {
        
        setEditedTask(taskText);
        setIsEditMode(true);
        setEditedTaskId(taskId);
      }

      useEffect(
        () =>{
            fetchTasks();
        },
        []
    )
    useEffect(
        () =>{
            fetchTasks();
        },
        [
            totalPages,
            page
        ]
    )
    

    function handleInputChange(event){
        setnewtask(event.target.value)

    }
    const editTaskHandler = async () =>{

        const newTasks = [...tasks]
        const taskToBeEdited = newTasks.find(task => task.id === editedTaskId);
        taskToBeEdited.task = editedTask;

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

            //Alert the user that the edit was successful or failed
            setIsEditMode(false);
            settasks(newTasks);
            
            
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
    async function addTask(){
        
        if(newtask.trim()!==""){
        //API call to save task
    
        //alert(token)

        try {
        const response = await backend.post(`${import.meta.env.VITE_BACKEND_URL}/todos`,{task: newtask}, {
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
        
    }

    return (
        <div className='max-w-[900px] mx-auto'>
            <h1 className='text-5xl'>Todo List</h1>
            <Modal open={isEditMode} onOk={editTaskHandler}>
                <Input onChange={(e)=>setEditedTask(e.target.value)} value={editedTask}/>
            </Modal>

            <div className='flex items-center'>
                    <Input
                    className='!w-full text-sm'
                    type="text"
                    placeholder='Add a new task...'
                    value={newtask}
                    onChange={handleInputChange}
                     />
                     <button
                     className='text-sm'
                      onClick={addTask} 
                     >Add</button>
            </div>
            {(tasks.length>0)? (<><ol className='orderedlist'>
                {tasks.map((task) => 
                    <li  key={task.id}>
                        <input className='' type="checkbox" checked={task.completed} onChange={(e) => handleCheckboxChange(task,e.target.checked)}  />
                       {(!task.completed)?(<p className='flex-1 text-left pl-3'>
                       {task.task}
                       </p>):(
                        <p className='flex-1 text-left pl-3 line-through'>
                        {task.task}
                        </p>
                       )
                       }
                      <div className='flex gap-4 justify-center'><Button
                        type='primary'
                       onClick={() => editTask(task.id, task.task)}
                      >Edit</Button>
                       <Button
                       //icon ={<DeleteOutlined />}
                       variant='outlined'
                       className='border-red-600 text-red-600'
                       onClick={() => deleteTask(task.id)}
                      >Delete</Button>
                      </div>
                    </li>
                )}
                
            </ol>
            <div className='mt-4 flex items-center justify-end gap-4 '>
                <p>Page {page} of {totalPages}</p>
              <Button onClick={()=>setPage(Math.max(page-1,1))}>
                Previous
                </Button>  
              <Button onClick={()=>setPage(Math.min(page+1,totalPages))} >
                Next 
                </Button>  
            </div>
         </> 
    ):
            <p>You currently have no task. Add a task and begin your plans!😁</p>
            }
                <div>
                    <Button className='mt-28 border-red-500 text-lg font-semibold text-white bg-red-600 py-5 px-3 hover:bg-red-400' onClick={logout}>Logout</Button>
                </div>
        </div>
       
            )

}

export default TodoList;