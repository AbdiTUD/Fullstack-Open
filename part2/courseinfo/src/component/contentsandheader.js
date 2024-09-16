import React from 'react';

const Parts = ({ part, exc }) => (
  <p>
    {part} {exc}
  </p>
);

const Content = ({ parts }) => {
    const calc = parts.reduce((sum, part) => sum + part.exercises, 0);
  
    return (
      <div>
        {parts.map((i) => (
          <Parts key={i.id} part={i.name} exc={i.exercises} />
        ))}
        <p><strong>Total of {calc} exercises</strong></p>
      </div>
    );
  };
const Header = ({ course }) => <h1>{course}</h1>;

const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
  </div>
);

export default Course;
