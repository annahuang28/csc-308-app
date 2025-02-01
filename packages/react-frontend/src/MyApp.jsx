import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);
    
    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;   
    }
    
    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) =>
                setCharacters(json["users_list"].map(user => ({
                ...user,
                id: user._id.toString(),
            }))))
            .catch ((error) => { console.log(error); });
    }, [] );

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }, 
            body: JSON.stringify(person),
        });
        return promise;
    }

    function updateList(person) {
        postUser(person)
        .then((res) => {
            if (res.status === 201) { // checking for 201 status
                return res.json();
            } 
            throw new Error('Failed to create user.');
        })
        .then((newUser) => {  // updates the state
            setCharacters([...characters, newUser]);
            setUserId(newUser.id);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    function removeOneCharacter(userId) {
        
        const promise = fetch(`http://localhost:8000/users/${userId}`, {
            method: "DELETE",
        });
        promise
            .then ((res) => {
                if (res.status === 204) {
                    const updated = characters.filter((character) => character.id !== userId);
                    setCharacters(updated);
                } else if (res.status === 404) {
                    console.log("User not found.");
                }   
            })
            .catch((error) => {
                console.log(error);
            });
    }
    return (
        <div className = "container">
            <Table 
                characterData={characters} 
                removeCharacter={(userId) => removeOneCharacter(userId)}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}
export default MyApp;