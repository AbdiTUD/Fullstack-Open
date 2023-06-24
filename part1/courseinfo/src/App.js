const Header = (props) => {
  return(
    <div>
    <h1>{props.course}</h1>
  </div>
  )
}

const Part = (props) => {
  return(
    <div>
      <p> {props.name} {props.ex}</p>
    </div>
  )
}


const Content = (props) => {
  console.log(props)
  return(
    <div>
      <Part name = {props.course} ex={props.exc}  />
      <Part name = {props.course2} ex={props.exc2} />
      <Part name = {props.course3} ex={props.exc3} />
    </div>
  )

}

const Total = (props) => {
  return(
    <div>
    <p>{props.ex + props.ex2 + props.ex3}</p>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  return (
    <div>
      <Header course = {course.name} />
      <Content course = {course.parts[0].name} exc= {course.parts[0].exercises}
      course2 = {course.parts[1].name} exc2= {course.parts[1].exercises}
      course3 = {course.parts[2].name} exc3= {course.parts[2].exercises}  />
      <Total ex = {course.parts[0].exercises} ex2 = {course.parts[1].exercises} ex3 = {course.parts[2].exercises}/>
    
    </div>
  )
}

export default App