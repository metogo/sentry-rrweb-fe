import React, { useState } from 'react';

function StepTracker() {
  // eslint-disable-next-line
  const [steps, setSteps] = useState(0);

  function increment() {
    // eslint-disable-next-line
    throw '11122aaa333'
    // setSteps(steps => steps + 1);
  }

  return (
    <div>
      总共走了 {steps} 步!
      <br />
      <button onClick={increment}>
        点点我，步数不是个事！
      </button>
    </div>
  );
}

export default StepTracker