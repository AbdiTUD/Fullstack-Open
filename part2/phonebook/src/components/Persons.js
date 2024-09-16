import React from 'react';
const Person = ({ person }) => {
    return (
      <div key={person.name}>
        {person.name} {person.number}
      </div>
    );
  };

  const Persons = ({ persons, deletePerson }) => {
    return (
      <div>
        {persons.map(person =>
          <div key={person.id}>
            {person.name} {person.number}
            <button   
   onClick={() => deletePerson(person.id)}>poista</button>   
  
          </div>
        )}
      </div>
    );
  };
export default Persons;