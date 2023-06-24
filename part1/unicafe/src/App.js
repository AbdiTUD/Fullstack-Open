import { useState } from 'react'

const Button = ({handler,text}) => (
  <button onClick={handler}>{text}</button>
)

const Statistics = ({good,neutral,bad}) => {
  const all = good+bad+neutral;
  const avg = ((good*1+neutral*0+bad*-1)/all).toFixed(1)
  const positive = ((good / all) * 100).toFixed(1)

  if (all ===0){
    return <div>No feedback given</div>
  }
  return (
    <table>
      <tbody>
        <StatisticLine text ="good" value={good} />
        <StatisticLine text ="neutral" value={neutral} />
        <StatisticLine text ="bad" value={bad} />
        <StatisticLine text ="all" value={all} />
        <StatisticLine text ="average" value={avg} />
        <StatisticLine text ="positive" value={positive + '%'} />



      </tbody>
    </table>
  )
}

const StatisticLine = ({text,value}) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handler={() => setGood(good+1)} text="good"/>
      <Button handler={() => setNeutral(neutral+1)} text="neutral"/>
      <Button handler={() => setBad(bad+1)} text="bad"/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App