import { Card } from '@material-ui/core';
import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { CreateLink } from './create-link';
import { Redirector } from './redirector';
import { completeEmailLinkSignIn } from './firebase';

const Application: React.SFC<{}> = () => {
  useEffect(() => {
    completeEmailLinkSignIn();
  });
  let page: JSX.Element;
  if (window.location.pathname.startsWith('/l/')) {
    page = <Redirector />;
  } else {
    page = <CreateLink />;
  }

  return (
    <div className="main">
      <Card>{page}</Card>
    </div>
  );
};

render(<Application />, document.getElementById('root'));
