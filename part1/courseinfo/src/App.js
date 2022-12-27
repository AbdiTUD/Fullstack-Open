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
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course = {course} />
      <Content course = {part1} exc= {exercises1}
      course2 = {part2} exc2= {exercises2}
      course3 = {part3} exc3= {exercises3}  />
      <Total ex = {exercises1} ex2 = {exercises2} ex3 = {exercises3}/>
    
    </div>
  )
}

export default App