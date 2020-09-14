import React, { useState } from 'react';

function LessText({ text, maxLength }) {
  // 创建一个状态，并将其初始化为“true”
  const [hidden, setHidden] = useState(true);


  if (text <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {hidden ? `${text.substr(0, maxLength).trim()} ...` : text}
      {hidden ? (
        <a onClick={() => setHidden(false)}> read more</a>
      ) : (
          <a onClick={() => setHidden(true)}> read less</a>
        )}
    </span>
  );
}

export default LessText;