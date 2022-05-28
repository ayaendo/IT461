import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DogDelete = ({deleteHandler}) => {
    const location = useLocation();
    const dog=location.state.dog;
    const navigate = useNavigate();
    const [choice, setChoice] = useState('false');
    const formHandler = (e) => {
        e.preventDefault();
        if (choice)
            deleteHandler(dog);
        navigate('/dogs');
    }
    return(
        <form onSubmit={formHandler}>
            <div>
                <label>ID: {dog.id}</label>
            </div>
            <label>Are you sure you want to delete?</label>
            <div>
                <button onClick={()=>{setChoice(true)}}>Yes</button>
                <button>No</button>
            </div>
        </form>
    );
}

export default DogDelete;