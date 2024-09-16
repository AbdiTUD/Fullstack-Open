import { useState, useEffect } from 'react'
import Filter from './components/Filter';
import Persons from './components/Persons';
import FormSaver from './components/FormSaver';
import ServiceP from './services/persons';
import './index.css';

const App = () => {
  const [persons, setPersons] = useState([]) 
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('');

  const [notification, setNotification] = useState({ message: '', type: '' });
  
  const Notification = ({ message, type }) => {
    return (
      <div className={`notification ${type}`}>
        {message}
      </div>
    );
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000); 
  };


  
  useEffect(() => {
    ServiceP
      .getAll()
        .then(persons => {
        setPersons(persons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault();
    const person = {
      name: newName,number: newNumber
    };
    const personChcker = persons.find(p => p.name ===newName);
    if (personChcker) {
      if (window.confirm('${newname} is already added to phonebook, replace the old number with a new one?')){
        ServiceP
          .update(personChcker.id, person)
          .then(retPerson => {
            setPersons(persons.map(p => p.id !== retPerson.id ? p : retPerson));
            setNewName('');
            setNewNumber('');
          })
          .catch(e => {
            console.error(e)
            alert('failed to add new number');
          });
      }else{
        console.log('user did not update')
      }
    }else{
        

      ServiceP.create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
        })
        .catch(error => console.error('Error saving person:', error));
      }
      showNotification(`Added ${newName}`, 'success');
    };



  const deletePerson = (id) => {
    const personToDelete = persons.find(n => n.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      ServiceP
        .remove(id)
        .then(() => {
          setPersons(persons.filter(n => n.id !== id));
        })
        .catch(error => {
          console.error(error);
          alert('Deletion failed');
        });
    }
    showNotification(`Information of ${personToDelete.name} was already removed from the servers!`, 'successdeletion');
  };

  //filtteröi jengi
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  //löydä jos kirjoitettu pienellä/isolla
  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div>

      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <FormSaver
      addName={addName}
      newName={newName}
      setNewName={setNewName}
      newNumber={newNumber}
      setNewNumber={setNewNumber}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
      </div>
  );
  
};
export default App