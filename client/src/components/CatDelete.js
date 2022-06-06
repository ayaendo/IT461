import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CatDelete = ({deleteHandler}) => {
    const location = useLocation();
    const cat=location.state.cat;
    const navigate = useNavigate();
    const [choice, setChoice] = useState('false');
    const formHandler = (e) => {
        e.preventDefault();
        if (choice)
            deleteHandler(cat);
        navigate('/cats');
    }
    return(
        <form onSubmit={formHandler}>
            <div>
                <label>ID: {cat.id}</label>
            </div>
            <label>Are you sure you want to delete?</label>
            <div>
                <button onClick={()=>{setChoice(true)}}>Yes</button>
                <button>No</button>
            </div>
        </form>
    );
}

export default CatDelete;